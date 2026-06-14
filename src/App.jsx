import React, { useState, useReducer, useEffect, useRef, useCallback } from 'react';

// ============================================================
// PROTOCOL DATA
// ============================================================
const PROTOCOLS = {
  xcare: {
    label: 'X-CARE',
    subtitle: 'טיפול בפצוע בודד',
    phases: [
      {
        letter: 'X',
        title: 'חילוץ תחת אש',
        bullets: [
          'הכרזה בשטח ובקשר על פצוע בכוח',
          'הסגת אש על ידי עליונים',
          'הגנה לנפש ראשונית על ידי חילוץ עצמי או על ידי כוח שהוגדר לכך',
          'עצירת נקודת דימום פורץ עצמאית או על ידי לוחם/טפל סמוך',
        ],
      },
      {
        letter: 'EX',
        title: 'EXtract — חילוץ והערכה ראשונית',
        bullets: [
          'הגנה לסביבה מאובטחת ובטוחה',
          'התרשמות ראשונית מהירה — מנגנון הפציעה, בחינה יזואלית ופניה לפצוע',
          'דיווח אנכי — פניה, תיאור האירוע, מיקום, מספר פצועים ודחיפות פינוי',
        ],
      },
      {
        letter: 'C',
        title: 'Circulation — מחזור הדם',
        bullets: [
          'עצירת דימום פורץ — במידה ובוצע קודם, וידוא שהדימום נעצר',
          'תיפוס אחר פציעות ומקורות דימום: גו, מפשעות, בסתרים — תוך ביצוע הפשטה: ראש, חזה, עורף, בתי שחי, גב, גפיים',
          'עצירת נקודות ומפשטות — עצירת דימום שוזה',
          'בדיקת הכרה לפי AVPU',
          'בהעדר נשימה או החזרה לנצב לכאב — ביצוע JT והחדרת AW',
          'בטראומה ישירה לנתיב האוויר — סילוק הפרשות והשבה',
          'מדידת לחץ דם',
          'מדידת דופק איכותית וכמותית',
          'מדידת ריווי חמצן (סטורציה)',
          'בהלם עמוק על פי הקריטריונים — הנחיית חובש להשגת גישה לחזור הדם והכנת מוצרי דם',
        ],
      },
      {
        letter: 'A',
        title: 'Airway — נתיב אוויר',
        bullets: [
          'הגנה לנתיב האוויר ופתיחתו',
          'שימוש באמצעים בסיסיים לניהול נתיב האוויר',
          'פתיחת פה וסילוק הפרשות',
          'חשיפת הצוואר ונתיב האוויר',
        ],
      },
      {
        letter: 'R',
        title: 'Respiration — נשימה',
        bullets: [
          'הערכה בחמצן',
          'בהיעדר נשימה — הנשמה באמצעות אמבו ונסיכה',
          'בחשד לפגיעה — שמירה על עמש"צ',
          'חשיפת בית החזה והתרשמות לסיסמי חבלה',
        ],
      },
      {
        letter: 'E',
        title: 'Exposure & Evacuation — חשיפה ופינוי',
        bullets: [
          'וידוא הפשטה מלאה — הפיכה, איתור כלל הפציעות, עצירת דימום בפציעות שנמצאו',
          'ראש — התרשמות לסיסמי חבלה',
          'עמש"צ — בחשד לפגיעה, נחת צוואר וקיבוע',
          'אגן — הרכה וביצוע כריכת אגן',
          'כיסוי, חימום, העמסת האלונקה',
          'חינוך מצב — סיכום ממצאים, הגדרת דחיפות הפינוי',
          'הנחיות לצוות',
          'העברת דיווח רופאי והשלמת תיעוד ב-101 דיגיטלי או ידני',
        ],
      },
    ],
  },
  care: {
    label: 'CARE',
    subtitle: 'טיפול קבוצתי — המשך',
    phases: [
      {
        letter: 'C',
        title: 'Circulation — המשך מחזור הדם',
        bullets: [
          'הערכה חוזרת והמשך ניהול פצועים בהלם עמוק',
          'הנחיית גישה לחזור הדם וקיבוע',
          'מתן TXA',
          'הערכה חוזרת והחזרת חסמי עורקים',
          'קיבוע ותחייה של שבר ביד באמצעות סד תואם',
          'השלמת עירוי פריפרי שני בפצוע שזקוק לחזור נפח',
        ],
      },
      {
        letter: 'A',
        title: 'Airway — המשך נתיב אוויר',
        bullets: [
          'הערכה חוזרת של נתיב האוויר וניהול שמרני',
          'התערבות מתקדמת בנתיב האוויר לפי הצורך',
        ],
      },
      {
        letter: 'R',
        title: 'Respiration — המשך נשימה',
        bullets: [
          'הערכה חוזרת בחמצן',
          'בפצוע מנושם — חיבור לנשם וכוונות תרופות הרדמה להמשך',
          'הנחיית ניהול פצוע חזה מנושם',
        ],
      },
      {
        letter: 'E',
        title: 'Everything Else — כל השאר',
        bullets: [
          'הערכת הכרה לכאב וסטטוס נוירולוגי',
          'מניעת היפותרמיה — שיטות פציעים, טיפול אנטיביוטי',
          'הכרת GCS, התרשמות מתנועות ידיים ובדיקת אישונים',
          'סריקה גופנית מלאה מהקודקוד ועד לבהונות הרגליים — טיפול בכל פציעה מזוהה',
          'קיבוע עצמות שבורות',
          'וידוא כלל הקיבועים',
          'השלמת תיעוד ב-101 דיגיטלי או ידני',
          'הכרת רצף קידמת תגמול/קרב וביצוע התערבות יהל"ום',
          'העברת דיווח רופאי לחזור',
        ],
      },
    ],
  },
  pfc: {
    label: 'PFC',
    subtitle: 'Prolonged Field Care',
    phases: [
      {
        letter: 'C',
        title: 'Circulation — ניטור ותיעוד',
        bullets: [
          'ניטור ותיעוד הסימנים החיוניים באופן תדיר ומחזורי',
          'הכנת חיבור לפצוע מנושם עם תרופות ורידיות',
          'מתן חזור של טיפול תרופות הרדמה',
          'הכנסת זונדה לפצוע מנושם לניקוז הקיבה',
          'מניעת פציעי לחץ',
        ],
      },
      {
        letter: 'A',
        title: 'Airway — ניהול ממושך',
        bullets: [
          'הערכה חוזרת של נתיב האוויר וניהול שמרני',
          'התערבות מתקדמת בנתיב האוויר לפי הצורך',
        ],
      },
      {
        letter: 'R',
        title: 'Respiration — נשימה ממושכת',
        bullets: [
          'הפשטה בחמצן ובדיקת ריווי',
          'בפצוע מנושם — חיבור לנשם וכוונות תרופות הרדמה להמשך',
          'הנחיית ניהול פצוע חזה מנושם',
          'הכרת רצף קידמת תגמול/קרב',
        ],
      },
      {
        letter: 'E',
        title: 'Everything Else — ניהול ממושך',
        bullets: [
          'מניעת היפותרמיה — שיטות פציעים, טיפול אנטיביוטי',
          'הכרת GCS, התרשמות מתנועות ידיים ובדיקת אישונים',
          'סריקה גופנית מלאה מהקודקוד ועד לבהונות הרגליים',
          'קיבוע עצמות שבורות ורצף קיבועים',
          'וידוא כלל הקיבועים',
          'השלמת תיעוד ב-101 דיגיטלי או ידני',
          'הכרת קידמת תגמול/קרב וביצוע התערבות',
          'העברת דיווח רופאי לחזור',
        ],
      },
      {
        letter: 'PFC+',
        title: 'PFC — טיפול ממושך נוסף',
        bullets: [
          'ניטור ותיעוד הסימנים החיוניים באופן תדיר ומחזורי',
          'ניהול תיעוד שוטף של כל ההתערבויות',
          'הכנסת זונדה לניקוז הקיבה וניטור שתן',
          'מתן תרופות משככות כאב ומניעת זיהום',
          'מניעת פציעות לחץ ושמירה על חום גוף',
          'תקשורת מצב לפינוי רפואי',
        ],
      },
    ],
  },
};

