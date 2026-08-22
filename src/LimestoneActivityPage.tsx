import { useMemo, useState } from 'react'
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Flame,
  Heart,
  MessageCircle,
  Plus,
  SendHorizontal,
  Share2,
  Sparkles,
  ThumbsUp,
} from 'lucide-react'
import activityBanner from './assets/activity-banner-clean.png'
import cardShihui1 from './assets/card-shihui-1.png'
import cardShihui2 from './assets/card-shihui-2.png'
import cardShihui3 from './assets/card-shihui-3.png'
import cardShihui4 from './assets/card-shihui-4.png'
import cover1 from './assets/covers/cover-1.png'
import cover2 from './assets/covers/cover-2.png'
import cover3 from './assets/covers/cover-3.png'
import cover4 from './assets/covers/cover-4.png'
import cover5 from './assets/covers/cover-5.png'
import cover6 from './assets/covers/cover-6.png'
import cover7 from './assets/covers/cover-7.png'

import './LimestoneActivityPage.css'

type WorkTone = 'green' | 'orange' | 'blue' | 'red'
type WorkFilter = '全部作品' | '我的作品' | '最新发布' | '最多投票' | '我的投票'
type DiscussionFilter = '全部讨论' | '我发起的' | '我参与的' | '最热讨论' | '最新发布'

type WorkCard = {
  id: string
  title: string
  author: string
  school: string
  image: string
  tone: WorkTone
  summary: string
  saves: number
  comments: number
  votes: number
  mine?: boolean
  fresh?: boolean
  rising?: boolean
}

const winningWorks = [
  { title: '《桂花雨》气味记忆展', author: '陈思乔', image: cover3, points: 200, praise: '“谁看了都想学”' },
  { title: '古诗默写全班抢答赛', author: '林若水', image: cover2, points: 180, praise: '“一上课就热起来”' },
  { title: '分角色朗读训练台', author: '中关村三小语文组', image: cover5, points: 150, praise: '“朗读终于有画面”' },
  { title: '作文反馈分层卡', author: '小满老师', image: cover6, points: 100, praise: '“批改思路真省心”' },
]

