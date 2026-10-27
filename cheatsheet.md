# Codex 型とコマンドの1枚まとめ

## 型：計画 → 小さく実装 → テスト → 差分を読む → 見直し
1. 「計画だけ出して」と頼む
2. 一度に1つだけ実装してもらう
3. テストを書かせて、実行させる
4. `/diff` で自分の目で差分を読む
5. `/review` で見直しをさせる

## コマンド
| コマンド | できること |
|---|---|
| `/init` | AGENTS.md の下書きを作らせる |
| `/permissions` | 任せる範囲（権限）を変える |
| `/diff` | 変更された内容を見る |
| `/review` | 変更を見直させる |
| `/compact` | 長くなった会話を要約して軽くする |
| `/resume` | 前の会話に戻る |

## 最近の更新（公式リリースノートより）
- 0.163.0（2026-10-15）：応答中の追加指示、`/side`、`/config`
- 0.164.0（2026-10-23）：`/presets`、`/model`・`/permissions` の引数指定
- 出典：https://github.com/openai/codex/releases

## ずれたとき
- 最初からではなく「ここをこう直して」と続けて頼む
- 会話が長くなったら `/compact`、または新しく始め直す

## 対話せずに使う（codex 0.141 のヘルプで確認したもの）
| コマンド | できること |
|---|---|
| `codex exec "指示"` | 対話せずに作業させる。`-s workspace-write` で書き込み許可、`-C フォルダ` で作業場所を指定 |
| `codex exec review --uncommitted` | まだコミットしていない変更を見直させる |
| `codex exec resume --last` | 直前の作業の続きをさせる |
| `codex fork` | 前の会話を分岐して別の道を試す |
| `codex apply` | Codex が作った差分を手元に適用する |
| `codex update` / `codex doctor` | 更新する／環境を診断する |
| `codex mcp` / `codex plugin` | 外部ツール（MCP）やプラグインを管理する |

## 並列で頼む
`./parallel.sh "お題1" "お題2" "お題3"`：お題ごとに git worktree を作り、`codex exec` を並列に走らせて、結果を見比べる
