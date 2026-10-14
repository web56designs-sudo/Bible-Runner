'use strict';
const $ = id => document.getElementById(id);
const canvas = $('world'), ctx = canvas.getContext('2d', { alpha: false });
const TAU = Math.PI * 2, PLAYER_Z = 10, FAR = 120;
const landscape = new Image();
const landscapeLayers = [];
landscape.onload = () => prepareLandscape();
landscape.src = 'assets/judean-sunset.webp';
function prepareLandscape() {
  if (!landscape.complete || !landscape.naturalWidth || !W) return;
  landscapeLayers.length = 0;
  for (let i = 0; i < 3; i++) {
    const layer = document.createElement('canvas'); layer.width = Math.round(W * DPR); layer.height = Math.round(H * DPR);
    const painter = layer.getContext('2d'); painter.scale(DPR, DPR);
    const scale = Math.max(W / landscape.naturalWidth, H / landscape.naturalHeight);
    painter.filter = i === 1 ? 'saturate(.5) hue-rotate(175deg) brightness(.75)' : i === 2 ? 'saturate(.7) hue-rotate(25deg) brightness(.9)' : 'saturate(.8) brightness(.88)';
    painter.drawImage(landscape, (W - landscape.naturalWidth * scale) / 2, (H - landscape.naturalHeight * scale) / 2, landscape.naturalWidth * scale, landscape.naturalHeight * scale);
    landscapeLayers.push(layer);
  }
}
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const chapters = [
  { name: 'Jericho trail', subtitle: 'Where courage brings the walls down.', sky: ['#292139', '#a15b49', '#f2b478'], sand: '#7f5241', road: '#b68b60', stone: '#caaa7d', glow: '#ffc66c', fog: '#b78a6a' },
  { name: 'Wilderness of Sinai', subtitle: 'A little faith. An extraordinary path.', sky: ['#172b40', '#536277', '#dab8a0'], sand: '#635766', road: '#a79888', stone: '#bbb5a5', glow: '#b5e4ef', fog: '#929aab' },
  { name: 'Gardens of Jerusalem', subtitle: 'Let everything that has breath praise the Lord.', sky: ['#192e32', '#52665b', '#ddc28e'], sand: '#3c5346', road: '#b4a481', stone: '#c2b88e', glow: '#f3d491', fog: '#93a385' }
];
const questions = [
  ['Who built the ark?', ['Noah', 'Moses', 'Abraham'], 0, 'Genesis 6:14', 'God called Noah to build an ark.'],
  ['Which sea did Moses part?', ['Red Sea', 'Sea of Galilee', 'Dead Sea'], 0, 'Exodus 14:21', 'God made a path through the Red Sea.'],
  ['Who defeated Goliath?', ['Solomon', 'David', 'Joshua'], 1, '1 Samuel 17:49', 'David faced Goliath with a sling and a stone.'],
  ['Where was Jesus born?', ['Jerusalem', 'Nazareth', 'Bethlehem'], 2, 'Matthew 2:1', 'Jesus was born in Bethlehem of Judea.'],
  ['Who was saved from the lions?', ['Daniel', 'Jonah', 'Joseph'], 0, 'Daniel 6:22', 'God sent an angel to shut the lions’ mouths.'],
  ['Who was swallowed by a great fish?', ['Peter', 'Jonah', 'Paul'], 1, 'Jonah 1:17', 'Jonah spent three days and nights inside the fish.'],
  ['How many days did Jesus fast?', ['Seven', 'Twelve', 'Forty'], 2, 'Matthew 4:2', 'Jesus fasted for forty days and forty nights.'],
  ['Who led the march around Jericho?', ['Joshua', 'Samuel', 'Saul'], 0, 'Joshua 6:2–5', 'Joshua followed God’s instructions, and the walls fell.'],
  ['What is the first book of the Bible?', ['Psalms', 'Genesis', 'Exodus'], 1, 'Genesis 1:1', 'Genesis begins with God creating the heavens and earth.'],
  ['Who denied Jesus three times?', ['John', 'Thomas', 'Peter'], 2, 'Luke 22:61', 'Peter denied Jesus three times before the rooster crowed.'],
  ['What did Jesus turn water into?', ['Wine', 'Milk', 'Oil'], 0, 'John 2:9', 'At Cana, Jesus turned water into wine.'],
  ['Who received the Ten Commandments?', ['Elijah', 'Moses', 'Abraham'], 1, 'Exodus 31:18', 'God gave Moses the tablets on Mount Sinai.'],
  ['Which disciple walked on water?', ['James', 'John', 'Peter'], 2, 'Matthew 14:29', 'Peter stepped out of the boat toward Jesus.'],
  ['How many apostles did Jesus choose?', ['Twelve', 'Seven', 'Forty'], 0, 'Luke 6:13', 'Jesus chose twelve disciples to be apostles.'],
  ['What is the shortest verse in the KJV?', ['God is love.', 'Jesus wept.', 'Rejoice evermore.'], 1, 'John 11:35', 'Jesus wept at the tomb of Lazarus.'],
  ['Who interpreted dreams in Egypt?', ['Isaac', 'Aaron', 'Joseph'], 2, 'Genesis 41:15–16', 'Joseph gave God the credit for interpreting Pharaoh’s dreams.'],
  ['Who was the mother of Jesus?', ['Mary', 'Martha', 'Ruth'], 0, 'Luke 1:30–31', 'The angel told Mary she would give birth to Jesus.'],
  ['How many loaves fed the five thousand?', ['Two', 'Five', 'Seven'], 1, 'Matthew 14:17–21', 'Jesus fed the crowd with five loaves and two fish.'],
  ['Which book is a collection of songs?', ['Acts', 'Romans', 'Psalms'], 2, 'Psalm 95:1', 'The Psalms are songs and prayers of praise, lament, and trust.'],
  ['Who was the first king of Israel?', ['Saul', 'David', 'Solomon'], 0, '1 Samuel 10:24', 'Samuel presented Saul as the king God had chosen.'],
  ['Who climbed a tree to see Jesus?', ['Nicodemus', 'Zacchaeus', 'Bartimaeus'], 1, 'Luke 19:4', 'Zacchaeus climbed a sycamore tree to see Jesus.'],
  ['Which city’s walls fell after a shout?', ['Babylon', 'Nineveh', 'Jericho'], 2, 'Joshua 6:20', 'The people shouted, and Jericho’s walls fell.'],
  ['Who said “Here am I; send me”?', ['Isaiah', 'Jeremiah', 'Ezekiel'], 0, 'Isaiah 6:8', 'Isaiah answered God’s call with willingness.'],
  ['Which fruit of the Spirit is listed first?', ['Patience', 'Love', 'Peace'], 1, 'Galatians 5:22', 'The fruit of the Spirit begins with love.']
];
let W = 0, H = 0, DPR = 1, horizon = 0, focal = 0;
let state = 'welcome', beforePause = 'running', lane = 1, smoothLane = 1, distance = 0, coins = 0, points = 0, hearts = 3;
let jump = 0, slide = 0, invincible = 0, shield = 0, magnet = 0, multiplier = 1, streak = 0;
let objects = [], particles = [], sceneryObjects = [], spawnTimer = 0, nextQuiz = 220;
let quizRemaining = 0, quizTotal = 7, currentQuestion = null, correctAnswers = 0, attempted = 0, questionDeck = [];
let chapter = 0, time = 0, lastTime = 0, toastTime = 0, revealTime = 0, shake = 0, sound = false, audio;
let best = 0, lastLearned = null, accumulator = 0, demoDistance = 0;
try { best = Number(localStorage.getItem('bible-runner-score-v2')) || 0; sound = localStorage.getItem('bible-runner-sound') === 'on'; } catch {}
$('best').textContent = best.toLocaleString();
function resize() {
  const rect = canvas.getBoundingClientRect(); W = rect.width; H = rect.height;
  DPR = Math.min(devicePixelRatio || 1, 2); canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); horizon = H * .32; focal = H * 1.05; prepareLandscape();
}
window.addEventListener('resize', resize); resize();
const random = (min, max) => min + Math.random() * (max - min);
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
function shuffle(list) { const result = list.slice(); for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; } return result; }
function show(id, visible = true) { $(id).classList.toggle('hidden', !visible); }
function scenePoint(x, z, y = 0) {
  const scale = focal / (Math.max(z, .8) + 9);
  return { x: W / 2 + x * scale * Math.min(1, W / (H * .72)), y: horizon + (8 - y) * scale, s: scale };
}
function poly(points, color, stroke) {
  ctx.beginPath(); points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.closePath();
  ctx.fillStyle = color; ctx.fill(); if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = .6; ctx.stroke(); }
}
function worldPoly(coords, color, stroke) { poly(coords.map(p => scenePoint(...p)), color, stroke); }
function ellipse(x, y, rx, ry, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill(); }
function line(points, color, width) { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.beginPath(); points.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.stroke(); }
function tone(freq, duration = .13, type = 'sine', volume = .045) {
  if (!sound) return;
  try { audio ||= new (window.AudioContext || window.webkitAudioContext)(); const osc = audio.createOscillator(), gain = audio.createGain(); osc.type = type; osc.frequency.setValueAtTime(freq, audio.currentTime); osc.frequency.exponentialRampToValueAtTime(freq * .6, audio.currentTime + duration); gain.gain.setValueAtTime(volume, audio.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + duration); osc.connect(gain); gain.connect(audio.destination); osc.start(); osc.stop(audio.currentTime + duration); } catch {}
}
function updateSound() { $('sound').innerHTML = '♫' + (sound ? '' : '<span class="slash"></span>'); $('sound').setAttribute('aria-label', sound ? 'Disable sound' : 'Enable sound'); }
updateSound(); $('sound').onclick = () => { sound = !sound; updateSound(); try { localStorage.setItem('bible-runner-sound', sound ? 'on' : 'off'); } catch {} tone(620); };
$('fullscreen').onclick = async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await $('app').requestFullscreen(); } catch { notify('Full screen unavailable', 'Your browser still supports swipe and button controls.'); } };
function buildScenery() {
  sceneryObjects = [];
  for (let i = 0; i < 38; i++) {
    const z = 12 + i * 8;
    sceneryObjects.push({ z, x: (i % 2 ? 1 : -1) * random(7.4, 13), type: i % 5 === 0 ? 'palm' : i % 3 === 0 ? 'torch' : 'column', seed: random(0, 10) });
  }
}
buildScenery();
function updateHUD() {
  const score = Math.floor(points + distance * 3);
  $('score').textContent = score.toLocaleString(); $('distance').textContent = Math.floor(distance) + ' m';
  $('coins').textContent = coins; $('hearts').textContent = '♥ '.repeat(hearts) + '♡ '.repeat(3 - hearts);
  $('hearts').setAttribute('aria-label', hearts + ' hearts remaining'); $('multiplier').textContent = '×' + multiplier;
  $('region-name').textContent = chapters[chapter].name; $('chapter-label').textContent = String(chapter + 1).padStart(2, '0') + ' / ' + chapters[chapter].name.toUpperCase();
  $('chapter-progress').style.width = (distance % 650) / 650 * 100 + '%';
  $('next-gate').textContent = state === 'quiz' ? 'CHOOSE YOUR PATH' : 'WISDOM GATE · ' + Math.max(0, Math.ceil(nextQuiz - distance)) + ' m';
  $('powers').innerHTML = (shield > 0 ? `<span class="power-pill">◇ SHIELD ${Math.ceil(shield)}s</span>` : '') + (magnet > 0 ? `<span class="power-pill">✦ MAGNET ${Math.ceil(magnet)}s</span>` : '');
  show('powers', shield > 0 || magnet > 0);
}
function notify(title, detail, error = false, duration = 3.5) { $('toast-title').textContent = title; $('toast-detail').textContent = detail; $('toast').classList.toggle('error', error); show('toast'); toastTime = duration; }
function start() {
  state = 'running'; lane = smoothLane = 1; distance = coins = points = 0; hearts = 3; objects = []; particles = [];
  jump = slide = invincible = shield = magnet = 0; multiplier = 1; streak = 0; nextQuiz = 220; spawnTimer = .9;
  correctAnswers = attempted = 0; chapter = 0; questionDeck = shuffle(questions); lastLearned = null; toastTime = revealTime = 0;
  ['welcome', 'tutorial', 'pause-screen', 'end', 'wisdom', 'toast', 'region-reveal'].forEach(id => show(id, false));
  ['hud', 'controls', 'desktop-hint', 'pause', 'chapter-strip'].forEach(id => show(id));
  buildScenery(); updateHUD(); tone(500, .25); notify('The road is yours.', 'Gather light. Jump stones. Slide beneath arches. Avoid pillars.', false, 4);
}
$('start').onclick = start; $('restart').onclick = start; $('tutorial-start').onclick = start;
$('practice').onclick = () => show('tutorial');
function pause() {
  if (state === 'running' || state === 'quiz') { beforePause = state; state = 'paused'; show('pause-screen'); $('pause').textContent = '▶'; }
  else if (state === 'paused') resume();
}
function resume() { if (state !== 'paused') return; state = beforePause; show('pause-screen', false); $('pause').textContent = '❚❚'; }
$('pause').onclick = pause; $('resume').onclick = resume; $('quit').onclick = () => finish();
function home() {
  state = 'welcome'; objects = []; particles = []; lane = smoothLane = 1; chapter = 0; jump = slide = 0; shield = magnet = 0;
  ['end', 'hud', 'controls', 'desktop-hint', 'pause', 'chapter-strip', 'wisdom', 'powers', 'toast', 'region-reveal', 'pause-screen'].forEach(id => show(id, false));
  show('welcome'); $('best').textContent = best.toLocaleString(); buildScenery();
}
$('home').onclick = home;
function finish() {
  state = 'ended'; const score = Math.floor(points + distance * 3), newBest = score > best;
  best = Math.max(best, score); try { localStorage.setItem('bible-runner-score-v2', best); } catch {}
  $('end-score').textContent = score.toLocaleString(); $('end-distance').textContent = Math.floor(distance) + ' m'; $('end-coins').textContent = coins;
  $('end-wisdom').textContent = correctAnswers + '/' + attempted; $('end-kicker').textContent = newBest ? '✧ A NEW PERSONAL BEST' : 'THE JOURNEY IS THE REWARD';
  $('end-verse').textContent = lastLearned ? lastLearned[4] + ' — ' + lastLearned[3] : '“Let us run with perseverance the race marked out for us.” — Hebrews 12:1';
  ['wisdom', 'pause-screen', 'controls', 'desktop-hint', 'toast', 'region-reveal'].forEach(id => show(id, false)); show('end'); show('pause', false); tone(180, .5);
}
function action(name) {
  if (name === 'pause') { pause(); return; }
  if (state !== 'running' && state !== 'quiz') return;
  if (name === 'left') lane = Math.max(0, lane - 1);
  if (name === 'right') lane = Math.min(2, lane + 1);
  if (name === 'jump' && jump === 0 && slide === 0) { jump = .88; tone(370, .16); }
  if (name === 'slide' && slide === 0 && jump === 0) { slide = .85; tone(200, .1); }
  if (state === 'quiz') highlightAnswer();
}
function highlightAnswer() { [...$('answers').children].forEach((b, i) => { b.classList.toggle('selected', i === lane); b.setAttribute('aria-pressed', String(i === lane)); }); }
const keys = { ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right', ArrowUp: 'jump', w: 'jump', ArrowDown: 'slide', s: 'slide', ' ': 'pause', Escape: 'pause' };
window.addEventListener('keydown', event => { const name = keys[event.key]; if (!name || event.target.tagName === 'BUTTON' && event.key === ' ') return; if (state === 'running' || state === 'quiz' || state === 'paused') { event.preventDefault(); if (!event.repeat) action(name); } });
document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('pointerdown', e => { e.preventDefault(); action(button.dataset.action); }));
let touch = null;
canvas.addEventListener('pointerdown', event => { touch = { x: event.clientX, y: event.clientY, id: event.pointerId }; canvas.setPointerCapture(event.pointerId); });
canvas.addEventListener('pointerup', event => { if (!touch || touch.id !== event.pointerId) return; const dx = event.clientX - touch.x, dy = event.clientY - touch.y; if (Math.max(Math.abs(dx), Math.abs(dy)) > 22) action(Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'right' : 'left' : dy > 0 ? 'slide' : 'jump'); touch = null; });
canvas.addEventListener('pointercancel', () => touch = null);
document.addEventListener('visibilitychange', () => { if (document.hidden && (state === 'running' || state === 'quiz')) pause(); });
function beginQuiz() {
  state = 'quiz'; objects = []; quizRemaining = quizTotal; jump = slide = 0;
  if (!questionDeck.length) questionDeck = shuffle(questions);
  const source = questionDeck.pop(), choices = shuffle(source[1].map((text, i) => ({ text, right: i === source[2] })));
  currentQuestion = { source, choices }; $('question').textContent = source[0]; $('wisdom-count').textContent = String(attempted + 1).padStart(2, '0');
  $('answers').replaceChildren(); choices.forEach((answer, i) => {
    const button = document.createElement('button'); const label = document.createElement('small'); label.textContent = ['LEFT LANE', 'MIDDLE LANE', 'RIGHT LANE'][i]; button.append(label, document.createTextNode(answer.text));
    button.onclick = () => { if (state === 'quiz') { lane = i; highlightAnswer(); } }; $('answers').append(button);
  }); highlightAnswer(); show('toast', false); toastTime = 0; show('wisdom'); tone(580, .3);
}
function resolveQuiz() {
  attempted++; const answer = currentQuestion.choices[lane], q = currentQuestion.source; lastLearned = q;
  if (answer.right) {
    correctAnswers++; streak++; multiplier = Math.min(5, 1 + streak); points += 200 * multiplier; hearts = Math.min(3, hearts + 1);
    notify('Wisdom lights the way. +' + 200 * multiplier, q[3] + ' · ' + q[4] + ' · Heart restored!', false, 5); burst((lane - 1) * 3.5, PLAYER_Z, 2, 26, '#f9d889'); tone(880, .35);
  } else {
    streak = 0; multiplier = 1; notify('A lesson for the road.', 'Answer: ' + q[1][q[2]] + '. ' + q[3] + ' · ' + q[4], true, 5); tone(230, .3);
  }
  state = 'running'; nextQuiz = distance + 260; spawnTimer = 1.1; invincible = Math.max(invincible, 1.5); show('wisdom', false); updateHUD();
}
function burst(x, z, y, count, color) {
  for (let i = 0; i < count; i++) particles.push({ x, z, y, vx: random(-3, 3), vz: random(-4, 4), vy: random(1, 5), life: random(.35, .9), color });
}
function hit(object) {
  if (invincible > 0) return;
  if (shield > 0) { shield = 0; invincible = 1.3; burst((lane - 1) * 3.5, PLAYER_Z, 2, 20, '#a6e5f5'); notify('Shield of faith', 'Your shield absorbed the impact.', false, 2); tone(390, .2); return; }
  hearts--; invincible = 1.6; shake = reducedMotion ? 0 : .35; streak = 0; multiplier = 1; burst((lane - 1) * 3.5, PLAYER_Z, 1, 16, '#db9b76'); tone(130, .22, 'triangle');
  if (navigator.vibrate) navigator.vibrate(70);
  if (hearts <= 0) { finish(); return; }
  notify('Keep your courage.', object.type === 'arch' ? 'Slide ↓ beneath the stone arches.' : object.type === 'pillar' ? 'Switch lanes ↔ to avoid tall pillars.' : 'Jump ↑ over fallen stones.', true, 2.4);
}
function spawnRow() {
  const chosenLane = Math.floor(Math.random() * 3), difficulty = Math.min(distance / 2200, 1), r = Math.random();
  if (r < .24) {
    for (let i = 0; i < 5; i++) objects.push({ type: 'coin', lane: chosenLane, z: FAR + i * 7, hit: false });
  } else if (r < .32 && distance > 70) {
    objects.push({ type: Math.random() < .5 ? 'shield' : 'magnet', lane: chosenLane, z: FAR, hit: false });
  } else {
    const type = Math.random() < .42 ? 'rock' : Math.random() < .55 ? 'arch' : 'pillar';
    objects.push({ type, lane: chosenLane, z: FAR, hit: false });
    const safeLane = (chosenLane + 1 + Math.floor(Math.random() * 2)) % 3;
    for (let i = 0; i < 3; i++) objects.push({ type: 'coin', lane: safeLane, z: FAR + i * 7, hit: false });
    if (difficulty > .3 && Math.random() < difficulty * .45) objects.push({ type: 'rock', lane: (safeLane + 1) % 3, z: FAR + 30, hit: false });
  }
}
function update(dt) {
  time += dt;
  const active = state === 'running' || state === 'quiz';
  if (!active) { if (state === 'welcome') { demoDistance += dt * 5; moveScenery(dt * 5); } return; }
  if (toastTime > 0) { toastTime -= dt; if (toastTime <= 0) show('toast', false); }
  if (revealTime > 0) { revealTime -= dt; if (revealTime <= 0) show('region-reveal', false); }
  smoothLane += (lane - smoothLane) * (1 - Math.exp(-dt * 14));
  jump = Math.max(0, jump - dt); slide = Math.max(0, slide - dt); invincible = Math.max(0, invincible - dt);
  shield = Math.max(0, shield - dt); magnet = Math.max(0, magnet - dt); shake = Math.max(0, shake - dt);
  const speed = state === 'quiz' ? 15 : 31 + Math.min(distance / 100, 21); distance += dt * speed; moveScenery(dt * speed);
  const nextChapter = Math.floor(distance / 650) % 3;
  if (nextChapter !== chapter) { chapter = nextChapter; $('reveal-title').textContent = chapters[chapter].name; $('reveal-subtitle').textContent = chapters[chapter].subtitle; show('region-reveal'); revealTime = 3.5; tone(660, .4); }
  particles.forEach(p => { p.x += p.vx * dt; p.z += p.vz * dt; p.y += p.vy * dt; p.vy -= dt * 10; p.life -= dt; }); particles = particles.filter(p => p.life > 0);
  if (state === 'quiz') { quizRemaining -= dt; $('wisdom-time').style.width = Math.max(0, quizRemaining / quizTotal) * 100 + '%'; if (quizRemaining <= 0) resolveQuiz(); }
  else {
    spawnTimer -= dt; if (spawnTimer <= 0) { spawnRow(); spawnTimer = Math.max(1.35, 2.3 - distance / 4500); }
    for (const object of objects) {
      object.z -= speed * dt;
      if (object.hit) continue;
      const aligned = Math.abs(smoothLane - object.lane) < .43;
      if (object.type === 'coin' && magnet > 0 && object.z < 50 && object.z > PLAYER_Z) { object.hit = true; collect(object); }
      else if (object.z <= PLAYER_Z && object.z > PLAYER_Z - speed * dt - .5) {
        object.hit = true;
        if (!aligned) continue;
        if (object.type === 'coin') collect(object);
        else if (object.type === 'shield') { shield = 12; burst((lane - 1) * 3.5, PLAYER_Z, 2, 18, '#96e2f5'); notify('Shield of faith', 'One impact protected · 12 seconds', false, 2.5); tone(690, .3); }
        else if (object.type === 'magnet') { magnet = 12; burst((lane - 1) * 3.5, PLAYER_Z, 2, 18, '#f4d28f'); notify('Gathering light', 'Light from every lane comes to you · 12 seconds', false, 2.5); tone(750, .3); }
        else { const height = jump > 0 ? Math.sin(jump / .88 * Math.PI) * 3 : 0; if (object.type === 'pillar' || object.type === 'rock' && height < 1.25 || object.type === 'arch' && slide <= 0) hit(object); }
      }
    }
    objects = objects.filter(o => o.z > -8 && !(o.hit && ['coin', 'shield', 'magnet'].includes(o.type)));
    if (state === 'running' && distance >= nextQuiz) beginQuiz();
  }
  accumulator += dt; if (accumulator > .08) { updateHUD(); accumulator = 0; }
}
function collect(object) { coins++; points += 10 * multiplier; burst((object.lane - 1) * 3.5, object.z, 1.3, 5, '#ffdc88'); tone(900 + coins % 5 * 80, .08, 'sine', .025); }
function moveScenery(amount) { sceneryObjects.forEach(o => { o.z -= amount; if (o.z < -12) o.z += 304; }); }
function box(x, z, width, depth, height, color, top, side) {
  const a = x - width / 2, b = x + width / 2;
  worldPoly([[a,z,0],[b,z,0],[b,z,height],[a,z,height]], color);
  worldPoly([[b,z,0],[b,z+depth,0],[b,z+depth,height],[b,z,height]], side || '#6e574a');
  worldPoly([[a,z,height],[b,z,height],[b,z+depth,height],[a,z+depth,height]], top || '#e0c19a');
}
function drawSky(palette) {
  if (landscapeLayers[chapter]) {
    ctx.drawImage(landscapeLayers[chapter], 0, 0, W, H);
    const shade = ctx.createLinearGradient(0, 0, 0, H); shade.addColorStop(0, "#17152335"); shade.addColorStop(.4, "#251b2210"); shade.addColorStop(1, "#251b2250"); ctx.fillStyle = shade; ctx.fillRect(0, 0, W, H);
    return;
  }
  const gradient = ctx.createLinearGradient(0, 0, 0, H * .62);
  gradient.addColorStop(0, palette.sky[0]); gradient.addColorStop(.52, palette.sky[1]); gradient.addColorStop(1, palette.sky[2]);
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, W, H);
  const sunX = W * .73, sunY = H * .22, radius = Math.min(W, H) * .07;
  const sun = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, radius * 4.5);
  sun.addColorStop(0, '#ffe0a4b0'); sun.addColorStop(.23, '#ffc58b45'); sun.addColorStop(1, '#ffc58b00'); ctx.fillStyle = sun; ctx.fillRect(sunX - radius * 5, sunY - radius * 5, radius * 10, radius * 10);
  ellipse(sunX, sunY, radius * .43, radius * .43, chapter === 1 ? '#ece4cd' : '#f4ca91');
  if (chapter === 1) { for (let i = 0; i < 38; i++) { const x = ((i * 127.7) % W), y = ((i * 73.9) % (horizon * .6)); ctx.globalAlpha = .25 + Math.sin(time + i) * .12; ellipse(x, y, .7, .7, '#fff0d4'); } ctx.globalAlpha = 1; }
  // Layered silhouettes create a sense of distance without external assets.
  for (let layer = 0; layer < 3; layer++) {
    const base = horizon + 12 + layer * 18, pts = [{ x: 0, y: H }];
    for (let i = 0; i <= 24; i++) { const x = i * W / 24; const shape = Math.sin(i * .74 + layer * 2) * 18 + Math.cos(i * 1.7 + layer) * 12; pts.push({ x, y: base + shape - Math.sin(i * .43) * (layer === 0 ? 30 : 8) }); }
    pts.push({ x: W, y: H }); poly(pts, [chapter === 2 ? '#607560' : '#886965', chapter === 2 ? '#52644f' : '#735657', palette.sand][layer]);
  }
  // A distant city, with battlements, arches, and a temple dome.
  ctx.save(); ctx.translate(W * .57, horizon - 26); const cityScale = Math.min(W / 650, 1.5); ctx.scale(cityScale, cityScale); ctx.fillStyle = chapter === 1 ? '#514956' : '#6b4e44';
  for (let i = 0; i < 13; i++) { const height = 22 + Math.sin(i * 4.3) * 14; ctx.fillRect(i * 13, -height, 12, height + 32); for (let j = 0; j < 3; j++) ctx.fillRect(i * 13 + j * 4, -height - 3, 2.5, 4); }
  ctx.fillRect(58, -52, 36, 73); ctx.beginPath(); ctx.arc(76, -52, 18, Math.PI, TAU); ctx.fill(); ctx.fillRect(107, -72, 8, 95); ctx.fillRect(104, -73, 14, 5); ctx.fillStyle = '#c38e6566'; ctx.fillRect(69, -31, 5, 14); ctx.fillRect(79, -31, 5, 14); ctx.restore();
  // Birds drift above the skyline.
  ctx.strokeStyle = '#382d3866'; ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) { const x = ((time * 6 + i * 59) % (W + 100)) - 30, y = horizon * .48 + Math.sin(i * 2) * 25; const wing = Math.sin(time * 3 + i) * 3; ctx.beginPath(); ctx.moveTo(x - 5, y - wing); ctx.quadraticCurveTo(x - 2, y - 2, x, y); ctx.quadraticCurveTo(x + 2, y - 2, x + 5, y - wing); ctx.stroke(); }
}
function drawRoad(palette) {
  const offset = (state === 'welcome' ? demoDistance : distance) % 9;
  worldPoly([[-5.7,0,0],[5.7,0,0],[5.7,380,0],[-5.7,380,0]], palette.road);
  // Every tile is projected individually, creating true perspective motion.
  for (let i = 35; i >= 0; i--) {
    const z = i * 9 - offset, next = z + 9;
    if (next <= 0) continue;
    for (let l = 0; l < 3; l++) {
      const x = (l - 1) * 3.5, tint = (i + l) % 2 ? '#ffffff0a' : '#3523140b';
      worldPoly([[x-1.74,Math.max(0,z),.015],[x+1.74,Math.max(0,z),.015],[x+1.74,next,.015],[x-1.74,next,.015]], tint, '#ecd0a329');
      if ((i * 7 + l) % 13 === 0) { const a = scenePoint(x -.6, next -.8,.02), b = scenePoint(x-.2, next - 3,.02), c = scenePoint(x+.4,next-4,.02); line([[a.x,a.y],[b.x,b.y],[c.x,c.y]], '#5f412c25', Math.max(.5, a.s * .02)); }
    }
    for (const side of [-1, 1]) {
      const x = side * 5.65; box(x, Math.max(.1,z), .42, 8.8, .25, '#9b7659', palette.stone, '#705442');
    }
  }
  for (const l of [-1.75,1.75]) { const a = scenePoint(l,0,.015), b = scenePoint(l,340,.015); line([[a.x,a.y],[b.x,b.y]], '#fff1c52b', 1); }
  if (state === 'quiz') {
    const selectedX = (lane - 1) * 3.5;
    worldPoly([[selectedX - 1.7,0,.03],[selectedX + 1.7,0,.03],[selectedX + 1.7,180,.03],[selectedX - 1.7,180,.03]], '#efc75e30');
    for (let l = 0; l < 3; l++) { const x = (l-1)*3.5, z = PLAYER_Z + quizRemaining * 18; box(x - 1.6,z,.18,1,5,'#b68a50','#f8d58c'); box(x + 1.6,z,.18,1,5,'#b68a50','#f8d58c'); box(x,z,3.4,.7, .2, '#c79a55', '#ffe2a3');
      const p = scenePoint(x,z,4.8); ctx.save(); ctx.shadowBlur = 16; ctx.shadowColor = '#ffcd67'; ctx.fillStyle = l === lane ? '#ffe2a3' : '#bca075'; ctx.font = `${Math.max(10,p.s*.9)}px Georgia`; ctx.textAlign='center'; ctx.fillText(['I','II','III'][l],p.x,p.y); ctx.restore(); }
  }
}
function drawColumn(o, palette) {
  const p = scenePoint(o.x,o.z), s = p.s;
  if (p.y < horizon || s > 130) return;
  ctx.save(); ctx.translate(p.x,p.y); ctx.scale(s,s);
  ellipse(.4,.05,.9,.25,'#241c2433');
  const gradient = ctx.createLinearGradient(-.55,0,.55,0); gradient.addColorStop(0,'#79634e'); gradient.addColorStop(.35,palette.stone); gradient.addColorStop(.7,'#b9a17c'); gradient.addColorStop(1,'#725b47');
  ctx.fillStyle=gradient;ctx.fillRect(-.45,-6.6,.9,6.6);ctx.fillStyle='#56463835';for(let j=0;j<4;j++)ctx.fillRect(-.34+j*.21,-6.4,.035,6.2);
  ctx.fillStyle=palette.stone;ctx.fillRect(-.72,-6.75,1.44,.3);ctx.fillRect(-.62,-6.4,1.24,.18);ctx.fillRect(-.68,-.23,1.36,.28);
  ctx.fillStyle='#d4be94';ctx.fillRect(-.81,-6.85,1.62,.13);ctx.fillRect(-.77,-.08,1.54,.15);
  if (o.seed > 6) { ctx.fillStyle='#3c51366b'; ctx.beginPath();ctx.moveTo(-.2,-6.6);ctx.bezierCurveTo(.2,-5,.7,-3,.1,-1);ctx.lineTo(.3,-1);ctx.bezierCurveTo(.8,-4,.4,-5.5,0,-6.6);ctx.fill(); }
  ctx.restore();
}
function drawTorch(o, palette) {
  const p = scenePoint(o.x,o.z),s=p.s; if(s>140)return;
  const flame = scenePoint(o.x,o.z,3.3), r=s*.8;
  const glow=ctx.createRadialGradient(flame.x,flame.y,0,flame.x,flame.y,r*2);glow.addColorStop(0,'#ffc76660');glow.addColorStop(1,'#ffc76600');ctx.fillStyle=glow;ctx.fillRect(flame.x-r*2,flame.y-r*2,r*4,r*4);
  ctx.save();ctx.translate(p.x,p.y);ctx.scale(s,s);ctx.fillStyle='#4d3930';ctx.fillRect(-.12,-3.3,.24,3.3);poly([{x:-.35,y:-3.3},{x:.35,y:-3.3},{x:.19,y:-2.9},{x:-.19,y:-2.9}],'#8e623e');
  const flicker=Math.sin(time*12+o.seed)*.12;poly([{x:-.18,y:-3.25},{x:-.3,y:-3.6},{x:-.09,y:-4.2-flicker},{x:.04,y:-3.8},{x:.22,y:-4.01},{x:.29,y:-3.48},{x:.12,y:-3.25}],'#f9aa3b');poly([{x:-.1,y:-3.25},{x:-.13,y:-3.65},{x:0,y:-3.91},{x:.13,y:-3.5},{x:.09,y:-3.25}],'#ffe8a6');ctx.restore();
}
function drawPalm(o) {
  const p=scenePoint(o.x,o.z),s=p.s;if(s>140)return;ctx.save();ctx.translate(p.x,p.y);ctx.scale(s,s);
  line([[0,0],[.4,-3],[.18,-6.5]],'#61452e',.35);line([[.12,0],[.49,-3],[.28,-6.5]],'#a88050',.12);
  for(let i=0;i<7;i++){const angle=i*.8+.3,endX=Math.cos(angle)*2.8,endY=-6.2+Math.sin(angle)*1.6;ctx.strokeStyle=chapter===2?'#58723c':'#606542';ctx.lineWidth=.19;ctx.beginPath();ctx.moveTo(.2,-6.5);ctx.quadraticCurveTo(endX*.6,-7.8,endX,endY);ctx.stroke();for(let j=1;j<6;j++){let t=j/6;line([[.2+(endX-.2)*t,-6.5+(endY+6.5)*t-.8*Math.sin(t*Math.PI)],[.2+(endX-.2)*t+.35,-6.5+(endY+6.5)*t+.12]],'#58603c',.09)}}ctx.restore();
}
function drawObstacle(object, palette) {
  const x=(object.lane-1)*3.5,z=object.z,p=scenePoint(x,z);if(z<0)return;
  if(object.type==='coin'||object.type==='shield'||object.type==='magnet') {
    const bob=Math.sin(time*3+z*.07)*.18,q=scenePoint(x,z,1.6+bob),s=q.s;
    ctx.save();ctx.translate(q.x,q.y);const glow=ctx.createRadialGradient(0,0,0,0,0,s*1.3);glow.addColorStop(0,object.type==='shield'?'#8fdbff60':'#ffd46665');glow.addColorStop(1,'#ffd46600');ctx.fillStyle=glow;ctx.fillRect(-s*1.3,-s*1.3,s*2.6,s*2.6);
    ctx.scale(s,s);if(object.type==='coin'){const turn=.35+Math.abs(Math.sin(time*2+z*.05))*.65;ctx.scale(turn,1);ellipse(0,0,.43,.43,'#e1aa45');ellipse(-.03,-.025,.34,.34,'#f9d87e');ctx.strokeStyle='#b48034';ctx.lineWidth=.025;ctx.beginPath();ctx.arc(0,0,.29,0,TAU);ctx.stroke();poly([{x:0,y:-.21},{x:.055,y:-.055},{x:.2,y:0},{x:.055,y:.055},{x:0,y:.21},{x:-.055,y:.055},{x:-.2,y:0},{x:-.055,y:-.055}],'#b78232')}
    else if(object.type==='shield'){poly([{x:-.55,y:-.5},{x:0,y:-.7},{x:.55,y:-.5},{x:.45,y:.27},{x:0,y:.7},{x:-.45,y:.27}],'#85c7d6','#e1f8ff');line([[0,-.37],[0,.3]],'#e7faff',.08);line([[-.21,-.04],[.21,-.04]],'#e7faff',.08)}
    else{ctx.strokeStyle='#f5cf8a';ctx.lineWidth=.2;ctx.beginPath();ctx.arc(0,0,.45,0,Math.PI);ctx.stroke();ctx.fillStyle='#edb166';ctx.fillRect(-.55,-.42,.2,.48);ctx.fillRect(.35,-.42,.2,.48);ctx.fillStyle='#fff1ce';ctx.fillRect(-.55,-.42,.2,.14);ctx.fillRect(.35,-.42,.2,.14)}ctx.restore();return;
  }
  ellipse(p.x,p.y+1,p.s*1.25,p.s*.2,'#35251f33');
  if(object.type==='rock'){
    box(x,z,2.45,1.4,1.3,'#9b8166',palette.stone,'#78604c');
    const a=scenePoint(x-.7,z,1.31),b=scenePoint(x-.2,z+.6,1.31),c=scenePoint(x+.1,z+.8,1.31);line([[a.x,a.y],[b.x,b.y],[c.x,c.y]],'#5b483d80',p.s*.035);
    box(x-.6,z+.3,.4,.6,1.42,'#b39c7a','#dac49b','#907958');
  }else if(object.type==='pillar'){
    box(x,z,1.4,1.1,4.1,'#ac9070',palette.stone,'#77604e');box(x,z-.1,1.75,1.3,.3,'#90714f','#c5a377');
    box(x,z,1.8,1.4,4.25,'#ac9070','#d7bd91','#7c634b');
    const q=scenePoint(x,z-.01,2.4);ctx.save();ctx.fillStyle='#5d463b';ctx.font=`${q.s*.75}px Georgia`;ctx.textAlign='center';ctx.fillText('✦',q.x,q.y);ctx.restore();
  }else if(object.type==='arch'){
    box(x-1.45,z,.38,.7,4.3,'#9f7a53',palette.stone);box(x+1.45,z,.38,.7,4.3,'#9f7a53',palette.stone);
    worldPoly([[x-1.65,z,2.1],[x+1.65,z,2.1],[x+1.65,z,4.4],[x-1.65,z,4.4]],'#a18461');
    worldPoly([[x-1.65,z,4.4],[x+1.65,z,4.4],[x+1.65,z+.9,4.4],[x-1.65,z+.9,4.4]],'#d9bc8b');
    for(let i=0;i<5;i++){const a=scenePoint(x-1.65+i*.66,z,2.15),b=scenePoint(x-1.65+i*.66,z,4.35);line([[a.x,a.y],[b.x,b.y]],'#68553f',Math.max(.6,p.s*.025))}
    const a=scenePoint(x-1.2,z-.01,2.9),b=scenePoint(x+1.2,z-.01,2.9);line([[a.x,a.y],[b.x,b.y]],'#f6ce78',p.s*.035);
  }
}
function drawRunner() {
  const displayLane=state==='welcome'?1:smoothLane;
  const pos=scenePoint((displayLane-1)*3.5,PLAYER_Z),scale=Math.min(pos.s/22,1.8),running=state==='running'||state==='quiz'||state==='welcome';
  const phase=running?time*12:0,step=Math.sin(phase),lift=jump>0?Math.sin(jump/.88*Math.PI)*3:0;
  const ground=pos.y, y=ground-lift*pos.s;
  ellipse(pos.x+4,ground+3,23*scale*(1-lift*.12),8*scale,'#231c2455');
  if(shield>0){ctx.save();ctx.strokeStyle='#afe9f4';ctx.globalAlpha=.5+Math.sin(time*4)*.12;ctx.lineWidth=2;ctx.shadowBlur=20;ctx.shadowColor='#90daff';ctx.beginPath();ctx.ellipse(pos.x,y-58*scale,42*scale,72*scale,0,0,TAU);ctx.stroke();ctx.restore()}
  if(invincible>0 && Math.floor(time*12)%2===0)ctx.globalAlpha=.45;
  ctx.save();ctx.translate(pos.x,y);ctx.scale(scale,scale);if(slide>0){ctx.rotate(-.17);ctx.translate(0,2);ctx.scale(1.1,.52)}
  const bob=jump>0?0:Math.abs(Math.cos(phase))*2.5;ctx.translate(0,-bob);
  // Articulated legs, sandals, and winding straps.
  for(const side of [-1,1]){
    const swing=step*side,hipX=side*8,kneeX=side*11+swing*6,kneeY=-22+Math.max(0,swing)*5,footX=side*13+swing*9,footY=-3-Math.max(0,-swing)*15;
    line([[hipX,-48],[kneeX,kneeY],[footX,footY]],side===-1?'#a87650':'#c19161',9);
    line([[hipX+1,-47],[kneeX+1,kneeY]],'#d5ad7f',3);
    line([[kneeX-4,kneeY+5],[kneeX+4,kneeY+8]],'#69472f',2);line([[footX-4,footY-9],[footX+4,footY-6]],'#69472f',2);
    ellipse(footX+2,footY+2,8,3.8,'#4e3529');line([[footX-3,footY],[footX+5,footY]],'#b58b59',2);
  }
  // Linen tunic with moving hem and shaded folds.
  const cloth=ctx.createLinearGradient(-22,-80,25,-45);cloth.addColorStop(0,'#b9a37c');cloth.addColorStop(.4,'#f2e1b8');cloth.addColorStop(.75,'#dcc79d');cloth.addColorStop(1,'#9d8966');
  poly([{x:-17,y:-98},{x:15,y:-98},{x:22,y:-74},{x:19,y:-58},{x:26+step*2,y:-39},{x:14,y:-35+step*2},{x:4,y:-38},{x:-7,y:-34-step*2},{x:-27+step*2,y:-38},{x:-20,y:-62},{x:-21,y:-78}],cloth);
  line([[-9,-79],[-12,-56],[-16,-40]],'#947c5566',1.4);line([[9,-82],[11,-58],[17,-40]],'#fff3d060',2);line([[0,-58],[1,-40]],'#8e795766',1.4);
  // Arms swing opposite to legs.
  for(const side of [-1,1]){const swing=-step*side,shoulder=side*19,elbow=side*25+swing*3,elbowY=-73+swing*10,hand=side*20+swing*7,handY=-59+swing*15;line([[shoulder,-88],[elbow,elbowY],[hand,handY]],side===1?'#be8b59':'#95683f',8);line([[shoulder+1,-88],[elbow+1,elbowY]],'#dbac7c',2);ellipse(hand,handY,4.5,5,'#c08e5f');poly([{x:shoulder-side*5,y:-96},{x:shoulder+side*4,y:-88},{x:shoulder+side*7,y:-79},{x:shoulder-side*4,y:-77}],side===1?'#ead3a7':'#bca57c')}
  // Crimson sash, satchel strap, and fluttering scarf.
  poly([{x:-20,y:-64},{x:20,y:-66},{x:21,y:-59},{x:-20,y:-57}],'#943f34');line([[-17,-62],[17,-63]],'#c36c48',2);
  poly([{x:10,y:-61},{x:19,y:-61},{x:24+Math.sin(time*9)*5,y:-39},{x:15+Math.sin(time*9+1)*5,y:-43},{x:15,y:-54}],'#ba533c');
  line([[13,-96],[-17,-55]],'#61412e',5);line([[13,-96],[-17,-55]],'#b68858',1);
  ellipse(-19,-51,9,12,'#674630');ellipse(-20,-53,7,8,'#98643c');line([[-25,-55],[-14,-55]],'#c19762',1.5);
  // Neck and sculpted dark hair, seen from behind.
  ctx.fillStyle='#ae7c50';ctx.fillRect(-6,-107,12,13);ellipse(0,-112,12,15,'#bc8d60');ellipse(0,-118,13.5,12,'#382c27');
  for(let i=0;i<10;i++)ellipse(Math.sin(i*2.7)*10,-120+Math.cos(i*3.2)*7,4.5,4.3,i%2?'#48352a':'#2e2523');
  ellipse(-12,-110,2.4,4,'#c39869');ellipse(12,-110,2.4,4,'#c39869');ctx.restore();ctx.globalAlpha=1;
  if(magnet>0){ctx.save();ctx.strokeStyle='#f5cf8a50';ctx.lineWidth=1.5;for(let i=0;i<2;i++){ctx.beginPath();ctx.ellipse(pos.x,ground-20*scale,(35+(time*35+i*25)%55)*scale,12*scale,0,0,TAU);ctx.stroke()}ctx.restore()}
}
function drawParticles() {
  for(const p of particles){const point=scenePoint(p.x,p.z,p.y);ctx.globalAlpha=Math.min(1,p.life*2);ellipse(point.x,point.y,Math.max(1,point.s*.07),Math.max(1,point.s*.07),p.color)}ctx.globalAlpha=1;
  // Ambient dust specks, drifting rather than repeating across the path.
  for(let i=0;i<20;i++){const x=((i*143.7+Math.sin(time*.15+i)*25)%(W+30))-15,y=((i*83.9-time*(i%3+1)*4)%(H+50)+H+50)%(H+50);ctx.globalAlpha=.15+Math.sin(time*.7+i)*.1;ellipse(x,y,i%3===0?1.8:.8,i%3===0?1.8:.8,'#f5d098')}ctx.globalAlpha=1;
}
function render() {
  const palette=chapters[chapter];ctx.save();if(shake>0)ctx.translate(Math.sin(time*100)*shake*18,Math.cos(time*83)*shake*10);
  drawSky(palette);drawRoad(palette);
  const drawables=[...sceneryObjects.map(o=>({o,scenery:true})),...objects.map(o=>({o,scenery:false})),{o:{z:PLAYER_Z},runner:true}].sort((a,b)=>b.o.z-a.o.z);
  for(const item of drawables){if(item.runner)drawRunner();else if(item.scenery){if(item.o.type==='column')drawColumn(item.o,palette);else if(item.o.type==='torch')drawTorch(item.o,palette);else drawPalm(item.o)}else drawObstacle(item.o,palette)}
  drawParticles();const haze=ctx.createLinearGradient(0,horizon-10,0,horizon+80);haze.addColorStop(0,palette.fog+'00');haze.addColorStop(.3,palette.fog+'40');haze.addColorStop(1,palette.fog+'00');ctx.fillStyle=haze;ctx.fillRect(0,horizon-10,W,100);
  ctx.restore();
}
function frame(now) {const dt=lastTime?Math.min((now-lastTime)/1000,.05):0;lastTime=now;update(dt);render();requestAnimationFrame(frame)}
requestAnimationFrame(frame);