const works: WorkCard[] = [
  {
    id: 'stone-gates',
    title: '你的“石灰”是什么？让每个孩子写一首自己的《石灰吟》',
    author: '王清越',
    school: '中关村三小 · 语文老师',
    image: cardShihui4,
    tone: 'green',
    summary: '把物象、品格、志向拆成三关，小组拖拽关键词后现场抢答。',
    saves: 6128,
    comments: 236,
    votes: 904,
    rising: true,
  },
  {
    id: 'stone-quick-answer',
    title: '期末古诗复习太枯燥？我改成全班抢答赛了',
    author: '林若水',
    school: '成都 · 五年级语文',
    image: cover2,
    tone: 'orange',
    summary: '用全班积分榜承接诗句填空，孩子会主动解释每个关键词。',
    saves: 5890,
    comments: 184,
    votes: 821,
  },
  {
    id: 'stone-ledger',
    title: '用一张思维导图，带学生读懂《石灰吟》中的“托物言志”',
    author: '陆遇友',
    school: '南京 · 语文备课组',
    image: cardShihui1,
    tone: 'blue',
    summary: '每轮讨论后自动记录发言、证据引用和同伴补充，课后不用补账。',
    saves: 203,
    comments: 41,
    votes: 92,
    mine: true,
    fresh: true,
  },
  {
    id: 'stone-read',
    title: '《石灰吟》朗读没气势？试试这个分角色训练台',
    author: '中央村三小教研组',
    school: '五年级语文教研',
    image: cover5,
    tone: 'red',
    summary: '分角色录音、波形回放、语气值反馈，让朗读不只停在齐读。',
    saves: 4976,
    comments: 128,
    votes: 718,
  },
  {
    id: 'stone-proof',
    title: '公开课别只放板书，我做了一张“从石灰到于谦”生成器',
    author: '周青禾',
    school: '杭州 · 西湖区学军小学',
    image: cover7,
    tone: 'green',
    summary: '课堂讨论生成留白板书，最后自动补齐“托物言志”路径。',
    saves: 4518,
    comments: 96,
    votes: 677,
    mine: true,
    rising: true,
  },
  {
    id: 'stone-map',
    title: '“石灰精神”在今天还值不值得推崇？我发起了一场真实的辩论',
    author: 'TeacherYO',
    school: '深圳 · 项目式学习',
    image: cardShihui2,
    tone: 'blue',
    summary: '从石灰迁移到竹、梅、松，学生点选物象后生成练笔支架。',
    saves: 4320,
    comments: 74,
    votes: 515,
    fresh: true,
  },
  {
    id: 'stone-evidence',
    title: '上《石灰吟》前，先让学生给“清白”找证据',
    author: '陈思乔',
    school: '苏州实验小学 · 语文老师',
    image: cover3,
    tone: 'orange',
    summary: '把诗句拆成证据卡，学生先选证据，再解释品格。',
    saves: 4989,
    comments: 88,
    votes: 486,
  },
  {
    id: 'stone-debate',
    title: '“粉骨碎身怕不怕？”我把第三关改成小组辩论',
    author: '周青禾',
    school: '杭州崇文实验学校 · 语文老师',
    image: cover6,
    tone: 'green',
    summary: '用正反方发言逼学生回到诗句，课堂讨论一下热起来。',
    saves: 4772,
    comments: 102,
    votes: 463,
  },
  {
    id: 'stone-lowgrade',
    title: '带学生体验石灰烧制过程后，他们终于理解了《石灰吟》',
    author: '沈白露',
    school: '深圳 · 低年级语文',
    image: cardShihui3,
    tone: 'blue',
    summary: '把抽象概念降成两步配对，适合二三年级迁移使用。',
    saves: 421,
    comments: 19,
    votes: 218,
    fresh: true,
  },
  {
    id: 'stone-board',
    title: '公开课临场怕散？我做了一个留白板书生成器',
    author: '钱嘉禾',
    school: '杭州 · 班主任',
    image: cover7,
    tone: 'red',
    summary: '学生每完成一关，板书自动补上一条证据链。',
    saves: 361,
    comments: 28,
    votes: 176,
  },
  {
    id: 'stone-author',
    title: '讲于谦背景前，我先让孩子猜“清白”到底是什么',
    author: '叶枝枝',
    school: '南京 · 五年级语文',
    image: cover1,
    tone: 'green',
    summary: '先从词义和诗句猜，再补作者处境，孩子更容易接住。',
    saves: 916,
    comments: 64,
    votes: 154,
  },
  {
    id: 'stone-export',
    title: '备课组共创版：每个班都能改一套自己的《石灰吟》任务',
    author: '南山小学语文组',
    school: '深圳 · 语文备课组',
    image: cover4,
    tone: 'blue',
    summary: '同一套结构，不同班级替换任务卡和评价表。',
    saves: 754,
    comments: 93,
    votes: 126,
    mine: true,
  },
]

const voteLeaders = [
  { title: '三关闯关版', votes: 904 },
  { title: '古诗抢答赛', votes: 821 },
  { title: '朗读气势训练', votes: 718 },
  { title: '板书生成器', votes: 677 },
  { title: 'AI 写作迁移地图', votes: 515 },
]