// Full-run track: all phases in sequence
PROTOCOLS.fullrun = {
  label: 'מסלול מלא',
  subtitle: 'X-CARE → CARE → PFC',
  phases: [
    ...PROTOCOLS.xcare.phases.map(p => ({ ...p, _trackLabel: 'X-CARE' })),
    ...PROTOCOLS.care.phases.map(p => ({ ...p, _trackLabel: 'CARE' })),
    ...PROTOCOLS.pfc.phases.map(p => ({ ...p, _trackLabel: 'PFC' })),
  ],
};

const TRACK_COLOR = {
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
  phaseSeenIndices: new Set(),
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
        // fullrun phased: skip phase picker, auto-start at phase 0
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
        phaseSeenIndices:   new Set([...state.phaseSeenIndices,   a.key]),
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
    .replace(/[—–\-‐]/g, '')
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
// GLOBAL CSS  (injected once in App)
// ============================================================
const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body { margin: 0; padding: 0; background: #0a0a0a; overscroll-behavior: none; }
  button { touch-action: manipulation; font-family: inherit; }
  input, textarea { -webkit-appearance: none; appearance: none; font-family: inherit; }
  input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
  ::-webkit-scrollbar { display: none; }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes correctGlow {
    0%   { box-shadow: 0 0 0 3px rgba(39,174,96,0.35); }
    100% { box-shadow: none; }
  }
  @keyframes wrongShake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-8px); }
    60%     { transform: translateX(8px); }
    80%     { transform: translateX(-3px); }
  }
  @keyframes popIn {
    0%   { transform: scale(0.88); opacity: 0; }
    60%  { transform: scale(1.04); opacity: 1; }
    100% { transform: scale(1); }
  }
  @keyframes streakPop {
    0%,100% { transform: scale(1); }
    50%     { transform: scale(1.18); }
  }

  .screen     { animation: slideUp 0.18s ease both; }
  .card-ok    { animation: correctGlow 0.7s ease forwards; }
  .card-wrong { animation: wrongShake 0.32s ease; }
  .badge-pop  { animation: popIn 0.35s ease both; }
  .streak-pop { animation: streakPop 0.35s ease; }
