import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { BLANK_TEMPLATE, TemplateData } from '../templateData';

/**
 * ============================================================
 * 模板1 · 信息卡片版（深色科技商务风）【已封版，勿改】
 * ============================================================
 * 新模板请复制本文件为 TemplateN_XXX.tsx 后再修改，
 * 并到 templates/registry.ts 注册。封版模板不再修改样式。
 *
 * 深色科技商务风 · 数据驱动信息图短视频
 * 结构：深蓝渐变 + 科技网格 + 发光粒子 + 底部光晕
 *      + 浮雕主标题（白→浅蓝灰字面渐变 + 深蓝挤出厚度 + 青色窄带循环扫光）
 *      + 金色胶囊副标题
 *      + 白色信息卡片 N 张（2~5 组自适应高度，快速归位）
 *      + 底部弧形引导文字（循环律动）
 * 用法：<Template1InfoCard data={你的数据} />
 * 不传 data 时渲染 BLANK_TEMPLATE（空白模板预览）。
 * ============================================================
 */

// ---- 调色板（深色科技商务风）----
const BG_TOP = '#081226';
const BG_MID = '#0D2A55';
const BG_BOTTOM = '#0A1E3E';
const TITLE_YELLOW = '#FFD100';
const TITLE_OUTLINE = '#2F80ED'; // 主标题蓝色描边
const PILL_TEXT = '#0E53A7';
const CARD_TITLE = '#0E53A7';
const GLOW_CYAN = 'rgba(84,216,255,0.85)';

const FONT = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';

// ---- 布局常量 ----
const CARD_LEFT_PAD = 70; // 卡片左右留白
const CARD_TOP = 500; // 卡片区顶部（标题区下方）
const CARD_BOTTOM = 1642; // 卡片区底部（底部引导上方）
const CARD_GAP = 22; // 卡片间距

// ---- 科技发光粒子 ----
const PARTICLES = [
  { x: 120, y: 110, s: 5, color: '#54D8FF', delay: 0 },
  { x: 300, y: 240, s: 3, color: '#8FE8FF', delay: 3 },
  { x: 480, y: 90, s: 6, color: '#54D8FF', delay: 7 },
  { x: 700, y: 200, s: 3, color: '#FFFFFF', delay: 11 },
  { x: 900, y: 120, s: 5, color: '#54D8FF', delay: 15 },
  { x: 1020, y: 260, s: 3, color: '#8FE8FF', delay: 19 },
  { x: 160, y: 420, s: 3, color: '#FFFFFF', delay: 23 },
  { x: 850, y: 430, s: 4, color: '#54D8FF', delay: 27 },
  { x: 620, y: 360, s: 3, color: '#8FE8FF', delay: 31 },
  { x: 380, y: 150, s: 4, color: '#FFFFFF', delay: 35 },
];

