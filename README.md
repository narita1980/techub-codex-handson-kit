# tecHub Codex ハンズオン 持ち帰りキット

2026-10-27 の tecHub「Codex ハンズオン」の持ち帰りキットです。ブラウザで動くスネークゲームを使って、Codex を「**同僚に頼む**」使い方を体験できます。

## 3つの「おっ」

1. **赤が緑に変わる**：`sample/tests.html` をブラウザで開くと、テスト結果が画面に出ます。最初は赤（3件失敗）。Codex に直させて、リロードすると緑になります
2. **3人に同時に頼む**：`bash parallel.sh "お題1" "お題2" "お題3"` で、Codex が別々の作業フォルダ（git worktree）で**並列に**作業し、3つの出来上がりを `index.html` で見比べて選べます
3. **スクリプトから Codex を呼ぶ**：`codex exec` と `codex exec review --uncommitted` で、対話せずに作業やレビューをさせられます（CI や自動化の入り口）

## 5分で試す

```bash
git clone <このリポジトリのURL>
cd <リポジトリ名>/sample
open index.html          # Windows は start index.html。まずは遊んでみる（壁や、エサを食べたときの動きが変）
node tests.js            # Node.js があれば。なければ tests.html をブラウザで開く
codex                    # 起動して、prompts/02 の指示を貼る
```

バグは3つです。答えは書いていません。直ったら `/diff` で何を直したか自分の目で読んでください。

## 中身

| ファイル | 内容 |
|---|---|
| `sample/index.html` | スネークゲーム本体（ダブルクリックで動く） |
| `sample/game.js` | ゲームのルール（バグ3つ入り） |
| `sample/tests.js` / `tests.html` | テスト。ターミナルでもブラウザでも見られる |
| `parallel.sh` | Codex を並列に走らせる（`--dry-run` で準備だけ確認できる） |
| `CHALLENGES.md` | やってみたいこと10個（並列で頼む組み合わせの例つき） |
| `AGENTS.md` | Codex に毎回守らせるルールのひな形。自分のプロジェクトにコピーして使う |
| `prompts/` | 貼り付けて使える指示文 |
| `cheatsheet.md` | 型とコマンドの1枚まとめ |

## 自分のプロジェクトに持ち帰る

1. `AGENTS.md` を自分のリポジトリ直下にコピーし、テストの実行コマンドと触ってはいけない場所を書き換える
2. 小さな修正を1つ選び、`prompts/01-plan-first.md` で「計画だけ」出させる
3. 計画に OK を出し、実装とテストを任せ、`/diff` で読む
4. 慣れたら、独立した作業を2〜3個選んで `parallel.sh` の考え方（worktree で並列）を試す

## 注意
- Codex は ChatGPT アカウントでログインして使います。画面の表記やコマンドは版によって変わります。古い版だとモデルが使えないことがあるので、先に `codex update` で更新してください
- `parallel.sh` は Codex に書き込みを許可して走らせます（`-s workspace-write`）。必ず練習用のリポジトリで試してください
- 練習用です。実務のコードにそのまま使わないでください