`;

// ============================================================
// DESIGN TOKENS
// ============================================================
const SURFACE  = 'rgba(255,255,255,0.05)';
const BORDER   = 'rgba(255,255,255,0.09)';
const FONT     = '"Segoe UI", system-ui, Arial, sans-serif';

const S = {
  app: {
    minHeight: '100dvh', background: '#0a0a0a', color: '#fff',
    fontFamily: FONT, direction: 'rtl',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '0 0 96px',
  },
  wrap: { width: '100%', maxWidth: 480, padding: '0 16px' },
  card: {
    background: SURFACE, border: `1px solid ${BORDER}`,
    borderRadius: 14, backdropFilter: 'blur(12px)', padding: 20,
  },
  badge: (size, color) => ({
    width: size, height: size, borderRadius: '50%', background: color,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.34, fontWeight: 800, color: '#fff', flexShrink: 0,
    letterSpacing: -0.5,
  }),
  label: {
    fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)', fontWeight: 600,
  },
  backBtn: {
    background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)',
    fontSize: 13, padding: '10px 0', marginTop: 10, cursor: 'pointer',
  },
};

function pillStyle(active, color = '#c0392b') {
  return {
    padding: '10px 20px', borderRadius: 50, fontSize: 14, fontFamily: FONT,
    border: active ? `1px solid ${color}` : `1px solid ${BORDER}`,
    background: active ? color : 'transparent',
    color: '#fff', cursor: 'pointer', transition: 'all 0.14s',
    minHeight: 44,
  };
}

// ============================================================
// SHARED PRIMITIVES
// ============================================================
function NavCard({ onClick, color = TRACK_COLOR.xcare, accent = false, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...S.card,
        display: 'block', width: '100%', textAlign: 'right', cursor: 'pointer',
        transition: 'all 0.15s',
        borderColor: hov ? color : BORDER,
        boxShadow: hov ? `0 0 0 1px ${color}33, 0 6px 24px ${color}18` : 'none',
        transform: hov ? 'translateY(-1px)' : 'none',
        ...(accent ? { borderRight: `3px solid ${color}` } : {}),
      }}
    >
      {children}
    </button>
  );
}

function ScoreHUD({ score, streak, total }) {
  const [popKey, setPopKey] = useState(0);
  const prevStreak = useRef(streak);

  useEffect(() => {
    if (streak > prevStreak.current && streak >= 3) setPopKey(k => k + 1);
    prevStreak.current = streak;
  }, [streak]);

  return (
    <div style={{
      position: 'fixed', top: 14, left: 12, zIndex: 999,
      background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`,
      borderRadius: 20, padding: '5px 12px',
      fontFamily: 'monospace', fontSize: 12, direction: 'ltr',
      backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span style={{ color: 'rgba(255,255,255,0.55)' }}>{score}<span style={{ color: 'rgba(255,255,255,0.2)' }}>/{total}</span></span>
      {streak >= 3 && (
        <span key={popKey} className="streak-pop" style={{ color: '#e74c3c', fontWeight: 700, fontSize: 13 }}>
          ×{streak}
        </span>
      )}
    </div>
  );
}

