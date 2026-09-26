/* =====================================================================
   SHD Builds — дизайн-система в стиле меню The Division 2
   Чистое серое стекло, тонкие линии с узлами по углам,
   оранжевый — только сплошной заливкой активного элемента.
   Подключать сразу ПОСЛЕ https://cdn.tailwindcss.com
   ===================================================================== */

/* ---------- 1. Tailwind: токены ---------- */
tailwind.config = {
  theme: { extend: {
    colors: { shd: {
      bg:'#1c1e21',
      panel:'rgba(22,24,27,var(--glass,.42))',   // стекло панели
      solid:'#1f2226',
      line:'rgba(255,255,255,.18)',              // тонкие линии рамок
      orange:'#f7941e', amber:'#ffb04d',          // оранжевый из меню игры
      text:'#ececec', muted:'#a3a7ad',
      high:'#f5c542', gearset:'#29d17c', exotic:'#e8603c', named:'#d9a441',
      offense:'#e8483b', defense:'#3b8fe8', skill:'#f2c230',
    }},
    fontFamily: {
      sans: ['Barlow','system-ui','sans-serif'],
      hud:  ['Barlow','system-ui','sans-serif'],
      mono: ['"Barlow Semi Condensed"','Barlow','sans-serif'],
    },
    boxShadow: {
      glow: '0 0 0 1px rgba(255,255,255,.28)',
      'glow-strong': '0 0 0 1px rgba(255,255,255,.45)',
    },
    keyframes: { blink:{'0%,100%':{opacity:1},'50%':{opacity:.35}} },
    animation: { blink:'blink 1.4s ease-in-out infinite' },
  }}
};

