# 家长情绪翻译器

> 把想骂的话，翻译成孩子能听进去的话

## 功能特点

- 📝 **纯文字输入** - 打字过程就是给情绪降温
- 🎯 **情境感知** - 根据孩子年龄、性格、当前场景定制话术
- 🔊 **语音播放** - 深呼吸，听一遍，再说出口
- 👨‍👩‍👧‍👦 **多孩子支持** - 为每个孩子建立专属档案

## 技术栈

- Next.js 14 + React 19
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Clerk 认证
- Moonshot (Kimi) AI - 国内稳定

## 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的配置

# 初始化数据库
npx prisma db push

# 运行开发服务器
npm run dev
```

## 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

## 环境变量

| 变量名 | 说明 |
|--------|------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk 公钥 |
| `CLERK_SECRET_KEY` | Clerk 密钥 |
| `DATABASE_URL` | PostgreSQL 连接字符串 |
| `MOONSHOT_API_KEY` | Moonshot (Kimi) API Key - 国内稳定 |

## 使用流程

1. 登录/注册
2. 添加孩子档案（年龄、性格）
3. 输入你想吐槽的内容
4. 填写当前情境
5. 获取 AI 转化的积极话术
6. 播放语音，深呼吸，然后开口

## 后续计划

- [ ] 用户评分反馈
- [ ] 高频场景快捷入口
- [ ] 话术收藏夹
- [ ] 会员系统
- [ ] 更多育儿应用矩阵

## 关于

本项目基于 [Next.js](https://nextjs.org/) 构建，使用 [Moonshot (Kimi)](https://platform.moonshot.cn/) 提供 AI 能力。

核心理念：**打字的过程就是给情绪降温。**