function ProgressRing({ cleared, total, color = '#e74c3c' }) {
  const r = 14, circ = 2 * Math.PI * r, pct = total ? cleared / total : 0;
  return (
    <svg width={36} height={36} style={{ flexShrink: 0 }}>
      <circle cx={18} cy={18} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={2.5} />
      <circle
        cx={18} cy={18} r={r} fill="none"
        stroke={pct >= 1 ? '#27ae60' : color}
        strokeWidth={2.5} strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)} strokeLinecap="round"
        transform="rotate(-90 18 18)" style={{ transition: 'stroke-dashoffset 0.4s' }}
      />
      <text x={18} y={22} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize={9} fontFamily={FONT}>
        {cleared}/{total}
      </text>
    </svg>
  );
}

// ============================================================
// SELECTOR SCREENS
// ============================================================
function TrackSelector({ dispatch }) {
  const entries = Object.entries(PROTOCOLS);
  const ICONS   = { xcare: 'X', care: 'C', pfc: 'P', fullrun: '∞' };
  return (
    <div style={S.wrap} className="screen">
      <div style={{ textAlign: 'center', padding: '48px 0 32px' }}>
        <div style={{ ...S.label, marginBottom: 10 }}>חזרה על סכמות</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>SchemeMaster</h1>
        <div style={{ marginTop: 6, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>בחר פרוטוקול לחזרה</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {entries.map(([key, proto]) => (
          <NavCard key={key} onClick={() => dispatch({ type: 'SELECT_TRACK', track: key })}
            color={TRACK_COLOR[key]} accent>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={S.badge(50, TRACK_COLOR[key])}>{ICONS[key]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 17 }}>{proto.label}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{proto.subtitle}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', marginTop: 3 }}>
                  {proto.phases.length} שלבים · {proto.phases.reduce((a, p) => a + p.bullets.length, 0)} סעיפים
                </div>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 18 }}>‹</span>
            </div>
          </NavCard>
        ))}
      </div>
    </div>
  );
}

function ModeSelector({ track, dispatch }) {
  const color = TRACK_COLOR[track];
  return (
    <div style={S.wrap} className="screen">
      <div style={{ textAlign: 'center', padding: '44px 0 28px' }}>
        <div style={{ ...S.label, marginBottom: 8, color }}>{PROTOCOLS[track].label}</div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>בחר מצב</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { key: 'free',   label: 'חופשי',          desc: 'שאלות אקראיות מכל שלבי הפרוטוקול' },
          { key: 'phased', label: 'שלב אחר שלב', desc: track === 'fullrun' ? 'עובר את כל הסכמות בסדר — X-CARE → CARE → PFC' : 'מתמקד בשלב אחד, עם מעקב התקדמות' },
        ].map(({ key, label, desc }) => (
          <NavCard key={key} color={color} onClick={() => dispatch({ type: 'SELECT_MODE', mode: key })}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{label}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{desc}</div>
          </NavCard>
        ))}
      </div>
      <button style={S.backBtn} onClick={() => dispatch({ type: 'RESET' })}>← חזור</button>
    </div>
  );
}

