# Bible Runner · Run with purpose

An original full-screen browser runner through three ancient-world chapters. Optimized for phones, with desktop support. The game is static and runs on GitHub Pages; no backend, account, API key, or package installation is required.

## Play

- Swipe left/right or use arrows / A and D to switch lanes.
- Swipe up or press Up / W to jump over fallen stones.
- Swipe down or press Down / S to slide under arches.
- Avoid tall pillars by changing lanes. Touch buttons are also available.
- At wisdom gates, tap an answer to resume immediately, or steer into its lane to commit after a brief lane switch. Keyboard 1/2/3 picks an answer directly; Enter confirms your current lane. The seven-second timer only runs while you have not answered.
- Correct answers restore one heart, award points, and raise the multiplier up to ×5, with brief reward feedback and no scripture popup. Wrong answers reveal the answer and scripture reference without taking a heart.
- Gather light for points. Shields absorb one impact; magnets collect light from all lanes. Both last twelve seconds.
- New chapters appear every 650 meters: Jericho, Sinai, and Jerusalem. The three chapters cycle as the speed increases to its cap.
- Space / Escape pauses; changing browser tabs pauses automatically. Sound is optional. Personal bests and sound preference are saved in local storage when available.

## Develop and verify

Node.js 18 or later:

```sh
npm run dev
npm run check
npm test
```

The dependency-free development server listens on port 3000 (override with `PORT`). Ten automated tests cover movement, jump/slide collision rules, trivia rewards and timing, power-ups, chapters, game over, restart, and the natural arrival of hazards.

## GitHub Pages

Deploy the `main` branch from `/ (root)`. `.nojekyll` is included. All application and art assets use relative paths, including when deployed below `/Bible-Runner/`.

All rendering uses the Canvas 2D API. The runner uses a detailed eight-frame character animation atlas; the projected road, obstacles, architecture, flames, and particles are drawn locally. The vector character remains available as a loading fallback. The sunset landscape is an original generated environment illustration, compressed to WebP. Chapters change its lighting and palette; the artwork is imaginative rather than a historical reconstruction. If the illustration cannot load, procedural scenery provides a fallback. Optional Google Fonts have local font fallbacks.
