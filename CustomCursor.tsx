import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "motion/react";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface Spark {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState<"default" | "pointer" | "text" | "focus">("default");
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const nextRippleId = useRef(0);
  const nextSparkId = useRef(0);

  // Read stored coordinates from localStorage to eliminate "jumping to top-left on refresh"
  const storedX = parseFloat(localStorage.getItem("mweb_cx") || "300");
  const storedY = parseFloat(localStorage.getItem("mweb_cy") || "300");

  // Motion values
  const cursorX = useMotionValue(storedX);
  const cursorY = useMotionValue(storedY);

  // Trail values (slightly heavier spring for delayed trailing glow)
  const trailX = useSpring(cursorX, { stiffness: 90, damping: 20 });
  const trailY = useSpring(cursorY, { stiffness: 90, damping: 20 });

  // Custom bounciness (stiffness: 400, damping: 28) for standard cursor movement
  const springX = useSpring(cursorX, { stiffness: 400, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 400, damping: 28 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      // Persistence to prevent pop on next load
      localStorage.setItem("mweb_cx", x.toString());
      localStorage.setItem("mweb_cy", y.toString());

      cursorX.set(x);
      cursorY.set(y);
    };

    const handleMouseOver = (e: any) => {
      if (!e.target) return;
      const target = e.target as HTMLElement;

      // Find if clicking target is a pointer element
      const isPointer = 
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest('[role="button"]') ||
        target.closest(".cursor-pointer") ||
        target.tagName === "SELECT" ||
        target.tagName === "LABEL";

      // Find if target is interactive input
      const isInput = 
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("input") ||
        target.closest("textarea");

      if (isInput) {
        // If it currently has focus
        if (target === document.activeElement) {
          setCursorType("focus");
        } else {
          setCursorType("text");
        }
      } else if (isPointer) {
        setCursorType("pointer");
      } else {
        setCursorType("default");
      }
    };

    const handleFocusIn = (e: any) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        setCursorType("focus");
      }
    };

    const handleFocusOut = () => {
      setCursorType("default");
    };

    const handleMouseDown = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      // Create click ripple ring
      const rid = nextRippleId.current++;
      setRipples((prev) => [...prev, { id: rid, x, y }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rid));
      }, 700);

      // Create sparkle particles
      const newSparks: Spark[] = [];
      const sparkCount = 8;
      const colors = ["#FFB090", "#CA5995", "#FFF1D3", "#FFB090"];
      for (let i = 0; i < sparkCount; i++) {
        const sid = nextSparkId.current++;
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 2.5;
        newSparks.push({
          id: sid,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      setSparks((prev) => [...prev, ...newSparks]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, [cursorX, cursorY]);

  // Handle Spark animation frames
  useEffect(() => {
    if (sparks.length === 0) return;

    let animId: number;
    const updateSparks = () => {
      setSparks((prev) => {
        const next = prev
          .map((s) => ({
            ...s,
            x: s.x + s.vx,
            y: s.y + s.vy,
            vy: s.vy + 0.08, // mild gravity
            vx: s.vx * 0.96, // air resistance
          }))
          // filter out of screen or stopped
          .filter((s) => s.vy < 6); // standard cutoff
        
        if (next.length === 0) return [];
        return next;
      });
      animId = requestAnimationFrame(updateSparks);
    };

    animId = requestAnimationFrame(updateSparks);
    return () => cancelAnimationFrame(animId);
  }, [sparks.length]);

  return (
    <>
      {/* 2. Sparkles particle engine */}
      <AnimatePresence>
        {sparks.map((s) => (
          <motion.div
            key={s.id}
            className="fixed w-1.5 h-1.5 rounded-full pointer-events-none z-[9999999]"
            style={{
              left: s.x,
              top: s.y,
              backgroundColor: s.color,
              boxShadow: `0 0 6px ${s.color}`,
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* 3. Concentric expand-ripple circles */}
      {ripples.map((rip) => (
        <motion.div
          key={rip.id}
          className="fixed border-2 border-brand-orange rounded-full pointer-events-none z-[9999998]"
          style={{
            left: rip.x,
            top: rip.y,
            width: 8,
            height: 8,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ width: 0, height: 0, opacity: 0.7 }}
          animate={{ width: 64, height: 64, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}

      {/* 4. Active cursor rendering with direct Motion Values for 100% instant, lag-free response */}
      <motion.div
        className="fixed pointer-events-none z-[9999999] select-none"
        style={{
          left: cursorX,
          top: cursorY,
          transform: "translate(-50%, -50%)",
        }}
      >
        <AnimatePresence mode="wait">
          {cursorType === "default" && (
            <motion.div
              key="default"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4.5 3V19.5L9.75 14.25H18L4.5 3Z"
                  fill="url(#cursor-grad)"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="cursor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFB090" />
                    <stop offset="100%" stopColor="#CA5995" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          )}

          {cursorType === "pointer" && (
            <motion.div
              key="pointer"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.25, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {/* Luxury astrolabe spinning compass-rose style hover cursor */}
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" className="animate-spin" style={{ animationDuration: "12s" }}>
                {/* Dotted tracking orbit */}
                <circle cx="17" cy="17" r="14" stroke="#FFB090" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
                {/* Thin focus guide circle */}
                <circle cx="17" cy="17" r="8" stroke="#CA5995" strokeWidth="1" />
                {/* Astrolabe crosshairs */}
                <line x1="17" y1="0" x2="17" y2="6" stroke="#CA5995" strokeWidth="1" strokeLinecap="round" />
                <line x1="17" y1="28" x2="17" y2="34" stroke="#CA5995" strokeWidth="1" strokeLinecap="round" />
                <line x1="0" y1="17" x2="6" y2="17" stroke="#CA5995" strokeWidth="1" strokeLinecap="round" />
                <line x1="28" y1="17" x2="34" y2="17" stroke="#CA5995" strokeWidth="1" strokeLinecap="round" />
                {/* Glowing Core center indicator */}
                <circle cx="17" cy="17" r="3" fill="#CA5995" />
              </svg>
            </motion.div>
          )}

          {cursorType === "text" && (
            <motion.div
              key="text"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <svg width="14" height="24" viewBox="0 0 14 24" fill="none">
                <path
                  d="M2 3h10M7 3v18M2 21h10"
                  stroke="url(#text-grad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="text-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFB090" />
                    <stop offset="100%" stopColor="#CA5995" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          )}

          {cursorType === "focus" && (
            <motion.div
              key="focus"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <svg width="14" height="24" viewBox="0 0 14 24" fill="none">
                <path
                  d="M2 3h10M7 3v18M2 21h10"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