function DifficultySelector({ track, mode, dispatch }) {
  const color = TRACK_COLOR[track];
  return (
    <div style={S.wrap} className="screen">
      <div style={{ textAlign: 'center', padding: '44px 0 28px' }}>
        <div style={{ ...S.label, marginBottom: 8, color }}>{PROTOCOLS[track].label}</div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>רמת קושי</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { key: 'easy',   label: 'קל',     desc: 'מילה בודדת חסרה — הקשר המלא נראה' },
          { key: 'medium', label: 'בינוני', desc: 'מחצית שנייה חסרה — תחילת המשפט גלויה' },
          { key: 'hard',   label: 'קשה',    desc: 'רק כותרת השלב — כתוב את הסעיף מהזיכרון' },
        ].map(({ key, label, desc }) => (
          <NavCard key={key} color={color} onClick={() => dispatch({ type: 'SELECT_DIFFICULTY', difficulty: key })}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{label}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{desc}</div>
          </NavCard>
        ))}
      </div>
      <button style={S.backBtn} onClick={() => dispatch({ type: 'SELECT_MODE', mode })}>← חזור</button>
    </div>
  );
}

function PhaseSelector({ track, dispatch }) {
  const proto = PROTOCOLS[track];
  const color = TRACK_COLOR[track];
  return (
    <div style={S.wrap} className="screen">
      <div style={{ textAlign: 'center', padding: '44px 0 28px' }}>
        <div style={{ ...S.label, marginBottom: 8, color }}>{proto.label}</div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>בחר שלב</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {proto.phases.map((phase, idx) => (
          <NavCard key={idx} color={color} onClick={() => dispatch({ type: 'SELECT_PHASE', phaseIdx: idx })}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '6px 0' }}>
              <div style={S.badge(46, color)}>{phase.letter}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 1.3 }}>
                {phase.title.split('—')[0].trim()}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)' }}>{phase.bullets.length} סעיפים</div>
            </div>
          </NavCard>
        ))}
      </div>
      <button style={S.backBtn} onClick={() => dispatch({ type: 'SELECT_MODE', mode: 'phased' })}>← חזור</button>
    </div>
  );
}

// ============================================================
// INLINE BLANK
// ============================================================
const INPUT_RESET = {
  background: 'transparent', border: 'none', outline: 'none',
  color: '#fff', fontFamily: FONT, fontSize: 16,
  padding: '2px 4px 4px', direction: 'rtl', textAlign: 'right',
};

