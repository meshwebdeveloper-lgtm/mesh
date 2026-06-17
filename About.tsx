import { motion } from "motion/react";

interface AboutProps {
  navigate: (path: string) => void;
}

export default function About({ navigate }: AboutProps) {
  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.15 }
    },
    exit: { 
      opacity: 0, 
      y: 15,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 25 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen text-[#5D1C6A] pt-24 pb-16 px-6"
    >
      <div className="max-w-4xl mx-auto select-text space-y-20">
        {/* HERO TITLE SECTION */}
        <motion.div variants={itemVariants} className="text-center md:text-left">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#FFB090]/20 border border-[#CA5995]/20 text-[#CA5995] text-xs tracking-widest uppercase font-mono mb-4 font-semibold shadow-sm">
            Our Studio Story
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-medium tracking-tight mb-8">
            Shaped by the ocean.
          </h1>
          <p className="text-sm md:text-base text-[#5D1C6A]/85 leading-relaxed font-sans max-w-2xl font-light">
            We are a boutique collective of designers and software craftsmen who left rigid corporate skyscrapers behind for a sun-soaked creative sanctuary in a coastal villa. We believe digital layouts should match the rhythm, calmness, and warmth of standard natural worlds.
          </p>
        </motion.div>

        {/* TWO COLUMN PHILOSOPHY STORY */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-12 text-xs md:text-sm text-[#5D1C6A]/85 font-sans leading-relaxed font-light">
          <div className="space-y-6">
            <h2 className="text-lg md:text-xl font-display font-semibold text-[#5D1C6A]">The Slow Development movement</h2>
            <p>
              In a digital world obsessed with hyper-velocity and cookie-cutter frameworks, we seek a different path. We do not use automatic template builders, heavy pre-designed theme boxes, or mass-produced layout blocks.
            </p>
            <p>
              Instead, we write each interface by hand; adjusting margins item-by-item, choosing layout types with absolute intention, and tuning spring formulas until motion feels natural. This slow-paced curation process delivers digital homes that are unique, premium, and profoundly distinctive.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-lg md:text-xl font-display font-semibold text-[#5D1C6A]">Our Coastal Sanctuary</h2>
            <p>
              Operating from our ocean-facing workspace, our surroundings shape our work. The soft hues of sunset beaches, the gentle sway of coastal palm trees, and the shifting marine light drive our choice of color palettes and interaction mechanics.
            </p>
            <p>
              We believe this warm, luxurious vibe is what the modern web desperately needs. Software shouldn't look like a clinical utility spreadsheet – it should look and feel like a boutique art gallery or an elite tropical retreat.
            </p>
          </div>
        </motion.div>

        {/* TEAM VALUES GRID */}
        <motion.div variants={itemVariants} className="glass-panel rounded-[2rem] p-8 md:p-12 space-y-8 border border-[#5D1C6A]/10 bg-[#FFF1D3]/10">
          <h2 className="text-xl md:text-2xl font-display font-medium text-center text-[#5D1C6A] mb-8">Our Infallible Commitments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="text-md font-display font-semibold text-[#CA5995]">Absolute Integrity</h3>
              <p className="text-xs text-[#5D1C6A]/80 leading-relaxed font-light">
                We design and write our own features. No templates, no shorthand visual editors, and no stolen or outsourced materials ever enter our pipeline.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-md font-display font-semibold text-[#CA5995]">User Dignity</h3>
              <p className="text-xs text-[#5D1C6A]/80 leading-relaxed font-light">
                We do not implement aggressive tracking grids, annoying interstitial popups, or hostile dark UX patterns. Your client's attention is respected and protected.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-md font-display font-semibold text-[#CA5995]">Clean Codebases</h3>
              <p className="text-xs text-[#5D1C6A]/80 leading-relaxed font-light">
                Our code sits behind standard TypeScript contracts. Every component is logical, legible, and built from scratch to allow straightforward ongoing stewardships.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="text-center pt-8">
          <p className="text-xs text-[#5D1C6A]/75 mb-6 font-mono tracking-wide">Ready to talk to real people?</p>
          <button
            onClick={() => navigate("/contact")}
            className="px-8 py-4 bg-[#CA5995] hover:bg-[#CA5995]/90 text-white font-mono text-xs uppercase tracking-widest rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-md font-semibold"
          >
            Say Hello to Our Team
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
