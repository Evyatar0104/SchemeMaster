import React, { useState, useReducer, useEffect, useRef, useCallback } from 'react';

// ============================================================
// PROTOCOL DATA — exact source content
// ============================================================
const PROTOCOLS = {
  xcare: {
    label: 'X-CARE',
    subtitle: 'סיוע תחת אש וסקר ראשוני',
    phases: [
      {
        letter: 'X',
        title: 'סיוע תחת אש',
        bullets: [
          'הכרזה בשטח ובקשר על פצוע בכוח',
          'השגת עליונות באש',
          'הגעה למחסה ראשוני ע"י חילוץ עצמי או על ידי כוח שהוגדר לכך',
          'עצירת דימום פורץ עצמית או ע"י לוחם/מטפל סמוך',
        ],
      },
      {
        letter: 'EX',
        title: 'Extract — חילוץ',
        bullets: [
          'הגעה לסביבה מאובטחת/בטוחה',
          'התרשמות ראשונית מהירה — מנגנון הפציעה, בחינה ויזואלית ופניה לפצוע, דחיפות',
          'דיווח אגמי — פניה, הזדהות, תיאור האירוע, מיקום, מספר פצועים ודחיפות פינוי',
        ],
      },
      {
        letter: 'C',
        title: 'Circulation — מחזור דם',
        bullets: [
          'עצירת דימום פורץ. במידה ובוצע בשלב קודם ← וידוא שהדימום נעצר',
          'חיפוש אחר פציעות ומקורות דימום בגב, בגפיים ובאזורים נסתרים תוך ביצוע הפיכה והפשטה — ראש, חזה, עורף, בתי שחי, גב, גפיים, עכוז ומפשעות — עצירת דימום שזוהה',
          'בדיקת הכרה לפי AVPU',
          'בהיעדר נשימה או בהיעדר תגובה לכאב ← ביצוע JT והחזרת AW',
          'בטראומה ישירה לנתיב האוויר ← סילוק הפרשות והושבה',
          'מדידת לחץ דם',
          'מדידת דופק איכותית וכמותית',
          'מדידת ריווי חמצן (סטורציה)',
          'בהלם עמוק על פי הקריטריונים ← הנחיית הצוות להשגת גישה למחזור הדם והכנת מוצרי דם',
          'המשך ביצוע הסכמה על ידי מט"ב',
          'הפעולות עצמן יבוצעו על ידי חובשים בלבד בשלב זה',
        ],
      },
      {
        letter: 'A',
        title: 'Airway — נתיב אוויר',
        bullets: [
          'הערכת נתיב האוויר ומצוקה נשימתית תוך פניה לפצוע והסתכלות',
          'פתיחת פה וסילוק הפרשות',
          'הושבה',
          'בחשד לפציעה ← שמירה על עמש"צ',
        ],
      },
      {
        letter: 'R',
        title: 'Respiration — נשימה',
        bullets: [
          'העשרה בחמצן',
          'בהיעדר נשימה ← הנשמה באמצעות אמבו ומסיכה',
          'חשיפת בית החזה והתרשמות מסימני חבלה',
        ],
      },
      {
        letter: 'E',
        title: 'Exposure & Evacuation — חשיפה ופינוי',
        bullets: [
          'וידוא הפשטה מלאה והפיכה — איתור כלל הפציעות, עצירת דימום במידה וזוהה',
          'ראש — התרשמות מסימני חבלה',
          'עמש"צ — בחשד לפציעה ← הנחת צווארון',
          'אגן — הערכה וביצוע כריכת אגן',
          'כיסוי, חימום והעמסת לאלונקה',
          'חיתוך מצב — סיכום הממצאים, הגדרת דחיפות הפינוי ומתן הנחיות לצוות',
          'העברת דיווח רפואי והשלמת תיעוד ב-101 דיגיטלי או ידני',
        ],
      },
    ],
  },

  care: {
    label: 'CARE',
    subtitle: 'המשך סקר ראשוני',
    phases: [
      {
        letter: 'C',
        title: 'Circulation — המשך מחזור דם',
        bullets: [
          'הערכת הלם חוזרת והמשך החזר נפח לפצועים בהלם עמוק',
          'השגת גישה למחזור הדם וקיבוע',
          'מתן TXA',
          'הערכה חוזרת והמרת חסמי עורקים',
          'קיבוע ומתיחה של שבר בירך באמצעות סד תומאס',
          'השלמת עירוי פריפרי שני בפצוע שנזקק להחזר נפח',
        ],
      },
      {
        letter: 'A',
        title: 'Airway — נתיב אוויר',
        bullets: [
          'הערכה חוזרת של נתיב אוויר וניהול שמרני או ע"י התערבות',
        ],
      },
      {
        letter: 'R',
        title: 'Respiration — נשימה',
        bullets: [
          'העשרה בחמצן',
          'בפצוע מונשם חיבור למנשם והכנת תרופות הרדמה להמשך',
          'החדרת נקז חזה לפצוע חזה מונשם במידת הצורך בלבד',
        ],
      },
      {
        letter: 'E',
        title: 'Everything Else — כל השאר',
        bullets: [
          'הערכת כאב וטיפול',
          'מניעת זיהומים — שטיפת פצעים, חבישה, טיפול אנטיביוטי',
          'הערכת GCS, התרשמות מתנועות ידיים ורגליים ובדיקת אישונים',
          'סריקה גופנית מלאה מהקודקוד ועד לבהונות הרגליים — טיפול בכל פציעה המזוהה בדרך',
          'קיבוע שברים',
          'וידוא כלל הקיבועים',
          'השלמת תיעוד ב-101 דיגיטלי או ידני',
          'הערכה לקיומה של תגובת דחק/קרב וביצוע התערבות יהלו"ם',
          'העברת דיווח רפואי חוזר',
        ],
      },
    ],
  },

  pfc: {
    label: 'PFC',
    subtitle: 'Prolonged Field Care — טיפול מתמשך',
    phases: [
      {
        letter: 'PFC',
        title: 'טיפול מתמשך בשטח',
        bullets: [
          'ניטור ותיעוד הסימנים החיוניים באופן תדיר ומחזורי',
          'החדרת נקז חזה לפצוע חזה נושם עצמונית עם הידרדרות נשימתית',
          'מתן חוזר של טיפול תרופתי תוך ורידי',
          'הכנסת קתטר שתן ובפצוע מונשם הכנסת זונדה לניקוז הקיבה',
          'מניעת פצעי לחץ',
        ],
      },
    ],
  },
};

