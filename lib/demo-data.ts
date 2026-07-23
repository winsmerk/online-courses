import type { Course, EnrollmentCourse } from "./types";

export const demoCourses: Course[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    slug: "personal-brand-system",
    title: "从专业到影响力：个人品牌系统课",
    subtitle: "找到清晰定位，用稳定表达建立长期可信度。",
    description:
      "这是一门为专业人士设计的系统课程。你将从定位、内容结构到传播节奏，搭建一套可以长期运行的个人品牌系统。\n\n我们不追逐短期流量，而是帮助你把真实经验转化为能够被理解、被记住、被选择的专业表达。",
    coverUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=85",
    introImages: [
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=85",
    ],
    instructor: "林知遥",
    category: "品牌策略",
    level: "进阶",
    durationMinutes: 280,
    status: "published",
    chapters: [
      {
        id: "chapter-brand-1",
        title: "第一章｜找到你的专业坐标",
        sortOrder: 1,
        lessons: [
          {
            id: "lesson-brand-1",
            slug: "why-personal-brand",
            title: "为什么专业能力需要被看见",
            description:
              "理解个人品牌的本质，并用三个问题识别你已经拥有、但尚未被清晰表达的专业资产。",
            durationMinutes: 18,
            isPreview: true,
          },
          {
            id: "lesson-brand-2",
            slug: "positioning",
            title: "提炼差异化定位",
            description: "从服务对象、关键问题和独特方法三个维度完成定位。",
            durationMinutes: 32,
          },
        ],
      },
      {
        id: "chapter-brand-2",
        title: "第二章｜建立内容表达系统",
        sortOrder: 2,
        lessons: [
          {
            id: "lesson-brand-3",
            slug: "content-pillars",
            title: "设计你的三条内容主线",
            description: "让选题不再依靠灵感，而是持续积累品牌认知。",
            durationMinutes: 36,
          },
          {
            id: "lesson-brand-4",
            slug: "publishing-rhythm",
            title: "建立可持续的发布节奏",
            description: "设计符合个人时间和精力的内容工作流。",
            durationMinutes: 29,
          },
        ],
      },
    ],
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    slug: "ai-workflow",
    title: "AI 工作流：让一个人拥有一支团队",
    subtitle: "从提示词到自动化，构建真正服务业务的 AI 工作流。",
    description:
      "这门课程不会堆砌工具清单，而是从真实工作任务出发，教你拆解流程、设计协作节点，并让 AI 成为可靠的工作伙伴。",
    coverUrl:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=85",
    introImages: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85",
    ],
    instructor: "周原",
    category: "AI 效率",
    level: "入门",
    durationMinutes: 210,
    status: "published",
    chapters: [
      {
        id: "chapter-ai-1",
        title: "第一章｜重新理解 AI 协作",
        sortOrder: 1,
        lessons: [
          {
            id: "lesson-ai-1",
            slug: "task-mapping",
            title: "绘制你的任务地图",
            description: "识别重复工作、判断任务类型并选择合适的 AI 介入点。",
            durationMinutes: 24,
            isPreview: true,
          },
          {
            id: "lesson-ai-2",
            slug: "prompt-context",
            title: "给 AI 足够的上下文",
            description: "用目标、约束和示例写出可复用的任务说明。",
            durationMinutes: 31,
          },
        ],
      },
      {
        id: "chapter-ai-2",
        title: "第二章｜从对话到工作流",
        sortOrder: 2,
        lessons: [
          {
            id: "lesson-ai-3",
            slug: "workflow-design",
            title: "设计人机协同流程",
            description: "把复杂任务拆成可验证、可迭代的协作步骤。",
            durationMinutes: 42,
          },
        ],
      },
    ],
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    slug: "storytelling-presentation",
    title: "高影响力表达：把复杂想法讲清楚",
    subtitle: "从结构、叙事到呈现，让你的观点更容易被理解和采纳。",
    description:
      "适合需要提案、汇报、授课或公开表达的人。课程从听众视角出发，帮助你建立清晰的信息结构，并通过叙事增强说服力。",
    coverUrl:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1400&q=85",
    introImages: [
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",
    ],
    instructor: "沈南",
    category: "沟通表达",
    level: "通用",
    durationMinutes: 190,
    status: "published",
    chapters: [
      {
        id: "chapter-story-1",
        title: "第一章｜先建立结构",
        sortOrder: 1,
        lessons: [
          {
            id: "lesson-story-1",
            slug: "audience-first",
            title: "从听众问题开始",
            description: "在制作内容前，先确认听众真正关心什么。",
            durationMinutes: 21,
            isPreview: true,
          },
          {
            id: "lesson-story-2",
            slug: "story-arc",
            title: "让观点形成叙事弧线",
            description: "通过冲突、转折和行动建议组织你的表达。",
            durationMinutes: 35,
          },
        ],
      },
    ],
  },
];

export const demoEnrollments: EnrollmentCourse[] = [
  { ...demoCourses[0], progress: 45, learningStatus: "学习中" },
  { ...demoCourses[1], progress: 0, learningStatus: "待学习" },
  { ...demoCourses[2], progress: 100, learningStatus: "已完成" },
];
