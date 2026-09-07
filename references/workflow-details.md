# 工作流细节 · 从文案到成片

## 工程位置

模板工程（已精简，仅保留模板库本体）位于工作区：

```
<workspace>/make-video-template/
├── src/
│   ├── templateData.ts              # ★ 数据文件：只改这里
│   ├── templates/
│   │   ├── Template1InfoCard.tsx    # ★ 模板1 深色科技信息卡片（已封版，勿改）
│   │   ├── Template2InfoCard.tsx    # ★ 模板2 星空黄卡键值清单版（已封版，勿改）
│   │   ├── Template3InfoCard.tsx    # ★ 模板3 星空卡片政策条列版（已封版，勿改）
│   │   ├── Template4InfoCard.tsx    # ★ 模板4 红色放射补贴强调版（已封版，勿改）
│   │   └── registry.ts              # ★ 模板库注册表
│   ├── Root.tsx                     # ★ Composition 注册（模板1~4 及对应 Still）
│   ├── config.ts                    # FPS/WIDTH/HEIGHT 常量
│   └── index.ts                     # Remotion 入口
├── public/bgm/                      # 各模板默认 BGM（template1~template4.m4a）
└── out/                             # 渲染产物
```

> 注意：工程中只有模板1~4 这 4 个短视频 Composition（9~12 秒）。
> 任何渲染命令都只会渲出短视频；如果渲出了几分钟的长视频，说明用错工程了。

## 完整出片流程

### 第 1 步：提炼文案重点

用户给一段未排版文案时，拆解为：

| 数据字段 | 规则 |
|---|---|
| `mainTitle` 主标题 | 核心卖点，保留原句或提炼为 6~12 字口号；>12 字自动降到 70px（各模板规则不同） |
| `subtitle` 副标题 | 一句话补充说明（可自拟），≤12 字；模板4 可不填 |
| `groups[]` 分组 | 2~5 组，每组一个重点；每组 1~4 条要点 |
| `items[].name` | 要点名称（左侧/条目） |
| `items[].value` | 强调值（右侧，如金额/年份，可省略）；模板2 常用 |
| `footerNote` 强调备注 | 模板3/4 的黄色强调段落，可省略 |
| `footer` 底部引导 | 12~14 字以内；「评论」改「平论」 |

### 第 2 步：写入模板数据

在 `src/templateData.ts` 新增导出（参考 `BLANK_TEMPLATE` 的结构），
用 `TemplateData` 类型约束。不要改 `BLANK_TEMPLATE`（保留为空白模板预览）。

### 第 3 步：注册 Composition

在 `src/Root.tsx` 中，参照 `InfoTemplateVideo` / `InfoTemplateCover` 注册。注意 `component` 要换成所选模板，例如模板1用 `Template1InfoCard`：

```tsx
import { MY_TEMPLATE } from "./templateData";
import { Template1InfoCard } from "./templates/Template1InfoCard";

<Composition
  id="MyVideo"
  component={Template1InfoCard}
  durationInFrames={279}   // BGM秒数 × 30
  fps={FPS}
  width={WIDTH}
  height={HEIGHT}
  defaultProps={{ data: MY_TEMPLATE }}
/>
<Still
  id="MyCover"
  component={Template1InfoCard}
  width={WIDTH}
  height={HEIGHT}
  defaultProps={{ data: MY_TEMPLATE }}
/>
```

### 第 4 步：验证首帧

```bash
cd <workspace>/make-video-template
npx remotion still src/index.ts MyVideo out/my-f0.png --frame=0
```

检查：所有文字完整、无截断/溢出、标题描边未糊死笔画。
若溢出，调对应 `TemplateNInfoCard.tsx` 中的 `titleFont` / `subFont` 字号规则。

### 第 5 步：渲染 + 合成 BGM

推荐用脚本（见 `scripts/render_and_mux.sh`）：

```bash
# 不传 BGM → 按 CompositionId 自动匹配 public/bgm/templateN.m4a
bash <skill>/scripts/render_and_mux.sh Template2Video 我的视频

# 用户提供了新 BGM 时显式传入
bash <skill>/scripts/render_and_mux.sh Template2Video 我的视频 /tmp/bgm.m4a
```

或手动两步：

```bash
# 渲染静音视频
npx remotion render src/index.ts MyVideo out/my-video.mp4 --codec h264

# 合成 BGM（-shortest 对齐到视频时长）
ffmpeg -y -i out/my-video.mp4 -i /tmp/bgm.m4a \
  -c:v copy -c:a aac -b:a 192k -map 0:v:0 -map 1:a:0 \
  -shortest out/my-video-final.mp4
```

