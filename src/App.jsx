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
// VISUAL LAYER — Surgical minimalism with warmth
// ============================================================
const HEEBO = "'Heebo', system-ui, -apple-system, sans-serif";
const MONO  = "'JetBrains Mono', ui-monospace, monospace";
const ACCENT_GRAD = 'linear-gradient(135deg, #e63946 0%, #c0202e 100%)';

const HE_ORDINALS = [
  'ראשון','שני','שלישי','רביעי','חמישי',
  'שישי','שביעי','שמיני','תשיעי','עשירי','אחד עשר','שנים עשר',
];

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;900&family=JetBrains+Mono:wght@400;600&display=swap');

  :root {
    --bg-top: #0d0d0d;
    --bg-bottom: #060608;
    --surface: #111114;
    --surface-grad: linear-gradient(145deg, #161619 0%, #0f0f12 100%);
    --surface-2: #1c1c20;
    --surface-2-grad: linear-gradient(145deg, #202024 0%, #181820 100%);
    --border: #252528;
    --border-lit: rgba(230, 57, 70, 0.4);
    --accent: #e63946;
    --accent-grad: linear-gradient(135deg, #e63946 0%, #c0202e 100%);
    --accent-dim: rgba(230, 57, 70, 0.12);
    --success: #2ecc71;
    --success-dim: rgba(46, 204, 113, 0.1);
    --text-primary: #efefef;
    --text-dim: #5a5a62;
    --text-ghost: #2e2e34;
  }

  *, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body { margin: 0; padding: 0; background: #0a0a0c; overscroll-behavior: none; }
  body { font-family: ${HEEBO}; }
  button { touch-action: manipulation; font-family: inherit; cursor: pointer; }
  input, textarea { -webkit-appearance: none; appearance: none; font-family: inherit; }
  input::placeholder, textarea::placeholder { color: var(--text-ghost); }
  ::-webkit-scrollbar { display: none; }
  input:focus, textarea:focus { outline: none; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes flashSuccess {
    0%   { border-color: var(--border); }
    15%  { border-color: #2ecc71; }
    85%  { border-color: #2ecc71; }
    100% { border-color: var(--border); }
  }
  @keyframes flashWrong {
    0%   { transform: translateX(0); }
    20%  { transform: translateX(-5px); }
    40%  { transform: translateX(5px); }
    60%  { transform: translateX(-3px); }
    80%  { transform: translateX(3px); }
    100% { transform: translateX(0); }
  }
  @keyframes badgeCheck {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  @keyframes perfectPop {
    0%   { opacity: 0; transform: scale(0.6) rotate(-8deg); }
    55%  { transform: scale(1.12) rotate(3deg); opacity: 1; }
    80%  { transform: scale(0.96) rotate(-1deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes perfectGlow {
    0%   { box-shadow: 0 0 0 0 rgba(230,57,70,0.5); }
    60%  { box-shadow: 0 0 0 20px rgba(230,57,70,0); }
    100% { box-shadow: 0 0 0 20px rgba(230,57,70,0); }
  }

  .fade-in     { animation: fadeIn 0.2s ease both; }
  .qcard-enter { animation: fadeIn 0.18s ease both; }
  .flash-ok    { animation: flashSuccess 0.6s ease 1; }
  .flash-wrong { animation: flashWrong 0.4s ease 1; }
  .badge-check { animation: badgeCheck 0.4s ease 1; }

  .qcard { border: 1px solid var(--border); background: var(--surface-grad); }
  .qcard:focus-within { border-color: var(--border-lit); box-shadow: inset 0 0 0 1px rgba(230,57,70,0.08); }

  .blank-input:focus { border-bottom-color: var(--accent); box-shadow: 0 3px 0 -1px rgba(230,57,70,0.2); }
  .override-btn:hover { border-color: var(--success); color: var(--success); }
  .submit-btn:active:not(:disabled) { transform: scale(0.97); }
  .exit-x:hover { color: var(--text-dim); }
  .backlink:hover { color: var(--text-primary); }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; }
  }
`;

const LABEL = {
  fontFamily: HEEBO, fontWeight: 300, fontSize: 11,
  letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)',
};

function badge(size) {
  return {
    width: size, height: size, borderRadius: '50%',
    background: ACCENT_GRAD,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontFamily: HEEBO, fontWeight: 900, flexShrink: 0,
  };
}

// ============================================================
// SETUP-SCREEN PRIMITIVES
// ============================================================
function ScreenWrap({ children }) {
  return (
    <div className="fade-in" style={{
      flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
      width: '100%', padding: '24px 20px', overflowY: 'auto',
    }}>
      {children}
    </div>
  );
}

function Title({ children }) {
  return (
    <h1 style={{
      margin: 0, fontFamily: HEEBO, fontWeight: 700,
      fontSize: 'clamp(18px, 5vw, 20px)', color: 'var(--text-primary)', textAlign: 'center',
    }}>{children}</h1>
  );
}

function Subtitle({ children }) {
  return (
    <p style={{
      margin: '8px 0 32px', fontFamily: HEEBO, fontWeight: 300, fontSize: 13,
      color: 'var(--text-dim)', textAlign: 'center', letterSpacing: '0.05em',
    }}>{children}</p>
  );
}

function MenuRow({ onClick, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'block', width: '100%', textAlign: 'right', padding: '16px 18px',
        borderRadius: 14,
        border: `1px solid ${hov ? 'var(--border-lit)' : 'var(--border)'}`,
        borderRight: `3px solid ${hov ? 'var(--accent)' : 'var(--border)'}`,
        background: hov ? 'var(--surface-2-grad)' : 'var(--surface-grad)',
        color: 'var(--text-primary)', transition: 'all 150ms ease', cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

function BackLink({ onClick }) {
  return (
    <button onClick={onClick} className="backlink" style={{
      display: 'block', margin: '20px auto 0', background: 'none', border: 'none',
      color: 'var(--text-dim)', fontFamily: HEEBO, fontWeight: 400, fontSize: 13,
      padding: 8, transition: 'color 150ms',
    }}>
      ← חזור
    </button>
  );
}

// ============================================================
// SETUP SCREENS
// ============================================================
function TrackSelector({ dispatch }) {
  const ICONS = { xcare: 'X', care: 'C', pfc: 'P', fullrun: '∞' };
  return (
    <ScreenWrap>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--accent-dim)', border: '1px solid var(--border-lit)',
          borderRadius: 12, padding: '6px 14px', marginBottom: 18,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)' }} />
          <span style={{ ...LABEL }}>חזרה על סכמות</span>
        </div>
        <h1 style={{
          margin: 0, fontFamily: HEEBO, fontWeight: 900,
          fontSize: 'clamp(26px, 7vw, 32px)', color: 'var(--text-primary)', letterSpacing: '-0.01em',
        }}>SchemeMaster</h1>
        <p style={{ margin: '8px 0 0', fontFamily: HEEBO, fontWeight: 300, fontSize: 13, color: 'var(--text-dim)' }}>
          בחר פרוטוקול לחזרה
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Object.entries(PROTOCOLS).map(([key, proto]) => (
          <MenuRow key={key} onClick={() => dispatch({ type: 'SELECT_TRACK', track: key })}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ ...badge(48), fontSize: 'clamp(18px, 5vw, 22px)' }}>{ICONS[key]}</div>
              <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
                <div style={{ fontFamily: HEEBO, fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{proto.label}</div>
                <div style={{ fontFamily: HEEBO, fontWeight: 300, fontSize: 12, color: 'var(--text-dim)', marginTop: 3 }}>{proto.subtitle}</div>
              </div>
              <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--text-ghost)', flexShrink: 0 }}>
                {proto.phases.length}·{proto.phases.reduce((a, p) => a + p.bullets.length, 0)}
              </span>
            </div>
          </MenuRow>
        ))}
      </div>

      <p style={{ textAlign: 'center', fontFamily: HEEBO, fontWeight: 300, fontSize: 11, color: 'var(--text-ghost)', marginTop: 28 }}>
        מבוסס על הסכמה האחודה לטיפול בנפגעים
      </p>
    </ScreenWrap>
  );
}

function ModeSelector({ track, dispatch }) {
  const proto = PROTOCOLS[track];
  const MODES = [
    { key: 'free',   label: 'חופשי',      desc: 'שאלות אקראיות מכל שלבי הפרוטוקול' },
    { key: 'phased', label: 'שלב אחר שלב', desc: track === 'fullrun' ? 'X-CARE · CARE · PFC — כל הסכמות בסדר' : 'מתמקד בשלב אחד, עם מעקב התקדמות' },
  ];
  return (
    <ScreenWrap>
      <div style={{ textAlign: 'center' }}>
        <div style={{ ...badge(56), fontSize: 'clamp(20px, 6vw, 24px)', margin: '0 auto 14px' }}>{proto.label.at(0)}</div>
        <Title>{proto.label}</Title>
        <Subtitle>{proto.subtitle}</Subtitle>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MODES.map(({ key, label, desc }) => (
          <MenuRow key={key} onClick={() => dispatch({ type: 'SELECT_MODE', mode: key })}>
            <div style={{ fontFamily: HEEBO, fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{label}</div>
            <div style={{ fontFamily: HEEBO, fontWeight: 300, fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>{desc}</div>
          </MenuRow>
        ))}
      </div>
      <BackLink onClick={() => dispatch({ type: 'RESET' })} />
    </ScreenWrap>
  );
}

function DifficultySelector({ track, mode, dispatch }) {
  const DIFFS = [
    { key: 'easy',   label: 'קל',     tag: 'מילה בודדת', desc: 'מילה בודדת חסרה — ההקשר המלא נראה' },
    { key: 'medium', label: 'בינוני', tag: 'חצי משפט',   desc: 'מחצית שנייה חסרה — תחילת המשפט גלויה' },
    { key: 'hard',   label: 'קשה',    tag: 'מהזיכרון',   desc: 'רק כותרת השלב — כתוב מהזיכרון' },
  ];
  return (
    <ScreenWrap>
      <div style={{ textAlign: 'center' }}>
        <Title>רמת קושי</Title>
        <Subtitle>כמה קשה תרצה את השאלות?</Subtitle>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {DIFFS.map(({ key, label, tag, desc }) => (
          <MenuRow key={key} onClick={() => dispatch({ type: 'SELECT_DIFFICULTY', difficulty: key })}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ fontFamily: HEEBO, fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{label}</div>
              <div style={{ ...LABEL, fontSize: 11, letterSpacing: '0.08em' }}>{tag}</div>
            </div>
            <div style={{ fontFamily: HEEBO, fontWeight: 300, fontSize: 12, color: 'var(--text-dim)', marginTop: 6, lineHeight: 1.5 }}>{desc}</div>
          </MenuRow>
        ))}
      </div>
      <BackLink onClick={() => dispatch({ type: 'SELECT_MODE', mode })} />
    </ScreenWrap>
  );
}

function PhaseBadgeButton({ phase, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        padding: '14px 6px', background: 'transparent', border: 'none', cursor: 'pointer',
      }}
    >
      <div style={{
        ...badge(48), fontSize: 'clamp(18px, 5vw, 22px)',
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? '0 0 0 3px rgba(230,57,70,0.15)' : 'none',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
      }}>{phase.letter}</div>
      <div style={{
        fontFamily: HEEBO, fontWeight: 300, fontSize: 10, letterSpacing: '0.04em',
        color: hov ? 'var(--text-primary)' : 'var(--text-dim)', textAlign: 'center',
        lineHeight: 1.3, direction: 'rtl', transition: 'color 150ms ease',
      }}>{phase.title.split('—')[0].trim()}</div>
    </button>
  );
}

function PhaseSelector({ track, dispatch }) {
  const proto = PROTOCOLS[track];
  return (
    <ScreenWrap>
      <div style={{ textAlign: 'center' }}>
        <Title>בחר שלב</Title>
        <Subtitle>{proto.label} · {proto.subtitle}</Subtitle>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(64px, 1fr))',
        gap: 12, maxWidth: 320, margin: '0 auto', width: '100%',
      }}>
        {proto.phases.map((phase, idx) => (
          <PhaseBadgeButton key={idx} phase={phase} onClick={() => dispatch({ type: 'SELECT_PHASE', phaseIdx: idx })} />
        ))}
      </div>
      <BackLink onClick={() => dispatch({ type: 'SELECT_MODE', mode: 'phased' })} />
    </ScreenWrap>
  );
}

// ============================================================
// QUESTION CARD (game body)
// ============================================================
function QuestionCard({ question, difficulty, val, setVal, inputRef, locked, lastResult, onOverride, onSubmitEnter }) {
  const isHard = difficulty === 'hard';
  const len = question?.target?.length ?? 8;

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !locked) { e.preventDefault(); onSubmitEnter(); }
  };

  const flash = (lastResult === 'correct' || lastResult === 'override') ? 'flash-ok'
    : lastResult === 'wrong' ? 'flash-wrong' : '';

  const stateStyle =
    (lastResult === 'correct' || lastResult === 'override')
      ? { borderColor: 'var(--success)', background: 'linear-gradient(145deg, #131a15 0%, #0d1210 100%)' }
    : lastResult === 'wrong'
      ? { borderColor: 'rgba(230,57,70,0.5)', background: 'linear-gradient(145deg, #1a1014 0%, #110d0e 100%)' }
      : {};

  const phaseTitle  = question?.phase?.title?.split('—')[0].trim() ?? '';
  const phaseLetter = question?.phase?.letter ?? '';
  const phaseTrack  = question?.phase?._track ?? '';
  const bulletNum   = (question?.bulletIdx ?? 0) + 1;
  const bulletTotal = question?.phase?.bullets?.length ?? '?';
  const bulletOrdinal = HE_ORDINALS[(question?.bulletIdx ?? 0)] ?? String(bulletNum);

  return (
    <div className={`qcard qcard-enter ${flash}`} style={{
      flex: 1, minHeight: 0, margin: '12px 16px', borderRadius: 16,
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end',
      padding: 'clamp(20px, 5vw, 40px) clamp(16px, 5vw, 28px)',
      transition: 'border-color 250ms ease, background 250ms ease',
      overflow: 'hidden', direction: 'rtl', textAlign: 'right',
      ...stateStyle,
    }}>

      {/* Phase context label — anchored above the question within the centered group */}
      <div style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        gap: 10, marginBottom: 18, paddingBottom: 16,
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: HEEBO, fontWeight: 600,
            fontSize: 'clamp(13px, 3.5vw, 15px)', color: 'var(--text-primary)',
            lineHeight: 1.2,
          }}>{phaseTitle}</div>
          {phaseTrack && (
            <div style={{
              fontFamily: MONO, fontWeight: 400, fontSize: 11,
              color: 'var(--text-dim)', marginTop: 3, letterSpacing: '0.05em',
            }}>{phaseTrack}</div>
          )}
          <div style={{
            marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--accent-dim)', borderRadius: 6,
            padding: '3px 8px', border: '1px solid rgba(230,57,70,0.2)',
          }}>
            <span style={{
              fontFamily: HEEBO, fontWeight: 500, fontSize: 11,
              color: 'var(--accent)', letterSpacing: '0.02em',
            }}>סעיף {bulletOrdinal}</span>
            <span style={{ color: 'var(--text-ghost)', fontSize: 10, fontFamily: MONO }}>
              {bulletNum}/{bulletTotal}
            </span>
          </div>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: ACCENT_GRAD, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: HEEBO, fontWeight: 900, color: '#fff',
          fontSize: phaseLetter.length > 2 ? 9 : phaseLetter.length > 1 ? 11 : 15,
          letterSpacing: '-0.02em',
        }}>{phaseLetter}</div>
      </div>

      {isHard ? (
        <div style={{ width: '100%' }}>
          <div style={{ ...LABEL, marginBottom: 12 }}>כתוב את הסעיף המלא</div>
          <textarea
            ref={inputRef} value={val} rows={3} disabled={locked}
            onChange={e => !locked && setVal(e.target.value)}
            onKeyDown={handleKey}
            style={{
              width: '100%', background: 'transparent',
              border: '1px solid var(--border-lit)', borderRadius: 12,
              color: 'var(--text-primary)', fontFamily: HEEBO,
              fontSize: 'clamp(14px, 3.5vw, 16px)', lineHeight: 2.0,
              padding: '12px 14px', resize: 'none', direction: 'rtl', textAlign: 'right', outline: 'none',
            }}
          />
        </div>
      ) : (
        <div style={{
          width: '100%', fontFamily: HEEBO, fontWeight: 400,
          fontSize: 'clamp(14px, 3.5vw, 16px)', lineHeight: 2.0,
          direction: 'rtl', textAlign: 'right', wordBreak: 'break-word', color: 'var(--text-primary)',
        }}>
          {question?.prefix && <span>{question.prefix} </span>}
          <input
            ref={inputRef} type="text" value={val} placeholder="____" disabled={locked}
            className="blank-input"
            onChange={e => !locked && setVal(e.target.value)}
            onKeyDown={handleKey}
            style={{
              background: 'transparent', border: 'none',
              borderBottom: '1.5px solid var(--border-lit)',
              color: 'var(--text-primary)', fontFamily: HEEBO,
              fontSize: 'inherit', lineHeight: 'inherit',
              padding: '0 6px 2px',
              minWidth: 80, width: `min(100%, max(80px, ${(len * 0.6).toFixed(1)}em))`,
              outline: 'none', textAlign: 'center', direction: 'rtl',
              transition: 'border-color 200ms, box-shadow 200ms',
            }}
          />
          {question?.suffix && <span> {question.suffix}</span>}
        </div>
      )}

      {(lastResult === 'correct' || lastResult === 'override') && (
        <div className="fade-in" style={{
          marginTop: 20, width: '100%', textAlign: 'right',
          color: 'var(--success)', fontFamily: HEEBO, fontWeight: 500, fontSize: 13,
        }}>
          {lastResult === 'override' ? '✓ סומן כנכון' : '✓ נכון'}
        </div>
      )}

      {lastResult === 'wrong' && (
        <div className="fade-in" style={{
          marginTop: 20, width: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
        }}>
          <div style={{ ...LABEL }}>התשובה הנכונה</div>
          <div style={{
            color: 'var(--accent)', fontFamily: HEEBO, fontWeight: 500, fontSize: 15,
            padding: '6px 10px', background: 'var(--accent-dim)', borderRadius: 6,
            borderRight: '2px solid var(--accent)', maxWidth: '100%', wordBreak: 'break-word',
          }}>{question?.target}</div>
          <button onClick={onOverride} className="override-btn" style={{
            marginTop: 4, background: 'transparent', border: '1px solid var(--border-lit)',
            borderRadius: 8, color: 'var(--text-dim)', fontFamily: HEEBO, fontWeight: 400, fontSize: 12,
            padding: '6px 14px', cursor: 'pointer', transition: 'border-color 150ms, color 150ms',
          }}>סמן כנכון בכל זאת</button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PHASE COMPLETE OVERLAY + PERFECT RUN SCREEN
// ============================================================
function overlayBtn(primary) {
  return {
    height: 44, minWidth: 120, borderRadius: 10, padding: '0 18px',
    fontFamily: HEEBO, fontWeight: 600, fontSize: 14, cursor: 'pointer',
    border: primary ? 'none' : '1px solid var(--border)',
    background: primary ? ACCENT_GRAD : 'var(--surface-grad)',
    color: primary ? '#fff' : 'var(--text-dim)',
    transition: 'opacity 150ms',
  };
}

function PerfectRunScreen({ state, dispatch }) {
  const totalQuestions = PROTOCOLS[state.track].phases.reduce((s, p) => s + p.bullets.length, 0);
  return (
    <div className="fade-in" style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(4, 4, 6, 0.97)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 28, direction: 'rtl', padding: 32,
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', width: 260, height: 260, borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(230,57,70,0.14) 0%, transparent 70%)',
      }} />

      {/* Star badge */}
      <div style={{
        width: 88, height: 88, borderRadius: '50%', background: ACCENT_GRAD,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 40, color: '#fff', zIndex: 1,
        animation: 'perfectPop 0.55s cubic-bezier(0.34,1.4,0.64,1) both, perfectGlow 0.8s ease 0.3s 1',
      }}>★</div>

      {/* Headline */}
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <div style={{
          fontFamily: HEEBO, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em',
          fontSize: 'clamp(30px, 9vw, 40px)', lineHeight: 1.1,
        }}>ניקוד מושלם</div>
        <div style={{
          fontFamily: HEEBO, fontWeight: 300, fontSize: 14, color: 'var(--text-dim)',
          marginTop: 10, lineHeight: 1.7, letterSpacing: '0.03em',
        }}>
          השלמת את כל X-CARE · CARE · PFC<br />
          <span style={{ fontFamily: MONO, fontWeight: 600, color: 'var(--accent)', fontSize: 13 }}>
            {totalQuestions} סעיפים
          </span>
          {' '}ללא שגיאה אחת
        </div>
      </div>

      {/* Stat strip */}
      <div style={{
        display: 'flex', gap: 32, zIndex: 1,
        fontFamily: HEEBO, fontWeight: 300, fontSize: 13, color: 'var(--text-dim)',
      }}>
        <span>
          <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 22, color: 'var(--success)', display: 'block', textAlign: 'center' }}>100%</span>
          דיוק
        </span>
        <span>
          <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 22, color: 'var(--text-primary)', display: 'block', textAlign: 'center' }}>{totalQuestions}</span>
          סעיפים
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, zIndex: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => dispatch({ type: 'RESET' })} style={overlayBtn(false)}>בחר פרוטוקול</button>
        <button onClick={() => dispatch({ type: 'RETRY_PHASE' })} style={overlayBtn(true)}>שחק שוב ←</button>
      </div>
    </div>
  );
}

function PhaseCompleteScreen({ state, dispatch }) {
  const proto   = PROTOCOLS[state.track];
  const phase   = proto.phases[state.activePhaseIdx];
  const isLast  = state.activePhaseIdx >= proto.phases.length - 1;
  const isRunDone = isLast && state.track === 'fullrun';
  const elapsed = Math.max(0, Math.floor((Date.now() - state.phaseStartTime) / 1000));
  const accuracy = state.totalAnswered
    ? Math.round(((state.totalAnswered - state.sessionWrong) / state.totalAnswered) * 100) : 100;
  const timeStr = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`;

  if (isRunDone && state.sessionWrong === 0) {
    return <PerfectRunScreen state={state} dispatch={dispatch} />;
  }

  return (
    <div className="fade-in" style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(6, 6, 8, 0.92)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 24, direction: 'rtl', padding: 28,
    }}>
      <div className="badge-check" style={{ ...badge(72), fontSize: 'clamp(26px, 8vw, 32px)' }}>
        {isRunDone ? '✓' : phase.letter}
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: HEEBO, fontWeight: 900, fontSize: 'clamp(24px, 7vw, 28px)', color: 'var(--text-primary)' }}>
          {isRunDone ? 'מסלול הושלם' : 'שלב הושלם'}
        </div>
        <div style={{ fontFamily: HEEBO, fontWeight: 300, fontSize: 13, color: 'var(--text-dim)', marginTop: 6 }}>
          {isRunDone ? 'X-CARE · CARE · PFC' : phase.title}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, fontFamily: HEEBO, fontSize: 13, color: 'var(--text-dim)' }}>
        <span><span style={{ fontFamily: MONO, fontWeight: 600, color: 'var(--text-primary)' }}>{accuracy}%</span> דיוק</span>
        <span><span style={{ fontFamily: MONO, fontWeight: 600, color: 'var(--text-primary)' }}>{timeStr}</span> זמן</span>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => dispatch({ type: 'RETRY_PHASE' })} style={overlayBtn(false)}>חזור לשלב</button>
        {!isLast && (
          <button onClick={() => dispatch({ type: 'NEXT_PHASE', phaseIdx: state.activePhaseIdx + 1 })} style={overlayBtn(true)}>
            {state.track === 'fullrun' ? 'ממשיך ←' : 'השלב הבא ←'}
          </button>
        )}
      </div>

      <button onClick={() => dispatch({ type: 'RESET' })} className="backlink" style={{
        background: 'none', border: 'none', color: 'var(--text-dim)',
        fontFamily: HEEBO, fontWeight: 400, fontSize: 13, padding: 8, transition: 'color 150ms',
      }}>
        בחר פרוטוקול
      </button>
    </div>
  );
}

// ============================================================
// GAME SCREEN
// ============================================================
function GameScreen({ state, dispatch }) {
  const { track, mode, difficulty, activePhaseIdx, currentQuestion, lastResult } = state;
  const proto = PROTOCOLS[track];

  const [val, setVal] = useState('');
  const inputRef = useRef(null);

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

  const timerRef = useRef(null);
  const advance = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
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

  // reset + autofocus on every new question
  useEffect(() => {
    setVal('');
    const t = setTimeout(() => inputRef.current?.focus(), 90);
    return () => clearTimeout(t);
  }, [currentQuestion?.key]);

  useEffect(() => {
    if (lastResult === 'correct' || lastResult === 'override') {
      timerRef.current = setTimeout(() => advanceRef.current(), 750);
      return () => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } };
    }
  }, [lastResult]);

  const handleSubmit = () => {
    if (lastResult !== null || !currentQuestion) return;
    const ok = normalize(val) === normalize(currentQuestion.target);
    dispatch({ type: ok ? 'ANSWER_CORRECT' : 'ANSWER_WRONG', key: currentQuestion.key });
  };

  const phase     = currentQuestion?.phase ?? (activePhaseIdx !== null ? proto.phases[activePhaseIdx] : null);
  const trackPill = phase?._track || proto.label;

  if (!currentQuestion) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontFamily: HEEBO, fontSize: 13 }}>
        טוען…
      </div>
    );
  }

  const locked      = lastResult !== null;
  const canSubmit   = val.trim().length > 0;
  const btnDisabled = !locked && !canSubmit;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>

      {/* TopBar */}
      <div style={{
        height: 48, padding: '0 16px', flexShrink: 0, direction: 'ltr',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: MONO, fontWeight: 600, fontSize: 'clamp(12px, 3vw, 14px)',
          color: state.streak >= 3 ? 'var(--text-primary)' : 'var(--text-dim)',
        }}>
          <span style={{ fontSize: 14 }}>🔥</span><span>{state.streak}</span>
        </div>

        <div style={{
          background: 'var(--surface-2-grad)', border: '1px solid var(--border)',
          borderRadius: 20, padding: '4px 14px', whiteSpace: 'nowrap',
          fontFamily: HEEBO, fontWeight: 500, fontSize: 11, textTransform: 'uppercase',
          letterSpacing: '0.08em', color: 'var(--text-dim)',
        }}>{trackPill}</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 'clamp(12px, 3vw, 14px)', color: 'var(--text-dim)' }}>
            {state.score} / {state.totalAnswered}
          </span>
          <button onClick={() => dispatch({ type: 'RESET' })} className="exit-x" aria-label="יציאה" style={{
            background: 'none', border: 'none', padding: 4, display: 'flex',
            color: 'var(--text-ghost)', transition: 'color 150ms',
          }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* PhaseHeader */}
      <div style={{ height: 72, padding: '0 20px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ ...badge(48), fontSize: 'clamp(22px, 5vw, 26px)' }}>{phase?.letter ?? '?'}</div>
        <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
          <div style={{
            fontFamily: HEEBO, fontWeight: 700, color: 'var(--text-primary)',
            fontSize: 'clamp(15px, 4vw, 18px)', lineHeight: 1.3,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{phase?.title}</div>
        </div>
      </div>
      <div style={{
        height: 1, margin: '0 20px', flexShrink: 0,
        background: 'linear-gradient(90deg, transparent, var(--border) 30%, var(--border) 70%, transparent)',
      }} />

      {/* QuestionCard */}
      <QuestionCard
        key={currentQuestion.key}
        question={currentQuestion}
        difficulty={difficulty}
        val={val} setVal={setVal} inputRef={inputRef}
        locked={locked} lastResult={lastResult}
        onOverride={() => dispatch({ type: 'ANSWER_OVERRIDE', key: currentQuestion.key })}
        onSubmitEnter={handleSubmit}
      />

      {/* BottomBar */}
      <div style={{ height: 72, padding: '12px 16px', flexShrink: 0 }}>
        <button
          className="submit-btn"
          disabled={btnDisabled}
          onClick={() => (locked ? advance() : handleSubmit())}
          style={{
            width: '100%', height: 48, borderRadius: 12, border: 'none',
            background: ACCENT_GRAD, color: '#fff',
            fontFamily: HEEBO, fontWeight: 700, fontSize: 'clamp(14px, 4vw, 16px)', letterSpacing: '0.02em',
            cursor: 'pointer', transition: 'opacity 150ms, transform 100ms',
            opacity: btnDisabled ? 0.35 : 1, pointerEvents: btnDisabled ? 'none' : 'auto',
          }}
        >
          {locked ? 'המשך ←' : 'בדוק'}
        </button>
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
      minHeight: '100dvh', width: '100%', maxWidth: 480, margin: '0 auto',
      display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(160deg, #0d0d0d 0%, #060608 100%)',
      color: 'var(--text-primary)', fontFamily: HEEBO, direction: 'rtl',
      padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
    }}>
      {(SCREENS[state.screen] ?? SCREENS.track)(state, dispatch)}
    </div>
  );
}
