import { useState } from 'react';

export default function StarRating({ value = 0, onChange, readOnly = false, size = 24 }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={readOnly ? '' : 'star'}
          style={{
            fontSize: size,
            color: star <= active ? '#FFD700' : 'rgba(255,255,255,0.15)',
            cursor: readOnly ? 'default' : 'pointer',
            transition: 'color 0.15s ease, transform 0.15s ease',
            filter: star <= active ? 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))' : 'none',
          }}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
