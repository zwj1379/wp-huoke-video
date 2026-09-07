import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { BLANK_TEMPLATE, TemplateData } from '../templateData';

/**
 * ============================================================
 * 模板4 · 红色放射补贴版
 * ============================================================
 * 对标视频：复刻视频3
 * 风格：红色放射状背景 + 金色飘落碎屑 + 黄底黑边标题
 *       白色圆角卡片 + 黑色下划线标题 + 白色描边要点
 * ============================================================
 */

const FONT = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';

const RAY_COLOR_DARK = '#B93920';
const RAY_COLOR_LIGHT = '#D94E32';

const CONFETTI = Array.from({ length: 40 }, (_, i) => ({
  x: Math.random() * 1080,
  y: Math.random() * 1920,
  size: 4 + Math.random() * 7,
  delay: Math.random() * 60,
  speedY: 0.8 + Math.random() * 1.2,
  color: Math.random() > 0.5 ? '#FFD700' : '#FFFFFF',
}));

const Sunburst: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: -200,
      left: -200,
      right: -200,
      bottom: -200,
      background: [
        `repeating-conic-gradient(from 0deg at 50% 42%,`,
        `${RAY_COLOR_LIGHT} 0deg 7deg,`,
        `${RAY_COLOR_DARK} 7deg 14deg`,
        `)`,
      ].join(' '),
      zIndex: 0,
    }}
  />
);

const Confetti: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    {CONFETTI.map((c, i) => {
      const y = (c.y + (frame * c.speedY)) % 2120 - 100;
      const sway = Math.sin((frame + c.delay) / 12) * 12;
      const rotate = (frame + c.delay) % 360;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: c.x + sway,
            top: y,
            width: c.size,
            height: c.size,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            background: c.color,
            opacity: 0.85,
            transform: `rotate(${rotate}deg)`,
            zIndex: 1,
          }}
        />
      );
    })}
  </>
);

const TitleHeader: React.FC<{ title: string; frame: number }> = ({ title, frame }) => {
  const scale = interpolate(frame, [0, 10], [1.06, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fontSize = title.length > 16 ? 58 : 66;
  return (
    <div
      style={{
        position: 'absolute',
        top: 240,
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
          fontSize,
          fontWeight: 900,
          color: '#FFD600',
          textAlign: 'center',
          lineHeight: 1.25,
          whiteSpace: 'pre-line',
          WebkitTextStroke: '2px #000000',
          textShadow: [
            '0 4px 0 rgba(0,0,0,0.35)',
            '0 6px 14px rgba(0,0,0,0.45)',
          ].join(','),
        }}
      >
        {title}
      </div>
        <div
        style={{
          marginTop: 6,
          width: 780,
          height: 5,
          background: '#FFD600',
          borderRadius: 3,
          boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
        }}
      />
    </div>
  );
};

const StrokeText: React.FC<{ children: React.ReactNode; fontSize: number; weight?: number; align?: 'left' | 'center' }> = ({
  children,
  fontSize,
  weight = 800,
  align = 'left',
}) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize,
      fontWeight: weight,
      color: '#FFFFFF',
      lineHeight: 1.35,
      textAlign: align,
      textShadow: [
        '-1px -1px 0 #000',
        '1px -1px 0 #000',
        '-1px 1px 0 #000',
        '1px 1px 0 #000',
        '2px 2px 4px rgba(0,0,0,0.5)',
      ].join(','),
    }}
  >
    {children}
  </div>
);

const InfoCard: React.FC<{
  group: { title?: string; items: { name: string; value?: string }[] };
  frame: number;
  index: number;
}> = ({ group, frame, index }) => {
  const delay = index * 3;
  const ty = interpolate(frame + delay, [0, 10], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = 1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '22px 34px',
          background: '#FFFFFF',
          borderRadius: 24,
          transform: `translateY(${ty}px)`,
          opacity,
          boxShadow: '0 14px 36px rgba(0,0,0,0.35)',
        }}
      >
        {group.title && (
          <div
            style={{
              fontFamily: FONT,
              fontSize: 46,
              fontWeight: 900,
              color: '#111',
              textDecoration: 'underline',
              textDecorationThickness: 3,
              textUnderlineOffset: 6,
              lineHeight: 1.3,
              textAlign: 'center',
            }}
          >
            {group.title}
          </div>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          padding: '0 10px',
          transform: `translateY(${ty}px)`,
        }}
      >
        {group.items.map((it, i) => (
          <BulletRow key={i} text={it.name} index={i} />
        ))}
      </div>
    </div>
  );
};

const BulletRow: React.FC<{ text: string; index: number }> = ({ text, index }) => {
  const isNumbered = /^\d+\s*[、,.]/.test(text);
  const prefix = isNumbered ? text.match(/^\d+\s*[、,.]/)?.[0] || '' : '';
  const body = isNumbered ? text.replace(/^\d+\s*[、,.]/, '') : text;
  const fontSize = text.length > 45 ? 34 : 38;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        fontFamily: FONT,
        fontSize,
        fontWeight: 800,
        lineHeight: 1.45,
      }}
    >
      {isNumbered ? (
        <span style={{ color: '#FFD600', textShadow: '0 1px 3px rgba(0,0,0,0.6)', flexShrink: 0 }}>{prefix}</span>
      ) : (
        <span
          style={{
            width: 12,
            height: 12,
            marginTop: 14,
            borderRadius: '50%',
            background: '#FFD600',
            flexShrink: 0,
            boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
          }}
        />
      )}
      <span style={{ color: '#FFFFFF', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>{body}</span>
    </div>
  );
};

const Footer: React.FC<{ text: string; frame: number }> = ({ text, frame }) => {
  const pulse = 0.85 + 0.15 * Math.sin(frame / 7);
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: 10,
        opacity: pulse,
      }}
    >
      <StrokeText fontSize={text.length > 30 ? 32 : 36} weight={800} align="center">
        {text}
      </StrokeText>
    </div>
  );
};

export const Template4InfoCard: React.FC<{ data?: TemplateData }> = ({ data = BLANK_TEMPLATE }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: RAY_COLOR_DARK }}>
      <Sunburst />
      <Confetti frame={frame} />
      <TitleHeader title={data.mainTitle} frame={frame} />
      <div
        style={{
          position: 'absolute',
          top: 430,
          left: 70,
          right: 70,
          bottom: data.footerNote ? 150 : 120,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: 28,
          zIndex: 5,
        }}
      >
        {data.groups.map((g, i) => (
          <InfoCard key={i} group={g} frame={frame} index={i} />
        ))}
        {data.footerNote && (
          <div
            style={{
              fontFamily: FONT,
              fontSize: data.footerNote.length > 50 ? 32 : 36,
              fontWeight: 800,
              color: '#FFD600',
              lineHeight: 1.45,
              textAlign: 'center',
              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
            }}
          >
            {data.footerNote}
          </div>
        )}
      </div>
      <Footer text={data.footer} frame={frame} />
    </AbsoluteFill>
  );
};
