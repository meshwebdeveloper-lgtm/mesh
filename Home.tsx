import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Activity, 
  Layers, 
  Sliders, 
  Waves, 
  Compass, 
  Cpu, 
  ArrowRight, 
  Monitor, 
  Terminal, 
  CheckCircle,
  Clock,
  Briefcase,
  Heart
} from "lucide-react";

interface HomeProps {
  navigate: (path: string) => void;
}

// Portfolio Case Study Type
interface CaseStudy {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  color: string;
}

export default function Home({ navigate }: HomeProps) {
  // Cinematic transition settings
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.15 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 40 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  // --- HORIZON LABORATORY SYSTEM STATES ---
  const [activeTab, setActiveTab] = useState<"physics" | "fluid" | "portfolio">("physics");
  
  // 1. Spring Physics State
  const [stiffness, setStiffness] = useState(150);
  const [damping, setDamping] = useState(15);
  const [interactiveMode, setInteractiveMode] = useState<"float" | "attract">("float");
  
  const sandboxRef = useRef<HTMLDivElement>(null);
  const [targetPos, setTargetPos] = useState({ x: 150, y: 150 });
  const [ballPos, setBallPos] = useState({ x: 150, y: 150 });
  const velocity = useRef({ x: 0, y: 0 });

  // Custom simulation for Physics spring interactive orb
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const updatePhysics = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1); // cap elapsed delta values
      lastTime = time;

      // Spring formula: Force = -k * displacement - d * velocity
      const displacementX = ballPos.x - targetPos.x;
      const displacementY = ballPos.y - targetPos.y;

      const forceX = -stiffness * displacementX - damping * velocity.current.x;
      const forceY = -stiffness * displacementY - damping * velocity.current.y;

      // Update velocities
      velocity.current.x += forceX * dt;
      velocity.current.y += forceY * dt;

      // Update positions
      setBallPos((prev) => {
        const nextX = prev.x + velocity.current.x * dt;
        const nextY = prev.y + velocity.current.y * dt;
        return { x: nextX, y: nextY };
      });

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, [ballPos, targetPos, stiffness, damping]);

  // Handle pointer tracking inside sandbox
  const handleSandboxMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sandboxRef.current) return;
    const rect = sandboxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTargetPos({ x, y });
  };

  const handleSandboxTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!sandboxRef.current || e.touches.length === 0) return;
    const rect = sandboxRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    setTargetPos({ x, y });
  };

  // 2. Fluid Wave Canvas Controller
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fluidPointer = useRef({ x: 200, y: 150, active: false });
  const waveOffset = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    
    // Resize handler
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = (rect?.width || 500) * (window.devicePixelRatio || 1);
      canvas.height = (rect?.height || 280) * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Drawing loop
    const render = () => {
      if (!canvas) return;
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, width, height);

      // Background mesh grid
      ctx.strokeStyle = "rgba(93, 28, 106, 0.04)";
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      waveOffset.current += 0.015;

      // Draw layered interactive wave ribbons
      const drawWave = (amplitude: number, freq: number, speedOffset: number, color: string, alpha: number) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 3;

        for (let x = 0; x <= width; x += 3) {
          // Distance from user cursor
          const dx = x - fluidPointer.current.x;
          const dist = Math.sqrt(dx * dx + (height / 2 - fluidPointer.current.y) * (height / 2 - fluidPointer.current.y));
          
          // Ripple multiplier if cursor is active or nearby
          const proximityMultiplier = Math.max(0, 1 - dist / 220);
          const localAmp = amplitude + proximityMultiplier * 35;
          const localFreq = freq + proximityMultiplier * 0.01;

          const y = height / 2 + 
            Math.sin(x * localFreq + waveOffset.current * speedOffset) * localAmp +
            Math.cos(x * 0.005 - waveOffset.current * 0.5) * (amplitude * 0.3);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      };

      // Draw three beautiful overlapping waves matching palette #CA5995, #FFB090, #5D1C6A
      drawWave(25, 0.008, 1.2, "#CA5995", 0.65);
      drawWave(18, 0.012, 0.8, "#FFB090", 0.85);
      drawWave(12, 0.018, 1.6, "#5D1C6A", 0.35);

      // Draw interaction focal source
      if (fluidPointer.current.active) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "#FFB090";
        ctx.beginPath();
        ctx.arc(fluidPointer.current.x, fluidPointer.current.y, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = "#CA5995";
        ctx.beginPath();
        ctx.arc(fluidPointer.current.x, fluidPointer.current.y, 22, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1.0; // reset
      animId = requestAnimationFrame(render);
    };

    render();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      fluidPointer.current.x = e.clientX - rect.left;
      fluidPointer.current.y = e.clientY - rect.top;
      fluidPointer.current.active = true;
    };

    const handlePointerLeave = () => {
      fluidPointer.current.active = false;
    };

    canvas.addEventListener("mousemove", handlePointerMove);
    canvas.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (canvas) {
        canvas.removeEventListener("mousemove", handlePointerMove);
        canvas.removeEventListener("mouseleave", handlePointerLeave);
      }
      cancelAnimationFrame(animId);
    };
  }, []);

  // 3. Portfolios list
  const showcaseCaseStudies: CaseStudy[] = [
    {
      id: "nocturne",
      title: "Nocturne Webspace",
      category: "Bespoke Editorial Architecture",
      year: "2026",
      description: "An ultra-premium, asymmetrical digital architecture canvas presenting design portfolio items under interactive spatial coordinates and grid configurations.",
      color: "#FFB090"
    },
    {
      id: "aethelgard",
      title: "Aethelgard Chrono",
      category: "High-Horology Configurator",
      year: "2025",
      description: "An emotionally resonant watch designer experience built around structural glass mechanics, physics-calibrated escapement gears, and spring-loaded camera orbits.",
      color: "#FFF1D3"
    },
    {
      id: "solaris",
      title: "Solaris Maritime",
      category: "Bespoke Yacht Platform",
      year: "2026",
      description: "A clean, modern fluid configuration engine celebrating naval luxury. Smooth, gravity-aware sails adjust instantly in response to live wind pressure simulations.",
      color: "#CA5995"
    }
  ];

  const [activeShowcase, setActiveShowcase] = useState<string>("nocturne");

  // Rotating audio wave mock state
  const [audioWaveProgress, setAudioWaveProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setAudioWaveProgress((p) => (p + 1) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen text-[#5D1C6A] pt-20 pb-16 overflow-x-hidden"
    >
      {/* SECTION 1: LUXURY HERO STAGE */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden px-6 pb-12">
        {/* Cinematic Backdrop: Sunset beach & Swaying Palms */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#FFF1D3] via-[#FFF1D3]/40 to-[#FFF1D3]">
          {/* Luminous Gradient Mesh Orbs */}
          <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-[#FFB090]/20 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: "14s" }} />
          <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-[#FFF1D3]/60 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: "18s" }} />
          <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-[#CA5995]/5 rounded-full blur-[120px]" />

          {/* Detailed SVG Vector Swaying Palms */}
          <div className="absolute inset-x-0 bottom-0 h-48 flex justify-between items-end opacity-10 pointer-events-none z-20">
            {/* Left Palm cluster */}
            <div className="w-80 h-full ml-4 md:ml-12 select-none">
              <svg viewBox="0 0 100 120" className="w-full h-full fill-[#CA5995] pointer-events-none animate-pulse" style={{ animationDuration: "8s" }}>
                <path d="M10,120 Q18,90 28,60 T42,10" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                <path d="M42,10 C32,5 20,12 12,22 C22,18 35,14 42,10 Z" />
                <path d="M42,10 C30,-2 18,3 9,15 C20,9 35,8 42,10 Z" />
                <path d="M42,10 C40,-8 28,-10 20,-4 C30,-4 38,0 42,10 Z" />
                <path d="M42,10 C50,-8 62,-10 70,-4 C60,-4 52,0 42,10 Z" />
                <path d="M42,10 C54,-2 66,3 75,15 C64,9 49,8 42,10 Z" />
                <path d="M42,10 C52,5 64,12 72,22 C62,18 49,14 42,10 Z" />
              </svg>
            </div>

            {/* Right Palm cluster */}
            <div className="w-80 h-full mr-4 md:mr-12 select-none">
              <svg viewBox="0 0 100 120" className="w-full h-full fill-[#CA5995] pointer-events-none animate-pulse" style={{ animationDuration: "12s" }}>
                <path d="M90,120 Q82,90 72,60 T58,10" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                <path d="M58,10 C48,5 36,12 28,22 C38,18 51,14 58,10 Z" />
                <path d="M58,10 C46,-2 34,3 25,15 C36,9 51,8 58,10 Z" />
                <path d="M58,10 C56,-8 44,-10 36,-4 C46,-4 54,0 58,10 Z" />
                <path d="M58,10 C66,-8 78,-10 86,-4 C76,-4 68,0 58,10 Z" />
                <path d="M58,10 C70,-2 82,3 91,15 C80,9 65,8 58,10 Z" />
                <path d="M58,10 C68,5 80,12 88,22 C78,18 65,14 58,10 Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Hero Interactive Content */}
        <div className="relative z-30 max-w-5xl text-center mx-auto mt-6 md:mt-10 select-text px-4">
          
          {/* Animated Tech Badge */}
          <motion.div 
            variants={itemVariants} 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFB090]/20 border border-[#CA5995]/20 text-[#CA5995] text-xs tracking-widest uppercase font-mono mb-8 font-semibold shadow-sm select-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#CA5995] animate-spin" style={{ animationDuration: "6s" }} />
            <span>Interactive Digital Horizon Experience</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-8xl font-display font-medium tracking-tight text-[#5D1C6A] leading-[1.05] mb-8"
          >
            We curate high-end <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CA5995] via-[#FFB090] to-[#CA5995] bg-[size:200%_auto] animate-pulse">
              digital horizons
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg font-sans text-[#5D1C6A]/85 leading-relaxed max-w-3xl mx-auto mb-10 font-light"
          >
            An elite creative technology collective shaping emotionally responsive micro-animations, liquid spring dynamics, and perfectly formatted database models for creators worldwide.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-5 select-none">
            <button 
              onClick={() => navigate("/services")}
              className="group relative px-8 py-4 bg-[#CA5995] text-white font-mono text-xs uppercase tracking-widest rounded-full hover:bg-[#CA5995]/90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md font-semibold flex items-center gap-2"
            >
              <span>See Our Services</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
            <button 
              onClick={() => navigate("/contact")}
              className="px-8 py-4 bg-white/40 border border-[#CA5995]/20 text-[#CA5995] font-mono text-xs uppercase tracking-widest rounded-full hover:bg-white/70 hover:scale-105 active:scale-95 transition-all duration-300 font-semibold"
            >
              Start a Project
            </button>
          </motion.div>

          {/* Quick Metrics Block for Client Appeal */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-20 border-t border-[#CA5995]/10 pt-8"
          >
            <div className="text-center p-3">
              <div className="text-xl md:text-3xl font-display font-semibold text-[#5D1C6A]">100%</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#5D1C6A]/65 mt-1">Client Alignment</div>
            </div>
            <div className="text-center p-3">
              <div className="text-xl md:text-3xl font-display font-semibold text-[#5D1C6A]">&lt; 150ms</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#5D1C6A]/65 mt-1">Interaction Latency</div>
            </div>
            <div className="text-center p-3">
              <div className="text-xl md:text-3xl font-display font-semibold text-[#5D1C6A]">10+</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#5D1C6A]/65 mt-1">Countries Guided</div>
            </div>
            <div className="text-center p-3">
              <div className="text-xl md:text-3xl font-display font-semibold text-[#5D1C6A]">Sheets</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#5D1C6A]/65 mt-1">Automated Sync</div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION 2: THE CURATED PATH & PHILOSOPHY */}
      <section className="relative px-6 py-28 bg-[#FFF1D3] overflow-hidden select-text border-t border-b border-[#5D1C6A]/5">
        {/* Ambient aesthetic gold orb */}
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#FFB090]/15 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          
          <div className="max-w-3xl mb-24">
            <span className="font-mono text-xs text-[#CA5995] uppercase tracking-widest bg-[#FFB090]/25 px-4 py-1.5 rounded-full font-semibold">
              Signature Pillars
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-semibold text-[#5D1C6A] mt-6 leading-tight">
              A bespoke web standard.
            </h2>
            <p className="text-sm md:text-base text-[#5D1C6A]/85 leading-relaxed font-sans mt-6 font-light max-w-2xl">
              We design web platforms that combine high literature aesthetics with robust backends. Every line of code is handwritten to provide optimal performance, perfect modular scalability, and secure system interactions.
            </p>
          </div>

          {/* THE STEPS TIMELINE (Elegant asymmetric presentation replacing rigid 6/3 boxes) */}
          <div className="space-y-20 relative before:absolute before:inset-y-0 before:left-4 md:before:left-1/2 before:w-[1px] before:bg-gradient-to-b before:from-[#CA5995]/40 before:via-[#FFB090]/50 before:to-[#5D1C6A]/10">
            
            {/* Vector 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative flex flex-col md:flex-row items-stretch md:justify-between group"
            >
              <div className="absolute left-4 md:left-1/2 w-3.5 h-3.5 rounded-full bg-[#CA5995] border-4 border-[#FFF1D3] -translate-x-[7.5px] top-1 z-20 shadow-md group-hover:scale-125 transition-transform" />
              
              <div className="pl-10 md:pr-10 md:pl-0 md:w-[45%] md:text-right pr-6">
                <span className="font-mono text-base font-bold text-[#CA5995]">Vector I</span>
                <h3 className="text-xl md:text-2xl font-display font-semibold text-[#5D1C6A] mt-2 mb-4">Elite Typography & Layout Curation</h3>
              </div>
              <div className="pl-10 md:pl-10 md:w-[45%] flex flex-col justify-center">
                <p className="text-xs sm:text-sm text-[#5D1C6A]/80 leading-relaxed font-light">
                  We couple professional typographic systems with balanced asymmetric negative space. By utilizing elegant combinations like Inter and Space Grotesk, we make your digital content read, feel, and flow like a masterpiece physical editorial spread.
                </p>
              </div>
            </motion.div>

            {/* Vector 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative flex flex-col md:flex-row items-stretch md:justify-between group"
            >
              <div className="absolute left-4 md:left-1/2 w-3.5 h-3.5 rounded-full bg-[#FFB090] border-4 border-[#FFF1D3] -translate-x-[7.5px] top-1 z-20 shadow-md group-hover:scale-125 transition-transform" />
              
              <div className="pl-10 md:pl-0 md:w-[45%] md:order-2 md:pl-10">
                <span className="font-mono text-base font-bold text-[#FFB090]">Vector II</span>
                <h3 className="text-xl md:text-2xl font-display font-semibold text-[#5D1C6A] mt-2 mb-4">Secure Google Sheet Synchronization</h3>
              </div>
              <div className="pl-10 md:pl-0 md:w-[45%] md:text-right md:pr-10 md:order-1 flex flex-col justify-center">
                <p className="text-xs sm:text-sm text-[#5D1C6A]/80 leading-relaxed font-light">
                  All forms, contact details, cookie alignments, and analytics streams are securely processed server-side. Private Keys are kept fully concealed, while data streams directly into your designated, real-world Google Sheet in real-time.
                </p>
              </div>
            </motion.div>

            {/* Vector 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative flex flex-col md:flex-row items-stretch md:justify-between group animate-none"
            >
              <div className="absolute left-4 md:left-1/2 w-3.5 h-3.5 rounded-full bg-[#5D1C6A] border-4 border-[#FFF1D3] -translate-x-[7.5px] top-1 z-20 shadow-md group-hover:scale-125 transition-transform" />
              
              <div className="pl-10 md:pr-10 md:pl-0 md:w-[45%] md:text-right pr-6">
                <span className="font-mono text-base font-bold text-[#5D1C6A]">Vector III</span>
                <h3 className="text-xl md:text-2xl font-display font-semibold text-[#5D1C6A] mt-2 mb-4">Fluid Kinetic Transitions</h3>
              </div>
              <div className="pl-10 md:pl-10 md:w-[45%] flex flex-col justify-center">
                <p className="text-xs sm:text-sm text-[#5D1C6A]/80 leading-relaxed font-light">
                  We integrate refined motion sequences, scroll multipliers, dynamic hover states, and parallax overlays. The screen adapts smoothly to human scrolling velocity, delivering organic feedback without slowing down viewport frame rates.
                </p>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* SECTION 3: THE SIGNATURE PORTFOLIO */}
      <section className="relative px-6 py-28 bg-[#FFF1D3]/50 overflow-hidden select-text">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
            <div>
              <span className="font-mono text-xs text-[#CA5995] uppercase tracking-widest font-semibold">
                Creative Catalog
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-medium text-[#5D1C6A] mt-4 tracking-tight">
                Masterpiece Creational Gallery
              </h2>
            </div>
            <button 
              onClick={() => navigate("/services")}
              className="mt-6 md:mt-0 font-mono text-xs uppercase tracking-widest text-[#CA5995] hover:text-[#CA5995]/80 font-bold flex items-center gap-2 transition-all group"
            >
              View Full Services <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass-panel p-8 rounded-[2rem] border border-[#5D1C6A]/10 bg-white/40 flex flex-col justify-between min-h-[380px]"
            >
              <div>
                <span className="text-[10px] font-mono uppercase bg-[#FFB090]/25 px-3 py-1 rounded text-[#CA5995] font-semibold">Web Audio Synth</span>
                <h3 className="text-xl font-display font-semibold mt-4 text-[#5D1C6A]">Nocturne Soundscapes</h3>
                <p className="text-xs md:text-sm text-[#5D1C6A]/80 leading-relaxed font-light mt-4">
                  A high-performance tactile audio sandbox. Oscillators shape real-time sine waveforms dynamically in the browser, tracking micro-frequencies with responsive pixel vectors for maximum auditory immersion.
                </p>
              </div>
              <div className="pt-6 font-mono text-[10px] tracking-widest text-[#CA5995]/70 uppercase">
                Acoustic Dynamics
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass-panel p-8 rounded-[2rem] border border-[#5D1C6A]/10 bg-white/40 flex flex-col justify-between min-h-[380px]"
            >
              <div>
                <span className="text-[10px] font-mono uppercase bg-[#FFF1D3] px-3 py-1 rounded text-[#CA5995] font-semibold">Mechanical 3D Gears</span>
                <h3 className="text-xl font-display font-semibold mt-4 text-[#5D1C6A]">Aethelgard Chronograph</h3>
                <p className="text-xs md:text-sm text-[#5D1C6A]/80 leading-relaxed font-light mt-4">
                  Continuous watch Customization interface. Calibrating real-world clock gear mechanisms orbiting beautifully at computed physical ratios, using layered glass-morphic dials.
                </p>
              </div>
              <div className="pt-6 font-mono text-[10px] tracking-widest text-[#CA5995]/70 uppercase">
                Precision Horology
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass-panel p-8 rounded-[2rem] border border-[#5D1C6A]/10 bg-white/40 flex flex-col justify-between min-h-[380px]"
            >
              <div>
                <span className="text-[10px] font-mono uppercase bg-[#CA5995]/10 px-3 py-1 rounded text-[#CA5995] font-semibold">Fluid Physics Ocean</span>
                <h3 className="text-xl font-display font-semibold mt-4 text-[#5D1C6A]">Solaris Maritime Co.</h3>
                <p className="text-xs md:text-sm text-[#5D1C6A]/80 leading-relaxed font-light mt-4">
                  Interactive sailboat simulation that models wind shear, vector angles, and wave resistance. Provides an offline fallback system cache, letting users customize luxury custom rigs smoothly.
                </p>
              </div>
              <div className="pt-6 font-mono text-[10px] tracking-widest text-[#CA5995]/70 uppercase">
                Hydrodynamic Vectors
              </div>
            </motion.div>

          </div>
        </div>
      </section>



      {/* SECTION 3: THE DETAILED PHILOSOPHY GRID */}
      <section className="relative px-6 py-24 bg-[#FFF1D3]/30 border-t border-b border-[#5D1C6A]/5 select-text">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <div className="font-mono text-xs text-[#CA5995] tracking-widest uppercase mb-4 font-semibold">Meshweb Standards</div>
              <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-[#5D1C6A]">Fields of Artistry</h2>
            </div>
            <button 
              onClick={() => navigate("/services")}
              className="mt-4 md:mt-0 font-mono text-xs uppercase tracking-widest text-[#CA5995] hover:text-[#CA5995]/80 font-semibold flex items-center gap-2 transition-all"
            >
              Explore Services →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Field 1 */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass-panel p-8 rounded-3xl select-text border border-[#5D1C6A]/10 bg-white/60"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFB090] to-[#CA5995] flex items-center justify-center text-white font-mono text-lg font-bold mb-6">01</div>
              <h3 className="text-xl font-display font-semibold text-[#5D1C6A] mb-4">Elite Web Engineering</h3>
              <p className="text-xs text-[#5D1C6A]/85 leading-relaxed font-light">
                We craft clean, modular file configurations and robust TSX route components that compile successfully first time. We write zero messy redundant code, ensuring that performance is fast at load-time and responsive on mobile viewports.
              </p>
            </motion.div>

            {/* Field 2 */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass-panel p-8 rounded-3xl select-text border border-[#5D1C6A]/10 bg-white/60"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFF1D3] to-[#CA5995] flex items-center justify-center text-white font-mono text-lg font-bold mb-6">02</div>
              <h3 className="text-xl font-display font-semibold text-[#5D1C6A] mb-4">Granular Analytics Tracer</h3>
              <p className="text-xs text-[#5D1C6A]/85 leading-relaxed font-light">
                Our in-house analytical engine securely bundles viewport scroll percentages, page visits, device metadata, and custom clicking activities before dispatching clean JSON arrays straight to database repositories.
              </p>
            </motion.div>

            {/* Field 3 */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="glass-panel p-8 rounded-3xl select-text border border-[#5D1C6A]/10 bg-white/60"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#CA5995] to-[#FFB090] flex items-center justify-center text-white font-mono text-lg font-bold mb-6">03</div>
              <h3 className="text-xl font-display font-semibold text-[#5D1C6A] mb-4">Integrated Database Sync</h3>
              <p className="text-xs text-[#5D1C6A]/85 leading-relaxed font-light">
                We design streamlined server-side routing that bridges front-end actions to central Google Sheets. Form submissions, user tracer events, and customizable cookie consent decisions are beautifully indexed and organized.
              </p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* SECTION 4: CASE STUDY SUMMARY HIGHLIGHT */}
      <section className="relative px-6 py-24 bg-[#FFF1D3] overflow-hidden select-text">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#CA5995] bg-[#FFB090]/20 px-3 py-1 rounded-full animate-pulse">Curated Case Studies</span>
            <h3 className="text-3xl md:text-5xl font-display font-semibold text-[#5D1C6A] leading-tight">
              Craft validated by continuous use.
            </h3>
            <p className="text-xs sm:text-sm text-[#5D1C6A]/80 leading-relaxed font-light">
              We focus on building deep experiential interfaces for high-craft boutique projects. Explore our structured Case Studies inside the Laboratory mockup view above or initiate your custom alignment in our contact profile.
            </p>
            <div className="pt-4 flex gap-4 select-none">
              <button 
                onClick={() => navigate("/contact")}
                className="px-6 py-3 font-mono text-xs uppercase tracking-widest bg-[#CA5995] text-white rounded-full hover:bg-[#CA5995]/90 hover:scale-105 active:scale-95 transition-all shadow-sm font-semibold"
              >
                Inquire Proposal
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
            
            {/* Quick testimonial visual cards */}
            <div className="p-6 rounded-3xl border border-[#5D1C6A]/10 bg-[#FFF1D3]/20 space-y-4">
              <span className="text-[10px] font-mono uppercase text-[#CA5995]/60 font-semibold">Solaris Yachts Co.</span>
              <p className="text-xs text-[#5D1C6A] font-light leading-relaxed">
                "The customized fluid sailboat customizer built by Meshweb has resulted in an 85% lift in luxury engagement. Clients are amazed by the feedback bounciness."
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-[#5D1C6A]/5">
                <Heart className="w-3.5 h-3.5 text-[#CA5995]" />
                <span className="text-[10px] font-mono">Captain Marc Thome, Design Lead</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-[#5D1C6A]/10 bg-[#FFF1D3]/20 space-y-4">
              <span className="text-[10px] font-mono uppercase text-[#CA5995]/60 font-semibold">Aethelgard Horology</span>
              <p className="text-xs text-[#5D1C6A] font-light leading-relaxed">
                "The technical precision displayed on their homepage lab is exactly how they handled our custom spring watch configurator. Out of this world."
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-[#5D1C6A]/5">
                <CheckCircle className="w-3.5 h-3.5 text-[#CA5995]" />
                <span className="text-[10px] font-mono">Astrid Lind, Operations Partner</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5: DELIVERABLE STORY CTA */}
      <section className="relative px-6 py-28 bg-[#FFF1D3]/20 border-t border-[#5D1C6A]/5 overflow-hidden">
        {/* Subtle glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#FFB090]/20 rounded-full blur-[110px] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto text-center select-text relative z-10">
          <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-[#5D1C6A] mb-8">
            Create something timeless.
          </h2>
          <p className="text-xs sm:text-base text-[#5D1C6A]/85 leading-relaxed mb-12 max-w-xl mx-auto font-light">
            Discuss your design aesthetic, and draft a high-fidelity roadmap connecting your website to automated sheets systems today.
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="px-8 py-4 bg-[#CA5995] text-white font-mono text-xs uppercase tracking-widest rounded-full hover:bg-[#CA5995]/90 hover:scale-105 active:scale-95 transition-all duration-300 font-semibold"
          >
            Initiate Conversation
          </button>
        </div>
      </section>
    </motion.div>
  );
}