// Full-run: chain all phases X-CARE → CARE → PFC
PROTOCOLS.fullrun = {
  label: 'מסלול מלא',
  subtitle: 'X-CARE · CARE · PFC',
  phases: [
    ...PROTOCOLS.xcare.phases.map(p => ({ ...p, _track: 'X-CARE', _trackKey: 'xcare' })),
    ...PROTOCOLS.care.phases.map(p => ({ ...p, _track: 'CARE',  _trackKey: 'care'  })),
    ...PROTOCOLS.pfc.phases.map(p =>  ({ ...p, _track: 'PFC',   _trackKey: 'pfc'   })),
  ],
};

const TC = {           // track colors
  xcare:   '#e74c3c',
  care:    '#e67e22',
  pfc:     '#2980b9',
  fullrun: '#8e44ad',
};

// ============================================================
// REDUCER
// ============================================================
const INIT = {
  screen: 'track',
  track: null,
  mode: null,
  difficulty: null,
  activePhaseIdx: null,
  score: 0,
  streak: 0,
  totalAnswered: 0,
  sessionWrong: 0,
  phaseSeenIndices:    new Set(),
  phaseClearedIndices: new Set(),
  currentQuestion: null,
  lastResult: null,
  phaseStartTime: null,
};

function reducer(state, { type, ...a }) {
  switch (type) {
    case 'SELECT_TRACK':
      return { ...INIT, screen: 'mode', track: a.track };
    case 'SELECT_MODE':
      return {
        ...state, mode: a.mode,
        activePhaseIdx: (a.mode === 'phased' && state.track === 'fullrun') ? 0 : state.activePhaseIdx,
        screen: (a.mode === 'phased' && state.track !== 'fullrun') ? 'phase' : 'difficulty',
      };
    case 'SELECT_PHASE':
      return {
        ...state, activePhaseIdx: a.phaseIdx, screen: 'difficulty',
        phaseSeenIndices: new Set(), phaseClearedIndices: new Set(),
        phaseStartTime: null, currentQuestion: null, lastResult: null,
      };
    case 'SELECT_DIFFICULTY':
      return {
        ...state, difficulty: a.difficulty, screen: 'game',
        phaseStartTime: Date.now(), currentQuestion: null, lastResult: null,
      };
    case 'SET_QUESTION':
      return { ...state, currentQuestion: a.question, lastResult: null };
    case 'ANSWER_CORRECT':
      return {
        ...state,
        score: state.score + 1, streak: state.streak + 1, totalAnswered: state.totalAnswered + 1,
        lastResult: 'correct',
        phaseSeenIndices:    new Set([...state.phaseSeenIndices,    a.key]),
        phaseClearedIndices: new Set([...state.phaseClearedIndices, a.key]),
      };
    case 'ANSWER_WRONG':
      return {
        ...state,
        streak: 0, totalAnswered: state.totalAnswered + 1, sessionWrong: state.sessionWrong + 1,
        lastResult: 'wrong',
        phaseSeenIndices: new Set([...state.phaseSeenIndices, a.key]),
      };
    case 'ANSWER_OVERRIDE':
      return { ...state, lastResult: 'override', phaseClearedIndices: new Set([...state.phaseClearedIndices, a.key]) };
    case 'SET_SCREEN':
      return { ...state, screen: a.screen };
    case 'RETRY_PHASE':
      return {
        ...state, screen: 'game',
        phaseSeenIndices: new Set(), phaseClearedIndices: new Set(),
        phaseStartTime: Date.now(), currentQuestion: null, lastResult: null,
      };
    case 'NEXT_PHASE':
      return {
        ...state, screen: 'game', activePhaseIdx: a.phaseIdx,
        phaseSeenIndices: new Set(), phaseClearedIndices: new Set(),
        phaseStartTime: Date.now(), currentQuestion: null, lastResult: null,
      };
    case 'RESET':
      return INIT;
    default:
      return state;
  }
}

