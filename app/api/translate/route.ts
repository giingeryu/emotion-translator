import { NextResponse } from 'next/server'

const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || ''
const MOONSHOT_API_URL = 'https://api.moonshot.cn/v1/chat/completions'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { childAge, temperament, originalText, scene, emotionLevel, goal } = body

    const temperamentLabels: Record<string, string> = {
      sensitive: '敏感细腻',
      stubborn: '倔强固执',
      slow: '慢热内向',
      active: '活泼好动'
    }

    const goalLabels: Record<string, string> = {
      immediate: '马上执行',
      habit: '长期习惯培养',
      calm: '先冷静情绪'
    }

    const prompt = `你是一位专业的正面管教教练和儿童心理学专家。
请将家长的负面吐槽转化为积极、建设性的沟通话术。

转换原则：
1. 从"你"语言转向"我"语言（表达感受而非指责）
2. 给出具体可行的建议，而非空洞的安慰
3. 尊重孩子的自主性，提供选择而非命令
4. 关注解决方案，而非纠缠问题本身
5. 语气温暖但坚定，避免说教感

孩子信息：
- 年龄：${childAge}岁
- 性格特点：${temperamentLabels[temperament] || temperament}

当前情境：
- 场景：${scene}
- 家长情绪强度：${emotionLevel}/10
- 期望目标：${goalLabels[goal] || goal}

家长原话（想吐槽的内容）：
"${originalText}"

请提供：
1. 转化后的积极话术（2-3个版本，每个版本用###分隔）
2. 简要说明背后的教育心理学原理（一句话）

格式：
版本1：
[话术内容]

###

版本2：
[话术内容]

###

版本3：
[话术内容]

原理：[原理说明]`

    const response = await fetch(MOONSHOT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MOONSHOT_API_KEY}`
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k',
        messages: [
          { role: 'system', content: '你是一位专业的正面管教教练和儿童心理学专家。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Moonshot API error:', response.status, errorText)
      return NextResponse.json({ error: `API错误: ${response.status}` }, { status: 500 })
    }

    const data = await response.json()
    const positiveText = data.choices?.[0]?.message?.content || '翻译失败，请重试'

    return NextResponse.json({ positiveText })
  } catch (error) {
    console.error('Error translating:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