function InlineBlank({ question, difficulty, trackColor, onSubmit, lastResult, onOverride, onNext }) {
  const [val, setVal] = useState('');
  const ref = useRef(null);
  const isHard = difficulty === 'hard';
  const locked = lastResult !== null;

  useEffect(() => {
    setVal('');
    // small delay so the card animation settles first
    const t = setTimeout(() => ref.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [question?.key]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !locked) { e.preventDefault(); onSubmit(val); }
  };

  const cardClass =
    lastResult === 'correct' || lastResult === 'override' ? 'card-ok'
      : lastResult === 'wrong' ? 'card-wrong'
        : '';

  const borderColor =
    lastResult === 'correct' || lastResult === 'override' ? '#27ae60'
      : lastResult === 'wrong' ? '#e74c3c'
        : BORDER;

  const inputW = Math.max(difficulty === 'medium' ? 130 : 70, (question?.target?.length ?? 8) * 9);

  return (
    <div className={cardClass} style={{ ...S.card, border: `1px solid ${borderColor}`, transition: 'border-color 0.2s', marginBottom: 12 }}>
      {/* mini phase context */}
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginBottom: 14, lineHeight: 1.4 }}>
        שלב {question?.phase?.letter}
        {question?.phase?._trackLabel && (
          <span style={{ marginRight: 6, color: trackColor, fontWeight: 600 }}>{question.phase._trackLabel}</span>
        )}
        {' — '}{question?.phase?.title?.split('—')[0].trim()}
      </div>

      {/* question body */}
      {isHard ? (
        <>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>כתוב את הסעיף המלא:</div>
          <textarea
            ref={ref} value={val} rows={3}
            onChange={e => !locked && setVal(e.target.value)}
            onKeyDown={handleKey}
            style={{
              ...INPUT_RESET, width: '100%',
              border: `1px solid rgba(255,255,255,0.14)`, borderRadius: 10,
              padding: 12, resize: 'none', lineHeight: 1.8, fontSize: 16,
            }}
          />
        </>
      ) : (
        <div style={{ fontSize: 16, lineHeight: 2.4, direction: 'rtl', wordBreak: 'break-word', flexWrap: 'wrap' }}>
          {question?.prefix && <span>{question.prefix} </span>}
          <input
            ref={ref} type="text" value={val} placeholder="___" disabled={locked}
            onChange={e => !locked && setVal(e.target.value)}
            onKeyDown={handleKey}
            style={{
              ...INPUT_RESET,
              display: 'inline', verticalAlign: 'baseline',
              borderBottom: `2px solid ${locked ? 'rgba(255,255,255,0.15)' : trackColor}`,
              width: inputW, cursor: locked ? 'default' : 'text',
              transition: 'border-color 0.15s',
            }}
          />
          {question?.suffix && <span> {question.suffix}</span>}
        </div>
      )}

      {/* submit row */}
      {!locked && (
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => onSubmit(val)}
            style={{
              padding: '9px 24px', borderRadius: 10, border: 'none',
              background: trackColor, color: '#fff', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', minHeight: 44,
            }}
          >
            בדוק
          </button>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)' }}>או לחץ Enter</span>
        </div>
      )}

      {/* wrong feedback */}
      {lastResult === 'wrong' && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 13, color: '#e74c3c', lineHeight: 1.7, marginBottom: 10, borderRight: '2px solid #e74c3c44', paddingRight: 10 }}>
            <span style={{ opacity: 0.6 }}>תשובה נכונה: </span>
            <span style={{ fontWeight: 600 }}>{question?.target}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={onOverride} style={pillStyle(false)}>סמן כנכון בכל זאת</button>
            <button onClick={onNext}     style={pillStyle(true, trackColor)}>הבא ←</button>
          </div>
        </div>
      )}

      {/* correct / override feedback */}
      {(lastResult === 'correct' || lastResult === 'override') && (
        <div style={{ marginTop: 12, fontSize: 13, color: '#27ae60', fontWeight: 600 }}>
          {lastResult === 'override' ? 'נסמן כנכון ✓' : 'נכון ✓'}
        </div>
      )}
    </div>
  );
}

