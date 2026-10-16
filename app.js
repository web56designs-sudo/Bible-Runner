'use strict';
const $ = id => document.getElementById(id);
const canvas = $('world'), ctx = canvas.getContext('2d', { alpha: false });
const TAU = Math.PI * 2, PLAYER_Z = 10, FAR = 120;
const runnerSheet = new Image();
runnerSheet.src = 'assets/runner-cycle.webp';
const groundMaterial = new Image();
groundMaterial.onload = () => prepareLandscape();
groundMaterial.src = 'assets/desert-ground.webp';
const landscape = new Image();
const landscapeLayers = [];
const terrainTextures = [];
landscape.onload = () => prepareLandscape();
landscape.src = 'assets/judean-sunset.webp';
function prepareLandscape() {
  if (!landscape.complete || !landscape.naturalWidth || !W) return;
  landscapeLayers.length = 0; terrainTextures.length = 0;
  for (let i = 0; i < 3; i++) {
    const layer = document.createElement('canvas'); layer.width = Math.round(W * DPR); layer.height = Math.round(H * DPR);
    const painter = layer.getContext('2d'); painter.scale(DPR, DPR);
    const scale = Math.max(W / landscape.naturalWidth, H / landscape.naturalHeight);
    painter.filter = i === 1 ? 'saturate(.5) hue-rotate(175deg) brightness(.75)' : i === 2 ? 'saturate(.7) hue-rotate(25deg) brightness(.9)' : 'saturate(.8) brightness(.88)';
    painter.drawImage(landscape, (W - landscape.naturalWidth * scale) / 2, (H - landscape.naturalHeight * scale) / 2, landscape.naturalWidth * scale, landscape.naturalHeight * scale);
    landscapeLayers.push(layer);
    if (groundMaterial.complete && groundMaterial.naturalWidth) {
      const textures = [];
      for (let variation = 0; variation < 4; variation++) {
        const tile = document.createElement('canvas'); tile.width = tile.height = 256;
        const brush = tile.getContext('2d'); brush.filter = painter.filter;
        brush.translate(variation % 2 ? 256 : 0, variation >= 2 ? 256 : 0);
        brush.scale(variation % 2 ? -1 : 1, variation >= 2 ? -1 : 1);
        brush.drawImage(groundMaterial,0,0,256,256);
        textures.push(tile);
      }
      terrainTextures.push(textures);
    }
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
let terrainProps = [];
let objects = [], particles = [], sceneryObjects = [], spawnTimer = 0, nextQuiz = 220;
let quizRemaining = 0, quizTotal = 7, currentQuestion = null, correctAnswers = 0, attempted = 0, questionDeck = [];
let chapter = 0, time = 0, lastTime = 0, toastTime = 0, revealTime = 0, shake = 0, sound = true, audio;
let best = 0, lastLearned = null, accumulator = 0, demoDistance = 0;
try { best = Number(localStorage.getItem('bible-runner-score-v2')) || 0; sound = localStorage.getItem('bible-runner-sound') !== 'off'; } catch {}
$('best').textContent = best.toLocaleString();
const SANCTUARY = 1950;
let pursuit = .22, runClock = 0, wave = 'gather', previousWave = '', cleanCombo = 0, comboTime = 0, nearMisses = 0;
let skillTime = 0, waveTime = 0, stepClock = 0, quizTick = 0, won = false, finishReason = '';
let missionFlags = [false, false], windIntensity = 0;
function waveFor(clock) { const phase = clock % 38; return phase < 11 ? 'gather' : phase < 15 ? 'warning' : phase < 27 ? 'surge' : 'recovery'; }
function resetExpedition() {
  pursuit = .22; runClock = 0; wave = 'gather'; previousWave = ''; cleanCombo = comboTime = nearMisses = 0;
  skillTime = waveTime = stepClock = quizTick = 0; won = false; finishReason = ''; missionFlags = [false, false]; windIntensity = 0;
  show('skill-banner', false); show('wave-banner', false); show('expedition'); $('wisdom').classList.remove('urgent');
}
function skill(title, detail, duration = 1.7) { $('skill-title').textContent = title; $('skill-detail').textContent = detail; show('skill-banner'); skillTime = duration; }
function cleanEscape(kind, close = false) {
  cleanCombo++; comboTime = 5; pursuit = Math.max(.04, pursuit - (close ? .045 : kind === 'jump' || kind === 'slide' ? .024 : .008));
  const bonus = (close ? 75 : 20) * multiplier; points += bonus;
  if (close) { nearMisses++; skill('Close call! +' + bonus, 'STORM PUSHED BACK · COMBO ' + cleanCombo); tone(1040, .1); }
  else if (kind === 'jump' || kind === 'slide') { skill((kind === 'jump' ? 'Clean leap' : 'Perfect slide') + ' +' + bonus, 'COMBO ' + cleanCombo); tone(760, .12); }
  if (cleanCombo > 0 && cleanCombo % 5 === 0) { const extra = cleanCombo * 20; points += extra; pursuit = Math.max(.04, pursuit - .035); skill(cleanCombo + ' escape combo!', '+' + extra + ' POINTS · KEEP YOUR RHYTHM'); tone(960, .2); }
}
function checkMissions() {
  [coins >= 20, correctAnswers >= 3].forEach((done, index) => {
    if (done && !missionFlags[index]) { missionFlags[index] = true; points += 500; pursuit = Math.max(.04, pursuit - .08); skill(index ? 'Wisdom keeper +500' : 'Bearer of light +500', 'BONUS MISSION COMPLETE', 2.5); tone(1100, .3); }
  });
}
function updateExpedition(dt) {
  if (skillTime > 0) { skillTime -= dt; if (skillTime <= 0) show('skill-banner', false); }
  if (waveTime > 0) { waveTime -= dt; if (waveTime <= 0) show('wave-banner', false); }
  if (state === 'quiz') {
    const urgent = quizRemaining <= 3; $('wisdom').classList.toggle('urgent', urgent);
    const tick = Math.ceil(quizRemaining); if (urgent && tick !== quizTick && tick > 0) { quizTick = tick; tone(420 + tick * 60, .075, 'sine', .025); }
    return; // Reading trivia never lets the storm close in.
  }
  runClock += dt; wave = waveFor(runClock);
  if (wave !== previousWave) {
    previousWave = wave;
    const labels = {
      gather: ['GATHER YOUR COURAGE', 'Follow the light. Find your rhythm.'],
      warning: ['THE TRAIL IS BREAKING', ['Falling masonry ahead. Watch the road.', 'A sand squall is building. Keep your eyes on the path.', 'Broken causeway ahead. Jump gaps or switch lanes.'][chapter]],
      surge: [['THE WALLS ARE FALLING', 'INTO THE SANDSTORM', 'THE BROKEN CAUSEWAY'][chapter], 'Stay sharp. There is always a clear lane.'],
      recovery: ['A MOMENT TO BREATHE', 'Gather light. The sanctuary is getting closer.']
    };
    if (runClock > 1) { $('wave-title').textContent = labels[wave][0]; $('wave-detail').textContent = labels[wave][1]; show('wave-banner'); waveTime = wave === 'warning' ? 3.2 : 2.1; }
  }
  pursuit = Math.min(1, pursuit + dt * (wave === 'surge' ? .006 : wave === 'recovery' ? -.002 : .0025)); pursuit = Math.max(.04, pursuit);
  windIntensity += ((chapter === 1 && wave === 'surge' ? 1 : .1) - windIntensity) * Math.min(1, dt * 2);
  if (comboTime > 0) { comboTime -= dt; if (comboTime <= 0) cleanCombo = 0; }
  if (jump === 0 && slide === 0) {
    stepClock += dt;
    if (stepClock >= .3) { stepClock -= .3; burst((smoothLane - 1) * 3.5, PLAYER_Z + 1, .03, 2, '#d6b07c'); if (sound && audio && audio.state === 'running') noise(audio.currentTime + .005, .04, .016, 500, effectsBus); }
  }
  checkMissions();
  if (pursuit >= 1) { finishReason = 'storm'; finish(); }
}
function updateExpeditionHUD() {
  $('storm-progress').style.width = Math.round(pursuit * 100) + '%';
  $('storm-label').textContent = pursuit > .8 ? 'AT YOUR HEELS' : pursuit > .55 ? 'CLOSING IN' : 'DISTANT';
  $('storm-label').parentElement?.parentElement?.classList.toggle('danger', pursuit > .7);
  $('mission-progress').textContent = Math.min(SANCTUARY, Math.floor(distance)).toLocaleString() + ' / 1,950 m';
  $('mission-bonus').textContent = 'LIGHT ' + Math.min(20, coins) + '/20 · WISDOM ' + Math.min(3, correctAnswers) + '/3';
}

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
// Original procedural score: plucked strings, breathy flute, soft frame drums.
// Everything is generated locally; no music downloads or third-party recordings.
let masterBus, musicBus, effectsBus, reverbBus, musicAnalyser, windBus;
let musicStep = 0, musicNext = 0, musicPlaying = false, lastAudioState = '';
const MUSIC_STEP = 60 / 92 / 2;
const noteHz = midi => 440 * Math.pow(2, (midi - 69) / 12);
function initAudio() {
  if (!sound) return false;
  try {
    if (!audio) {
      audio = new (window.AudioContext || window.webkitAudioContext)();
      masterBus = audio.createGain(); masterBus.gain.value = .65;
      const compressor = audio.createDynamicsCompressor(); compressor.threshold.value = -15; compressor.knee.value = 18; compressor.ratio.value = 3;
      musicAnalyser = audio.createAnalyser(); musicAnalyser.fftSize = 1024;
      masterBus.connect(compressor); compressor.connect(musicAnalyser); musicAnalyser.connect(audio.destination);
      musicBus = audio.createGain(); musicBus.gain.value = .72; musicBus.connect(masterBus);
      effectsBus = audio.createGain(); effectsBus.gain.value = .8; effectsBus.connect(masterBus);
      const room = audio.createConvolver(), impulse = audio.createBuffer(2, Math.floor(audio.sampleRate * 1.5), audio.sampleRate);
      for (let channel = 0; channel < 2; channel++) { const data = impulse.getChannelData(channel); for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3) * .32; }
      room.buffer = impulse; reverbBus = audio.createGain(); reverbBus.gain.value = .2;
      musicBus.connect(room); effectsBus.connect(room); room.connect(reverbBus); reverbBus.connect(masterBus);
      const wind = audio.createBufferSource(); wind.buffer = noiseBuffer(3); wind.loop = true;
      const lowpass = audio.createBiquadFilter(); lowpass.type = 'lowpass'; lowpass.frequency.value = 290;
      windBus = audio.createGain(); windBus.gain.value = .018; wind.connect(lowpass); lowpass.connect(windBus); windBus.connect(musicBus); wind.start();
    }
    if ((audio.state === 'suspended' || audio.state === 'interrupted') && !document.hidden && state !== 'paused') audio.resume().catch(() => {});
    return true;
  } catch { return false; }
}
function noiseBuffer(seconds) {
  const buffer = audio.createBuffer(1, Math.floor(audio.sampleRate * seconds), audio.sampleRate), data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}
function voice(frequency, at, length, volume, type = 'sine', bus = musicBus, endFrequency = frequency) {
  const osc = audio.createOscillator(), gain = audio.createGain(); osc.type = type;
  osc.frequency.setValueAtTime(frequency, at); if (frequency !== endFrequency) osc.frequency.exponentialRampToValueAtTime(endFrequency, at + length);
  gain.gain.setValueAtTime(.0001, at); gain.gain.exponentialRampToValueAtTime(Math.max(.0002, volume), at + Math.min(.025, length * .12));
  gain.gain.exponentialRampToValueAtTime(.0001, at + length); osc.connect(gain); gain.connect(bus); osc.start(at); osc.stop(at + length + .02);
  osc.onended = () => { osc.disconnect(); gain.disconnect(); };
}
function noise(at, length, volume, frequency, bus = musicBus) {
  const source = audio.createBufferSource(), filter = audio.createBiquadFilter(), gain = audio.createGain(); source.buffer = noiseBuffer(length);
  filter.type = 'bandpass'; filter.frequency.value = frequency; filter.Q.value = .7;
  gain.gain.setValueAtTime(volume, at); gain.gain.exponentialRampToValueAtTime(.0001, at + length);
  source.connect(filter); filter.connect(gain); gain.connect(bus); source.start(at); source.stop(at + length);
  source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
}
function scoreStep(step, at) {
  const eighth = step % 16, bar = Math.floor(step / 16), root = [50, 46, 48, 45][bar % 4];
  const melodies = [[12,19,22,24,19,17,15,19,12,19,27,24,22,19,17,15], [12,19,24,22,19,15,17,19,12,17,22,24,19,17,15,12], [12,16,19,24,19,16,21,19,12,19,24,28,24,21,19,16]];
  // A lute-like harmonic pluck, with a short bright attack and a warm body.
  if (eighth % 2 === 0 || state === 'running') {
    const f = noteHz(root + melodies[chapter][eighth]);
    voice(f, at, 1.15, .066); voice(f * 2, at, .55, .023); voice(f * 3, at, .21, .012);
  }
  if (eighth === 0 || eighth === 8) {
    voice(noteHz(root - 12), at, 2.25, .075);
    const third = chapter === 2 ? 4 : 3;
    for (const offset of [0, third, 7]) { const f = noteHz(root + 12 + offset); voice(f, at + .05, 2.7, .019); voice(f * 1.003, at + .05, 2.7, .01); }
  }
  // Sparse flute phrases float above the rhythm every other bar.
  if (bar % 2 === 1 && [2,6,10,14].includes(eighth)) { const f = noteHz(root + 24 + [0,7,5,3][Math.floor(eighth / 4)]); voice(f, at, .9, .029); voice(f * 2, at, .75, .004); }
  if (state === 'running') {
    if ((wave === 'surge' || pursuit > .65) && eighth % 2 === 1) { voice(95,at,.18,.07,'sine',musicBus,42); noise(at,.05,.019,750); }
    if (eighth % 4 === 0) { voice(140, at, .21, .13, 'sine', musicBus, 48); noise(at, .045, .025, 600); }
    else if (eighth % 4 === 2) { voice(205, at, .1, .032, 'sine', musicBus, 100); noise(at, .055, .027, 1450); }
    if (eighth % 2 === 1) noise(at, .05, .013, 4200);
  }
}
function updateMusic() {
  if (!audio) return;
  if (windBus) windBus.gain.setTargetAtTime(.012 + pursuit * .025 + windIntensity * .022, audio.currentTime, .6);
  const shouldPlay = sound && !document.hidden && state !== 'paused';
  const target = !shouldPlay ? 0 : state === 'quiz' ? .32 : state === 'ended' ? .28 : state === 'welcome' ? .45 : .72;
  const signature = state + ':' + shouldPlay;
  if (signature !== lastAudioState) {
    masterBus.gain.setTargetAtTime(shouldPlay ? .65 : 0, audio.currentTime, .035);
    musicBus.gain.setTargetAtTime(target, audio.currentTime, .3); lastAudioState = signature;
  }
  if (!shouldPlay || audio.state !== 'running') { musicPlaying = false; return; }
  if (!musicPlaying) { musicNext = audio.currentTime + .05; musicPlaying = true; }
  if (musicNext < audio.currentTime) musicNext = audio.currentTime + .025;
  while (musicNext < audio.currentTime + .18) { scoreStep(musicStep++, musicNext); musicNext += MUSIC_STEP * (state === 'running' && wave === 'surge' ? .82 : 1); }
}
function tone(freq, duration = .13, type = 'sine', volume = .045) {
  if (!sound || !initAudio()) return;
  const at = audio.currentTime + .008;
  // Soft layered effects instead of bare electronic beeps.
  if (freq >= 880) { voice(freq, at, duration + .16, volume, 'sine', effectsBus); voice(freq * 1.5, at + .035, duration + .12, volume * .3, 'sine', effectsBus); }
  else if (freq <= 180) { voice(freq, at, duration, volume * 1.2, 'sine', effectsBus, Math.max(35, freq * .35)); noise(at, .12, .055, 450, effectsBus); }
  else if (freq === 370 || freq === 200) { noise(at, duration + .05, .085, freq === 370 ? 1700 : 750, effectsBus); voice(freq, at, duration, .014, 'sine', effectsBus, freq * 1.45); }
  else { voice(freq, at, duration + .15, volume, 'sine', effectsBus); voice(freq * 1.25, at + .04, duration + .2, volume * .35, 'sine', effectsBus); }
  updateMusic();
}
function updateSound() {
  $('sound').innerHTML = '♫' + (sound ? '' : '<span class="slash"></span>');
  $('sound').setAttribute('aria-label', sound ? 'Mute music and effects' : 'Enable music and effects');
  $('sound').setAttribute('aria-pressed', String(sound)); $('sound').title = sound ? 'Music & effects on' : 'Music & effects off';
}
updateSound(); $('sound').onclick = () => {
  sound = !sound; updateSound(); try { localStorage.setItem('bible-runner-sound', sound ? 'on' : 'off'); } catch {}
  if (sound) { initAudio(); tone(620); } updateMusic();
};
$('fullscreen').onclick = async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await $('app').requestFullscreen(); } catch { notify('Full screen unavailable', 'Your browser still supports swipe and button controls.'); } };
function buildScenery() {
  terrainProps = [];
  for (let i = 0; i < 84; i++) terrainProps.push({z:12+i*4.5,x:(i%2?1:-1)*random(8,65),width:random(.7,3.5),height:random(.35,2.4),type:i%5===0?'shrub':'boulder',seed:i});
  sceneryObjects = [];
  for (let i = 0; i < 38; i++) {
    const z = 12 + i * 8;
    sceneryObjects.push({ z, x: (i % 2 ? 1 : -1) * random(7.4, 13), type: i % 5 === 0 ? 'palm' : i % 3 === 0 ? 'torch' : 'column', seed: random(0, 10) });
  }
}
buildScenery();
function updateHUD() {
  updateExpeditionHUD();
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
  resetExpedition(); buildScenery(); updateHUD(); tone(500, .25); notify('Reach the sanctuary.', 'Keep ahead of the storm. Clean escapes and wisdom buy you distance.', false, 4);
}
$('start').onclick = start; $('restart').onclick = start; $('tutorial-start').onclick = start;
$('practice').onclick = () => show('tutorial');
function pause() {
  if (state === 'running' || state === 'quiz') { beforePause = state; state = 'paused'; show('pause-screen'); $('pause').textContent = '▶'; updateMusic(); }
  else if (state === 'paused') resume();
}
function resume() { if (state !== 'paused') return; state = beforePause; initAudio(); show('pause-screen', false); $('pause').textContent = '❚❚'; }
$('pause').onclick = pause; $('resume').onclick = resume; $('quit').onclick = () => finish();
function home() {
  state = 'welcome'; objects = []; particles = []; lane = smoothLane = 1; chapter = 0; jump = slide = 0; shield = magnet = 0;
  ['end', 'hud', 'controls', 'desktop-hint', 'pause', 'chapter-strip', 'wisdom', 'powers', 'toast', 'region-reveal', 'pause-screen', 'expedition', 'skill-banner', 'wave-banner'].forEach(id => show(id, false));
  show('welcome'); $('best').textContent = best.toLocaleString(); buildScenery();
}
$('home').onclick = home;
function finish(victory = false) {
  if (state === 'ended') return;
  won = victory; if (victory) points += 2000;
  $('end-title').textContent = victory ? 'The sanctuary is yours.' : finishReason === 'storm' ? 'The storm caught up.' : 'A story worth running.';
  state = 'ended'; const score = Math.floor(points + distance * 3), newBest = score > best;
  best = Math.max(best, score); try { localStorage.setItem('bible-runner-score-v2', best); } catch {}
  $('end-score').textContent = score.toLocaleString(); $('end-distance').textContent = Math.floor(distance) + ' m'; $('end-coins').textContent = coins;
  $('end-wisdom').textContent = correctAnswers + '/' + attempted; $('end-kicker').textContent = victory ? '✦ SANCTUARY REACHED · +2,000 POINTS' : newBest ? '✧ A NEW PERSONAL BEST' : 'THE JOURNEY IS THE REWARD';
  $('end-verse').textContent = lastLearned ? lastLearned[4] + ' — ' + lastLearned[3] : '“Let us run with perseverance the race marked out for us.” — Hebrews 12:1';
  ['wisdom', 'pause-screen', 'controls', 'desktop-hint', 'toast', 'region-reveal', 'expedition', 'skill-banner', 'wave-banner'].forEach(id => show(id, false)); show('end'); show('pause', false); tone(victory ? 1040 : 180, .5);
}
function action(name) {
  if (name === 'pause') { pause(); return; }
  if (state !== 'running' && state !== 'quiz') return;
  if (name === 'left') lane = Math.max(0, lane - 1);
  if (name === 'right') lane = Math.min(2, lane + 1);
  if (name === 'jump' && jump === 0 && slide === 0) { jump = .88; tone(370, .16); }
  if (name === 'slide' && slide === 0 && jump === 0) { slide = .85; tone(200, .1); }
}
function chooseAnswer(index) {
  if (state !== 'quiz' || !Number.isInteger(index) || index < 0 || index > 2) return;
  resolveQuiz(index);
}
const keys = { ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right', ArrowUp: 'jump', w: 'jump', ArrowDown: 'slide', s: 'slide', ' ': 'pause', Escape: 'pause' };
window.addEventListener('keydown', event => {
  if (state === 'quiz' && !event.repeat && ['1','2','3'].includes(event.key)) { event.preventDefault(); chooseAnswer(Number(event.key) - 1); return; }
  const name = keys[event.key]; if (!name || event.target.tagName === 'BUTTON' && event.key === ' ') return; if (state === 'running' || state === 'quiz' || state === 'paused') { event.preventDefault(); if (!event.repeat) action(name); } });
document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('pointerdown', e => { e.preventDefault(); action(button.dataset.action); }));
let touch = null;
canvas.addEventListener('pointerdown', event => { touch = { x: event.clientX, y: event.clientY, id: event.pointerId }; canvas.setPointerCapture(event.pointerId); });
canvas.addEventListener('pointerup', event => { if (!touch || touch.id !== event.pointerId) return; const dx = event.clientX - touch.x, dy = event.clientY - touch.y; if (Math.max(Math.abs(dx), Math.abs(dy)) > 22) action(Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'right' : 'left' : dy > 0 ? 'slide' : 'jump'); touch = null; });
canvas.addEventListener('pointercancel', () => touch = null);
document.addEventListener('visibilitychange', () => { if (document.hidden && (state === 'running' || state === 'quiz')) pause(); updateMusic(); });
function beginQuiz() {
  state = 'quiz'; show('wave-banner', false); show('skill-banner', false); quizTick = 0; objects = []; quizRemaining = quizTotal; jump = slide = 0; $('wisdom-time').style.width = '100%';
  if (!questionDeck.length) questionDeck = shuffle(questions);
  const source = questionDeck.pop(), choices = shuffle(source[1].map((text, i) => ({ text, right: i === source[2] })));
  currentQuestion = { source, choices }; $('question').textContent = source[0]; $('wisdom-count').textContent = String(attempted + 1).padStart(2, '0');
  $('answers').replaceChildren(); choices.forEach((answer, i) => {
    const button = document.createElement('button'); const label = document.createElement('small'); label.textContent = 'OPTION ' + (i + 1); button.append(label, document.createTextNode(answer.text));
    button.onclick = () => chooseAnswer(i); $('answers').append(button);
  }); show('toast', false); toastTime = 0; show('wisdom'); tone(580, .3);
}
function resolveQuiz(answerIndex = lane) {
  if (state !== 'quiz') return;
  attempted++; const answer = currentQuestion.choices[answerIndex], q = currentQuestion.source;
  if (answer && answer.right) {
    pursuit = Math.max(.04, pursuit - .1); cleanCombo++; comboTime = 5;
    correctAnswers++; streak++; multiplier = Math.min(5, 1 + streak); points += 200 * multiplier; hearts = Math.min(3, hearts + 1);
    notify('Correct! +' + 200 * multiplier, 'Heart restored · ×' + multiplier + ' multiplier', false, 1.4); burst((lane - 1) * 3.5, PLAYER_Z, 2, 26, '#f9d889'); tone(880, .35);
  } else {
    pursuit = Math.min(.97, pursuit + .04); cleanCombo = 0;
    lastLearned = q; streak = 0; multiplier = 1; notify(answer ? 'A lesson for the road.' : 'Time’s up. Here’s the answer.', 'Answer: ' + q[1][q[2]] + '. ' + q[3] + ' · ' + q[4], true, 5); tone(230, .3);
  }
  state = 'running'; nextQuiz = distance + 260; spawnTimer = 1.1; invincible = Math.max(invincible, 1.5); show('wisdom', false); checkMissions(); updateHUD();
}
function burst(x, z, y, count, color) {
  for (let i = 0; i < count; i++) particles.push({ x, z, y, vx: random(-3, 3), vz: random(-4, 4), vy: random(1, 5), life: random(.35, .9), color });
}
function hit(object) {
  if (invincible > 0) return;
  if (shield > 0) { shield = 0; invincible = 1.3; burst((lane - 1) * 3.5, PLAYER_Z, 2, 20, '#a6e5f5'); notify('Shield of faith', 'Your shield absorbed the impact.', false, 2); tone(390, .2); return; }
  pursuit = Math.min(1, pursuit + .17); cleanCombo = 0; comboTime = 0;
  hearts--; invincible = 1.6; shake = reducedMotion ? 0 : .35; streak = 0; multiplier = 1; burst((lane - 1) * 3.5, PLAYER_Z, 1, 16, '#db9b76'); tone(130, .22, 'triangle');
  if (navigator.vibrate) navigator.vibrate(70);
  if (hearts <= 0 || pursuit >= 1) { if (pursuit >= 1) finishReason = 'storm'; finish(); return; }
  notify('Keep your courage.', object.type === 'arch' ? 'Slide ↓ beneath the stone arches.' : object.type === 'pillar' ? 'Switch lanes ↔ to avoid tall pillars.' : object.type === 'gap' ? 'Jump ↑ across broken sections of the path.' : 'Jump ↑ over fallen stones.', true, 2.4);
}
function spawnRow() {
  const lanes = shuffle([0,1,2]), safe = lanes[0], activeWave = wave === 'surge';
  if (wave === 'recovery' || Math.random() < (activeWave ? .12 : .3)) {
    for (let i = 0; i < 5; i++) objects.push({ type: 'coin', lane: safe, z: FAR + i * 6, hit: false });
    if (Math.random() < .25 && distance > 70) objects.push({type: Math.random() < .5 ? 'shield' : 'magnet',lane:lanes[1],z:FAR,hit:false});
    return;
  }
  function hazard(l) {
    const r = Math.random(), type = activeWave && chapter === 2 && r < .5 ? 'gap' : r < .4 ? 'rock' : r < .7 ? 'arch' : 'pillar';
    objects.push({type,lane:l,z:FAR,hit:false,falling:activeWave && chapter === 0 && type === 'rock'});
  }
  hazard(lanes[1]); if (activeWave && distance > 300) hazard(lanes[2]);
  for (let i=0;i<3;i++) objects.push({type:'coin',lane:safe,z:FAR+i*6,hit:false});
  if (!activeWave && Math.random()<.12) objects.push({type:Math.random()<.5?'shield':'magnet',lane:safe,z:FAR+23,hit:false});
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
  updateExpedition(dt); if (state === 'ended') return;
  const speed = state === 'quiz' ? 15 : 31 + Math.min(distance / 100, 17) + (wave === 'surge' ? 7 : wave === 'recovery' ? -3 : 0); distance += dt * speed; moveScenery(dt * speed);
  const nextChapter = Math.min(2, Math.floor(distance / 650));
  if (nextChapter !== chapter) { chapter = nextChapter; $('reveal-title').textContent = chapters[chapter].name; $('reveal-subtitle').textContent = chapters[chapter].subtitle; show('region-reveal'); revealTime = 3.5; tone(660, .4); }
  particles.forEach(p => { p.x += p.vx * dt; p.z += p.vz * dt; p.y += p.vy * dt; p.vy -= dt * 10; p.life -= dt; }); particles = particles.filter(p => p.life > 0);
  if (state === 'quiz') {
    quizRemaining = Math.max(0, quizRemaining - dt);
    $('wisdom-time').style.width = Math.max(0, quizRemaining / quizTotal) * 100 + '%';
    if (quizRemaining === 0) resolveQuiz(null);
  }
  else {
    spawnTimer -= dt; if (spawnTimer <= 0) { spawnRow(); spawnTimer = wave === 'surge' ? 1.12 : wave === 'recovery' ? 2.2 : Math.max(1.6, 2.15 - distance / 6000); }
    for (const object of objects) {
      if (state === 'ended') break;
      object.z -= speed * dt;
      if (object.falling && object.z < 70 && !object.landed) { object.landed = true; burst((object.lane - 1) * 3.5, object.z, .4, 8, '#c8a577'); }
      if (object.hit) continue;
      const aligned = Math.abs(smoothLane - object.lane) < .43;
      if (object.type === 'coin' && magnet > 0 && object.z < 50 && object.z > PLAYER_Z) { object.hit = true; collect(object); }
      else if (object.z <= PLAYER_Z && object.z > PLAYER_Z - speed * dt - .5) {
        object.hit = true;
        if (!aligned) { if (['rock','arch','pillar','gap'].includes(object.type)) { const separation = Math.abs(smoothLane - object.lane); cleanEscape('dodge', separation < .8); } continue; }
        if (object.type === 'coin') collect(object);
        else if (object.type === 'shield') { shield = 12; burst((lane - 1) * 3.5, PLAYER_Z, 2, 18, '#96e2f5'); notify('Shield of faith', 'One impact protected · 12 seconds', false, 2.5); tone(690, .3); }
        else if (object.type === 'magnet') { magnet = 12; burst((lane - 1) * 3.5, PLAYER_Z, 2, 18, '#f4d28f'); notify('Gathering light', 'Light from every lane comes to you · 12 seconds', false, 2.5); tone(750, .3); }
        else { const height = jump > 0 ? Math.sin(jump / .88 * Math.PI) * 3 : 0; if (object.type === 'pillar' || (object.type === 'rock' || object.type === 'gap') && height < 1.25 || object.type === 'arch' && slide <= 0) hit(object); else cleanEscape(object.type === 'arch' ? 'slide' : 'jump'); }
      }
    }
    objects = objects.filter(o => o.z > -8 && !(o.hit && ['coin', 'shield', 'magnet'].includes(o.type)));
    if (state === 'running' && distance >= SANCTUARY) { checkMissions(); finish(true); }
    else if (state === 'running' && distance >= nextQuiz) beginQuiz();
  }
  accumulator += dt; if (accumulator > .08) { updateHUD(); accumulator = 0; }
}
function collect(object) { coins++; points += 10 * multiplier; burst((object.lane - 1) * 3.5, object.z, 1.3, 5, '#ffdc88'); tone(900 + coins % 5 * 80, .08, 'sine', .025); }
function moveScenery(amount) {
  sceneryObjects.forEach(o => { o.z -= amount; if (o.z < -12) o.z += 304; });
  terrainProps.forEach(o => { o.z -= amount; if (o.z < -12) o.z += 390; });
}
function box(x, z, width, depth, height, color, top, side) {
  const a = x - width / 2, b = x + width / 2;
  worldPoly([[a,z,0],[b,z,0],[b,z,height],[a,z,height]], color);
  worldPoly([[b,z,0],[b,z+depth,0],[b,z+depth,height],[b,z,height]], side || '#6e574a');
  worldPoly([[a,z,height],[b,z,height],[b,z+depth,height],[a,z+depth,height]], top || '#e0c19a');
}
function drawSky(palette) {
  if (landscapeLayers[chapter]) {
    // Distant landmarks slowly approach; the near ground is rendered in world space.
    const travel=state==='welcome'?demoDistance:distance,approach=1+Math.min(travel/SANCTUARY,1)*.22;
    const drift=reducedMotion?0:-(smoothLane-1)*Math.min(12,W*.015);
    ctx.drawImage(landscapeLayers[chapter], W/2*(1-approach)+drift, horizon*(1-approach), W*approach, H*approach);
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
function texturedTriangle(texture, a, b, c, second = false) {
  ctx.save();ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.closePath();ctx.clip();
  const size=texture.width;
  if(second)ctx.transform((a.x-c.x)/size,(a.y-c.y)/size,(a.x-b.x)/size,(a.y-b.y)/size,b.x+c.x-a.x,b.y+c.y-a.y);
  else ctx.transform((b.x-a.x)/size,(b.y-a.y)/size,(c.x-a.x)/size,(c.y-a.y)/size,a.x,a.y);
  ctx.drawImage(texture,0,0);ctx.restore();
}
function drawTerrain(palette) {
  const travel=state==='welcome'?demoDistance:distance,offset=travel%24,row=Math.floor(travel/24);
  const textures=terrainTextures[chapter];ctx.save();ctx.globalAlpha=1;
  // Opaque textured land outside the causeway, moving at the same world speed.
  for(let i=15;i>=0;i--){const near=Math.max(.01,i*24-offset),far=(i+1)*24-offset;if(far<=0)continue;
    for(const side of [-1,1])for(let band=0;band<4;band++){
      const bounds=[5.86,26,46,86,166],inner=side*bounds[band],outer=side*bounds[band+1],level=-1.55;
      const a=scenePoint(inner,near,level),b=scenePoint(outer,near,level),c=scenePoint(inner,far,level),d=scenePoint(outer,far,level);
      if(Math.min(a.x,b.x,c.x,d.x)>W+2||Math.max(a.x,b.x,c.x,d.x)<-2||Math.min(a.y,b.y,c.y,d.y)>H+2)continue;
      ctx.globalAlpha=clamp((385-near)/190,0,1);
      if(textures){const texture=textures[((row+i)%2)*2+(band%2)];texturedTriangle(texture,a,b,c);texturedTriangle(texture,d,b,c,true);}
      else poly([a,b,d,c],palette.sand);
    }
  }
  // Blend only the remote horizon into the distant vista, never the running platform.
  ctx.globalAlpha=1;
  const mist=ctx.createLinearGradient(0,horizon,0,horizon+H*.13);mist.addColorStop(0,palette.fog+'65');mist.addColorStop(1,palette.fog+'00');ctx.fillStyle=mist;ctx.fillRect(0,horizon,W,H*.13);
  ctx.restore();
}
function drawTerrainProp(o,palette){
  const ground=-1.55,p=scenePoint(o.x,o.z,ground),s=p.s;if(p.x<-s*5||p.x>W+s*5||p.y>H+s*5||o.z<0)return;
  ctx.save();ctx.globalAlpha=Math.min(1,(390-o.z)/55);const x=o.x,z=o.z,w=o.width,h=o.height;
  ellipse(p.x+s*.35,p.y+s*.08,s*w*.7,s*w*.17,'#362c2538');
  if(o.type==='shrub'){
    for(let i=0;i<7;i++){const base=scenePoint(x,z,ground),tip=scenePoint(x+Math.sin(i*2.4)*w*.65,z+Math.cos(i)*w*.4,ground+h*(.5+(i%3)*.2));line([[base.x,base.y],[tip.x,tip.y]],chapter===2?'#647044':'#887447',Math.max(1,s*.045));}
  }else{
    const points=[[x-w*.6,z,ground],[x+w*.55,z,ground],[x+w*.42,z+w*.7,ground+h*.65],[x-w*.15,z+w*.8,ground+h],[x-w*.5,z+w*.4,ground+h*.6]];
    worldPoly(points,chapter===1?'#817570':chapter===2?'#89856b':'#a38361');
    worldPoly([[x-w*.6,z,ground],[x+w*.55,z,ground],[x+w*.25,z,ground+h*.55],[x-w*.3,z,ground+h*.75]],chapter===1?'#655b5b':chapter===2?'#67684e':'#806045');
    worldPoly([[x-w*.3,z,ground+h*.75],[x+w*.25,z,ground+h*.55],[x+w*.42,z+w*.7,ground+h*.65],[x-w*.15,z+w*.8,ground+h]],palette.stone);
  }ctx.restore();
}
function stoneColor(hex, shift) {
  const value = parseInt(hex.slice(1), 16);
  return '#' + [value >> 16, value >> 8 & 255, value & 255].map(v => clamp(v + shift, 0, 255).toString(16).padStart(2, '0')).join('');
}
function drawRoad(palette) {
  ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const travel = state === 'welcome' ? demoDistance : distance, offset = travel % 9, row = Math.floor(travel / 9);
  // Solid foundation and vertical masonry faces, never a translucent overlay.
  for (const side of [-1, 1]) {
    const x = side * 5.85;
    worldPoly([[x,0,0],[x,380,0],[x,380,-1.4],[x,0,-1.4]], side < 0 ? '#725943' : '#594536');
    worldPoly([[x,0,-1.4],[x,380,-1.4],[x+side*.22,380,-1.7],[x+side*.22,0,-1.7]], '#392f29');
  }
  worldPoly([[-5.85,0,0],[5.85,0,0],[5.85,380,0],[-5.85,380,0]], stoneColor(palette.road,-18));
  for (let i = 36; i >= 0; i--) {
    const z = i * 9 - offset, next = z + 9, worldRow = row + i;
    if (next <= 0) continue;
    // Two individually shaded flagstones per lane, with recessed mortar joints.
    for (let l = 0; l < 3; l++) for (let half = 0; half < 2; half++) {
      const x = (l - 1) * 3.5, front = Math.max(.01, z + half * 4.5 + .07), back = z + (half + 1) * 4.5 - .07;
      if (back <= front) continue;
      const hash = (worldRow * 37 + l * 17 + half * 23) % 19, color = stoneColor(palette.road, hash - 3);
      const coords = [[x-1.71,front,.02],[x+1.71,front,.02],[x+1.71,back,.02],[x-1.71,back,.02]];
      worldPoly(coords, color);
      const a=scenePoint(x-1.66,front,.025),b=scenePoint(x+1.66,front,.025),c=scenePoint(x-1.66,back,.025);
      line([[a.x,a.y],[b.x,b.y]], stoneColor(color,-24), Math.max(.5,a.s*.025));
      line([[a.x,a.y],[c.x,c.y]], stoneColor(color,22), Math.max(.4,a.s*.014));
      // Stable mineral flecks and weathering move with each slab.
      if (front < 105) for(let grain=0;grain<5;grain++) {
        const gx=x-1.4+((hash*7+grain*13)%29)/10, gz=front+.3+((hash*3+grain*7)%31)/10;
        if(gz>=back-.1)continue;
        const g=scenePoint(gx,gz,.03),h=scenePoint(gx+.08+(grain%3)*.06,gz+.08,.03);
        line([[g.x,g.y],[h.x,h.y]],stoneColor(color,grain%2?-13:17),Math.max(.4,g.s*.012));
      }
      if (hash % 7 === 0) {
        const a=scenePoint(x-.5,front+.5,.03),b=scenePoint(x-.25,front+1.4,.03),c=scenePoint(x+.1,front+1.7,.03);
        line([[a.x,a.y],[b.x,b.y],[c.x,c.y]],stoneColor(color,-32),Math.max(.5,a.s*.02));
      }
    }
    for (const side of [-1,1]) {
      const x=side*5.62; box(x,Math.max(.01,z),.46,Math.min(8.85,next),.3,'#957654',palette.stone,'#6f553e');
      const a=scenePoint(side*5.86,Math.max(.01,z),-.65),b=scenePoint(side*5.86,next,-.65);
      line([[a.x,a.y],[b.x,b.y]],'#b1956b',Math.max(.5,a.s*.018));
      const c=scenePoint(side*5.86,Math.max(.01,z),-1.36);
      line([[a.x,a.y],[c.x,c.y]],'#3e342a',Math.max(.5,a.s*.02));
    }
  }
  // Narrow inlaid borders make each lane legible without painting over the stone.
  for (const x of [-1.75,1.75]) {
    worldPoly([[x-.035,0,.035],[x+.035,0,.035],[x+.035,340,.035],[x-.035,340,.035]],stoneColor(palette.stone,10));
  }
  if (state === 'quiz') {
    const selectedX = (lane - 1) * 3.5;
    worldPoly([[selectedX - 1.7,0,.03],[selectedX + 1.7,0,.03],[selectedX + 1.7,180,.03],[selectedX - 1.7,180,.03]], '#efc75e30');
    for (let l = 0; l < 3; l++) { const x = (l-1)*3.5, z = PLAYER_Z + quizRemaining * 18; box(x - 1.6,z,.18,1,5,'#b68a50','#f8d58c'); box(x + 1.6,z,.18,1,5,'#b68a50','#f8d58c'); box(x,z,3.4,.7, .2, '#c79a55', '#ffe2a3');
      const p = scenePoint(x,z,4.8); ctx.save(); ctx.shadowBlur = 16; ctx.shadowColor = '#ffcd67'; ctx.fillStyle = l === lane ? '#ffe2a3' : '#bca075'; ctx.font = `${Math.max(10,p.s*.9)}px Georgia`; ctx.textAlign='center'; ctx.fillText(['I','II','III'][l],p.x,p.y); ctx.restore(); }
  }
  ctx.restore();
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
  if (object.type === 'gap') {
    worldPoly([[x-1.6,z,.04],[x+1.6,z,.04],[x+1.55,z+4,.04],[x+.8,z+4.6,.04],[x+.3,z+4,.04],[x-1.6,z+4.3,.04]], '#302b30');
    worldPoly([[x-1.6,z,.05],[x+1.6,z,.05],[x+1.3,z+.45,.05],[x+.3,z+.2,.05],[x-.8,z+.55,.05]], '#675444');
    for (const edge of [-1.6,1.6]) { const a=scenePoint(x+edge,z,.05),b=scenePoint(x+edge,z+4,.05);line([[a.x,a.y],[b.x,b.y]],'#d6b985',Math.max(1,p.s*.035)); }
    const q=scenePoint(x,z+2,.06);ctx.fillStyle='#efd291';ctx.textAlign='center';ctx.font=`${Math.max(9,p.s*.45)}px sans-serif`;ctx.fillText('↑',q.x,q.y);return;
  }
  ellipse(p.x,p.y+1,p.s*1.25,p.s*.2,'#35251f33');
  if(object.type==='rock'){
    ctx.save();if(object.falling)ctx.translate(0,-Math.max(0,(z-70)/50)*6*p.s);
    box(x,z,2.45,1.4,1.3,'#9b8166',palette.stone,'#78604c');
    const a=scenePoint(x-.7,z,1.31),b=scenePoint(x-.2,z+.6,1.31),c=scenePoint(x+.1,z+.8,1.31);line([[a.x,a.y],[b.x,b.y],[c.x,c.y]],'#5b483d80',p.s*.035);
    box(x-.6,z+.3,.4,.6,1.42,'#b39c7a','#dac49b','#907958');ctx.restore();
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
  if (runnerSheet.complete && runnerSheet.naturalWidth) {
    const frame = running && !jump && !slide ? Math.floor(time * 11) % 8 : jump ? 1 : slide ? 4 : 0;
    const cellW = runnerSheet.naturalWidth / 4, cellH = runnerSheet.naturalHeight / 2;
    const spriteH = 145 * scale, spriteW = spriteH * cellW / cellH;
    const bob = jump || slide || !running ? 0 : Math.sin(phase * 2) * scale;
    ctx.save(); ctx.translate(pos.x, y - bob);
    if (slide > 0) { ctx.translate(0, -6 * scale); ctx.rotate(-.28); ctx.scale(1.12, .52); }
    else ctx.rotate(clamp((lane - smoothLane) * .12, -.09, .09));
    ctx.drawImage(runnerSheet, frame % 4 * cellW, Math.floor(frame / 4) * cellH, cellW, cellH, -spriteW / 2, -spriteH + 10 * scale, spriteW, spriteH);
    ctx.restore(); ctx.globalAlpha = 1;
    drawMagnetAura(pos, ground, scale); return;
  }
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
  drawMagnetAura(pos, ground, scale);
}
function drawMagnetAura(pos, ground, scale) {
  if(magnet>0){ctx.save();ctx.strokeStyle='#f5cf8a50';ctx.lineWidth=1.5;for(let i=0;i<2;i++){ctx.beginPath();ctx.ellipse(pos.x,ground-20*scale,(35+(time*35+i*25)%55)*scale,12*scale,0,0,TAU);ctx.stroke()}ctx.restore()}
}
function drawParticles() {
  for(const p of particles){const point=scenePoint(p.x,p.z,p.y);ctx.globalAlpha=Math.min(1,p.life*2);ellipse(point.x,point.y,Math.max(1,point.s*.07),Math.max(1,point.s*.07),p.color)}ctx.globalAlpha=1;
  // Ambient dust specks, drifting rather than repeating across the path.
  for(let i=0;i<20;i++){const x=((i*143.7+Math.sin(time*.15+i)*25)%(W+30))-15,y=((i*83.9-time*(i%3+1)*4)%(H+50)+H+50)%(H+50);ctx.globalAlpha=.15+Math.sin(time*.7+i)*.1;ellipse(x,y,i%3===0?1.8:.8,i%3===0?1.8:.8,'#f5d098')}ctx.globalAlpha=1;
}
function drawSanctuary(z) {
  if(z<0)return;for(const side of [-1,1]){box(side*4.8,z,.9,2,8,'#b39d79','#efd39b','#72604c');box(side*4.8,z-.1,1.4,2.2,.4,'#ba9e72','#f5dc9d');}
  worldPoly([[-5.5,z,7],[5.5,z,7],[5.5,z,8.6],[-5.5,z,8.6]],'#dac293');worldPoly([[-5.5,z,8.6],[5.5,z,8.6],[4,z,10],[-4,z,10]],'#eee0b2');
  const p=scenePoint(0,z,5),radius=p.s*4;const glow=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,radius);glow.addColorStop(0,'#fff6b866');glow.addColorStop(1,'#fce29300');ctx.fillStyle=glow;ctx.fillRect(p.x-radius,p.y-radius,radius*2,radius*2);
  ctx.fillStyle='#fff3c7';ctx.textAlign='center';ctx.font=`${Math.max(11,p.s*.8)}px Georgia`;ctx.fillText('✦',p.x,p.y-p.s*2.6);
}
function drawAtmosphere() {
  if(!['running','quiz','paused','ended'].includes(state))return;
  const surge=wave==='surge' && state!=='quiz';
  // A visible bank of dust pursues from behind, rising as the danger meter fills.
  const front=H*(1.055-pursuit*.29),dust=ctx.createLinearGradient(0,front-35,0,H);
  dust.addColorStop(0,'#aa785100');dust.addColorStop(.5,'#b47d5040');dust.addColorStop(1,'#614032ba');ctx.fillStyle=dust;ctx.fillRect(0,Math.max(0,front-35),W,H);
  for(let i=0;i<9;i++){const x=(i/8)*W+Math.sin(time*.5+i)*30,y=front+Math.sin(time*.9+i*2)*18,r=Math.min(W,H)*(.14+i%3*.02),g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'#bb8c6030');g.addColorStop(1,'#8c634400');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)}
  if(windIntensity>.2){ctx.save();ctx.globalAlpha=windIntensity*.13;ctx.strokeStyle='#efdbac';ctx.lineWidth=1;for(let i=0;i<23;i++){const x=((time*260+i*93)%(W+180))-100,y=horizon+((i*53.3)%(H-horizon));ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+55,y-9);ctx.stroke()}ctx.restore()}
  if(surge&&!reducedMotion){ctx.save();ctx.strokeStyle='#ffe7b425';ctx.lineWidth=1;for(let i=0;i<12;i++){const side=i%2?1:-1,t=(time*.5+i*.087)%1;const x=W/2+side*W*(.3+t*.35),y=horizon+H*t;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+side*22,y+40);ctx.stroke()}ctx.restore()}
  if(pursuit>.7){const edge=ctx.createRadialGradient(W/2,H*.55,W*.2,W/2,H*.55,Math.max(W,H)*.65);edge.addColorStop(0,'#873b2500');edge.addColorStop(1,'#a3433b55');ctx.fillStyle=edge;ctx.fillRect(0,0,W,H)}
}
function render() {
  const palette=chapters[chapter];ctx.save();if(!reducedMotion && state==='running')ctx.translate(Math.sin(time*5)*.8,Math.cos(time*9)*.6);if(shake>0)ctx.translate(Math.sin(time*100)*shake*18,Math.cos(time*83)*shake*10);
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';drawSky(palette);drawTerrain(palette);drawRoad(palette);
  const sanctuary = distance > SANCTUARY - 210 && state !== 'welcome' ? [{o:{z:SANCTUARY-distance+PLAYER_Z},sanctuary:true}] : [];
  const drawables=[...terrainProps.map(o=>({o,terrain:true})),...sanctuary,...sceneryObjects.map(o=>({o,scenery:true})),...objects.map(o=>({o,scenery:false})),{o:{z:PLAYER_Z},runner:true}].sort((a,b)=>b.o.z-a.o.z);
  for(const item of drawables){if(item.terrain)drawTerrainProp(item.o,palette);else if(item.sanctuary)drawSanctuary(item.o.z);else if(item.runner)drawRunner();else if(item.scenery){if(item.o.type==='column')drawColumn(item.o,palette);else if(item.o.type==='torch')drawTorch(item.o,palette);else drawPalm(item.o)}else drawObstacle(item.o,palette)}
  drawParticles();drawAtmosphere();const haze=ctx.createLinearGradient(0,horizon-10,0,horizon+80);haze.addColorStop(0,palette.fog+'00');haze.addColorStop(.3,palette.fog+'40');haze.addColorStop(1,palette.fog+'00');ctx.fillStyle=haze;ctx.fillRect(0,horizon-10,W,100);
  ctx.restore();
}
function frame(now) {const dt=lastTime?Math.min((now-lastTime)/1000,.05):0;lastTime=now;update(dt);updateMusic();render();requestAnimationFrame(frame)}
requestAnimationFrame(frame);
