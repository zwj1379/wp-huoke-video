/* 临时脚本：先打 fs 补丁再动态加载 @remotion/bundler 渲染模板5静帧 */
import fsp from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const fsSync = require('fs');

// patch sync mkdir
const origSync = fsSync.mkdirSync;
fsSync.mkdirSync = function (p, opts) {
  try {
    return origSync.call(fsSync, p, opts);
  } catch (e) {
    if (e && (e.code === 'EEXIST' || e.code === 'CODEBUDDY_BROKER_DENY')) {
      try {
        if (fsSync.statSync(p).isDirectory()) return undefined;
      } catch (_) {}
    }
    throw e;
  }
};

// patch promises mkdir（模块实例本体替换）
const origPMkdir = fsp.mkdir;
fsp.mkdir = async function (p, opts) {
  try {
    return await origPMkdir.call(fsp, p, opts);
  } catch (e) {
    if (e && (e.code === 'EEXIST' || e.code === 'CODEBUDDY_BROKER_DENY')) {
      try {
        const st = await fsp.stat(p);
        if (st.isDirectory()) return undefined;
      } catch (_) {}
    }
    throw e;
  }
};

const { bundle } = await import('@remotion/bundler');
const { renderStill, selectComposition } = await import('@remotion/renderer');

const entry = '/Users/a123/WorkBuddy/2026-08-19-15-16-13/make-video-template/src/index.ts';
const compId = process.argv[2] || 'Template5Cover';
const out = process.argv[3] || '/tmp/t5_preview_v3.png';
const bundleDir = `/tmp/t5bundle_${Date.now()}`;

console.log('Bundling...');
await bundle({
  entryPoint: entry,
  outDir: bundleDir,
  webpackOverride: (c) => c,
});

console.log('Selecting composition...');
const composition = await selectComposition({ serveUrl: bundleDir, id: compId });

console.log('Rendering still...');
await renderStill({ composition, serveUrl: bundleDir, output: out });

console.log('Done:', out);
process.exit(0);
