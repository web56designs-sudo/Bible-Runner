# Bible Runner · Run with purpose

An original full-screen browser adventure through three ancient-world chapters, racing a pursuing dust storm toward a sanctuary. Optimized for phones, with desktop support. The game is static and runs on GitHub Pages; no backend, account, API key, or package installation is required.

## Play

- Swipe left/right or use arrows / A and D to switch lanes.
- Swipe up or press Up / W to jump over fallen stones.
- Swipe down or press Down / S to slide under arches.
- Avoid tall pillars by changing lanes. Touch buttons are also available.
- At wisdom gates, tap an answer or press 1/2/3 to submit immediately. Movement never submits, skips, or dismisses the question, and answering does not change your lane. The countdown recedes while you think; at zero, the correct answer and reference appear and the run continues without an answer reward or a lost heart.
- Correct answers restore one heart, award points, and raise the multiplier up to ×5, with brief reward feedback and no scripture popup. Wrong answers reveal the answer and scripture reference without taking a heart.
- Gather light for points. Shields absorb one impact; magnets collect light from all lanes. Both last twelve seconds.
- New chapters appear every 650 meters: Jericho, Sinai, and Jerusalem. Reach the sanctuary at 1,950 meters to win and earn 2,000 bonus points. Gather 20 lights and answer three wisdom gates correctly for two optional bonuses worth 500 points each.
- Space / Escape pauses; changing browser tabs pauses automatically. An original procedurally composed soundtrack blends warm plucked strings, flute, soft frame drums, and desert wind. Music changes with chapter and softens during trivia. Layered effects accompany pickups, movement, collisions, and answers. Audio starts with a player interaction; the music button mutes both music and effects, and that preference is saved. Pausing or hiding the page silences audio. Faster percussion joins during hazard surges; the final three trivia seconds have a ticking cue. Personal bests and sound preference are saved in local storage when available.

## Pursuit and skill

- A visible storm pursues from behind. Impacts increase its danger meter; clean dodges, successful jumps/slides, close calls, and correct answers push it back. If the meter fills, the run ends.
- Each 38-second cycle of running alternates gathering, a four-second warning, a twelve-second surge, and recovery. Trivia pauses the pursuit clock and the storm's advance. The countdown still reveals unanswered questions at zero.
- Every generated obstacle row leaves at least one lane free. Recovery rows contain light and occasional power-ups rather than new obstacles.
- Jericho surges feature falling masonry, Sinai surges bring blowing sand, and Jerusalem surges introduce gaps in the causeway. Jump or change lanes to clear gaps.
- Clean escapes build a five-second combo window. Every fifth escape grants a growing bonus. Narrowly avoiding an obstacle awards a near-miss bonus once.
- Sandal footsteps, footfall dust, debris, storm clouds, subtle camera movement, and speed streaks reinforce motion. Reduced-motion preferences disable camera movement and speed streaks.

## Develop and verify

Node.js 18 or later:

```sh
npm run dev
npm run check
npm test
```

The dependency-free development server listens on port 3000 (override with `PORT`). Seventeen automated tests cover movement, jump/slide collision rules, trivia rewards and timing, power-ups, chapters, game over, restart, and the natural arrival of hazards.

## GitHub Pages

Deploy the `main` branch from `/ (root)`. `.nojekyll` is included. All application and art assets use relative paths, including when deployed below `/Bible-Runner/`.

All rendering uses the Canvas 2D API. The running platform is an opaque stone causeway with individually shaded flagstones, recessed mortar, weathering, raised curbs, and vertical masonry sides. The runner uses a detailed eight-frame character animation atlas; the projected road, obstacles, architecture, flames, and particles are drawn locally. The vector character remains available as a loading fallback. The sunset landscape is an original generated environment illustration, compressed to WebP. Chapters change its lighting and palette; the artwork is imaginative rather than a historical reconstruction. If the illustration cannot load, procedural scenery provides a fallback. Optional Google Fonts have local font fallbacks.
