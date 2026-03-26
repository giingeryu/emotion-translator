'use client'

import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            ← 返回首页
          </Link>
        </div>
        
        <SignIn 
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-lg rounded-lg',
            }
          }}
        />
        
        <p className="text-center text-sm text-gray-500 mt-6">
          登录即表示你同意我们的服务条款
        </p>
      </div>
    </div>
  )
}
