(function () {

  /* ── Per-egg 4-hour cooldown ──
     Each egg type tracks its own last-seen timestamp in localStorage.
     Only eggs whose cooldown has expired are eligible this visit.
  ── */
  var COOLDOWN_MS = 4 * 60 * 60 * 1000;
  var now = Date.now();

  function cooledDown(key) {
    return now - parseInt(localStorage.getItem(key) || '0', 10) >= COOLDOWN_MS;
  }

  var eligible = [];
  if (cooledDown('ss-egg-pizza'))   eligible.push({ id: 'pizza',   emoji: '🍕', weight: 40 });
  if (cooledDown('ss-egg-ferrari')) eligible.push({ id: 'ferrari', emoji: '🏎️', weight: 30 });
  if (cooledDown('ss-egg-rocket'))  eligible.push({ id: 'rocket',  emoji: '🚀', weight: 15 });

  if (!eligible.length) return; /* all on cooldown */

  /* ── Weighted roll across eligible eggs only, plus a "nothing" chance ── */
  var totalWeight = eligible.reduce(function(s, e) { return s + e.weight; }, 0);
  /* Add ~15% nothing chance proportionally */
  var nothing = totalWeight * 0.18;
  var roll = Math.random() * (totalWeight + nothing);

  if (roll >= totalWeight) return; /* nothing this time */

  var id, emoji, cursor = 0;
  for (var i = 0; i < eligible.length; i++) {
    cursor += eligible[i].weight;
    if (roll < cursor) { id = eligible[i].id; emoji = eligible[i].emoji; break; }
  }

  /* ── Helpers ── */
  function rand(min, max) { return Math.random() * (max - min) + min; }
  function pick(arr)      { return arr[Math.floor(Math.random() * arr.length)]; }

  /* ── Inject CSS ── */
  var css = document.createElement('style');
  css.textContent = [
    '.egg{position:fixed;font-size:2.2rem;cursor:pointer;user-select:none;line-height:1;pointer-events:auto;}',
    '.egg-pizza{font-size:1.4rem;}',

    /* Pizza — gentle wobble */
    '@keyframes egg-wobble{0%,100%{transform:rotate(-5deg) scale(1);}50%{transform:rotate(5deg) scale(1.04);}}',
    '.egg-pizza{animation:egg-wobble 2.2s ease-in-out infinite;}',
    '.egg-pizza:hover{animation:none;transform:scale(1.25);}',

    /* Ferrari — drives R→L across screen */
    '@keyframes egg-drive{from{transform:translateX(calc(100vw + 120px));}to{transform:translateX(-140px);}}',
    '.egg-ferrari{animation:egg-drive 5s linear forwards;pointer-events:auto;}',

    /* Rocket — shoots upward */
    '@keyframes egg-rocket{0%{transform:translateY(0) rotate(-45deg);opacity:1;}100%{transform:translateY(-110vh) rotate(-45deg);opacity:0;}}',
    '.egg-rocket{animation:egg-rocket 3s cubic-bezier(0.2,0.8,0.4,1) forwards;}',

    /* Tooltip */
    '.egg-tip{position:fixed;background:rgba(20,12,4,0.88);color:#fff;font-family:Nunito,sans-serif;font-size:0.62rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:4px 9px;border-radius:6px;pointer-events:none;white-space:nowrap;z-index:9998;opacity:0;transition:opacity .15s;transform:translateX(-50%);}',
    '.egg-tip.show{opacity:1;}'
  ].join('');
  document.head.appendChild(css);

  /* ── Shared tooltip ── */
  var tip = document.createElement('div');
  tip.className = 'egg-tip';
  tip.textContent = 'catch me! ✨';
  document.body.appendChild(tip);

  function showTip(x, y) {
    tip.style.left = x + 'px';
    tip.style.top  = (y - 36) + 'px';
    tip.classList.add('show');
  }
  function hideTip() { tip.classList.remove('show'); }

  /* ── Build the egg ── */
  var el = document.createElement('div');
  el.className = 'egg egg-' + id;
  el.textContent = emoji;

  /* Random z-index — sometimes above cards, sometimes sneaky behind */
  el.style.zIndex = pick([3, 8, 60, 180, 210]);

  if (id === 'ferrari') {
    el.style.top  = rand(8, 78) + 'vh';
    el.style.right = '0';
    el.addEventListener('animationend', function () { el.remove(); });

  } else if (id === 'rocket') {
    el.style.left   = rand(5, 88) + 'vw';
    el.style.bottom = rand(2, 12) + 'vh';
    el.addEventListener('animationend', function () { el.remove(); });

  } else {
    el.style.top  = rand(10, 82) + 'vh';
    el.style.left = rand(5, 88)  + 'vw';
  }

  el.addEventListener('mouseenter', function (e) { showTip(e.clientX, e.clientY); });
  el.addEventListener('mousemove',  function (e) { showTip(e.clientX, e.clientY); });
  el.addEventListener('mouseleave', hideTip);

  el.addEventListener('click', function () {
    hideTip();
    window.location.href = 'caught.html?egg=' + id;
  });

  document.body.appendChild(el);

  /* Record this egg's cooldown start */
  localStorage.setItem('ss-egg-' + id, Date.now().toString());

})();
