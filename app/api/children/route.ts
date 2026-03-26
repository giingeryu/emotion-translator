import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, age, temperament, notes } = body

    // 获取或创建用户
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      user = await prisma.user.create({
        data: { clerkId: userId }
      })
    }

    // 创建孩子档案
    const child = await prisma.childProfile.create({
      data: {
        userId: user.id,
        name,
        age,
        temperament,
        notes
      }
    })

    return NextResponse.json(child)
  } catch (error) {
    console.error('Error creating child:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { children: { orderBy: { createdAt: 'desc' } } }
    })

    if (!user) {
      return NextResponse.json({ children: [] })
    }

    return NextResponse.json({ children: user.children })
  } catch (error) {
    console.error('Error fetching children:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
