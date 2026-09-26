/* =====================================================================
   SHD Builds — дизайн-система в стиле меню The Division 2
   Светлый «дымчатый» фон, серое стекло панелей с узлами по углам,
   оранжевый — только сплошной заливкой активного элемента.
   Цвет текста зависит от контекста: тёмный на фоне, светлый на панелях.
   Подключать сразу ПОСЛЕ https://cdn.tailwindcss.com
   ===================================================================== */

/* ---------- 0. Экран загрузки: прячем страницу, если пришли по вкладке ---------- */
(() => {
  let arriving = false;
  try { arriving = sessionStorage.getItem('shd-loader') === '1'; } catch (e) {}
  if (!arriving) return;
  document.documentElement.classList.add('shd-arriving');
  const s = document.createElement('style');
  s.textContent = 'html.shd-arriving::after{content:"";position:fixed;inset:0;z-index:200;background:#cfc9be}';
  document.head.appendChild(s);
})();

/* ---------- 1. Tailwind: токены ---------- */
tailwind.config = {
  theme: { extend: {
    colors: { shd: {
      bg:'#cfc9be',
      panel:'rgba(34,35,37,var(--glass,.62))',   // стекло панели
      solid:'#2a2b2e',
      line:'rgba(255,255,255,.2)',
      orange:'#f7941e', amber:'#ffb04d',
      text:'rgb(var(--ink) / <alpha-value>)',        // тёмный на фоне, светлый на панелях
      muted:'rgb(var(--ink-muted) / <alpha-value>)',
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
  html { scroll-behavior: smooth; background:#cfc9be; }
  body { --ink: 42 40 37; --ink-muted: 98 93 86;
    @apply text-shd-text font-sans antialiased min-h-screen; background: transparent; }
  ::selection { @apply bg-shd-orange text-black; }
  :focus-visible { outline: 1px solid #f7941e; outline-offset: 2px; }

  /* Тёмный контекст: внутри панелей текст светлый */
  .frame, .glass, .panel, .panel-title, .tile, .gear-card, .tile-select, .cat-item, .set-row, .menu-btn,
  .btn-ghost, .btn-toggle, .tabbar, .nav-key, .keycap, .hud-input, [role=dialog] {
    --ink: 236 236 236; --ink-muted: 170 173 178; color: rgb(var(--ink));
  }
}

@layer components {
  /* ===== Рамка с узлами по углам ===== */
  .frame, .panel, .panel-title, .tile, .gear-card, .tile-select, .cat-item, .set-row, .menu-btn, .hud-corners, .btn-ghost, .btn-toggle {
    --node: rgba(255,255,255,.85);
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

  /* ===== Типографика ===== */
  .hud-h1 { @apply font-sans font-normal text-3xl sm:text-4xl text-shd-text; }
  .hud-h2 { @apply font-sans font-normal text-xl sm:text-2xl text-shd-text; }
  .hud-h3 { @apply font-sans font-semibold text-base text-shd-text; }
  .hud-label { @apply font-sans text-[13px] text-shd-muted; }
  .hud-data { @apply font-sans font-medium text-shd-text tabular-nums; }
  .hud-section { @apply flex items-center gap-4; }
  .hud-section::after { content:''; @apply flex-1 h-px bg-shd-text/25; }
  .q-tag { @apply inline-block px-2 py-0.5 text-xs font-semibold bg-shd-orange text-black; }
  .panel-title { @apply inline-flex items-center px-3 py-1.5 text-xl font-normal; }

  .panel { @apply relative p-4 sm:p-6; }

  /* ===== Редкость ===== */
  .rarity-high    { --rarity: theme('colors.shd.high'); }
  .rarity-gearset { --rarity: theme('colors.shd.gearset'); }
  .rarity-exotic  { --rarity: theme('colors.shd.exotic'); }
  .rarity-named   { --rarity: theme('colors.shd.named'); }

  /* ===== Карточка снаряжения / билда ===== */
  .gear-card { @apply relative flex flex-col gap-3 p-4 text-left w-full transition duration-150; }
  button.gear-card, a.gear-card { @apply cursor-pointer; }
  .gear-card:hover { --node:#fff; border-color: rgba(255,255,255,.5); background-color: rgba(52,53,56,.75); }
  .gear-card::before { content:''; @apply absolute left-0 top-3 bottom-3 w-0.5; background: var(--rarity, #f7941e); }
  .gear-icon { @apply grid place-items-center w-12 h-12 shrink-0 border border-white/20 bg-black/25; }
  .brand-hex { @apply grid place-items-center w-11 h-11 shrink-0 text-xs font-semibold bg-black/30 border border-white/20;
    box-shadow: inset 0 -2px 0 var(--rarity, #f7941e); }
  .attr-row { @apply flex items-center justify-between gap-2 text-sm; }
  .attr-dot { @apply inline-block w-1.5 h-1.5 rotate-45 mr-2 shrink-0; }
  .stat-bar { @apply relative h-px w-full bg-shd-text/30; }
  .stat-bar > span { @apply absolute left-0 -top-px block h-[3px] bg-shd-text transition-all duration-300; }

  /* ===== Плитка базы снаряжения ===== */
  .tile { @apply relative flex flex-col transition duration-150; }
  .tile:hover { --node:#fff; border-color: rgba(255,255,255,.45); }
  .tile::before { content:''; @apply absolute left-4 right-4 top-0 h-0.5; background: var(--rarity); }
  .tile.is-set   { --rarity: theme('colors.shd.gearset'); }
  .tile.is-brand { --rarity: theme('colors.shd.high'); }

  .bonus-row { @apply relative grid grid-cols-[4.5rem_1fr] gap-3 items-baseline px-4 py-2 border-l-2 border-transparent
               cursor-default transition-all duration-150 outline-none; }
  .bonus-row .pc  { @apply text-xs text-shd-muted transition-colors; }
  .bonus-row .txt { @apply text-[15px] leading-snug text-shd-text/85 transition-colors; }
  .bonus-row:hover, .bonus-row:focus-visible { @apply border-shd-orange bg-shd-orange/10; }
  .bonus-row:hover .pc, .bonus-row:focus-visible .pc,
  .bonus-row:hover .txt, .bonus-row:focus-visible .txt { @apply text-shd-orange; text-shadow: 0 0 10px rgba(247,148,30,.55); }
  .bonus-row.is-talent .txt b { @apply font-semibold text-shd-text; }
  .bonus-row.is-talent:hover .txt b { @apply text-shd-amber; }

  .src { @apply inline-flex items-center gap-1.5 px-2 py-0.5 text-xs border border-white/15 text-shd-text/80; }
  .src::before { content:''; @apply w-1.5 h-1.5 rotate-45; background: currentColor; }
  .src-targeted  { @apply text-shd-amber; }
  .src-summit    { @apply text-sky-300; }
  .src-countdown { @apply text-violet-300; }
  .src-raid      { @apply text-shd-exotic border-shd-exotic/50; }
  .src-dz        { @apply text-fuchsia-300 border-fuchsia-300/50; }
  .src-exclusive::after { content:'только'; @apply ml-1 px-1 text-[10px] bg-white/10 text-shd-text; }

  /* ===== Кнопки ===== */
  .btn-tac { @apply inline-flex items-center justify-center gap-2 h-11 px-8 text-lg font-medium bg-shd-orange text-black
             transition hover:bg-shd-amber active:translate-y-px; }
  .btn-ghost, .btn-toggle { @apply inline-flex items-center justify-center gap-2 h-10 px-5 text-base transition; }
  .btn-ghost:hover, .btn-toggle:hover { --node:#fff; border-color: rgba(255,255,255,.5); background-color: rgba(52,53,56,.8); }
  .btn-toggle[aria-pressed="true"] { --node:#000; @apply bg-shd-orange text-black border-shd-orange; }
  .btn-toggle[aria-pressed="true"]:hover { @apply bg-shd-amber; }
  .btn-toggle .count { @apply text-xs opacity-60; }
  .btn-toggle::before { content:''; @apply w-1.5 h-1.5 rotate-45 shrink-0; background: var(--dot, transparent); }
  .btn-toggle:not([style*="--dot"])::before { display:none; }

  .menu-btn { @apply flex items-center justify-center w-full h-12 text-xl transition; }
  .menu-btn:hover { --node:#fff; border-color: rgba(255,255,255,.5); background-color: rgba(52,53,56,.8); }
  .menu-btn.is-primary { --node:#000; @apply bg-shd-orange text-black border-shd-orange hover:bg-shd-amber; }

  /* ===== Прочее ===== */
  .badge { @apply inline-flex items-center px-1.5 py-px text-xs border; border-color: rgb(var(--ink) / .3); }
  .pip { @apply w-2.5 h-2.5 border border-shd-text/50; }
  .pip.on { @apply bg-shd-text border-shd-text; }
  .hud-input { @apply w-full h-10 bg-black/40 border border-white/20 px-3 text-base placeholder:text-white/40
               outline-none transition focus:border-shd-orange; }
  input[type=range] { @apply w-full appearance-none bg-transparent cursor-pointer; }
  input[type=range]::-webkit-slider-runnable-track { @apply h-px bg-white/40; }
  input[type=range]::-webkit-slider-thumb { @apply appearance-none w-1 h-3.5 -mt-[7px] bg-white; }
  input[type=range]::-moz-range-track { @apply h-px bg-white/40; }
  input[type=range]::-moz-range-thumb { @apply w-1 h-3.5 bg-white border-0 rounded-none; }

  /* ===== Шапка: [A][вкладки][E] единой полосой, как в игре ===== */
  .tab-group { @apply relative flex items-stretch h-14; }
  .tabbar { @apply flex items-stretch bg-black/35 border-x border-black/40; backdrop-filter: blur(10px); }
  .tab { @apply relative flex flex-col items-center justify-center gap-0.5 min-w-[5.5rem] px-3 text-[13px] leading-none
         whitespace-nowrap transition hover:bg-white/10; }
  .tab svg { @apply w-[18px] h-[18px]; }
  .tab[aria-current="page"] { @apply bg-shd-orange text-black; }
  .nav-key { @apply grid place-items-center w-11 shrink-0 text-2xl font-light leading-none bg-black/35 transition
             hover:bg-shd-orange hover:text-black; backdrop-filter: blur(10px); }
  .nav-key.is-hot { @apply bg-shd-orange text-black; }

  .keycap { @apply inline-grid place-items-center min-w-[1.6rem] h-6 px-1.5 text-xs font-semibold bg-black/55 border border-white/25; }
  .keycap.is-accent { @apply text-shd-orange; }
  .hud-corners { background-color: transparent; }

  /* ===== Плитка выбора (Matchmaking / татуировки) ===== */
  .tile-select { @apply relative flex flex-col items-center justify-between gap-4 p-4 text-center min-h-[150px]
                 transition duration-150 cursor-pointer; }
  .tile-select .ico { @apply w-12 h-12 text-shd-text/60 transition; }
  .tile-select .t-title { @apply text-[15px] font-semibold text-shd-text/70 transition; }
  .tile-select .t-sub { @apply text-xs text-shd-text/45 transition; }
  .tile-select:hover { --node:#fff; border-color: rgba(255,255,255,.5); background-color: rgba(52,53,56,.75); }
  .tile-select:hover .ico, .tile-select:hover .t-title { @apply text-shd-text; }
  .tile-select:hover .t-sub { @apply text-shd-text/70; }
  .tile-select[aria-pressed="true"] { --node:#000; @apply bg-shd-orange border-shd-orange; }
  .tile-select[aria-pressed="true"] .ico,
  .tile-select[aria-pressed="true"] .t-title { @apply text-black/80; }
  .tile-select[aria-pressed="true"] .t-sub { @apply text-black/60; }

  /* ===== Меню настроек ===== */
  .cat-item { @apply flex items-center w-full h-11 px-3 text-left text-xl transition hover:bg-white/10; }
  .cat-item:hover { --node:#fff; }
  .cat-item[aria-selected="true"] { --node:#000; @apply bg-shd-orange text-black border-shd-orange; }

  .set-row { @apply relative grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_260px] gap-2 px-3 pt-2 pb-3 min-h-[72px] transition; }
  .set-row:hover, .set-row:focus-within { --node:#fff; border-color: rgba(255,255,255,.45); background-color: rgba(52,53,56,.72); }
  .set-row .r-title { @apply text-sm font-semibold; }
  .set-row .r-desc  { @apply text-xs text-shd-muted; }

  .arrow { @apply grid place-items-center w-8 h-8 text-2xl leading-none text-shd-text/85 transition hover:text-shd-orange; }
  .arrow:disabled { @apply text-shd-text/25 cursor-default hover:text-shd-text/25; }
  .val { @apply text-base tabular-nums; }
  .opt { @apply text-base text-shd-text/35 transition; }
  .opt.on { @apply text-shd-text; }

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
  * { scrollbar-width: thin; scrollbar-color: rgba(60,58,54,.6) transparent; }
}
`;
(() => {
  const s = document.createElement('style');
  s.type = 'text/tailwindcss';
  s.textContent = SHD_CSS;
  document.head.appendChild(s);
})();

/* ---------- 3. Настройки интерфейса (страница «Настройки») ---------- */
const SHD_UI_DEFAULTS = { glass: 62, blur: 14, motion: true };
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

/* ---------- 4. Фон: светлый дымчатый «бетон» с разводами, как на экране загрузки ---------- */
function shdBackground() {
  const el = document.createElement('div');
  el.id = 'shd-bg';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
  <style>
    #shd-bg { position:fixed; inset:0; z-index:-1; overflow:hidden; pointer-events:none;
      background: radial-gradient(ellipse 80% 70% at 50% 42%, #ddd8ce 0%, #cdc7bb 45%, #b7b0a3 100%); }
    #shd-bg svg { position:absolute; inset:-10%; width:120%; height:120%; }
    #shd-bg .smoke { animation: shdSmoke 90s ease-in-out infinite alternate; transform-origin: 50% 45%; }
    #shd-bg .vignette { position:absolute; inset:0; background: radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(95,88,76,.35) 100%); }
    @keyframes shdSmoke { to { transform: rotate(6deg) scale(1.06); } }
    .shd-still #shd-bg * { animation: none !important; }
    @media (prefers-reduced-motion: reduce) { #shd-bg * { animation: none !important; } }
  </style>
  <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
    <defs>
      <filter id="shdSmokeF" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="3" seed="7" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="140" xChannelSelector="R" yChannelSelector="G"/>
        <feGaussianBlur stdDeviation="14"/>
      </filter>
      <filter id="shdGrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
        <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.33  0 0 0 0 0.3  0 0 0 0.55 0"/>
      </filter>
    </defs>
    <!-- дымные кольца вокруг центра -->
    <g class="smoke" filter="url(#shdSmokeF)" fill="none" stroke="#6d675d">
      <ellipse cx="800" cy="450" rx="700" ry="430" stroke-width="70" opacity=".22"/>
      <ellipse cx="760" cy="470" rx="560" ry="330" stroke-width="28" opacity=".18"/>
      <path d="M-50 380 C 250 150, 600 60, 900 90 S 1450 260, 1650 520" stroke-width="90" opacity=".16"/>
      <path d="M-40 760 C 300 880, 700 960, 1100 900 S 1500 700, 1660 820" stroke-width="120" opacity=".2"/>
      <path d="M120 620 C 180 420, 330 260, 520 210" stroke-width="40" opacity=".2"/>
      <path d="M1480 300 C 1420 520, 1320 640, 1150 720" stroke-width="50" opacity=".18"/>
    </g>
    <!-- тонкие кольца-«водяной знак» в центре -->
    <g fill="none" stroke="#8b8478" opacity=".35">
      <circle cx="800" cy="440" r="170" stroke-width="1.5"/>
      <circle cx="800" cy="470" r="150" stroke-width="1"/>
    </g>
    <rect width="1600" height="1000" filter="url(#shdGrain)" opacity=".35"/>
  </svg>
  <div class="vignette"></div>`;
  document.body.prepend(el);
}

/* ---------- 5. Экран загрузки при переключении вкладок ---------- */
const SHD_TIPS = [
  { cat:0, title:'Потолок крита',        text:'Шанс критического попадания выше 60% не работает. Лишнее перекалибруйте в урон крита.' },
  { cat:0, title:'Укрытия',              text:'Перебегайте от укрытия к укрытию: агент в укрытии получает заметно меньше урона.' },
  { cat:0, title:'Стаки комплектов',     text:'Многие комплекты копят стаки только пока вы стреляете. Пауза в бою — потерянный урон.' },
  { cat:1, title:'Калибровка',           text:'На станции калибровки можно заменить один атрибут или талант предмета значением из Библиотеки.' },
  { cat:1, title:'Оптимизация',          text:'Оптимизационная станция поднимает атрибуты предмета до максимума за материалы.' },
  { cat:1, title:'Целевой трофей',       text:'У каждой локации и миссии есть целевой трофей. Проверьте карту, прежде чем фармить нужный бренд.' },
  { cat:2, title:'Тёмная зона',          text:'Добыча из Тёмной зоны заражена — эвакуируйте её вертолётом, чтобы забрать.' },
  { cat:2, title:'Контрольные точки',    text:'Захват контрольных точек даёт снабжение и открывает тайники в округе.' },
  { cat:2, title:'Экзотики',             text:'Экзотические предметы выпадают из тайников и доступны как целевой трофей в Обратном отсчёте.' },
];
const SHD_TIP_CATS = [
  { label:'Геймплей', icon:'<path fill="currentColor" d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.6 7.1 18.2 8 12.7 4 8.8l5.5-.8z"/>' },
  { label:'Инфо',     icon:'<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path fill="currentColor" d="M11 10h2v7h-2zm0-4h2v2h-2z"/>' },
  { label:'Мир',      icon:'<path fill="currentColor" d="M12 3l9 5v2H3V8zm-7 9h2v6H5zm4 0h2v6H9zm4 0h2v6h-2zm4 0h2v6h-2zM3 20h18v2H3z"/>' },
];

const SHD_LOADER = {
  el: null,
  build() {
    if (this.el) return this.el;
    const tip = SHD_TIPS[Math.floor(Math.random() * SHD_TIPS.length)];
    const cats = SHD_TIP_CATS.map((c, i) => `
      <span class="flex flex-col items-center justify-center gap-0.5 px-3 min-w-[5rem] text-[13px] leading-none ${i === tip.cat ? 'bg-[#f7941e] text-black' : 'text-white/90'}">
        <svg viewBox="0 0 24 24" class="w-[18px] h-[18px]">${c.icon}</svg>${c.label}</span>`).join('');
    const el = document.createElement('div');
    el.id = 'shd-loader';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.innerHTML = `
    <style>
      #shd-loader { position:fixed; inset:0; z-index:150; display:flex; flex-direction:column; align-items:center; justify-content:safe center; overflow-y:auto;
        gap:28px; padding:24px; color:#2b2926; font-family:Barlow,system-ui,sans-serif; opacity:0; transition:opacity .2s ease;
        background: radial-gradient(ellipse 80% 70% at 50% 42%, rgba(221,216,206,.94), rgba(190,183,171,.97));
        backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
      #shd-loader.on { opacity:1; }
      #shd-loader .ring { position:relative; width:min(300px,70vw); aspect-ratio:1; }
      #shd-loader .ring svg { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
      #shd-loader .spin { transform-origin:150px 150px; animation: shdSpin 2.4s cubic-bezier(.6,.1,.3,.9) infinite; }
      #shd-loader .num, #shd-loader .echo { position:absolute; inset:0; display:grid; place-items:center; }
      #shd-loader .echo { transform:translateY(22%); opacity:.12; filter:blur(.5px); }
      #shd-loader .digits { font-weight:300; font-size:clamp(56px,11vw,96px); line-height:1; letter-spacing:-.02em; font-variant-numeric:tabular-nums; }
      #shd-loader .ghost { color:transparent; -webkit-text-stroke:1.5px rgba(43,41,38,.55); }
      #shd-loader .pct { font-size:.32em; vertical-align:top; position:relative; top:.15em; margin-left:.04em; font-weight:400; }
      @keyframes shdSpin { to { transform: rotate(360deg); } }
      @media (prefers-reduced-motion: reduce) { #shd-loader .spin { animation:none; } }
    </style>

    <div class="ring" aria-hidden="true">
      <svg viewBox="0 0 300 300">
        <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(43,41,38,.18)" stroke-width="1"/>
        <circle cx="150" cy="172" r="128" fill="none" stroke="rgba(43,41,38,.16)" stroke-width="1"/>
        <circle cx="150" cy="150" r="128" fill="none" stroke="rgba(43,41,38,.75)" stroke-width="2"/>
        <circle cx="150" cy="150" r="110" fill="none" stroke="rgba(43,41,38,.22)" stroke-width="1"/>
        <path d="M18 150h10M272 150h10M150 36v8" stroke="rgba(43,41,38,.6)" stroke-width="2"/>
        <circle class="bar" cx="150" cy="150" r="140" fill="none" stroke="rgba(43,41,38,.55)" stroke-width="2"
                stroke-dasharray="0 880" transform="rotate(-90 150 150)"/>
        <g class="spin">
          <path d="M150 10 A140 140 0 0 1 188 15.3" fill="none" stroke="#f7941e" stroke-width="6"/>
          <path d="M150 5v10M188 10v11" stroke="#2b2926" stroke-width="2"/>
          <path d="M201 20 l5 3" stroke="#2b2926" stroke-width="3"/>
        </g>
      </svg>
      <div class="echo"><span class="digits"><span class="d"></span><span class="pct">%</span></span></div>
      <div class="num"><span class="digits"><span class="d"></span><span class="pct">%</span></span></div>
    </div>

    <div class="flex items-stretch h-14 text-white" aria-hidden="true">
      <span class="grid place-items-center w-11 text-2xl font-light bg-black/35">A</span>
      <span class="flex items-stretch bg-black/35 border-x border-black/40">${cats}</span>
      <span class="grid place-items-center w-11 text-2xl font-light bg-black/35">E</span>
    </div>

    <div class="text-center max-w-3xl space-y-3">
      <p class="text-2xl font-medium">${tip.title}</p>
      <p class="text-lg leading-snug text-[#3d3a35]">${tip.text}</p>
      <div class="flex items-center pt-2 mx-auto w-2/3">
        <i class="w-px h-2 bg-black/40"></i><i class="flex-1 h-px bg-black/35"></i><i class="w-px h-2 bg-black/40"></i><i class="flex-1 h-px bg-black/35"></i><i class="w-px h-2 bg-black/40"></i>
      </div>
    </div>

    <p class="text-sm flex items-center gap-2">
      <span class="inline-grid place-items-center h-6 px-2 text-xs font-semibold bg-black/50 text-white">SHD</span>
      <span class="shd-target-label">Загрузка</span>
    </p>`;
    document.body.appendChild(el);
    this.el = el;
    this.set(0);
    return el;
  },
  // «04%»: ведущий ноль — контурный, как в игре
  set(p) {
    const n = Math.max(0, Math.min(100, Math.round(p)));
    const html = n >= 100 ? '100' : (n < 10 ? `<span class="ghost">0</span>${n}` : String(n));
    this.el.querySelectorAll('.d').forEach(d => (d.innerHTML = html));
    this.el.querySelector('.bar').setAttribute('stroke-dasharray', `${(n / 100) * 880} 880`);
    this.el.setAttribute('aria-label', `Загрузка ${n}%`);
  },
  show(label) {
    this.build();
    this.el.querySelector('.shd-target-label').textContent = 'Загрузка: ' + label;
    requestAnimationFrame(() => this.el.classList.add('on'));
  },
  // Анимация 0 → 100 с «подвисаниями», затем переход
  go(href, label) {
    if (this.busy) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { location.href = href; return; }
    this.busy = true;
    this.show(label);
    const total = 900 + Math.random() * 300, t0 = performance.now();
    const tick = now => {
      const k = Math.min(1, (now - t0) / total);
      const eased = 1 - Math.pow(1 - k, 2.2);
      this.set(eased * 100 + (k < 1 ? Math.sin(k * 20) * 1.5 : 0));
      if (k < 1) return requestAnimationFrame(tick);
      this.set(100);
      try { sessionStorage.setItem('shd-loader', '1'); } catch (e) {}
      setTimeout(() => (location.href = href), 120);
    };
    requestAnimationFrame(tick);
  },
  // На новой странице: показать 100% и плавно растворить
  arrive() {
    if (!document.documentElement.classList.contains('shd-arriving')) return;
    try { sessionStorage.removeItem('shd-loader'); } catch (e) {}
    this.build(); this.set(100);
    this.el.style.transition = 'none'; this.el.classList.add('on');
    document.documentElement.classList.remove('shd-arriving');
    // даём Tailwind CDN собрать стили, чтобы не мигала «сырая» страница
    setTimeout(() => {
      this.el.style.transition = 'opacity .35s ease';
      this.el.classList.remove('on');
      setTimeout(() => { this.el?.remove(); this.el = null; }, 400);
    }, 260);
  },
};
// возврат кнопкой «Назад» из кэша браузера — убрать экран загрузки
window.addEventListener('pageshow', e => {
  if (e.persisted && SHD_LOADER.el) { SHD_LOADER.el.remove(); SHD_LOADER.el = null; SHD_LOADER.busy = false; }
});

/* ---------- 6. Шапка: вкладки с иконками и переключатели A / E ---------- */
const SHD_ICONS = {
  home:  '<path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z" fill="currentColor"/>',
  gear:  '<path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96a7 7 0 00-1.62-.94l-.36-2.54a.48.48 0 00-.48-.41h-3.84a.48.48 0 00-.47.41l-.36 2.54a7.4 7.4 0 00-1.62.94l-2.39-.96a.48.48 0 00-.59.22L2.74 8.87a.47.47 0 00.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54a7 7 0 001.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 00-.12-.61zM12 15.6a3.6 3.6 0 110-7.2 3.6 3.6 0 010 7.2z"/>',
  build: '<path fill="currentColor" d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6zm0 4.2L7 8.4V12c0 2.8 2.1 5.4 5 6.2z"/>',
  data:  '<path fill="currentColor" d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/>',
};
const SHD_NAV = [
  { href: 'index.html',    label: 'Главная',     icon: 'home'  },
  { href: 'settings.html', label: 'Настройки',   icon: 'gear'  },
  { href: 'builds.html',   label: 'Билды',       icon: 'build', also: ['build.html', 'build-striker.html'] },
  { href: 'gear.html',     label: 'База данных', icon: 'data'  },
];

function shdHeader() {
  const mount = document.getElementById('shd-nav');
  if (!mount) return;
  const current = location.pathname.split('/').pop() || 'index.html';
  const idx = SHD_NAV.findIndex(l => l.href === current || l.also?.includes(current));
  const tabs = SHD_NAV.map((l, i) => `
    <a class="tab" data-tab="${i}" href="${l.href}"${i === idx ? ' aria-current="page"' : ''}>
      <svg viewBox="0 0 24 24" aria-hidden="true">${SHD_ICONS[l.icon]}</svg><span>${l.label}</span>
    </a>`).join('');

  mount.outerHTML = `
  <header class="relative z-40">
    <div class="mx-auto max-w-7xl px-4 sm:px-8 pt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <a href="index.html" class="flex items-center gap-2" aria-label="SHD Builds — на главную">
        <span class="grid place-items-center w-8 h-8 bg-shd-orange text-black text-[11px] font-bold">SHD</span>
        <span class="text-lg font-medium">SHD Builds</span>
      </a>
      <div class="tab-group max-w-full">
        <button type="button" class="nav-key" data-nav-step="-1" aria-label="Предыдущая вкладка (A)" title="Предыдущая вкладка — A">A</button>
        <nav class="tabbar overflow-x-auto no-scrollbar" aria-label="Основная навигация">${tabs}</nav>
        <button type="button" class="nav-key" data-nav-step="1" aria-label="Следующая вкладка (E)" title="Следующая вкладка — E">E</button>
      </div>
    </div>
  </header>`;

  const open = i => {
    if (i === idx && current === SHD_NAV[i].href) return;   // уже на этой вкладке
    SHD_LOADER.go(SHD_NAV[i].href, SHD_NAV[i].label);
  };
  // A — предыдущая вкладка, E — следующая (по кругу)
  const go = step => {
    const base = idx === -1 ? (step > 0 ? -1 : 0) : idx;
    document.querySelector(`[data-nav-step="${step}"]`)?.classList.add('is-hot');
    open((base + step + SHD_NAV.length) % SHD_NAV.length);
  };
  document.querySelectorAll('[data-nav-step]').forEach(b => b.addEventListener('click', () => go(+b.dataset.navStep)));
  document.querySelectorAll('.tab[data-tab]').forEach(a => a.addEventListener('click', e => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return; // открытие в новой вкладке браузера — как обычно
    e.preventDefault();
    open(+a.dataset.tab);
  }));

  // Клавиатура: A/E (и Ф/У в русской раскладке); не перехватываем ввод текста и модалки
  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.repeat || SHD_LOADER.busy) return;
    if (e.target.closest?.('input, textarea, select, [contenteditable], [role=dialog]')) return;
    const k = e.key.toLowerCase();
    if (k === 'a' || k === 'ф') go(-1);
    if (k === 'e' || k === 'у') go(1);
  });

  document.querySelector('.tab[aria-current]')?.scrollIntoView({ block: 'nearest', inline: 'center' });
}

document.addEventListener('DOMContentLoaded', () => { shdBackground(); shdHeader(); SHD_LOADER.arrive(); });
