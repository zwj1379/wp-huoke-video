import React from "react";
import { Composition, Still } from "remotion";
import { Template1InfoCard } from "./templates/Template1InfoCard";
import { Template2InfoCard } from "./templates/Template2InfoCard";
import { Template3InfoCard } from "./templates/Template3InfoCard";
import { Template4InfoCard } from "./templates/Template4InfoCard";
import { Template5Evidence, TEMPLATE5_SAMPLE } from "./templates/Template5Evidence";

import { RECRUIT2026_TEMPLATE, TEMPLATE2_SAMPLE, TEMPLATE3_SAMPLE, TEMPLATE4_SAMPLE, GRADUATE_SUBSIDY_T4_TEMPLATE, GRADUATE_SUBSIDY_T3_TEMPLATE, QYZB_SUBSIDY_T2_TEMPLATE, HUOKE_EXPERIMENT_T2_TEMPLATE, T5_RECRUIT_GRAD_GOLD } from "./templateData";

import { FPS, WIDTH, HEIGHT } from "./config";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 模板1 · 深色科技信息卡片版（空白模板预览；新模板见 src/templates/registry.ts） */}
      <Composition
        id="InfoTemplateVideo"
        component={Template1InfoCard}
        durationInFrames={279}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Still id="InfoTemplateCover" component={Template1InfoCard} width={WIDTH} height={HEIGHT} />

      {/* 2026 企业招用毕业生补贴（模板1） */}
      <Composition
        id="Recruit2026Video"
        component={Template1InfoCard}
        durationInFrames={279}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ data: RECRUIT2026_TEMPLATE }}
      />
      <Still
        id="Recruit2026Cover"
        component={Template1InfoCard}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ data: RECRUIT2026_TEMPLATE }}
      />

      {/* 模板2 · 星空黄卡键值清单版（示例） */}
      <Composition
        id="Template2Video"
        component={Template2InfoCard}
        durationInFrames={299}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ data: TEMPLATE2_SAMPLE }}
      />
      <Still
        id="Template2Cover"
        component={Template2InfoCard}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ data: TEMPLATE2_SAMPLE }}
      />

      {/* 模板3 · 星空卡片政策条列版（示例） */}
      <Composition
        id="Template3Video"
        component={Template3InfoCard}
        durationInFrames={274}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ data: TEMPLATE3_SAMPLE }}
      />
      <Still
        id="Template3Cover"
        component={Template3InfoCard}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ data: TEMPLATE3_SAMPLE }}
      />

      {/* 模板4 · 红色放射补贴强调版（示例） */}
      <Composition
        id="Template4Video"
        component={Template4InfoCard}
        durationInFrames={237}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ data: TEMPLATE4_SAMPLE }}
      />
      <Still
        id="Template4Cover"
        component={Template4InfoCard}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ data: TEMPLATE4_SAMPLE }}
      />

      {/* 模板4 · 招毕业生补贴（23/24/25届口径）实际出片 */}
      <Composition
        id="GraduateSubsidyT4Video"
        component={Template4InfoCard}
        durationInFrames={237}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ data: GRADUATE_SUBSIDY_T4_TEMPLATE }}
      />
      <Still
        id="GraduateSubsidyT4Cover"
        component={Template4InfoCard}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ data: GRADUATE_SUBSIDY_T4_TEMPLATE }}
      />

      {/* 模板3 · 招毕业生补贴（23/24/25届口径）实际出片 */}
      <Composition
        id="GraduateSubsidyT3Video"
        component={Template3InfoCard}
        durationInFrames={274}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ data: GRADUATE_SUBSIDY_T3_TEMPLATE }}
      />
      <Still
        id="GraduateSubsidyT3Cover"
        component={Template3InfoCard}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ data: GRADUATE_SUBSIDY_T3_TEMPLATE }}
      />
      {/* 模板2 · 企业就业补贴四笔钱（微聘客户知识库口径）实际出片 */}
      <Composition
        id="QyzbSubsidyT2Video"
        component={Template2InfoCard}
        durationInFrames={299}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ data: QYZB_SUBSIDY_T2_TEMPLATE }}
      />
      <Still
        id="QyzbSubsidyT2Cover"
        component={Template2InfoCard}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ data: QYZB_SUBSIDY_T2_TEMPLATE }}
      />

      {/* 模板2 · 企业招人一年省19万（content-huoke 实验） */}
      <Composition
        id="HuokeExperimentT2Video"
        component={Template2InfoCard}
        durationInFrames={299}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ data: HUOKE_EXPERIMENT_T2_TEMPLATE }}
      />
      <Still
        id="HuokeExperimentT2Cover"
        component={Template2InfoCard}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ data: HUOKE_EXPERIMENT_T2_TEMPLATE }}
      />
      {/* 模板5 · 证据型信息图（第一版静帧预览，证据区为占位卡） */}
      <Still
        id="Template5Cover"
        component={Template5Evidence}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ data: TEMPLATE5_SAMPLE }}
      />
      {/* 模板5 · 视频出片（352帧 ≈ 11.75s，配 template4 BGM；CTA 弧形轻摆动画） */}
      <Composition
        id="Template5Video"
        component={Template5Evidence}
        durationInFrames={237}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ data: TEMPLATE5_SAMPLE }}
      />
      {/* 模板5 · 分区预览：各文案模块用纯色块代替 */}
      <Still
        id="Template5Layout"
        component={Template5Evidence}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ data: TEMPLATE5_SAMPLE, layoutPreview: true }}
      />
      {/* 模板5 · 招大学生·政府发金（2 张测试图轮换）· 2026-09-07 */}
      <Still
        id="T5RecruitGradGoldCover"
        component={Template5Evidence}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ data: T5_RECRUIT_GRAD_GOLD }}
      />
      <Composition
        id="T5RecruitGradGoldVideo"
        component={Template5Evidence}
        durationInFrames={237}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ data: T5_RECRUIT_GRAD_GOLD }}
      />
    </>
  );
};