注意：若 BGM 比视频长，`-shortest` 会裁掉多余部分；
若 BGM 比视频短，结尾会静音，可接受（默认行为）。

### 第 6 步：交付

```bash
cp out/my-video-final.mp4 ~/Desktop/我的视频-新版.mp4
open ~/Desktop/我的视频-新版.mp4
```

## 时长对齐（重要）

- `durationInFrames` 必须 = BGM秒数 × 30（向上取整）
- 当前模板默认 BGM 时长（已内置在 `public/bgm/`）：
  - 模板1：~9.30s → `279`
  - 模板2：~9.97s → `299`
  - 模板3：~9.13s → `274`
  - 模板4：~11.73s → `352`
- 用户换新 BGM 时，先用 `ffprobe -show_entries format=duration` 量时长，再按新秒数设置
- 视频总长必须 ≥ BGM 长（否则 BGM 被截断）
- 改时长时：只改 Root.tsx 中该 Composition 的 `durationInFrames`，
  组件内部动画都是 `sin(frame/...)` 循环，不受总时长影响

## 常见问题

| 问题 | 解法 |
|---|---|
| 首帧文字被截断 | 收紧 `titleFont` 规则；检查描边是否吃掉宽度 |
| 标题糊成一片 | 扫光带太宽：改回 `40%→50%→60%` 窄带；描边按字号缩放 |
| 卡片太扁 | 分组 >5 组：合并分组或精简条目 |
| BGM 被截断 | 增大 `durationInFrames` |
| 渲染报字体错 | 模板使用系统字体 PingFang SC / Hiragino Sans GB / Microsoft YaHei，无需额外加载 |
| 底部引导溢出 | footer 缩短到 12~14 字以内 |

## 迭代历史（重要经验）

1. V3 曾把扫光带加宽到 28%~72%，导致标题大部分时间被白色罩住、糊成一片。
   **教训：扫光保持窄带（40%~60%），只用瞬间提亮，不长期覆盖文字。**
2. 描边曾按 96px 字号硬编码 ±5px，小字号（64px）时糊死笔画。
   **教训：描边/厚度必须随 `titleFont` 按比例缩放。**
3. 用户要求「文字主体浮雕」而非「描边浮雕」：
   立体感靠**字面渐变（上亮下暗）+ 底部逐层挤出厚度**实现，
   描边只留 1.5px 细线勾轮廓。

## 新增模板流程（详细）

### A. 从对标视频复刻（主路径）

当用户提供参考视频（如 `~/Desktop/复刻视频4.mp4`）时：

1. **抽帧分析**
   - 用 ffmpeg 每 0.3~0.5s 抽一帧（时长 9~10s 的视频抽 18~20 帧）
   - 记录：主标题文案/字体/颜色/描边/浮雕/扫光、副标题样式、卡片背景/圆角/阴影/标题色、条目排版、底部引导位置/动画、背景渐变/装饰元素、整体入场节奏

2. **复刻组件**
   - 复制 `src/templates/Template1InfoCard.tsx` → `src/templates/Template2_XXX.tsx`
   - 修改颜色、背景、卡片、标题效果、动画参数
   - 保持 props 接口不变：`data?: TemplateData`

3. **注册新模板**
   - 在 `src/templates/registry.ts` 追加到 `TEMPLATES` 数组
   - 在 `src/Root.tsx` 注册 `Composition` + `Still`（id 建议 `Template2Video` / `Template2Cover`）

4. **样片确认**
   - 用该模板渲染一段带用户真实文案的视频（或空白模板预览）
   - 发给用户确认；按反馈调整（未封版前可改）

5. **封版**
   - 用户确认后，在文件头注释添加 **【已封版，勿改】**
   - 后续文案可直接说「用模板2」出片

### B. 从对话描述创建（轻量方式）

当用户仅用语言描述风格时：

1. 用大白话确认关键视觉参数（谁/何时、输入、流程、产出、停止条件、人工检查点）
2. 新建 `TemplateN_XXX.tsx`，按描述实现
3. 注册到 `registry.ts` + `Root.tsx`
4. 出样片确认
5. 确认后封版

### 模板库维护原则

- 已封版模板只读，不再改样式
- 同一文案想换风格 → 换模板ID，不动数据
- 风格迭代 → 新建 `Template(N+1)`，旧模板保留
