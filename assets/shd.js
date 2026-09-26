/* =====================================================================
   SHD Builds — общая дизайн-система (ISAC / SHD UI)
   Подключать сразу ПОСЛЕ https://cdn.tailwindcss.com
   ===================================================================== */

/* ---------- 1. Tailwind: токены ---------- */
tailwind.config = {
  theme: { extend: {
    colors: { shd: {
      bg:'#0d0f12', panel:'rgba(8,9,11,var(--glass,.45))', solid:'#16191e', line:'rgba(226,232,240,0.08)',
      orange:'#ff6a00', amber:'#ffa04d', text:'#e2e8f0', muted:'#8a94a6',
      high:'#f5c542', gearset:'#29d17c', exotic:'#e8603c', named:'#d9a441',
      offense:'#e8483b', defense:'#3b8fe8', skill:'#f2c230',
    }},
    fontFamily: { hud:['Rajdhani','sans-serif'], mono:['"Share Tech Mono"','ui-monospace','monospace'] },
    boxShadow: {
      glow:'0 0 12px rgba(255,106,0,.35), inset 0 0 18px rgba(255,106,0,.12)',
      'glow-strong':'0 0 22px rgba(255,106,0,.55), inset 0 0 26px rgba(255,106,0,.22)',
    },
    keyframes: {
      scan:{'0%':{transform:'translateY(-100%)'},'100%':{transform:'translateY(100vh)'}},
      blink:{'0%,100%':{opacity:1},'50%':{opacity:.25}},
      glitch1:{'0%,92%,100%':{transform:'none',opacity:0},'93%':{transform:'translate(-3px,1px)',opacity:.8},'96%':{transform:'translate(3px,-1px)',opacity:.8}},
    },
    animation: { scan:'scan 7s linear infinite', blink:'blink 1.2s steps(2) infinite', glitch:'glitch1 4s infinite' },
  }}
};

