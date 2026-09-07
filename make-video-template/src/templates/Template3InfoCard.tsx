import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { BLANK_TEMPLATE, TemplateData } from '../templateData';
import { WIDTH, HEIGHT } from '../config';

/**
 * ============================================================
 * 模板3 · 官方扶持政策星空卡片版
 * ============================================================
 * 对标视频：复刻视频2
 * 风格：深蓝星空/星云背景 + 白色浮雕主标题 + 黄色副标题
 *       6 个白色圆角胶囊卡片纵向排列 + 黄色强调备注 + 底部引导
 * ============================================================
 */

const FONT = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';

const BG_TOP = '#020B17';
const BG_MID = '#0A233D';
const BG_BOTTOM = '#041221';

const NEBULAS = [
  { x: 120, y: 300, w: 600, h: 500, color: 'rgba(30,120,200,0.22)' },
  { x: 480, y: 800, w: 700, h: 600, color: 'rgba(40,170,220,0.18)' },
  { x: -80, y: 1200, w: 500, h: 500, color: 'rgba(30,110,190,0.20)' },
];

const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: Math.random() * 1080,
  y: Math.random() * 1920,
  size: 1 + Math.random() * 2.2,
  delay: Math.random() * 80,
}));

const StarField: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    {STARS.map((s, i) => {
      const twinkle = 0.45 + 0.55 * Math.sin((frame + s.delay) / 14);
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: 'white',
            opacity: twinkle,
          }}
        />
      );
    })}
  </>
);

const TitleHeader: React.FC<{ title: string; subtitle: string; frame: number }> = ({
  title,
  subtitle,
  frame,
}) => {
  const scale = interpolate(frame, [0, 10], [1.08, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleFont = title.length > 8 ? 84 : 98;
  const subFont = subtitle.length > 18 ? 34 : 38;
  const depth = 5;
  return (
    <div
      style={{
        position: 'absolute',
        top: 140,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 10,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: titleFont,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '0.04em',
          textShadow: [
            `-1px -1px 0 rgba(255,255,255,0.9)`,
            ...Array.from({ length: depth }, (_, i) => `0 ${i + 1}px 0 #0B3A5C`),
            `0 ${depth + 10}px 22px rgba(0,0,0,0.55)`,
          ].join(','),
          WebkitTextStroke: '1.5px #5BA8E8',
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 18,
          fontFamily: FONT,
          fontSize: subFont,
          fontWeight: 800,
          color: '#FFDD00',
          letterSpacing: '0.06em',
          textShadow: '0 2px 10px rgba(0,0,0,0.7)',
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

const BubbleRow: React.FC<{ text: string; frame: number; index: number; height: number }> = ({
  text,
  frame,
  index,
  height,
}) => {
  const delay = index * 2;
  const ty = interpolate(frame + delay, [0, 10], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = 1;
  // 对标「8月17日」参考图：所有胶囊统一满宽 960px（画幅 89%），文字居中
  // 字号按「塞满白条」反推：可用宽 = 960 - 左右边距 48×2 = 864px
  // fontSize = 864 / 字数，短句自动放大、长句自动缩小；上限 72（防超短句失衡），下限 36
  const fontSize = Math.max(36, Math.min(72, Math.floor(864 / Math.max(text.length, 1))));
  return (
    <div
      style={{
        width: 960,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        padding: '0 38px',
        background: 'rgba(255,255,255,0.98)',
        borderRadius: 20,
        transform: `translateY(${ty}px)`,
        opacity,
        boxShadow: '0 10px 28px rgba(0,0,0,0.35)',
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize,
          fontWeight: 800,
          color: '#111',
          lineHeight: 1.3,
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
    </div>
  );
};

const BottomGuide: React.FC<{ note?: string; text: string; frame: number }> = ({ note, text, frame }) => {
  const bounce = Math.sin(frame / 8);
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 70,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 10,
        transform: `translateY(${bounce * 4}px)`,
      }}
    >
      {note && (
        <div
          style={{
            fontFamily: FONT,
            fontSize: 34,
            fontWeight: 700,
            color: '#FFDD00',
            textAlign: 'center',
            lineHeight: 1.5,
            maxWidth: 960,
            marginBottom: 18,
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          }}
        >
          {note}
        </div>
      )}
      <div
        style={{
          fontFamily: FONT,
          fontSize: 36,
          fontWeight: 800,
          color: '#FFFFFF',
          textShadow: '0 2px 10px rgba(0,0,0,0.8)',
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const Template3InfoCard: React.FC<{ data?: TemplateData }> = ({ data = BLANK_TEMPLATE }) => {
  const frame = useCurrentFrame();
  const items = data.groups[0]?.items || [];
  const n = items.length;

  // 胶囊区：标题区下方 → 底部备注上方，条高按可用高度动态计算，撑满区域不空旷
  const areaTop = 380;
  const areaBottom = data.footerNote ? 300 : 220;
  const availH = HEIGHT - areaTop - areaBottom;
  const baseGap = 26;
  let rowH = n > 0 ? Math.floor((availH - baseGap * (n - 1)) / n) : 0;
  rowH = Math.max(118, Math.min(196, rowH));
  // 条数过多时防纵向溢出：回退为按剩余空间压缩
  if (n > 0 && n * rowH + baseGap * (n - 1) > availH) {
    rowH = Math.max(90, Math.floor((availH - baseGap * (n - 1)) / n));
  }
  const used = n * rowH + baseGap * (n - 1);
  // 条数少时条高封顶，剩余空间加到间距（上限 48），整体仍垂直居中
  const gap = n > 1 ? Math.min(48, baseGap + Math.floor(Math.max(0, availH - used) / (n - 1))) : 0;
  void WIDTH;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${BG_TOP} 0%, ${BG_MID} 50%, ${BG_BOTTOM} 100%)`,
        overflow: 'hidden',
      }}
    >
      {NEBULAS.map((n, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: n.x,
            top: n.y,
            width: n.w,
            height: n.h,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, ${n.color} 0%, transparent 70%)`,
            filter: 'blur(40px)',
            zIndex: 0,
          }}
        />
      ))}
      <StarField frame={frame} />
      <TitleHeader title={data.mainTitle} subtitle={data.subtitle} frame={frame} />
      <div
        style={{
          position: 'absolute',
          top: areaTop,
          left: 0,
          right: 0,
          height: availH,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap,
          zIndex: 5,
        }}
      >
        {items.map((it, i) => (
          <BubbleRow key={i} text={it.name} frame={frame} index={i} height={rowH} />
        ))}
      </div>
      <BottomGuide note={data.footerNote} text={data.footer} frame={frame} />
    </AbsoluteFill>
  );
};
