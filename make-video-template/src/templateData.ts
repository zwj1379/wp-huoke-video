/**
 * ============================================================
 * 通用文案模板 · 数据文件
 * ============================================================
 * 以后只需要改这一个文件：把你给的文案提炼成
 *  主标题 → 副标题 → 若干分组（每组=一个重点，含组标题+要点列表）→ 底部引导
 * 组件会自动排布，支持 2~5 个分组自适应布局。
 *
 * 使用流程：
 *   1. 把 BLANK_TEMPLATE 替换成你的数据（或新增一个 export）
 *   2. 把下面配置的 Composition id / durationInFrames 对齐音乐时长
 *   3. 渲染 + 合成 BGM
 * ============================================================
 */
import type { Template5Data } from './templates/Template5Evidence';

export interface TemplateItem {
  /** 要点名称（左侧文字） */
  name: string;
  /** 右侧强调值（如金额/数字，可省略） */
  value?: string;
}

export interface TemplateGroup {
  /** 分组标题（卡片上的黄色胶囊） */
  title: string;
  /** 分组小备注（可省略） */
  note?: string;
  /** 内容要点列表 */
  items: TemplateItem[];
}

export interface TemplateData {
  /** 主标题 */
  mainTitle: string;
  /** 副标题 */
  subtitle: string;
  /** 重点分组（2~5 组自适应） */
  groups: TemplateGroup[];
  /** 底部引导文案 */
  footer: string;
  /** 模板3/4的黄色强调备注（可省略） */
  footerNote?: string;
}

/** 空白模板 · 占位文案（展示排版骨架） */
export const BLANK_TEMPLATE: TemplateData = {
  mainTitle: '主标题文案',
  subtitle: '副标题 · 一句话说明',
  groups: [
    {
      title: '重点一',
      items: [
        { name: '要点内容占位 A' },
        { name: '要点内容占位 B', value: '数值/金额' },
      ],
    },
    {
      title: '重点二',
      note: '可加小备注',
      items: [{ name: '要点内容占位 C' }],
    },
    {
      title: '重点三',
      items: [
        { name: '要点内容占位 D' },
        { name: '要点内容占位 E', value: '数值/金额' },
      ],
    },
  ],
  footer: '底部引导 · 例如：了解更多，平论111',
};

// 注：旧的 RECRUIT_SUBSIDY_TEMPLATE（23/24/25 年口径）已移除。
// 新增文案实例时，在此 export 一个新的 TemplateData，并在 Root.tsx 注册对应 Composition。

/** 2026 企业招用毕业生补贴（25/26 届口径） */
export const RECRUIT2026_TEMPLATE: TemplateData = {
  mainTitle: '公司招到毕业生就赚大了',
  subtitle: '最高3.2万 企业别错过',
  groups: [
    {
      title: '实习补贴',
      items: [
        { name: '补贴标准', value: '7500~3万' },
        { name: '毕业两年内大学生', value: '25/26届' },
        { name: '全日制高技·大专·本科以上' },
        { name: '16-24岁失业青年可申请' },
      ],
    },
    {
      title: '毕业生补贴',
      items: [
        { name: '补贴标准', value: '3.2万' },
        { name: '毕业两年内·缴纳社保' },
        { name: '参保一年内提出申请' },
        { name: '分公司同样可以申请' },
      ],
    },
  ],
  footer: '平论区回复111 领申报指引',
};

// ============================================================
// 模板2/3/4 示例文案（仅用于展示版式，实际出片请替换）
// ============================================================

/** 模板2 · 营业执照补贴清单（星空黄卡版）示例 */
export const TEMPLATE2_SAMPLE: TemplateData = {
  mainTitle: '一张营业执照=10万补贴\n开店开公司老板赶紧存下',
  subtitle: '开店创业不只是经营赚钱合规资质也能对应\n申请扶持福利！不拿白不拿，快把补贴抱回家',
  groups: [
    {
      title: '',
      items: [
        { name: '法人创业补贴：', value: '1万元' },
        { name: '办公租金补贴：', value: '1.8万元' },
        { name: '创业带动员工：', value: '3万元' },
        { name: '招大学生补贴：', value: '3.2万元' },
      ],
    },
    {
      title: '',
      items: [
        { name: '招失业青年：', value: '2.6万元' },
        { name: '招4050员工：', value: '4万元' },
        { name: '招退伍军人：', value: '2.3万元' },
      ],
    },
  ],
  footer: '申领丝信发“资料”',
};

/** 模板3 · 官方扶持政策（星空卡片版）示例 */
export const TEMPLATE3_SAMPLE: TemplateData = {
  mainTitle: '官方扶持政策',
  subtitle: '2026最新政策 | 各类公司均可申报',
  groups: [
    {
      title: '',
      items: [
        { name: '一次性创业开业补贴，最高3万元' },
        { name: '经营场地租金补贴最高18000元' },
        { name: '企业招用重点群体税收补贴最高27000元' },
        { name: '扩岗吸纳用工补贴，最高4万元' },
        { name: '青年就业见习补贴最高26000元' },
        { name: '创业带动补贴最高20万元' },
      ],
    },
  ],
  footerNote: '本年度申报窗口期收紧，有员工需要购买社保的，不要错过',
  footer: '111，了解更多',
};

