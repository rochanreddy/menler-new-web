/**
 * Dialling codes offered by every form that verifies a phone number.
 *
 * India first (the default and the large majority), then the countries with the
 * biggest Indian tech diaspora, then the rest alphabetically. Only +91 gets an
 * SMS code — everyone else is verified by email — so this list is really about
 * capturing the right dialling code on the lead, not about routing.
 *
 * Canada shares +1 with the US: both are listed because people look for their
 * own country, and either selection stores the same, correct code.
 *
 * Lives here rather than in a page because the campaign landing pages and the
 * fellowship apply form both ask this, and a second copy is how the two drift.
 */
export const COUNTRY_CODES = [
  { code: '+91', label: 'IN +91' },

  { code: '+1', label: 'US +1' },
  { code: '+1', label: 'CA +1' },
  { code: '+44', label: 'UK +44' },
  { code: '+971', label: 'AE +971' },
  { code: '+65', label: 'SG +65' },
  { code: '+61', label: 'AU +61' },
  { code: '+49', label: 'DE +49' },
  { code: '+966', label: 'SA +966' },
  { code: '+974', label: 'QA +974' },

  { code: '+880', label: 'BD +880' },
  { code: '+973', label: 'BH +973' },
  { code: '+32', label: 'BE +32' },
  { code: '+55', label: 'BR +55' },
  { code: '+86', label: 'CN +86' },
  { code: '+45', label: 'DK +45' },
  { code: '+20', label: 'EG +20' },
  { code: '+358', label: 'FI +358' },
  { code: '+33', label: 'FR +33' },
  { code: '+852', label: 'HK +852' },
  { code: '+62', label: 'ID +62' },
  { code: '+353', label: 'IE +353' },
  { code: '+972', label: 'IL +972' },
  { code: '+39', label: 'IT +39' },
  { code: '+81', label: 'JP +81' },
  { code: '+254', label: 'KE +254' },
  { code: '+965', label: 'KW +965' },
  { code: '+60', label: 'MY +60' },
  { code: '+52', label: 'MX +52' },
  { code: '+977', label: 'NP +977' },
  { code: '+31', label: 'NL +31' },
  { code: '+64', label: 'NZ +64' },
  { code: '+234', label: 'NG +234' },
  { code: '+47', label: 'NO +47' },
  { code: '+968', label: 'OM +968' },
  { code: '+92', label: 'PK +92' },
  { code: '+63', label: 'PH +63' },
  { code: '+48', label: 'PL +48' },
  { code: '+351', label: 'PT +351' },
  { code: '+7', label: 'RU +7' },
  { code: '+27', label: 'ZA +27' },
  { code: '+82', label: 'KR +82' },
  { code: '+34', label: 'ES +34' },
  { code: '+94', label: 'LK +94' },
  { code: '+46', label: 'SE +46' },
  { code: '+41', label: 'CH +41' },
  { code: '+66', label: 'TH +66' },
  { code: '+90', label: 'TR +90' },
  { code: '+84', label: 'VN +84' },
];
