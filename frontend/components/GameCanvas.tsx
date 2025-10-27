import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'

export default function GameCanvas(){
  const [timeLeft, setTimeLeft] = useState(10)
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [pos, setPos] = useState({x:50,y:50})
  const [level, setLevel] = useState(1)
  const [targetSize, setTargetSize] = useState(48)
  const timerRef = useRef<number|null>(null)
  const router = useRouter()

  useEffect(()=>{
    if (!running) return
    timerRef.current = window.setInterval(()=>{
      setTimeLeft(t=>{
        if (t<=1) {
          clearInterval(timerRef.current!)
          setRunning(false)
          localStorage.setItem('lastScore', String(score))
          router.push({ pathname: '/game-over', query: { score } })
          return 0
        }
        return t-1
      })
    }, 1000)
    return ()=>{ if (timerRef.current) clearInterval(timerRef.current) }
  }, [running, score, router])

  function start(){
    setScore(0)
    setLevel(1)
    setTargetSize(48)
    setTimeLeft(10)
    setRunning(true)
    randomize()
  }

  function randomize(){
    const x = Math.floor(Math.random()*80)+10
    const y = Math.floor(Math.random()*80)+10
    setPos({x,y})
  }

  function hit(){
    if (!running) return
    setScore(s=>s+1)
    randomize()
    // level progression: every 10 points, increase level and make target smaller and faster
    setScore(s=>{
      const newScore = s+1
      const newLevel = Math.floor(newScore/10)+1
      if (newLevel>level){
        setLevel(newLevel)
        setTargetSize(sz => Math.max(20, Math.round(sz*0.85)))
        // shorten remaining time slightly as difficulty
        setTimeLeft(t => Math.max(3, t-1))
      }
      return newScore
    })
  }

  return (
  <div className="relative h-64 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-gray-800 rounded-lg border dark:border-gray-700 p-4 transition-colors duration-500">
      <div className="flex justify-between mb-2">
        <div className="text-sm text-gray-700 dark:text-gray-200">Time: <span className="font-bold">{timeLeft}s</span></div>
        <div className="text-sm text-gray-700 dark:text-gray-200">Score: <span className="font-bold">{score}</span></div>
      </div>
      <div className="relative h-44">
        <button onClick={hit} className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-400 dark:bg-pink-600 text-white shadow-lg dark:shadow-neon" style={{left: `${pos.x}%`, top: `${pos.y}%`, width: targetSize, height: targetSize}}>
          GO
        </button>
      </div>
      <div className="mt-4 flex gap-2">
        <div className="flex items-center gap-3">
          <button onClick={start} className="px-4 py-2 bg-indigo-600 dark:bg-purple-700 text-white rounded shadow-neon hover:scale-105 transition-transform">Start</button>
          <div className="text-sm text-gray-700 dark:text-gray-200">Level: <span className="font-semibold">{level}</span></div>
        </div>
        <button onClick={()=>{setRunning(false); setTimeLeft(0); localStorage.setItem('lastScore', String(score)); router.push({ pathname:'/game-over', query:{score} })}} className="px-4 py-2 border dark:border-gray-700 rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-900">End</button>
      </div>
    </div>
  )
}
