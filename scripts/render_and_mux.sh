#!/bin/bash
# ============================================================
# 文案模板视频 · 一键渲染 + 合成 BGM
# 用法:
#   bash render_and_mux.sh <CompositionId> <输出名> [BGM路径] [工程目录]
# 示例:
#   bash render_and_mux.sh Template2Video 输出名
#   bash render_and_mux.sh Template3Video 输出名 /tmp/我的BGM.m4a
#
# 输出:
#   <工程目录>/out/<输出名>-final.mp4   (已带 BGM 的最终成片)
# ============================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_BGM="$SCRIPT_DIR/../assets/bgm.m4a"

COMP_ID="${1:?缺少 CompositionId，例如 Template2Video}"
OUT_NAME="${2:?缺少输出名，例如 补贴清单}"
BGM="${3:-}"
PROJ_DIR="${4:-$(pwd)}"

# 未传 BGM 参数时：优先按模板号匹配工程 public/bgm/templateN.m4a，否则回退 skill 内置 BGM
if [[ -z "$BGM" ]]; then
  TPL_NUM=$(echo "$COMP_ID" | grep -oE '[0-9]+' | head -1)
  # BGM 映射：部分模板沿用同一首默认曲（模板5 自带 template5.m4a，抽自对标参考视频）
  case "$TPL_NUM" in
    *) BGM_TPL="$TPL_NUM" ;;
  esac
  if [[ -n "$TPL_NUM" && -f "$PROJ_DIR/public/bgm/template${BGM_TPL}.m4a" ]]; then
    BGM="$PROJ_DIR/public/bgm/template${BGM_TPL}.m4a"
    echo "==> 未指定 BGM，使用模板${TPL_NUM} 默认 BGM（映射 template${BGM_TPL}）: $BGM"
  elif [[ -f "$SKILL_BGM" ]]; then
    BGM="$SKILL_BGM"
    echo "==> 未指定 BGM，使用 skill 内置默认: $BGM"
  fi
fi

cd "$PROJ_DIR"

# 1. 渲染静音视频
echo "==> 渲染 $COMP_ID ..."
npx remotion render src/index.ts "$COMP_ID" "out/${OUT_NAME}-muted.mp4" --codec h264

# 2. 合成 BGM（有 BGM 才合成）
if [[ -n "$BGM" && -f "$BGM" ]]; then
  echo "==> 合成 BGM: $BGM"
  ffmpeg -y -i "out/${OUT_NAME}-muted.mp4" -i "$BGM" \
    -c:v copy -c:a aac -b:a 192k -map 0:v:0 -map 1:a:0 \
    -shortest "out/${OUT_NAME}-final.mp4"
  rm -f "out/${OUT_NAME}-muted.mp4"
else
  echo "==> 未提供 BGM，跳过合成"
  mv "out/${OUT_NAME}-muted.mp4" "out/${OUT_NAME}-final.mp4"
fi

echo "==> 完成: out/${OUT_NAME}-final.mp4"
ffprobe -v error -show_entries format=duration,size \
  -show_entries stream=codec_type,codec_name,width,height,r_frame_rate \
  -of default=noprint_wrappers=1 "out/${OUT_NAME}-final.mp4"
