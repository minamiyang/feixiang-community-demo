import { type CSSProperties, type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import {
  BadgeCheck,
  Bell,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  Expand,
  Flame,
  Heart,
  ImagePlus,
  Lightbulb,
  Mail,
  MessageCircle,
  Megaphone,
  Mic,
  PanelLeft,
  Play,
  Plus,
  RefreshCw,
  Reply,
  RotateCcw,
  Search,
  SendHorizontal,
  HelpCircle,
  SlidersHorizontal,
  Share2,
  Sparkles,
  Star,
  ThumbsUp,
  UserPlus,
  Users,
  WandSparkles,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import cover1 from './assets/covers/cover-1.png'
import cover2 from './assets/covers/cover-2.png'
import cover3 from './assets/covers/cover-3.png'
import cover4 from './assets/covers/cover-4.png'
import cover5 from './assets/covers/cover-5.png'
import cover6 from './assets/covers/cover-6.png'
import cover7 from './assets/covers/cover-7.png'
import cover8 from './assets/covers/cover-8.png'
import academyBanner from './assets/academy-banner.png'
import academyExpertCourseCover from './assets/academy-expert-course.png'
import academyTrainingCampCover from './assets/academy-training-camp.png'
import activityBanner from './assets/activity-banner.png'
import douGuimeiAvatar from './assets/avatars/dou-guimei.jpg'
import wangQingyueAvatar from './assets/avatars/wang-qingyue.jpg'
import blackboardTraceImage from './assets/detail/evidence/blackboard-trace.png'
import classroomPhotoImage from './assets/detail/evidence/classroom-photo.png'
import studentWorkImage from './assets/detail/evidence/student-work.png'
import feixiangLogo from './assets/feixiang-logo.png'
import monthlyReportBg1 from './assets/monthly-report/page-1.png'
import monthlyReportBg2 from './assets/monthly-report/page-2.png'
import monthlyReportBg3 from './assets/monthly-report/page-3.png'
import monthlyReportBg4 from './assets/monthly-report/page-4.png'
import monthlyReportBg5 from './assets/monthly-report/page-5.png'
import monthlyReportBg6 from './assets/monthly-report/page-6.png'
import monthlyReportBg7 from './assets/monthly-report/page-7.png'
import monthlyReportBg8 from './assets/monthly-report/page-8.png'
import teacherPhilosophyPosterBackground from './assets/teacher-philosophy-poster-background.png'
import resourcePoster from './assets/detail/stone-liming-cover.png'
import LimestoneActivityPage from './LimestoneActivityPage'
import './App.css'
import './academy.css'

const MONTHLY_REPORT_CANVAS_WIDTH = 720
const MONTHLY_REPORT_CANVAS_HEIGHT = 960
const MONTHLY_REPORT_HORIZONTAL_GUTTER = 256
const MONTHLY_REPORT_VERTICAL_GUTTER = 120

function getMonthlyReportScale(viewportWidth: number, viewportHeight: number) {
  const availableWidth = Math.max(0, viewportWidth - MONTHLY_REPORT_HORIZONTAL_GUTTER)
  const availableHeight = Math.max(0, viewportHeight - MONTHLY_REPORT_VERTICAL_GUTTER)
  return Math.max(0.05, Math.min(
    availableWidth / MONTHLY_REPORT_CANVAS_WIDTH,
    availableHeight / MONTHLY_REPORT_CANVAS_HEIGHT,
  ))
}

type FeedMode = '全部' | '专家推荐' | '我的关注' | '热门精选'
type SourceTag = '专家推荐' | '热门' | '精选' | '活动'
type VerifiedTone = 'blue' | 'red' | 'yellow'
type TrustChip = {
  label: string
  tone: 'saved' | 'remix' | 'followed'
}

type InspirationCard = {
  title: string
  author: string
  identity?: string
  savedCount?: number
  remixCount?: number
  followedSaved?: boolean
  hideTrustChip?: boolean
  sourceTag?: SourceTag
  affinity: FeedMode[]
  recommender?: string
  verified?: VerifiedTone
  visual:
    | 'green'
    | 'yellow'
    | 'ink'
    | 'blue'
    | 'peach'
    | 'mint'
    | 'dark'
    | 'violet'
    | 'paper'
    | 'rose'
    | 'sky'
    | 'lime'
  likes: string
  note: string
  coverTitle: string
  hotComment?: string
  hotCommentLikes?: number
  fresh?: boolean
}

const tasks = [
  '生成自然拼读TTS互动课件',
  '生成中文TTS全音色教学动画',
  '查询AI互动课件中文TTS玩法',
  '设计班级作品画廊HTML页面',
  '生成三张儿童创作主题图',
  '设计小学HTML课堂讨论墙',
  '开发小学班主任web工作台',
  '生成论点侦探所HTML教学游戏',
  '设计班级图书漂流站HTML',
  '生成小蝌蚪找妈妈交互课件',
]

type TopNavTab = '关注' | '推荐' | '热门' | '精选' | '本地' | '达人教师' | '飞象学院' | '资源广场' | '应用广场' | '更多'

const topNavTabs: TopNavTab[] = ['关注', '推荐', '热门', '精选', '本地', '达人教师', '飞象学院', '资源广场', '应用广场', '更多']

type TrendZone = '全部' | '公开课' | '项目化' | '跨学科' | '大单元' | 'STEAM'
type FeedSortOption = '综合' | '最新' | '最多点赞' | '最多评论' | '最多收藏'
type ResourceTypeOption = '不限' | '教学动画' | '互动课件' | '教育应用'
type PublishTimeOption = '不限' | '一周内' | '一月内' | '半年内'
type TeacherRankTab = '月度贡献榜' | '月度活跃榜' | '月度新锐榜'

const feedSortOptions: FeedSortOption[] = ['综合', '最新', '最多点赞', '最多评论', '最多收藏']
const resourceTypeOptions: ResourceTypeOption[] = ['不限', '教学动画', '互动课件', '教育应用']
const publishTimeOptions: PublishTimeOption[] = ['不限', '一周内', '一月内', '半年内']

const trendZones: {
  title: TrendZone
}[] = [
  { title: '全部' },
  { title: '公开课' },
  { title: '项目化' },
  { title: '跨学科' },
  { title: '大单元' },
  { title: 'STEAM' },
]

type TeacherBadge = '已认证' | '飞象优质创作者' | '飞象学院主讲人'

type TeacherProfile = {
  name: string
  location: string
  subject: string
  avatar: string
  tone: 'green' | 'gold' | 'blue' | 'rose' | 'mint' | 'peach'
  badge: TeacherBadge
  stats: { label: string; value: string }[]
}

type TeacherWorkPreview = {
  title: string
  sourceTitle: string
}

type TeacherFeedPlacement = 'lead' | 'trail' | 'standard'

type TeacherFeedCard = {
  id: string
  teacher: TeacherProfile
  placement: TeacherFeedPlacement
}

type PageMode = 'feed' | 'profile' | 'limestoneActivity'

type TeacherProfileStat = {
  label: string
  value: string
}

type TeacherProfileWork = {
  title: string
  sourceTitle: string
  savedCount: string
  remixCount: string
}

type TeacherSkill = {
  title: string
  summary: string
  metric: string
  recommendation: string
  tone: 'green' | 'blue' | 'gold' | 'rose'
}

type HighlightEvent = {
  type: string
  teacher: string
  title: string
  meta: string
  tone: 'gold' | 'green' | 'blue' | 'rose'
}

type ShareQrCell = 'filled' | 'frame' | 'empty'

type PeerWord = {
  label: string
  count: number
  size: 'sm' | 'md' | 'lg' | 'xl'
  tone: 'blue' | 'green' | 'orange' | 'gray'
  x: number
  y: number
  rotate?: number
}

const followedTeachers = [
  { id: '王清越', name: '王清越', initial: '王', background: 'linear-gradient(135deg, #7fd0bf, #2e9b87)', updated: true },
  { id: '陈思乔', name: '陈思乔', initial: '陈', background: 'linear-gradient(135deg, #a8d7ff, #4d93da)', updated: true },
  { id: '周青禾', name: '周青禾', initial: '周', background: 'linear-gradient(135deg, #f8d59c, #df9f46)', updated: false },
  { id: '小满老师', name: '小满老师', initial: '小', background: 'linear-gradient(135deg, #f4b7c6, #d86d8f)', updated: true },
  { id: '李明澈', name: '李明澈', initial: '李', background: 'linear-gradient(135deg, #a6e4d6, #4fb69a)', updated: false },
  { id: '南山小学低语组', name: '南山小学低语组', initial: '南', background: 'linear-gradient(135deg, #d7e0ff, #7c8eed)', updated: false },
] as const

const highlightEvents: HighlightEvent[] = [
  { type: '贡献榜', teacher: '王清越', title: '新登贡献榜 Top 5', meta: '近 7 天改编 312 次', tone: 'gold' },
  { type: '热门', teacher: '王清越', title: '《石灰吟》进入全站热门', meta: '收藏 6,128', tone: 'rose' },
  { type: '精选', teacher: '窦桂梅', title: '「气味记忆展」入选本周精选', meta: '教研组推荐', tone: 'green' },
  { type: '改编', teacher: '管建刚', title: '作文反馈卡改编破百', meta: '102 位老师复用', tone: 'blue' },
  { type: '身份', teacher: '陈思乔', title: '成为飞象优质创作者', meta: '近 30 天持续发新', tone: 'gold' },
  { type: '里程碑', teacher: '窦桂梅', title: '关注数突破 9 万', meta: '语文教研影响力上升', tone: 'green' },
]

const teacherProfiles: TeacherProfile[] = [
  {
    name: '王清越',
    location: '北京 · 中关村三小',
    subject: '语文老师',
    avatar: '王',
    tone: 'green',
    badge: '已认证',
    stats: [
      { label: '关注', value: '2.4万' },
      { label: '作品', value: '86' },
      { label: '改编', value: '312' },
    ],
  },
  {
    name: '陈思乔',
    location: '苏州 · 实验小学',
    subject: '语文老师',
    avatar: '陈',
    tone: 'peach',
    badge: '飞象优质创作者',
    stats: [
      { label: '关注', value: '1.8万' },
      { label: '作品', value: '64' },
      { label: '改编', value: '198' },
    ],
  },
  {
    name: '窦桂梅',
    location: '北京 · 清华附小',
    subject: '语文教研',
    avatar: '窦',
    tone: 'rose',
    badge: '飞象学院主讲人',
    stats: [
      { label: '关注', value: '9.6万' },
      { label: '作品', value: '128' },
      { label: '改编', value: '624' },
    ],
  },
  {
    name: '王崧舟',
    location: '杭州 · 崇文实验小学',
    subject: '语文老师',
    avatar: '王',
    tone: 'gold',
    badge: '已认证',
    stats: [
      { label: '关注', value: '8.4万' },
      { label: '作品', value: '94' },
      { label: '改编', value: '511' },
    ],
  },
  {
    name: '管建刚',
    location: '苏州 · 作文教学',
    subject: '语文老师',
    avatar: '管',
    tone: 'blue',
    badge: '飞象优质创作者',
    stats: [
      { label: '关注', value: '6.1万' },
      { label: '作品', value: '72' },
      { label: '改编', value: '389' },
    ],
  },
  {
    name: '荣维东',
    location: '重庆 · 人民小学',
    subject: '语文老师',
    avatar: '荣',
    tone: 'mint',
    badge: '飞象学院主讲人',
    stats: [
      { label: '关注', value: '5.7万' },
      { label: '作品', value: '58' },
      { label: '改编', value: '264' },
    ],
  },
  {
    name: '周青禾',
    location: '杭州 · 西湖区学军小学',
    subject: '语文老师',
    avatar: '周',
    tone: 'peach',
    badge: '已认证',
    stats: [
      { label: '关注', value: '4.9万' },
      { label: '作品', value: '53' },
      { label: '改编', value: '217' },
    ],
  },
  {
    name: '小满老师',
    location: '深圳 · 语文',
    subject: '语文老师',
    avatar: '小',
    tone: 'green',
    badge: '飞象优质创作者',
    stats: [
      { label: '关注', value: '4.3万' },
      { label: '作品', value: '49' },
      { label: '改编', value: '188' },
    ],
  },
  {
    name: '林若水',
    location: '成都 · 语文',
    subject: '语文老师',
    avatar: '林',
    tone: 'blue',
    badge: '飞象学院主讲人',
    stats: [
      { label: '关注', value: '3.6万' },
      { label: '作品', value: '41' },
      { label: '改编', value: '153' },
    ],
  },
]

const teacherRankings: Record<TeacherRankTab, { name: string; score: number }[]> = {
  月度贡献榜: [
    { name: '王清越', score: 96 },
    { name: '窦桂梅', score: 94 },
    { name: '王崧舟', score: 92 },
    { name: '管建刚', score: 90 },
    { name: '荣维东', score: 88 },
    { name: '陈思乔', score: 86 },
    { name: '周青禾', score: 84 },
    { name: '小满老师', score: 82 },
    { name: '林若水', score: 80 },
    { name: '李明澈', score: 78 },
  ],
  月度活跃榜: [
    { name: '小满老师', score: 95 },
    { name: '王清越', score: 93 },
    { name: '林若水', score: 91 },
    { name: '南山小学低语组', score: 89 },
    { name: '周青禾', score: 87 },
    { name: '陈思乔', score: 85 },
    { name: '晓月老师', score: 83 },
    { name: '李明澈', score: 81 },
    { name: '叶枝枝', score: 79 },
    { name: '周老师', score: 77 },
  ],
  月度新锐榜: [
    { name: '叶枝枝', score: 97 },
    { name: '晓月老师', score: 94 },
    { name: '许宁', score: 92 },
    { name: '赵弯弯', score: 89 },
    { name: '钱嘉禾', score: 87 },
    { name: '阿茉老师', score: 85 },
    { name: '陆遇友', score: 83 },
    { name: '顾晓晓', score: 81 },
    { name: '刘清安', score: 79 },
    { name: 'TeacherYO', score: 76 },
  ],
}

const teacherRankSections: { title: TeacherRankTab; tip: string; tone: 'red' | 'orange' | 'yellow' }[] = [
  {
    title: '月度贡献榜',
    tip: '汇聚本月作品被收藏、改编与建议被采纳最多的老师。',
    tone: 'red',
  },
  {
    title: '月度活跃榜',
    tip: '看见本月持续创作、分享与交流的老师。',
    tone: 'orange',
  },
  {
    title: '月度新锐榜',
    tip: '关注本月新入驻、正在建立影响力的老师。',
    tone: 'yellow',
  },
]

const namedExperts = ['窦桂梅', '管建刚', '王崧舟', '荣维东', '王荣生']

const teacherProfileStats: TeacherProfileStat[] = [
  { label: '作品', value: '18' },
  { label: '关注者', value: '8,421' },
  { label: '被收藏', value: '12,846' },
  { label: '被改编', value: '1,326' },
  { label: '专家推荐', value: '7' },
]

const teacherProfileWorks: TeacherProfileWork[] = [
  {
    title: '《石灰吟》托物言志三关闯关',
    sourceTitle: '《石灰吟》别再干讲了，我用闯关把“托物言志”讲活了',
    savedCount: '6,128',
    remixCount: '86',
  },
  {
    title: '期末古诗默写，改成全班抢答赛',
    sourceTitle: '期末古诗默写太枯燥？我改成全班抢答赛了',
    savedCount: '5,890',
    remixCount: '184',
  },
  {
    title: '上《桂花雨》前，先办一场气味记忆展',
    sourceTitle: '上《桂花雨》前，先让孩子办一场“气味记忆展”',
    savedCount: '4,989',
    remixCount: '78',
  },
  {
    title: '三年级作文反馈卡',
    sourceTitle: '三年级作文反馈卡：先分层，再让孩子看见下一步',
    savedCount: '4,772',
    remixCount: '102',
  },
  {
    title: '《少年中国说》分角色朗读气势训练',
    sourceTitle: '《少年中国说》朗读没气势？试试这个分角色训练台',
    savedCount: '4,976',
    remixCount: '128',
  },
]

const teacherWorkPreviews: Record<string, TeacherWorkPreview[]> = {
  王清越: [
    { title: '《石灰吟》托物言志三关闯关', sourceTitle: '《石灰吟》别再干讲了，我用闯关把“托物言志”讲活了' },
    { title: '期末古诗默写抢答赛', sourceTitle: '期末古诗默写太枯燥？我改成全班抢答赛了' },
    { title: '气味记忆展', sourceTitle: '上《桂花雨》前，先让孩子办一场“气味记忆展”' },
    { title: '三年级作文反馈卡', sourceTitle: '三年级作文反馈卡：先分层，再让孩子看见下一步' },
  ],
  陈思乔: [
    { title: '班级成长证据墙', sourceTitle: '家长会别只放成绩，我做了一张班级成长证据墙' },
    { title: 'AI 写作地图', sourceTitle: '不会编程也能做，学生真的会点进去玩的 AI 写作地图' },
    { title: '小组自动积分表', sourceTitle: '一张自动积分表，让小组评价终于不用课后补账' },
    { title: '少年中国说朗读台', sourceTitle: '《少年中国说》朗读没气势？试试这个分角色训练台' },
  ],
  窦桂梅: [
    { title: '气味记忆展', sourceTitle: '上《桂花雨》前，先让孩子办一场“气味记忆展”' },
    { title: '石灰吟证据闯关', sourceTitle: '《石灰吟》别再干讲了，我用闯关把“托物言志”讲活了' },
    { title: '少年中国说朗读台', sourceTitle: '《少年中国说》朗读没气势？试试这个分角色训练台' },
    { title: '作文反馈卡', sourceTitle: '三年级作文反馈卡：先分层，再让孩子看见下一步' },
  ],
  王崧舟: [
    { title: '少年中国说朗读台', sourceTitle: '《少年中国说》朗读没气势？试试这个分角色训练台' },
    { title: '期末古诗抢答赛', sourceTitle: '期末古诗默写太枯燥？我改成全班抢答赛了' },
    { title: '石灰吟三关闯关', sourceTitle: '《石灰吟》别再干讲了，我用闯关把“托物言志”讲活了' },
    { title: '班级成长证据墙', sourceTitle: '家长会别只放成绩，我做了一张班级成长证据墙' },
  ],
  管建刚: [
    { title: '三年级作文反馈卡', sourceTitle: '三年级作文反馈卡：先分层，再让孩子看见下一步' },
    { title: 'AI 写作地图', sourceTitle: '不会编程也能做，学生真的会点进去玩的 AI 写作地图' },
    { title: '小组自动积分表', sourceTitle: '一张自动积分表，让小组评价终于不用课后补账' },
    { title: '期末古诗抢答赛', sourceTitle: '期末古诗默写太枯燥？我改成全班抢答赛了' },
  ],
  荣维东: [
    { title: '小组自动积分表', sourceTitle: '一张自动积分表，让小组评价终于不用课后补账' },
    { title: '班级成长证据墙', sourceTitle: '家长会别只放成绩，我做了一张班级成长证据墙' },
    { title: '气味记忆展', sourceTitle: '上《桂花雨》前，先让孩子办一场“气味记忆展”' },
    { title: '少年中国说朗读台', sourceTitle: '《少年中国说》朗读没气势？试试这个分角色训练台' },
  ],
  周青禾: [
    { title: '期末古诗抢答赛', sourceTitle: '期末古诗默写太枯燥？我改成全班抢答赛了' },
    { title: '气味记忆展', sourceTitle: '上《桂花雨》前，先让孩子办一场“气味记忆展”' },
    { title: '作文反馈卡', sourceTitle: '三年级作文反馈卡：先分层，再让孩子看见下一步' },
    { title: 'AI 写作地图', sourceTitle: '不会编程也能做，学生真的会点进去玩的 AI 写作地图' },
  ],
  小满老师: [
    { title: 'AI 写作地图', sourceTitle: '不会编程也能做，学生真的会点进去玩的 AI 写作地图' },
    { title: '石灰吟三关闯关', sourceTitle: '《石灰吟》别再干讲了，我用闯关把“托物言志”讲活了' },
    { title: '小组自动积分表', sourceTitle: '一张自动积分表，让小组评价终于不用课后补账' },
    { title: '班级成长证据墙', sourceTitle: '家长会别只放成绩，我做了一张班级成长证据墙' },
  ],
  林若水: [
    { title: '班级成长证据墙', sourceTitle: '家长会别只放成绩，我做了一张班级成长证据墙' },
    { title: '少年中国说朗读台', sourceTitle: '《少年中国说》朗读没气势？试试这个分角色训练台' },
    { title: '期末古诗抢答赛', sourceTitle: '期末古诗默写太枯燥？我改成全班抢答赛了' },
    { title: '气味记忆展', sourceTitle: '上《桂花雨》前，先让孩子办一场“气味记忆展”' },
  ],
}

const teacherSkills: TeacherSkill[] = [
  {
    title: '抽象概念可视化',
    summary: '把“托物言志”“借景抒情”拆成可点、可推理、可闯关的课堂任务。',
    metric: '86 位老师复用',
    recommendation: '窦桂梅 推荐',
    tone: 'green',
  },
  {
    title: '古诗词互动闯关',
    summary: '让学生从字面理解走到证据、表达和情感判断，一关一关往前走。',
    metric: '72 位老师复用',
    recommendation: '王崧舟 推荐',
    tone: 'blue',
  },
  {
    title: '公开课结构设计',
    summary: '把一节课拆成情境导入、证据推理、小组表达、迁移输出。',
    metric: '134 位老师复用',
    recommendation: '荣维东 推荐',
    tone: 'gold',
  },
  {
    title: '学生表达支架',
    summary: '用句式卡、证据卡、迁移卡，帮孩子从知道走到说得出来。',
    metric: '58 位老师复用',
    recommendation: '管建刚 推荐',
    tone: 'rose',
  },
]

const profileHeroLine = '传道、授业、解惑，是一种值得钻研的艺术。'

const shareQrCells: ShareQrCell[] = Array.from({ length: 169 }, (_, index) => {
  const row = Math.floor(index / 13)
  const col = index % 13
  const inTopLeft = row <= 3 && col <= 3
  const inTopRight = row <= 3 && col >= 9
  const inBottomLeft = row >= 9 && col <= 3
  const finderCenter =
    (row >= 1 && row <= 2 && col >= 1 && col <= 2) ||
    (row >= 1 && row <= 2 && col >= 10 && col <= 11) ||
    (row >= 10 && row <= 11 && col >= 1 && col <= 2)
  const finderFrame = inTopLeft || inTopRight || inBottomLeft
  const pattern = (row * 7 + col * 11 + index) % 5 === 0 || (row + col * 2) % 6 === 0
  const isFilled = finderCenter || (!finderFrame && pattern)

  if (isFilled) return 'filled'
  if (finderFrame) return 'frame'
  return 'empty'
})

const teacherImpactQuotes = [
  {
    speaker: '窦桂梅',
    text: '她把“托物言志”从概念讲解变成了学生可体验的学习任务。',
  },
  {
    speaker: '王荣生',
    text: '课堂推进是稳的，关键证据和表达支架都能落到位。',
  },
  {
    speaker: '荣维东',
    text: '她不是把环节堆满，而是让每一段都服务学生表达。',
  },
  {
    speaker: '王崧舟',
    text: '她能把情境、任务和迁移收在同一条线上，课堂很完整。',
  },
  {
    speaker: '管建刚',
    text: '她的课会让孩子有话可说，也有话愿意说。',
  },
  {
    speaker: '李镇西',
    text: '方法很清楚，学生跟着走的时候很踏实。',
  },
] as const

const teacherPeerWords: PeerWord[] = [
  { label: '课堂节奏', count: 52, size: 'xl', tone: 'blue', x: 52, y: 42, rotate: -2 },
  { label: '证据链', count: 38, size: 'lg', tone: 'orange', x: 36, y: 62, rotate: 1 },
  { label: '表达支架', count: 41, size: 'lg', tone: 'green', x: 68, y: 61, rotate: -1 },
  { label: '孩子愿意说', count: 29, size: 'md', tone: 'blue', x: 23, y: 38, rotate: -4 },
  { label: '任务感', count: 33, size: 'md', tone: 'green', x: 77, y: 35, rotate: 2 },
  { label: '公开课好用', count: 27, size: 'md', tone: 'orange', x: 86, y: 52, rotate: -3 },
  { label: '一看就懂', count: 24, size: 'sm', tone: 'green', x: 47, y: 18, rotate: 3 },
  { label: '好复用', count: 22, size: 'sm', tone: 'gray', x: 62, y: 17, rotate: -2 },
  { label: '节奏稳', count: 36, size: 'md', tone: 'blue', x: 12, y: 76, rotate: 1 },
  { label: '课堂完整', count: 30, size: 'lg', tone: 'blue', x: 74, y: 82, rotate: -1 },
  { label: '说得出来', count: 26, size: 'md', tone: 'green', x: 41, y: 80, rotate: 2 },
  { label: '板书清楚', count: 18, size: 'sm', tone: 'gray', x: 15, y: 60, rotate: -4 },
  { label: '托得住', count: 31, size: 'lg', tone: 'blue', x: 58, y: 52, rotate: 0 },
  { label: '迁移自然', count: 20, size: 'sm', tone: 'green', x: 52, y: 76, rotate: 3 },
  { label: '方法清楚', count: 21, size: 'sm', tone: 'gray', x: 88, y: 28, rotate: -2 },
  { label: '可直接带走', count: 19, size: 'sm', tone: 'orange', x: 89, y: 74, rotate: 4 },
  { label: '抓重点', count: 17, size: 'sm', tone: 'gray', x: 20, y: 22, rotate: -3 },
  { label: '公开展示', count: 16, size: 'sm', tone: 'orange', x: 93, y: 16, rotate: 2 },
] as const

const peerCollaborators = [
  { name: '王', background: 'linear-gradient(135deg, #2e9b87, #7fd0bf)' },
  { name: '李', background: 'linear-gradient(135deg, #4d93da, #a8d7ff)' },
  { name: '窦', background: 'linear-gradient(135deg, #df9f46, #f8d59c)' },
  { name: '荣', background: 'linear-gradient(135deg, #d86d8f, #f4b7c6)' },
  { name: '管', background: 'linear-gradient(135deg, #4fb69a, #a6e4d6)' },
  { name: '周', background: 'linear-gradient(135deg, #7c8eed, #d7e0ff)' },
] as const

const monthlyReportPages = [
  { title: '月志启封', background: monthlyReportBg1 },
  { title: '备课总览', background: monthlyReportBg2 },
  { title: '用心回响', background: monthlyReportBg3 },
  { title: '高光一课', background: monthlyReportBg4 },
  { title: '同行相望', background: monthlyReportBg5 },
  { title: '理念主张', background: monthlyReportBg6 },
  { title: '荣誉印记', background: monthlyReportBg7 },
  { title: '共勉前行', background: monthlyReportBg8 },
] as const

const monthlyReportHourProfile = [
  2, 2, 1, 1, 1, 2, 3, 5, 7, 9, 8, 6,
  5, 6, 7, 9, 11, 13, 16, 18, 17, 14, 10, 6,
]

const coverImageByTitle: Record<string, string> = {
  '《石灰吟》别再干讲了，我用闯关把“托物言志”讲活了': cover1,
  '《石灰吟》同题创作活动：同一首诗，看看大家怎么上': teacherPhilosophyPosterBackground,
  '期末古诗默写太枯燥？我改成全班抢答赛了': cover2,
  '上《桂花雨》前，先让孩子办一场“气味记忆展”': cover3,
  '一张自动积分表，让小组评价终于不用课后补账': cover4,
  '《少年中国说》朗读没气势？试试这个分角色训练台': cover5,
  '三年级作文反馈卡：先分层，再让孩子看见下一步': cover6,
  '家长会别只放成绩，我做了一张班级成长证据墙': cover7,
  '不会编程也能做，学生真的会点进去玩的 AI 写作地图': cover8,
}

const avatarImageByName: Record<string, string> = {
  王清越: wangQingyueAvatar,
  窦桂梅: douGuimeiAvatar,
}

function MonthlyReportPoster({
  pageIndex,
  onClose,
}: {
  pageIndex: number
  onClose: () => void
}) {
  const page = monthlyReportPages[pageIndex]
  const posterStyle = { '--monthly-report-bg': `url(${page.background})` } as CSSProperties
  const maxHour = Math.max(...monthlyReportHourProfile)

  return (
    <article className={`monthly-report-page monthly-report-page--${pageIndex + 1}`} style={posterStyle}>
      <button className="monthly-report-close" type="button" title="关闭" onClick={onClose}>
        <X size={17} />
      </button>
      {pageIndex === 0 && (
        <div className="monthly-report-content monthly-report-cover-page">
          <div className="monthly-report-kicker">2026 · 08</div>
          <div className="monthly-report-creator">王清越</div>
          <h1>你的教学月志已送达</h1>
          <p className="monthly-report-cover-note">很荣幸，这个月飞象老师依旧<br />陪你行走在教育求索的路上</p>
          <div className="monthly-report-theme">本月主题词 · 生长</div>
        </div>
      )}

      {pageIndex === 1 && (
        <div className="monthly-report-content monthly-report-overview-page">
          <div className="monthly-report-kicker">备课总览</div>
          <h2>
            这个月，你把 <em>6</em> 堂好课送进了
            <span className="monthly-report-break-line">同行视野。</span>
          </h2>
          <p className="monthly-report-subline">比起上个月，更多人打开了你的作品。</p>
          <div className="monthly-report-stat-grid">
            <div>
              <span>浏览量</span>
              <strong>12,080</strong>
              <small>↑ 31%</small>
            </div>
            <div>
              <span>被收藏</span>
              <strong>6,128</strong>
              <small>↑ 26%</small>
            </div>
            <div>
              <span>被改编</span>
              <strong>86</strong>
              <small>↑ 18%</small>
            </div>
          </div>
          <section className="monthly-report-hour-chart" aria-label="你更常在这些时候创作">
            <div className="monthly-report-hour-chart-head">
              <h3>你更常在这些时候备课</h3>
              <p>习惯夜间备课</p>
            </div>
            <div className="monthly-report-hour-bars">
              {monthlyReportHourProfile.map((value, hour) => (
                <div className="monthly-report-hour-bar" key={hour}>
                  <i style={{ height: `${Math.max(10, (value / maxHour) * 100)}%` }} />
                  <span>{String(hour).padStart(2, '0')}</span>
                </div>
              ))}
            </div>
            <div className="monthly-report-hour-axis">
              <span>00</span>
              <span>06</span>
              <span>12</span>
              <span>18</span>
              <span>24</span>
            </div>
            <p className="monthly-report-hour-note">夜深还在备课，辛苦了，老师。</p>
          </section>
        </div>
      )}

      {pageIndex === 2 && (
        <div className="monthly-report-content monthly-report-craft-page">
          <div className="monthly-report-kicker">用心回响</div>
          <h2>
            你打磨最深的课，
            <span className="monthly-report-break-line">也是影响最广的那一堂。</span>
          </h2>
          <p className="monthly-report-subline">这是本月你花心思最多的作品：</p>
          <article className="monthly-report-story-card">
            <div className="monthly-report-story-media">
              <img src={cover1} alt="《石灰吟》课件封面" />
            </div>
            <div className="monthly-report-story-body">
              <h3>《石灰吟》别再干讲了，我用闯关把“托物言志”讲活了</h3>
              <p>让古诗不只是背诵，而是一场孩子愿意进入的表达闯关。</p>
            </div>
          </article>
          <div className="monthly-report-kpi-grid" aria-label="本月打磨数据">
            <div className="monthly-report-kpi-card">
              <strong>14</strong>
              <span>次打磨</span>
            </div>
            <div className="monthly-report-kpi-card">
              <strong>86</strong>
              <span>次改编</span>
            </div>
            <div className="monthly-report-kpi-card">
              <strong>6,128</strong>
              <span>次收藏</span>
            </div>
          </div>
          <p className="monthly-report-subline">你每多打磨一轮，就有更多人把它带进课堂。</p>
        </div>
      )}

      {pageIndex === 3 && (
        <div className="monthly-report-content monthly-report-craft-page">
          <div className="monthly-report-kicker">高光一课</div>
          <h2>这是本月最受关注的一课。</h2>
          <p className="monthly-report-subline">同行反复看它、用它、改编它——</p>
          <article className="monthly-report-story-card">
            <div className="monthly-report-story-media">
              <img src={cover3} alt="《桂花雨》课件封面" />
            </div>
            <div className="monthly-report-story-body">
              <h3>上《桂花雨》前，我先让孩子办一场“气味记忆展”</h3>
              <p>让散文里的味道先被看见，再慢慢回到文字里。</p>
            </div>
          </article>
          <div className="monthly-report-kpi-grid" aria-label="本月打磨数据">
            <div className="monthly-report-kpi-card">
              <strong>8,320</strong>
              <span>次查看</span>
            </div>
            <div className="monthly-report-kpi-card">
              <strong>4,286</strong>
              <span>次收藏</span>
            </div>
            <div className="monthly-report-kpi-card">
              <strong>58</strong>
              <span>次改编</span>
            </div>
          </div>
          <p className="monthly-report-subline">你把抽象的“气味”，变成了孩子能说出来的记忆。</p>
        </div>
      )}

      {pageIndex === 4 && (
        <div className="monthly-report-content monthly-report-peer-page">
          <div className="monthly-report-kicker">同行相望</div>
          <h2 className="monthly-report-peer-title">
            <span className="monthly-report-peer-lead">你的思考，帮到了——</span>
            <span className="monthly-report-peer-numberline">
              <em>17</em>
              <strong>位老师</strong>
            </span>
          </h2>
          <p className="monthly-report-peer-subline">
            你的 <strong>23</strong> 条建议，已经进了同行的课堂。
          </p>
          <p className="monthly-report-peer-intro">这个月来往最密的，是这位老师——</p>
          <article className="monthly-report-peer-card">
            <img className="monthly-report-peer-avatar" src={douGuimeiAvatar} alt="窦桂梅头像" />
            <div className="monthly-report-peer-card-body">
              <div className="monthly-report-peer-name">窦桂梅</div>
              <div className="monthly-report-peer-meta">清华附小语文老师</div>
              <p className="monthly-report-peer-desc">你们围绕古诗教学互评教学想法，切磋了 <span className="monthly-report-peer-count">36</span> 次。</p>
            </div>
          </article>
        </div>
      )}

      {pageIndex === 5 && (
        <div className="monthly-report-content monthly-report-belief-page">
          <div className="monthly-report-kicker">理念主张</div>
          <h2>
            8 月的你，一直在思考一件事：
            <span className="monthly-report-break-line">如何让评价真正发生在课堂里。</span>
          </h2>
          <p className="monthly-report-belief-intro">这体现了你的教育理念取向——</p>
          <div className="monthly-report-belief-tag">教学评一体化</div>
          <section className="monthly-report-quotes">
            <p>
              <span>作品提示词</span>
              <strong>你在生成教学动画时强调</strong>
              <em>评价不等到课后，要在每一关里让学生知道自己为什么说得更清楚。</em>
            </p>
            <p>
              <span>给同行的评论</span>
              <strong>你在给同行作品的评论中写道</strong>
              <em>这里可以把“清白”的判断交给孩子，用证据把表达托起来。</em>
            </p>
            <p>
              <span>教学灵感</span>
              <strong>你发布的教学灵感中有这么一句</strong>
              <em>学生不是在背答案，而是在顺着证据把意思一点点讲出来。</em>
            </p>
          </section>
        </div>
      )}

      {pageIndex === 6 && (
        <div className="monthly-report-content monthly-report-honor-page">
          <div className="monthly-report-kicker">荣誉印记</div>
          <h2>8 月，有几个时刻值得被记住。</h2>
          <p className="monthly-report-subline">这是这个月，你被看见的时刻。</p>
          <section className="monthly-report-main-honor">
            <span>08 · 18，你获评</span>
            <strong>飞象优质创作者</strong>
          </section>
          <div className="monthly-report-timeline">
            <p>
              <span>08 · 05</span>
              《石灰吟》进入语文热门精选
            </p>
            <p>
              <span>08 · 13</span>
              3 条建议被同行采纳
            </p>
            <p>
              <span>08 · 21</span>
              入选本月创作者榜单
            </p>
          </div>
        </div>
      )}

      {pageIndex === 7 && (
        <div className="monthly-report-content monthly-report-share-page">
          <div className="monthly-report-kicker">共勉前行</div>
          <blockquote>
            一棵树摇动另一棵树，一朵云推动另一朵云，一个灵魂唤醒另一个灵魂。
            <cite>—— 雅斯贝尔斯</cite>
          </blockquote>
          <p className="monthly-report-share-line">这个月，你是那棵摇动了 <em>17</em> 棵树的老师。</p>
        </div>
      )}
    </article>
  )
}

const cards: InspirationCard[] = [
  {
    title: '《石灰吟》别再干讲了，我用闯关把“托物言志”讲活了',
    author: '王清越',
    identity: '中关村三小 语文老师',
    savedCount: 74,
    remixCount: 86,
    sourceTag: '专家推荐',
    affinity: ['专家推荐', '热门精选'],
    recommender: '窦桂梅 推荐',
    verified: 'red',
    visual: 'ink',
    likes: '6128',
    note: '古诗词 / 五年级 / 课堂游戏',
    coverTitle: '托物言志',
    hotComment: '这一关出来以后，全班都在抢着解释“清白”',
    hotCommentLikes: 236,
  },
  {
    title: '期末古诗默写太枯燥？我改成全班抢答赛了',
    author: '林若水',
    savedCount: 1314,
    remixCount: 184,
    sourceTag: '热门',
    affinity: ['热门精选'],
    visual: 'yellow',
    likes: '5890',
    note: '复习课 / 语文 / 数据回收',
    coverTitle: '古诗闯关',
  },
  {
    title: '上《桂花雨》前，先让孩子办一场“气味记忆展”',
    author: '陈思乔',
    identity: '苏州实验小学 语文老师',
    savedCount: 642,
    remixCount: 78,
    followedSaved: true,
    sourceTag: '精选',
    affinity: ['我的关注', '专家推荐'],
    recommender: '王崧舟 推荐',
    verified: 'red',
    visual: 'peach',
    likes: '4989',
    note: '阅读课 / 情境导入',
    coverTitle: '气味记忆展',
    hotComment: '这个导入好绝，孩子马上讲起自己家的桂花',
    hotCommentLikes: 184,
  },
  {
    title: '一张自动积分表，让小组评价终于不用课后补账',
    author: '陆遇友',
    savedCount: 28,
    remixCount: 43,
    affinity: ['我的关注'],
    visual: 'blue',
    likes: '203',
    note: '班主任 / 班级管理',
    coverTitle: '班级积分系统',
  },
  {
    title: '《少年中国说》朗读没气势？试试这个分角色训练台',
    author: '中关村三小三年级语文教研组',
    identity: '中关村三小 教研组',
    savedCount: 762,
    remixCount: 128,
    hideTrustChip: true,
    sourceTag: '专家推荐',
    affinity: ['专家推荐', '热门精选'],
    recommender: '荣维东 推荐',
    verified: 'blue',
    visual: 'rose',
    likes: '4976',
    note: '朗读 / 六年级 / 情感表达',
    coverTitle: '朗读气势台',
  },
  {
    title: '三年级作文反馈卡：先分层，再让孩子看见下一步',
    author: '小满老师',
    identity: '飞象优质创作者',
    savedCount: 73,
    remixCount: 102,
    sourceTag: '专家推荐',
    affinity: ['专家推荐'],
    recommender: '管建刚 推荐',
    verified: 'yellow',
    visual: 'mint',
    likes: '4772',
    note: '作文 / 学情反馈',
    coverTitle: '作文反馈卡',
    hotComment: '照这个分层改，后进生也知道下一步写什么了',
    hotCommentLikes: 169,
  },
  {
    title: '家长会别只放成绩，我做了一张班级成长证据墙',
    author: '周青禾',
    identity: '杭州崇文实验学校 语文老师',
    savedCount: 531,
    remixCount: 64,
    followedSaved: true,
    hideTrustChip: true,
    affinity: ['我的关注', '热门精选'],
    verified: 'red',
    visual: 'paper',
    likes: '4518',
    note: '班主任 / 家校沟通',
    coverTitle: '成长证据墙',
  },
  {
    title: '不会编程也能做，学生真的会点进去玩的 AI 写作地图',
    author: 'TeacherYO',
    savedCount: 218,
    remixCount: 44,
    sourceTag: '热门',
    affinity: ['热门精选'],
    visual: 'violet',
    likes: '4320',
    note: '写作 / 新手教程',
    coverTitle: 'AI写作地图',
  },
  {
    title: '看图写话卡住的孩子，可以先玩这个拖拽练习',
    author: '南山小学低语组',
    savedCount: 398,
    remixCount: 36,
    affinity: ['我的关注'],
    visual: 'sky',
    likes: '421',
    note: '看图写话 / 低年级',
    coverTitle: '句子搭建台',
  },
  {
    title: '《小蝌蚪找妈妈》做成剧情排序，复述一下顺了',
    author: '顾晓晓',
    affinity: ['热门精选'],
    visual: 'green',
    likes: '16',
    note: '一年级 / 童话 / 排序',
    coverTitle: '剧情排序',
    hotComment: '拖完顺序，孩子自己就能复述故事了',
    hotCommentLikes: 32,
    fresh: true,
  },
  {
    title: '安全教育不想说教，我做了个校园风险侦探所',
    author: '许宁',
    savedCount: 88,
    remixCount: 57,
    followedSaved: true,
    affinity: ['我的关注'],
    visual: 'lime',
    likes: '389',
    note: '班会 / 安全教育',
    coverTitle: '风险侦探所',
  },
  {
    title: '讲《爬山虎的脚》，先让学生给叶片做标注',
    author: '李明澈',
    savedCount: 37,
    remixCount: 24,
    sourceTag: '专家推荐',
    affinity: ['专家推荐'],
    recommender: '王崧舟 推荐',
    visual: 'mint',
    likes: '58',
    note: '观察作文 / 四年级',
    coverTitle: '观察标注板',
    fresh: true,
  },
  {
    title: '午间阅读终于有人管了，我搭了个班级图书漂流站',
    author: '星河二小阅读组',
    savedCount: 72,
    remixCount: 91,
    affinity: ['热门精选', '我的关注'],
    visual: 'paper',
    likes: '361',
    note: '阅读管理 / 班主任',
    coverTitle: '图书漂流站',
  },
  {
    title: '《荷花》第一课时，我让学生先给画面配旁白',
    author: '赵弯弯',
    affinity: ['专家推荐'],
    visual: 'peach',
    likes: '23',
    note: '三年级 / 阅读想象',
    coverTitle: '画面旁白',
    fresh: true,
  },
  {
    title: '值日表从争抢到认领，我把小岗位贴成了任务墙',
    author: '钱嘉禾',
    savedCount: 31,
    remixCount: 18,
    affinity: ['我的关注'],
    visual: 'blue',
    likes: '72',
    note: '班级管理 / 自主管理',
    coverTitle: '值日任务墙',
  },
  {
    title: '《富饶的西沙群岛》别只画线，这张颜色词卡很好用',
    author: '浦东二小中语组',
    savedCount: 236,
    remixCount: 64,
    sourceTag: '精选',
    affinity: ['专家推荐', '我的关注'],
    visual: 'sky',
    likes: '916',
    note: '三年级 / 语言积累',
    coverTitle: '颜色词观察',
  },
  {
    title: '课间纪律反复时，我让孩子做了一次问题现场勘察',
    author: '阿茉老师',
    savedCount: 49,
    remixCount: 32,
    followedSaved: true,
    affinity: ['我的关注'],
    visual: 'lime',
    likes: '114',
    note: '班主任 / 班会',
    coverTitle: '讨论墙',
    hotComment: '这个班会不像批评会，孩子愿意说真话',
    hotCommentLikes: 61,
  },
  {
    title: '《总也倒不了的老屋》用“请求树”讲，结构一下清楚',
    author: '顾北辰',
    affinity: ['热门精选'],
    visual: 'yellow',
    likes: '41',
    note: '三年级 / 童话结构',
    coverTitle: '请求树',
    fresh: true,
  },
  {
    title: '作文讲评不尴尬了，优秀片段匿名投票太好用',
    author: '西城实验小学语文组',
    savedCount: 143,
    remixCount: 88,
    sourceTag: '热门',
    affinity: ['热门精选', '专家推荐'],
    visual: 'rose',
    likes: '1206',
    note: '作文 / 同伴评价',
    coverTitle: '片段投票墙',
  },
  {
    title: '开学排座位别凭感觉了，这个生成器能少吵一半',
    author: '沈白露',
    savedCount: 31,
    remixCount: 64,
    affinity: ['我的关注'],
    visual: 'paper',
    likes: '298',
    note: '班主任 / 开学准备',
    coverTitle: '座位生成器',
  },
  {
    title: '《秋天的雨》先做感官卡，孩子写句子明显有画面了',
    author: '叶枝枝',
    affinity: ['专家推荐'],
    visual: 'ink',
    likes: '36',
    note: '三年级 / 散文感受',
    coverTitle: '感官卡',
    fresh: true,
  },
  {
    title: '语文园地复习，成语分类小擂台比刷题热闹多了',
    author: '晓月老师',
    savedCount: 287,
    remixCount: 43,
    sourceTag: '热门',
    affinity: ['热门精选'],
    visual: 'green',
    likes: '884',
    note: '复习课 / 成语积累',
    coverTitle: '成语擂台',
  },
  {
    title: '班级小岗位竞聘，让学生自己做一页“求职简历”',
    author: '刘清安',
    savedCount: 34,
    remixCount: 26,
    affinity: ['我的关注'],
    visual: 'violet',
    likes: '69',
    note: '班主任 / 班级岗位',
    coverTitle: '岗位竞聘',
  },
  {
    title: '《搭船的鸟》别急着分析，先给翠鸟动作排时间轴',
    author: '青藤语文工作室',
    savedCount: 401,
    remixCount: 93,
    followedSaved: true,
    affinity: ['我的关注', '专家推荐'],
    visual: 'mint',
    likes: '754',
    note: '三年级 / 观察顺序',
    coverTitle: '动作时间轴',
  },
]

const cardIndex = Object.fromEntries(cards.map((card) => [card.title, card])) as Record<
  string,
  InspirationCard
>

type AcademyLearningScope = '本期' | '全部'

type AcademyCourseCard = {
  title: string
  instructor: string
  role: string
  proof: string
  duration: string
  cover: string
}

const academyExpertCourse: AcademyCourseCard = {
  title: 'AI 时代，古诗词教学如何从讲解走向体验',
  instructor: '窦桂梅',
  role: '语文教育专家',
  proof: '全国著名特级教师',
  duration: '42分钟',
  cover: academyExpertCourseCover,
}

const academyTrainingCamp: AcademyCourseCard = {
  title: '古诗词互动课堂设计',
  instructor: '王清越',
  role: '中关村三小语文教师',
  proof: '飞象优质创作者',
  duration: '68分钟',
  cover: academyTrainingCampCover,
}

const academyWorkshopStatus = ['进行中', '距离结营还有 9 天'] as const

const academyWorkshopStats = [
  { value: '428', label: '已完习', unit: '位教师' },
  { value: '96', label: '已提交', unit: '件作品' },
  { value: '7', label: '专家推荐', unit: '件作品' },
  { value: '18', label: '主讲人推荐', unit: '件作品' },
] as const

const academyLearningStats: Record<AcademyLearningScope, { label: string; value: string }[]> = {
  本期: [
    { label: '正在学的课程', value: '1' },
    { label: '学习时长', value: '9h' },
    { label: '已提交的作品', value: '2' },
    { label: '被推荐', value: '3' },
  ],
  全部: [
    { label: '正在学的课程', value: '6' },
    { label: '学习时长', value: '42h' },
    { label: '已提交的作品', value: '18' },
    { label: '被推荐', value: '25' },
  ],
}

const academyReferenceResources = [
  {
    title: '《竹石》品格证据卡',
    meta: '古诗词 · 品格迁移',
    image: cover5,
  },
  {
    title: '《秋天的雨》感官卡',
    meta: '散文 · 感官表达',
    image: cover8,
  },
  {
    title: '《搭船的鸟》动作时间轴',
    meta: '观察作文 · 时间轴',
    image: cover6,
  },
  {
    title: '《桂花雨》气味记忆展',
    meta: '阅读课 · 情境导入',
    image: cover3,
  },
] as const

const academyCourseSummary = [
  '古诗词教学先从“讲懂”转向“让学生经历一次理解过程”。',
  'AI 适合承担情境、任务和反馈的组织工作，老师把握审美与表达方向。',
  '优秀作品要能被复用、被改编，并回流到社区形成案例。',
] as const

const academyOutcomes = [
  {
    title: '《古朗月行》比较任务',
    author: '林若水',
    tag: '主讲人推荐',
    image: cover2,
    tone: 'green',
  },
  {
    title: '《少年中国说》朗读训练台',
    author: '浦东二小中语组',
    tag: '专家推荐',
    image: cover5,
    tone: 'gold',
  },
  {
    title: '《墨梅》品格证据卡',
    author: '中关村三小语文组',
    tag: '专家推荐',
    image: cover7,
    tone: 'red',
  },
  {
    title: '《泊船瓜洲》情境迁移',
    author: '青藤语文工作室',
    tag: '主讲人推荐',
    image: cover4,
    tone: 'blue',
  },
  {
    title: '《咏柳》春意观察卡',
    author: '西湖区语文共创组',
    tag: '主讲人推荐',
    image: cover8,
    tone: 'green',
  },
  {
    title: '《登鹳雀楼》视角任务',
    author: '苏州实验小学语文组',
    tag: '专家推荐',
    image: cover6,
    tone: 'gold',
  },
] as const

const academyStudents = [
  {
    name: '林若水',
    profile: '小学语文青年教师',
    school: '成都 · 三年级语文',
    duration: '本期学习 9 小时',
    works: '完成 2 个作品',
  },
  {
    name: '陈思乔',
    profile: '小学语文骨干教师',
    school: '苏州实验小学',
    duration: '本期学习 8 小时',
    works: '完成 3 个作品',
  },
  {
    name: '周青禾',
    profile: '高年级语文教师',
    school: '杭州 · 西湖区学军小学',
    duration: '本期学习 7 小时',
    works: '完成 2 个作品',
  },
] as const

const relatedResourceTitles = [
  '《少年中国说》朗读没气势？试试这个分角色训练台',
  '《总也倒不了的老屋》用“请求树”讲，结构一下清楚',
  '《秋天的雨》先做感官卡，孩子写句子明显有画面了',
  '《搭船的鸟》别急着分析，先给翠鸟动作排时间轴',
  '《富饶的西沙群岛》别只画线，这张颜色词卡很好用',
] as const

const limestoneActivityCard: InspirationCard = {
  title: '《石灰吟》同题创作活动：同一首诗，看看大家怎么上',
  author: '飞象社区',
  savedCount: 2486,
  remixCount: 318,
  sourceTag: '活动',
  affinity: ['热门精选'],
  visual: 'paper',
  likes: '1.2万',
  note: '同题创作 / 活动作品流',
  coverTitle: '石灰吟同题创作',
}

type FuelMediaType = '图片' | '视频'
type FuelWorkTitle = (typeof fuelWorks)[number]['title']
type ActivityScope = '社区' | '我的'

const fuelWorks = [
  {
    title: '《石灰吟》托物言志三关任务',
    meta: '五年级 · 语文',
    tone: 'green',
  },
  {
    title: '《桂花雨》气味记忆展资源',
    meta: '阅读课 · 情境导入',
    tone: 'peach',
  },
  {
    title: '一张自动积分表任务',
    meta: '班主任 · 班级管理',
    tone: 'blue',
  },
] as const

const activityTrendSources: Record<
  ActivityScope,
  { label: string; title: string; count: string; tone: 'green' | 'gold' | 'blue' }[]
> = {
  社区: [
    { label: '1', title: '《石灰吟》同题创作', count: '2.4k 关注', tone: 'gold' },
    { label: '2', title: '托物言志课堂设计', count: '1.8k 关注', tone: 'green' },
    { label: '3', title: '古诗闯关活动', count: '1.2k 关注', tone: 'gold' },
    { label: '4', title: '活动素材挂载示例', count: '836 关注', tone: 'blue' },
    { label: '5', title: '五年级语文话题创作', count: '712 关注', tone: 'green' },
  ],
  我的: [
    { label: '1', title: '我在看的教学灵感', count: '最近在看', tone: 'green' },
    { label: '2', title: '石灰吟资源改编', count: '3位老师在提', tone: 'gold' },
    { label: '3', title: '适合继续做的教学思路', count: '2条收藏', tone: 'blue' },
    { label: '4', title: '课堂实录发布方式', count: '1条新关注', tone: 'green' },
    { label: '5', title: '活动报名与资源挂载', count: '待继续看', tone: 'blue' },
  ],
}

const resourceHtml = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #273832;
      background:
        radial-gradient(circle at 22% 18%, rgba(255, 255, 255, .78), transparent 190px),
        linear-gradient(135deg, #e7efe3, #f8f5ea 45%, #deeadc);
      display: grid;
      place-items: center;
      padding: 28px;
    }
    .stage {
      width: min(900px, 100%);
      min-height: 560px;
      border: 1px solid rgba(23, 84, 64, .18);
      border-radius: 8px;
      overflow: hidden;
      background: rgba(255,255,255,.72);
      box-shadow: 0 24px 60px rgba(40, 70, 52, .16);
    }
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 22px;
      color: #f9fffb;
      background: #0a664d;
    }
    .top strong { font-size: 22px; }
    .top span { font-size: 13px; opacity: .78; }
    .board {
      padding: 34px;
      display: grid;
      gap: 22px;
    }
    .poem {
      display: grid;
      grid-template-columns: 1fr 180px;
      gap: 24px;
      align-items: center;
      padding: 26px;
      border-radius: 8px;
      background: #fffdf7;
      border: 1px solid #e6dfcd;
    }
    h1 { margin: 0 0 14px; font-size: 34px; letter-spacing: 0; }
    p { margin: 0; line-height: 1.8; font-size: 18px; }
    .stone {
      height: 150px;
      border-radius: 8px;
      background:
        linear-gradient(145deg, rgba(255,255,255,.65), transparent),
        repeating-linear-gradient(-18deg, #d9d9d2 0 18px, #c8cbc2 18px 28px);
      display: grid;
      place-items: center;
      color: #49625a;
      font-weight: 900;
      font-size: 30px;
      box-shadow: inset 0 0 0 1px rgba(70, 82, 72, .12);
    }
    .levels { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .level {
      min-height: 132px;
      border: 1px solid #dfe8dd;
      border-radius: 8px;
      padding: 18px;
      background: #ffffff;
      cursor: pointer;
      transition: .18s ease;
    }
    .level:hover {
      transform: translateY(-3px);
      border-color: #8bc2a8;
      box-shadow: 0 16px 26px rgba(38, 92, 63, .12);
    }
    .level em {
      display: inline-flex;
      margin-bottom: 12px;
      color: #0f7155;
      font-style: normal;
      font-weight: 900;
      font-size: 13px;
    }
    .level strong { display: block; font-size: 20px; margin-bottom: 8px; }
    .level span { color: #788a84; font-size: 14px; line-height: 1.5; }
    .answer {
      border: 1px solid #cfdfd5;
      border-radius: 8px;
      padding: 18px 20px;
      background: #eef8f1;
      color: #245345;
      font-size: 17px;
      font-weight: 760;
    }
    @media (max-width: 720px) {
      body { padding: 14px; }
      .stage { min-height: auto; }
      .poem, .levels { grid-template-columns: 1fr; }
      .board { padding: 18px; }
      h1 { font-size: 28px; }
    }
  </style>
</head>
<body>
  <main class="stage">
    <div class="top">
      <strong>石灰吟闯关：托物言志</strong>
      <span>五年级语文 · 课堂可投屏</span>
    </div>
    <section class="board">
      <div class="poem">
        <div>
          <h1>石灰吟</h1>
          <p>千锤万凿出深山，烈火焚烧若等闲。<br />粉骨碎身浑不怕，要留清白在人间。</p>
        </div>
        <div class="stone">清白</div>
      </div>
      <div class="levels">
        <button class="level" type="button" onclick="document.querySelector('.answer').textContent='第一关：物象是石灰。线索藏在千锤万凿、烈火焚烧、粉骨碎身里。'">
          <em>第一关</em>
          <strong>先找物象</strong>
          <span>诗人借什么物在说话？点开线索卡。</span>
        </button>
        <button class="level" type="button" onclick="document.querySelector('.answer').textContent='第二关：品质是坚贞、不怕磨难、保持清白。清白不是颜色，是品格。'">
          <em>第二关</em>
          <strong>再找品质</strong>
          <span>这些经历对应了怎样的精神品质？</span>
        </button>
        <button class="level" type="button" onclick="document.querySelector('.answer').textContent='第三关：回到于谦处境，理解诗人借石灰表达守正不屈的志向。'">
          <em>第三关</em>
          <strong>回到作者</strong>
          <span>把物象、品质和作者处境连起来。</span>
        </button>
      </div>
      <div class="answer">点击任一关卡，现场带学生一步步拆出“托物言志”。</div>
    </section>
  </main>
</body>
</html>`

type DiscussionReply = {
  author: string
  text: string
}

type DiscussionItem = {
  id: string
  author: string
  handle: string
  text: string
  likes: number
  accepted: boolean
  replies?: DiscussionReply[]
}

const discussionThreads: DiscussionItem[] = [
  {
    id: 'zhou',
    author: '周老师',
    handle: '@周老师',
    text: '我加了一张“作者处境提示卡”，基础弱的班理解更稳。',
    likes: 236,
    accepted: true,
    replies: [{ author: '作者', text: '这个很有用，我已经放到第二关前面了。' }],
  },
  {
    id: 'lin',
    author: '林若水',
    handle: '@林若水',
    text: '把第三关改成小组抢答后，孩子会主动用诗句解释“清白”。',
    likes: 128,
    accepted: true,
    replies: [{ author: '作者', text: '我照着改了，课堂节奏一下就活起来了。' }],
  },
  {
    id: 'chen',
    author: '陈思乔',
    handle: '@陈思乔',
    text: '我补了“梅花、竹子、石灰”三张迁移卡，课后练笔更自然。',
    likes: 95,
    accepted: true,
    replies: [{ author: '作者', text: '我已经把这组迁移卡一起打包进去了。' }],
  },
  {
    id: 'pudong',
    author: '浦东二小中语组',
    handle: '@浦东二小中语组',
    text: '建议下载包里附一页板书留白版，方便老师投屏后现场生成。',
    likes: 61,
    accepted: false,
    replies: [{ author: '作者', text: '收到，我把留白版和完整版分开打包。' }],
  },
  {
    id: 'amo',
    author: '阿茉老师',
    handle: '@阿茉老师',
    text: '我准备用在六年级复习托物言志，一节课串《竹石》和《墨梅》。',
    likes: 24,
    accepted: false,
  },
  {
    id: 'shen',
    author: '沈白露',
    handle: '@沈白露',
    text: '低年级想用的话要怎么减负？我怕孩子一开始就卡在“志向”这个词。',
    likes: 19,
    accepted: false,
    replies: [{ author: '周老师', text: '先只讲“物象-品质”，志向留到下一课再补。' }],
  },
]

type LineageNodeSize = 'root' | 'trunk' | 'branch' | 'leaf'

type LineageNode = {
  id: string
  parentId?: string
  label: string
  author: string
  x: number
  y: number
  size: LineageNodeSize
  color: string
  weight: number
}

const lineageNodes: LineageNode[] = [
  {
    id: 'root',
    label: '原创',
    author: '王清越',
    x: 50,
    y: 52,
    size: 'root',
    color: '#16846c',
    weight: 13,
  },
  {
    id: 'trunk-1',
    parentId: 'root',
    label: '换课文',
    author: '林若水',
    x: 27,
    y: 25,
    size: 'trunk',
    color: '#5b5fc7',
    weight: 12,
  },
  {
    id: 'branch-1-1',
    parentId: 'trunk-1',
    label: '结构迁移',
    author: '周老师',
    x: 15,
    y: 13,
    size: 'branch',
    color: '#5b5fc7',
    weight: 6,
  },
  {
    id: 'branch-1-2',
    parentId: 'trunk-1',
    label: '低准备版',
    author: '阿茉老师',
    x: 16,
    y: 39,
    size: 'branch',
    color: '#5b5fc7',
    weight: 5,
  },
  {
    id: 'leaf-1-3',
    parentId: 'trunk-1',
    label: '同题扩展',
    author: '顾北辰',
    x: 36,
    y: 13,
    size: 'leaf',
    color: '#5b5fc7',
    weight: 3,
  },
  {
    id: 'trunk-2',
    parentId: 'root',
    label: '降年级',
    author: '陈思乔',
    x: 72,
    y: 22,
    size: 'trunk',
    color: '#1489a8',
    weight: 10,
  },
  {
    id: 'branch-2-1',
    parentId: 'trunk-2',
    label: '词语减负',
    author: '沈白露',
    x: 84,
    y: 10,
    size: 'branch',
    color: '#1489a8',
    weight: 5,
  },
  {
    id: 'branch-2-2',
    parentId: 'trunk-2',
    label: '板书优化',
    author: '李明澈',
    x: 87,
    y: 31,
    size: 'branch',
    color: '#1489a8',
    weight: 4,
  },
  {
    id: 'trunk-3',
    parentId: 'root',
    label: '加背景',
    author: '浦东二小中语组',
    x: 80,
    y: 59,
    size: 'trunk',
    color: '#b84b57',
    weight: 8,
  },
  {
    id: 'branch-3-1',
    parentId: 'trunk-3',
    label: '先导卡',
    author: '周青禾',
    x: 91,
    y: 49,
    size: 'branch',
    color: '#b84b57',
    weight: 4,
  },
  {
    id: 'branch-3-2',
    parentId: 'trunk-3',
    label: '课堂收束',
    author: '顾晓晓',
    x: 88,
    y: 75,
    size: 'branch',
    color: '#b84b57',
    weight: 4,
  },
  {
    id: 'trunk-4',
    parentId: 'root',
    label: '加活动',
    author: '中关村三小语文组',
    x: 25,
    y: 72,
    size: 'trunk',
    color: '#2b82c5',
    weight: 11,
  },
  {
    id: 'branch-4-1',
    parentId: 'trunk-4',
    label: '公开课',
    author: '王崧舟',
    x: 12,
    y: 62,
    size: 'branch',
    color: '#2b82c5',
    weight: 5,
  },
  {
    id: 'branch-4-2',
    parentId: 'trunk-4',
    label: '互动加深',
    author: '小满老师',
    x: 15,
    y: 88,
    size: 'branch',
    color: '#2b82c5',
    weight: 5,
  },
  {
    id: 'leaf-4-3',
    parentId: 'branch-4-2',
    label: '小组共创',
    author: '南山小学低语组',
    x: 30,
    y: 91,
    size: 'leaf',
    color: '#2b82c5',
    weight: 3,
  },
  {
    id: 'trunk-5',
    parentId: 'root',
    label: '加练习',
    author: '顾北辰',
    x: 52,
    y: 84,
    size: 'trunk',
    color: '#0c8a70',
    weight: 7,
  },
  {
    id: 'branch-5-1',
    parentId: 'trunk-5',
    label: '同类迁移',
    author: '叶枝枝',
    x: 43,
    y: 96,
    size: 'branch',
    color: '#0c8a70',
    weight: 4,
  },
  {
    id: 'branch-5-2',
    parentId: 'trunk-5',
    label: '课后延伸',
    author: '南山小学低语组',
    x: 67,
    y: 93,
    size: 'branch',
    color: '#0c8a70',
    weight: 4,
  },
  {
    id: 'leaf-5-3',
    parentId: 'branch-5-1',
    label: '学生作品',
    author: '二年级班级',
    x: 35,
    y: 85,
    size: 'leaf',
    color: '#0c8a70',
    weight: 2,
  },
]

function App() {
  const [activePage, setActivePage] = useState<PageMode>('feed')
  const [activeTopTab, setActiveTopTab] = useState<TopNavTab>('推荐')
  const [detailCard, setDetailCard] = useState<InspirationCard | null>(null)
  const [isFuelDialogOpen, setIsFuelDialogOpen] = useState(false)
  const [isFuelCardVisible, setIsFuelCardVisible] = useState(true)
  const [isMonthlyReportTeaserOpen, setIsMonthlyReportTeaserOpen] = useState(false)
  const [hasSeenMonthlyReport, setHasSeenMonthlyReport] = useState(false)
  const [isMonthlyReportOpen, setIsMonthlyReportOpen] = useState(false)
  const [activeMonthlyReportPage, setActiveMonthlyReportPage] = useState(0)
  const [monthlyReportScale, setMonthlyReportScale] = useState(() =>
    getMonthlyReportScale(window.innerWidth, window.innerHeight),
  )
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false)
  const [activeActivityScope, setActiveActivityScope] = useState<ActivityScope>('社区')
  const [selectedFuelWork, setSelectedFuelWork] = useState<FuelWorkTitle>(fuelWorks[0].title)
  const [selectedFuelMedia, setSelectedFuelMedia] = useState<FuelMediaType>('图片')
  const [activeTrendZone, setActiveTrendZone] = useState<TrendZone>('全部')
  const [isFeedFilterOpen, setIsFeedFilterOpen] = useState(false)
  const [isTeacherFilterOpen, setIsTeacherFilterOpen] = useState(false)
  const [feedSort, setFeedSort] = useState<FeedSortOption>('综合')
  const [resourceType, setResourceType] = useState<ResourceTypeOption>('不限')
  const [publishTime, setPublishTime] = useState<PublishTimeOption>('不限')
  const [teacherVerifiedOnly, setTeacherVerifiedOnly] = useState(false)
  const [teacherLocalOnly, setTeacherLocalOnly] = useState(false)
  const [feedSeed, setFeedSeed] = useState(0)
  const [teacherSeed, setTeacherSeed] = useState(0)
  const [activeTeacherRank, setActiveTeacherRank] = useState<TeacherRankTab>('月度贡献榜')
  const [isTeacherRankPinned, setIsTeacherRankPinned] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isBottomComposerVisible, setIsBottomComposerVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchBoxRef = useRef<HTMLDivElement | null>(null)
  const pullStartY = useRef<number | null>(null)
  const isFollowingFeed = activeTopTab === '关注'
  const isRecommendFeed = activeTopTab === '推荐'
  const isTeacherFeed = activeTopTab === '达人教师'
  const isAcademyFeed = activeTopTab === '飞象学院'
  const activeFilter: FeedMode = isFollowingFeed ? '我的关注' : '全部'
  const activeTeacherCard = cards.find((card) => card.author === '王清越') ?? cards[0]
  const activeFeedFilterCount = [feedSort !== '综合', resourceType !== '不限', publishTime !== '不限'].filter(Boolean).length
  const activeTeacherFilterCount = [teacherVerifiedOnly, teacherLocalOnly].filter(Boolean).length
  const visibleTeacherProfiles = useMemo(
    () =>
      rotateTeacherProfiles(teacherProfiles, teacherSeed)
        .filter((teacher) => !teacherVerifiedOnly || teacher.badge === '已认证')
        .filter((teacher) => !teacherLocalOnly || teacher.location.includes('北京')),
    [teacherLocalOnly, teacherSeed, teacherVerifiedOnly],
  )
  const teacherFeedCards = useMemo<TeacherFeedCard[]>(() => {
    const source = visibleTeacherProfiles.length > 0 ? visibleTeacherProfiles : teacherProfiles
    const repeatedTeacherPool = Array.from({ length: 30 }, (_, index) => source[index % source.length])

    return repeatedTeacherPool.map((teacher, index) => ({
      id: `${teacher.name}-${index}`,
      teacher,
      placement: index === 0 ? 'lead' : index === 14 ? 'trail' : 'standard',
    }))
  }, [visibleTeacherProfiles])
  const visibleCards = useMemo(
    () => extendFeed(applyFeedSort(rankCards(activeFilter, feedSeed, searchQuery), feedSort), activeFilter, feedSeed),
    [activeFilter, feedSeed, feedSort, searchQuery],
  )

  useEffect(() => {
    if (!isFuelDialogOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFuelDialogOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isFuelDialogOpen])

  useEffect(() => {
    if (!isMonthlyReportOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMonthlyReportOpen(false)
      }
    }

    const updateScale = () => {
      setMonthlyReportScale(getMonthlyReportScale(window.innerWidth, window.innerHeight))
    }

    window.addEventListener('keydown', handleKeyDown)
    updateScale()
    window.addEventListener('resize', updateScale)
    window.visualViewport?.addEventListener('resize', updateScale)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', updateScale)
      window.visualViewport?.removeEventListener('resize', updateScale)
      document.body.style.overflow = previousOverflow
    }
  }, [isMonthlyReportOpen])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!isSearchPanelOpen) return
      const target = event.target as Node
      if (searchBoxRef.current?.contains(target)) return
      setIsSearchPanelOpen(false)
    }

    window.addEventListener('pointerdown', handlePointerDown)
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [isSearchPanelOpen])

  useEffect(() => {
    if (!isTeacherFeed || isTeacherRankPinned) return

    const intervalId = window.setInterval(() => {
      setActiveTeacherRank((currentRank) => {
        const currentIndex = teacherRankSections.findIndex((section) => section.title === currentRank)
        const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % teacherRankSections.length
        return teacherRankSections[nextIndex].title
      })
    }, 5000)

    return () => window.clearInterval(intervalId)
  }, [isTeacherFeed, isTeacherRankPinned])

  function pinTeacherRank(rank: TeacherRankTab) {
    setActiveTeacherRank(rank)
    setIsTeacherRankPinned(true)
  }

  function releaseTeacherRank() {
    setIsTeacherRankPinned(false)
  }

  function beginPull(event: React.PointerEvent<HTMLElement>) {
    if (isRefreshing || event.button > 0) return
    if (isInteractiveElement(event.target)) return

    if (event.currentTarget.scrollTop <= 0) {
      pullStartY.current = event.clientY
    }
  }

  function updatePull(event: React.PointerEvent<HTMLElement>) {
    if (pullStartY.current === null || event.currentTarget.scrollTop > 0) return

    const distance = event.clientY - pullStartY.current
    if (distance > 0) {
      setPullDistance(Math.min(96, distance * 0.42))
    }
  }

  function finishPull() {
    if (pullDistance > 58) {
      refreshFeed()
    } else {
      setPullDistance(0)
    }

    pullStartY.current = null
  }

  function refreshFeed() {
    if (isRefreshing) return

    setIsRefreshing(true)
    setFeedSeed((seed) => seed + 1)
    window.setTimeout(() => {
      setIsRefreshing(false)
      setPullDistance(0)
    }, 620)
  }

  function refreshTeacherFeed() {
    setTeacherSeed((seed) => seed + 1)
  }

  function openMonthlyReport() {
    setIsMonthlyReportTeaserOpen(false)
    setActiveMonthlyReportPage(0)
    setIsMonthlyReportOpen(true)
  }

  function closeMonthlyReport() {
    setIsMonthlyReportOpen(false)
  }

  function closeMonthlyReportTeaser() {
    setIsMonthlyReportTeaserOpen(false)
  }

  function turnMonthlyReportPage(direction: -1 | 1) {
    setActiveMonthlyReportPage((page) => {
      const nextPage = page + direction
      if (nextPage < 0) return 0
      if (nextPage >= monthlyReportPages.length) return monthlyReportPages.length - 1
      return nextPage
    })
  }

  function handleWorkspaceScroll(event: React.UIEvent<HTMLElement>) {
    setIsBottomComposerVisible(event.currentTarget.scrollTop > 260)
  }

  if (activePage === 'limestoneActivity') {
    return (
      <LimestoneActivityPage
        onBack={() => {
          setActivePage('feed')
          setDetailCard(null)
        }}
      />
    )
  }

  return (
    <main className={`app-shell ${detailCard ? 'detail-mode' : ''} ${activePage === 'profile' ? 'profile-mode' : ''}`}>
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand">飞象老师</div>
          <PanelLeft size={18} />
        </div>
        <button className="new-task" type="button">
          <Sparkles size={16} />
          新建任务
        </button>
        <nav className="primary-nav" aria-label="主要功能">
          <a className="active" href="#">
            <ImagePlus size={17} />
            <span>AI互动课件</span>
          </a>
          <a href="#">
            <BookOpen size={17} />
            <span>AI命题</span>
          </a>
          <a href="#">
            <WandSparkles size={17} />
            <span>AI组题</span>
          </a>
          <a href="#">
            <Star size={17} />
            <span>AI教案 · 大单元</span>
          </a>
        </nav>
        <section className="history">
          <div className="section-title">
            <span>历史任务</span>
            <Search size={15} />
          </div>
          {tasks.map((task) => (
            <div className="task-row" key={task}>
              <MessageCircle size={14} />
              <span>{task}</span>
            </div>
          ))}
        </section>
        <div className="sidebar-bottom">
          {isFuelCardVisible && (
            <section className="fuel-card" aria-label="教师加油站">
              <button className="fuel-close" type="button" title="关闭" onClick={() => setIsFuelCardVisible(false)}>
                <X size={14} />
              </button>
              <div className="fuel-card-head">
                <span className="fuel-kicker">教师加油站·第4期</span>
                <strong>分享教学灵感</strong>
              </div>
              <div className="fuel-reward">
                <span className="fuel-reward-label">本期奖励</span>
                <strong>+100</strong>
              </div>
              <p>把作品发布为一条教学灵感，与更多老师分享教学设计思路。</p>
              <div className="fuel-meta">
                <span>已领 1 天</span>
                <span>8/24 结束</span>
              </div>
              <button className="fuel-action" type="button" onClick={() => setIsFuelDialogOpen(true)}>
                去试试
              </button>
            </section>
          )}
          <div className="profile-dock">
            <button
              className="profile-strip"
              type="button"
              onClick={() => {
                setActivePage('profile')
                setDetailCard(null)
              }}
            >
              <UserAvatar name="王清越" className="avatar teacher-avatar" />
              <div>
                <strong>王清越</strong>
                <span>剩余积分：1194</span>
              </div>
            </button>
            <button
              className={`fuel-recall ${!isFuelCardVisible ? 'has-new' : ''}`}
              type="button"
              title="查看新活动"
              onClick={() => setIsFuelCardVisible(true)}
            >
              <Bell size={17} />
              <i />
            </button>
            <button
              className={`monthly-report-entry${hasSeenMonthlyReport ? '' : ' has-new'}`}
              type="button"
              title="查看月教学月志"
              onClick={() => { setIsMonthlyReportTeaserOpen(true); setHasSeenMonthlyReport(true) }}
            >
              <Mail size={17} />
              <i />
            </button>
            {isMonthlyReportTeaserOpen && (
              <div className="monthly-report-teaser" role="dialog" aria-label="月教学月志">
                <button
                  className="monthly-report-teaser-close"
                  type="button"
                  title="关闭"
                  onClick={closeMonthlyReportTeaser}
                >
                  <X size={13} />
                </button>
                <div className="monthly-report-teaser-head">
                  <span className="monthly-report-teaser-tag">
                    <Mail size={11} />
                    8月
                  </span>
                </div>
                <strong>查收本月教学月志</strong>
                <p>已为你准备好 8 月的教学月志，点开看看这段时间的沉淀。</p>
                <button className="monthly-report-teaser-action" type="button" onClick={openMonthlyReport}>
                  展开月志
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {isMonthlyReportOpen && (
        <div className="monthly-report-layer" role="dialog" aria-modal="true" aria-label="8月创作者月报">
          <button
            className="monthly-report-backdrop"
            type="button"
            aria-label="关闭月报"
            onClick={closeMonthlyReport}
          />
          <section
            className="monthly-report-shell"
            style={{ '--monthly-report-scale': `${monthlyReportScale}` } as CSSProperties}
          >
            <div className="monthly-report-stage">
              <button
                className="monthly-report-nav monthly-report-nav--left"
                type="button"
                title="上一页"
                onClick={() => turnMonthlyReportPage(-1)}
                disabled={activeMonthlyReportPage === 0}
              >
                <ChevronLeft size={22} />
              </button>
              <div className="monthly-report-canvas">
                <MonthlyReportPoster pageIndex={activeMonthlyReportPage} onClose={closeMonthlyReport} />
              </div>
              <button
                className="monthly-report-nav monthly-report-nav--right"
                type="button"
                title="下一页"
                onClick={() => turnMonthlyReportPage(1)}
                disabled={activeMonthlyReportPage === monthlyReportPages.length - 1}
              >
                <ChevronRight size={22} />
              </button>
            </div>
            <div className="monthly-report-dots" aria-label="月报页码">
              {monthlyReportPages.map((page, index) => (
                <button
                  className={index === activeMonthlyReportPage ? 'is-active' : ''}
                  type="button"
                  key={page.title}
                  title={page.title}
                  onClick={() => setActiveMonthlyReportPage(index)}
                />
              ))}
            </div>
          </section>
        </div>
      )}

      {detailCard ? (
        <ResourceDetailPage
          card={detailCard}
          onBack={() => setDetailCard(null)}
          onOpenActivity={() => {
            setActivePage('limestoneActivity')
            setDetailCard(null)
          }}
        />
      ) : activePage === 'profile' ? (
        <TeacherProfilePage
          card={activeTeacherCard}
          onOpenCard={setDetailCard}
          onOpenFeed={() => {
            setActivePage('feed')
            setDetailCard(null)
          }}
        />
      ) : (
        <section
          className="workspace"
          onPointerDown={beginPull}
          onPointerMove={updatePull}
          onPointerUp={finishPull}
          onPointerCancel={finishPull}
          onScroll={handleWorkspaceScroll}
        >
          <div className={`refresh-veil ${isRefreshing ? 'show' : ''}`} aria-hidden={!isRefreshing}>
            <RefreshCw size={22} />
            <span>正在发现新灵感</span>
          </div>
          <div
            className={`pull-refresh ${pullDistance > 58 || isRefreshing ? 'ready' : ''}`}
            style={{ transform: `translateY(${Math.max(0, pullDistance - 44)}px)` }}
          >
            <RefreshCw size={14} />
            <span>{isRefreshing ? '正在刷新灵感流' : pullDistance > 58 ? '松开刷新' : '下拉刷新'}</span>
          </div>
          <div className="workspace-flow" style={{ transform: `translateY(${pullDistance * 0.36}px)` }}>
            <section className="market">
              <div className="home-sticky-panel">
                <section className="prompt-area">
                  <div className="assistant-title">
                    <div className="assistant-mark">
                      <img src={feixiangLogo} alt="飞象老师" />
                    </div>
                    <h1>飞象老师，一句话生成专业级互动课件</h1>
                  </div>
                  <div className="prompt-box">
                    <p>
                      互动课件｜帮我生成初英人教七下U1 Grammar Focus的互动课，通过精简而高效的语言活动，帮助学生掌握并巩固词汇、句型及原因状语从句。
                    </p>
                    <div className="prompt-actions">
                      <button type="button" className="circle-button">
                        <ImagePlus size={19} />
                      </button>
                      <span>教学动画</span>
                      <span>教育应用 BETA</span>
                      <span>教学游戏</span>
                      <span>互动课件</span>
                      <span>数据回收</span>
                      <div className="send-actions">
                        <button type="button" className="circle-button subtle">
                          <Mic size={18} />
                        </button>
                        <button type="button" className="send-button">
                          <SendHorizontal size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="market-topbar">
                <div className="tabs" aria-label="灵感流分类">
                  {topNavTabs.map((tab) => (
                    <button
                      className={tab === activeTopTab ? 'selected' : ''}
                      type="button"
                      key={tab}
                      onClick={() => setActiveTopTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="search-shell" ref={searchBoxRef}>
                  <label
                    className={`search-box ${isSearchPanelOpen ? 'is-open' : ''}`}
                    onClick={() => setIsSearchPanelOpen(true)}
                  >
                    <Search size={17} />
                    <input
                      placeholder="搜索课文、学科、课堂场景"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      onFocus={() => setIsSearchPanelOpen(true)}
                    />
                  </label>
                  {isSearchPanelOpen && (
                    <SearchDropdown
                      onClose={() => setIsSearchPanelOpen(false)}
                      onPick={(value) => {
                        setSearchQuery(value)
                        setIsSearchPanelOpen(false)
                      }}
                    />
                  )}
                </div>
                </div>

                {!isAcademyFeed && (
                  <>
              {isRecommendFeed && (
                <section className="trend-zone-strip" aria-label="老师常看的备课专区">
                  <div className="trend-zone-row">
                    {trendZones.map((zone) => (
                      <button
                        className={zone.title === activeTrendZone ? 'selected' : ''}
                        type="button"
                        key={zone.title}
                        onClick={() => {
                          setActiveTrendZone(zone.title)
                          setActiveTopTab('推荐')
                        }}
                      >
                        {zone.title}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {isFollowingFeed && (
                <section className="follow-strip" aria-label="已关注老师更新">
                  <div className="follow-strip-head">
                    <strong>已关注</strong>
                    <span>最近有更新的老师</span>
                  </div>
                  <div className="follow-strip-row">
                    {followedTeachers.map((teacher) => (
                      <button className="follow-chip" type="button" key={teacher.id}>
                        <UserAvatar name={teacher.name} fallback={teacher.initial} className="follow-avatar" style={{ background: teacher.background }}>
                          {teacher.updated && <i className="follow-dot" aria-hidden="true" />}
                        </UserAvatar>
                        <span>{teacher.id}</span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {isRecommendFeed && (
                <div className="feed-heading">
                  <div>
                    <h2>发现下节课的灵感</h2>
                    <p>根据你的学科、关注和最近任务推荐</p>
                  </div>
                  <div className="signal-row">
                    <div className="filter-shell">
                      <button
                        className={`feed-filter-button ${activeFeedFilterCount > 0 ? 'has-filters' : ''}`}
                        type="button"
                        onClick={() => setIsFeedFilterOpen((value) => !value)}
                      >
                        <SlidersHorizontal size={15} />
                        筛选
                        {activeFeedFilterCount > 0 ? <span>{activeFeedFilterCount}</span> : null}
                      </button>
                      {isFeedFilterOpen ? (
                        <div className="filter-popover feed-filter-popover">
                          <FilterOptionGroup
                            title="排序依据"
                            options={feedSortOptions}
                            value={feedSort}
                            onChange={(value) => setFeedSort(value as FeedSortOption)}
                          />
                          <FilterOptionGroup
                            title="资源类型"
                            options={resourceTypeOptions}
                            value={resourceType}
                            onChange={(value) => setResourceType(value as ResourceTypeOption)}
                          />
                          <FilterOptionGroup
                            title="发布时间"
                            options={publishTimeOptions}
                            value={publishTime}
                            onChange={(value) => setPublishTime(value as PublishTimeOption)}
                          />
                        </div>
                      ) : null}
                    </div>
                    <button
                      className={`feed-refresh-button ${isRefreshing ? 'refreshing' : ''}`}
                      type="button"
                      onClick={refreshFeed}
                      title="换一批灵感"
                    >
                      <RefreshCw size={15} />
                      换一批
                    </button>
                  </div>
                </div>
              )}

                  </>
                )}
              </div>

              {isAcademyFeed ? (
                <AcademyPage />
              ) : (
                <>
              {isRecommendFeed && (
                <section className="activity-strip" aria-label="社区活动与热度榜">
                  <button
                    className="activity-banner"
                    type="button"
                    onClick={() => {
                      setActivePage('limestoneActivity')
                      setDetailCard(null)
                    }}
                  >
                    <img className="activity-banner-image" src={activityBanner} alt="《石灰吟》同题创作活动横幅" />
                    <div className="activity-banner-caption">
                      <div className="activity-banner-caption-main">
                        <span className="suggest-activity">活动</span>
                        <strong>《石灰吟》怎么上才精彩？</strong>
                      </div>
                      <span className="activity-banner-caption-sub">投稿优秀作品，赢丰厚积分</span>
                    </div>
                  </button>

                  <aside className="activity-rank">
                    <div className="activity-rank-head">
                      <div>
                        <strong>大家在关心</strong>
                        <span>老师最近在搜、在做、在带的话题</span>
                      </div>
                      <div className="activity-scope-tabs">
                        {(['社区', '我的'] as ActivityScope[]).map((scope) => (
                          <button
                            key={scope}
                            type="button"
                            className={scope === activeActivityScope ? 'selected' : ''}
                            onClick={() => setActiveActivityScope(scope)}
                          >
                            {scope}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="activity-rank-list">
                      {activityTrendSources[activeActivityScope].map((item) => (
                        <button className="activity-rank-item" type="button" key={`${activeActivityScope}-${item.title}`}>
                          <span className={`activity-rank-index tone-${item.tone}`}>{item.label}</span>
                          <div className="activity-rank-copy">
                            <strong>
                              {activeActivityScope === '社区' && item.label === '1' ? <span className="suggest-activity">活动</span> : null}
                              <span>{item.title}</span>
                            </strong>
                            <span>{item.count}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </aside>
                </section>
              )}

              {isTeacherFeed ? (
                <>
                  <div className="teacher-feed-toolbar">
                    <div className="signal-row teacher-feed-toolbar-actions">
                      <div className="filter-shell">
                        <button
                          className={`feed-filter-button ${activeTeacherFilterCount > 0 ? 'has-filters' : ''}`}
                          type="button"
                          onClick={() => setIsTeacherFilterOpen((value) => !value)}
                        >
                          <SlidersHorizontal size={15} />
                          筛选
                          {activeTeacherFilterCount > 0 ? <span>{activeTeacherFilterCount}</span> : null}
                        </button>
                        {isTeacherFilterOpen ? (
                          <div className="filter-popover teacher-filter-popover">
                            <button
                              className={`switch-filter ${teacherVerifiedOnly ? 'selected' : ''}`}
                              type="button"
                              onClick={() => setTeacherVerifiedOnly((value) => !value)}
                            >
                              <span>只看已认证</span>
                              <i />
                            </button>
                            <button
                              className={`switch-filter ${teacherLocalOnly ? 'selected' : ''}`}
                              type="button"
                              onClick={() => setTeacherLocalOnly((value) => !value)}
                            >
                              <span>只看本地</span>
                              <i />
                            </button>
                          </div>
                        ) : null}
                      </div>
                      <button className="feed-refresh-button" type="button" onClick={refreshTeacherFeed} title="换一批老师">
                        <RefreshCw size={15} />
                        换一批
                      </button>
                    </div>
                    <section className="teacher-rank-grid" aria-label="达人教师榜单">
                      {teacherRankSections.map((section) => {
                        const isActiveRank = activeTeacherRank === section.title
                        const rankStateClass = isActiveRank ? 'is-active' : 'is-muted'

                        return (
                          <article
                            className={`teacher-rank-card teacher-rank-card--${section.tone} ${rankStateClass} ${
                              isActiveRank && isTeacherRankPinned ? 'is-pinned' : ''
                            }`}
                            key={section.title}
                            onPointerEnter={() => pinTeacherRank(section.title)}
                            onPointerLeave={releaseTeacherRank}
                            onFocus={() => pinTeacherRank(section.title)}
                            onBlur={releaseTeacherRank}
                            onClick={() => pinTeacherRank(section.title)}
                          >
                            <div className="teacher-rank-card-head">
                              <strong>
                                {section.title}
                                {isActiveRank && isTeacherRankPinned ? <i aria-hidden="true" /> : null}
                              </strong>
                              <button
                                className="teacher-rank-help"
                                type="button"
                                aria-label={`${section.title}说明`}
                                data-tip={section.tip}
                              >
                                <HelpCircle size={14} />
                              </button>
                            </div>
                            <div className="teacher-rank-list" aria-label={`${section.title}前五`}>
                              {teacherRankings[section.title].slice(0, 5).map((item, index) => {
                                const rank = index + 1
                                return (
                                  <div className={`teacher-rank-item ${rank === 1 ? 'is-top' : ''}`} key={`${section.title}-${item.name}`}>
                                    <span className={`teacher-rank-index rank-${rank}`}>{rank}</span>
                                    <span className="teacher-rank-name">{item.name}</span>
                                    <strong className="teacher-rank-score">{item.score}</strong>
                                  </div>
                                )
                              })}
                            </div>
                          </article>
                        )
                      })}
                    </section>
                  </div>
                  <HighlightEventStrip events={highlightEvents} />
                  <section className="teacher-grid" aria-label="达人教师信息流">
                    {teacherFeedCards.map((entry) => (
                      <TeacherProfileCard
                        teacher={entry.teacher}
                        placement={entry.placement}
                        key={entry.id}
                        onOpenCard={setDetailCard}
                        onOpenProfile={() => {
                          setActivePage('profile')
                          setDetailCard(null)
                        }}
                      />
                    ))}
                    {Array.from({ length: 4 }, (_, index) => (
                      <TeacherLoaderCard key={`teacher-loader-${index}`} index={index} />
                    ))}
                  </section>
                </>
              ) : (
                <section className="card-grid" aria-label="AI教学灵感流">
                  {visibleCards.length > 0 ? (
                    <MasonryFeed
                      cards={visibleCards}
                      onOpenCard={setDetailCard}
                      onOpenProfile={() => {
                        setActivePage('profile')
                        setDetailCard(null)
                      }}
                    />
                  ) : (
                    <div className="search-empty">没有找到匹配的灵感卡，换个关键词试试。</div>
                  )}
                </section>
              )}
                </>
              )}
            </section>
          </div>
          {isBottomComposerVisible && !isTeacherFeed && !isAcademyFeed && (
            <section className="bottom-composer" aria-label="快速制作资源">
              <Sparkles size={17} />
              <span>教学游戏｜以《石灰吟》闯关为基础，生成本年级课文的互动资源，让学生边玩边学</span>
              <button type="button" className="circle-button subtle" title="语音输入">
                <Mic size={16} />
              </button>
              <button type="button" className="send-button" title="开始生成">
                <SendHorizontal size={17} />
              </button>
            </section>
          )}
        </section>
      )}
      {isFuelDialogOpen && (
        <FuelPublishDialog
          selectedFuelMedia={selectedFuelMedia}
          selectedFuelWork={selectedFuelWork}
          onChangeMedia={setSelectedFuelMedia}
          onChangeWork={setSelectedFuelWork}
          onClose={() => setIsFuelDialogOpen(false)}
        />
      )}
    </main>
  )
}

function UserAvatar({
  name,
  fallback,
  className = 'avatar',
  style,
  title,
  children,
}: {
  name: string
  fallback?: string
  className?: string
  style?: CSSProperties
  title?: string
  children?: ReactNode
}) {
  const image = avatarImageByName[name]

  return (
    <div className={`${className} ${image ? 'avatar-photo' : ''}`} style={style} title={title ?? name}>
      {image ? <img src={image} alt="" /> : fallback ?? name.slice(0, 1)}
      {children}
    </div>
  )
}

function AcademyPage() {
  const [learningScope, setLearningScope] = useState<AcademyLearningScope>('本期')

  return (
    <section className="academy-page" aria-label="飞象学院">
      <section className="academy-hero-row" aria-label="飞象学院头图与学习数据">
        <section className="academy-hero" aria-label="AI 赋能古诗词沉浸式教学工作坊">
          <img className="academy-banner-image" src={academyBanner} alt="飞象学院工作坊头图" />
          <div className="academy-banner-status" aria-label="工作坊状态">
            {academyWorkshopStatus.map((status) => (
              <span key={status}>{status}</span>
            ))}
          </div>
          <div className="academy-banner-stats" aria-label="工作坊数据">
            {academyWorkshopStats.map((stat) => (
              <div className="academy-banner-stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>
                  {stat.label}
                  <em>{stat.unit}</em>
                </span>
              </div>
            ))}
          </div>
        </section>
        <aside className="academy-learning-panel" aria-label="学习中心">
          <div className="academy-learning-head">
            <strong>学习中心</strong>
            <div className="academy-learning-tabs" role="tablist" aria-label="学习数据范围">
              {(['本期', '全部'] as AcademyLearningScope[]).map((scope) => (
                <button
                  className={scope === learningScope ? 'selected' : ''}
                  key={scope}
                  type="button"
                  role="tab"
                  aria-selected={scope === learningScope}
                  onClick={() => setLearningScope(scope)}
                >
                  {scope}
                </button>
              ))}
            </div>
          </div>
          <div className="academy-learning-grid">
            {academyLearningStats[learningScope].map((stat) => (
              <div className="academy-learning-stat" key={stat.label}>
                <div>
                  <span>{stat.label}</span>
                </div>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
          {learningScope === '本期' && (
            <button className="academy-submit-work" type="button">
              <span>提交本期作品</span>
              <SendHorizontal size={16} />
            </button>
          )}
        </aside>
      </section>

      <section className="academy-course-section" aria-label="学院课程">
        <div className="academy-course-section-head">
          <button className="academy-past-link" type="button" aria-label="查看往期课程">
            往期课程
            <ChevronRight size={15} />
          </button>
        </div>
        <div className="academy-course-grid">
          <article className="academy-course-card academy-course-card--rose">
            <div className="academy-course-topline">
              <h2 className="academy-course-label">专家课</h2>
            </div>
            <div className="academy-course-cover">
              <img src={academyExpertCourse.cover} alt={academyExpertCourse.title} />
              <button className="academy-course-play" type="button" aria-label="播放专家课">
                <Play size={24} fill="currentColor" />
              </button>
              <span className="academy-course-duration">{academyExpertCourse.duration}</span>
            </div>
            <div className="academy-course-body">
              <div className="academy-course-head">
                <strong>{academyExpertCourse.title}</strong>
              </div>
              <div className="academy-course-person">
                <UserAvatar name={academyExpertCourse.instructor} className="academy-avatar academy-avatar--expert" />
                <div>
                  <strong>{academyExpertCourse.instructor}</strong>
                  <span>{academyExpertCourse.role}</span>
                  <em>{academyExpertCourse.proof}</em>
                </div>
              </div>
              <section className="academy-list-panel" aria-label="AI听课摘要">
                <h3>AI听课摘要</h3>
                <div className="academy-summary-list">
                  {academyCourseSummary.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </section>
            </div>
          </article>

          <article className="academy-course-card academy-course-card--green">
            <div className="academy-course-topline">
              <h2 className="academy-course-label">训练营</h2>
            </div>
            <div className="academy-course-cover academy-course-cover--camp">
              <img src={academyTrainingCamp.cover} alt={academyTrainingCamp.title} />
              <button className="academy-course-play" type="button" aria-label="进入训练营">
                <Play size={24} fill="currentColor" />
              </button>
              <span className="academy-course-duration">{academyTrainingCamp.duration}</span>
            </div>
            <div className="academy-course-body">
              <div className="academy-course-head">
                <strong>{academyTrainingCamp.title}</strong>
              </div>
              <div className="academy-course-person">
                <UserAvatar name={academyTrainingCamp.instructor} className="academy-avatar" />
                <div>
                  <strong>{academyTrainingCamp.instructor}</strong>
                  <span>{academyTrainingCamp.role}</span>
                  <em>{academyTrainingCamp.proof}</em>
                </div>
              </div>
              <h3 className="academy-resource-title">参考资源</h3>
              <div className="academy-resource-grid" aria-label="参考资源">
                {academyReferenceResources.map((resource) => (
                  <button className="academy-resource-card" type="button" key={resource.title}>
                    <img src={resource.image} alt={resource.title} />
                    <strong>{resource.title}</strong>
                    <span>{resource.meta}</span>
                  </button>
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="academy-section academy-outcomes">
        <div className="academy-section-title">
          <div>
            <h2>成果墙</h2>
          </div>
          <button type="button">
            查看全部
            <ChevronRight size={15} />
          </button>
        </div>
        <div className="academy-outcome-gallery" aria-label="成果墙轮播">
          <div className="academy-outcome-track">
            {[...academyOutcomes, ...academyOutcomes].map((outcome, index) => (
              <article className={`academy-outcome-card academy-outcome-card--${outcome.tone}`} key={`${outcome.title}-${index}`}>
                <div className="academy-outcome-cover">
                  <img src={outcome.image} alt={outcome.title} />
                  <span>{outcome.tag}</span>
                </div>
                <div className="academy-outcome-body">
                  <h3>{outcome.title}</h3>
                  <p>{outcome.author}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="academy-section academy-students">
        <div className="academy-section-title">
          <div>
            <h2>优秀学员</h2>
          </div>
        </div>
        <div className="academy-student-grid">
          {academyStudents.map((student) => (
            <article className="academy-student-card" key={student.name}>
              <div className="academy-avatar">{student.name.slice(0, 1)}</div>
              <div className="academy-student-main">
                <strong>{student.name}</strong>
                <span>{student.profile}</span>
                <em>{student.school}</em>
              </div>
              <div className="academy-student-stats">
                <span>{student.duration}</span>
                <span>{student.works}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

function FilterOptionGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string
  options: readonly string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <section className="filter-option-group">
      <strong>{title}</strong>
      <div className="filter-option-row">
        {options.map((option) => (
          <button
            className={option === value ? 'selected' : ''}
            type="button"
            key={option}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  )
}

function TeacherProfilePage({
  card,
  onOpenCard,
  onOpenFeed,
}: {
  card: InspirationCard
  onOpenCard: (card: InspirationCard) => void
  onOpenFeed: () => void
}) {
  const [addedSkills, setAddedSkills] = useState<string[]>([])
  const [keywordVotes, setKeywordVotes] = useState<Record<string, number>>({})
  const [isAgentOpen, setIsAgentOpen] = useState(false)
  const [isShareCardOpen, setIsShareCardOpen] = useState(false)
  const profileWorks = teacherProfileWorks
  const featuredSkills = teacherSkills
  const scrolledExpertQuotes = useMemo(() => [...teacherImpactQuotes, ...teacherImpactQuotes], [])

  useEffect(() => {
    if (!isShareCardOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsShareCardOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isShareCardOpen])

  function toggleSkill(title: string) {
    setAddedSkills((items) => (items.includes(title) ? items.filter((item) => item !== title) : [...items, title]))
  }

  function voteKeyword(label: string) {
    setKeywordVotes((items) => ({
      ...items,
      [label]: (items[label] ?? 0) + 1,
    }))
  }

  return (
    <section className="profile-page">
      <div className="profile-shell">
        <section className="profile-hero-card">
          <div className="profile-hero-actions">
            <button className="profile-back" type="button" onClick={onOpenFeed}>
              <ChevronLeft size={17} />
              返回首页
            </button>
            <button className="profile-share-button" type="button" onClick={() => setIsShareCardOpen(true)}>
              <Share2 size={15} />
              分享主页
            </button>
          </div>
          <div className="profile-hero-body">
            <div className="profile-head">
              <UserAvatar name="王清越" className="profile-avatar" />
              <div className="profile-head-copy">
                <div className="profile-name-row">
                  <h1>王清越</h1>
                  <span className="verified-badge">
                    <BadgeCheck size={14} strokeWidth={2.8} />
                  </span>
                </div>
                <div className="profile-headline">
                  <span>中关村三小 · 语文教师</span>
                </div>
                <div className="profile-badges">
                  <span>飞象学院主讲人</span>
                </div>
                <p className="profile-summary-line">{profileHeroLine}</p>
              </div>
            </div>

            <div className="profile-metrics-row">
              <div className="profile-metrics">
                {teacherProfileStats.map((stat) => (
                  <div className="profile-metric" key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
              <div className="profile-social-cluster">
                <div
                  className="profile-group-entry"
                  aria-label="王清越的群聊，语文共备社，27 位老师在线"
                >
                  <span className="profile-group-icon">
                    <Users size={18} />
                  </span>
                  <span>
                    <strong>群聊</strong>
                    <em>语文共备社</em>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {isShareCardOpen ? (
          <ProfileShareCard
            works={profileWorks.slice(0, 4)}
            onClose={() => setIsShareCardOpen(false)}
            onOpenCard={onOpenCard}
            fallbackCard={card}
          />
        ) : null}

        <section className="profile-section profile-section--featured">
          <div className="section-head">
            <h2>代表作品</h2>
          </div>
          <div className="featured-layout">
            <button
              className="featured-card featured-card--lead"
              type="button"
              onClick={() => onOpenCard(cards.find((item) => item.title === profileWorks[0].sourceTitle) ?? card)}
            >
              <div className="featured-lead-media">
                <img src={coverImageByTitle[profileWorks[0].sourceTitle]} alt="" />
              </div>
              <div className="featured-lead-copy">
                <strong>{profileWorks[0].title}</strong>
                <p>收藏 {profileWorks[0].savedCount} · 改编 {profileWorks[0].remixCount}</p>
              </div>
            </button>

            <div className="featured-stack">
              {profileWorks.slice(1).map((work) => (
                <button
                  className="featured-card featured-card--mini"
                  key={work.title}
                  type="button"
                  onClick={() => onOpenCard(cards.find((item) => item.title === work.sourceTitle) ?? card)}
                >
                  <div className="featured-mini-media">
                    <img src={coverImageByTitle[work.sourceTitle]} alt="" />
                  </div>
                  <div className="featured-mini-copy">
                    <strong>{work.title}</strong>
                    <p>
                      收藏 {work.savedCount} · 改编 {work.remixCount}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="profile-section profile-section--skills">
          <div className="section-head">
            <h2>教学经验</h2>
          </div>
          <div className="skill-rail">
            {featuredSkills.map((skill) => (
              <article className={`skill-row tone-${skill.tone}`} key={skill.title}>
                <div className="skill-row-top">
                  <div className="skill-index">{String(featuredSkills.indexOf(skill) + 1).padStart(2, '0')}</div>
                  <div className="skill-copy">
                    <strong>{skill.title}</strong>
                    <p>{skill.summary}</p>
                  </div>
                </div>

                <div className="skill-row-meta">
                  <span className="skill-meta-pill">{skill.metric}</span>
                  <span className="skill-meta-note">{skill.recommendation}</span>
                  <button
                    type="button"
                    className={`skill-library-button ${addedSkills.includes(skill.title) ? 'is-added' : ''}`}
                    onClick={() => toggleSkill(skill.title)}
                  >
                    {addedSkills.includes(skill.title) ? '已加入经验库' : '+ 添加到经验库'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="profile-section profile-section--impact">
          <div className="section-head">
            <h2>影响评价</h2>
          </div>
          <div className="impact-layout">
            <section className="impact-panel impact-panel--experts">
              <h3>专家评价</h3>
              <div className="impact-viewport">
                <div className="impact-track">
                  {scrolledExpertQuotes.map((quote, index) => (
                    <article className="impact-thread" key={`${quote.speaker}-${index}`}>
                      <UserAvatar name={quote.speaker} className="impact-avatar" />
                      <div className="impact-body">
                        <strong>{quote.speaker}</strong>
                        <p>{quote.text}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
            <section className="impact-panel impact-panel--peers">
              <div className="impact-panel-head">
                <h3>同行评价</h3>
                <button className="add-impression-btn" type="button">+ 添加印象</button>
                <div className="collaborator-stack" aria-label="最近留下评价的人">
                  {peerCollaborators.slice(0, 5).map((person, index) => (
                    <span
                      className="collaborator-avatar"
                      key={person.name}
                      style={{ background: person.background, marginLeft: index === 0 ? 0 : -8 }}
                    >
                      {person.name}
                    </span>
                  ))}
                  {peerCollaborators.length > 5 ? <span className="collaborator-more">...</span> : null}
                </div>
              </div>
              <div className="impact-cloud-map" aria-label="同行评价词云">
                {teacherPeerWords.map((word) => {
                  const count = word.count + (keywordVotes[word.label] ?? 0)
                  const tones: Record<PeerWord['tone'], string> = {
                    blue: '#2e78d6',
                    green: '#48b96a',
                    orange: '#f0a33a',
                    gray: '#c2cad6',
                  }
                  return (
                    <button
                      key={word.label}
                      type="button"
                      className={`impact-word impact-word--${word.size}`}
                      onClick={() => voteKeyword(word.label)}
                      style={
                        {
                          left: `${word.x}%`,
                          top: `${word.y}%`,
                          transform: `translate(-50%, -50%) rotate(${word.rotate ?? 0}deg)`,
                          ['--word-color' as string]: tones[word.tone],
                        } as CSSProperties
                      }
                    >
                      <span>{word.label}</span>
                      <em>({count})</em>
                    </button>
                  )
                })}
              </div>
            </section>
          </div>
        </section>
      </div>

      <aside className={`teacher-agent ${isAgentOpen ? 'is-open' : ''}`} aria-label="王清越的智能体">
        {!isAgentOpen ? (
          <button className="teacher-agent-hint" type="button" onClick={() => setIsAgentOpen(true)}>
            Hi，我是清越备课助手。要和我讨论教学思路吗？
          </button>
        ) : null}
        {isAgentOpen ? (
          <div className="teacher-agent-panel">
            <div className="teacher-agent-head">
              <div className="teacher-agent-mark">
                <span />
              </div>
              <div>
                <strong>清越备课助手</strong>
                <p>王清越创建的教学智能体</p>
              </div>
              <button type="button" aria-label="关闭智能体" onClick={() => setIsAgentOpen(false)}>
                <X size={15} />
              </button>
            </div>
            <div className="teacher-agent-chat">
              <p className="agent-bubble agent-bubble--bot">我可以把一首诗拆成闯关任务，也能帮你补一组表达支架。</p>
              <p className="agent-bubble agent-bubble--user">想做一节公开课。</p>
              <p className="agent-bubble agent-bubble--bot">可以，从情境导入、证据推理、小组表达三步起稿。</p>
            </div>
            <div className="teacher-agent-input">
              <span>问问她的教学方法</span>
              <SendHorizontal size={15} />
            </div>
          </div>
        ) : null}
        <button
          className="teacher-agent-launcher"
          type="button"
          aria-label="唤起清越备课助手"
          onClick={() => setIsAgentOpen((value) => !value)}
        >
          <span className="agent-face">
            <i />
          </span>
          <span className="agent-spark">
            <Sparkles size={15} />
          </span>
        </button>
      </aside>
    </section>
  )
}

function ProfileShareCard({
  works,
  onClose,
  onOpenCard,
  fallbackCard,
}: {
  works: TeacherProfileWork[]
  onClose: () => void
  onOpenCard: (card: InspirationCard) => void
  fallbackCard: InspirationCard
}) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadPoster = async () => {
    setIsDownloading(true)
    try {
      await downloadProfilePoster(works)
    } finally {
      window.setTimeout(() => setIsDownloading(false), 450)
    }
  }

  return (
    <div className="profile-share-layer" role="dialog" aria-modal="true" aria-label="分享主页卡片">
      <button className="profile-share-backdrop" type="button" aria-label="关闭分享卡片" onClick={onClose} />
      <section className="profile-share-card">
        <button className="profile-share-close" type="button" onClick={onClose} title="关闭">
          <X size={18} />
        </button>
        <div className="profile-share-modal-head">
          <span>分享主页</span>
          <strong>王清越的主页</strong>
        </div>
        <div className="profile-share-poster" aria-label="王清越主页分享海报">
          <div className="profile-share-brand">飞象老师社区</div>
          <div className="profile-share-head">
            <UserAvatar name="王清越" className="profile-share-avatar" />
            <div>
              <div className="profile-share-name">
                <strong>王清越</strong>
                <span>飞象学院主讲人</span>
              </div>
              <p>中关村三小 · 语文教师</p>
            </div>
          </div>
          <p className="profile-share-summary">{profileHeroLine}</p>
          <div className="profile-share-main">
            <div className="profile-share-qr-shell">
              <div className="profile-share-qr" aria-label="主页二维码">
                {shareQrCells.map((cell, index) => (
                  <i
                    className={cell === 'filled' ? 'is-filled' : cell === 'frame' ? 'is-frame' : ''}
                    key={index}
                  />
                ))}
              </div>
            </div>
            <div className="profile-share-copy">
              <strong>扫码进入主页</strong>
              <span>与我交流 AI 课堂实践</span>
              <em>feixiang.cn/teacher/wangqingyue</em>
            </div>
          </div>
          <div className="profile-share-works" aria-label="代表作品">
            {works.map((work) => {
              const workCard = cards.find((item) => item.title === work.sourceTitle) ?? fallbackCard

              return (
                <button
                  className="profile-share-work"
                  type="button"
                  key={work.title}
                  onClick={() => {
                    onClose()
                    onOpenCard(workCard)
                  }}
                >
                  <img src={coverImageByTitle[work.sourceTitle]} alt="" />
                  <span>{work.title}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="profile-share-actions">
          <button
            type="button"
            className="profile-share-download"
            onClick={handleDownloadPoster}
            disabled={isDownloading}
          >
            <Download size={15} />
            {isDownloading ? '正在生成海报' : '下载这张海报'}
          </button>
        </div>
      </section>
    </div>
  )
}

async function downloadProfilePoster(works: TeacherProfileWork[]) {
  const canvas = document.createElement('canvas')
  const scale = 2
  const width = 720
  const height = 940
  canvas.width = width * scale
  canvas.height = height * scale

  const context = canvas.getContext('2d')
  if (!context) return

  context.scale(scale, scale)
  context.fillStyle = '#eef5f1'
  context.fillRect(0, 0, width, height)

  const posterGradient = context.createLinearGradient(0, 0, width, height)
  posterGradient.addColorStop(0, '#fff3d4')
  posterGradient.addColorStop(0.52, '#fffef9')
  posterGradient.addColorStop(1, '#f4fbf7')
  context.fillStyle = posterGradient
  drawRoundRect(context, 30, 30, width - 60, height - 60, 36)
  context.fill()

  context.strokeStyle = 'rgba(198, 168, 92, 0.38)'
  context.lineWidth = 2
  drawRoundRect(context, 48, 48, width - 96, height - 96, 24)
  context.stroke()

  context.fillStyle = 'rgba(232, 177, 71, 0.2)'
  context.beginPath()
  context.arc(142, 70, 120, 0, Math.PI * 2)
  context.fill()
  context.strokeStyle = 'rgba(244, 198, 101, 0.22)'
  context.lineWidth = 34
  context.beginPath()
  context.arc(640, 40, 92, 0, Math.PI * 2)
  context.stroke()

  const profileAvatarImage = await loadPosterImage(wangQingyueAvatar)
  context.fillStyle = '#e7f4ed'
  context.beginPath()
  context.arc(112, 142, 45, 0, Math.PI * 2)
  context.fill()

  if (profileAvatarImage) {
    context.save()
    context.beginPath()
    context.arc(112, 142, 45, 0, Math.PI * 2)
    context.clip()
    drawCoverImage(context, profileAvatarImage, 67, 97, 90, 90)
    context.restore()
  }

  context.strokeStyle = 'rgba(255, 255, 255, 0.94)'
  context.lineWidth = 5
  context.stroke()

  context.textAlign = 'left'
  context.textBaseline = 'alphabetic'
  context.fillStyle = '#18392f'
  context.font = '900 42px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif'
  context.fillText('王清越', 180, 130)
  context.fillStyle = '#dff2ea'
  drawRoundRect(context, 314, 99, 132, 30, 15)
  context.fill()
  context.fillStyle = '#0c7357'
  context.font = '850 15px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif'
  context.fillText('飞象学院主讲人', 330, 120)
  context.fillStyle = '#60736d'
  context.font = '760 19px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif'
  context.fillText('中关村三小 · 语文教师', 180, 166)

  context.fillStyle = 'rgba(255, 255, 255, 0.68)'
  drawRoundRect(context, 68, 230, 584, 82, 18)
  context.fill()
  context.strokeStyle = 'rgba(220, 235, 227, 0.78)'
  context.lineWidth = 1
  context.stroke()
  context.fillStyle = '#314d44'
  context.font = '820 22px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif'
  context.fillText(profileHeroLine, 92, 278)

  const qrX = 82
  const qrY = 366
  context.fillStyle = 'rgba(255, 248, 226, 0.94)'
  drawRoundRect(context, 68, 346, 584, 238, 24)
  context.fill()
  context.strokeStyle = 'rgba(225, 210, 170, 0.95)'
  context.lineWidth = 2
  context.stroke()

  context.fillStyle = '#ffffff'
  drawRoundRect(context, qrX, qrY, 192, 192, 24)
  context.fill()
  context.strokeStyle = 'rgba(197, 166, 91, 0.2)'
  context.lineWidth = 2
  context.stroke()
  drawShareQr(context, qrX + 25, qrY + 25, 142)

  context.fillStyle = '#173a32'
  context.font = '900 34px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif'
  context.fillText('扫码进入主页', 318, 422)
  context.fillStyle = '#60736d'
  context.font = '760 19px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif'
  context.fillText('与我交流 AI 课堂实践', 318, 462)
  context.fillStyle = '#0b765b'
  context.font = '900 18px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif'
  context.fillText('feixiang.cn/teacher/wangqingyue', 318, 502)

  const imageEntries = await Promise.all(
    works.slice(0, 4).map(async (work) => ({
      work,
      image: await loadPosterImage(coverImageByTitle[work.sourceTitle]),
    })),
  )

  imageEntries.forEach(({ work, image }, index) => {
    const cardWidth = 134
    const cardX = 68 + index * (cardWidth + 16)
    const cardY = 640

    context.fillStyle = 'rgba(255, 255, 255, 0.92)'
    drawRoundRect(context, cardX, cardY, cardWidth, 182, 18)
    context.fill()
    context.strokeStyle = 'rgba(223, 233, 228, 0.95)'
    context.lineWidth = 1
    context.stroke()

    context.save()
    drawRoundRect(context, cardX + 10, cardY + 10, cardWidth - 20, 94, 13)
    context.clip()
    if (image) {
      drawCoverImage(context, image, cardX + 10, cardY + 10, cardWidth - 20, 94)
    } else {
      context.fillStyle = '#e7f4ed'
      context.fillRect(cardX + 10, cardY + 10, cardWidth - 20, 94)
    }
    context.restore()

    context.fillStyle = '#203b34'
    context.font = '850 15px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif'
    drawTextLine(context, work.title, cardX + 10, cardY + 134, cardWidth - 20)
    context.fillStyle = '#7d8e87'
    context.font = '750 13px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif'
    context.fillText(`收藏 ${work.savedCount}`, cardX + 10, cardY + 162)
  })

  context.fillStyle = '#82948d'
  context.font = '900 15px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif'
  context.textAlign = 'center'
  context.fillText('飞象老师社区', width / 2, 884)

  const link = document.createElement('a')
  link.download = '王清越-飞象主页海报.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}

function drawShareQr(context: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const gap = 3
  const cellSize = (size - gap * 12) / 13

  shareQrCells.forEach((cell, index) => {
    const row = Math.floor(index / 13)
    const col = index % 13
    const cellX = x + col * (cellSize + gap)
    const cellY = y + row * (cellSize + gap)

    if (cell === 'filled') {
      context.fillStyle = '#133b32'
      context.fillRect(cellX, cellY, cellSize, cellSize)
      return
    }

    if (cell === 'frame') {
      context.strokeStyle = '#133b32'
      context.lineWidth = 2
      context.strokeRect(cellX + 1, cellY + 1, cellSize - 2, cellSize - 2)
    }
  })
}

function drawRoundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath()
  context.moveTo(x + radius, y)
  context.arcTo(x + width, y, x + width, y + height, radius)
  context.arcTo(x + width, y + height, x, y + height, radius)
  context.arcTo(x, y + height, x, y, radius)
  context.arcTo(x, y, x + width, y, radius)
  context.closePath()
}

function drawCoverImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const imageRatio = image.width / image.height
  const targetRatio = width / height
  const drawWidth = imageRatio > targetRatio ? height * imageRatio : width
  const drawHeight = imageRatio > targetRatio ? height : width / imageRatio
  const drawX = x + (width - drawWidth) / 2
  const drawY = y + (height - drawHeight) / 2
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight)
}

function drawTextLine(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number) {
  let output = text

  while (output.length > 1 && context.measureText(output).width > maxWidth) {
    output = `${output.slice(0, -2)}…`
  }

  context.fillText(output, x, y)
}

function loadPosterImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = src
  })
}

function ResourceDetailPage({
  card,
  onBack,
  onOpenActivity,
}: {
  card: InspirationCard
  onBack: () => void
  onOpenActivity: () => void
}) {
  const [resourceKey, setResourceKey] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLineageOpen, setIsLineageOpen] = useState(false)
  const [expandedEvidence, setExpandedEvidence] = useState<{
    title: string
    caption: string
    image: string
  } | null>(null)
  const [adapted, setAdapted] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [selectedLineageNodeId, setSelectedLineageNodeId] = useState('root')
  const [lineageZoom, setLineageZoom] = useState(0.8)
  const [discussionItems, setDiscussionItems] = useState(discussionThreads)
  const relatedResources = [
    limestoneActivityCard,
    ...relatedResourceTitles.map((title) => cardIndex[title]).filter(Boolean),
  ].slice(0, 6) as InspirationCard[]
  const selectedLineageNode = lineageNodes.find((node) => node.id === selectedLineageNodeId) ?? lineageNodes[0]
  const isOriginalLineageNode = selectedLineageNode.id === 'root'
  const lineageZoomPercent = Math.round(lineageZoom * 100)
  const acceptedContributors = useMemo(
    () => discussionItems.filter((item) => item.accepted),
    [discussionItems],
  )

  useEffect(() => {
    if (!expandedEvidence) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpandedEvidence(null)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [expandedEvidence])

  function updateLineageZoom(nextZoom: number) {
    setLineageZoom(Math.min(1.35, Math.max(0.7, Number(nextZoom.toFixed(2)))))
  }

  function acceptSuggestion(threadId: string) {
    setDiscussionItems((items) =>
      items.map((item) => (item.id === threadId ? { ...item, accepted: true } : item)),
    )
  }

  return (
    <section className="detail-workspace">
      <div className="detail-topbar">
        <button className="back-button" type="button" onClick={onBack}>
          <ChevronRight size={17} />
          返回首页
        </button>
        <label className="detail-search">
          <Search size={16} />
          <input placeholder="搜索同类课文、玩法、年级" />
        </label>
      </div>

      <div className="detail-layout">
        <section className="resource-panel" aria-label="资源体验区">
          <div className="resource-toolbar">
            <strong>《石灰吟》托物言志三关任务</strong>
          </div>
          <div className="resource-window">
            <button className="resource-preview" type="button" onClick={() => setIsFullscreen(true)} title="点击全屏预览">
              <img src={resourcePoster} alt="《石灰吟》别再干讲了，我用闯关把“托物言志”讲活了" />
            </button>
            <div className="resource-actions resource-actions--bottom">
              <button type="button" className="resource-action resource-action--light" onClick={() => setIsFullscreen(true)} title="全屏">
                <Expand size={17} />
                全屏
              </button>
              <button
                type="button"
                className="resource-action resource-action--light"
                onClick={() => {
                  setResourceKey((key) => key + 1)
                  setAdapted(false)
                }}
                title="重置"
              >
                <RotateCcw size={17} />
                重置
              </button>
              <button type="button" className="resource-action resource-action--primary" onClick={() => setAdapted(true)} title="一键改编">
                <WandSparkles size={17} />
                一键改编
              </button>
              <button
                type="button"
                className={`resource-action resource-action--primary resource-save-button ${isSaved ? 'is-saved' : ''}`}
                onClick={() => setIsSaved((value) => !value)}
                title="收藏资源"
              >
                <Star size={17} />
                {isSaved ? '已收藏' : '收藏资源'}
              </button>
              <button type="button" className="resource-action resource-action--primary" title="下载">
                <Download size={17} />
                下载
              </button>
            </div>
          </div>
          <section className="related-rail" aria-label="可能会感兴趣">
            <div className="related-head">
              <h2>可能会感兴趣</h2>
            </div>
            <div className="related-grid">
              {relatedResources.map((resource) => (
                <RelatedResourceCard card={resource} key={resource.title} onOpenActivity={onOpenActivity} />
              ))}
            </div>
          </section>
          {adapted && (
            <div className="adapt-toast">
              已生成同款改编草稿：换成《竹石》，保留“物象-品质-志向”三关结构。
            </div>
          )}
        </section>

        <aside className="note-panel" aria-label="创作手记与社区互动">
          <article className="note-card note-card--hero">
            <div className="author-meta">
              <UserAvatar name={card.author} className="avatar detail-avatar" />
              <div>
                <strong>
                  {card.author}
                  {card.verified && <VerifiedMark tone={card.verified} />}
                </strong>
                <span>{card.identity}</span>
              </div>
              <button type="button">关注</button>
            </div>
            <h1>{card.title}</h1>
            <div className="title-signals">
              <span className="expert-chip" title="窦桂梅：这个案例把“托物言志”从抽象概念转成了学生可体验的学习任务。">
                窦桂梅 推荐
              </span>
              <span>五年级</span>
              <span>语文</span>
              <span>教学游戏</span>
            </div>
            <div className="expert-note">
              <UserAvatar name="窦桂梅" className="expert-avatar" title="窦桂梅" />
              <p>这个案例把“托物言志”从抽象概念转成了学生可体验的学习任务。</p>
            </div>
            <div className="detail-section-title">
              <Lightbulb size={18} />
              <h2>备课手记</h2>
            </div>
            <p>
              我以前讲“托物言志”，学生经常能背定义，但说不清诗人到底借什么物表达什么志。
            </p>
            <p>
              这次我把它拆成三关：先找物象，再找品质，最后回到作者处境。最惊喜的是，第三关一出来，班里好几个孩子都抢着说“清白不是颜色，是于谦想守住的品格”。
            </p>
            <p>
              孩子们的反馈也很直接，有人说“像闯关，比直接讲定义好懂”，还有人说“原来诗里每一关都在帮我往后想”。我自己最喜欢的是，他们不是在背答案，而是在顺着证据把意思一点点讲出来。
            </p>
            <p>
              使用时建议先让学生独立点一遍，再小组复盘每一关的证据。基础弱的班可以打开“作者处境提示卡”，不要一上来就讲背景，先把物象和品质站稳。
            </p>
            <div className="evidence-grid">
              <button
                className="evidence-card evidence-card--photo"
                type="button"
                onClick={() =>
                  setExpandedEvidence({
                    title: '课堂照片',
                    caption: '投屏闯关中',
                    image: classroomPhotoImage,
                  })
                }
              >
                <img src={classroomPhotoImage} alt="" />
                <span>课堂照片</span>
                <strong>投屏闯关中</strong>
              </button>
              <button
                className="evidence-card evidence-card--photo"
                type="button"
                onClick={() =>
                  setExpandedEvidence({
                    title: '学生作品',
                    caption: '清白=品格',
                    image: studentWorkImage,
                  })
                }
              >
                <img src={studentWorkImage} alt="" />
                <span>学生作品</span>
                <strong>清白=品格</strong>
              </button>
              <div className="evidence-card evidence-card--video">
                <img src={blackboardTraceImage} alt="" />
                <div className="video-frame">
                  <div className="video-topline">
                    <span>板书留痕</span>
                    <em>视频</em>
                  </div>
                  <div className="video-play">
                    <Play size={18} />
                  </div>
                  <div className="video-caption">
                    <strong>物象 → 品质 → 志向</strong>
                    <span>01:18</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <button
            className="origin-strip"
            type="button"
            onClick={() => {
              setSelectedLineageNodeId('root')
              setLineageZoom(0.8)
              setIsLineageOpen(true)
            }}
          >
            <span>原创声明</span>
            <strong>已更新至 V18</strong>
            <em>已有 86 位老师改编</em>
            <i>看看大家怎么改</i>
          </button>

          <section className="note-card note-card--section co-section">
            <div className="co-section-head">
              <div className="detail-section-title compact-title">
                <BadgeCheck size={18} />
                <h2>共创贡献</h2>
              </div>
              <div className="co-count">感谢 3 位老师参与打磨</div>
            </div>
            <div className="co-roster" aria-label="已采纳老师名录">
              {acceptedContributors.map((item) => (
                <div className="co-roster-item" key={item.id}>
                  <UserAvatar name={item.author} className="avatar co-roster-avatar" />
                  <strong>{item.author}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="note-card note-card--section discussion-section">
            <div className="detail-section-title compact-title">
              <MessageCircle size={18} />
              <h2>全部讨论</h2>
            </div>
            <div className="comment-input">欢迎留下你的建议、求助或课堂反馈</div>
            {discussionItems.map((comment) => (
              <article className={`discussion-thread ${comment.accepted ? 'is-accepted' : ''}`} key={comment.id}>
                <UserAvatar name={comment.author} className="avatar discussion-avatar" />
                <div className="discussion-body">
                  <strong>{comment.author}</strong>
                  <p>{comment.text}</p>
                  <div className="comment-actions">
                    <button type="button">
                      <ThumbsUp size={14} />
                      {comment.likes}
                    </button>
                    {comment.accepted ? (
                      <span className="accept-pill">
                        <BadgeCheck size={13} />
                        作者已采纳
                      </span>
                    ) : (
                      <button className="accept-button" type="button" onClick={() => acceptSuggestion(comment.id)}>
                        <BadgeCheck size={14} />
                        采纳建议
                      </button>
                    )}
                    <button type="button">
                      <Reply size={14} />
                      回复
                    </button>
                  </div>
                  {comment.replies && (
                    <div className="comment-children">
                      {comment.replies.map((reply) => (
                        <div className="comment-reply" key={`${comment.author}-${reply.author}`}>
                          <UserAvatar name={reply.author} className="avatar reply-avatar" />
                          <div>
                            <strong>{reply.author}</strong>
                            <p>{reply.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </section>

          <div className="sticky-actions">
            <button type="button">
              <Heart size={18} />
              6128
            </button>
            <button type="button">
              <Star size={18} />
              74
            </button>
            <button type="button">
              <MessageCircle size={18} />
              243
            </button>
            <button type="button">
              <Share2 size={18} />
              分享
            </button>
          </div>
        </aside>
      </div>

      {isFullscreen && (
        <div className="fullscreen-layer" role="dialog" aria-label="全屏资源体验">
          <button className="close-fullscreen" type="button" onClick={() => setIsFullscreen(false)} title="关闭">
            <X size={21} />
          </button>
          <iframe
            key={`fullscreen-${resourceKey}`}
            className="resource-frame"
            title="石灰吟托物言志闯关资源"
            srcDoc={resourceHtml}
            sandbox="allow-scripts"
          />
        </div>
      )}

      {expandedEvidence && (
        <div className="evidence-lightbox" role="dialog" aria-modal="true" aria-label={expandedEvidence.title}>
          <button
            className="evidence-lightbox-backdrop"
            type="button"
            aria-label="关闭图片"
            onClick={() => setExpandedEvidence(null)}
          />
          <figure className="evidence-lightbox-card">
            <button className="evidence-lightbox-close" type="button" title="关闭" onClick={() => setExpandedEvidence(null)}>
              <X size={20} />
            </button>
            <img src={expandedEvidence.image} alt="" />
            <figcaption>
              <span>{expandedEvidence.title}</span>
              <strong>{expandedEvidence.caption}</strong>
            </figcaption>
          </figure>
        </div>
      )}

      {isLineageOpen && (
        <div className="lineage-layer" role="dialog" aria-label="改编脉络">
          <div className="lineage-dialog">
            <button type="button" className="lineage-close" onClick={() => setIsLineageOpen(false)} title="关闭">
              <X size={19} />
            </button>
            <h2>改编脉络</h2>
            <p>好课会生长——从这里出发，让思考接力，一课开千枝。</p>
            <div className="lineage-map">
              <div className="lineage-toolbar" aria-label="改编脉络缩放">
                <button type="button" onClick={() => updateLineageZoom(lineageZoom - 0.1)} title="缩小">
                  <ZoomOut size={15} />
                </button>
                <span>{lineageZoomPercent}%</span>
                <button type="button" onClick={() => updateLineageZoom(lineageZoom + 0.1)} title="放大">
                  <ZoomIn size={15} />
                </button>
                <button type="button" onClick={() => updateLineageZoom(0.8)} title="完整显示">
                  <RotateCcw size={15} />
                </button>
              </div>
              <div
                className="lineage-map-stage"
                style={{ width: `max(100%, ${1000 * lineageZoom}px)`, height: `${620 * lineageZoom}px` }}
              >
                <div
                  className="lineage-map-canvas"
                  style={
                    {
                      left: `calc((100% - ${1000 * lineageZoom}px) / 2)`,
                      '--lineage-zoom': lineageZoom,
                    } as CSSProperties
                  }
                >
                  <svg className="lineage-links" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
                    {lineageNodes
                      .filter((node) => node.parentId)
                      .map((node) => {
                        const parent = lineageNodes.find((item) => item.id === node.parentId)
                        if (!parent) return null

                        const curve = lineageCurve(parent, node)
                        return (
                          <path
                            key={node.id}
                            className={`lineage-link lineage-link--${node.size}`}
                            d={curve}
                            stroke={node.color}
                            strokeWidth={node.weight}
                          />
                        )
                      })}
                  </svg>
                  <div className="lineage-root-orbit" aria-hidden="true" />
                  {lineageNodes.map((node) => {
                    const isOriginalNode = node.id === 'root'

                    return (
                      <button
                        key={node.id}
                        type="button"
                        className={`lineage-node lineage-node--${node.size} ${
                          selectedLineageNodeId === node.id ? 'is-selected' : ''
                        }`}
                        style={
                          {
                            left: `${node.x}%`,
                            top: `${node.y}%`,
                            '--node-color': node.color,
                          } as CSSProperties
                        }
                        onClick={() => {
                          if (!isOriginalNode) setSelectedLineageNodeId(node.id)
                        }}
                        disabled={isOriginalNode}
                        title={isOriginalNode ? '原创起点' : `改编人：${node.author}`}
                      >
                        <span>{node.label}</span>
                        <strong>{node.author}</strong>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="lineage-detail">
              <div>
                <span>当前节点</span>
                <strong>{selectedLineageNode.label}</strong>
              </div>
              {isOriginalLineageNode ? (
                <div className="lineage-detail-note">原创起点</div>
              ) : (
                <div className="lineage-detail-actions">
                  <p>改编人：{selectedLineageNode.author}</p>
                  <a href={`#/remix/${selectedLineageNode.id}`}>查看改编作品</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  )
}

function FuelPublishDialog({
  selectedFuelMedia,
  selectedFuelWork,
  onChangeMedia,
  onChangeWork,
  onClose,
}: {
  selectedFuelMedia: FuelMediaType
  selectedFuelWork: FuelWorkTitle
  onChangeMedia: (media: FuelMediaType) => void
  onChangeWork: (work: FuelWorkTitle) => void
  onClose: () => void
}) {
  return (
    <div className="fuel-layer" role="dialog" aria-modal="true" aria-label="发布教学灵感">
      <button className="fuel-backdrop" type="button" aria-label="关闭发布面板" onClick={onClose} />
      <section className="fuel-dialog" aria-label="教师加油站发布面板">
        <div className="fuel-dialog-top">
          <div>
            <span>教师加油站·第4期</span>
            <h2>发布教学灵感</h2>
          </div>
          <button className="fuel-dialog-close" type="button" onClick={onClose} title="关闭">
            <X size={18} />
          </button>
        </div>

        <div className="fuel-dialog-body">
          <section className="fuel-dialog-aside">
            <div className="fuel-dialog-label">① 选择作品</div>
            <div className="fuel-work-stack">
              {fuelWorks.map((work, index) => (
                <button
                  className={`fuel-work-card ${selectedFuelWork === work.title ? 'is-selected' : ''}`}
                  type="button"
                  key={work.title}
                  onClick={() => onChangeWork(work.title)}
                >
                  <div className={`fuel-work-thumb fuel-work-thumb--${work.tone}`}>
                    <span>{index + 1}</span>
                  </div>
                  <div className="fuel-work-copy">
                    <strong>{work.title}</strong>
                    <span>{work.meta}</span>
                  </div>
                  <i>{selectedFuelWork === work.title ? '已选' : '选它'}</i>
                </button>
              ))}
            </div>
          </section>

          <section className="fuel-dialog-editor">
            <div className="fuel-dialog-label">② 写教学灵感</div>
            <div className="fuel-media-line" aria-label="上传图片或视频">
              <button
                className={`fuel-add-tile ${selectedFuelMedia === '图片' ? 'is-active' : ''}`}
                type="button"
                onClick={() => onChangeMedia('图片')}
                title="添加图片"
              >
                <Plus size={30} />
              </button>
              <button
                className={`fuel-add-tile ${selectedFuelMedia === '视频' ? 'is-active' : ''}`}
                type="button"
                onClick={() => onChangeMedia('视频')}
                title="添加视频"
              >
                <Plus size={30} />
              </button>
            </div>
            <p className="fuel-media-hint">上传图片或视频，用来展示作品的实际使用效果</p>
            <label className="fuel-field">
              <span>标题</span>
              <input defaultValue="把课堂做成三关后，孩子更愿意讲证据了" />
            </label>

            <label className="fuel-field fuel-field--body">
              <span>正文</span>
              <div className="fuel-textarea-wrap">
                <textarea defaultValue="这节课我先让学生找物象，再找品质，最后回到作者处境。最有帮助的是，孩子会自己补证据，不用我一直提醒。" />
                <button className="fuel-voice-button" type="button" title="语音输入">
                  <Mic size={18} />
                </button>
              </div>
            </label>

            <div className="fuel-tag-row" aria-label="灵感场景">
              <button type="button">#《石灰吟》同题创作</button>
              <button type="button">#古诗闯关</button>
              <button type="button">#课堂实录</button>
              <button type="button">#五年级语文</button>
              <button type="button">#托物言志</button>
            </div>

            <div className="fuel-dialog-actions">
              <button type="button" className="fuel-dialog-secondary" onClick={onClose}>
                保存草稿
              </button>
              <button type="button" className="fuel-dialog-primary" onClick={onClose}>
                发布灵感
              </button>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}

function RelatedResourceCard({
  card,
  onOpenActivity,
}: {
  card: InspirationCard
  onOpenActivity: () => void
}) {
  const coverImage = coverImageByTitle[card.title]
  const isActivity = card.sourceTag === '活动'

  return (
    <article
      className={`related-card ${isActivity ? 'related-card--activity' : ''}`}
      onClick={isActivity ? onOpenActivity : undefined}
      role={isActivity ? 'button' : undefined}
      tabIndex={isActivity ? 0 : undefined}
      onKeyDown={(event) => {
        if (!isActivity) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpenActivity()
        }
      }}
    >
      <div className="related-thumb">
        {coverImage ? <img src={coverImage} alt="" /> : <div className={`thumb-fallback cover-${card.visual}`} />}
        {isActivity && <span className="related-status-pill">进行中</span>}
      </div>
      <div className="related-copy">
        <h3>
          {shouldShowSourceBadge(card.sourceTag) && <span className={`related-prefix ${sourceClass(card.sourceTag)}`}>{card.sourceTag}</span>}
          {card.title}
        </h3>
        <div className="related-author">
          <UserAvatar name={card.author} className={`avatar related-avatar ${isActivity ? 'related-avatar--gold' : ''}`} />
          <span>{card.author}</span>
        </div>
        <div className="related-stats">
          <span>{isActivity ? '参与' : '收藏'} {card.savedCount ?? card.remixCount ?? 0}</span>
          <span>{isActivity ? '作品' : '改编'} {card.remixCount ?? 0}</span>
        </div>
      </div>
    </article>
  )
}

function TeacherProfileCard({
  teacher,
  placement,
  onOpenCard,
  onOpenProfile,
}: {
  teacher: TeacherProfile
  placement: TeacherFeedPlacement
  onOpenCard: (card: InspirationCard) => void
  onOpenProfile: () => void
}) {
  const badgeClass = `teacher-badge teacher-badge--${badgeTone(teacher.badge)}`
  const workPreviews = teacherWorkPreviews[teacher.name] ?? teacherWorkPreviews.王清越
  const isFeatured = placement !== 'standard'

  function stopCardClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
  }

  return (
    <article
      className={`teacher-card teacher-card--${teacher.tone} teacher-card--${placement} ${
        isFeatured ? 'teacher-card--featured' : 'teacher-card--standard'
      } is-clickable`}
      role="button"
      tabIndex={0}
      onClick={onOpenProfile}
      onKeyDown={(event) => {
        if (isInteractiveElement(event.target)) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpenProfile()
        }
      }}
    >
      <div className="teacher-card-body">
        <div className="teacher-card-main">
          <div className="teacher-avatar-wrap">
            <UserAvatar name={teacher.name} fallback={teacher.avatar} className="avatar teacher-avatar teacher-avatar--inline" />
          </div>
          <div className="teacher-card-title">
            <h3>
              {teacher.name}
              <VerifiedMark tone={teacher.badge === '已认证' ? 'red' : 'yellow'} />
            </h3>
            <span className="teacher-location">
              {teacher.location} · {teacher.subject}
            </span>
          </div>
        </div>
        <div className="teacher-card-detail">
          <div className="teacher-badge-row" aria-label="推荐标签">
            <span className={badgeClass}>{teacher.badge}</span>
          </div>
          <div className="teacher-stat-row" aria-label="老师数据">
            {teacher.stats.map((stat) => (
              <div className="teacher-stat" key={`${teacher.name}-${stat.label}`}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <TeacherWorkPreviewRow works={workPreviews} onOpenCard={onOpenCard} />
          <div className="teacher-action-row">
            <button type="button" className="teacher-action teacher-action--follow" onClick={stopCardClick}>
              <UserPlus size={15} />
              关注
            </button>
            <button type="button" className="teacher-action" onClick={stopCardClick}>
              <MessageCircle size={15} />
              私信
            </button>
            <button type="button" className="teacher-action" onClick={stopCardClick}>
              <Users size={15} />
              加入群组
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function HighlightEventStrip({ events }: { events: HighlightEvent[] }) {
  const loopedEvents = [...events, ...events]

  return (
    <section className="highlight-strip" aria-label="达人动态">
      <div className="highlight-strip-head">
        <Megaphone size={15} />
        <strong>达人动态</strong>
      </div>
      <div className="highlight-viewport">
        <div className="highlight-track">
          {loopedEvents.map((event, index) => (
            <button
              className={`highlight-event tone-${event.tone}`}
              type="button"
              key={`${event.teacher}-${event.title}-${index}`}
            >
              <span aria-label={event.type} />
              <b>{event.teacher}</b>
              <strong>{event.title}</strong>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function TeacherWorkPreviewRow({
  works,
  onOpenCard,
}: {
  works: TeacherWorkPreview[]
  onOpenCard: (card: InspirationCard) => void
}) {
  return (
    <div className="teacher-work-row" aria-label="代表作品">
      {works.slice(0, 4).map((work) => {
        const card = cards.find((item) => item.title === work.sourceTitle) ?? cards[0]

        return (
          <button
            className="teacher-work-card"
            type="button"
            key={`${work.sourceTitle}-${work.title}`}
            onClick={(event) => {
              event.stopPropagation()
              onOpenCard(card)
            }}
          >
            <span className="teacher-work-cover">
              <img src={coverImageByTitle[work.sourceTitle]} alt="" />
            </span>
            <strong>{work.title}</strong>
          </button>
        )
      })}
    </div>
  )
}

function TeacherLoaderCard({ index }: { index: number }) {
  return (
    <article className="teacher-card teacher-loader" aria-label="正在加载更多老师">
      <div className="teacher-loader-body">
        <div className="teacher-loader-avatar-wrap">
          <span className="teacher-loader-avatar" />
        </div>
        <div className="teacher-loader-title">
          <strong className="teacher-loader-line teacher-loader-line--name" style={{ width: `${54 - index * 4}%` }} />
          <span className="teacher-loader-line teacher-loader-line--meta" style={{ width: `${44 + index * 4}%` }} />
        </div>
        <div className="teacher-loader-badge">
          <span className="teacher-loader-line teacher-loader-line--badge" />
        </div>
        <div className="teacher-loader-stats">
          <span />
          <span />
          <span />
        </div>
        <div className="teacher-loader-actions">
          <span />
          <span />
          <span />
        </div>
      </div>
    </article>
  )
}

function SearchDropdown({
  onPick,
  onClose,
}: {
  onPick: (value: string) => void
  onClose: () => void
}) {
  const history = ['《石灰吟》托物言志', '五年级 语文', '课堂实录', '同题创作']
  const suggestions = ['托物言志', '古诗闯关', '板书优化', '教学思路', '活动 《石灰吟》同题创作', '课堂活动设计']

  return (
    <div className="search-dropdown" role="dialog" aria-label="搜索建议">
      <div className="search-dropdown-head">
        <strong>历史搜索记录</strong>
        <button type="button" onClick={onClose}>
          关闭
        </button>
      </div>
      <div className="chip-row">
        {history.map((item) => (
          <button key={item} type="button" onClick={() => onPick(item)}>
            {item}
          </button>
        ))}
      </div>

      <div className="search-dropdown-sep" />

      <div className="search-dropdown-head">
        <strong>猜你想搜</strong>
      </div>
      <div className="suggest-grid">
        {suggestions.map((item) => (
          <button key={item} type="button" onClick={() => onPick(item)}>
            {item.startsWith('活动 ') ? <span className="suggest-activity">活动</span> : null}
            <span>{item.startsWith('活动 ') ? item.replace('活动 ', '') : item}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function InspirationCardItem({
  card,
  onOpen,
  onOpenAuthor,
}: {
  card: InspirationCard
  onOpen?: (card: InspirationCard) => void
  onOpenAuthor?: (card: InspirationCard) => void
}) {
  const trustChip = getTrustChip(card)
  const recommender = getNamedExpertRecommendation(card.recommender)
  const coverImage = coverImageByTitle[card.title]
  const isOpenable = Boolean(onOpen)
  const canOpenAuthor = card.author === '王清越' && Boolean(onOpenAuthor)

  return (
    <article
      className={`inspiration-card ${isOpenable ? 'is-openable' : ''}`}
      role={isOpenable ? 'button' : undefined}
      tabIndex={isOpenable ? 0 : undefined}
      onClick={() => onOpen?.(card)}
      onKeyDown={(event) => {
        if (!isOpenable) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen?.(card)
        }
      }}
    >
      <div className={`cover cover-${card.visual} ${coverImage ? 'cover-image-mode' : ''}`}>
        {coverImage ? (
          <img className="cover-media" src={coverImage} alt="" />
        ) : (
          <>
            {shouldShowSourceBadge(card.sourceTag) && (
              <div className={`cover-badge ${sourceClass(card.sourceTag)}`}>
                {card.sourceTag === '热门' ? <Flame size={14} /> : <Sparkles size={14} />}
                {card.sourceTag}
              </div>
            )}
            <div className="cover-art">
              <span>{card.note}</span>
              <strong>{card.coverTitle}</strong>
              <i />
            </div>
          </>
        )}
        {recommender && <div className="recommender-pill">{recommender}</div>}
      </div>
      <div className="card-content">
        <h3>{card.title}</h3>
        <button
          className={`author-row ${canOpenAuthor ? 'is-clickable' : ''}`}
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            if (canOpenAuthor) onOpenAuthor?.(card)
          }}
          disabled={!canOpenAuthor}
          aria-label={canOpenAuthor ? '进入王清越主页' : undefined}
        >
          <UserAvatar name={card.author} />
          <div>
            <strong>
              {card.author}
              {card.verified && <VerifiedMark tone={card.verified} />}
            </strong>
            {card.identity && <span>{card.identity}</span>}
          </div>
        </button>
        {card.hotComment && card.hotCommentLikes && card.hotCommentLikes > 100 && (
          <div className="hot-comment">
            <span>热评</span>
            <p>{card.hotComment}</p>
          </div>
        )}
        {trustChip && (
          <div className="trust-row">
            <span className={`trust-chip ${trustChip.tone}`}>{trustChip.label}</span>
          </div>
        )}
      </div>
      <button className="like-button" type="button" aria-label="收藏" onClick={(event) => event.stopPropagation()}>
        <Heart size={17} />
        {card.likes}
      </button>
    </article>
  )
}

function VerifiedMark({ tone }: { tone: VerifiedTone }) {
  return <span className={`verified-mark ${tone}`}>V</span>
}

function badgeTone(badge: TeacherBadge) {
  if (badge === '已认证') return 'red'
  if (badge === '飞象优质创作者') return 'yellow'
  return 'blue'
}

function MasonryFeed({
  cards: sourceCards,
  onOpenCard,
  onOpenProfile,
}: {
  cards: InspirationCard[]
  onOpenCard: (card: InspirationCard) => void
  onOpenProfile: () => void
}) {
  const columns = distributeFeedItems(sourceCards)
  const limestoneCard = cards.find((card) => card.title.includes('石灰吟')) ?? sourceCards[0]

  return (
    <>
      {columns.map((items, columnIndex) => (
        <div className="masonry-column" key={columnIndex}>
          {items.map((item) =>
            item.kind === 'loader' ? (
              <LoaderCard key={item.id} index={item.index} />
            ) : (
              <InspirationCardItem
                card={item.card}
                key={`${item.card.title}-${item.card.likes}`}
                onOpen={item.card.title.includes('石灰吟') ? () => onOpenCard(limestoneCard) : undefined}
                onOpenAuthor={onOpenProfile}
              />
            ),
          )}
        </div>
      ))}
    </>
  )
}

function LoaderCard({ index }: { index: number }) {
  return (
    <div className="loader-card" aria-label="继续加载">
      <i />
      <span />
      <strong style={{ width: `${46 + (index % 4) * 8}%` }} />
    </div>
  )
}

function rankCardsWithSearch(activeFilter: FeedMode, seed: number, query: string) {
  const seededCards = rotateCards(cards, seed)
  const normalizedQuery = query.trim().toLowerCase()
  const filteredCards = normalizedQuery
    ? seededCards.filter((card) => matchesQuery(card, normalizedQuery))
    : seededCards

  if (activeFilter === '全部') {
    return mixCards(filteredCards)
  }

  if (activeFilter === '专家推荐') {
    return filteredCards.filter((card) => card.sourceTag === '专家推荐')
  }

  if (activeFilter === '热门精选') {
    return filteredCards.filter((card) => card.sourceTag === '热门' || card.sourceTag === '精选')
  }

  const primary = filteredCards.filter((card) => card.affinity.includes(activeFilter))
  const fresh = filteredCards.filter((card) => card.fresh && !card.affinity.includes(activeFilter))
  const secondary = filteredCards.filter((card) => !card.affinity.includes(activeFilter) && !card.fresh)
  const mixed: InspirationCard[] = []

  primary.forEach((card, index) => {
    mixed.push(card)
    if (index % 2 === 0 && fresh.length > 0) {
      mixed.push(fresh.shift() as InspirationCard)
    }
    if (index % 3 === 1 && secondary.length > 0) {
      mixed.push(secondary.shift() as InspirationCard)
    }
  })

  return [...mixed, ...fresh, ...secondary]
}

function rankCards(activeFilter: FeedMode, seed: number, query: string) {
  return rankCardsWithSearch(activeFilter, seed, query)
}

function applyFeedSort(source: InspirationCard[], sort: FeedSortOption) {
  if (sort === '综合') return source
  const sorted = [...source]

  if (sort === '最新') {
    return sorted.sort((left, right) => Number(Boolean(right.fresh)) - Number(Boolean(left.fresh)))
  }

  if (sort === '最多点赞') {
    return sorted.sort((left, right) => Number(right.likes) - Number(left.likes))
  }

  if (sort === '最多评论') {
    return sorted.sort((left, right) => (right.hotCommentLikes ?? 0) - (left.hotCommentLikes ?? 0))
  }

  return sorted.sort((left, right) => (right.savedCount ?? 0) - (left.savedCount ?? 0))
}

function matchesQuery(card: InspirationCard, query: string) {
  const haystack = [
    card.title,
    card.author,
    card.identity ?? '',
    card.note,
    card.coverTitle,
    card.recommender ?? '',
    card.hotComment ?? '',
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(query)
}

function rotateCards(source: InspirationCard[], seed: number) {
  if (seed === 0) return source

  const offset = (seed * 5) % source.length
  return [...source.slice(offset), ...source.slice(0, offset)]
}

function rotateTeacherProfiles(source: TeacherProfile[], seed: number) {
  if (seed === 0) return source

  const offset = (seed * 2) % source.length
  return [...source.slice(offset), ...source.slice(0, offset)]
}

function mixCards(source: InspirationCard[]) {
  const lanes = [
    source.filter((card) => card.sourceTag === '专家推荐'),
    source.filter((card) => card.sourceTag === '热门' || card.sourceTag === '精选'),
    source.filter((card) => !card.sourceTag),
  ]
  const mixed: InspirationCard[] = []

  while (lanes.some((lane) => lane.length > 0)) {
    lanes.forEach((lane) => {
      const card = lane.shift()
      if (card) mixed.push(card)
    })
  }

  return mixed
}

function extendFeed(source: InspirationCard[], activeFilter: FeedMode, seed: number) {
  const enoughForDemo = activeFilter === '全部' ? 4 : 3
  const titleVariants = [
    '课堂实测版',
    '课后可复用版',
    '低准备版',
    '公开课也能用',
  ]
  return Array.from({ length: enoughForDemo }, (_, round) =>
    source.map((card, index) => {
      if (round === 0) return card

      const bump = round * 37 + index * 5
      return {
        ...card,
        title: makeVariantTitle(card.title, titleVariants[(round + index + seed) % titleVariants.length]),
        likes: String(Math.max(8, Number(card.likes) + bump - round * 23)),
      }
    }),
  ).flat()
}

type FeedGridItem =
  | { kind: 'card'; card: InspirationCard }
  | { kind: 'loader'; id: string; index: number }

function distributeFeedItems(source: InspirationCard[]) {
  const columns: FeedGridItem[][] = [[], [], [], []]
  const heights = [0, 0, 0, 0]
  const loaders: FeedGridItem[] = Array.from({ length: 12 }, (_, index) => ({
    kind: 'loader',
    id: `loader-${index}`,
    index,
  }))

  source.forEach((card) => {
    const columnIndex = shortestColumn(heights)
    columns[columnIndex].push({ kind: 'card', card })
    heights[columnIndex] += estimateCardHeight(card)
  })

  loaders.forEach((loader) => {
    const columnIndex = shortestColumn(heights)
    columns[columnIndex].push(loader)
    heights[columnIndex] += 310
  })

  return columns
}

function shortestColumn(heights: number[]) {
  return heights.indexOf(Math.min(...heights))
}

function estimateCardHeight(card: InspirationCard) {
  const titleLines = Math.ceil(card.title.length / 18)
  const hasIdentity = card.identity ? 18 : 0
  const hasHotComment = card.hotComment && card.hotCommentLikes && card.hotCommentLikes > 100 ? 30 : 0
  const hasTrust = getTrustChip(card) ? 30 : 0

  return 235 + titleLines * 22 + hasIdentity + hasHotComment + hasTrust
}

function makeVariantTitle(title: string, variant: string) {
  if (title.includes('？')) {
    return title.replace('？', `？${variant}也整理好了，`)
  }

  return `${title}｜${variant}`
}

function sourceClass(sourceTag: '热门' | '精选' | '活动') {
  if (sourceTag === '活动') return 'activity'
  if (sourceTag === '热门') return 'hot'
  return 'featured'
}

function shouldShowSourceBadge(sourceTag?: SourceTag): sourceTag is '热门' | '精选' | '活动' {
  return sourceTag === '热门' || sourceTag === '精选' || sourceTag === '活动'
}

function isInteractiveElement(target: EventTarget) {
  return target instanceof Element && Boolean(target.closest('button, input, a, label'))
}

function getNamedExpertRecommendation(recommender?: string) {
  if (!recommender) return null

  return namedExperts.some((expert) => recommender.startsWith(expert)) ? recommender : null
}

function getTrustChip(card: InspirationCard): TrustChip | null {
  if (card.hideTrustChip) return null

  if (card.followedSaved) {
    return { label: '我的关注也收藏了', tone: 'followed' }
  }

  const candidates = [
    { label: `${card.savedCount ?? 0}位老师收藏`, tone: 'saved' as const, value: card.savedCount ?? 0 },
    { label: `${card.remixCount ?? 0}位老师改编`, tone: 'remix' as const, value: card.remixCount ?? 0 },
  ].filter((signal) => signal.value >= 50)

  if (candidates.length === 0) return null

  const [strongest] = candidates.sort((a, b) => b.value - a.value)
  return { label: strongest.label, tone: strongest.tone }
}

function lineageCurve(parent: LineageNode, child: LineageNode) {
  const startX = parent.x * 10
  const startY = parent.y * 6.2
  const endX = child.x * 10
  const endY = child.y * 6.2
  const dx = endX - startX
  const dy = endY - startY
  const side = dx >= 0 ? 1 : -1
  const bend = child.size === 'trunk' ? 54 : child.size === 'branch' ? 32 : 18
  const cp1X = startX + dx * 0.32 + side * bend
  const cp1Y = startY + dy * 0.16
  const cp2X = startX + dx * 0.72 - side * bend * 0.2
  const cp2Y = startY + dy * 0.84

  return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`
}

export default App
