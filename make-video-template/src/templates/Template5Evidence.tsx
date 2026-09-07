import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';

const FONT = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';

/**
 * ============================================================
 * 模板5 · 证据型信息图（对标视频逐帧复刻 · 1080×1920）
 * ============================================================
 * 版面（对标 720×1280 实测 ×1.5）：
 *   ① 白卡片主标题：红字 + 白描边 + 深投影（top≈140）
 *   ② 副标题：橙红字 + 白描边，无背景一行（top≈335）
 *   ③ 证据区：满宽贴边白底回单占位（top≈405 高≈410）
 *      ├ 多行明细 + 红框标关键行 + 红色箭头
 *      ├ 橙色「收到补贴截图」横标 + 大红圆章 + 👇
 *   ④ 过渡语：白字深描边（top≈872）
 *   ⑤ 亮黄攻略区：标题行「补贴攻略：」+ 蓝字编号条款（top≈945）
 *   ⑥ CTA：白字蓝描边，无胶囊（top≈1390）
 * ============================================================
 */

export interface Template5Data {
  /** ① 主标题（白卡片内红字） */
  mainTitle: string;
  /** ② 副标题（橙红字白描边，一行） */
  subtitle: string;
  /** ④ 过渡语（白字描边，一行） */
  transitionText?: string;
  /** ⑤ 攻略区标题行 */
  guideHeading?: string;
  /** ⑤ 攻略条款（自动加 1、2、编号） */
  guideSteps: string[];
  /** ⑥ CTA 文案 */
  footer: string;
  /** 证据占位：入账金额 */
  evidenceAmount?: string;
  /** 证据占位：交易摘要（红框标出） */
  evidenceSummary?: string;
  /** 证据图片（单张，等价于 evidenceImages 长度1；兼容旧用法） */
  evidenceImage?: string;
  /**
   * 证据图片组（多图轮换，对标参考视频：每张停留 slot 帧后卷角切换）
   * 时长基准：模板5 视频总长 237 帧（7.9s @30fps），slot = 237 / n
   */
  evidenceImages?: string[];
}

/** 模板5 视频总帧数（与 template5.m4a 时长对齐） */
export const T5_VIDEO_FRAMES = 237;
/** 图片切换动画时长：0.5s = 15 帧 */
const T5_TRANSITION = 15;

export const TEMPLATE5_SAMPLE: Template5Data = {
  mainTitle: '老板笑了·员工也笑了',
  subtitle: '公司有24/25/26届大学生补62000元/人',
  transitionText: '老板得到了补贴，员工得到了工作经验，一举两得',
  guideHeading: '补贴攻略：',
  guideSteps: [
    '试用期签见习合同3-12个月，无需买五险，补2500元/月给公司，3万封顶',
    '过完试用期开始买五险，补贴1200元/月给公司，3.2万封顶',
  ],
  footer: '留言"1" 发申请资料',
  evidenceAmount: 'CNY13,373.50',
  evidenceSummary: '小微企业高校毕业生社保补贴',
};

/** 红色箭头（CSS 画：杆 + 三角头），指向关键行 */
const RedArrow: React.FC<{
  x: number; y: number; len: number; angle: number;
}> = ({ x, y, len, angle }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: len,
      height: 0,
      borderTop: '8px solid #E02015',
      transform: `rotate(${angle}deg)`,
      transformOrigin: 'left center',
    }}
  >
    <div
      style={{
        position: 'absolute',
        right: -16,
        top: -14,
        width: 0,
        height: 0,
        borderTop: '10px solid transparent',
        borderBottom: '10px solid transparent',
        borderLeft: '20px solid #E02015',
      }}
    />
  </div>
);

/**
 * 满宽银行回单占位（第一版，后续替换为真实截图）
 * 结构仿招商银行入账回单：居中标题 + 明细行 + 红框标关键行 + 大红圆章
 */
