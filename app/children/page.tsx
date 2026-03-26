import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ChildrenPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { children: { orderBy: { createdAt: 'desc' } } }
  })

  if (!user) {
    redirect('/login')
  }

  const temperamentLabels: Record<string, string> = {
    sensitive: '敏感细腻',
    stubborn: '倔强固执',
    slow: '慢热内向',
    active: '活泼好动'
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">我的孩子</h1>
        <Link 
          href="/children/new"
          className="text-blue-600 hover:text-blue-700"
        >
          + 添加孩子
        </Link>
      </div>

      {user.children.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">还没有添加孩子档案</p>
          <Link 
            href="/children/new"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            添加第一个孩子
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {user.children.map((child) => (
            <div key={child.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    {child.name || `孩子${child.age}岁`}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {child.age}岁 · {temperamentLabels[child.temperament] || child.temperament}
                  </p>
                  {child.notes && (
                    <p className="text-gray-500 text-sm mt-1">{child.notes}</p>
                  )}
                </div>
                <Link
                  href={`/translate?childId=${child.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  使用
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link 
          href="/translate"
          className="text-gray-600 hover:text-gray-900"
        >
          去翻译页 →
        </Link>
      </div>
    </div>
  )
}