/* ---------- 2. Компоненты ---------- */
const SHD_CSS = String.raw`
@layer base {
  [x-cloak] { display:none !important; }
  html { scroll-behavior: smooth; background:#1c1e21; }
  body { @apply text-shd-text font-sans antialiased min-h-screen; background: transparent; font-feature-settings: "tnum"; }
  ::selection { @apply bg-shd-orange text-black; }
  :focus-visible { outline: 1px solid #f7941e; outline-offset: 2px; }
}

@layer components {
  /* ===== Рамка с узлами по углам — основа всего интерфейса ===== */
  .frame, .panel, .panel-title, .tile, .gear-card, .tile-select, .cat-item, .set-row, .menu-btn, .hud-corners, .btn-ghost, .btn-toggle {
    --node: rgba(255,255,255,.8);
    border: 1px solid theme('colors.shd.line');
    background-image:
      linear-gradient(var(--node),var(--node)), linear-gradient(var(--node),var(--node)),
      linear-gradient(var(--node),var(--node)), linear-gradient(var(--node),var(--node));
    background-size: 3px 3px; background-repeat: no-repeat;
    background-position: -1px -1px, calc(100% + 1px) -1px, -1px calc(100% + 1px), calc(100% + 1px) calc(100% + 1px);
  }
  /* стекло */
  .glass, .panel, .panel-title, .tile, .gear-card, .tile-select, .cat-item, .set-row, .menu-btn, .btn-ghost, .btn-toggle {
    background-color: theme('colors.shd.panel');
    backdrop-filter: blur(var(--blur,14px)); -webkit-backdrop-filter: blur(var(--blur,14px));
  }

  /* Устаревшие эффекты старой версии — отключены */
  .scanlines::before, .scanlines::after, .panel-brackets::before, .panel-brackets::after,
  .glitch::before, .glitch::after, .hud-cursor::after, .hud-prefix::before { content: none; }

  /* ===== Типографика ===== */
  .hud-h1 { @apply font-sans font-normal text-3xl sm:text-4xl text-white; }
  .hud-h2 { @apply font-sans font-normal text-xl sm:text-2xl text-white; }
  .hud-h3 { @apply font-sans font-semibold text-base text-white; }
  .hud-label { @apply font-sans text-[13px] text-shd-muted; }
  .hud-data { @apply font-sans font-medium text-white tabular-nums; }
  .hud-section { @apply flex items-center gap-4; }
  .hud-section::after { content:''; @apply flex-1 h-px bg-white/20; }
  .q-tag { @apply inline-block px-2 py-0.5 text-xs font-semibold bg-shd-orange text-black; }
  .panel-title { @apply inline-flex items-center px-3 py-1.5 text-xl font-normal text-white; }

  /* ===== Панели ===== */
  .panel { @apply relative p-4 sm:p-6; }

  /* ===== Редкость ===== */
  .rarity-high    { --rarity: theme('colors.shd.high'); }
  .rarity-gearset { --rarity: theme('colors.shd.gearset'); }
  .rarity-exotic  { --rarity: theme('colors.shd.exotic'); }
  .rarity-named   { --rarity: theme('colors.shd.named'); }

  /* ===== Карточка снаряжения ===== */
  .gear-card { @apply relative flex flex-col gap-3 p-4 text-left w-full transition duration-150; }
  button.gear-card, a.gear-card { @apply cursor-pointer; }
  .gear-card:hover { --node:#fff; border-color: rgba(255,255,255,.45); background-color: rgba(255,255,255,.08); }
  .gear-card::before { content:''; @apply absolute left-0 top-3 bottom-3 w-0.5; background: var(--rarity, #f7941e); }
  .gear-icon { @apply grid place-items-center w-12 h-12 shrink-0 border border-white/20 bg-black/25 text-white; }
  .brand-hex { @apply grid place-items-center w-11 h-11 shrink-0 text-xs font-semibold text-white bg-black/30 border border-white/20;
    box-shadow: inset 0 -2px 0 var(--rarity, #f7941e); }
  .attr-row { @apply flex items-center justify-between gap-2 text-sm; }
  .attr-dot { @apply inline-block w-1.5 h-1.5 rotate-45 mr-2 shrink-0; }
  .stat-bar { @apply relative h-px w-full bg-white/25; }
  .stat-bar > span { @apply absolute left-0 -top-px block h-[3px] bg-white transition-all duration-300; }

  /* ===== Плитка базы снаряжения ===== */
  .tile { @apply relative flex flex-col transition duration-150; }
  .tile:hover { --node:#fff; border-color: rgba(255,255,255,.4); }
  .tile::before { content:''; @apply absolute left-4 right-4 top-0 h-0.5; background: var(--rarity); }
  .tile.is-set   { --rarity: theme('colors.shd.gearset'); }
  .tile.is-brand { --rarity: theme('colors.shd.high'); }

  /* Строка бонуса: при наведении — оранжевая подсветка */
  .bonus-row { @apply relative grid grid-cols-[4.5rem_1fr] gap-3 items-baseline px-4 py-2 border-l-2 border-transparent
               cursor-default transition-all duration-150 outline-none; }
  .bonus-row .pc  { @apply text-xs text-shd-muted transition-colors; }
  .bonus-row .txt { @apply text-[15px] leading-snug text-white/85 transition-colors; }
  .bonus-row:hover, .bonus-row:focus-visible { @apply border-shd-orange bg-shd-orange/10; }
  .bonus-row:hover .pc, .bonus-row:focus-visible .pc,
  .bonus-row:hover .txt, .bonus-row:focus-visible .txt { @apply text-shd-orange; text-shadow: 0 0 10px rgba(247,148,30,.55); }
  .bonus-row.is-talent .txt b { @apply font-semibold text-white; }
  .bonus-row.is-talent:hover .txt b { @apply text-shd-amber; }

  /* Источники */
  .src { @apply inline-flex items-center gap-1.5 px-2 py-0.5 text-xs border border-white/15 text-white/80; }
  .src::before { content:''; @apply w-1.5 h-1.5 rotate-45; background: currentColor; }
  .src-targeted  { @apply text-shd-amber; }
  .src-summit    { @apply text-sky-300; }
  .src-countdown { @apply text-violet-300; }
  .src-raid      { @apply text-shd-exotic border-shd-exotic/50; }
  .src-dz        { @apply text-fuchsia-300 border-fuchsia-300/50; }
  .src-exclusive::after { content:'только'; @apply ml-1 px-1 text-[10px] bg-white/10 text-white; }

  /* ===== Кнопки ===== */
  .btn-tac { @apply inline-flex items-center justify-center gap-2 h-11 px-8 text-lg font-medium bg-shd-orange text-black
             transition hover:bg-shd-amber active:translate-y-px; }
  .btn-ghost, .btn-toggle { @apply inline-flex items-center justify-center gap-2 h-10 px-5 text-base text-white/85 transition
             hover:text-white hover:bg-white/10; }
  .btn-ghost:hover, .btn-toggle:hover { --node:#fff; border-color: rgba(255,255,255,.45); }
  .btn-toggle[aria-pressed="true"] { --node:#000; @apply bg-shd-orange text-black border-shd-orange; }
  .btn-toggle[aria-pressed="true"]:hover { @apply bg-shd-amber; }
  .btn-toggle .count { @apply text-xs opacity-60; }
  .btn-toggle::before { content:''; @apply w-1.5 h-1.5 rotate-45 shrink-0; background: var(--dot, transparent); }
  .btn-toggle:not([style*="--dot"])::before { display:none; }

  /* Меню-кнопка (стек панелей как на главном экране игры) */
  .menu-btn { @apply flex items-center justify-center w-full h-12 text-xl text-white/90 transition hover:text-white hover:bg-white/10; }
  .menu-btn:hover { --node:#fff; border-color: rgba(255,255,255,.45); }
  .menu-btn.is-primary { --node:#000; @apply bg-shd-orange text-black border-shd-orange hover:bg-shd-amber; }

  /* ===== Прочее ===== */
  .badge { @apply inline-flex items-center px-1.5 py-px text-xs border border-white/20 text-white/80; }
  .pip { @apply w-2.5 h-2.5 border border-white/40; }
  .pip.on { @apply bg-white border-white; }
  .hud-input { @apply w-full h-10 bg-black/30 border border-white/20 px-3 text-base text-white placeholder:text-white/40
               outline-none transition focus:border-shd-orange; }
  input[type=range] { @apply w-full appearance-none bg-transparent cursor-pointer; }
  input[type=range]::-webkit-slider-runnable-track { @apply h-px bg-white/40; }
  input[type=range]::-webkit-slider-thumb { @apply appearance-none w-1 h-3.5 -mt-[7px] bg-white; }
  input[type=range]::-moz-range-track { @apply h-px bg-white/40; }
  input[type=range]::-moz-range-thumb { @apply w-1 h-3.5 bg-white border-0 rounded-none; }

  /* ===== Шапка: вкладки с иконкой над подписью ===== */
  .tabbar { @apply flex items-stretch border border-white/20 bg-black/30; }
  .tab { @apply relative flex flex-col items-center justify-center gap-0.5 min-w-[5.5rem] px-3 text-[13px] leading-none
         text-white/85 whitespace-nowrap transition hover:bg-white/10 hover:text-white; }
  .tab svg { @apply w-[18px] h-[18px]; }
  .tab + .tab { @apply border-l border-white/20; }
  .tab[aria-current="page"] { @apply bg-shd-orange text-black; }
  .nav-key { @apply text-3xl font-light leading-none text-shd-orange transition hover:text-shd-amber px-1; }
  .nav-key.is-hot { @apply text-white; }

  /* Клавиша-подсказка (A / E / R / Enter / Esc) */
  .keycap { @apply inline-grid place-items-center min-w-[1.6rem] h-6 px-1.5 text-xs font-semibold bg-black/60 border border-white/25 text-white; }
  .keycap.is-accent { @apply text-shd-orange; }

  /* Угловые маркеры отдельно (узлы уже в .frame) */
  .hud-corners { background-color: transparent; }

  /* ===== Плитка выбора (Matchmaking / татуировки) ===== */
  .tile-select { @apply relative flex flex-col items-center justify-between gap-4 p-4 text-center min-h-[150px]
                 transition duration-150 cursor-pointer; }
  .tile-select .ico { @apply w-12 h-12 text-white/60 transition; }
  .tile-select .t-title { @apply text-[15px] font-semibold text-white/60 transition; }
  .tile-select .t-sub { @apply text-xs text-white/40 transition; }
  .tile-select:hover { --node:#fff; border-color: rgba(255,255,255,.45); background-color: rgba(255,255,255,.08); }
  .tile-select:hover .ico, .tile-select:hover .t-title { @apply text-white; }
  .tile-select:hover .t-sub { @apply text-white/70; }
  .tile-select[aria-pressed="true"] { --node:#000; @apply bg-shd-orange border-shd-orange; }
  .tile-select[aria-pressed="true"] .ico,
  .tile-select[aria-pressed="true"] .t-title { @apply text-black/80; }
  .tile-select[aria-pressed="true"] .t-sub { @apply text-black/60; }

  /* ===== Меню настроек ===== */
  .cat-item { @apply flex items-center w-full h-11 px-3 text-left text-xl text-white/90 transition hover:bg-white/10 hover:text-white; }
  .cat-item:hover { --node:#fff; }
  .cat-item[aria-selected="true"] { --node:#000; @apply bg-shd-orange text-black border-shd-orange; }

  .set-row { @apply relative grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_260px] gap-2 px-3 pt-2 pb-3 min-h-[72px] transition; }
  .set-row:hover, .set-row:focus-within { --node:#fff; border-color: rgba(255,255,255,.4); background-color: rgba(255,255,255,.06); }
  .set-row .r-title { @apply text-sm font-semibold text-white; }
  .set-row .r-desc  { @apply text-xs text-shd-muted; }

  /* Контрол «‹ 030 ›» с полосой под значением */
  .arrow { @apply grid place-items-center w-8 h-8 text-2xl leading-none text-white/85 transition hover:text-shd-orange; }
  .arrow:disabled { @apply text-white/25 cursor-default hover:text-white/25; }
  .val { @apply text-base tabular-nums text-white; }
  .opt { @apply text-base text-white/35 transition; }
  .opt.on { @apply text-white; }

  input[type=range].hud-range { @apply h-4; --p: 50%;
    background:
      linear-gradient(#fff,#fff) left center / var(--p) 3px no-repeat,
      linear-gradient(rgba(255,255,255,.35),rgba(255,255,255,.35)) left center / 100% 1px no-repeat,
      linear-gradient(rgba(255,255,255,.6),rgba(255,255,255,.6)) right center / 1px 7px no-repeat; }
  input[type=range].hud-range::-webkit-slider-runnable-track { @apply h-4 bg-transparent; }
  input[type=range].hud-range::-webkit-slider-thumb { @apply w-0.5 h-3 mt-0.5 bg-white opacity-0; }
  input[type=range].hud-range:hover::-webkit-slider-thumb, input[type=range].hud-range:focus-visible::-webkit-slider-thumb { @apply opacity-100; }
  input[type=range].hud-range::-moz-range-track { @apply bg-transparent; }
  input[type=range].hud-range::-moz-range-thumb { @apply w-0.5 h-3 bg-white opacity-0; }

  .no-scrollbar { scrollbar-width: none; }
  .no-scrollbar::-webkit-scrollbar { display: none; }

  /* Тонкая белая полоса прокрутки, как в меню игры */
  * { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.7) transparent; }
}
`;
(() => {
  const s = document.createElement('style');
  s.type = 'text/tailwindcss';
  s.textContent = SHD_CSS;
  document.head.appendChild(s);
})();

