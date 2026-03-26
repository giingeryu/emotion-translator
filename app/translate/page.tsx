'use client'

import { useState } from 'react'

// 简化版翻译页 - 无需登录和数据库，直接测试AI功能
export default function TranslatePage() {
  const [childAge, setChildAge] = useState('6')
  const [temperament, setTemperament] = useState('active')
  const [originalText, setOriginalText] = useState('')
  const [scene, setScene] = useState('')
  const [emotionLevel, setEmotionLevel] = useState(5)
  const [goal, setGoal] = useState('immediate')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [speaking, setSpeaking] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!originalText.trim()) return

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childAge: parseInt(childAge),
          temperament,
          originalText,
          scene,
          emotionLevel,
          goal
        })
      })

      const data = await res.json()
      if (data.positiveText) {
        setResult(data.positiveText)
      } else {
        alert('翻译失败：' + (data.error || '请重试'))
      }
    } catch (error) {
      alert('翻译失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.9
      utterance.onstart = () => setSpeaking(true)
      utterance.onend = () => setSpeaking(false)
      window.speechSynthesis.speak(utterance)
    } else {
      alert('您的浏览器不支持语音播放')
    }
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  const parseResult = (text: string) => {
    const parts = text.split('###')
    const versions = parts.slice(0, -1)
    const lastPart = parts[parts.length - 1] || ''
    const principleMatch = lastPart.match(/原理[:：](.+)/)
    const principle = principleMatch ? principleMatch[1].trim() : ''
    return { versions, principle }
  }

  const temperamentLabels: Record<string, string> = {
    sensitive: '敏感细腻',
    stubborn: '倔强固执',
    slow: '慢热内向',
    active: '活泼好动'
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">家长情绪翻译器</h1>
        <p className="text-gray-600">把想骂的话，翻译成孩子能听进去的话</p>
      </div>

      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 孩子信息 */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-medium mb-3">孩子信息</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">年龄</label>
                <input
                  type="number"
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                  min="1"
                  max="18"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">性格</label>
                <select
                  value={temperament}
                  onChange={(e) => setTemperament(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="sensitive">敏感细腻</option>
                  <option value="stubborn">倔强固执</option>
                  <option value="slow">慢热内向</option>
                  <option value="active">活泼好动</option>
                </select>
              </div>
            </div>
          </div>

          {/* 吐槽输入 */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              你想说什么？
            </label>
            <textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="比如：你怎么这么磨蹭！快一点不行吗？"
              rows={4}
              required
              className="w-full px-3 py-2 border rounded-lg resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 打字的过程就是给情绪降温
            </p>
          </div>

          {/* 情境信息 */}
          <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
            <h3 className="font-medium">当前情境</h3>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">发生了什么？</label>
              <input
                type="text"
                value={scene}
                onChange={(e) => setScene(e.target.value)}
                placeholder="比如：出门上学、写作业"
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                情绪强度：{emotionLevel}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={emotionLevel}
                onChange={(e) => setEmotionLevel(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>平静</span>
                <span>爆发边缘</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">期望目标</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="immediate">马上执行</option>
                <option value="habit">长期习惯培养</option>
                <option value="calm">先冷静情绪</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? '翻译中...' : '转化为积极话术'}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-green-900">✨ 试试这样说</h3>
              <button
                onClick={() => setResult(null)}
                className="text-sm text-gray-600"
              >
                重新输入
              </button>
            </div>

            {(() => {
              const { versions, principle } = parseResult(result)
              return (
                <>
                  <div className="space-y-4">
                    {versions.map((version, index) => {
                      const cleanVersion = version.replace(/^版本\d+[:：]\s*/, '').trim()
                      return (
                        <div key={index} className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                          <div className="flex items-start justify-between">
                            <p className="text-gray-800 flex-1 whitespace-pre-wrap">{cleanVersion}</p>
                            <button
                              onClick={() => speakText(cleanVersion)}
                              className="ml-3 p-2 text-green-600 hover:bg-green-100 rounded-full"
                            >
                              {speaking ? '⏹️' : '🔊'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  {principle && (
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <p className="text-sm text-green-800">
                        <span className="font-medium">💡 原理：</span>{principle}
                      </p>
                    </div>
                  )}
                </>
              )
            })()}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(result.replace(/###/g, '\n\n'))
                alert('已复制')
              }}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg"
            >
              复制
            </button>
            <button
              onClick={() => setResult(null)}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
            >
              再来一次
            </button>
          </div>

          {speaking && (
            <button
              onClick={stopSpeaking}
              className="w-full bg-red-100 text-red-700 py-2 rounded-lg"
            >
              停止播放
            </button>
          )}
        </div>
      )}
    </div>
  )
}
