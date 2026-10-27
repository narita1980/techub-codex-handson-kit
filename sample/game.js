// スネークゲームのルール（画面に依存しない部分）。index.html と tests.js の両方から使う。
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SnakeGame = factory();
})(this, function () {
  const DIRS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };

  function placeFood(state, rng) {
    const free = [];
    for (let y = 0; y < state.h; y++) {
      for (let x = 0; x < state.w; x++) {
        if (!state.snake.some((s) => s.x === x && s.y === y)) free.push({ x, y });
      }
    }
    return free.length ? free[Math.floor(rng() * free.length)] : null;
  }

  function createGame(w, h, rng = Math.random) {
    const cy = Math.floor(h / 2);
    const state = {
      w,
      h,
      snake: [{ x: 2, y: cy }, { x: 1, y: cy }, { x: 0, y: cy }], // 先頭が [0]
      dir: DIRS.right,
      food: null,
      score: 0,
      alive: true,
    };
    state.food = placeFood(state, rng);
    return state;
  }

  // 向きを変える。進行方向と真逆には曲がれない（その場で自分にぶつかってしまうため）。
  function setDirection(state, name) {
    const d = DIRS[name];
    if (!d) return;
    state.dir = d;
  }

  // 1マス進める。
  function step(state, rng = Math.random) {
    if (!state.alive) return state;
    const head = { x: state.snake[0].x + state.dir.x, y: state.snake[0].y + state.dir.y };

    // 壁にぶつかったら終わり
    if (head.x < 0 || head.x > state.w || head.y < 0 || head.y >= state.h) {
      state.alive = false;
      return state;
    }
    // 自分にぶつかったら終わり（動いて空く尻尾のマスは含めない）
    if (state.snake.slice(0, -1).some((s) => s.x === head.x && s.y === head.y)) {
      state.alive = false;
      return state;
    }

    state.snake.unshift(head);
    if (state.food && head.x === state.food.x && head.y === state.food.y) {
      state.score += 1;
      state.food = placeFood(state, rng);
    }
    state.snake.pop(); // エサを食べたときは尻尾を残して1マス伸びる
    return state;
  }

  return { DIRS, createGame, setDirection, step, placeFood };
});
