import React, { useReducer, useEffect, useRef, useCallback } from 'react';

// ============================================================
// PROTOCOL DATA — fill in bullets here, everything else is generated
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
          'הסגת עליונים',
          'הגנה לנפש - מחמה ראשוני על ידי חילוץ עצמי או על ידי כוח שהוגדר לכך',
          'עצירת נקודת דימום פורץ עצמאית או על ידי לוחם/טפל סמוך',
        ],
      },
      {
        letter: 'EX',
        title: 'EXtract — חילוץ והערכה',
        bullets: [
          'הגנה לסביבה מאובטחת/בטוחה',
          'התרשמות ראשונית מהירה - מנגנון הפציעה, בחינה יזואלית ופניה לפצוע',
          'דיווח אנכי - פניה, תיאור האירוע, מיקום, מספר פצועים ודחיפות פינוי',
        ],
      },
      {
        letter: 'C',
        title: 'Circulation — מחזור הדם',
        bullets: [
          'עצירת דימום פורץ - במידה ובוצע קדם, וידאו שהדימום נעצר',
          'תיפוס אחר פציעות ומקורות דימום: גו, בנפיים, בסתרים - תוך ביצוע הפשטה: ראש, חזה, עורף, בתי שחי, גב, גפיים',
          'עצירת נקודות ומפשטות - עצירת דימום שוזה',
          'בדיקת הכרה לפי AVPU',
          'בהעדר נשימה או החזרה לנצב לכאב - ביצוע JT והחדרת AW',
          'בטראומה ישירה לנתיב האוויר - סילוק הפרשות והשבה',
          'מדידת לחץ דם',
          'מדידת דופק איכותית וכמותית',
          'מדידת ריווי חמצן (סטורציה)',
          'בהלם עמוק על פי הקריטריונים - הנחיית חובש להשגת גישה לחזור הדם והכנת מוצרי דם',
        ],
      },
      {
        letter: 'A',
        title: 'Airway — נתיב אוויר',
        bullets: [
          'הגנה לנתיב האוויר ופתיחתו',
          'שימוש באמצעים בסיסיים לניהול נתיב האוויר',
          'פתיחת פה וסילוק הפרשות',
          'חשיפה',
        ],
      },
      {
        letter: 'R',
        title: 'Respiration — נשימה',
        bullets: [
          'הערכה בחמצן',
          'בהיעדר נשימה - הנשמה באמצעות אמבו ונסיכה',
          'בחשד לפגיעה - שמירה על עמש"צ',
          'חשיפת בית החזה והתרשמות סיסמי חבלה',
        ],
      },
      {
        letter: 'E',
        title: 'Exposure & Evacuation — חשיפה ופינוי',
        bullets: [
          'וידאו הפשטה מלאה - הפיכה, איתור כלל הפציעות, עצירת דימום בזוהה',
          'ראש - התרשמות סיסמי חבלה',
          'עמש"צ - בחשד לפגיעה - נחת צוואר וקיבוע',
          'אגן - הרכה וביצוע כריכת אגן',
          'כיסוי, חימום, העמסת האלונקה',
          'חינוך מצב - סיכום ממצאים, הגדרת דחיפות הפינוי',
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
          'הערכה חוזרת של נתיב אוויר וניהול שמרני',
          'או על ידי התערבות',
        ],
      },
      {
        letter: 'R',
        title: 'Respiration — המשך נשימה',
        bullets: [
          'הערכה בחמצן',
          'בפצוע מנושם - חיבור לנשם וכוונות תרופות הרדמה להמשך',
          'הנחיית ניהול פצוע חזה מנושם',
        ],
      },
      {
        letter: 'E',
        title: 'Everything Else — כל השאר',
        bullets: [
          'הכרה לכאב וסטטוס נוירולוגי',
          'מניעת היתקנות - שיטות פציעים - טיפול אנטיביוטי',
          'הכרת GCS, התרשמות מתנועות ידיים ובדיקת אישונים',
          'סריקה גופנית מלאה מהקודקוד ועד לבהונות הרגליים - טיפול בכל פציעה מזוהה בדרך',
          'קיבוע עצמות שבורות',
          'וידאו כלל הקיבועים',
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
          'ניטור ותיעוד הסימנים הימניים באופן תדיר ומחזורי',
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
          'או על ידי התערבות',
        ],
      },
      {
        letter: 'R',
        title: 'Respiration — נשימה ממושכת',
        bullets: [
          'הפשטה בחמצן',
          'בפצוע מנושם - חיבור לנשם וכוונות תרופות הרדמה להמשך',
          'הנחיית ניהול פצוע חזה מנושם',
          'הכרת רצף קידמת תגמול/קרב',
        ],
      },
      {
        letter: 'E',
        title: 'Everything Else — ניהול ממושך',
        bullets: [
          'מניעת היתקנות - שיטות פציעים - טיפול אנטיביוטי',
          'הכרת GCS, התרשמות מתנועות ידיים ובדיקת אישונים',
          'סריקה גופנית מלאה מהקודקוד ועד לבהונות הרגליים',
          'קיבוע עצמות שבורות ורצף קיבועים',
          'וידאו כלל הקיבועים',
          'השלמת תיעוד ב-101 דיגיטלי או ידני',
          'הכרת קידמת תגמול/קרב וביצוע התערבות',
          'העברת דיווח רופאי לחזור',
        ],
      },
      {
        letter: 'PFC+',
        title: 'PFC — טיפול ממושך נוסף',
        bullets: [
          'ניטור ותיעוד הסימנים הימניים באופן תדיר ומחזורי',
          'ניטור ותיעוד הסימנים החיוניים וניהול תיעוד שוטף',
          'הכנסת זונדה לניקוז הקיבה וניטור שתן',
          'מתן תרופות משככות כאב ומניעת זיהום',
          'מניעת פציעות לחץ ושמירה על חום גוף',
          'תקשורת מצב לפינוי רפואי',
        ],
      },
    ],
  },
};