// ============================================================
// PHASE COMPLETE
// ============================================================
function PhaseCompleteScreen({ state, dispatch }) {
  const proto  = PROTOCOLS[state.track];
  const phase  = proto.phases[state.activePhaseIdx];
  const isLast = state.activePhaseIdx >= proto.phases.length - 1;
  const color  = TRACK_COLOR[state.track];
  const elapsed = Math.floor((Date.now() - state.phaseStartTime) / 1000);
  const accuracy = state.totalAnswered
    ? Math.round(((state.totalAnswered - state.sessionWrong) / state.totalAnswered) * 100)
    : 100;

  const isRunComplete = isLast && state.track === 'fullrun';

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#0a0a0a',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', zIndex: 500, direction: 'rtl', padding: 28,
    }} className="screen">
      <div className="badge-pop" style={S.badge(88, isRunComplete ? '#27ae60' : color)}>
        {isRunComplete ? '✓' : phase.letter}
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 800, margin: '22px 0 6px', textAlign: 'center', letterSpacing: -0.5 }}>
        {isRunComplete ? 'מסלול הושלם! 🎉' : 'שלב הושלם ✓'}
      </h2>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, textAlign: 'center', marginBottom: 40 }}>
        {isRunComplete ? 'X-CARE · CARE · PFC' : phase.title}
      </div>

      <div style={{ display: 'flex', gap: 36, marginBottom: 48 }}>
        {[
          { v: `${accuracy}%`, l: 'דיוק' },
          { v: `${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')}`, l: 'זמן' },
          { v: `${state.phaseClearedIndices.size}/${phase.bullets.length}`, l: 'סעיפים' },
        ].map(({ v, l }) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color }}>{v}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => dispatch({ type: 'RETRY_PHASE' })} style={pillStyle(false)}>
          חזור לשלב
        </button>
        {!isLast && (
          <button
            onClick={() => dispatch({ type: 'NEXT_PHASE', phaseIdx: state.activePhaseIdx + 1 })}
            style={pillStyle(true, color)}
          >
            {state.track === 'fullrun' ? 'ממשיך →' : 'השלב הבא →'}
          </button>
        )}
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          style={pillStyle(false)}
        >
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
  const color = TRACK_COLOR[track];

  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; });

  const genQuestion = useCallback(() => {
    const s = stateRef.current;
    dispatch({
      type: 'SET_QUESTION',
      question: pickQuestion(
        PROTOCOLS[s.track], s.mode, s.activePhaseIdx,
        s.difficulty, s.phaseSeenIndices, s.currentQuestion?.key ?? null
      ),
    });
  }, [dispatch]);

  const advance = useCallback(() => {
    const s = stateRef.current;
    const phaseSize = s.mode === 'phased'
      ? PROTOCOLS[s.track].phases[s.activePhaseIdx].bullets.length
      : Infinity;
    if (s.phaseClearedIndices.size >= phaseSize) {
      dispatch({ type: 'SET_SCREEN', screen: 'phaseComplete' });
    } else {
      genQuestion();
    }
  }, [dispatch, genQuestion]);

  const advanceRef = useRef(advance);
  useEffect(() => { advanceRef.current = advance; }, [advance]);

  useEffect(() => { genQuestion(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (lastResult === 'correct' || lastResult === 'override') {
      const t = setTimeout(() => advanceRef.current(), 750);
      return () => clearTimeout(t);
    }
  }, [lastResult]);

  const handleSubmit = (val) => {
    if (lastResult !== null || !currentQuestion) return;
    const ok = normalize(val) === normalize(currentQuestion.target);
    dispatch({ type: ok ? 'ANSWER_CORRECT' : 'ANSWER_WRONG', key: currentQuestion.key });
  };

  const phase      = currentQuestion?.phase ?? (activePhaseIdx !== null ? proto.phases[activePhaseIdx] : null);
  const phaseTotal = mode === 'phased' ? proto.phases[activePhaseIdx].bullets.length : null;

  // For full-run: show global progress
  const totalPhases    = proto.phases.length;
  const currentPhaseNo = (activePhaseIdx ?? 0) + 1;

  if (!currentQuestion) {
    return <div style={{ ...S.wrap, paddingTop: 56, textAlign: 'center', color: 'rgba(255,255,255,0.25)' }}>טוען...</div>;
  }

  return (
    <div style={S.wrap} className="screen">
      <ScoreHUD score={state.score} streak={state.streak} total={state.totalAnswered} />

      {/* Full-run chapter progress bar */}
      {track === 'fullrun' && mode === 'phased' && (
        <div style={{ paddingTop: 20, marginBottom: -4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
              שלב {currentPhaseNo} מתוך {totalPhases}
            </span>
            <span style={{ fontSize: 10, color, fontWeight: 600 }}>
              {phase?._trackLabel}
            </span>
          </div>
          <div style={{ height: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 1 }}>
            <div style={{
              height: '100%', background: color, borderRadius: 1,
              width: `${(currentPhaseNo / totalPhases) * 100}%`,
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      )}

      {/* Phase header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '26px 0 18px' }}>
        <div className="badge-pop" style={S.badge(56, color)}>{phase?.letter ?? '?'}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...S.label, color }}>{proto.label}</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4, lineHeight: 1.35, color: '#fff' }}>
            {phase?.title}
          </div>
        </div>
        {mode === 'phased' && phaseTotal !== null && (
          <ProgressRing cleared={phaseClearedIndices.size} total={phaseTotal} color={color} />
        )}
      </div>

      <InlineBlank
        question={currentQuestion}
        difficulty={difficulty}
        trackColor={color}
        onSubmit={handleSubmit}
        lastResult={lastResult}
        onOverride={() => dispatch({ type: 'ANSWER_OVERRIDE', key: currentQuestion.key })}
        onNext={advance}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <button style={S.backBtn} onClick={() => dispatch({ type: 'RESET' })}>← התחל מחדש</button>
        {mode === 'phased' && track !== 'fullrun' && (
          <button style={S.backBtn} onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'phase' })}>שנה שלב</button>
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
    <div style={S.app}>
      {(SCREENS[state.screen] ?? SCREENS.track)(state, dispatch)}
    </div>
  );
}