/* ---------- 2. Компоненты (компилируются Tailwind Play CDN) ---------- */
const SHD_CSS = String.raw`
@layer base {
  [x-cloak] { display:none !important; }
  html { scroll-behavior: smooth; background:#07080a; }
  body { @apply text-shd-text font-hud antialiased min-h-screen; background: transparent; }
  /* стекло: единое размытие для всех панелей, регулируется в «Настройках» */
  .panel, .tile, .gear-card, .tile-select, .glass { backdrop-filter: blur(var(--blur,12px)) saturate(1.2); -webkit-backdrop-filter: blur(var(--blur,12px)) saturate(1.2); }
  ::selection { @apply bg-shd-orange text-black; }
}

@layer components {
  /* Оверлей: линии сканирования */
  .scanlines::before { content:''; @apply pointer-events-none fixed inset-0 z-[60]; opacity: var(--scan,1);
    background: repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 1px, transparent 1px 3px); }
  .scanlines::after { content:''; @apply pointer-events-none fixed left-0 right-0 top-0 h-24 z-[60] animate-scan; opacity: var(--scan,1);
    background: linear-gradient(transparent, rgba(255,106,0,.05), transparent); }

  /* Типографика */
  .hud-h1 { @apply font-hud font-bold uppercase tracking-[0.16em] text-3xl sm:text-5xl text-shd-text; }
  .hud-h2 { @apply font-hud font-semibold uppercase tracking-[0.2em] text-xl sm:text-2xl text-shd-text; }
  .hud-h3 { @apply font-hud font-semibold uppercase tracking-[0.12em] text-base text-shd-text; }
  .hud-label { @apply font-mono uppercase text-[11px] tracking-[0.25em] text-shd-muted; }
  .hud-data { @apply font-mono text-shd-orange tabular-nums; text-shadow:0 0 8px rgba(255,106,0,.6); }
  .hud-prefix::before { content:'// '; @apply text-shd-orange; }
  .hud-cursor::after { content:'_'; @apply ml-1 text-shd-orange animate-blink; }
  .glitch { @apply relative inline-block; }
  .glitch::before, .glitch::after { content: attr(data-text); @apply absolute inset-0 animate-glitch; }
  .glitch::before { color:#ff6a00; clip-path: inset(0 0 55% 0); }
  .glitch::after  { color:#3be8ff; clip-path: inset(55% 0 0 0); animation-delay:.15s; }
  .hud-section { @apply flex items-center gap-3; }
  .hud-section::after { content:''; @apply flex-1 h-px bg-gradient-to-r from-shd-orange/60 to-transparent; }
  .q-tag { @apply font-mono text-[11px] tracking-[0.2em] px-2 py-0.5 bg-shd-orange text-black; }

  /* Панели */
  .panel { @apply relative bg-shd-panel border border-white/10 p-4 sm:p-6; }
  .panel-brackets::before, .panel-brackets::after { content:''; @apply absolute w-3 h-3 border-shd-orange pointer-events-none; }
  .panel-brackets::before { @apply -top-px -left-px border-t-2 border-l-2; }
  .panel-brackets::after  { @apply -bottom-px -right-px border-b-2 border-r-2; }

  /* Редкость */
  .rarity-high    { --rarity: theme('colors.shd.high'); }
  .rarity-gearset { --rarity: theme('colors.shd.gearset'); }
  .rarity-exotic  { --rarity: theme('colors.shd.exotic'); }
  .rarity-named   { --rarity: theme('colors.shd.named'); }

  /* Карточка снаряжения */
  .gear-card {
    @apply relative flex flex-col gap-3 p-4 text-left w-full bg-shd-panel
           border border-shd-orange/30 shadow-glow transition duration-200
           focus-visible:outline focus-visible:outline-2 focus-visible:outline-shd-orange;
    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
  }
  button.gear-card, a.gear-card { @apply cursor-pointer; }
  .gear-card:hover { @apply border-shd-orange shadow-glow-strong -translate-y-0.5; }
  .gear-card::before { content:''; @apply absolute left-0 top-0 bottom-0 w-1;
    background: var(--rarity,#ff6a00); box-shadow: 0 0 10px var(--rarity,#ff6a00); }
  .gear-icon { @apply grid place-items-center w-12 h-12 shrink-0 border border-shd-orange/40 bg-black/40 text-shd-orange;
    filter: drop-shadow(0 0 6px rgba(255,106,0,.5)); }
  .brand-hex { @apply grid place-items-center w-12 h-12 shrink-0 font-mono text-xs font-bold text-black;
    clip-path: polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%);
    background: var(--rarity,#ff6a00); filter: drop-shadow(0 0 6px var(--rarity,#ff6a00)); }
  .attr-row { @apply flex items-center justify-between gap-2 font-mono text-[13px]; }
  .attr-dot { @apply inline-block w-2 h-2 rotate-45 mr-2 shrink-0; }
  .stat-bar { @apply h-1 w-full bg-white/10 overflow-hidden; }
  .stat-bar > span { @apply block h-full bg-shd-orange transition-all duration-300; box-shadow: 0 0 8px #ff6a00; }

  /* Плитка базы снаряжения */
  .tile {
    @apply relative flex flex-col bg-shd-panel border border-white/10 transition duration-200;
    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
  }
  .tile:hover { @apply border-shd-orange/50 shadow-glow; }
  .tile::before { content:''; @apply absolute left-0 top-0 right-0 h-0.5; background: var(--rarity); box-shadow: 0 0 10px var(--rarity); }
  .tile.is-set   { --rarity: theme('colors.shd.gearset'); }
  .tile.is-brand { --rarity: theme('colors.shd.high'); }

  /* Строка бонуса — неон при наведении */
  .bonus-row { @apply relative grid grid-cols-[4.25rem_1fr] gap-3 items-baseline px-4 py-2 border-l-2 border-transparent
           cursor-default transition-all duration-150 outline-none; }
  .bonus-row .pc  { @apply font-mono text-[11px] uppercase tracking-widest text-shd-muted transition-all duration-150; }
  .bonus-row .txt { @apply text-[15px] leading-snug text-shd-text/85 transition-all duration-150; }
  .bonus-row:hover, .bonus-row:focus-visible {
    @apply border-shd-orange;
    background: linear-gradient(90deg, rgba(255,106,0,.18), rgba(255,106,0,.03) 70%, transparent);
    box-shadow: inset 0 0 14px rgba(255,106,0,.18), -4px 0 14px -4px rgba(255,106,0,.8);
  }
  .bonus-row:hover .pc, .bonus-row:focus-visible .pc, .bonus-row:hover .txt, .bonus-row:focus-visible .txt {
    @apply text-shd-orange;
    text-shadow: 0 0 4px rgba(255,106,0,.9), 0 0 12px rgba(255,106,0,.6), 0 0 22px rgba(255,106,0,.35);
  }
  .bonus-row.is-talent .txt b { @apply font-semibold text-shd-text; }
  .bonus-row.is-talent:hover .txt b, .bonus-row.is-talent:focus-visible .txt b { @apply text-shd-amber; }

  /* Источники */
  .src { @apply inline-flex items-center gap-1.5 px-2 py-1 font-mono text-[10px] uppercase tracking-wider border; }
  .src::before { content:''; @apply w-1.5 h-1.5 rotate-45; background: currentColor; }
  .src-world     { @apply text-shd-text/80 border-white/15; }
  .src-targeted  { @apply text-shd-amber border-shd-amber/40; }
  .src-summit    { @apply text-sky-300 border-sky-300/40; }
  .src-countdown { @apply text-violet-300 border-violet-300/40; }
  .src-raid      { @apply text-shd-exotic border-shd-exotic/60 bg-shd-exotic/10; }
  .src-dz        { @apply text-fuchsia-400 border-fuchsia-400/60 bg-fuchsia-400/10; }
  .src-exclusive::after { content:'ТОЛЬКО'; @apply ml-1 px-1 border border-current text-[8px] leading-3 font-bold; }

  /* Кнопки */
  .btn-tac { @apply relative inline-flex items-center justify-center gap-2 px-6 py-2.5 font-hud font-bold uppercase
           tracking-[0.2em] text-sm bg-shd-orange text-black transition hover:bg-shd-amber hover:shadow-glow-strong active:translate-y-px
           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shd-orange;
    clip-path: polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px); }
  .btn-ghost { @apply relative inline-flex items-center justify-center gap-2 px-5 py-2 font-hud font-semibold uppercase
           tracking-[0.18em] text-xs sm:text-sm text-shd-orange bg-shd-orange/5 transition hover:bg-shd-orange/15 hover:text-shd-amber;
    clip-path: polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);
    box-shadow: inset 0 0 0 1px rgba(255,106,0,.6); }
  .btn-toggle { @apply relative inline-flex items-center gap-2.5 pl-3 pr-4 py-2 border border-white/10 bg-shd-solid/80
           font-hud font-semibold uppercase tracking-[0.14em] text-xs sm:text-sm text-shd-muted transition
           hover:text-shd-text hover:border-shd-orange/50 focus-visible:outline focus-visible:outline-1 focus-visible:outline-shd-orange; }
  .btn-toggle::before { content:''; @apply w-2 h-2 shrink-0 transition; background: var(--dot, rgba(138,148,166,.4)); }
  .btn-toggle[aria-pressed="true"] { @apply text-shd-text border-shd-orange/70 bg-shd-orange/10; }
  .btn-toggle[aria-pressed="true"]::before { @apply animate-blink; background: var(--dot, #ff6a00); box-shadow: 0 0 8px var(--dot, #ff6a00); }
  .btn-toggle[aria-pressed="true"]::after { content:''; @apply absolute left-0 right-0 -bottom-px h-0.5 bg-shd-orange; box-shadow:0 0 8px #ff6a00; }
  .btn-toggle .count { @apply font-mono text-[10px] text-shd-muted/80; }

  /* Прочее */
  .badge { @apply inline-flex items-center px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest border; }
  .pip { @apply w-3 h-3 border border-shd-orange/60; clip-path: polygon(3px 0,100% 0,100% calc(100% - 3px),calc(100% - 3px) 100%,0 100%,0 3px); }
  .pip.on { @apply bg-shd-orange; box-shadow: 0 0 6px #ff6a00; }
  .hud-input { @apply w-full bg-black/40 border border-white/10 px-3 py-2.5 font-mono text-sm text-shd-text
           placeholder:text-shd-muted/60 outline-none transition focus:border-shd-orange focus:shadow-glow; }
  input[type=range] { @apply w-full appearance-none bg-transparent cursor-pointer; }
  input[type=range]::-webkit-slider-runnable-track { @apply h-1 bg-white/15; }
  input[type=range]::-webkit-slider-thumb { @apply appearance-none w-4 h-4 -mt-1.5 bg-shd-orange rotate-45; box-shadow:0 0 10px #ff6a00; }
  input[type=range]::-moz-range-track { @apply h-1 bg-white/15; }
  input[type=range]::-moz-range-thumb { @apply w-4 h-4 bg-shd-orange border-0 rounded-none; box-shadow:0 0 10px #ff6a00; }

  /* ---------- HUD-вкладки (шапка) ---------- */
  .tabbar { @apply flex items-stretch border border-white/10 bg-black/40; }
  .tab { @apply relative flex items-center px-4 sm:px-6 font-hud font-semibold uppercase tracking-[0.18em] text-[13px] sm:text-sm
         text-shd-muted whitespace-nowrap transition hover:text-shd-text hover:bg-white/5
         focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-shd-orange; }
  .tab + .tab::before { content:''; @apply absolute left-0 top-2.5 bottom-2.5 w-px bg-white/10; }
  .tab[aria-current="page"] { @apply text-shd-orange;
    background: linear-gradient(to top, rgba(255,106,0,.22), rgba(255,106,0,.02) 70%);
    text-shadow: 0 0 10px rgba(255,106,0,.8); }
  .tab[aria-current="page"]::after { content:''; @apply absolute left-0 right-0 -bottom-px h-0.5 bg-shd-orange;
    box-shadow: 0 0 10px #ff6a00, 0 0 20px rgba(255,106,0,.6); }

  /* Клавиша-переключатель (A / E / R / Enter) */
  .keycap { @apply inline-grid place-items-center min-w-[1.75rem] h-7 px-1.5 border border-white/35 bg-black/50
            font-mono text-xs text-shd-text transition select-none; }
  button.keycap:hover, .keycap.is-hot { @apply border-shd-orange text-black bg-shd-orange; box-shadow: 0 0 12px rgba(255,106,0,.7); }

  /* Угловые маркеры */
  .hud-corners { --c: rgba(226,232,240,.55);
    background-image:
      linear-gradient(var(--c),var(--c)), linear-gradient(var(--c),var(--c)),
      linear-gradient(var(--c),var(--c)), linear-gradient(var(--c),var(--c)),
      linear-gradient(var(--c),var(--c)), linear-gradient(var(--c),var(--c)),
      linear-gradient(var(--c),var(--c)), linear-gradient(var(--c),var(--c));
    background-repeat: no-repeat;
    background-size: 10px 1px, 1px 10px, 10px 1px, 1px 10px, 10px 1px, 1px 10px, 10px 1px, 1px 10px;
    background-position: 0 0, 0 0, 100% 0, 100% 0, 0 100%, 0 100%, 100% 100%, 100% 100%; }

  /* ---------- Плитка выбора (Matchmaking / татуировки) ---------- */
  .tile-select { @apply hud-corners relative flex flex-col justify-between gap-4 p-4 sm:p-5 text-left
                 bg-shd-panel border border-white/10 min-h-[150px] transition duration-150 cursor-pointer
                 hover:border-white/40 hover:bg-white/[.06]
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shd-orange; }
  .tile-select .ico { @apply w-9 h-9 text-shd-text transition; }
  .tile-select .t-title { @apply font-hud font-bold uppercase tracking-[0.12em] text-lg leading-tight transition; }
  .tile-select .t-sub { @apply font-mono text-[11px] uppercase tracking-[0.18em] text-shd-muted transition; }
  .tile-select[aria-pressed="true"] { --c: rgba(0,0,0,.7); @apply border-shd-orange text-black;
    background-color: #ff6a00; box-shadow: 0 0 26px rgba(255,106,0,.55), inset 0 0 30px rgba(255,255,255,.12); }
  .tile-select[aria-pressed="true"] .ico,
  .tile-select[aria-pressed="true"] .t-title { @apply text-black; }
  .tile-select[aria-pressed="true"] .t-sub { @apply text-black/70; }

  /* ---------- Меню настроек ---------- */
  .cat-item { @apply relative flex items-center justify-between gap-3 w-full pl-5 pr-4 py-3 text-left
              font-hud font-semibold uppercase tracking-[0.14em] text-sm text-shd-muted border-b border-white/5
              transition hover:text-shd-text hover:bg-white/5 focus-visible:outline-none focus-visible:bg-white/10; }
  .cat-item::before { content:''; @apply absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/20 transition-all; }
  .cat-item[aria-selected="true"] { @apply text-shd-text bg-gradient-to-r from-shd-orange/20 to-transparent; }
  .cat-item[aria-selected="true"]::before { @apply left-0 w-1 h-full bg-shd-orange; box-shadow: 0 0 10px #ff6a00; }

  .set-row { @apply grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] items-center px-4 py-3 border-b border-white/5
             border-l-2 border-l-transparent transition hover:bg-white/[.04] focus-within:bg-white/[.06] focus-within:border-l-shd-orange; }
  .step-btn { @apply grid place-items-center w-7 h-7 shrink-0 text-shd-muted border border-white/10 font-mono text-xs transition
              hover:text-black hover:bg-shd-orange hover:border-shd-orange; }
  .val-box { @apply w-16 shrink-0 text-right font-mono text-sm tabular-nums text-shd-text; }

  /* Сегментированный слайдер: заливка задаётся через --p */
  input[type=range].hud-range { @apply h-6; --p: 50%; }
  input[type=range].hud-range::-webkit-slider-runnable-track { height: 8px;
    background:
      repeating-linear-gradient(90deg, transparent 0 calc(10% - 2px), rgba(0,0,0,.85) calc(10% - 2px) 10%),
      linear-gradient(90deg, #ff6a00 0 var(--p), rgba(255,255,255,.12) var(--p) 100%);
    box-shadow: 0 0 10px rgba(255,106,0,.25); }
  input[type=range].hud-range::-webkit-slider-thumb { @apply appearance-none w-1.5 h-5 -mt-1.5 bg-white rotate-0; box-shadow: 0 0 10px #ff6a00; }
  input[type=range].hud-range::-moz-range-track { height: 8px;
    background:
      repeating-linear-gradient(90deg, transparent 0 calc(10% - 2px), rgba(0,0,0,.85) calc(10% - 2px) 10%),
      linear-gradient(90deg, #ff6a00 0 var(--p), rgba(255,255,255,.12) var(--p) 100%); }
  input[type=range].hud-range::-moz-range-thumb { @apply w-1.5 h-5 bg-white border-0 rounded-none; box-shadow: 0 0 10px #ff6a00; }

  /* Переключатель вкл/выкл */
  .switch { @apply relative inline-flex w-12 h-6 border border-white/20 bg-black/50 transition; }
  .switch::after { content:''; @apply absolute top-0.5 left-0.5 w-5 h-[18px] bg-shd-muted transition-all; }
  .switch[aria-checked="true"] { @apply border-shd-orange; }
  .switch[aria-checked="true"]::after { @apply left-[26px] bg-shd-orange; box-shadow: 0 0 10px #ff6a00; }

  .no-scrollbar { scrollbar-width: none; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
}
`;
(() => {
  const s = document.createElement('style');
  s.type = 'text/tailwindcss';
  s.textContent = SHD_CSS;
  document.head.appendChild(s);
})();