const EvidencePlaceholder: React.FC<{ amount?: string; summary?: string }> = ({
  amount = 'CNY13,373.50',
  summary = '小微企业高校毕业生社保补贴',
}) => {
  const redBox = {
    border: '5px solid #E02015',
    borderRadius: 6,
    padding: '1px 7px',
  };
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 458,
        background: '#FFFFFF',
        fontFamily: FONT,
        padding: '16px 48px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* 回单头：入账回单 + 银行名 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ width: 150 }} />
        <div style={{ fontSize: 36, fontWeight: 800, color: '#222', letterSpacing: 12 }}>
          入 账 回 单
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, color: '#C0392B', width: 150, textAlign: 'right' }}>
          招商银行
        </div>
      </div>

      {/* 明细行（左列）：行距放宽、字号加大，避免拥挤 */}
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 13 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 27, fontWeight: 700, color: '#222', ...redBox }}>交易日期: 2026年04月08日</span>
        </div>
        <div style={{ fontSize: 26, color: '#333' }}>业务种类: 汇入汇款　　交易流水号: C0447E1001E2VAZ</div>
        <div style={{ fontSize: 26, color: '#333' }}>收款账号: 641017E1000007014302　　收款户名: ××有限公司</div>
        <div style={{ fontSize: 26, color: '#333' }}>收款开户行: 招商银行××松裕支行</div>
        <div style={{ fontSize: 26, color: '#333' }}>付款户名: ××股份有限公司　　付款行名: ××中心</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 27, fontWeight: 700, color: '#222', ...redBox }}>交易金额(小写): {amount}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 27, fontWeight: 700, color: '#222', ...redBox }}>交易摘要: {summary}</span>
        </div>
      </div>

      {/* 红色箭头：一个指向交易日期框，一个指向金额行（仿对标的标注位） */}
      <RedArrow x={22} y={88} len={110} angle={16} />
      <RedArrow x={22} y={372} len={92} angle={-8} />

      {/* 大红圆章 */}
      <div
        style={{
          position: 'absolute',
          top: 120,
          right: 60,
          width: 170,
          height: 170,
          borderRadius: '50%',
          border: '6px solid rgba(210,35,30,0.75)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'rotate(-10deg)',
          color: 'rgba(210,35,30,0.85)',
          fontWeight: 900,
        }}
      >
        <div style={{ fontSize: 22 }}>招商银行股份有限公司</div>
        <div
          style={{
            marginTop: 6,
            fontSize: 26,
            border: '3px solid rgba(210,35,30,0.75)',
            borderRadius: 6,
            padding: '2px 10px',
          }}
        >
          24E28CC6
        </div>
        <div style={{ marginTop: 6, fontSize: 22 }}>电子回单专用章</div>
      </div>

      {/* 橙色「收到补贴截图」横标 */}
      <div
        style={{
          position: 'absolute',
          top: 188,
          left: 320,
          background: 'linear-gradient(180deg,#F59B23,#EE7D12)',
          color: '#FFF3C2',
          fontSize: 40,
          fontWeight: 900,
          padding: '12px 34px',
          borderRadius: 10,
          boxShadow: '0 6px 16px rgba(150,70,0,0.35)',
          letterSpacing: 3,
          whiteSpace: 'nowrap',
        }}
      >
        收到补贴截图
      </div>

      {/* 手指：贴右下角，避开金额红框 */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 700,
          fontSize: 84,
          transform: 'rotate(-6deg)',
        }}
      >
        👇
      </div>
    </div>
  );
};

/**
 * 多图轮换证据区（对标参考视频逐帧复刻）：
 * - 每张图停留 slot = 237/n 帧，最后一张停到结尾
 * - 切换动画 15 帧（0.5s）：旧图带透视旋转"翻走"，新图卷角姿态飞入落平
 *   （CSS 3D 近似：rotateX/rotateY + 角部阴影渐变模拟纸面卷角）
 * - 固定 👇 手指贴纸钉在左下角（参考视频全程有）
 */
const EvidenceImageRotator: React.FC<{ images: string[] }> = ({ images }) => {
  const frame = useCurrentFrame();
  const n = images.length;
  const slot = T5_VIDEO_FRAMES / n;
  const idx = Math.min(Math.floor(frame / slot), n - 1);
  const local = frame - idx * slot;
  // 切换进度：0→1（easeOutCubic，先快后缓）
  const t = idx > 0 && local < T5_TRANSITION ? local / T5_TRANSITION : 1;
  const ease = 1 - Math.pow(1 - t, 3);
  const containStyle: React.CSSProperties = {
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
  };
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 458,
        background: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      {/* 旧图：透视旋转翻走 + 淡出 */}
      {idx > 0 && t < 1 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `perspective(1400px) rotateY(${18 * ease}deg) rotateX(${-12 * ease}deg) scale(${1 - 0.06 * ease})`,
            opacity: 1 - ease,
          }}
        >
          <Img src={staticFile(images[idx - 1])} style={containStyle} />
        </div>
      ) : null}

      {/* 新图：卷角飞入落平（右下角翘起 → 摊平） */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform:
            idx > 0 && t < 1
              ? `perspective(1400px) rotateY(${-24 * (1 - ease)}deg) rotateX(${16 * (1 - ease)}deg) scale(${0.88 + 0.12 * ease}) translateY(${(1 - ease) * 26}px)`
              : 'none',
          boxShadow:
            idx > 0 && t < 1
              ? `0 ${(1 - ease) * 22}px ${(1 - ease) * 40}px rgba(0,0,0,${0.3 * (1 - ease)})`
              : 'none',
        }}
      >
        <Img src={staticFile(images[idx])} style={containStyle} />
        {/* 卷角阴影：切换期间右下角有纸面翘起的暗角，随落平消失 */}
        {idx > 0 && t < 1 ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: `linear-gradient(315deg, rgba(0,0,0,${0.3 * (1 - ease)}) 0%, rgba(0,0,0,0) ${18 + 30 * ease}%)`,
            }}
          />
        ) : null}
      </div>

      {/* 固定手指贴纸（参考视频全程钉在图片上） */}
      <div
        style={{
          position: 'absolute',
          bottom: 6,
          left: 46,
          fontSize: 84,
          transform: 'rotate(-6deg)',
          pointerEvents: 'none',
        }}
      >
        👉
      </div>
    </div>
  );
};

