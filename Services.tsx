import { motion } from "motion/react";

interface ServicesProps {
  navigate: (path: string) => void;
}

export default function Services({ navigate }: ServicesProps) {
  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 }
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

  const servicesList = [
    {
      num: "01",
      title: "Bespoke Web Engineering",
      desc: "Architecting lightning-fast static and dynamic systems. We write custom React components that are structured correctly, modularized carefully, and free of automated code bloat for maximum response speeds.",
      color: "from-[#FFB090] to-[#CA5995]"
    },
    {
      num: "02",
      title: "Interactive Motion Design",
      desc: "Creating momentum-driven scrolling transitions, subtle tilt states, and spring-based kinetics. We transform screen surfing from a standard click into a dynamic, beautiful physical experience.",
      color: "from-[#CA5995] to-[#5D1C6A]"
    },
    {
      num: "03",
      title: "Editorial Grid & Typography Strategy",
      desc: "Pairing elite, highly specific typographic systems (e.g. Space Grotesk, Inter, JetBrains Mono) with carefully balanced asymmetrical grids, ensuring your brand reads like high literature.",
      color: "from-[#CA5995] to-[#FFB090]"
    },
    {
      num: "04",
      title: "Secure Client Ingestion Pipelines",
      desc: "Deploying secure, invisible server proxy systems that communicate smoothly with external APIs (e.g. Google Sheets, Notion databases) without exposing private service keys to the public browser.",
      color: "from-[#5D1C6A] to-[#FFB090]"
    },
    {
      num: "05",
      title: "Privacy-Conscious Tracking Engines",
      desc: "Custom analytics packages offering profound insight into user scroll depths, device parameters, and layouts visited while fully complying with cookie consent logic and privacy standards.",
      color: "from-[#FFB090] to-[#CA5995]"
    },
    {
      num: "06",
      title: "Headless Migration & Refactoring",
      desc: "Deconstructing slow, legacy website structures (bloated templates, un-optimized builders) and migrating their core content into modern, fully optimized React workspaces.",
      color: "from-[#CA5995] to-[#5D1C6A]"
    },
    {
      num: "07",
      title: "Brand Narrative & Positioning",
      desc: "Authoring human-centric, philosophical copy that focuses on craftsmanship, connection, and real human synergy. We translate technical mechanics into elegant narratives that resonate.",
      color: "from-[#CA5995] to-[#FFB090]"
    },
    {
      num: "08",
      title: "Dedicated Custodianship",
      desc: "Ongoing support to maintain Lighthouse visual scores, check for cross-device mobile anomalies, run diagnostic tests, and ensure permanent, high-fidelity uptime.",
      color: "from-[#5D1C6A] to-[#CA5995]"
    }
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen text-[#5D1C6A] pt-24 pb-16 px-6"
    >
      <div className="max-w-6xl mx-auto select-text">
        {/* HEADER */}
        <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#FFB090]/20 border border-[#CA5995]/20 text-[#CA5995] text-xs tracking-widest uppercase font-mono mb-4 font-semibold shadow-sm">
            Bespoke Services
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-medium tracking-tight mb-8">
            Our Fields of Curation
          </h1>
          <p className="text-sm md:text-base text-[#5D1C6A]/85 leading-relaxed font-sans max-w-2xl mx-auto font-light">
            We don't specialize in standard high-volume deliverables. We specialize in pristine craftsmanship, responsive kinetics, and secure integration patterns for agencies and studios that value detail.
          </p>
        </motion.div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {servicesList.map((s) => (
            <motion.div
              key={s.num}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className="glass-panel p-8 rounded-[2rem] flex flex-col justify-between min-h-[340px] border border-[#5D1C6A]/10 bg-white/50 shadow-sm"
            >
              <div>
                {/* Visual Number Indicator (Elegantly populated, no longer empty!) */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center font-mono text-xs font-bold text-[#FFF1D3] mb-6 shadow-md border border-white/10`}>
                  {s.num}
                </div>
                <h3 className="text-lg font-display font-medium text-[#5D1C6A] mb-4">
                  {s.title}
                </h3>
                <p className="text-xs md:text-[13px] text-[#5D1C6A]/85 leading-relaxed font-sans font-light">
                  {s.desc}
                </p>
              </div>

              {/* Minimal Line Detail */}
              <div className="w-full h-[1px] bg-gradient-to-r from-[#5D1C6A]/5 via-[#CA5995]/15 to-transparent mt-6" />
            </motion.div>
          ))}
        </div>

        {/* WORK ETHIC GRID */}
        <motion.div 
          variants={itemVariants}
          className="glass-panel rounded-[2.5rem] p-8 md:p-16 text-center max-w-4xl mx-auto space-y-6 border border-[#5D1C6A]/10 bg-[#FFF1D3]/10"
        >
          <div className="font-mono text-xs text-[#CA5995] tracking-widest uppercase font-semibold">• Engagement Model •</div>
          <h2 className="text-2xl md:text-3xl font-display font-medium text-[#5D1C6A]">One Client At A Time</h2>
          <p className="text-xs md:text-sm text-[#5D1C6A]/85 leading-relaxed max-w-3xl mx-auto font-light">
            Unlike agencies that divide their focus across concurrent project accounts, Meshweb works on a strictly sequential client queue. When we contract your digital workspace, you have our entire design collective's un-fragmented focus until the project is delivered.
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="px-8 py-4 bg-[#CA5995] hover:bg-[#CA5995]/90 text-white font-mono text-xs uppercase tracking-widest rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-md font-semibold"
          >
            Request Booking Slot
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
