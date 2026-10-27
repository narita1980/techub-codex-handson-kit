// テスト。`node tests.js` で実行するか、ブラウザで tests.html を開く。
(function (root) {
  const G = typeof require === "function" ? require("./game.js") : root.SnakeGame;

  function seq(values) {
    let i = 0;
    return () => values[i++ % values.length];
  }

  const tests = [
    ["はじめは長さ3で生きている", () => {
      const s = G.createGame(10, 10, seq([0]));
      assertEq(s.snake.length, 3);
      assertEq(s.alive, true);
    }],
    ["右に1マス進む", () => {
      const s = G.createGame(10, 10, seq([0]));
      const x0 = s.snake[0].x;
      G.step(s, seq([0]));
      assertEq(s.snake[0].x, x0 + 1);
      assertEq(s.snake.length, 3);
    }],
    ["右の壁にぶつかると終わる", () => {
      const s = G.createGame(5, 5, seq([0]));
      s.food = { x: 0, y: 0 };
      for (let i = 0; i < 10 && s.alive; i++) G.step(s, seq([0]));
      assertEq(s.alive, false);
      assertEq(s.snake[0].x <= 4, true, "頭が盤面の外に出ている");
    }],
    ["上・下の壁にぶつかると終わる", () => {
      const up = G.createGame(5, 5, seq([0]));
      up.food = { x: 4, y: 4 };
      G.setDirection(up, "up");
      for (let i = 0; i < 10 && up.alive; i++) G.step(up, seq([0]));
      assertEq(up.alive, false);
      const down = G.createGame(5, 5, seq([0]));
      down.food = { x: 4, y: 0 };
      G.setDirection(down, "down");
      for (let i = 0; i < 10 && down.alive; i++) G.step(down, seq([0]));
      assertEq(down.alive, false);
    }],
    ["エサを食べると1マス伸びて、点が1増える", () => {
      const s = G.createGame(10, 10, seq([0]));
      s.food = { x: s.snake[0].x + 1, y: s.snake[0].y };
      G.step(s, seq([0]));
      assertEq(s.score, 1);
      assertEq(s.snake.length, 4);
    }],
    ["エサは蛇の上に出ない", () => {
      const s = G.createGame(4, 4, seq([0]));
      for (let k = 0; k < 20; k++) {
        const f = G.placeFood(s, seq([k / 20]));
        assertEq(s.snake.some((p) => p.x === f.x && p.y === f.y), false);
      }
    }],
    ["進行方向と真逆には曲がれない", () => {
      const s = G.createGame(10, 10, seq([0]));
      G.setDirection(s, "left"); // いま右向き
      G.step(s, seq([0]));
      assertEq(s.alive, true);
      assertEq(s.dir, G.DIRS.right);
    }],
    ["自分の体にぶつかると終わる", () => {
      const s = G.createGame(10, 10, seq([0]));
      s.snake = [
        { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 4, y: 6 }, { x: 4, y: 5 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 },
      ];
      s.dir = G.DIRS.up; // 上は (5,4) = 自分の体
      s.food = { x: 9, y: 9 };
      G.step(s, seq([0]));
      assertEq(s.alive, false);
    }],
  ];

  function assertEq(actual, expected, msg) {
    const a = JSON.stringify(actual), e = JSON.stringify(expected);
    if (a !== e) throw new Error((msg ? msg + "：" : "") + `期待 ${e} / 実際 ${a}`);
  }

  function run() {
    return tests.map(([name, fn]) => {
      try { fn(); return { name, ok: true }; }
      catch (err) { return { name, ok: false, error: err.message }; }
    });
  }

  if (typeof module === "object" && module.exports && require.main === module) {
    const results = run();
    results.forEach((r) => console.log(`${r.ok ? "✓" : "✗"} ${r.name}${r.ok ? "" : "\n    " + r.error}`));
    const failed = results.filter((r) => !r.ok).length;
    console.log(`\n${results.length - failed}/${results.length} 成功`);
    process.exit(failed ? 1 : 0);
  }
  root.runSnakeTests = run;
})(typeof window !== "undefined" ? window : globalThis);
