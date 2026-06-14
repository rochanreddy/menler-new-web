// In-site policy content (rendered as text, not embedded PDFs).
// Block types: { p } paragraph · { sub } sub-heading · { ul: [...] } bullet list.

export const POLICIES = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: 10 June 2026',
    intro:
      "Menler Learning Systems Private Limited respects your privacy and is committed to protecting your personal information. This Policy explains how we collect, use, store, and protect information when you access our website, programs, learning platforms, communities, certifications, and related services. This Policy is governed in accordance with the Digital Personal Data Protection Act, 2023 and applicable rules thereunder. By using Menler's services, you agree to this Privacy Policy.",
    sections: [
      {
        h: '1. Information We Collect',
        body: [
          { sub: 'Personal Information' },
          { ul: ['Name', 'Email address', 'Mobile number', 'Date of birth', 'Educational & employment information', 'LinkedIn profile', 'Resume / CV', 'City, state, and country'] },
          { sub: 'Learning Information' },
          { ul: ['Program enrollments', 'Attendance records', 'Assessment results', 'Assignment submissions', 'Certification status', 'Learning progress'] },
          { sub: 'Technical Information' },
          { ul: ['IP address', 'Browser and device information', 'Website usage data', 'Cookies and analytics information'] },
          { sub: 'Payment Information' },
          { p: 'Payments are processed through authorised third-party payment providers. Menler does not store complete card details, banking credentials, or payment passwords.' },
        ],
      },
      {
        h: '2. How We Use Your Information',
        body: [
          { ul: ['Deliver educational programs and services', 'Create and manage learner accounts', 'Process payments and enrollments', 'Provide mentorship and learner support', 'Conduct assessments and issue certifications', 'Facilitate interview preparation and career support', 'Improve our platform, content, and services', 'Communicate important updates and announcements', 'Comply with legal and regulatory obligations'] },
        ],
      },
      {
        h: '3. Sharing of Information',
        body: [
          { p: 'We do not sell personal information. We may share information with:' },
          { ul: ['Learning management and technology service providers', 'Payment processors and financing partners', 'Mentors, instructors, and evaluators', 'Hiring partners and employers (with learner consent)', 'Government authorities or legal bodies where required by law'] },
          { p: 'Menler does not guarantee employment, interviews, internships, or placement outcomes.' },
        ],
      },
      {
        h: '4. Cross-Border Data Transfers',
        body: [{ p: 'Your personal data may be processed or stored outside India by our technology partners, including cloud infrastructure and SaaS service providers. Menler ensures that appropriate safeguards are in place for any such international data transfers, in accordance with applicable law.' }],
      },
      {
        h: '5. Cookies',
        body: [{ p: 'We use cookies and similar technologies to improve platform functionality, understand user behaviour, and enhance user experience. You may disable cookies through your browser settings; however, certain features may not function properly.' }],
      },
      {
        h: '6. Data Retention & Security',
        body: [{ p: 'We retain personal data for a period of five (5) years from the date of last activity, or as required by applicable law, whichever is longer. Menler implements industry-standard technical and organisational safeguards to protect personal information. No system is completely immune to security breaches. In the event of a breach affecting your data, Menler will notify you as required by applicable law.' }],
      },
      {
        h: '7. Your Rights',
        body: [
          { ul: ['Access your personal information', 'Correct inaccurate information', 'Update your profile', 'Delete your account (subject to legal and operational requirements)', 'Opt out of marketing communications'] },
          { p: 'You may also withdraw consent at any time by writing to support@menler.in. Withdrawal of consent may affect your ability to access certain services.' },
        ],
      },
      {
        h: '8. Grievance Officer',
        body: [
          { p: 'In accordance with applicable Indian data protection laws, Menler has designated a Grievance Officer to address concerns regarding the processing of personal data. Grievances may be submitted to:' },
          { ul: ['Grievance Officer — Menler Learning Systems Private Limited', 'Email: support@menler.in', 'Response timeline: within 30 days of receipt of grievance'] },
        ],
      },
      {
        h: "9. Children's Privacy",
        body: [{ p: 'Our services are intended for individuals aged 16 years and above. Users below 18 years must obtain verifiable parental or guardian consent prior to enrolment. Menler reserves the right to terminate access if this requirement is not met.' }],
      },
      {
        h: '10. Third-Party Services',
        body: [{ p: 'Our website and platform may contain links to third-party websites or services. Menler is not responsible for their privacy practices, content, or policies.' }],
      },
      {
        h: '11. Changes to This Policy',
        body: [{ p: 'Menler reserves the right to update this Policy. Continued use of services after the updated Policy is published constitutes acceptance of the revised terms. Updated versions will be published on our website with a revised effective date.' }],
      },
      {
        h: '12. Contact Us',
        body: [{ ul: ['Menler Learning Systems Private Limited', 'Website: menler.in', 'Email: support@menler.in'] }],
      },
      {
        h: 'Consent',
        body: [{ p: 'By accessing, registering for, purchasing, or using any Menler service, you consent to the collection, use, storage, and processing of your information as described in this Privacy Policy.' }],
      },
    ],
  },

  refund: {
    title: 'Refund Policy',
    updated: 'Last updated: 10 June 2026',
    intro:
      'Menler is committed to delivering a high-quality learning experience through mentor-led programs, live cohorts, workshops, and certifications. By enrolling in any Menler program, you acknowledge and agree to this Refund Policy.',
    sections: [
      {
        h: '1. Programs Covered',
        body: [{ ul: ['AI Fellowship Programs', 'AI Kickstarter Programs', 'Live Cohorts', 'Workshops', 'Self-Paced Courses'] }],
      },
      {
        h: '2. AI Fellowship Programs',
        body: [
          { p: 'Learners may request a refund within 5 calendar days of the date of enrollment confirmation. Refunds shall only be considered if:' },
          { ul: ['The request is submitted within the 5-calendar-day refund window; and', 'Menler has failed to provide access to the program, onboarding, learning platform, or scheduled training sessions.'] },
          { p: 'For the purposes of this Policy, access is deemed granted upon issuance of login credentials, onboarding email, or sharing of learning materials, whichever occurs first.' },
          { p: 'No refund shall be granted on grounds including:' },
          { ul: ['Change of mind', 'Lack of time or availability', 'Personal, academic, or professional commitments', 'Dissatisfaction with content, mentor, teaching style, or learning outcomes', 'Failure to attend live sessions', 'Non-completion of assignments or projects'] },
        ],
      },
      {
        h: '3. AI Kickstarter Programs',
        body: [{ p: 'All AI Kickstarter Program enrollments are final and non-refundable. No refund request shall be entertained after enrollment, irrespective of attendance, participation, or program completion.' }],
      },
      {
        h: '4. Self-Paced Courses, Workshops & Live Cohorts',
        body: [{ p: 'Fees paid for self-paced courses, workshops, and live cohorts are non-refundable once access to the course or learning materials has been granted. No partial refunds shall be issued for mid-program withdrawals or discontinuation.' }],
      },
      {
        h: '5. Non-Refundable Items',
        body: [
          { p: 'The following are strictly non-refundable:' },
          { ul: ['Registration fees', 'Processing fees', 'GST and applicable taxes', 'Digital learning materials', 'Templates, toolkits, and prompt libraries', 'Certification fees', 'Third-party software or AI tool costs', 'Application fees'] },
        ],
      },
      {
        h: '6. EMI & NBFC Financing',
        body: [{ ul: ['Approved refunds, if any, shall be processed as per the financing arrangement.', 'Interest, processing charges, and lender fees may not be refundable.', 'Menler bears no liability for any fees, interest, or charges levied by financing or EMI partners, irrespective of the refund outcome.'] }],
      },
      {
        h: '7. Cancellation by Menler',
        body: [
          { p: 'If Menler cancels a program before commencement and is unable to provide an alternative batch, learners shall be eligible for:' },
          { ul: ['A full refund; or', 'Transfer to a future batch.'] },
          { p: 'In the event Menler is unable to deliver a program due to circumstances beyond its reasonable control (including but not limited to natural disasters, government action, platform outages, or internet failures), Menler shall offer a batch transfer. A refund shall be considered at Menler\'s sole discretion.' },
        ],
      },
      {
        h: '8. Refund Processing',
        body: [{ p: 'Approved refunds shall be processed within 15–30 business days from the date of approval. Refunds shall be credited to the original payment instrument. Where this is not possible, an alternative method shall be mutually agreed upon.' }],
      },
      {
        h: '9. Dispute Resolution',
        body: [{ p: 'Any disputes regarding refund decisions shall be subject to the governing law and jurisdiction as set out in Menler\'s Terms & Conditions. The parties shall first attempt resolution through good-faith negotiation before initiating formal proceedings.' }],
      },
      {
        h: '10. Contact',
        body: [{ p: 'For refund-related requests, please write to support@menler.in. All refund requests must be submitted from the registered email address used during enrollment.' }],
      },
      {
        h: '11. Final Decision',
        body: [{ p: 'All refund requests are reviewed individually. Menler\'s decision shall be final, conclusive, and binding on the learner.' }],
      },
    ],
  },

  terms: {
    title: 'Terms & Conditions',
    updated: 'Last updated: 10 June 2026',
    intro:
      'By accessing, registering, purchasing, or participating in any Menler program, platform, event, or community, you agree to these Terms & Conditions, our Privacy Policy, and Refund Policy. If you do not agree with these Terms, please do not use our services.',
    sections: [
      {
        h: '1. Eligibility & Account Responsibility',
        body: [
          { p: 'To use Menler\'s services, you must:' },
          { ul: ['Be at least 16 years of age.', 'Provide accurate and complete information.', 'Maintain the confidentiality of your account credentials.'] },
          { p: 'You are responsible for all activity conducted through your account.' },
        ],
      },
      {
        h: '2. Programs & Payments',
        body: [
          { p: 'Menler provides:' },
          { ul: ['AI Fellowship Programs', 'AI Kickstarter Programs', 'Workshops', 'Live Cohorts', 'Self-Paced Courses', 'Certifications', 'Community Access', 'Interview Preparation Support'] },
          { p: 'Program fees may be paid through full payment, EMI, or approved financing partners. Failure to complete payment obligations may result in suspension of access to classes, communities, certifications, and other services. Refunds are governed solely by Menler\'s Refund Policy.' },
        ],
      },
      {
        h: '3. Program Delivery',
        body: [
          { p: 'Programs are delivered through mentor-led sessions, assignments, projects, workshops, community interactions, and digital learning platforms. Menler reserves the right to:' },
          { ul: ['Modify schedules', 'Reschedule sessions', 'Update curriculum', 'Replace mentors', 'Improve program structure and content'] },
          { p: 'Menler shall endeavour to provide reasonable advance notice of material changes where practicable. Such modifications shall not entitle the learner to cancellation, refund, or any other remedy.' },
        ],
      },
      {
        h: '4. Intellectual Property',
        body: [{ p: 'All content provided by Menler, including curriculum, recordings, projects, templates, prompt libraries, assessments, certifications, and learning resources, is the intellectual property of Menler or its licensors. You may not copy, distribute, record, or reproduce this content without prior written permission.' }],
      },
      {
        h: '5. Learner Conduct & Academic Integrity',
        body: [
          { p: 'Learners are expected to maintain professional and respectful conduct. You agree not to:' },
          { ul: ['Harass mentors, staff, hiring partners, or fellow learners', 'Share access credentials', 'Share proprietary learning materials externally', 'Impersonate another person', 'Engage in plagiarism, cheating, or fraudulent activity', 'Use AI tools to generate, fabricate, or misrepresent submitted assignments, projects, or assessments without disclosure — which shall constitute academic fraud'] },
          { p: 'Menler may review assignments, projects, and assessments for originality and may request demonstrations or explanations of submitted work. Violation of these standards may result in suspension, termination, removal from communities, withholding of certificates, or revocation of certifications without refund.' },
        ],
      },
      {
        h: '6. Certifications',
        body: [{ p: 'Certificates may be awarded based on attendance, assessments, assignments, projects, and participation requirements. Menler reserves the right to withhold, suspend, or revoke certifications in cases of misconduct, plagiarism, fraud, or violation of these Terms.' }],
      },
      {
        h: '7. Career Support Disclaimer',
        body: [
          { p: 'Menler may provide interview preparation, resume reviews, networking opportunities, and employer introductions. All career support services do not constitute a guarantee or representation of employment. Menler does not guarantee:' },
          { ul: ['Employment', 'Internships', 'Interviews', 'Freelance opportunities', 'Salary outcomes', 'Career advancement'] },
          { p: 'All hiring decisions rest exclusively with employers and hiring partners.' },
        ],
      },
      {
        h: '8. Third-Party Services',
        body: [{ p: 'Menler may use third-party platforms, software, payment gateways, communication tools, and learning technologies. Menler is not responsible for the availability, security, or policies of such third-party services.' }],
      },
      {
        h: '9. Limitation of Liability',
        body: [{ p: 'To the maximum extent permitted by law, Menler shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of its services. Menler\'s total liability shall not exceed the fees paid by the learner for the specific program in the six (6) months preceding the claim.' }],
      },
      {
        h: '10. Indemnification',
        body: [{ p: 'Learners agree to indemnify and hold harmless Menler, its directors, employees, mentors, and partners from any claims, losses, liabilities, damages, or expenses (including legal fees) arising from the learner\'s violation of these Terms, misuse of Menler\'s platform, or any unlawful act or omission by the learner.' }],
      },
      {
        h: '11. Force Majeure',
        body: [{ p: 'Menler shall not be liable for delays or non-performance caused by events beyond its reasonable control, including but not limited to natural disasters, government action, regulatory intervention, platform outages, or internet failures. In such circumstances, Menler shall endeavour to provide an alternative batch or a suitable remedy at its discretion.' }],
      },
      {
        h: '12. Suspension & Termination',
        body: [
          { p: 'Menler reserves the right to immediately suspend or permanently terminate access to its services if:' },
          { ul: ['These Terms are violated', 'Fraudulent activity is detected', 'Payment obligations are not fulfilled', 'User conduct negatively impacts the learning environment'] },
          { p: 'Termination may occur without refund where permitted under applicable law.' },
        ],
      },
      {
        h: '13. Dispute Resolution',
        body: [{ p: 'In the event of any dispute arising out of or in connection with these Terms, the parties shall first attempt resolution through good-faith negotiation within 30 days of the dispute arising. If unresolved, disputes shall be referred to arbitration under the Arbitration and Conciliation Act, 1996, with a sole arbitrator appointed by mutual agreement, seated in Bengaluru, Karnataka.' }],
      },
      {
        h: '14. Governing Law',
        body: [{ p: 'These Terms shall be governed by the laws of India. Subject to the dispute resolution clause above, any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka.' }],
      },
      {
        h: '15. Severability',
        body: [{ p: 'If any provision of these Terms is found to be invalid, illegal, or unenforceable under applicable law, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it enforceable.' }],
      },
    ],
  },
};