// ============================================================
// HELPERS
// ============================================================
function normalize(s) {
  return s.trim()
    .replace(/[׳״'"""]/g, '')
    .replace(/[—–\-‐←]/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function applyBlank(bullet, difficulty) {
  const words = bullet.split(' ');
  if (difficulty === 'easy') {
    const bi = words.length <= 2 ? words.length - 1 : Math.floor(words.length / 2);
    return { prefix: words.slice(0, bi).join(' '), suffix: words.slice(bi + 1).join(' '), target: words[bi] };
  }
  if (difficulty === 'medium') {
    const mid = Math.ceil(words.length / 2);
    return { prefix: words.slice(0, mid).join(' '), suffix: '', target: words.slice(mid).join(' ') };
  }
  return { prefix: '', suffix: '', target: bullet };
}

function pickQuestion(proto, mode, phaseIdx, difficulty, seenSet, lastKey) {
  const all = mode === 'phased'
    ? proto.phases[phaseIdx].bullets.map((b, i) => ({ b, phaseIdx, bulletIdx: i, key: `${phaseIdx}_${i}` }))
    : proto.phases.flatMap((ph, pi) => ph.bullets.map((b, bi) => ({ b, phaseIdx: pi, bulletIdx: bi, key: `${pi}_${bi}` })));
  const unseen  = all.filter(x => !seenSet.has(x.key) && x.key !== lastKey);
  const notLast = all.filter(x => x.key !== lastKey);
  const arr = unseen.length ? unseen : notLast.length ? notLast : all;
  const pick = arr[Math.floor(Math.random() * arr.length)];
  return { ...pick, phase: proto.phases[pick.phaseIdx], ...applyBlank(pick.b, difficulty) };
}

// ============================================================
// GLOBAL CSS
// ============================================================
const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body { margin: 0; padding: 0; background: #0a0a0a; overscroll-behavior: none; }
  button  { touch-action: manipulation; font-family: inherit; cursor: pointer; }
  input, textarea { -webkit-appearance: none; appearance: none; font-family: inherit; }
  input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.18); }
  ::-webkit-scrollbar { display: none; }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes correctRing {
    0%   { border-color: #27ae60; box-shadow: 0 0 0 0 rgba(39,174,96,0.5); }
    40%  { box-shadow: 0 0 0 8px rgba(39,174,96,0); }
    100% { border-color: rgba(255,255,255,0.1); box-shadow: none; }
  }
  @keyframes wrongShake {
    0%,100% { transform: translateX(0); }
    15%     { transform: translateX(-10px); }
    45%     { transform: translateX(8px); }
    75%     { transform: translateX(-4px); }
  }
  @keyframes popIn {
    0%   { transform: scale(0.7);  opacity: 0; }
    65%  { transform: scale(1.07); opacity: 1; }
    100% { transform: scale(1); }
  }
  @keyframes streakBounce {
    0%,100% { transform: scale(1); }
    40%     { transform: scale(1.3); }
  }
  @keyframes glowPulse {
    0%,100% { opacity: 0.6; }
    50%     { opacity: 1; }
  }
  @keyframes barFill {
    from { width: 0%; }
  }
  @keyframes countIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: none; }
  }

  .screen      { animation: slideUp 0.22s cubic-bezier(0.16,1,0.3,1) both; }
  .card-ok     { animation: correctRing 0.8s ease forwards; }
  .card-wrong  { animation: wrongShake 0.38s ease; }
  .badge-enter { animation: popIn 0.38s cubic-bezier(0.34,1.56,0.64,1) both; }
  .streak-pop  { animation: streakBounce 0.35s ease; }
  .stat-in     { animation: countIn 0.4s ease both; }

  input:focus, textarea:focus { outline: none; }
`;

// ============================================================
// DESIGN TOKENS
// ============================================================
const FONT = '"Segoe UI", system-ui, -apple-system, Arial, sans-serif';
const SURFACE  = 'rgba(255,255,255,0.05)';
const BORDER   = 'rgba(255,255,255,0.1)';

function card(extra = {}) {
  return {
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${BORDER}`,
    borderRadius: 16,
    backdropFilter: 'blur(16px)',
    ...extra,
  };
}