const discussions = [
  {
    id: 'lowgrade',
    author: '沈白露',
    role: '语文老师',
    meta: '3 分钟前',
    minutesAgo: 3,
    text: '我想改成低年级版本，能不能先不讲“托物言志”，只做物象和品质配对？',
    reply: '可以先保留“物象”和“品质”两步，最后用一句话带过“借石灰说自己想成为什么样的人”。',
    replyAuthor: '王清越',
    replies: 8,
    likes: 46,
    mine: true,
    participated: true,
  },
  {
    id: 'public-class',
    author: '浦东二小中语组',
    role: '备课组',
    meta: '12 分钟前',
    minutesAgo: 12,
    text: '公开课如果从“清白”这个词切入，再回到于谦，会不会比先介绍作者更有张力？',
    reply: '我们试过，先让学生猜“清白”不是颜色以后，再放作者处境，讨论会更自然。',
    replyAuthor: '陈思乔',
    replies: 14,
    likes: 82,
    participated: true,
  },
  {
    id: 'debate',
    author: '周青禾',
    role: '语文老师',
    meta: '28 分钟前',
    minutesAgo: 28,
    text: '我把第三关改成小组辩论了。孩子要用诗句证明“他怕不怕”，现场特别热。',
    reply: '这个切口很适合放进公开课版，我也想把“证明”改成投票前置。',
    replyAuthor: '林若水',
    replies: 11,
    likes: 69,
    participated: true,
  },
  {
    id: 'author-card',
    author: '陈思乔',
    role: '语文老师',
    meta: '45 分钟前',
    minutesAgo: 45,
    text: '有没有老师试过把于谦的生平做成“线索卡”？我担心背景太多会把诗意压住。',
    reply: '可以只保留两个选择题线索，不要做成长背景介绍。',
    replyAuthor: '小满老师',
    replies: 6,
    likes: 38,
  },
  {
    id: 'homework',
    author: '南山小学语文组',
    role: '备课组',
    meta: '1 小时前',
    minutesAgo: 60,
    text: '课后练笔如果接“竹石”“墨梅”，大家会让学生自己选物象，还是统一给材料？',
    reply: '我们统一给材料，最后开放一个自选物象，效果会稳一些。',
    replyAuthor: '周青禾',
    replies: 9,
    likes: 57,
    mine: true,
  },
  {
    id: 'board-writing',
    author: '钱嘉禾',
    role: '班主任',
    meta: '2 小时前',
    minutesAgo: 120,
    text: '我想把活动作品里的留白板书拿去改公开课，有没有适合最后 5 分钟生成总结的版本？',
    reply: '可以把最后一页做成“物象-品质-志向”三列表格，学生口述时同步填。',
    replyAuthor: '王清越',
    replies: 5,
    likes: 31,
  },
]

const workFilters: WorkFilter[] = ['全部作品', '我的作品', '最新发布', '最多投票', '我的投票']
const discussionFilters: DiscussionFilter[] = ['全部讨论', '我发起的', '我参与的', '最热讨论', '最新发布']
const pageSize = 8
const discussionPageSize = 5
const topicOptions = [
  { id: 'lotus', title: '《荷花》同题创作', votes: 286 },
  { id: 'young-china', title: '《少年中国说》朗读训练', votes: 241 },
  { id: 'xiaoyaoyou', title: '寓言故事互动课件', votes: 198 },
  { id: 'composition', title: '作文讲评投票墙', votes: 176 },
  { id: 'class-growth', title: '班级成长证据墙', votes: 133 },
] as const
const pastActivities = [
  { title: '《桂花雨》气味记忆展', meta: '642 位老师参与' },
  { title: '古诗默写全班抢答赛', meta: '518 位老师参与' },
  { title: '分角色朗读训练台', meta: '497 位老师参与' },
  { title: '作文反馈分层卡', meta: '386 位老师参与' },
  { title: '班级成长证据墙', meta: '531 位老师参与' },
]

type LimestoneActivityPageProps = {
  onBack: () => void
}