/* ---------- 3. Настройки интерфейса (редактируются на странице «Настройки») ---------- */
const SHD_UI_DEFAULTS = { glass: 45, blur: 12, scan: 100, motion: true };
const SHD_UI = {
  load() {
    try { return { ...SHD_UI_DEFAULTS, ...JSON.parse(localStorage.getItem('shd-ui') || '{}') }; }
    catch (e) { return { ...SHD_UI_DEFAULTS }; }
  },
  save(v) { try { localStorage.setItem('shd-ui', JSON.stringify(v)); } catch (e) {} },
  apply(v) {
    const r = document.documentElement.style;
    r.setProperty('--glass', (v.glass / 100).toFixed(2));
    r.setProperty('--blur', v.blur + 'px');
    r.setProperty('--scan', (v.scan / 100).toFixed(2));
    document.documentElement.classList.toggle('shd-still', !v.motion);
  },
};
SHD_UI.apply(SHD_UI.load());

/* ---------- 4. Атмосферный фон — «3D-пространство» за меню ---------- */
function shdBackground() {
  const el = document.createElement('div');
  el.id = 'shd-bg';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
  <style>
    #shd-bg { position:fixed; inset:0; z-index:-1; overflow:hidden; pointer-events:none;
      background:
        radial-gradient(120% 80% at 75% 10%, rgba(255,106,0,.16), transparent 55%),
        radial-gradient(90% 70% at 10% 90%, rgba(40,110,160,.18), transparent 60%),
        linear-gradient(180deg, #0b0d10 0%, #07080a 60%, #050607 100%); }
    #shd-bg .blob { position:absolute; border-radius:9999px; filter:blur(70px); opacity:.55; animation: shdDrift 26s ease-in-out infinite alternate; }
    #shd-bg .b1 { width:42vw; height:42vw; left:58%; top:-8%; background:rgba(255,106,0,.35); }
    #shd-bg .b2 { width:36vw; height:36vw; left:-8%; top:48%; background:rgba(40,120,180,.30); animation-duration:32s; }
    #shd-bg .b3 { width:24vw; height:24vw; left:38%; top:62%; background:rgba(255,160,77,.14); animation-duration:21s; }
    /* перспективный пол-сетка */
    #shd-bg .floor { position:absolute; left:-50%; right:-50%; bottom:-10%; height:65%;
      background-image: linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px);
      background-size: 70px 70px; transform: perspective(600px) rotateX(62deg); transform-origin: 50% 100%;
      -webkit-mask-image: linear-gradient(to top, #000 10%, transparent 85%); mask-image: linear-gradient(to top, #000 10%, transparent 85%); }
    #shd-bg .city { position:absolute; left:0; right:0; bottom:18%; width:100%; height:38%; opacity:.5; filter:blur(1.5px); }
    #shd-bg .dust { position:absolute; inset:0; opacity:.35;
      background-image: radial-gradient(1px 1px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 70% 20%, #ffb27a, transparent),
        radial-gradient(1px 1px at 40% 70%, #fff, transparent), radial-gradient(1.5px 1.5px at 85% 60%, #ff6a00, transparent),
        radial-gradient(1px 1px at 55% 45%, #fff, transparent), radial-gradient(1px 1px at 10% 60%, #9fd3ff, transparent);
      background-size: 380px 380px; animation: shdDust 60s linear infinite; }
    #shd-bg .vignette { position:absolute; inset:0; background: radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,.75) 100%); }
    @keyframes shdDrift { to { transform: translate(-6vw, 5vh) scale(1.15); } }
    @keyframes shdDust  { to { background-position: 380px -380px; } }
    .shd-still #shd-bg *, .shd-still .scanlines::after { animation: none !important; }
    @media (prefers-reduced-motion: reduce) { #shd-bg * { animation: none !important; } }
  </style>
  <div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
  <svg class="city" viewBox="0 0 1200 300" preserveAspectRatio="none">
    <path fill="#0f1318" d="M0 300V190h40v-40h30v60h25V120h45v90h20v-60h35v-30h20v100h30V90h50v140h25v-70h40v50h30V60h20V40h10v20h20v160h35v-90h45v110h25v-60h30V130h40v100h20v-80h55v120h30v-40h45V100h25v-20h15v20h20v130h30v-60h40v80h35v-110h30v90h40v-50h35v70h25V150h40v80h45V300z"/>
    <g fill="#ff6a00" opacity=".55">
      <rect x="515" y="70" width="3" height="3"/><rect x="930" y="110" width="3" height="3"/><rect x="170" y="130" width="2" height="2"/>
      <rect x="330" y="100" width="2" height="2"/><rect x="720" y="160" width="2" height="2"/>
    </g>
  </svg>
  <div class="floor"></div><div class="dust"></div><div class="vignette"></div>`;
  document.body.prepend(el);
}

/* ---------- 5. Шапка: HUD-вкладки с переключателями A / E ---------- */
const SHD_NAV = [
  { href: 'index.html',         label: 'Главная' },
  { href: 'settings.html',      label: 'Настройки' },
  { href: 'build-striker.html', label: 'Билды' },
  { href: 'gear.html',          label: 'База данных' },
];

function shdHeader() {
  const mount = document.getElementById('shd-nav');
  if (!mount) return;
  const current = location.pathname.split('/').pop() || 'index.html';
  const idx = SHD_NAV.findIndex(l => l.href === current);
  const tabs = SHD_NAV.map(l =>
    `<a class="tab" href="${l.href}"${l.href === current ? ' aria-current="page"' : ''}>${l.label}</a>`).join('');

  mount.outerHTML = `
  <header class="glass sticky top-0 z-40 border-b border-white/10 bg-black/55">
    <div class="mx-auto max-w-7xl px-4 sm:px-8 py-2.5 flex flex-wrap md:flex-nowrap items-center gap-x-6 gap-y-2.5">
      <a href="index.html" class="flex items-center gap-2.5 shrink-0" aria-label="SHD Builds — на главную">
        <span class="grid place-items-center w-8 h-8 bg-shd-orange text-black font-mono text-[10px] font-bold"
              style="clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%);filter:drop-shadow(0 0 6px #ff6a00)">SHD</span>
        <span class="font-hud font-bold uppercase tracking-[0.2em] text-sm sm:text-base">SHD<span class="text-shd-orange">//</span>Builds</span>
      </a>

      <a href="ui-kit.html" class="md:order-last ml-auto md:ml-0 font-mono text-[11px] uppercase tracking-[0.2em] transition hover:text-shd-orange ${current === 'ui-kit.html' ? 'text-shd-orange' : 'text-shd-muted'}">UI Kit</a>

      <div class="order-last md:order-none w-full md:w-auto md:flex-1 flex items-center justify-center gap-2 min-w-0">
        <button type="button" class="keycap" data-nav-step="-1" aria-label="Предыдущая вкладка (A)" title="Предыдущая вкладка — A">A</button>
        <nav class="tabbar h-10 min-w-0 overflow-x-auto no-scrollbar" aria-label="Основная навигация">${tabs}</nav>
        <button type="button" class="keycap" data-nav-step="1" aria-label="Следующая вкладка (E)" title="Следующая вкладка — E">E</button>
      </div>
    </div>
  </header>`;

  // A — предыдущая вкладка, E — следующая (по кругу)
  const go = step => {
    const base = idx === -1 ? (step > 0 ? -1 : 0) : idx;
    const next = SHD_NAV[(base + step + SHD_NAV.length) % SHD_NAV.length];
    document.querySelector(`[data-nav-step="${step}"]`)?.classList.add('is-hot');
    setTimeout(() => (location.href = next.href), 120);
  };
  document.querySelectorAll('[data-nav-step]').forEach(b => b.addEventListener('click', () => go(+b.dataset.navStep)));

  // Клавиатура: A/E (и Ф/У в русской раскладке); не перехватываем ввод текста и модалки
  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
    if (e.target.closest?.('input, textarea, select, [contenteditable], [role=dialog]')) return;
    const k = e.key.toLowerCase();
    if (k === 'a' || k === 'ф') go(-1);
    if (k === 'e' || k === 'у') go(1);
  });

  document.querySelector('.tab[aria-current]')?.scrollIntoView({ block: 'nearest', inline: 'center' });
}

document.addEventListener('DOMContentLoaded', () => { shdBackground(); shdHeader(); });