function badge(size, color) {
  return {
    width: size, height: size, borderRadius: '50%',
    background: `radial-gradient(circle at 35% 35%, ${lighten(color, 0.18)}, ${color})`,
    boxShadow: `0 4px 16px ${color}44, inset 0 1px 0 rgba(255,255,255,0.15)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: Math.max(11, size * 0.33), fontWeight: 800, color: '#fff',
    flexShrink: 0, letterSpacing: -0.5,
  };
}

function lighten(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + Math.round(255 * amt));
  const g = Math.min(255, ((n >> 8)  & 0xff) + Math.round(255 * amt));
  const b = Math.min(255, ((n)       & 0xff) + Math.round(255 * amt));
  return `rgb(${r},${g},${b})`;
}

function pill(active, color = '#c0392b') {
  return {
    padding: '10px 22px', borderRadius: 50, fontSize: 14, fontFamily: FONT,
    border: `1px solid ${active ? color : BORDER}`,
    background: active ? color : 'rgba(255,255,255,0.04)',
    color: '#fff', cursor: 'pointer', minHeight: 44, fontWeight: active ? 700 : 400,
    transition: 'all 0.14s',
  };
}

// ============================================================
// SHARED COMPONENTS
// ============================================================

function NavCard({ onClick, color, children, highlight = false }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...card(),
        display: 'block', width: '100%', textAlign: 'right',
        padding: '16px 18px',
        background: hov
          ? `linear-gradient(135deg, ${color}12, rgba(255,255,255,0.04))`
          : 'rgba(255,255,255,0.04)',
        borderColor: hov ? `${color}88` : BORDER,
        boxShadow: hov ? `0 0 0 1px ${color}30, 0 8px 32px ${color}14` : 'none',
        transform: hov ? 'translateY(-1px)' : 'none',
        transition: 'all 0.16s cubic-bezier(0.2,0,0.13,1)',
        borderRight: `3px solid ${hov ? color : highlight ? `${color}60` : BORDER}`,
      }}
    >
      {children}
    </button>
  );
}

function Label({ children, color }) {
  return (
    <div style={{
      fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
      fontWeight: 700, color: color || 'rgba(255,255,255,0.35)',
    }}>
      {children}
    </div>
  );
}

function BackBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'transparent', border: 'none',
        color: 'rgba(255,255,255,0.3)', fontSize: 13,
        padding: '10px 0', marginTop: 8, cursor: 'pointer',
        transition: 'color 0.12s',
      }}
      onMouseEnter={e => (e.target.style.color = 'rgba(255,255,255,0.6)')}
      onMouseLeave={e => (e.target.style.color = 'rgba(255,255,255,0.3)')}
    >
      ← חזור
    </button>
  );
}

function ScoreHUD({ score, streak, total }) {
  const prevStreak = useRef(streak);
  const [popKey, setPopKey] = useState(0);
  useEffect(() => {
    if (streak > prevStreak.current && streak >= 3) setPopKey(k => k + 1);
    prevStreak.current = streak;
  }, [streak]);

  return (
    <div style={{
      position: 'fixed', top: 14, left: 12, zIndex: 999,
      background: 'rgba(10,10,10,0.7)',
      border: `1px solid ${BORDER}`,
      borderRadius: 24, padding: '5px 14px',
      fontFamily: 'monospace', fontSize: 12, direction: 'ltr',
      backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>{score}</span>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/{total}</span>
      </span>
      {streak >= 3 && (
        <span key={popKey} className="streak-pop"
          style={{ color: '#e74c3c', fontWeight: 800, fontSize: 13 }}>
          ×{streak}
        </span>
      )}
    </div>
  );
}

function ProgressRing({ cleared, total, color }) {
  const r = 14, circ = 2 * Math.PI * r, pct = total ? cleared / total : 0;
  const done = pct >= 1;
  return (
    <svg width={38} height={38} style={{ flexShrink: 0 }}>
      <circle cx={19} cy={19} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={2.5} />
      <circle
        cx={19} cy={19} r={r} fill="none"
        stroke={done ? '#27ae60' : color}
        strokeWidth={2.5} strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)} strokeLinecap="round"
        transform="rotate(-90 19 19)"
        style={{ transition: 'stroke-dashoffset 0.45s cubic-bezier(0.4,0,0.2,1)' }}
      />
      {done
        ? <text x={19} y={23} textAnchor="middle" fill="#27ae60" fontSize={11} fontWeight={700}>✓</text>
        : <text x={19} y={23} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={9} fontFamily={FONT}>{cleared}/{total}</text>
      }
    </svg>
  );
}

// ============================================================
// SCREENS
// ============================================================

function TrackSelector({ dispatch }) {
  const ICONS = { xcare: 'X', care: 'C', pfc: 'P', fullrun: '∞' };
  const DESCS = {
    xcare:   'X · EX · C · A · R · E',
    care:    'C · A · R · E',
    pfc:     '5 סעיפים',
    fullrun: 'כל הסכמות בסדר',
  };
  return (
    <div style={{ width: '100%', maxWidth: 480, padding: '0 16px' }} className="screen">
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '52px 0 36px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.25)',
          borderRadius: 12, padding: '6px 14px', marginBottom: 20,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e74c3c', boxShadow: '0 0 6px #e74c3c' }} />
          <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(255,255,255,0.55)' }}>
            חזרה על סכמות
          </span>
        </div>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: -1, color: '#fff' }}>
          SchemeMaster
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
          בחר פרוטוקול לחזרה
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Object.entries(PROTOCOLS).map(([key, proto]) => (
          <NavCard key={key} color={TC[key]} highlight
            onClick={() => dispatch({ type: 'SELECT_TRACK', track: key })}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div className="badge-enter" style={badge(50, TC[key])}>{ICONS[key]}</div>
              <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>{proto.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{proto.subtitle}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>
                  {proto.phases.length} שלבים · {proto.phases.reduce((a, p) => a + p.bullets.length, 0)} סעיפים
                  {key !== 'fullrun' && ` · ${DESCS[key]}`}
                </div>
              </div>
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                <path d="M10 8L6 4M10 8L6 12" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} strokeLinecap="round" />
              </svg>
            </div>
          </NavCard>
        ))}
      </div>

      <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.15)', marginTop: 32 }}>
        מבוסס על הסכמה האחודה לטיפול בנפגעים
      </p>
    </div>
  );
}

function ModeSelector({ track, dispatch }) {
  const color = TC[track];
  const proto = PROTOCOLS[track];
  return (
    <div style={{ width: '100%', maxWidth: 480, padding: '0 16px' }} className="screen">
      <div style={{ textAlign: 'center', padding: '48px 0 30px' }}>
        <div style={badge(52, color)}>{proto.label.at(0)}</div>
        <h2 style={{ margin: '16px 0 4px', fontSize: 22, fontWeight: 800 }}>{proto.label}</h2>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{proto.subtitle}</p>
      </div>

      <div style={{ marginBottom: 8 }}>
        <Label>בחר מצב</Label>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
        {[
          { key: 'free',   icon: '⚡', label: 'חופשי',          desc: 'שאלות אקראיות מכל שלבי הפרוטוקול' },
          { key: 'phased', icon: '→',  label: 'שלב אחר שלב', desc: track === 'fullrun' ? 'X-CARE · CARE · PFC — כל הסכמות בסדר' : 'מתמקד בשלב אחד, עם מעקב התקדמות' },
        ].map(({ key, icon, label, desc }) => (
          <NavCard key={key} color={color}
            onClick={() => dispatch({ type: 'SELECT_MODE', mode: key })}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{desc}</div>
              </div>
            </div>
          </NavCard>
        ))}
      </div>
      <BackBtn onClick={() => dispatch({ type: 'RESET' })} />
    </div>
  );
}

function DifficultySelector({ track, mode, dispatch }) {
  const color = TC[track];
  const DIFFS = [
    { key: 'easy',   label: 'קל',     tag: '1 מילה',   desc: 'מילה בודדת חסרה — ההקשר המלא נראה' },
    { key: 'medium', label: 'בינוני', tag: 'חצי משפט', desc: 'מחצית שנייה חסרה — תחילת המשפט גלויה' },
    { key: 'hard',   label: 'קשה',    tag: 'ריק',      desc: 'רק כותרת השלב — כתוב מהזיכרון' },
  ];
  return (
    <div style={{ width: '100%', maxWidth: 480, padding: '0 16px' }} className="screen">
      <div style={{ textAlign: 'center', padding: '48px 0 30px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800 }}>רמת קושי</h2>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>כמה קשה תרצה את השאלות?</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {DIFFS.map(({ key, label, tag, desc }) => (
          <NavCard key={key} color={color}
            onClick={() => dispatch({ type: 'SELECT_DIFFICULTY', difficulty: key })}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                minWidth: 64, textAlign: 'center',
                borderLeft: `1px solid ${BORDER}`, paddingLeft: 14, marginLeft: 2,
              }}>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{label}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{tag}</div>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.45 }}>{desc}</div>
            </div>
          </NavCard>
        ))}
      </div>
      <BackBtn onClick={() => dispatch({ type: 'SELECT_MODE', mode })} />
    </div>
  );
}

function PhaseSelector({ track, dispatch }) {
  const proto = PROTOCOLS[track];
  const color = TC[track];
  return (
    <div style={{ width: '100%', maxWidth: 480, padding: '0 16px' }} className="screen">
      <div style={{ textAlign: 'center', padding: '48px 0 28px' }}>
        <Label color={color}>{proto.label}</Label>
        <h2 style={{ margin: '8px 0 4px', fontSize: 22, fontWeight: 800 }}>בחר שלב</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {proto.phases.map((phase, idx) => {
          const [hov, setHov] = useState(false);
          return (
            <button key={idx}
              onClick={() => dispatch({ type: 'SELECT_PHASE', phaseIdx: idx })}
              onMouseEnter={() => setHov(true)}
              onMouseLeave={() => setHov(false)}
              style={{
                ...card({ padding: '16px 10px' }),
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                cursor: 'pointer', transition: 'all 0.15s',
                borderColor: hov ? `${color}88` : BORDER,
                background: hov ? `${color}10` : 'rgba(255,255,255,0.04)',
                transform: hov ? 'translateY(-2px)' : 'none',
                boxShadow: hov ? `0 6px 20px ${color}18` : 'none',
              }}>
              <div style={badge(46, color)}>{phase.letter}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 1.4, direction: 'rtl' }}>
                {phase.title.split('—')[0].trim()}
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.06)', borderRadius: 6, padding: '2px 8px' }}>
                {phase.bullets.length}
              </div>
            </button>
          );
        })}
      </div>
      <BackBtn onClick={() => dispatch({ type: 'SELECT_MODE', mode: 'phased' })} />
    </div>
  );
}

// ============================================================
// INLINE BLANK
// ============================================================
const INPUT_BASE = {
  background: 'transparent', border: 'none', outline: 'none',
  color: '#fff', fontFamily: FONT, fontSize: 16,
  padding: '2px 4px 4px', direction: 'rtl', textAlign: 'right',
};

function InlineBlank({ question, difficulty, color, onSubmit, lastResult, onOverride, onNext }) {
  const [val, setVal] = useState('');
  const ref = useRef(null);
  const isHard = difficulty === 'hard';
  const locked = lastResult !== null;

  useEffect(() => {
    setVal('');
    const t = setTimeout(() => ref.current?.focus(), 90);
    return () => clearTimeout(t);
  }, [question?.key]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !locked) { e.preventDefault(); onSubmit(val); }
  };

  const cardClass = lastResult === 'correct' || lastResult === 'override' ? 'card-ok'
    : lastResult === 'wrong' ? 'card-wrong' : '';

  const borderCol = lastResult === 'correct' || lastResult === 'override' ? '#27ae60'
    : lastResult === 'wrong' ? '#e74c3c' : BORDER;

  const inputW = Math.max(difficulty === 'medium' ? 140 : 72, (question?.target?.length ?? 8) * 9.5);

  return (
    <div className={cardClass} style={{
      ...card({ padding: 20, marginBottom: 12 }),
      border: `1px solid ${borderCol}`,
      transition: 'border-color 0.2s',
    }}>
      {/* phase mini label */}
      <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: color, flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', lineHeight: 1.4 }}>
          {question?.phase?._track && (
            <span style={{ color, fontWeight: 700, marginLeft: 4 }}>{question.phase._track} · </span>
          )}
          {question?.phase?.title?.split('—')[0].trim()}
        </span>
      </div>

      {/* question */}
      {isHard ? (
        <>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>כתוב את הסעיף המלא:</div>
          <textarea ref={ref} value={val} rows={3}
            onChange={e => !locked && setVal(e.target.value)}
            onKeyDown={handleKey}
            style={{
              ...INPUT_BASE, width: '100%',
              border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 10,
              padding: '10px 12px', resize: 'none', lineHeight: 1.8,
              background: 'rgba(255,255,255,0.03)',
            }}
          />
        </>
      ) : (
        <div style={{ fontSize: 16, lineHeight: 2.5, direction: 'rtl', wordBreak: 'break-word' }}>
          {question?.prefix && <span>{question.prefix} </span>}
          <input ref={ref} type="text" value={val} placeholder="___" disabled={locked}
            onChange={e => !locked && setVal(e.target.value)}
            onKeyDown={handleKey}
            style={{
              ...INPUT_BASE,
              display: 'inline', verticalAlign: 'baseline', cursor: locked ? 'default' : 'text',
              width: inputW,
              borderBottom: `2px solid ${locked ? 'rgba(255,255,255,0.12)' : color}`,
              transition: 'border-color 0.15s',
            }}
          />
          {question?.suffix && <span> {question.suffix}</span>}
        </div>
      )}

      {/* submit */}
      {!locked && (
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => onSubmit(val)} style={{
            padding: '10px 26px', borderRadius: 10, border: 'none',
            background: color, color: '#fff', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', minHeight: 44,
            boxShadow: `0 4px 16px ${color}44`,
          }}>בדוק</button>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)' }}>Enter לבדיקה</span>
        </div>
      )}

      {/* wrong feedback */}
      {lastResult === 'wrong' && (
        <div style={{ marginTop: 16 }}>
          <div style={{
            background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.2)',
            borderRadius: 10, padding: '10px 14px', marginBottom: 12,
          }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 4, letterSpacing: '0.06em' }}>התשובה הנכונה</div>
            <div style={{ fontSize: 14, color: '#e88', lineHeight: 1.6, fontWeight: 600 }}>{question?.target}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={onOverride} style={pill(false)}>סמן כנכון בכל זאת</button>
            <button onClick={onNext} style={pill(true, color)}>המשך ←</button>
          </div>
        </div>
      )}

      {/* correct/override */}
      {(lastResult === 'correct' || lastResult === 'override') && (
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#27ae60', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>✓</div>
          <span style={{ fontSize: 13, color: '#27ae60', fontWeight: 600 }}>
            {lastResult === 'override' ? 'סומן כנכון' : 'נכון'}
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PHASE COMPLETE
// ============================================================
function PhaseCompleteScreen({ state, dispatch }) {
  const proto   = PROTOCOLS[state.track];
  const phase   = proto.phases[state.activePhaseIdx];
  const color   = TC[state.track];
  const isLast  = state.activePhaseIdx >= proto.phases.length - 1;
  const isRunDone = isLast && state.track === 'fullrun';
  const elapsed = Math.max(0, Math.floor((Date.now() - state.phaseStartTime) / 1000));
  const accuracy = state.totalAnswered
    ? Math.round(((state.totalAnswered - state.sessionWrong) / state.totalAnswered) * 100) : 100;

  const stats = [
    { v: `${accuracy}%`, l: 'דיוק' },
    { v: `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`, l: 'זמן' },
    { v: `${state.phaseClearedIndices.size}/${phase.bullets.length}`, l: 'סעיפים' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(160deg, rgba(10,10,10,0.98) 0%, #0a0a0a 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', zIndex: 500, direction: 'rtl', padding: 28,
    }} className="screen">

      {/* glow ring behind badge */}
      <div style={{
        position: 'absolute',
        width: 180, height: 180,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${isRunDone ? '#27ae60' : color}22 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div className="badge-enter" style={badge(90, isRunDone ? '#27ae60' : color)}>
        {isRunDone ? '✓' : phase.letter}
      </div>

      <h2 style={{ fontSize: 30, fontWeight: 800, margin: '24px 0 6px', textAlign: 'center', letterSpacing: -1 }}>
        {isRunDone ? 'מסלול הושלם!' : 'שלב הושלם ✓'}
      </h2>
      <p style={{ margin: '0 0 40px', color: 'rgba(255,255,255,0.35)', fontSize: 14, textAlign: 'center' }}>
        {isRunDone ? 'X-CARE · CARE · PFC' : phase.title}
      </p>

      {/* stats */}
      <div style={{
        display: 'flex', gap: 0,
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${BORDER}`,
        borderRadius: 16, overflow: 'hidden',
        marginBottom: 44,
      }}>
        {stats.map(({ v, l }, i) => (
          <div key={l} className="stat-in"
            style={{
              padding: '18px 28px', textAlign: 'center',
              borderLeft: i > 0 ? `1px solid ${BORDER}` : 'none',
              animationDelay: `${i * 0.1}s`,
            }}>
            <div style={{ fontSize: 28, fontWeight: 800, color }}>{v}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => dispatch({ type: 'RETRY_PHASE' })} style={pill(false)}>חזור לשלב</button>
        {!isLast && (
          <button onClick={() => dispatch({ type: 'NEXT_PHASE', phaseIdx: state.activePhaseIdx + 1 })}
            style={pill(true, color)}>
            {state.track === 'fullrun' ? 'ממשיך ←' : 'השלב הבא ←'}
          </button>
        )}
        <button onClick={() => dispatch({ type: 'RESET' })} style={pill(false)}>
          בחר פרוטוקול
        </button>
      </div>
    </div>
  );
}

