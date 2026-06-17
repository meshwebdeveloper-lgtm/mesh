import { useEffect, useRef } from "react";

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas particle engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle pool tuned to the luxury color scheme
    const count = 35;
    const particles: { x: number; y: number; r: number; vx: number; vy: number; baseAlpha: number; alpha: number; color: string }[] = [];
    const colors = ["rgba(255,176,144,0.25)", "rgba(202,89,149,0.2)", "rgba(93,28,106,0.15)"];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.15 - Math.random() * 0.2, // slow upward float
        baseAlpha: 0.2 + Math.random() * 0.5,
        alpha: 0,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Capture mouse movement
    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw and update particles with natural repulsion
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        // Float fade modulation
        p.alpha = p.baseAlpha * (1 + Math.sin(Date.now() * 0.001 + p.x * 0.01) * 0.3);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        // Replace alpha values safely
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* Canvas Layer for magnetic particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none select-none opacity-45"
      />

      {/* Floating Dynamic Blur Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#FFB090]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#5D1C6A]/8 blur-[130px]" />
      </div>
    </>
  );
}
