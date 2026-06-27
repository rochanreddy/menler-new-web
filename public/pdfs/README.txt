PDFs for the Library page (src/pages/Resources.jsx) and email delivery:

Brochures (program pages + home mini-lead):
  1_updated_Menler AI Kickstarter Brochure_2026.pdf
  Menler_Claude_Gen_brochure.pdf  (Generalist + Engineering until a dedicated eng brochure is added)

Claude Playbook section (PLAYBOOK):
  Menler_Claude_Code_Playbook.pdf
  Menler_Claude_Chat_Playbook.pdf
  Menler_Claude_Cowork_Playbook.pdf
  Menler_Claude_Design_Playbook.pdf
  Menler_Claude_Microsoft_Playbook.pdf

The Menler library section (LIBRARY_CARDS):
  Menler_100_Prompts_Playbook.pdf
  Menler_AI_Stack_Map.pdf
  Menler_Connector_Projects.pdf
  Menler_AI_Glossary_AtoZ.pdf

Question banks live under public/question_banks/ (see Aptitude page).

Email flow: forms call the Menler API; SMTP sends the PDF(s) as email attachments.
The API server reads files from public/pdfs/ and public/question_banks/.
