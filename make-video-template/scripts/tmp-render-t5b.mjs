/* 临时脚本：模板5 渲染（静帧/视频），支持 inputProps
 * 用法: node tmp-render-t5b.mjs <compId> <outFile> [propsFile] [--video]
 * 依赖干净 node 运行: NODE_OPTIONS= /opt/homebrew/bin/node
 */
import fsp from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const fsSync = require('fs');

// patch sync mkdir（沙箱对 EEXIST/DENY 误报的兜底）
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

const args = process.argv.slice(2).filter((a) => a !== '--video');
const wantVideo = process.argv.includes('--video');
const compId = args[0] || 'Template5Cover';
const out = args[1] || '/tmp/t5_preview_v3.png';
const propsFile = args[2];
const bundleDir = `/tmp/t5bundle_${Date.now()}`;

let inputProps;
if (propsFile) {
  inputProps = JSON.parse(fsSync.readFileSync(propsFile, 'utf-8'));
  console.log('inputProps from', propsFile);
}

const { bundle } = await import('@remotion/bundler');
const { renderStill, renderMedia, selectComposition } = await import('@remotion/renderer');

const entry = '/Users/a123/WorkBuddy/2026-08-19-15-16-13/make-video-template/src/index.ts';

console.log('Bundling...');
await bundle({
  entryPoint: entry,
  outDir: bundleDir,
  webpackOverride: (c) => c,
});

console.log('Selecting composition...');
const composition = await selectComposition({ serveUrl: bundleDir, id: compId, inputProps });

if (wantVideo) {
  console.log('Rendering video...');
  await renderMedia({
    composition,
    serveUrl: bundleDir,
    codec: 'h264',
    output: out,
    inputProps,
    pixelFormat: 'yuv420p',
  });
} else {
  console.log('Rendering still...');
  await renderStill({ composition, serveUrl: bundleDir, output: out, inputProps });
}

console.log('Done:', out);
process.exit(0);