function LimestoneActivityPage({ onBack }: LimestoneActivityPageProps) {
  const [isFollowing, setIsFollowing] = useState(true)
  const [workFilter, setWorkFilter] = useState<WorkFilter>('全部作品')
  const [page, setPage] = useState(1)
  const [discussionFilter, setDiscussionFilter] = useState<DiscussionFilter>('全部讨论')
  const [discussionPage, setDiscussionPage] = useState(1)
  const [votedIds, setVotedIds] = useState<Set<string>>(() => new Set(['stone-proof']))
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)
  const [showTopicResults, setShowTopicResults] = useState(false)
  const [toast, setToast] = useState('')
  const [draft, setDraft] = useState('这个题目还可以怎么改？')

  const visibleWorks = useMemo(() => {
    const filtered = works.filter((work) => {
      if (workFilter === '我的作品') return work.mine
      if (workFilter === '我的投票') return votedIds.has(work.id)
      return true
    })

    return [...filtered].sort((a, b) => {
      if (workFilter === '最多投票') return b.votes - a.votes
      if (workFilter === '最新发布') return Number(Boolean(b.fresh)) - Number(Boolean(a.fresh))
      return Number(Boolean(b.fresh)) - Number(Boolean(a.fresh))
    })
  }, [votedIds, workFilter])

  const totalPages = Math.max(1, Math.ceil(visibleWorks.length / pageSize))
  const pageWorks = visibleWorks.slice((page - 1) * pageSize, page * pageSize)
  const visibleDiscussions = useMemo(() => {
    const filtered = discussions.filter((item) => {
      if (discussionFilter === '我发起的') return item.mine
      if (discussionFilter === '我参与的') return item.participated
      return true
    })

    return [...filtered].sort((a, b) => {
      if (discussionFilter === '最热讨论') return b.likes + b.replies * 2 - (a.likes + a.replies * 2)
      return a.minutesAgo - b.minutesAgo
    })
  }, [discussionFilter])
  const discussionTotalPages = Math.max(1, Math.ceil(visibleDiscussions.length / discussionPageSize))
  const pageDiscussions = visibleDiscussions.slice(
    (discussionPage - 1) * discussionPageSize,
    discussionPage * discussionPageSize,
  )
  const topicResults = topicOptions.map((topic) => ({
    ...topic,
    votes: topic.votes + (selectedTopicId === topic.id ? 1 : 0),
  }))
  const totalTopicVotes = topicResults.reduce((sum, topic) => sum + topic.votes, 0)

  function changeFilter(nextFilter: WorkFilter) {
    setWorkFilter(nextFilter)
    setPage(1)
  }

  function changeDiscussionFilter(nextFilter: DiscussionFilter) {
    setDiscussionFilter(nextFilter)
    setDiscussionPage(1)
  }

  const toggleSet = (id: string, setter: (next: Set<string>) => void, current: Set<string>) => {
    const next = new Set(current)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setter(next)
  }

  const showToast = (text: string) => {
    setToast(text)
    window.setTimeout(() => setToast(''), 2200)
  }

  return (
    <main className="activity-page">
      <div className="activity-topbar">
        <button className="back-button" type="button" onClick={onBack}>
          <ChevronRight size={17} />
          返回首页
        </button>
      </div>

      <section className="hero-section">
        <div className="hero-banner" style={{ backgroundImage: `url(${activityBanner})` }}>
          <div className="hero-copy">
            <div className="live-row">
              <span>进行中</span>
              <span>8.20 - 8.27</span>
            </div>
            <h1>《石灰吟》同题创作</h1>
            <p>同一首诗，不同课堂解法。分享你的创作，也看看老师们把“托物言志”玩出了哪些新花样。</p>
            <div className="hero-actions">
              <button
                className={`resource-action ${isFollowing ? 'followed-action' : 'light-action'}`}
                type="button"
                onClick={() => setIsFollowing(v => !v)}
              >
                {isFollowing ? '✓ 已关注' : '关注活动'}
              </button>
              <button className="resource-action primary-action" type="button" onClick={() => showToast('作品提交入口已打开')}>
                <Plus size={17} />
                提交我的作品
              </button>
            </div>
          </div>
          <div className="hero-stats" aria-label="活动数据">
            <div>
              <strong>2486</strong>
              <span>已关注</span>
            </div>
            <div>
              <strong>318</strong>
              <span>已提交</span>
            </div>
            <div>
              <strong>1.2万</strong>
              <span>已投票</span>
            </div>
          </div>
        </div>
      </section>

      <section className="activity-block" id="play">
        <div className="section-head">
          <h2>参与方式</h2>
        </div>
        <div className="play-steps">
          <article>
            <span className="step-index">1</span>
            <Sparkles size={21} />
            <h3>同题创作</h3>
            <p>围绕《石灰吟》，在飞象老师上做教学动画、互动课件或教育应用。</p>
          </article>
          <article>
            <span className="step-index">2</span>
            <Share2 size={21} />
            <h3>发布灵感</h3>
            <p>发布教学灵感时带上活动话题，进入活动作品流，其他老师可以查看、投票。</p>
          </article>
          <article>
            <span className="step-index">3</span>
            <Award size={21} />
            <h3>成就结算</h3>
            <p>优秀作品获得首页推荐、积分奖励和个人主页荣誉展示。</p>
          </article>
        </div>
      </section>

      <section className="activity-block" id="winners">
        <div className="section-head">
          <h2>上期优秀作品</h2>
        </div>
        <div className="winner-grid">
          {winningWorks.map((work, index) => (
            <article className="winner-card" key={work.title}>
              <div className="winner-cover">
                <img src={work.image} alt="" />
                <div className="winner-prize">
                  <span>TOP {index + 1}</span>
                  <strong>+{work.points}</strong>
                  <em>积分</em>
                </div>
              </div>
              <div className="winner-body">
                <div className="winner-meta-row">
                  <span>{work.praise}</span>
                </div>
                <h3>{work.title}</h3>
                <p>{work.author}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="works-section" id="works">
        <div className="works-main">
          <div className="section-head works-head">
            <div>
              <h2>活动作品</h2>
            </div>
            <div className="work-filter-row" aria-label="活动作品筛选">
              {workFilters.map((item) => (
                <button className={workFilter === item ? 'active' : ''} type="button" key={item} onClick={() => changeFilter(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <section className="vote-board" aria-label="现场投票榜">
            <div className="vote-board-title">
              <Flame size={18} />
              <h3>现场热度</h3>
            </div>
            <div className="vote-list">
              {voteLeaders.map((item, index) => (
                <article key={item.title}>
                  <span>{index + 1}</span>
                  <strong>{item.title}</strong>
                  <em>{item.votes} 票</em>
                </article>
              ))}
            </div>
          </section>

          <div className="work-grid">
            {pageWorks.map((work) => (
              <article
                className={`work-card ${work.tone}`}
                key={work.id}
                onClick={() => showToast('即将进入资源详情页')}
              >
                <div className="work-image">
                  <img src={work.image} alt="" />
                </div>
                <div className="work-body">
                  <h3>{work.title}</h3>
                  <p>{work.summary}</p>
                  <div className="author-row">
                    <span>{work.author.slice(0, 1)}</span>
                    <div>
                      <strong>{work.author}</strong>
                      <em>{work.school}</em>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      className={votedIds.has(work.id) ? 'active' : ''}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        toggleSet(work.id, setVotedIds, votedIds)
                      }}
                    >
                      <ThumbsUp size={16} />
                      投票 {votedIds.has(work.id) ? work.votes + 1 : work.votes}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination-row" aria-label="活动作品分页">
              <button type="button" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
                上一页
              </button>
              <span>
                {page} / {totalPages}
              </span>
              <button type="button" disabled={page === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>
                下一页
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="activity-block talk-section" id="talk">
        <div className="section-head discussion-head">
          <h2>活动讨论区</h2>
          <div className="discussion-filter-row" aria-label="活动讨论筛选">
            {discussionFilters.map((item) => (
              <button
                className={discussionFilter === item ? 'active' : ''}
                type="button"
                key={item}
                onClick={() => changeDiscussionFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="github-comments">
          <article className="comment-composer-row">
            <div className="comment-avatar self-avatar">我</div>
            <div className="comment-box composer-box">
              <div className="comment-box-head">
                <strong>参与讨论</strong>
                <span>围绕这期活动交流想法</span>
              </div>
              <textarea value={draft} onChange={(event) => setDraft(event.target.value)} />
              <div className="composer-actions">
                <button type="button" onClick={() => showToast('已发布到活动讨论区')}>
                  <SendHorizontal size={16} />
                  发布讨论
                </button>
              </div>
            </div>
          </article>

          <div className="discussion-list">
            {pageDiscussions.map((item) => (
              <article className="comment-row" key={item.author}>
                <div className="comment-avatar">{item.author.slice(0, 1)}</div>
                <div className="comment-box">
                  <div className="comment-box-head">
                    <strong>{item.author}</strong>
                    <span>{item.role} · {item.meta}</span>
                  </div>
                  <div className="comment-content">
                    <p>{item.text}</p>
                  </div>
                  <div className="comment-reply-preview">
                    <strong>{item.replyAuthor}</strong>
                    <span>{item.reply}</span>
                  </div>
                  <div className="discussion-actions">
                    <span>
                      <MessageCircle size={15} />
                      {item.replies} 条回复
                    </span>
                    <span>
                      <Heart size={15} />
                      {item.likes}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {discussionTotalPages > 1 && (
            <div className="pagination-row" aria-label="活动讨论分页">
              <button
                type="button"
                disabled={discussionPage === 1}
                onClick={() => setDiscussionPage((value) => Math.max(1, value - 1))}
              >
                上一页
              </button>
              <span>
                {discussionPage} / {discussionTotalPages}
              </span>
              <button
                type="button"
                disabled={discussionPage === discussionTotalPages}
                onClick={() => setDiscussionPage((value) => Math.min(discussionTotalPages, value + 1))}
              >
                下一页
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="activity-block next-topic-section" aria-label="下一期主题投票">
        <div className="activity-tail-grid">
          <section className="tail-column">
            <div className="section-head tail-head">
              <h2>投票下期主题</h2>
            </div>
            <div className="topic-poll-card">
              <div className="topic-poll-head">
                <div>
                  <strong>下一期同题创作，你更想参与哪一个？</strong>
                  <span>{totalTopicVotes.toLocaleString()} 位老师已参与</span>
                </div>
                <button type="button" onClick={() => setShowTopicResults(true)}>
                  查看结果
                </button>
              </div>
              {topicResults.map((topic) => {
                const percent = Math.round((topic.votes / totalTopicVotes) * 100)
                const shouldShowResult = showTopicResults || Boolean(selectedTopicId)
                return (
                  <button
                    className={`topic-poll-option ${selectedTopicId === topic.id ? 'selected' : ''} ${shouldShowResult ? 'show-result' : ''}`}
                    type="button"
                    key={topic.id}
                    onClick={() => {
                      setSelectedTopicId(topic.id)
                      setShowTopicResults(true)
                    }}
                  >
                    <i style={{ width: shouldShowResult ? `${percent}%` : '0%' }} />
                    <span>{topic.title}</span>
                    {shouldShowResult && (
                      <strong>
                        {percent}% · {topic.votes} 票
                      </strong>
                    )}
                  </button>
                )
              })}
              <div className="topic-poll-foot">
                <span>{selectedTopicId ? '已记录你的投票' : '选择一个主题完成投票'}</span>
                {selectedTopicId && <button type="button" onClick={() => setSelectedTopicId(null)}>重新选择</button>}
              </div>
            </div>
          </section>

          <section className="tail-column">
            <div className="section-head tail-head">
              <h2>回顾往期活动</h2>
            </div>
            <aside className="past-activity-card" aria-label="回顾往期活动">
              <div className="past-activity-list">
                {pastActivities.map((activity, index) => (
                  <button type="button" key={activity.title} onClick={() => showToast('即将进入往期活动')}>
                    <i>{index + 1}</i>
                    <span>{activity.title}</span>
                    <em>{activity.meta}</em>
                  </button>
                ))}
              </div>
              <button className="past-activity-more" type="button" onClick={() => showToast('即将打开全部往期活动')}>
                查看全部&gt;&gt;
              </button>
            </aside>
          </section>
        </div>
      </section>

      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}

      <footer className="page-footer">
        <span>活动最终解释权归飞象老师所有</span>
      </footer>
    </main>
  )
}

export default LimestoneActivityPage
