/**
 * Yearly reading goal ring — Goodreads-style circular progress.
 * Shows how many books the user has completed vs their yearly goal,
 * plus whether they're ahead/behind the pace for this point in the year.
 */
export default function GoalRing({ completed = 0, goal = 0, percent = 0 }) {
  if (!goal || goal < 1) return null;

  const size = 132;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(percent, 0), 100);
  const offset = circumference - (pct / 100) * circumference;

  // Expected progress by this point in the year (pace check)
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear() + 1, 0, 1);
  const yearFraction = (now - start) / (end - start);
  const expected = goal * yearFraction;
  const diff = Math.round(completed - expected);

  let paceText, paceColor;
  if (diff > 0) {
    paceText = `${diff} book${diff !== 1 ? 's' : ''} ahead of schedule 🎉`;
    paceColor = 'var(--accent-primary)';
  } else if (diff < 0) {
    paceText = `${Math.abs(diff)} book${Math.abs(diff) !== 1 ? 's' : ''} behind schedule`;
    paceColor = 'var(--text-muted)';
  } else {
    paceText = 'Right on schedule';
    paceColor = 'var(--text-secondary)';
  }

  const reached = completed >= goal;

  return (
    <div
      className="card"
      style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}
    >
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--bg-surface-active, rgba(255,255,255,0.08))"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute', inset: 0, display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
            {completed}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            of {goal}
          </span>
        </div>
      </div>

      <div style={{ minWidth: 0 }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
          {now.getFullYear()} Reading Goal
        </h2>
        {reached ? (
          <p style={{ fontSize: '14px', color: 'var(--accent-primary)', fontWeight: 600 }}>
            🏆 Goal reached — {completed} books read!
          </p>
        ) : (
          <>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              {Math.round(pct)}% complete · {goal - completed} to go
            </p>
            <p style={{ fontSize: '13px', color: paceColor, fontWeight: 600 }}>{paceText}</p>
          </>
        )}
      </div>
    </div>
  );
}