/** 模板4 · 招毕业生补贴（红色放射版）示例 */
export const TEMPLATE4_SAMPLE: TemplateData = {
  mainTitle: '公司招到毕业生，就赚到大钱了',
  subtitle: '',
  groups: [
    {
      title: '大学生实习补贴：7000~3万',
      items: [
        { name: '1、毕业两年内（25/26届）大学生，最低学历全日制高技、大专、本科以上学历都可以申报' },
        { name: '2、16-24岁（失业青年）' },
      ],
    },
    {
      title: '大学毕业生补贴：3.2万元',
      items: [],
    },
  ],
  footerNote: '毕业两年内大学生购买社保，并在买社保一年之内提出申请。最低学历全日制、高技、大专、本科以上都可以申请，分公司可以申请',
  footer: '平论区回复“111”，我发你精准的申报操作指引和自测清单！',
};

/** 模板4 · 招毕业生补贴（红色放射版）· 23/24/25届口径 实际出片 */
export const GRADUATE_SUBSIDY_T4_TEMPLATE: TemplateData = {
  mainTitle: '公司招到毕业生就赚到大钱了',
  subtitle: '',
  groups: [
    {
      title: '大学生实习补贴：7500~3万',
      items: [
        { name: '1、毕业两年内（23/24/25届）大学生' },
        { name: '2、全日制学历：高技/大专/本科以上' },
        { name: '3、16-24岁（失业青年）' },
      ],
    },
    {
      title: '大学毕业生补贴：3.2万',
      items: [
        { name: '1、毕业两年内（23/24/25届）大学生' },
        { name: '2、购买社保，一年内提出申请' },
        { name: '3、全日制学历：高技/大专/本科以上' },
        { name: '4、分公司可以申请' },
      ],
    },
  ],
  footer: '平论区回复111',
};

/** 模板2 · 企业就业补贴四笔钱（微聘客户知识库口径）· 2026-08-28 实际出片 */
export const QYZB_SUBSIDY_T2_TEMPLATE: TemplateData = {
  mainTitle: '企业招人白拿四笔钱',
  subtitle: '符合条件就能领',
  groups: [
    {
      title: '就业见习补贴',
      items: [
        { name: '每人每月约1500元', value: '12个月' },
        { name: '离校两年内+16-24岁', value: '可申请' },
      ],
    },
    {
      title: '稳岗+扩岗补助',
      items: [
        { name: '稳岗返还', value: '最高60%' },
        { name: '招一人扩岗', value: '1000-1500元' },
      ],
    },
    {
      title: '税收扣减',
      items: [
        { name: '退役士兵', value: '9000元/年' },
        { name: '重点群体', value: '7800元/年' },
      ],
    },
  ],
  footer: '平论区回复111',
};

/** 模板3 · 招毕业生补贴（星空卡片版）· 23/24/25届口径 实际出片 */
export const GRADUATE_SUBSIDY_T3_TEMPLATE: TemplateData = {
  mainTitle: '公司招到毕业生就赚大钱',
  subtitle: '最高3.2万 · 企业别错过',
  groups: [
    {
      title: '',
      items: [
        { name: '大学生实习补贴：7500~3万' },
        { name: '毕业两年内（23/24/25届）' },
        { name: '全日制：高技/大专/本科以上' },
        { name: '16-24岁失业青年' },
        { name: '大学毕业生补贴：3.2万' },
        { name: '毕业两年内+购买社保' },
        { name: '一年内提出申请' },
        { name: '分公司可以申请' },
      ],
    },
  ],
  footer: '平论区回复111',
};

/** 模板2 · 企业招人一年省19万（content-huoke 实验 · 微聘人才知识库 03/04/05 素材）· 2026-08-28 */
export const HUOKE_EXPERIMENT_T2_TEMPLATE: TemplateData = {
  mainTitle: '企业招人一年省19万',
  subtitle: '按人群对号入座',
  groups: [
    {
      title: '大龄人员补贴',
      items: [
        { name: '4050就业困难人员', value: '5.4万/年' },
        { name: '含残疾人低保户', value: '可申领' },
      ],
    },
    {
      title: '高校毕业生补贴',
      items: [
        { name: '社保补贴', value: '2.3-4.7万/年' },
        { name: '就业见习', value: '1500元/月' },
      ],
    },
    {
      title: '重点人群税收',
      items: [
        { name: '退役士兵', value: '9000元/年' },
        { name: '脱贫人口', value: '7800元/年' },
      ],
    },
  ],
  footer: '平论区回复111',
};

/**
 * 模板5 · 招大学生·政府发金（证据区用两张测试图走 2 图轮换）
 * 2026-09-07 测试出片 · 选题：招大学生政府发钱
 * 注：evidenceImages 是测试占位图（两张空压机横幅），仅用于验证模板5 多图 contain + 卷角切换。
 *     实际交付时替换为真实到账凭证截图。金额/口径与 09-05 招大学生 props 一致，不虚构。
 */
export const T5_RECRUIT_GRAD_GOLD: Template5Data = {
  mainTitle: '招大学生·政府发金',
  subtitle: '企业招用大学生 可领这三笔钱',
  transitionText: '企业得了补贴，学生得了经验，一举两得',
  guideHeading: '补贴攻略：',
  guideSteps: [
    '签见习合同3-12个月，补1500元/月',
    '缴社保满3个月，扩岗补助1500元',
    '招失业半年以上毕业生，抵税6000元/年',
  ],
  footer: '平论区回复111',
  evidenceImages: [
    't5_test_1_dry_oil_free.png',
    't5_test_2_four_in_one.png',
  ],
};
