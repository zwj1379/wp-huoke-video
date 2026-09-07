# wp-huoke-video 渲染工程

竖屏 9:16 信息图短视频模板库（Remotion + React + TypeScript）。

> 本工程是 [wp-huoke-video] Skill 的渲染引擎，配合 Skill 使用。

## 结构

```
src/
  Root.tsx              Composition 注册入口
  config.ts             画幅 1080x1920 / 30fps
  templateData.ts       文案数据入口（BLANK_TEMPLATE 空白模板在此）
  templates/
    Template1InfoCard.tsx   模板1 · 深色科技信息卡片版【已封版】
    Template2InfoCard.tsx   模板2 · 星空黄卡键值清单版【已封版】
    Template3InfoCard.tsx   模板3 · 星空卡片政策条列版【已封版】
    Template4InfoCard.tsx   模板4 · 红色放射补贴强调版【已封版】
    registry.ts             模板注册表（新增模板在此登记）
public/
  bgm/                    模板默认 BGM（template1~template4.m4a）
```

## 快速开始

```bash
npm install
npx remotion compositions src/index.ts   # 应列出 Template1~Template4 的 Video + Cover
```

## 出片流程

1. 在 `src/templateData.ts` 新增一条导出（参考 `BLANK_TEMPLATE`）
2. 在 `src/Root.tsx` 注册 Composition + Still，时长按 BGM 秒数 × 30 帧设置
3. 首帧验证：`npx remotion still src/index.ts Template2Cover out/check.png --frame=0`
4. 渲染 + 合成 BGM：`bash <skill目录>/scripts/render_and_mux.sh Template2Video 输出名`（自动匹配 `public/bgm/template2.m4a`）

## 新增模板

在 `src/templates/` 新建独立组件文件，并在 `registry.ts` 登记。已封版模板不要改动。

## 依赖

- Node 18+
- FFmpeg（合成 BGM 用）