/* ---------- 3. Настройки интерфейса (редактируются на странице «Настройки») ---------- */
const SHD_UI_DEFAULTS = { glass: 42, blur: 14, motion: true };
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
    document.documentElement.classList.toggle('shd-still', !v.motion);
  },
};
SHD_UI.apply(SHD_UI.load());

/* ---------- 4. Фон: размытая «игровая сцена» за меню ---------- */
function shdBackground() {
  const el = document.createElement('div');
  el.id = 'shd-bg';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
  <style>
    #shd-bg { position:fixed; inset:0; z-index:-1; overflow:hidden; pointer-events:none;
      background: linear-gradient(180deg, #4a4f55 0%, #34383d 38%, #25282c 70%, #1b1d20 100%); }
    #shd-bg .light { position:absolute; border-radius:9999px; filter:blur(80px); animation: shdDrift 30s ease-in-out infinite alternate; }
    #shd-bg .l1 { width:55vw; height:40vw; left:-10%; top:-15%; background:rgba(210,220,230,.28); }
    #shd-bg .l2 { width:30vw; height:30vw; left:30%; top:40%; background:rgba(70,110,255,.20); animation-duration:36s; }
    #shd-bg .l3 { width:40vw; height:30vw; right:-10%; top:10%; background:rgba(255,170,90,.12); animation-duration:26s; }
    #shd-bg svg { position:absolute; left:0; width:100%; }
    #shd-bg .far  { bottom:22%; height:55%; filter:blur(7px); opacity:.55; }
    #shd-bg .near { bottom:0;   height:45%; filter:blur(4px); opacity:.85; }
    #shd-bg .fog { position:absolute; inset:auto 0 0 0; height:60%;
      background: linear-gradient(to top, rgba(28,30,33,.95), rgba(60,64,70,.35) 55%, transparent); }
    #shd-bg .vignette { position:absolute; inset:0; background: radial-gradient(ellipse at 50% 40%, transparent 50%, rgba(0,0,0,.55) 100%); }
    @keyframes shdDrift { to { transform: translate(-5vw, 4vh) scale(1.1); } }
    .shd-still #shd-bg * { animation: none !important; }
    @media (prefers-reduced-motion: reduce) { #shd-bg * { animation: none !important; } }
  </style>
  <div class="light l1"></div><div class="light l2"></div><div class="light l3"></div>
  <svg class="far" viewBox="0 0 1200 300" preserveAspectRatio="none">
    <path fill="#565b62" d="M0 300V170h60v-50h40v40h50V80h70v90h40v-60h60v-40h30v110h50V60h90v130h40v-80h60v60h50V40h30v150h60v-90h80v110h40v-70h50V100h60v110h40v-90h70v140h40V300z"/>
  </svg>
  <svg class="near" viewBox="0 0 1200 300" preserveAspectRatio="none">
    <path fill="#2a2d31" d="M0 300V140h30v-20h120v20h30v160h40V90h12v-20h8v20h12v210h60V160h140v-30h20v30h40v140h50V110h20V80h10v30h20v190h40V150h60v-20h90v20h40v150h40V120h14v-30h6v30h14v180h60V170h130v130z"/>
    <g fill="#3a3e44"><rect x="40" y="160" width="6" height="140"/><rect x="80" y="160" width="6" height="140"/><rect x="120" y="160" width="6" height="140"/></g>
  </svg>
  <div class="fog"></div><div class="vignette"></div>`;
  document.body.prepend(el);
}

/* ---------- 5. Шапка: вкладки с иконками и переключатели A / E ---------- */
const SHD_ICONS = {
  home:  '<path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z" fill="currentColor"/>',
  gear:  '<path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96a7 7 0 00-1.62-.94l-.36-2.54a.48.48 0 00-.48-.41h-3.84a.48.48 0 00-.47.41l-.36 2.54a7.4 7.4 0 00-1.62.94l-2.39-.96a.48.48 0 00-.59.22L2.74 8.87a.47.47 0 00.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54a7 7 0 001.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 00-.12-.61zM12 15.6a3.6 3.6 0 110-7.2 3.6 3.6 0 010 7.2z"/>',
  build: '<path fill="currentColor" d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6zm0 4.2L7 8.4V12c0 2.8 2.1 5.4 5 6.2z"/>',
  data:  '<path fill="currentColor" d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/>',
};
const SHD_NAV = [
  { href: 'index.html',         label: 'Главная',     icon: 'home'  },
  { href: 'settings.html',      label: 'Настройки',   icon: 'gear'  },
  { href: 'build-striker.html', label: 'Билды',       icon: 'build' },
  { href: 'gear.html',          label: 'База данных', icon: 'data'  },
];

function shdHeader() {
  const mount = document.getElementById('shd-nav');
  if (!mount) return;
  const current = location.pathname.split('/').pop() || 'index.html';
  const idx = SHD_NAV.findIndex(l => l.href === current);
  const tabs = SHD_NAV.map(l => `
    <a class="tab" href="${l.href}"${l.href === current ? ' aria-current="page"' : ''}>
      <svg viewBox="0 0 24 24" aria-hidden="true">${SHD_ICONS[l.icon]}</svg><span>${l.label}</span>
    </a>`).join('');

  mount.outerHTML = `
  <header class="relative z-40">
    <div class="mx-auto max-w-7xl px-4 sm:px-8 pt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <a href="index.html" class="flex items-center gap-2 text-white" aria-label="SHD Builds — на главную">
        <span class="grid place-items-center w-8 h-8 bg-shd-orange text-black text-[11px] font-bold">SHD</span>
        <span class="text-lg font-medium">SHD Builds</span>
      </a>
      <div class="flex items-center gap-2 max-w-full">
        <button type="button" class="nav-key" data-nav-step="-1" aria-label="Предыдущая вкладка (A)" title="Предыдущая вкладка — A">A</button>
        <nav class="tabbar h-14 overflow-x-auto no-scrollbar" aria-label="Основная навигация">${tabs}</nav>
        <button type="button" class="nav-key" data-nav-step="1" aria-label="Следующая вкладка (E)" title="Следующая вкладка — E">E</button>
      </div>
    </div>
  </header>`;

  // A — предыдущая вкладка, E — следующая (по кругу)
  const go = step => {
    const base = idx === -1 ? (step > 0 ? -1 : 0) : idx;
    const next = SHD_NAV[(base + step + SHD_NAV.length) % SHD_NAV.length];
    document.querySelector(`[data-nav-step="${step}"]`)?.classList.add('is-hot');
    setTimeout(() => (location.href = next.href), 100);
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
