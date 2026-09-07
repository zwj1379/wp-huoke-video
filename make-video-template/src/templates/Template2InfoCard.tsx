import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { BLANK_TEMPLATE, TemplateData } from '../templateData';

/**
 * ============================================================
 * 模板2 · 星空黄卡版
 * ============================================================
 * 对标视频：复刻视频1
 * 风格：深蓝星空渐变 + 黄色标题胶囊 + 波浪边白色信息卡 + 黑红键值对
 * 结构：主标题（黄底黑字）→ 副标题（白字）→ 波浪卡片区 → 底部引导（打字光标）
 * ============================================================
 */

const FONT = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';

const BG_TOP = '#091635';
const BG_MID = '#113A66';
const BG_BOTTOM = '#196C8C';
const TITLE_YELLOW = '#FFD600';
const VALUE_RED = '#E02020';

// 随机星星
const STARS = Array.from({ length: 60 }, (_, i) => ({
  x: Math.random() * 1080,
  y: Math.random() * 1920,
  size: 1 + Math.random() * 2.5,
  delay: Math.random() * 60,
  speed: 0.5 + Math.random() * 0.8,
}));

const StarField: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    {STARS.map((s, i) => {
      const twinkle = 0.5 + 0.5 * Math.sin((frame + s.delay) / (10 + s.speed * 10));
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
            boxShadow: `0 0 ${s.size * 2}px rgba(255,255,255,${twinkle * 0.8})`,
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
  const scale = interpolate(frame, [0, 10], [1.06, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleFont = title.length > 16 ? 62 : title.length > 10 ? 70 : 78;
  const subFont = subtitle.length > 30 ? 34 : 38;
  return (
    <div
      style={{
        position: 'absolute',
        top: 160,
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
          background: TITLE_YELLOW,
          borderRadius: 28,
          padding: '22px 48px',
          textAlign: 'center',
          boxShadow: '0 16px 42px rgba(0,0,0,0.45)',
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: titleFont,
            fontWeight: 900,
            color: '#111',
            lineHeight: 1.2,
            whiteSpace: 'pre-line',
            textShadow: '0 2px 0 rgba(255,255,255,0.4)',
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          marginTop: 28,
          fontFamily: FONT,
          fontSize: subFont,
          fontWeight: 700,
          color: '#FFFFFF',
          lineHeight: 1.5,
          textAlign: 'center',
          whiteSpace: 'pre-line',
          textShadow: '0 2px 8px rgba(0,0,0,0.6)',
          maxWidth: 960,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

const CloudEdge: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  // 用一串白色圆点沿卡片四边模拟波浪/花边边框
  const dots: { x: number; y: number; s: number }[] = [];
  const pad = 14;
  const step = 28;
  for (let x = pad; x <= width - pad; x += step) {
    dots.push({ x, y: pad, s: 12 });
    dots.push({ x: width - x, y: height - pad, s: 12 });
  }
  for (let y = pad; y <= height - pad; y += step) {
    dots.push({ x: pad, y, s: 12 });
    dots.push({ x: width - pad, y: height - y, s: 12 });
  }
  // 四角加大圆点盖住
  const corners = [
    { x: pad, y: pad, s: 22 },
    { x: width - pad, y: pad, s: 22 },
    { x: pad, y: height - pad, s: 22 },
    { x: width - pad, y: height - pad, s: 22 },
  ];
  return (
    <svg width={width} height={height} style={{ position: 'absolute', pointerEvents: 'none', zIndex: 2 }}>
      <defs>
        <filter id="cloudShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="rgba(0,0,0,0.25)" />
        </filter>
      </defs>
      <rect x="20" y="20" width={width - 40} height={height - 40} rx="28" fill="#FDFBF5" filter="url(#cloudShadow)" />
      {[...dots, ...corners].map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.s / 2} fill="#FDFBF5" />
      ))}
    </svg>
  );
};

const CardContent: React.FC<{ data: TemplateData; frame: number }> = ({ data, frame }) => {
  const enter = interpolate(frame, [0, 10], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale = interpolate(frame, [0, 10], [0.97, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const groups = data.groups.filter((g) => g.items && g.items.length);
  const allRows = groups.flatMap((g) => g.items);
  const hasValue = allRows.some((it) => it.value);
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: '52px 56px 46px',
        transform: `translateY(${enter}px) scale(${scale})`,
        zIndex: 3,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {groups.map((group, gi) => (
        <div key={gi} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {group.title && (
            <div
              style={{
                fontFamily: FONT,
                fontSize: 48,
                fontWeight: 800,
                color: '#111',
                marginBottom: 6,
              }}
            >
              {group.title}
            </div>
          )}
          {group.items.map((it, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px dashed rgba(0,0,0,0.12)',
                paddingBottom: 6,
              }}
            >
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 48,
                  fontWeight: 800,
                  color: '#111',
                  lineHeight: 1.3,
                }}
              >
                {it.name}
              </span>
              {hasValue && (
                <span
                  style={{
                    fontFamily: FONT,
                    fontSize: 50,
                    fontWeight: 900,
                    color: VALUE_RED,
                    whiteSpace: 'nowrap',
                    paddingLeft: 16,
                    textShadow: '0 1px 0 rgba(0,0,0,0.1)',
                  }}
                >
                  {it.value}
                </span>
              )}
            </div>
          ))}
          {gi < groups.length - 1 && <div style={{ height: 12 }} />}
        </div>
      ))}
    </div>
  );
};

const BottomGuide: React.FC<{ text: string; frame: number }> = ({ text, frame }) => {
  const showCursor = Math.floor(frame / 15) % 2 === 0;
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 64,
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: 10,
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontSize: 52,
          fontWeight: 800,
          color: '#FFFFFF',
          textShadow: '0 2px 8px rgba(0,0,0,0.6)',
        }}
      >
        {text}
      </span>
      <span
        style={{
          display: 'inline-block',
          width: 6,
          height: 40,
          background: '#fff',
          marginLeft: 8,
          verticalAlign: 'middle',
          opacity: showCursor ? 1 : 0,
        }}
      />
    </div>
  );
};

export const Template2InfoCard: React.FC<{ data?: TemplateData }> = ({ data = BLANK_TEMPLATE }) => {
  const frame = useCurrentFrame();
  const cardW = 960;
  const cardH = 840;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${BG_TOP} 0%, ${BG_MID} 45%, ${BG_BOTTOM} 100%)`,
        overflow: 'hidden',
      }}
    >
      <StarField frame={frame} />
      <TitleHeader title={data.mainTitle} subtitle={data.subtitle} frame={frame} />
      <div
        style={{
          position: 'absolute',
          top: 560,
          left: (1080 - cardW) / 2,
          width: cardW,
          height: cardH,
        }}
      >
        <CloudEdge width={cardW} height={cardH} />
        <CardContent data={data} frame={frame} />
      </div>
      <BottomGuide text={data.footer} frame={frame} />
    </AbsoluteFill>
  );
};
