/* =====================================================================
   SHD Builds — общая дизайн-система (ISAC / SHD UI)
   Подключать сразу ПОСЛЕ https://cdn.tailwindcss.com
   ===================================================================== */

/* ---------- 1. Tailwind: токены ---------- */
tailwind.config = {
  theme: { extend: {
    colors: { shd: {
      bg:'#0d0f12', panel:'rgba(22,25,30,0.78)', solid:'#16191e', line:'rgba(226,232,240,0.08)',
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
  html { scroll-behavior: smooth; }
  body {
    @apply bg-shd-bg text-shd-text font-hud antialiased min-h-screen;
    background-image:
      linear-gradient(theme('colors.shd.line') 1px, transparent 1px),
      linear-gradient(90deg, theme('colors.shd.line') 1px, transparent 1px),
      radial-gradient(ellipse at top, rgba(255,106,0,.07), transparent 60%);
    background-size: 40px 40px, 40px 40px, 100% 100%;
  }
  ::selection { @apply bg-shd-orange text-black; }
}

@layer components {
  /* Оверлей: линии сканирования */
  .scanlines::before { content:''; @apply pointer-events-none fixed inset-0 z-[60];
    background: repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 1px, transparent 1px 3px); }
  .scanlines::after { content:''; @apply pointer-events-none fixed left-0 right-0 top-0 h-24 z-[60] animate-scan;
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
  .panel { @apply relative bg-shd-panel border border-white/5 backdrop-blur-md p-4 sm:p-6; }
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
    @apply relative flex flex-col gap-3 p-4 text-left w-full bg-shd-panel backdrop-blur-md
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
    @apply relative flex flex-col bg-shd-panel backdrop-blur-md border border-white/10 transition duration-200;
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

  /* Навигация */
  .nav-link { @apply relative px-3 py-2 font-hud font-semibold uppercase tracking-[0.16em] text-sm text-shd-muted transition hover:text-shd-text; }
  .nav-link[aria-current="page"] { @apply text-shd-orange; text-shadow: 0 0 8px rgba(255,106,0,.6); }
  .nav-link[aria-current="page"]::after { content:''; @apply absolute left-3 right-3 -bottom-px h-0.5 bg-shd-orange; box-shadow:0 0 8px #ff6a00; }
}
`;
(() => {
  const s = document.createElement('style');
  s.type = 'text/tailwindcss';
  s.textContent = SHD_CSS;
  document.head.appendChild(s);
})();

/* ---------- 3. Общая навигация ---------- */
const SHD_NAV = [
  { href: 'index.html',          label: 'Главная' },
  { href: 'build-striker.html',  label: 'Билды' },
  { href: 'gear.html',           label: 'База снаряжения' },
  { href: 'ui-kit.html',         label: 'UI Kit' },
];

document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('shd-nav');
  if (!mount) return;
  const current = location.pathname.split('/').pop() || 'index.html';
  const links = SHD_NAV.map(l =>
    `<a class="nav-link" href="${l.href}"${l.href === current ? ' aria-current="page"' : ''}>${l.label}</a>`).join('');

  mount.outerHTML = `
  <header class="sticky top-0 z-40 border-b border-white/5 bg-shd-bg/85 backdrop-blur-md">
    <div class="mx-auto max-w-7xl px-4 sm:px-8 h-14 flex items-center justify-between gap-4">
      <a href="index.html" class="flex items-center gap-2.5 shrink-0" aria-label="SHD Builds — на главную">
        <span class="grid place-items-center w-8 h-8 bg-shd-orange text-black font-mono text-xs font-bold"
              style="clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%);filter:drop-shadow(0 0 6px #ff6a00)">SHD</span>
        <span class="font-hud font-bold uppercase tracking-[0.2em] text-sm sm:text-base">SHD<span class="text-shd-orange">//</span>Builds</span>
      </a>
      <nav class="hidden md:flex items-center" aria-label="Основная навигация">${links}</nav>
      <button type="button" class="md:hidden btn-ghost !px-3 !py-1.5" aria-label="Меню" aria-expanded="false" data-nav-toggle>≡</button>
    </div>
    <nav class="md:hidden hidden flex-col border-t border-white/5 px-2 pb-2" data-nav-menu aria-label="Мобильная навигация">${links}</nav>
  </header>`;

  const btn = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-menu]');
  btn?.addEventListener('click', () => {
    const open = menu.classList.toggle('hidden') === false;
    menu.classList.toggle('flex', open);
    btn.setAttribute('aria-expanded', open);
  });
});
