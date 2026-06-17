import { motion } from "motion/react";

interface LegalProps {
  navigate: (path: string) => void;
}

export default function TermsOfService({ navigate }: LegalProps) {
  const pageVariants = {
    initial: { opacity: 0, scale: 1.02 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    },
    exit: { 
      opacity: 0, 
      scale: 0.98,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen text-[#4A0E4E] pt-24 pb-16 px-6"
    >
      <div className="max-w-3xl mx-auto select-text space-y-8 font-sans leading-relaxed text-[#4A0E4E]/80">
        <div className="text-center md:text-left mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-brand-pink/10 border border-brand-pink/25 text-[10px] text-brand-pink tracking-widest uppercase font-mono mb-4 font-semibold">
            Legal Curation
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-medium text-[#4A0E4E] tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-brand-orange/60 font-mono mt-2 uppercase tracking-wider">Meshweb Custodianship</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-display font-semibold text-[#4A0E4E]">1. Agreement to Terms</h2>
          <p>
            By browsing or typing upon this web resource, you acknowledge that you have read, understood, and agreed to be bound by these unified terms of curation. If you do not agree, please exit the digital workspace.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-display font-semibold text-[#4A0E4E]">2. Scope of Artistry</h2>
          <p>
            Meshweb creates bespoke, high-contrast, premium digital portfolios and interactive software packages. All structures, styling code, layout hierarchies, custom animated SVGs, and brand narratives shown represent custom curated properties protected by copyright frameworks.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-display font-semibold text-[#4A0E4E]">3. Intake Registrations</h2>
          <p>
            By submitting an intake profile on our Contacts view, you assert that all coordinates entered are accurate and represent human, lawful organizations. We reserve the absolute right to terminate contact alignments with spam or automated crawling systems.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-display font-semibold text-[#4A0E4E]">4. Intellectual Property</h2>
          <p>
            We retain full ownership of our custom compiled packages, including the custom spring cursors, local tracking timers, and motion configurations, unless explicitly licensed or transferred to our contract partners upon formal project delivery.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-display font-semibold text-[#4A0E4E]">5. Limit of Liability</h2>
          <p>
            In no event shall Meshweb, our partners, caretakers, or coastal engineers, be held liable to you or any third party for any incidental, indirect, or system-related data exceptions resulting from accessing or browsing our digital villa.
          </p>
        </section>

        <div className="pt-8 border-t border-[#4A0E4E]/10 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-xs text-brand-pink hover:text-brand-orange tracking-widest uppercase font-mono font-medium"
          >
            ← Back to Sanctuary Portal
          </button>
        </div>
      </div>
    </motion.div>
  );
}
