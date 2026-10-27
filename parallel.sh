#!/usr/bin/env bash
# Codex に「同時に」3つ頼む。お題ごとに別の作業フォルダ（git worktree）を作り、
# それぞれで codex exec を並列に走らせて、終わったらテスト結果と差分を一覧にする。
#
# 使い方:  ./parallel.sh "お題1" "お題2" "お題3"
#          ./parallel.sh --dry-run "お題1" "お題2"   # Codex は呼ばず、準備だけ確かめる
# 前提:    git リポジトリの直下で実行する。codex にログイン済み。テストは node が必要。
set -euo pipefail

DRY=0
if [ "${1:-}" = "--dry-run" ]; then DRY=1; shift; fi
[ "$#" -ge 1 ] || { echo "お題を1つ以上渡してください"; exit 1; }

ROOT=$(git rev-parse --show-toplevel)
BASE=$(git rev-parse --abbrev-ref HEAD)
STAMP=$(date +%H%M%S)
PIDS=(); DIRS=(); i=0

for task in "$@"; do
  i=$((i + 1))
  dir="$ROOT/../$(basename "$ROOT")-wt-$STAMP-$i"
  git worktree add -q -b "parallel-$STAMP-$i" "$dir" "$BASE"
  DIRS+=("$dir")
  echo "[$i] $task  →  $dir"
  if [ "$DRY" = 0 ]; then
    prompt="$task
作業が終わったら sample/ で node tests.js を実行して、結果を報告してください。tests.js は書き換えないでください。"
    codex exec -s workspace-write -C "$dir" "$prompt" > "$dir/codex.log" 2>&1 &
    PIDS+=($!)
  fi
done

[ "$DRY" = 0 ] && { echo "実行中…（全部終わるまで待ちます）"; wait "${PIDS[@]}" || true; }

echo; echo "===== 結果 ====="
i=0
for dir in "${DIRS[@]}"; do
  i=$((i + 1))
  echo "[$i] $dir"
  git -C "$dir" diff --stat | tail -4 | sed 's/^/    /'
  ( cd "$dir/sample" && node tests.js 2>&1 | tail -1 | sed 's/^/    テスト: /' ) || true
  echo "    開く: open \"$dir/sample/index.html\""
done
echo
echo "気に入ったものを取り込む:  git merge parallel-$STAMP-<番号>"
echo "片付ける:  git worktree remove <フォルダ> && git branch -D parallel-$STAMP-<番号>"
