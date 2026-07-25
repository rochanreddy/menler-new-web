/**
 * Amplifeed OTP Embed — amplifeed-otp.js
 *
 * Self-contained vanilla JS snippet that renders a lead-capture form with
 * MSG91 OTP verification directly on any HTML page.
 *
 * Usage:
 *   <div id="amplifeed-form"
 *     data-source-key="sk_..."
 *     data-secret="sec_..."
 *     data-widget-id="WIDGET_ID"
 *     data-token-auth="TOKEN_AUTH"
 *     data-channels="sms,whatsapp,email"
 *     data-fields="name,phone,email">
 *   </div>
 *   <script src="https://yourapp.com/embed/amplifeed-otp.js"></script>
 *
 * data-channels: comma-separated list; first channel is used for OTP
 * data-fields:   comma-separated field names to render as text inputs
 *
 * On success: POSTs to /api/lead-sources/inbound/{sourceKey} with
 *   X-Webhook-Secret header, form fields, otp_token, otp_channel, otp_identifier
 */
;(function () {
  var MSG91_SCRIPT_URLS = [
    'https://verify.msg91.com/otp-provider.js',
    'https://verify.phone91.com/otp-provider.js',
  ]

  // ── Find container ────────────────────────────────────────────────────────
  var container = document.getElementById('amplifeed-form')
  if (!container) return

  var sourceKey   = container.getAttribute('data-source-key') || ''
  var secret      = container.getAttribute('data-secret') || ''
  var widgetId    = container.getAttribute('data-widget-id') || ''
  var tokenAuth   = container.getAttribute('data-token-auth') || ''
  var channelsRaw = container.getAttribute('data-channels') || 'sms'
  var fieldsRaw   = container.getAttribute('data-fields') || 'name,phone,email'

  var channels = channelsRaw.split(',').map(function (c) { return c.trim() }).filter(Boolean)
  var fields   = fieldsRaw.split(',').map(function (f) { return f.trim() }).filter(Boolean)
  var primaryChannel = channels[0] || 'sms'

  // Resolve the Amplifeed base URL. For embedded sites this must be absolute so
  // the form POSTs to Amplifeed instead of the host page. data-base on the
  // script tag wins; otherwise derive from the script src itself.
  var script = document.currentScript
  var baseUrl =
    (script &&
      (script.getAttribute('data-base') ||
        script.src.replace(/\/embed\/amplifeed-otp\.js.*$/, ''))) ||
    ''

  if (!sourceKey) {
    container.innerHTML = '<p style="color:#dc2626;font-family:sans-serif;">amplifeed-form: data-source-key is required.</p>'
    return
  }

  // ── State ─────────────────────────────────────────────────────────────────
  var otpToken      = ''
  var otpChannel    = ''
  var otpIdentifier = ''
  var otpVerified   = false
  var cooldownTimer = null
  var cooldownSecs  = 0

  // ── Style helpers ─────────────────────────────────────────────────────────
  var S = {
    wrap: [
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
      'font-size:15px',
      'color:#111827',
      'max-width:440px',
      'padding:24px',
      'border:1px solid #e5e7eb',
      'border-radius:10px',
      'background:#fff',
      'box-sizing:border-box',
    ].join(';'),

    label: 'display:block;margin-bottom:4px;font-weight:500;font-size:0.875rem;color:#374151;',

    input: [
      'display:block',
      'width:100%',
      'box-sizing:border-box',
      'padding:10px 12px',
      'border:1px solid #d1d5db',
      'border-radius:6px',
      'font-size:1rem',
      'line-height:1.4',
      'margin-bottom:14px',
      'outline:none',
      'transition:border-color .15s',
    ].join(';'),

    btn: [
      'display:block',
      'width:100%',
      'min-height:44px',
      'padding:0 16px',
      'background:#2563eb',
      'color:#fff',
      'border:none',
      'border-radius:6px',
      'font-size:1rem',
      'font-weight:500',
      'cursor:pointer',
      'margin-top:4px',
      'transition:opacity .15s',
    ].join(';'),

    btnDisabled: 'opacity:0.65;cursor:not-allowed;',

    otpWrap: 'margin-top:14px;',

    notice: function (type) {
      var colors = type === 'success'
        ? 'background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0;'
        : 'background:#fee2e2;color:#991b1b;border:1px solid #fca5a5;'
      return 'padding:10px 14px;border-radius:6px;font-size:0.875rem;margin-top:12px;' + colors
    },
  }

  // ── DOM helpers ───────────────────────────────────────────────────────────
  function el(tag, attrs, style, html) {
    var node = document.createElement(tag)
    if (attrs) Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]) })
    if (style) node.style.cssText = style
    if (html !== undefined) node.innerHTML = html
    return node
  }

  function labelFor(name) {
    return name.replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase() })
  }

  // ── Render form ───────────────────────────────────────────────────────────
  var wrap = el('div', {}, S.wrap)

  var inputMap = {} // name → input element

  fields.forEach(function (name) {
    var lbl = el('label', { for: 'af-' + name }, S.label)
    lbl.textContent = labelFor(name)
    wrap.appendChild(lbl)

    var type = name === 'email' ? 'email'
             : name === 'phone' || name === 'mobile' ? 'tel'
             : 'text'
    var inp = el('input', {
      type: type,
      id: 'af-' + name,
      name: name,
      placeholder: labelFor(name),
      autocomplete: name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'off',
    }, S.input)
    inputMap[name] = inp
    wrap.appendChild(inp)
  })

  // OTP section
  var otpWrap = el('div', {}, S.otpWrap)

  var verifyBtn = el('button', { type: 'button' }, S.btn)
  verifyBtn.textContent = 'Verify ' + (primaryChannel === 'email' ? 'email' : 'phone')
  otpWrap.appendChild(verifyBtn)

  var otpStatus = el('p', {}, 'display:none;font-size:0.875rem;margin:8px 0 0;')
  otpWrap.appendChild(otpStatus)

  wrap.appendChild(otpWrap)

  // Submit button (hidden until OTP verified)
  var submitBtn = el('button', { type: 'submit' }, S.btn + 'margin-top:14px;display:none;')
  submitBtn.textContent = 'Submit'
  wrap.appendChild(submitBtn)

  // Notice area
  var notice = el('div', {}, 'display:none;')
  wrap.appendChild(notice)

  container.innerHTML = ''
  container.appendChild(wrap)

  // ── OTP helpers ────────────────────────────────────────────────────────────
  function setOtpStatus(type, msg) {
    otpStatus.style.cssText = 'font-size:0.875rem;margin:8px 0 0;display:block;'
    if (type === 'success') {
      otpStatus.style.color = '#16a34a'
    } else if (type === 'error') {
      otpStatus.style.color = '#dc2626'
    } else {
      otpStatus.style.color = '#6b7280'
    }
    otpStatus.textContent = msg
  }

  function startCooldown() {
    cooldownSecs = 30
    updateVerifyBtn()
    cooldownTimer = setInterval(function () {
      cooldownSecs--
      if (cooldownSecs <= 0) {
        clearInterval(cooldownTimer)
        cooldownTimer = null
        cooldownSecs = 0
      }
      updateVerifyBtn()
    }, 1000)
  }

  function updateVerifyBtn() {
    if (otpVerified) {
      verifyBtn.style.display = 'none'
      return
    }
    if (cooldownSecs > 0) {
      verifyBtn.textContent = 'Resend in ' + cooldownSecs + 's'
      verifyBtn.style.cssText = S.btn + S.btnDisabled
      verifyBtn.disabled = true
    } else {
      var label = primaryChannel === 'email' ? 'email' : 'phone'
      verifyBtn.textContent = 'Verify ' + label
      verifyBtn.style.cssText = S.btn
      verifyBtn.disabled = false
    }
  }

  function getIdentifier() {
    // Prefer phone for sms/whatsapp channels, email otherwise
    if (primaryChannel === 'email') {
      return (inputMap['email'] && inputMap['email'].value.trim()) || ''
    }
    return (inputMap['phone'] && inputMap['phone'].value.trim()) ||
           (inputMap['mobile'] && inputMap['mobile'].value.trim()) || ''
  }

  function launchWidget() {
    var identifier = getIdentifier()
    if (!identifier) {
      setOtpStatus('error', primaryChannel === 'email'
        ? 'Please enter your email address first.'
        : 'Please enter your phone number first.')
      verifyBtn.style.cssText = S.btn
      verifyBtn.disabled = false
      verifyBtn.textContent = 'Verify ' + (primaryChannel === 'email' ? 'email' : 'phone')
      return
    }

    try {
      window.initSendOTP({
        widgetId: widgetId,
        tokenAuth: tokenAuth,
        identifier: identifier,
        success: function (token) {
          otpToken      = token
          otpChannel    = primaryChannel
          otpIdentifier = identifier
          otpVerified   = true
          verifyBtn.style.display = 'none'
          setOtpStatus('success', '✓ Verified')
          submitBtn.style.display = 'block'
        },
        failure: function (err) {
          var msg = typeof err === 'string' ? err
            : (err && err.message) ? err.message
            : (err && err.code === 'insufficient_credits') ? 'Insufficient credits — top up your balance'
            : (err && err.code === 'rate_limited') ? 'Too many attempts — try again shortly'
            : (err && err.code === 'invalid_number') ? 'Invalid number — check and retry'
            : (err && err.code === 'wrong_code') ? 'Wrong code — please try again'
            : (err && err.code === 'expired') ? 'Code expired — request a new one'
            : 'Verification failed'
          setOtpStatus('error', msg)
          verifyBtn.style.cssText = S.btn
          verifyBtn.disabled = false
          verifyBtn.textContent = 'Retry verification'
        },
      })
      startCooldown()
    } catch (e) {
      setOtpStatus('error', 'OTP service unavailable')
      verifyBtn.style.cssText = S.btn
      verifyBtn.disabled = false
      verifyBtn.textContent = 'Retry'
    }
  }

  function loadAndLaunch() {
    if (window.initSendOTP) {
      launchWidget()
      return
    }

    var urlIndex = 0
    function attempt() {
      var url = MSG91_SCRIPT_URLS[urlIndex]

      var existing = document.querySelector('script[src="' + url + '"]')
      if (existing) {
        existing.addEventListener('load', launchWidget)
        existing.addEventListener('error', onError)
        return
      }

      var script = document.createElement('script')
      script.src = url
      script.async = true
      script.onload = launchWidget
      script.onerror = onError
      document.head.appendChild(script)
    }

    function onError() {
      urlIndex++
      if (urlIndex < MSG91_SCRIPT_URLS.length) {
        attempt()
      } else {
        setOtpStatus('error', 'OTP service unavailable')
        verifyBtn.style.cssText = S.btn
        verifyBtn.disabled = false
        verifyBtn.textContent = 'Retry'
      }
    }

    attempt()
  }

  // ── Verify button click ───────────────────────────────────────────────────
  verifyBtn.addEventListener('click', function () {
    if (verifyBtn.disabled) return
    verifyBtn.textContent = 'Sending…'
    verifyBtn.style.cssText = S.btn + S.btnDisabled
    verifyBtn.disabled = true
    setOtpStatus('info', 'Loading verification widget…')
    loadAndLaunch()
  })

  // ── Submit ────────────────────────────────────────────────────────────────
  submitBtn.addEventListener('click', function () {
    if (!otpVerified || !otpToken) {
      showNotice('error', 'Please complete OTP verification before submitting.')
      return
    }

    submitBtn.textContent = 'Submitting…'
    submitBtn.style.cssText = S.btn + S.btnDisabled + 'margin-top:14px;'
    submitBtn.disabled = true

    var payload = {}
    fields.forEach(function (name) {
      if (inputMap[name]) payload[name] = inputMap[name].value.trim()
    })
    payload.otp_token      = otpToken
    payload.otp_channel    = otpChannel
    payload.otp_identifier = otpIdentifier

    // UTM context (best-effort)
    try {
      var url = new URL(window.location.href)
      payload.page_url    = window.location.href
      payload.referrer_url = document.referrer || ''
      ;['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function (k) {
        var v = url.searchParams.get(k)
        if (v) payload[k] = v
      })
    } catch (_) {}

    var endpoint = (baseUrl.replace(/\/$/, '') || '') + '/api/lead-sources/inbound/' + sourceKey

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': secret,
      },
      body: JSON.stringify(payload),
      credentials: 'omit',
    })
      .then(function (res) {
        return res.json().then(function (body) { return { ok: res.ok, status: res.status, body: body } })
      })
      .then(function (res) {
        if (res.ok) {
          showNotice('success', 'Thank you! We received your details.')
          wrap.style.display = 'none'
          notice.style.display = 'block'
        } else {
          var msg = (res.body && res.body.error) || 'Submission failed. Please try again.'
          if (res.status === 401 || (res.body && res.body.error === 'otp_required')) {
            msg = 'Verification required — please verify your ' + (primaryChannel === 'email' ? 'email' : 'phone') + ' first.'
          }
          showNotice('error', msg)
          submitBtn.textContent = 'Submit'
          submitBtn.style.cssText = S.btn + 'margin-top:14px;'
          submitBtn.disabled = false
        }
      })
      .catch(function () {
        showNotice('error', 'Network error — please check your connection and try again.')
        submitBtn.textContent = 'Submit'
        submitBtn.style.cssText = S.btn + 'margin-top:14px;'
        submitBtn.disabled = false
      })
  })

  // ── Notice helper ─────────────────────────────────────────────────────────
  function showNotice(type, msg) {
    notice.style.cssText = S.notice(type)
    notice.textContent = msg
    notice.style.display = 'block'
  }
})()