// ============================================================
// STATE & REDUCER
// ============================================================
const INIT = {
  screen: 'track',       // track|mode|difficulty|phase|game|phaseComplete
  track: null,
  mode: null,            // free|phased
  difficulty: null,      // easy|medium|hard
  activePhaseIdx: null,
  score: 0,
  streak: 0,
  totalAnswered: 0,
  sessionWrong: 0,
  phaseSeenIndices: new Set(),
  phaseClearedIndices: new Set(),
  currentQuestion: null,
  lastResult: null,      // null|correct|wrong|override
  phaseStartTime: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_TRACK':
      return { ...INIT, screen: 'mode', track: action.track };
    case 'SELECT_MODE':
      return {
        ...state,
        mode: action.mode,
        screen: action.mode === 'phased' ? 'phase' : 'difficulty',
      };
    case 'SELECT_PHASE':
      return {
        ...state,
        activePhaseIdx: action.phaseIdx,
        screen: 'difficulty',
        phaseSeenIndices: new Set(),
        phaseClearedIndices: new Set(),
        phaseStartTime: null,
        currentQuestion: null,
        lastResult: null,
      };
    case 'SELECT_DIFFICULTY':
      return {
        ...state,
        difficulty: action.difficulty,
        screen: 'game',
        phaseStartTime: Date.now(),
        currentQuestion: null,
        lastResult: null,
      };
    case 'SET_QUESTION':
      return { ...state, currentQuestion: action.question, lastResult: null };
    case 'ANSWER_CORRECT': {
      const seen = new Set([...state.phaseSeenIndices, action.key]);
      const cleared = new Set([...state.phaseClearedIndices, action.key]);
      return {
        ...state,
        score: state.score + 1,
        streak: state.streak + 1,
        totalAnswered: state.totalAnswered + 1,
        lastResult: 'correct',
        phaseSeenIndices: seen,
        phaseClearedIndices: cleared,
      };
    }
    case 'ANSWER_WRONG': {
      const seen = new Set([...state.phaseSeenIndices, action.key]);
      return {
        ...state,
        streak: 0,
        totalAnswered: state.totalAnswered + 1,
        sessionWrong: state.sessionWrong + 1,
        lastResult: 'wrong',
        phaseSeenIndices: seen,
      };
    }
    case 'ANSWER_OVERRIDE': {
      const cleared = new Set([...state.phaseClearedIndices, action.key]);
      return { ...state, lastResult: 'override', phaseClearedIndices: cleared };
    }
    case 'SET_SCREEN':
      return { ...state, screen: action.screen };
    case 'RETRY_PHASE':
      return {
        ...state,
        screen: 'game',
        phaseSeenIndices: new Set(),
        phaseClearedIndices: new Set(),
        phaseStartTime: Date.now(),
        currentQuestion: null,
        lastResult: null,
      };
    case 'NEXT_PHASE':
      return {
        ...state,
        screen: 'game',
        activePhaseIdx: action.phaseIdx,
        phaseSeenIndices: new Set(),
        phaseClearedIndices: new Set(),
        phaseStartTime: Date.now(),
        currentQuestion: null,
        lastResult: null,
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
  return s
    .trim()
    .replace(/[׳״׳״’“”"]/g, '')
    .replace(/[-‐-―]/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function buildQuestion(bullets, phaseIdx, difficulty, seenSet, lastKey) {
  const keys = bullets.map((_, i) => `${phaseIdx}_${i}`);
  const unseen = keys.filter(k => !seenSet.has(k) && k !== lastKey);
  const pool = unseen.length > 0 ? unseen : keys.filter(k => k !== lastKey).concat(lastKey !== null ? [] : keys);
  const eligible = pool.length > 0 ? pool : keys;
  const key = eligible[Math.floor(Math.random() * eligible.length)];
  const bulletIdx = parseInt(key.split('_')[1], 10);
  const bullet = bullets[bulletIdx];
  const words = bullet.split(' ');

  let prefix = '', suffix = '', target = '';

  if (difficulty === 'easy') {
    if (words.length <= 2) {
      target = words[words.length - 1];
      prefix = words.slice(0, -1).join(' ');
    } else {
      const bi = Math.floor(words.length / 2);
      target = words[bi];
      prefix = words.slice(0, bi).join(' ');
      suffix = words.slice(bi + 1).join(' ');
    }
  } else if (difficulty === 'medium') {
    const mid = Math.ceil(words.length / 2);
    prefix = words.slice(0, mid).join(' ');
    target = words.slice(mid).join(' ');
  } else {
    target = bullet;
  }

  return { key, bulletIdx, phaseIdx, bullet, prefix, suffix, target };
}

function buildFreeQuestion(proto, difficulty, lastKey, seenSet) {
  // Pick a random phase weighted by bullet count
  const allBullets = proto.phases.flatMap((ph, pi) =>
    ph.bullets.map((b, bi) => ({ key: `${pi}_${bi}`, phaseIdx: pi, bulletIdx: bi, bullet: b }))
  );
  const unseen = allBullets.filter(b => !seenSet.has(b.key) && b.key !== lastKey);
  const pool = unseen.length > 0 ? unseen : allBullets.filter(b => b.key !== lastKey);
  const eligible = pool.length > 0 ? pool : allBullets;
  const pick = eligible[Math.floor(Math.random() * eligible.length)];
  const phase = proto.phases[pick.phaseIdx];
  const words = pick.bullet.split(' ');

  let prefix = '', suffix = '', target = '';

  if (difficulty === 'easy') {
    if (words.length <= 2) {
      target = words[words.length - 1];
      prefix = words.slice(0, -1).join(' ');
    } else {
      const bi = Math.floor(words.length / 2);
      target = words[bi];
      prefix = words.slice(0, bi).join(' ');
      suffix = words.slice(bi + 1).join(' ');
    }
  } else if (difficulty === 'medium') {
    const mid = Math.ceil(words.length / 2);
    prefix = words.slice(0, mid).join(' ');
    target = words.slice(mid).join(' ');
  } else {
    target = pick.bullet;
  }

  return { ...pick, phase, prefix, suffix, target };
}

// ============================================================
// COMPONENTS
// ============================================================

const S = {
  app: {
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#fff',
    fontFamily: '"Segoe UI", Arial, sans-serif',
    direction: 'rtl',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 0 96px',
  },
  wrap: {
    width: '100%',
    maxWidth: 480,
    padding: '0 16px',
    boxSizing: 'border-box',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    backdropFilter: 'blur(12px)',
    padding: 20,
  },
  pill: (active) => ({
    padding: '9px 18px',
    borderRadius: 50,
    border: active ? '1px solid #c0392b' : '1px solid rgba(255,255,255,0.15)',
    background: active ? '#c0392b' : 'transparent',
    color: '#fff',
    cursor: 'pointer',
    fontFamily: '"Segoe UI", Arial, sans-serif',
    fontSize: 14,
    transition: 'all 0.12s',
  }),
  badge: (size = 64, color = '#c0392b') => ({
    width: size,
    height: size,
    borderRadius: '50%',
    background: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size * 0.35,
    fontWeight: 700,
    color: '#fff',
    flexShrink: 0,
    letterSpacing: -0.5,
  }),
  label: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)',
  },
  back: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.35)',
    cursor: 'pointer',
    fontFamily: '"Segoe UI", Arial, sans-serif',
    fontSize: 13,
    padding: '10px 0',
    marginTop: 12,
  },
};

// ── Score HUD ──────────────────────────────────────────────
function ScoreHUD({ score, streak, total }) {
  return (
    <div style={{
      position: 'fixed', top: 14, left: 16, fontFamily: 'monospace',
      fontSize: 12, color: 'rgba(255,255,255,0.3)', direction: 'ltr', zIndex: 999,
    }}>
      <div>{score}<span style={{ color: 'rgba(255,255,255,0.15)' }}>/{total}</span></div>
      {streak >= 3 && (
        <div style={{ color: '#c0392b', fontWeight: 700 }}>×{streak}</div>
      )}
    </div>
  );
}

// ── Progress Ring ──────────────────────────────────────────
function ProgressRing({ cleared, total }) {
  const r = 13, circ = 2 * Math.PI * r;
  const pct = total ? cleared / total : 0;
  return (
    <svg width={34} height={34} style={{ flexShrink: 0 }}>
      <circle cx={17} cy={17} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={2.5} />
      <circle
        cx={17} cy={17} r={r} fill="none"
        stroke={pct >= 1 ? '#27ae60' : '#c0392b'}
        strokeWidth={2.5}
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round"
        transform="rotate(-90 17 17)"
        style={{ transition: 'stroke-dashoffset 0.35s' }}
      />
      <text x={17} y={21} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={9}
        fontFamily='"Segoe UI", Arial, sans-serif'>
        {cleared}/{total}
      </text>
    </svg>
  );
}

// ── Track Selector ─────────────────────────────────────────
function TrackSelector({ dispatch }) {
  return (
    <div style={S.wrap}>
      <div style={{ textAlign: 'center', padding: '40px 0 28px' }}>
        <div style={S.label}>חזרה על סכמות</div>
        <h1 style={{ margin: '8px 0 0', fontSize: 22, fontWeight: 700 }}>בחר פרוטוקול</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Object.entries(PROTOCOLS).map(([key, proto]) => (
          <button
            key={key}
            onClick={() => dispatch({ type: 'SELECT_TRACK', track: key })}
            style={{
              ...S.card,
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', gap: 16,
              cursor: 'pointer', textAlign: 'right', transition: 'border-color 0.12s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(192,57,43,0.6)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          >
            <div style={S.badge(48)}>
              {key === 'xcare' ? 'X' : key === 'care' ? 'C' : 'P'}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17 }}>{proto.label}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>
                {proto.subtitle}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>
                {proto.phases.length} שלבים · {proto.phases.reduce((a, p) => a + p.bullets.length, 0)} סעיפים
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Mode Selector ──────────────────────────────────────────
function ModeSelector({ dispatch }) {
  const modes = [
    { key: 'free', label: 'חופשי', desc: 'שאלות אקראיות מכל הפרוטוקול' },
    { key: 'phased', label: 'שלב אחר שלב', desc: 'מתמקד בשלב אחד — עקוב אחרי ההתקדמות' },
  ];
  return (
    <div style={S.wrap}>
      <div style={{ textAlign: 'center', padding: '40px 0 28px' }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>בחר מצב</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {modes.map(m => (
          <button
            key={m.key}
            onClick={() => dispatch({ type: 'SELECT_MODE', mode: m.key })}
            style={{ ...S.card, cursor: 'pointer', textAlign: 'right', transition: 'border-color 0.12s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(192,57,43,0.6)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          >
            <div style={{ fontWeight: 700, fontSize: 16 }}>{m.label}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{m.desc}</div>
          </button>
        ))}
      </div>
      <button style={S.back} onClick={() => dispatch({ type: 'RESET' })}>← חזור</button>
    </div>
  );
}

// ── Difficulty Selector ────────────────────────────────────
function DifficultySelector({ dispatch, mode, track }) {
  const levels = [
    { key: 'easy', label: 'קל', desc: 'מילה בודדת חסרה — הקשר מלא משני הצדדים' },
    { key: 'medium', label: 'בינוני', desc: 'מחצית שנייה חסרה — תחילת המשפט גלויה' },
    { key: 'hard', label: 'קשה', desc: 'רק כותרת השלב — כתוב את הסעיף כולו' },
  ];
  const goBack = () => {
    if (mode === 'phased') dispatch({ type: 'SELECT_MODE', mode: 'phased' });
    else dispatch({ type: 'SELECT_MODE', mode: 'free' });
  };
  return (
    <div style={S.wrap}>
      <div style={{ textAlign: 'center', padding: '40px 0 28px' }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>רמת קושי</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {levels.map(lvl => (
          <button
            key={lvl.key}
            onClick={() => dispatch({ type: 'SELECT_DIFFICULTY', difficulty: lvl.key })}
            style={{ ...S.card, cursor: 'pointer', textAlign: 'right', transition: 'border-color 0.12s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(192,57,43,0.6)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          >
            <div style={{ fontWeight: 700, fontSize: 16 }}>{lvl.label}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{lvl.desc}</div>
          </button>
        ))}
      </div>
      <button style={S.back} onClick={goBack}>← חזור</button>
    </div>
  );
}

// ── Phase Selector ─────────────────────────────────────────
function PhaseSelector({ track, dispatch }) {
  const proto = PROTOCOLS[track];
  return (
    <div style={S.wrap}>
      <div style={{ textAlign: 'center', padding: '40px 0 28px' }}>
        <div style={S.label}>{proto.label}</div>
        <h2 style={{ margin: '8px 0 0', fontSize: 20, fontWeight: 700 }}>בחר שלב</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {proto.phases.map((phase, idx) => (
          <button
            key={idx}
            onClick={() => dispatch({ type: 'SELECT_PHASE', phaseIdx: idx })}
            style={{
              ...S.card,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 8, cursor: 'pointer', padding: 16, transition: 'border-color 0.12s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(192,57,43,0.6)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          >
            <div style={S.badge(44)}>{phase.letter}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 1.3 }}>
              {phase.title.split('—')[0].split('-')[0].trim()}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
              {phase.bullets.length} סעיפים
            </div>
          </button>
        ))}
      </div>
      <button style={S.back} onClick={() => dispatch({ type: 'SELECT_MODE', mode: 'phased' })}>← חזור</button>
    </div>
  );
}

// ── Inline Blank Question ──────────────────────────────────
function InlineBlank({ question, difficulty, onSubmit, lastResult, onOverride, onNext }) {
  const [val, setVal] = React.useState('');
  const inputRef = useRef(null);
  const isHard = difficulty === 'hard';

  // Reset & focus on new question
  useEffect(() => {
    setVal('');
    if (inputRef.current) {
      inputRef.current.focus();
      if (isHard && inputRef.current.setSelectionRange) {
        inputRef.current.setSelectionRange(0, 0);
      }
    }
  }, [question?.key]);

  const locked = lastResult !== null;

  const borderColor =
    lastResult === 'correct' || lastResult === 'override' ? '#27ae60'
      : lastResult === 'wrong' ? '#c0392b'
        : 'rgba(255,255,255,0.08)';

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !locked) {
      e.preventDefault();
      onSubmit(val);
    }
  };

  const inputBase = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.28)',
    outline: 'none',
    color: '#fff',
    fontFamily: '"Segoe UI", Arial, sans-serif',
    fontSize: 15,
    padding: '1px 4px 3px',
    direction: 'rtl',
    textAlign: 'right',
    cursor: locked ? 'default' : 'text',
  };

  const estimatedWidth = Math.max(60, ((question?.target?.length || 8) * 9));

  return (
    <div style={{
      ...S.card,
      border: `1px solid ${borderColor}`,
      transition: 'border-color 0.25s',
      marginBottom: 10,
    }}>
      {/* Phase mini-header */}
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
        שלב {question?.phase?.letter} — {question?.phase?.title?.split('—')[0].trim()}
      </div>

      {/* Question body */}
      {isHard ? (
        <div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>
            כתוב את הסעיף המלא:
          </div>
          <textarea
            ref={inputRef}
            value={val}
            onChange={e => !locked && setVal(e.target.value)}
            onKeyDown={handleKey}
            rows={3}
            style={{
              ...inputBase,
              width: '100%',
              boxSizing: 'border-box',
              borderBottom: 'none',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8,
              padding: 10,
              resize: 'none',
              lineHeight: 1.7,
            }}
          />
        </div>
      ) : (
        <div style={{ fontSize: 15, lineHeight: 2.2, direction: 'rtl', wordBreak: 'break-word' }}>
          {question?.prefix && <span>{question.prefix} </span>}
          <input
            ref={inputRef}
            type="text"
            value={val}
            onChange={e => !locked && setVal(e.target.value)}
            onKeyDown={handleKey}
            disabled={locked}
            placeholder="___"
            style={{
              ...inputBase,
              display: 'inline',
              verticalAlign: 'baseline',
              width: difficulty === 'medium'
                ? Math.max(120, estimatedWidth)
                : Math.max(60, estimatedWidth),
            }}
          />
          {question?.suffix && <span> {question.suffix}</span>}
        </div>
      )}

      {/* Submit button when no result yet */}
      {!locked && (
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-start' }}>
          <button
            onClick={() => onSubmit(val)}
            style={{
              padding: '8px 22px', borderRadius: 8, border: 'none',
              background: '#c0392b', color: '#fff', cursor: 'pointer',
              fontFamily: '"Segoe UI", Arial, sans-serif', fontSize: 14, fontWeight: 600,
            }}
          >
            בדוק
          </button>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', alignSelf: 'center', marginRight: 12 }}>
            Enter לבדיקה
          </div>
        </div>
      )}

      {/* Wrong state */}
      {lastResult === 'wrong' && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 13, color: '#c0392b', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 10 }}>
            תשובה נכונה: {question?.target}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={onOverride}
              style={{ ...S.pill(false), fontSize: 13, padding: '7px 14px' }}
            >
              סמן כנכון בכל זאת
            </button>
            <button
              onClick={onNext}
              style={{ ...S.pill(true), fontSize: 13, padding: '7px 14px' }}
            >
              הבא ←
            </button>
          </div>
        </div>
      )}

      {/* Correct/Override — brief flash feedback */}
      {(lastResult === 'correct' || lastResult === 'override') && (
        <div style={{ marginTop: 10, fontSize: 13, color: '#27ae60' }}>
          {lastResult === 'override' ? 'נסמן כנכון ✓' : 'נכון ✓'}
        </div>
      )}
    </div>
  );
}

// ── Phase Complete Screen ──────────────────────────────────
function PhaseCompleteScreen({ state, dispatch }) {
  const proto = PROTOCOLS[state.track];
  const phase = proto.phases[state.activePhaseIdx];
  const isLast = state.activePhaseIdx >= proto.phases.length - 1;
  const elapsed = Math.floor((Date.now() - state.phaseStartTime) / 1000);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const accuracy = state.totalAnswered
    ? Math.round(((state.totalAnswered - state.sessionWrong) / state.totalAnswered) * 100)
    : 100;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#0a0a0a',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', zIndex: 500, direction: 'rtl', padding: 24,
    }}>
      <div style={S.badge(80, '#27ae60')}>{phase.letter}</div>
      <h2 style={{ fontSize: 28, fontWeight: 700, margin: '20px 0 6px', textAlign: 'center' }}>
        שלב הושלם ✓
      </h2>
      <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, textAlign: 'center', marginBottom: 36 }}>
        {phase.title}
      </div>
      <div style={{ display: 'flex', gap: 32, marginBottom: 44 }}>
        {[
          { val: `${accuracy}%`, label: 'דיוק' },
          { val: `${mins}:${String(secs).padStart(2, '0')}`, label: 'זמן' },
          { val: `${state.phaseClearedIndices.size}/${phase.bullets.length}`, label: 'סעיפים' },
        ].map(({ val, label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 700 }}>{val}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => dispatch({ type: 'RETRY_PHASE' })} style={S.pill(false)}>
          חזור לשלב
        </button>
        {!isLast && (
          <button
            onClick={() => dispatch({ type: 'NEXT_PHASE', phaseIdx: state.activePhaseIdx + 1 })}
            style={S.pill(true)}
          >
            השלב הבא →
          </button>
        )}
        <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'phase' })} style={S.pill(false)}>
          בחר שלב אחר
        </button>
      </div>
    </div>
  );
}

