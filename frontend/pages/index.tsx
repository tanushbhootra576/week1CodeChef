import Link from 'next/link'
import ParticleBackground from "../components/ParticleBackground";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500">
      {/* Only show animated particle background and blurred shapes */}
      <ParticleBackground />
      {/* Blurred shapes always visible */}
      <div className="blur-shape" style={{width:220,height:220,left:-80,top:-40,background:'linear-gradient(90deg,#7c3aed,#06b6d4)'}} />
      <div className="blur-shape" style={{width:260,height:260,right:-100,bottom:-60,background:'linear-gradient(90deg,#ef4444,#f97316)'}} />
      <div className="max-w-md w-full card shadow-soft p-8 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Click Frenzy</h1>
        <p className="text-center text-base mb-6" style={{color:'var(--text-muted, #6b7280)'}}>Click the target as many times as you can in 10 seconds. Level up for more challenge!</p>
        <div className="flex gap-4 justify-center mt-4">
          <Link href="/game" className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-neon hover:scale-105 transition-transform">Play</Link>
          <Link href="/leaderboard" className="px-4 py-3 rounded-full bg-card border border-gray-200 dark:border-gray-700 shadow text-sm text-gray-700 dark:text-gray-200 hover:scale-105 transition-transform">Leaderboard</Link>
        </div>
      </div>
    </div>
  )
}
