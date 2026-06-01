import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import { supabase } from '../lib/supabase';

const DEGREES = [
  'B.Tech / B.E.', 'BCA', 'BBA', 'B.Com', 'B.Sc', 'BA',
  'MBA', 'M.Tech', 'MCA', 'M.Sc', 'MA', 'Ph.D', 'Diploma', 'Other',
];
const YEARS = Array.from({ length: 31 }, (_, i) => String(2000 + i));

export default function Dashboard() {
  const [profile, setProfile] = useState({
    fullName: '',
    contact: '',
    email: '',
    degree: '',
    fieldOfStudy: '',
    passoutYear: '',
    collegeName: '',
    currentlyStudying: false,
    designation: '',
    companyName: '',
    location: '',
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) { navigate('/register'); return; }
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data) {
        setProfile({
          fullName: data.full_name || '',
          contact: data.contact || '',
          email: user.email || '',
          degree: data.degree || '',
          fieldOfStudy: data.field_of_study || '',
          passoutYear: data.passout_year || '',
          collegeName: data.college_name || '',
          currentlyStudying: data.currently_studying || false,
          designation: data.designation || '',
          companyName: data.company_name || '',
          location: data.location || '',
        });
      } else {
        setProfile(p => ({ ...p, email: user.email || '' }));
      }
    };
    loadProfile();
  }, []);

  const set = (k, v) => {
    setProfile(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!profile.fullName.trim()) e.fullName = 'Required';
    if (!profile.contact.trim()) e.contact = 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) e.email = 'Enter a valid email';
    if (!profile.degree) e.degree = 'Required';
    if (!profile.fieldOfStudy.trim()) e.fieldOfStudy = 'Required';
    if (!profile.passoutYear) e.passoutYear = 'Required';
    if (!profile.collegeName.trim()) e.collegeName = 'Required';
    if (!profile.currentlyStudying) {
      if (!profile.designation.trim()) e.designation = 'Required';
      if (!profile.companyName.trim()) e.companyName = 'Required';
    }
    if (!profile.location.trim()) e.location = 'Required';
    return e;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: profile.fullName,
        contact: profile.contact,
        degree: profile.degree,
        field_of_study: profile.fieldOfStudy,
        passout_year: profile.passoutYear,
        college_name: profile.collegeName,
        currently_studying: profile.currentlyStudying,
        designation: profile.designation,
        company_name: profile.companyName,
        location: profile.location,
        updated_at: new Date().toISOString(),
      });
      if (error) { alert('Error saving profile: ' + error.message); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const initials = profile.fullName
    ? profile.fullName.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'ME';

  return (
    <>
      <div className="dash-page">
        <div className="dash-inner">

          {/* ── HEADER ── */}
          <div className="dash-header">
            <div className="dash-avatar">{initials}</div>
            <div>
              <h1 className="dash-welcome">
                {profile.fullName ? `Hi, ${profile.fullName.trim().split(' ')[0]}.` : 'Your profile.'}
              </h1>
              <p className="dash-welcome-sub">Keep your details up to date.</p>
            </div>
            <button className="dash-logout" onClick={handleLogout}>Log out</button>
          </div>

          {/* ── PROFILE CARD ── */}
          <div className="dash-card">
            <p className="dash-section-title">Profile</p>

            <form onSubmit={handleSave} noValidate>

              {/* Personal */}
              <p className="dash-sub-label">Personal</p>
              <div className="dash-grid">
                <div className={`dash-field${errors.fullName ? ' has-error' : ''}`}>
                  <label htmlFor="d-name">Full Name <span className="req">*</span></label>
                  <input
                    id="d-name"
                    type="text"
                    placeholder="Priya Sharma"
                    value={profile.fullName}
                    onChange={e => set('fullName', e.target.value)}
                  />
                  {errors.fullName && <span className="field-err">{errors.fullName}</span>}
                </div>

                <div className={`dash-field${errors.contact ? ' has-error' : ''}`}>
                  <label htmlFor="d-contact">Contact <span className="req">*</span></label>
                  <input
                    id="d-contact"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={profile.contact}
                    onChange={e => set('contact', e.target.value)}
                  />
                  {errors.contact && <span className="field-err">{errors.contact}</span>}
                </div>

                <div className={`dash-field${errors.email ? ' has-error' : ''}`} style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="d-email">Email <span className="req">*</span></label>
                  <input
                    id="d-email"
                    type="email"
                    placeholder="priya@example.com"
                    value={profile.email}
                    onChange={e => set('email', e.target.value)}
                  />
                  {errors.email && <span className="field-err">{errors.email}</span>}
                </div>
              </div>

              <div className="dash-divider" />

              {/* Education */}
              <p className="dash-sub-label">Education</p>
              <div className="dash-grid">
                <div className={`dash-field${errors.degree ? ' has-error' : ''}`}>
                  <label htmlFor="d-degree">Degree <span className="req">*</span></label>
                  <select id="d-degree" value={profile.degree} onChange={e => set('degree', e.target.value)}>
                    <option value="">Select degree</option>
                    {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.degree && <span className="field-err">{errors.degree}</span>}
                </div>

                <div className={`dash-field${errors.fieldOfStudy ? ' has-error' : ''}`}>
                  <label htmlFor="d-fos">Field of Study <span className="req">*</span></label>
                  <input
                    id="d-fos"
                    type="text"
                    placeholder="Computer Science"
                    value={profile.fieldOfStudy}
                    onChange={e => set('fieldOfStudy', e.target.value)}
                  />
                  {errors.fieldOfStudy && <span className="field-err">{errors.fieldOfStudy}</span>}
                </div>

                <div className={`dash-field${errors.passoutYear ? ' has-error' : ''}`}>
                  <label htmlFor="d-year">Passout Year <span className="req">*</span></label>
                  <select id="d-year" value={profile.passoutYear} onChange={e => set('passoutYear', e.target.value)}>
                    <option value="">Select year</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  {errors.passoutYear && <span className="field-err">{errors.passoutYear}</span>}
                </div>

                <div className={`dash-field${errors.collegeName ? ' has-error' : ''}`}>
                  <label htmlFor="d-college">College Name <span className="req">*</span></label>
                  <input
                    id="d-college"
                    type="text"
                    placeholder="IIT Bombay"
                    value={profile.collegeName}
                    onChange={e => set('collegeName', e.target.value)}
                  />
                  {errors.collegeName && <span className="field-err">{errors.collegeName}</span>}
                </div>
              </div>

              {/* Currently studying checkbox */}
              <div className="dash-checkbox-row">
                <label className="dash-check-label">
                  <input
                    type="checkbox"
                    checked={profile.currentlyStudying}
                    onChange={e => {
                      set('currentlyStudying', e.target.checked);
                      if (e.target.checked) {
                        set('designation', '');
                        set('companyName', '');
                      }
                    }}
                  />
                  <span>Currently studying</span>
                </label>
              </div>

              <div className="dash-divider" />

              {/* Work */}
              <p className="dash-sub-label">
                Work
                {profile.currentlyStudying && (
                  <span className="dash-optional-badge">Optional</span>
                )}
              </p>
              <div className={`dash-grid${profile.currentlyStudying ? ' dash-optional-section' : ''}`}>
                <div className={`dash-field${errors.designation ? ' has-error' : ''}`}>
                  <label htmlFor="d-desig">
                    Designation
                    {profile.currentlyStudying
                      ? <span className="dash-opt-tag"> (optional)</span>
                      : <span className="req"> *</span>}
                  </label>
                  <input
                    id="d-desig"
                    type="text"
                    placeholder="Software Engineer"
                    value={profile.designation}
                    onChange={e => set('designation', e.target.value)}
                    tabIndex={profile.currentlyStudying ? -1 : 0}
                  />
                  {errors.designation && <span className="field-err">{errors.designation}</span>}
                </div>

                <div className={`dash-field${errors.companyName ? ' has-error' : ''}`}>
                  <label htmlFor="d-company">
                    Company Name
                    {profile.currentlyStudying
                      ? <span className="dash-opt-tag"> (optional)</span>
                      : <span className="req"> *</span>}
                  </label>
                  <input
                    id="d-company"
                    type="text"
                    placeholder="Acme Corp"
                    value={profile.companyName}
                    onChange={e => set('companyName', e.target.value)}
                    tabIndex={profile.currentlyStudying ? -1 : 0}
                  />
                  {errors.companyName && <span className="field-err">{errors.companyName}</span>}
                </div>
              </div>

              <div className="dash-divider" />

              {/* Location */}
              <p className="dash-sub-label">Location</p>
              <div className="dash-grid">
                <div className={`dash-field${errors.location ? ' has-error' : ''}`}>
                  <label htmlFor="d-location">Location <span className="req">*</span></label>
                  <input
                    id="d-location"
                    type="text"
                    placeholder="Bengaluru, India"
                    value={profile.location}
                    onChange={e => set('location', e.target.value)}
                  />
                  {errors.location && <span className="field-err">{errors.location}</span>}
                </div>
              </div>

              {/* Footer */}
              <div className="dash-form-footer">
                {saved && <span className="dash-saved">✓ Profile saved</span>}
                <button type="submit" className="auth-btn" style={{ width: 'auto', padding: '12px 32px' }} disabled={saving}>
                  {saving ? 'Saving…' : 'Save profile →'}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
