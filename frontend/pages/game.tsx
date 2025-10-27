import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import ParticleBackground from '../components/ParticleBackground'

const GameCanvas = dynamic(() => import('../components/GameCanvas'), { ssr: false })

export default function GamePage() {
  const router = useRouter()
  useEffect(()=>{
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null
    if (!token) router.replace('/login')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-gray-900">
      <ParticleBackground />
      <div className="w-full max-w-2xl card rounded-2xl shadow-soft p-6 relative z-10 bg-white dark:bg-slate-900 transition-colors duration-500">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Click Frenzy</h2>
          <Link href="/" className="text-sm text-gray-600 dark:text-gray-300">Back</Link>
        </div>
        <GameCanvas />
      </div>
      {/* decorative blurred shapes */}
      <div className="blur-shape" style={{width:200,height:200,left:-60,top:-40,background:'linear-gradient(90deg,#7c3aed,#06b6d4)'}} />
      <div className="blur-shape" style={{width:260,height:260,right:-80,bottom:-60,background:'linear-gradient(90deg,#ef4444,#f97316)'}} />
    </div>
  )
}
