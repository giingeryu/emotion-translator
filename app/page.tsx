import { redirect } from 'next/navigation'

export default function Home() {
  // MVP阶段直接跳转到翻译页
  redirect('/translate')
}
