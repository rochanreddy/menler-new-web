import { useState } from 'react';
import { googleCalendarUrl, outlookCalendarUrl, downloadIcs } from '../../lib/calendar';

// "Add to calendar" control for the confirmation page. Renders a primary
// Google Calendar button (most users) plus an Outlook / Apple menu. No API or
// login — the calendar app then sends the reminders automatically.
export default function AddToCalendar({ event, className = '' }) {
  const [open, setOpen] = useState(false);
  if (!event || !event.start) return null;

  const icsName = `${(event.title || 'event').replace(/[^\w\s-]/g, '').trim().slice(0, 60) || 'event'}.ics`;

  return (
    <div className={`atc ${className}`.trim()}>
      <a
        className="atc-btn atc-btn--google"
        href={googleCalendarUrl(event)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5v5.4l3.8 2.3-.8 1.3L11 13V7h2Z" />
        </svg>
        Add to Google Calendar
      </a>
      <div className="atc-more">
        <button type="button" className="atc-btn atc-btn--ghost" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          Other calendars ▾
        </button>
        {open && (
          <div className="atc-menu" role="menu">
            <a className="atc-menu-item" role="menuitem" href={outlookCalendarUrl(event)} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Outlook</a>
            <button type="button" className="atc-menu-item" role="menuitem" onClick={() => { downloadIcs(event, icsName); setOpen(false); }}>Apple / other (.ics)</button>
          </div>
        )}
      </div>
    </div>
  );
}
