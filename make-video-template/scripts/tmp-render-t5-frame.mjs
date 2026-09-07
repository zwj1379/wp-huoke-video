/* 临时脚本：渲染模板5 指定帧静帧（验证扫光动画）
 * 用法: NODE_OPTIONS= node tmp-render-t5-frame.mjs <frame> <outFile> [propsFile]
 */
import fsSync from 'node:fs';

const args = process.argv.slice(2);
const frame = parseInt(args[0] || '0', 10);
const out = args[1] || '/tmp/t5_shine_check.png';
const propsFile = args[2];

let inputProps;
if (propsFile) {
  inputProps = JSON.parse(fsSync.readFileSync(propsFile, 'utf-8'));
}

const { bundle } = await import('@remotion/bundler');
const { renderStill, selectComposition } = await import('@remotion/renderer');

const entry = '/Users/a123/WorkBuddy/2026-08-19-15-16-13/make-video-template/src/index.ts';
const bundleDir = `/tmp/t5bundle_f_${Date.now()}`;

console.log('Bundling...');
await bundle({ entryPoint: entry, outDir: bundleDir, webpackOverride: (c) => c });

console.log('Selecting composition...');
const composition = await selectComposition({
  serveUrl: bundleDir,
  id: 'Template5Video',
  inputProps,
});

console.log('Rendering still at frame', frame, '...');
await renderStill({ composition, serveUrl: bundleDir, output: out, inputProps, frame });
console.log('Done:', out);
process.exit(0);