// ── Game Screen ────────────────────────────────────────────
function GameScreen({ state, dispatch }) {
  const proto = PROTOCOLS[state.track];
  const { mode, difficulty, activePhaseIdx, phaseSeenIndices, phaseClearedIndices, currentQuestion, lastResult } = state;

  // Latest state in a ref so timeout callbacks aren't stale
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const genQuestion = useCallback(() => {
    const s = stateRef.current;
    const pr = PROTOCOLS[s.track];
    const lastKey = s.currentQuestion?.key ?? null;

    let q;
    if (s.mode === 'phased') {
      const phase = pr.phases[s.activePhaseIdx];
      q = buildQuestion(phase.bullets, s.activePhaseIdx, s.difficulty, s.phaseSeenIndices, lastKey);
      q.phase = phase;
    } else {
      q = buildFreeQuestion(pr, s.difficulty, lastKey, s.phaseSeenIndices);
    }
    dispatch({ type: 'SET_QUESTION', question: q });
  }, [dispatch]);

  const checkPhaseComplete = useCallback((clearedSet) => {
    const s = stateRef.current;
    if (s.mode !== 'phased') return false;
    const phase = PROTOCOLS[s.track].phases[s.activePhaseIdx];
    return clearedSet.size >= phase.bullets.length;
  }, []);

  const advance = useCallback(() => {
    const s = stateRef.current;
    if (checkPhaseComplete(s.phaseClearedIndices)) {
      dispatch({ type: 'SET_SCREEN', screen: 'phaseComplete' });
    } else {
      genQuestion();
    }
  }, [checkPhaseComplete, genQuestion, dispatch]);

  const advanceRef = useRef(advance);
  useEffect(() => { advanceRef.current = advance; }, [advance]);

  // Generate first question on mount
  useEffect(() => { genQuestion(); }, []); // eslint-disable-line

  // Auto-advance after correct/override with 700ms flash
  useEffect(() => {
    if (lastResult === 'correct' || lastResult === 'override') {
      const t = setTimeout(() => advanceRef.current(), 700);
      return () => clearTimeout(t);
    }
  }, [lastResult]);

  const handleSubmit = (val) => {
    if (lastResult !== null || !currentQuestion) return;
    const ok = normalize(val) === normalize(currentQuestion.target);
    if (ok) {
      dispatch({ type: 'ANSWER_CORRECT', key: currentQuestion.key });
    } else {
      dispatch({ type: 'ANSWER_WRONG', key: currentQuestion.key });
    }
  };

  const handleOverride = () => {
    dispatch({ type: 'ANSWER_OVERRIDE', key: currentQuestion.key });
  };

  const handleNext = () => {
    advance();
  };

  const phase = currentQuestion?.phase ?? (activePhaseIdx !== null ? proto.phases[activePhaseIdx] : null);
  const phaseTotal = mode === 'phased' && activePhaseIdx !== null ? proto.phases[activePhaseIdx].bullets.length : null;

  if (!currentQuestion) {
    return (
      <div style={{ ...S.wrap, paddingTop: 48, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
        טוען...
      </div>
    );
  }

  return (
    <div style={S.wrap}>
      <ScoreHUD score={state.score} streak={state.streak} total={state.totalAnswered} />

      {/* Phase header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '28px 0 18px' }}>
        <div style={S.badge(56)}>{phase?.letter ?? '?'}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={S.label}>{proto.label}</div>
          <div style={{ fontWeight: 600, fontSize: 15, marginTop: 3, lineHeight: 1.3 }}>
            {phase?.title}
          </div>
        </div>
        {mode === 'phased' && phaseTotal !== null && (
          <ProgressRing cleared={phaseClearedIndices.size} total={phaseTotal} />
        )}
      </div>

      <InlineBlank
        question={currentQuestion}
        difficulty={difficulty}
        onSubmit={handleSubmit}
        lastResult={lastResult}
        onOverride={handleOverride}
        onNext={handleNext}
      />

      {/* Footer nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <button style={S.back} onClick={() => dispatch({ type: 'RESET' })}>← התחל מחדש</button>
        {mode === 'phased' && (
          <button style={S.back} onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'phase' })}>
            שנה שלב
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// APP ROOT
// ============================================================
export default function App() {
  const [state, dispatch] = useReducer(reducer, INIT);

  const render = () => {
    switch (state.screen) {
      case 'track':        return <TrackSelector dispatch={dispatch} />;
      case 'mode':         return <ModeSelector dispatch={dispatch} />;
      case 'difficulty':   return <DifficultySelector dispatch={dispatch} mode={state.mode} track={state.track} />;
      case 'phase':        return <PhaseSelector track={state.track} dispatch={dispatch} />;
      case 'game':         return <GameScreen state={state} dispatch={dispatch} />;
      case 'phaseComplete':return <PhaseCompleteScreen state={state} dispatch={dispatch} />;
      default:             return <TrackSelector dispatch={dispatch} />;
    }
  };

  return <div style={S.app}>{render()}</div>;
}