const Particle: React.FC<{ x: number; y: number; s: number; color: string; frame: number; delay: number }> = ({
  x,
  y,
  s,
  color,
  frame,
  delay,
}) => {
  const float = Math.sin((frame + delay * 5) / 18) * 0.35;
  const glow = 0.6 + 0.4 * Math.sin((frame + delay * 3) / 14);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: s * 2.6,
        height: s * 2.6,
        transform: `translateY(${float * 14}px)`,
        zIndex: 2,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: s * 2.6,
          height: s * 2.6,
          transform: 'translate(-50%,-50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity: glow * 0.85,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: s,
          height: s,
          transform: 'translate(-50%,-50%)',
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 ${s * 3}px ${color}`,
        }}
      />
    </div>
  );
};

// ---- 底部科技光晕 ----
const BottomGlow: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = 0.75 + 0.25 * Math.sin(frame / 20);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: -100,
          right: -100,
          bottom: -220,
          height: 560,
          background:
            'radial-gradient(ellipse 55% 100% at 50% 100%, rgba(38,118,224,0.55) 0%, rgba(20,70,150,0.22) 45%, transparent 75%)',
          opacity: pulse,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 90,
          height: 160,
          background:
            'linear-gradient(180deg, transparent 0%, rgba(84,216,255,0.14) 45%, rgba(84,216,255,0.28) 100%)',
        }}
      />
    </>
  );
};

// ---- 标题区（首帧完整，轻微缩放 + 循环扫光）----
const TitleHeader: React.FC<{ title: string; subtitle: string; frame: number }> = ({ title, subtitle, frame }) => {
  const titleScale = interpolate(frame, [0, 10], [1.05, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pillScale = interpolate(frame, [0, 10], [1.08, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // 标题字号按长度自适应（更保守，避免描边+间距超出 1080）
  const titleFont = title.length > 12 ? 70 : title.length > 8 ? 78 : 96;
  // 浮雕挤出厚度随字号缩放（96px→7px / 78px→5px / 70px→5px）
  const depth = Math.max(4, Math.round(titleFont * 0.07));
  // 副标题字号按长度自适应
  const subFont = subtitle.length > 12 ? 32 : 40;
  // 简单循环往返扫光：窄高光带，仅扫过瞬间提亮
  const bgPos = 100 + 100 * Math.sin(frame / 14);

  return (
    <div
      style={{
        position: 'absolute',
        top: 210,
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ position: 'relative', transform: `scale(${titleScale})` }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: titleFont,
            fontWeight: 900,
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
            // 文字主体浮雕：字面斜面渐变（上亮下暗），笔画本身像立起的实体
            backgroundImage:
              'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 30%, #F0F6FE 55%, #D9E7F8 75%, #BCCFEC 92%, #93B2D9 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            textShadow: [
              // 顶部受光棱线（浮雕高光边）
              `-1px -1px 0 rgba(255,255,255,0.95)`,
              // 底部逐层挤出深蓝厚度（字主体的立体深度）
              ...Array.from({ length: depth }, (_, i) => `0 ${i + 1}px 0 #123A6B`),
              // 柔和落影
              `0 ${depth + 12}px 26px rgba(0,0,0,0.6)`,
            ].join(','),
            // 细蓝线勾边，仅用于收字形轮廓，不参与浮雕
            WebkitTextStroke: `1.5px ${TITLE_OUTLINE}`,
          }}
        >
          {title}
        </div>
        {/* 循环扫光层：青色高光带扫过白色浮雕字 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            fontFamily: FONT,
            fontSize: titleFont,
            fontWeight: 900,
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
            backgroundImage:
              'linear-gradient(105deg, transparent 40%, rgba(84,216,255,0.8) 50%, transparent 60%)',
            backgroundSize: '250% 100%',
            backgroundPosition: `${bgPos}% 0`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            pointerEvents: 'none',
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          marginTop: 36,
          background: TITLE_YELLOW,
          borderRadius: 60,
          padding: `14px ${subtitle.length > 12 ? 34 : 46}px`,
          fontFamily: FONT,
          fontSize: subFont,
          fontWeight: 800,
          color: PILL_TEXT,
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
          transform: `scale(${pillScale})`,
          boxShadow: '0 10px 26px rgba(0,0,0,0.42), 0 0 24px rgba(255,209,0,0.25)',
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

// ---- 白色信息卡片（自适应高度，快速归位）----
const Card: React.FC<{
  title: string;
  note?: string;
  items: { name: string; value?: string }[];
  height: number;
  frame: number;
  index: number;
}> = ({ title, note, items, height, frame, index }) => {
  // 错峰归位
  const stagger = (2 - index) * 3;
  const enter = frame + stagger;
  const ty = interpolate(enter, [0, 10], [26, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(enter, [0, 10], [0.97, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 内容区高度：卡片高 - 上下 padding
  const innerH = height - 40;
  // 标题行固定占用
  const headerH = 48;
  const itemGap = 10;
  // 条目字号自适应（保证放得下）
  let font = 46;
  const lines = items.length;
  while (font > 22 && lines * font * 1.3 + (lines - 1) * itemGap + headerH > innerH) {
    font -= 2;
  }
  const titleFont = font >= 34 ? 34 : 30;
  const hasValue = items.some((it) => it.value);

  return (
    <div
      style={{
        width: '100%',
        height,
        boxSizing: 'border-box',
        padding: `0 ${CARD_LEFT_PAD}px`,
        transform: `translateY(${ty}px) scale(${scale})`,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          background: 'rgba(255,255,255,0.97)',
          borderRadius: 28,
          padding: '20px 34px',
          boxShadow: '0 18px 44px rgba(0,0,0,0.50), inset 0 0 0 2px rgba(255,255,255,0.9)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 标题行 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 12, flexShrink: 0 }}>
          <div
            style={{
              background: TITLE_YELLOW,
              borderRadius: 14,
              padding: '6px 16px',
              fontFamily: FONT,
              fontSize: titleFont,
              fontWeight: 800,
              color: PILL_TEXT,
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
          {note && (
            <div style={{ fontFamily: FONT, fontSize: 24, color: '#444', fontWeight: 700 }}>（{note}）</div>
          )}
        </div>

        {/* 条目列表 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: itemGap,
            justifyContent: 'center',
            flex: 1,
            minHeight: 0,
          }}
        >
          {items.map((it, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '2px solid rgba(14,83,167,0.10)',
                paddingBottom: 4,
              }}
            >
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: font,
                  fontWeight: 700,
                  color: CARD_TITLE,
                  letterSpacing: '0.01em',
                  lineHeight: 1.25,
                }}
              >
                {it.name}
              </span>
              {hasValue && (
                <span
                  style={{
                    fontFamily: FONT,
                    fontSize: font,
                    fontWeight: 900,
                    color: CARD_TITLE,
                    whiteSpace: 'nowrap',
                    paddingLeft: 16,
                  }}
                >
                  {it.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---- 底部弧形引导文字（首帧可见 + 循环律动）----
const BottomArc: React.FC<{ text: string; frame: number }> = ({ text, frame }) => {
  const enterTy = interpolate(frame, [0, 8], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bounce = Math.sin(frame / 8);
  const ty = enterTy + bounce * 5;
  const pulse = 1 + bounce * 0.025;
  const glowA = 0.82 + 0.18 * Math.sin(frame / 8 + 1.2);
  const fontSize = text.length > 12 ? 44 : 52;
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        transform: `translateY(${ty}px) scale(${pulse})`,
        opacity: glowA,
        zIndex: 20,
        pointerEvents: 'none',
      }}
    >
      <svg width="1080" height="180" viewBox="0 0 1080 180" style={{ display: 'block', margin: '0 auto' }}>
        <defs>
          <path id="arcPathTpl" d="M 200 160 Q 540 -30 880 160" fill="transparent" />
        </defs>
        <text
          fontFamily={FONT}
          fontSize={fontSize}
          fontWeight="800"
          fill="#FFFFFF"
          style={{
            paintOrder: 'stroke',
            stroke: 'rgba(10,30,62,0.9)',
            strokeWidth: 14,
            filter: 'drop-shadow(0 0 16px rgba(84,216,255,0.75))',
          }}
        >
          <textPath href="#arcPathTpl" startOffset="50%" textAnchor="middle">
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

// ---- 主场景（数据驱动）----
export const Template1InfoCard: React.FC<{ data?: TemplateData }> = ({ data = BLANK_TEMPLATE }) => {
  const frame = useCurrentFrame();
  const groups = data.groups;
  const n = groups.length;
  const totalH = CARD_BOTTOM - CARD_TOP;
  const cardH = (totalH - (n - 1) * CARD_GAP) / n;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${BG_TOP} 0%, ${BG_MID} 55%, ${BG_BOTTOM} 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* 科技网格线 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'linear-gradient(rgba(80,160,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(80,160,255,0.07) 1px, transparent 1px)',
          backgroundSize: '90px 90px',
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.35) 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.35) 70%, transparent 100%)',
        }}
      />

      {/* 顶部蓝色光带 */}
      <div
        style={{
          position: 'absolute',
          top: -140,
          left: -80,
          right: -80,
          height: 360,
          background:
            'radial-gradient(ellipse 45% 90% at 50% 100%, rgba(58,150,255,0.35) 0%, transparent 70%)',
        }}
      />

      {/* 发光粒子 */}
      {PARTICLES.map((p, i) => (
        <Particle key={i} {...p} frame={frame} />
      ))}

      {/* 底部光晕 */}
      <BottomGlow frame={frame} />

      {/* 标题 */}
      <TitleHeader title={data.mainTitle} subtitle={data.subtitle} frame={frame} />

      {/* 卡片区（自适应） */}
      <div style={{ position: 'absolute', top: CARD_TOP, left: 0, right: 0, zIndex: 8 }}>
        {groups.map((g, i) => (
          <div
            key={i}
            style={{
              height: cardH,
              marginBottom: i < n - 1 ? CARD_GAP : 0,
              boxSizing: 'border-box',
            }}
          >
            <Card
              title={g.title}
              note={g.note}
              items={g.items}
              height={cardH}
              frame={frame}
              index={i}
            />
          </div>
        ))}
      </div>

      {/* 底部弧形引导 */}
      <BottomArc text={data.footer} frame={frame} />
    </AbsoluteFill>
  );
};