/**
 * ⑥ CTA · 弧形文字：白字蓝描边沿上拱弧线排布
 * 动画：以弧底为中心 ±3° 轻摆（出视频时可见，静帧 frame0 为摆正状态）
 */
const ArcCTA: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  // 钟摆式轻摆：周期约 0.93s（28帧），幅度 3°
  const swing = Math.sin((frame / 28) * Math.PI * 2) * 3;
  return (
    <div
      style={{
        position: 'absolute',
        top: 1395,
        left: 0,
        right: 0,
        transform: `rotate(${swing}deg)`,
        transformOrigin: '50% 85%',
      }}
    >
      <svg width={1080} height={260} viewBox="0 0 1080 260">
        <defs>
          {/* 上拱弧线：两端低、中间高 */}
          <path id="ctaArc" d="M 60 225 Q 540 55 1020 225" fill="none" />
        </defs>
        <text
          fontFamily={FONT}
          fontSize={74}
          fontWeight={900}
          fill="#FFFFFF"
          stroke="#1E4E8F"
          strokeWidth={10}
          paintOrder="stroke"
          letterSpacing={8}
        >
          <textPath href="#ctaArc" startOffset="50%" textAnchor="middle">
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export const Template5Evidence: React.FC<{
  data?: Template5Data;
  /** 分区预览：各文案模块用纯色块代替，只看版面结构 */
  layoutPreview?: boolean;
}> = ({ data = TEMPLATE5_SAMPLE, layoutPreview = false }) => {
  const frame = useCurrentFrame();
  // 标题区律动（循环、克制）：
  // 主标题卡片：1.6s 周期呼吸缩放 ±1.5% + 轻微上下浮 ±5px
  const breathe = Math.sin((frame / 48) * Math.PI * 2);
  const titleScale = 1 + breathe * 0.015;
  const titleBob = breathe * -5;
  // 副标题扫光：不再浮动，改为高光条周期性扫过（周期 2.4s = 72帧）
  const shineCycle = 72;
  const shineProgress = ((frame % shineCycle) + shineCycle) % shineCycle / shineCycle;
  // 扫光位置：从左外扫到右外（-60% → 160%）
  const shinePos = `${-60 + shineProgress * 220}% 0%`;
  if (layoutPreview) {
    const zone = (
      bg: string,
      top: number,
      left: number,
      right: number,
      height: number,
      label: string,
    ) => (
      <div
        key={label}
        style={{
          position: 'absolute',
          top,
          left,
          right,
          height,
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 900, color: '#FFFFFF', letterSpacing: 4 }}>
          {label}
        </div>
      </div>
    );
    return (
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg,#9EC7F2 0%,#A6CBF2 60%,#9FC4F0 100%)',
          fontFamily: FONT,
          overflow: 'hidden',
        }}
      >
        {zone('#E53935', 140, 60, 60, 150, '① 主标题')}
        {zone('#FB8C00', 335, 40, 40, 80, '② 副标题')}
        {zone('#43A047', 405, 0, 0, 458, '③ 证据区')}
        {zone('#1E88E5', 882, 30, 30, 70, '④ 过渡语')}
        {zone('#FDD835', 958, 50, 50, 470, '⑤ 攻略区')}
        {zone('#8E24AA', 1395, 0, 0, 260, '⑥ CTA 弧形摆动区')}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg,#9EC7F2 0%,#A6CBF2 60%,#9FC4F0 100%)',
        fontFamily: FONT,
        overflow: 'hidden',
      }}
    >
      {/* ① 白卡片主标题：红字+白描边+深投影 + 循环律动（呼吸缩放+轻浮动） */}
      <div
        style={{
          position: 'absolute',
          top: 140,
          left: 60,
          right: 60,
          transform: `scale(${titleScale}) translateY(${titleBob}px)`,
          transformOrigin: '50% 60%',
          background: '#FDFDFB',
          borderRadius: 30,
          padding: '30px 40px',
          boxShadow: '0 10px 24px rgba(30,60,110,0.28)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            color: '#E01F12',
            letterSpacing: 2,
            whiteSpace: 'nowrap',
            WebkitTextStroke: '5px #FFFFFF',
            paintOrder: 'stroke fill',
            textShadow: '0 6px 0 rgba(90,10,0,0.3), 0 10px 18px rgba(0,0,0,0.25)',
          }}
        >
          {data.mainTitle}
        </div>
      </div>

      {/* ② 副标题：橙红字 + 白描边，无背景；扫光循环（不浮动） */}
      {data.subtitle ? (
        <div
          style={{
            position: 'absolute',
            top: 335,
            left: 40,
            right: 40,
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span
              style={{
                fontSize: 56,
                fontWeight: 900,
                color: '#E8481C',
                WebkitTextStroke: '5px #FFFFFF',
                paintOrder: 'stroke fill',
                textShadow: '0 4px 8px rgba(0,0,0,0.22)',
              }}
            >
              {data.subtitle}
            </span>
            {/* 扫光层：同字形渐变高光裁剪到文字，循环扫过 */}
            <span
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                fontSize: 56,
                fontWeight: 900,
                color: 'transparent',
                WebkitTextFillColor: 'transparent',
                WebkitTextStroke: '5px transparent',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                backgroundImage:
                  'linear-gradient(105deg, rgba(255,255,255,0) 32%, rgba(255,255,255,0.95) 48%, rgba(255,244,214,0.95) 52%, rgba(255,255,255,0) 68%)',
                backgroundSize: '220% 100%',
                backgroundPosition: shinePos,
                backgroundRepeat: 'no-repeat',
                pointerEvents: 'none',
              }}
            >
              {data.subtitle}
            </span>
          </span>
        </div>
      ) : null}

      {/* ③ 证据区：满宽贴边。多图轮换（卷角切换）/ 单图 contain / 无图占位回单 */}
      <div style={{ position: 'absolute', top: 405, left: 0, right: 0, height: 458 }}>
        {(data.evidenceImages && data.evidenceImages.length > 1) ? (
          <EvidenceImageRotator images={data.evidenceImages} />
        ) : (data.evidenceImages && data.evidenceImages.length === 1) || data.evidenceImage ? (
          <div
            style={{
              width: '100%',
              height: 458,
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Img
              src={staticFile(
                data.evidenceImages && data.evidenceImages.length === 1
                  ? data.evidenceImages[0]
                  : (data.evidenceImage as string),
              )}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>
        ) : (
          <EvidencePlaceholder
            amount={data.evidenceAmount}
            summary={data.evidenceSummary}
          />
        )}
      </div>

      {/* ④ 过渡语：白字深描边 */}
      {data.transitionText ? (
        <div
          style={{
            position: 'absolute',
            top: 882,
            left: 30,
            right: 30,
            textAlign: 'center',
            fontSize: Math.min(52, Math.floor(1000 / Math.max(data.transitionText.length, 1))),
            fontWeight: 900,
            color: '#FFFFFF',
            whiteSpace: 'nowrap',
            WebkitTextStroke: '4px #1E4E8F',
            paintOrder: 'stroke fill',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)',
          }}
        >
          {data.transitionText}
        </div>
      ) : null}

      {/* ⑤ 亮黄攻略区：标题行 + 编号条款 */}
      <div
        style={{
          position: 'absolute',
          top: 958,
          left: 50,
          right: 50,
          background: '#F8D808',
          borderRadius: 12,
          padding: '34px 48px',
          boxShadow: '0 10px 24px rgba(110,85,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {data.guideHeading ? (
          <div style={{ fontSize: 54, fontWeight: 900, color: '#1F4FA8', letterSpacing: 2 }}>
            {data.guideHeading}
          </div>
        ) : null}
        {data.guideSteps.map((step, i) => (
          <div
            key={i}
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: '#1F4FA8',
              lineHeight: 1.4,
              letterSpacing: 1.5,
            }}
          >
            {`${i + 1}、${step}`}
          </div>
        ))}
      </div>

      {/* ⑥ CTA：弧形白字蓝描边 + 轻摆动画 */}
      <ArcCTA text={data.footer} />
    </AbsoluteFill>
  );
};
