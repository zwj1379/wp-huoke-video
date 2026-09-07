/**
 * ============================================================
 * 模板注册表（模板库）
 * ============================================================
 * 出片时按「模板ID + 文案数据」两个参数选择样式。
 * 新增模板流程：
 *   1. 复制 src/templates/Template1InfoCard.tsx → TemplateN_XXX.tsx 并改造样式
 *      （新样式来源：① 对标视频复刻（主路径，抽帧分析后逐项还原）
 *                    ② 对话描述需求（轻量方式））
 *   2. 在下方 TEMPLATES 数组注册：ID、名称、组件、一句话描述
 *   3. 在 Root.tsx 中为新模板注册 Composition + Still
 * 已封版模板不再修改样式；风格迭代 = 新建模板N+1，而非改旧模板。
 * ============================================================
 */
import React from 'react';
import { Template1InfoCard } from './Template1InfoCard';
import { Template2InfoCard } from './Template2InfoCard';
import { Template3InfoCard } from './Template3InfoCard';
import { Template4InfoCard } from './Template4InfoCard';
import { Template5Evidence } from './Template5Evidence';
import { TemplateData } from '../templateData';

export interface TemplateEntry {
  id: number;
  key: string; // 命名前缀，如 Template1
  name: string; // 中文名
  component: React.FC<{ data?: TemplateData }>;
  description: string; // 一句话风格描述（供选模板时参考）
}

export const TEMPLATES: TemplateEntry[] = [
  {
    id: 1,
    key: 'Template1',
    name: '深色科技·信息卡片版',
    component: Template1InfoCard,
    description:
      '深蓝渐变科技背景 + 白字蓝描边浮雕大标题（青色扫光）+ 白色信息卡片 2~5 组 + 底部弧形引导（律动）。首帧即完整画面，入场 0.33s 归位。',
  },
  {
    id: 2,
    key: 'Template2',
    name: '星空黄卡·键值清单版',
    component: Template2InfoCard,
    description:
      '深蓝星空渐变 + 黄色标题胶囊 + 波浪边米色信息卡 + 黑红键值对 + 底部打字光标。适合“一张执照=N项补贴”类清单。',
  },
  {
    id: 3,
    key: 'Template3',
    name: '星空卡片·政策条列版',
    component: Template3InfoCard,
    description:
      '深蓝星云背景 + 白色浮雕主标题 + 6~8 个白色圆角胶囊卡片纵向排列 + 黄色强调备注。适合政策清单、扶持项目罗列。',
  },
  {
    id: 4,
    key: 'Template4',
    name: '红色放射·补贴强调版',
    component: Template4InfoCard,
    description:
      '红色放射状背景 + 金色碎屑飘落 + 黄底黑边主标题 + 白色信息卡片 + 黑底白字要点。适合“招毕业生=赚钱”类强刺激文案。',
  },
  {
    id: 5,
    key: 'Template5',
    name: '证据型·回单说服版',
    // 注意：模板5 数据模型是 Template5Data（Template5Evidence.tsx），不是模板1-4 的 TemplateData
    component: Template5Evidence as unknown as React.FC<{ data?: TemplateData }>,
    description:
      '浅蓝天幕 + 白卡红字主标题 + 橙副标题扫光 + 满宽到账凭证区（真实截图整图等比显示）+ 过渡语 + 亮黄攻略区 + 弧形摆动 CTA。凭证强制型：必须提供真实到账凭证截图才能出片。',
  },
];

/** 按模板号取模板（找不到时默认回退模板1） */
export const getTemplate = (id: number): TemplateEntry =>
  TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