// ============================================================
// GAME SCREEN
// ============================================================
function GameScreen({ state, dispatch }) {
  const { track, mode, difficulty, activePhaseIdx, phaseSeenIndices, phaseClearedIndices, currentQuestion, lastResult } = state;
  const proto = PROTOCOLS[track];
  const color = TC[track];

  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; });

  const genQuestion = useCallback(() => {
    const s = stateRef.current;
    dispatch({
      type: 'SET_QUESTION',
      question: pickQuestion(
        PROTOCOLS[s.track], s.mode, s.activePhaseIdx,
        s.difficulty, s.phaseSeenIndices, s.currentQuestion?.key ?? null,
      ),
    });
  }, [dispatch]);

  const advance = useCallback(() => {
    const s = stateRef.current;
    const cap = s.mode === 'phased'
      ? PROTOCOLS[s.track].phases[s.activePhaseIdx].bullets.length : Infinity;
    if (s.phaseClearedIndices.size >= cap) {
      dispatch({ type: 'SET_SCREEN', screen: 'phaseComplete' });
    } else {
      genQuestion();
    }
  }, [dispatch, genQuestion]);

  const advanceRef = useRef(advance);
  useEffect(() => { advanceRef.current = advance; }, [advance]);

  useEffect(() => { genQuestion(); }, []); // eslint-disable-line

  useEffect(() => {
    if (lastResult === 'correct' || lastResult === 'override') {
      const t = setTimeout(() => advanceRef.current(), 750);
      return () => clearTimeout(t);
    }
  }, [lastResult]);

  const handleSubmit = val => {
    if (lastResult !== null || !currentQuestion) return;
    const ok = normalize(val) === normalize(currentQuestion.target);
    dispatch({ type: ok ? 'ANSWER_CORRECT' : 'ANSWER_WRONG', key: currentQuestion.key });
  };

  const phase      = currentQuestion?.phase ?? (activePhaseIdx !== null ? proto.phases[activePhaseIdx] : null);
  const phaseTotal = mode === 'phased' ? proto.phases[activePhaseIdx]?.bullets.length : null;
  const totalPh    = proto.phases.length;
  const curPh      = (activePhaseIdx ?? 0) + 1;

  if (!currentQuestion) {
    return (
      <div style={{ width: '100%', maxWidth: 480, padding: '0 16px', paddingTop: 60, textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>
        טוען...
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: 480, padding: '0 16px' }} className="screen">
      <ScoreHUD score={state.score} streak={state.streak} total={state.totalAnswered} />

      {/* full-run progress bar */}
      {track === 'fullrun' && mode === 'phased' && (
        <div style={{ paddingTop: 22, marginBottom: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)' }}>
              {curPh} / {totalPh}
            </span>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
              color, background: `${color}18`, border: `1px solid ${color}30`,
              borderRadius: 8, padding: '2px 8px',
            }}>
              {phase?._track}
            </span>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 2,
              background: `linear-gradient(90deg, ${color}, ${lighten(color, 0.15)})`,
              width: `${(curPh / totalPh) * 100}%`,
              transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
              boxShadow: `0 0 8px ${color}66`,
            }} />
          </div>
        </div>
      )}

      {/* phase header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '26px 0 16px' }}>
        <div key={`${activePhaseIdx}-${currentQuestion?.phaseIdx}`} className="badge-enter"
          style={badge(56, color)}>
          {phase?.letter ?? '?'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Label color={color}>{proto.label}</Label>
          <div style={{ fontWeight: 700, fontSize: 15, marginTop: 5, lineHeight: 1.35, color: '#fff' }}>
            {phase?.title}
          </div>
        </div>
        {mode === 'phased' && phaseTotal != null && (
          <ProgressRing cleared={phaseClearedIndices.size} total={phaseTotal} color={color} />
        )}
      </div>

      <InlineBlank
        question={currentQuestion}
        difficulty={difficulty}
        color={color}
        onSubmit={handleSubmit}
        lastResult={lastResult}
        onOverride={() => dispatch({ type: 'ANSWER_OVERRIDE', key: currentQuestion.key })}
        onNext={advance}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4 }}>
        <button
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', fontSize: 12, cursor: 'pointer', padding: '8px 0', transition: 'color 0.12s' }}
          onMouseEnter={e => (e.target.style.color = 'rgba(255,255,255,0.55)')}
          onMouseLeave={e => (e.target.style.color = 'rgba(255,255,255,0.25)')}
          onClick={() => dispatch({ type: 'RESET' })}
        >
          ← התחל מחדש
        </button>
        {mode === 'phased' && track !== 'fullrun' && (
          <button
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', fontSize: 12, cursor: 'pointer', padding: '8px 0', transition: 'color 0.12s' }}
            onMouseEnter={e => (e.target.style.color = 'rgba(255,255,255,0.55)')}
            onMouseLeave={e => (e.target.style.color = 'rgba(255,255,255,0.25)')}
            onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'phase' })}
          >
            שנה שלב
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// ROOT
// ============================================================
const SCREENS = {
  track:         (s, d) => <TrackSelector dispatch={d} />,
  mode:          (s, d) => <ModeSelector track={s.track} dispatch={d} />,
  difficulty:    (s, d) => <DifficultySelector track={s.track} mode={s.mode} dispatch={d} />,
  phase:         (s, d) => <PhaseSelector track={s.track} dispatch={d} />,
  game:          (s, d) => <GameScreen state={s} dispatch={d} />,
  phaseComplete: (s, d) => <PhaseCompleteScreen state={s} dispatch={d} />,
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, INIT);

  useEffect(() => {
    const el = Object.assign(document.createElement('style'), { textContent: GLOBAL_CSS });
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  return (
    <div style={{
      minHeight: '100dvh', background: '#0a0a0a', color: '#fff',
      fontFamily: FONT, direction: 'rtl',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '0 0 96px',
    }}>
      {(SCREENS[state.screen] ?? SCREENS.track)(state, dispatch)}
    </div>
  );
}
