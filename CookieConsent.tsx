import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Info, X } from "lucide-react";
import { CookieConsentPreferences } from "../types";

interface CookieConsentProps {
  onConsentChange: (pref: CookieConsentPreferences) => void;
}

export default function CookieConsent({ onConsentChange }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Preference switches
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [personalization, setPersonalization] = useState(false);

  useEffect(() => {
    // Check if consent has already been saved
    const saved = localStorage.getItem("mweb_cookies");
    if (!saved) {
      // Delay-show banner for high-end cinematic entry feel
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      try {
        const pref: CookieConsentPreferences = JSON.parse(saved);
        onConsentChange(pref);
      } catch (e) {
        setShowBanner(true);
      }
    }
  }, [onConsentChange]);

  const handleAcceptAll = () => {
    const pref: CookieConsentPreferences = {
      accepted: true,
      essential: true,
      analytics: true,
      marketing: true,
      personalization: true,
      timestamp: new Date().toISOString()
    };
    savePreferences(pref);
  };

  const handleRejectAll = () => {
    const pref: CookieConsentPreferences = {
      accepted: true,
      essential: true,
      analytics: false,
      marketing: false,
      personalization: false,
      timestamp: new Date().toISOString()
    };
    savePreferences(pref);
  };

  const handleSaveCustom = () => {
    const pref: CookieConsentPreferences = {
      accepted: true,
      essential: true,
      analytics,
      marketing,
      personalization,
      timestamp: new Date().toISOString()
    };
    savePreferences(pref);
    setShowModal(false);
  };

  const savePreferences = (pref: CookieConsentPreferences) => {
    localStorage.setItem("mweb_cookies", JSON.stringify(pref));
    setShowBanner(false);
    onConsentChange(pref);

    // Send selection preferences to Google Sheets server
    fetch("/api/cookies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pref),
    }).catch((err) => console.warn("Could not synchronize cookie preferences:", err));
  };

  return (
    <>
      <AnimatePresence>
        {/* COOKIE CONSENT BANNER (Bottom-left) */}
        {showBanner && !showModal && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 left-6 z-[99990] max-w-sm sm:max-w-md rounded-3xl overflow-hidden glass-panel p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-brand-pink/15 select-text"
          >
            {/* Ambient subtle warm gradient background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple/10 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-brand-orange shrink-0" />
                <span className="font-display font-medium text-brand-orange tracking-wide text-sm">
                  Meshweb Privacy Alignment
                </span>
              </div>

              <p className="text-xs text-brand-charcoal/80 leading-relaxed font-sans font-light">
                Our digital studio utilizes cookies, anonymous session IDs, and specifications logging to refine our high-fidelity typography layouts, measure scroll depths, and coordinate secure project intake submissions. We respect your attention and privacy.
              </p>

              <div className="flex flex-wrap gap-2.5 pt-1">
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-[11px] font-mono font-medium rounded-full bg-[#CA5995] text-white hover:opacity-90 hover:scale-[1.03] transition-all duration-300"
                >
                  Accept All
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 text-[11px] font-mono font-medium rounded-full bg-[#FFF1D3] border border-[#FFB090]/50 text-[#5D1C6A] hover:bg-[#FFB090]/20 hover:scale-[1.03] transition-all duration-300"
                >
                  Customize
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-[11px] font-mono font-medium rounded-full text-[#5D1C6A]/60 hover:text-[#5D1C6A] transition-all duration-300"
                >
                  Decline
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* CUSTOMIZE SETTINGS DIALOG */}
        {showModal && (
          <div className="fixed inset-0 z-[99998] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md select-text">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg rounded-[2rem] glass-panel p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-brand-pink/20 overflow-hidden"
            >
              {/* Heading */}
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-brand-pink" />
                  <h3 className="font-display font-medium text-lg text-white">
                    Meshweb Privacy Curator
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-brand-warm-white/60 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Categorized Options */}
              <div className="space-y-6 mb-8 max-h-[350px] overflow-y-auto pr-1">
                
                {/* 1. Essential */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 max-w-[80%]">
                    <h4 className="text-sm font-display font-medium text-white flex items-center gap-1">
                      Essential Cookies <span className="text-[9px] font-mono uppercase bg-white/5 px-2 py-0.5 rounded text-brand-pink">Mandatory</span>
                    </h4>
                    <p className="text-xs text-brand-warm-white/60 leading-relaxed font-sans">
                      Critical parameters parsed for custom cursor springs, local state coordinates, and secure post-handling validators. Cannot be disabled.
                    </p>
                  </div>
                  {/* Styled Active Toggle - Checked & Disabled */}
                  <div className="w-11 h-6 rounded-full bg-[#CA5995] opacity-40 cursor-not-allowed flex items-center p-0.5 relative">
                    <div className="w-5 h-5 rounded-full bg-white translate-x-5" />
                  </div>
                </div>

                {/* 2. Analytics */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 max-w-[80%]">
                    <h4 className="text-sm font-display font-medium text-white flex items-center gap-1.5">
                      Analytics Tracking <span className="text-[9px] font-mono uppercase bg-brand-pink/10 px-2 py-0.5 rounded text-brand-pink">Recommended</span>
                    </h4>
                    <p className="text-xs text-brand-warm-white/60 leading-relaxed font-sans">
                      Logs metrics detailing scroll depths, device parameters, and layouts visited. Allows us to optimize layouts.
                    </p>
                  </div>
                  {/* Toggle Button */}
                  <button
                    onClick={() => setAnalytics(!analytics)}
                    className={`w-11 h-6 rounded-full flex items-center p-0.5 transition-colors duration-300 ${analytics ? "bg-[#CA5995]" : "bg-neutral-800"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${analytics ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>

                {/* 3. Marketing */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 max-w-[80%]">
                    <h4 className="text-sm font-display font-medium text-white">Marketing & Promotion</h4>
                    <p className="text-xs text-brand-warm-white/60 leading-relaxed font-sans">
                      Registers anonymized interactions across direct social layers to curate tailored narrative proposals.
                    </p>
                  </div>
                  {/* Toggle Button */}
                  <button
                    onClick={() => setMarketing(!marketing)}
                    className={`w-11 h-6 rounded-full flex items-center p-0.5 transition-colors duration-300 ${marketing ? "bg-[#CA5995]" : "bg-neutral-800"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${marketing ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>

                {/* 4. Personalization */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 max-w-[80%]">
                    <h4 className="text-sm font-display font-medium text-white">Personalization Memory</h4>
                    <p className="text-xs text-brand-warm-white/60 leading-relaxed font-sans">
                      Retains specialized layout alignment options and visual velocity rules inside your local storage across tabs.
                    </p>
                  </div>
                  {/* Toggle Button */}
                  <button
                    onClick={() => setPersonalization(!personalization)}
                    className={`w-11 h-6 rounded-full flex items-center p-0.5 transition-colors duration-300 ${personalization ? "bg-[#CA5995]" : "bg-neutral-800"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${personalization ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>

              </div>

              {/* Save Controls */}
              <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-mono font-medium text-brand-warm-white/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCustom}
                  className="px-6 py-2 rounded-full text-xs font-mono font-medium bg-gradient-to-r from-[#CA5995] to-[#5D1C6A] text-white hover:scale-[1.03] transition-all"
                >
                  Save Alignment Settings
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
