# Bible Runner

A browser adventure runner with three lanes, jumps, slides, collectible scrolls, and twelve Bible trivia questions with scripture references. Correct answers earn five scrolls and restore a heart. Personal bests are stored locally in the browser.

## Run

Requires Node.js 18 or newer. No packages or credentials are required.

```sh
npm run dev
```

The server listens on port 3000 (override with `PORT`). Use arrows or WASD to move, jump, and slide; Space or Escape pauses. Touch devices support swipe gestures and on-screen controls. Trivia pauses the runner until you choose an answer and continue.

```sh
npm run check
```

Fonts load from Google Fonts with local fallbacks. All game graphics are drawn locally on canvas. Sound is optional and enabled by the player. This is an original prototype inspired by the endless runner genre.
