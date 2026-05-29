import { useState } from 'react';

export default function FilterChips({ groups, onFilter }) {
  const [active, setActive] = useState('all');

  const handleClick = (value) => {
    setActive(value);
    onFilter(value);
  };

  return (
    <div className="filter-chips">
      {groups.map(g => (
        <button
          key={g.value}
          className={`filter-chip${active === g.value ? ' on' : ''}`}
          onClick={() => handleClick(g.value)}
        >
          {g.label}
        </button>
      ))}
    </div>
  );
}
