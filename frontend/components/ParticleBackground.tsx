import { useEffect, useRef } from 'react'



export default function ParticleBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let w = canvas.width = canvas.clientWidth;
    let h = canvas.height = canvas.clientHeight;

    // Detect system theme
    let isDark = false;
    if (typeof window !== 'undefined') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Color palette for particles
    const palette = [
      '#6366f1', '#818cf8', '#06b6d4', '#f97316', '#ef4444', '#a21caf', '#facc15'
    ];
    const particles = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 2 + Math.random() * 5,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      alpha: 0.22 + Math.random() * 0.5,
      color: palette[Math.floor(Math.random() * palette.length)]
    }));

    let raf = 0;
    function onResize() {
      if (!ref.current) return;
      w = ref.current.width = ref.current.clientWidth;
      h = ref.current.height = ref.current.clientHeight;
    }
    window.addEventListener('resize', onResize);

    function draw() {
      ctx.clearRect(0, 0, w, h);
      // Add a soft gradient background based on theme
      const grad = ctx.createLinearGradient(0, 0, w, h);
      if (isDark) {
        grad.addColorStop(0, '#18181b');
        grad.addColorStop(1, '#6366f1');
      } else {
        grad.addColorStop(0, '#f8fafc');
        grad.addColorStop(1, '#e0e7ff');
      }
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full -z-10" style={{ pointerEvents: 'none' }} />;
}
