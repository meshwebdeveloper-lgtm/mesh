import { motion } from "motion/react";

interface LegalProps {
  navigate: (path: string) => void;
}

export default function PrivacyPolicy({ navigate }: LegalProps) {
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
            Privacy Policy
          </h1>
          <p className="text-xs text-brand-pink/60 font-mono mt-2 uppercase tracking-wider">Meshweb Custodianship</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-display font-semibold text-[#4A0E4E]">1. Introduction</h2>
          <p>
            Welcome to Meshweb. We are a premium digital studio committed to protecting your privacy with absolute integrity. This Privacy Policy details our transparent, lawful practices regarding how we manage data collected through our agency portal and visitor metrics.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-display font-semibold text-[#4A0E4E]">2. Information We Collect</h2>
          <p>
            When utilizing our platform, we only log data with your explicit, prior consent:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-[#4A0E4E]/75">
            <li>
              <strong>Intake Coordinates:</strong> When completing our Contact form, we collect your Full Name, Email Address, Project Nature, Budget Range, and Message.
            </li>
            <li>
              <strong>Advanced Analytics Metrics:</strong> If accepted via our Cookie Consent, our custom tracking engine records anonymous specs (Browser name, OS type, Screen Resolution, device core capacity, approximate Location derived via IP, active Scroll Depth, and Buttons clicked during the session).
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-display font-semibold text-[#4A0E4E]">3. How We Use Information</h2>
          <p>
            Your collected submission items are used strictly for project alignment scoping and internal team analysis. Analytics data is batched, anonymized, and stored securely in a private, sandboxed registry to help us understand how people experience our layout configurations and motion paths.
          </p>
          <p className="text-sm">
            We will never sell, lease, transfer, or share your coordinates or specs with third-party automated marketing structures.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-display font-semibold text-[#4A0E4E]">4. Cookies & Consent Preferences</h2>
          <p>
            We deploy a custom, glass-morphism preference modal to manage local storage cookies. Essential parameters are pre-checked as they are critically necessary for layout memory and custom cursor state restorations.
          </p>
          <p>
            You retain the absolute right to toggle or reject Analytics, Personalization, or Marketing cookies at any time, which immediately pauses our Super-Tracking queues.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-display font-semibold text-[#4A0E4E]">5. Data Stewardship & Security</h2>
          <p>
            Data is proxied securely through server pipelines to protect Google Sheets endpoints and private service keys. It is encapsulated behind robust JWT validation schemes to prevent data exposure or un-authorized API breaches.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-display font-semibold text-[#4A0E4E]">6. Contact Specifications</h2>
          <p>
            For privacy inquiries or request of records deletion, communicate directly to: <em>contact@meshweb.co.uk</em>.
          </p>
        </section>

        <div className="pt-8 border-t border-[#4A0E4E]/10 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-xs text-brand-orange hover:text-brand-pink tracking-widest uppercase font-mono font-medium"
          >
            ← Back to Sanctuary Portal
          </button>
        </div>
      </div>
    </motion.div>
  );
}
