import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Hammer, Wind, Compass, Sparkles, Send } from "lucide-react";

// Components
import CustomCursor from "./components/CustomCursor";
import AmbientBackground from "./components/AmbientBackground";
import PageSkeleton from "./components/PageSkeleton";
import CookieConsent from "./components/CookieConsent";

// Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

// Utilities
import { getTracker } from "./utils/tracker";
import { CookieConsentPreferences } from "./types";

export default function App() {
  const [activePath, setActivePath] = useState("/");
  const [isLoading, setIsLoading] = useState(true);
  const [isCookieApproved, setIsCookieApproved] = useState(false);

  // Navbar visible/scroll memory states
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll depth percentage indicator state
  const [scrollPct, setScrollPct] = useState(0);

  // Synchronous route parsing on launch
  useEffect(() => {
    const handleHashChange = () => {
      const hashRoute = window.location.hash.replace("#", "") || "/";
      
      // Let's activate full shimmer load state
      setIsLoading(true);
      setActivePath(hashRoute);
      window.scrollTo({ top: 0 });

      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 750); // standard shimmer timeout (under 2 seconds)

      return () => clearTimeout(timer);
    };

    window.addEventListener("hashchange", handleHashChange);
    // Initial parse load
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Monitor scrolling to calculate scroll metrics & control navbar hides/shows
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 1. Progress Bar calculation
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollPct(currentScrollY / docHeight);
      }

      // 2. Hide/Show Navbar past 100px threshold
      if (currentScrollY < 100) {
        setIsNavVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // scrolling down -> hide
        setIsNavVisible(false);
      } else {
        // scrolling up -> show immediately
        setIsNavVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Track dynamic path changes inside our super tracker
  useEffect(() => {
    if (isCookieApproved && !isLoading) {
      const tracker = getTracker();
      if (tracker) {
        tracker.trackPageVisit(activePath);
      }
    }
  }, [activePath, isCookieApproved, isLoading]);

  const handleNavigate = (path: string) => {
    window.location.hash = path;
  };

  const handleConsentChange = (pref: CookieConsentPreferences) => {
    if (pref.accepted && pref.analytics) {
      setIsCookieApproved(true);
      // Trigger instant boot tracking
      const tracker = getTracker();
      if (tracker) {
        tracker.trackPageVisit(activePath);
      }
    } else {
      setIsCookieApproved(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FFF1D3] text-[#5D1C6A] overflow-hidden font-sans select-none pb-0">
      
      {/* 1. Custom spring cursor & spark tracer particle mesh */}
      <CustomCursor />

      {/* 2. Top Scroll Progress Line Accent Indicator */}
      <div 
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-brand-pink via-brand-orange to-brand-purple z-[999990] origin-left transition-transform duration-75"
        style={{ transform: `scaleX(${scrollPct})`, width: "100%" }}
      />

      {/* 3. Subtle floating particles */}
      <AmbientBackground />

      {/* 4. Film noise layer overlay globally */}
      <div className="noise-overlay" />

      {/* 5. Smooth glass-morphic floating dynamic Navbar */}
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: isNavVisible ? 0 : -100 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="fixed top-0 inset-x-0 z-[9990] h-20 px-6 flex items-center justify-between glass-panel border-b border-brand-pink/15"
      >
        {/* Logo and branding */}
        <button 
          onClick={() => handleNavigate("/")}
          className="flex items-center gap-2 group focus:outline-none"
        >
          <Compass className="w-5 h-5 text-brand-orange group-hover:rotate-[180deg] transition-transform duration-500" />
          <span className="font-display font-medium tracking-wide text-lg text-transparent bg-clip-text bg-gradient-to-r from-brand-pink via-brand-orange to-brand-red">
            Meshweb
          </span>
        </button>

        {/* Dynamic menu list */}
        <div className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest uppercase">
          {[
            { label: "Services", path: "/services" },
            { label: "About", path: "/about" },
            { label: "Contact", path: "/contact" }
          ].map((navItem) => {
            const isSel = activePath === navItem.path;
            return (
              <button
                key={navItem.label}
                onClick={() => handleNavigate(navItem.path)}
                className={`relative py-1 border-b-2 transition-all duration-300 ${
                  isSel 
                    ? "border-brand-pink text-[#5D1C6A] font-semibold" 
                    : "border-transparent text-[#5D1C6A]/60 hover:text-[#5D1C6A]"
                }`}
              >
                {navItem.label}
              </button>
            );
          })}
        </div>

        {/* Action Call for custom alignment */}
        <button
          onClick={() => handleNavigate("/contact")}
          className="relative px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-pink via-brand-orange to-brand-red text-white text-xs font-mono font-medium tracking-wider shadow-[0_0_12px_rgba(255,123,84,0.15)] hover:scale-[1.03] transition-all duration-300"
        >
          Start a Project
        </button>
      </motion.nav>

      {/* Mobile nav indicator bar (shows if screen too narrow to help guide navigation) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[9980] flex items-center gap-3 px-6 py-3 rounded-full bg-white/90 border border-brand-pink/20 shadow-xl backdrop-blur-lg">
        {[
          { label: "Services", path: "/services" },
          { label: "About", path: "/about" },
          { label: "Contact", path: "/contact" }
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => handleNavigate(item.path)}
            className={`px-3 py-1 text-[10px] font-mono tracking-wider uppercase rounded-full transition-all ${
              activePath === item.path 
                ? "bg-gradient-to-r from-brand-orange to-brand-pink text-white font-medium" 
                : "text-[#5D1C6A]/60 hover:text-[#5D1C6A]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 6. MAIN CONTENT STAGE */}
      <main className="relative z-10 w-full min-h-[90vh]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="shimmer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <PageSkeleton pagePath={activePath} />
            </motion.div>
          ) : (
            <motion.div
              key={activePath}
              className="w-full"
            >
              {activePath === "/" && <Home navigate={handleNavigate} />}
              {activePath === "/services" && <Services navigate={handleNavigate} />}
              {activePath === "/about" && <About navigate={handleNavigate} />}
              {activePath === "/contact" && <Contact navigate={handleNavigate} />}
              {activePath === "/privacy-policy" && <PrivacyPolicy navigate={handleNavigate} />}
              {activePath === "/terms-of-service" && <TermsOfService navigate={handleNavigate} />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 7. HIGH-FIDELITY LUXURY AGENCY FOOTER */}
      <footer className="relative z-20 bg-[#1D0820] border-t border-brand-pink/15 px-6 pt-24 pb-12 select-text">
        <div className="max-w-6xl mx-auto">
          {/* Main big CTA title */}
          <div className="text-center md:text-left mb-16 space-y-4">
            <h2 className="text-3xl md:text-6xl font-display font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-pink via-brand-orange to-brand-red">
              Let's create something beautiful.
            </h2>
            <p className="text-sm text-brand-warm-white/70 max-w-lg leading-relaxed font-sans font-light">
              We look forward to translating your values into a pristine, luxury digital home shaped completely by human hands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start border-t border-white/10 pt-12 text-sm text-brand-warm-white/70">
            {/* Left col - Brand signature info */}
            <div className="md:col-span-4 space-y-4">
              <span className="font-display font-semibold text-lg text-white">Meshweb</span>
              <p className="text-xs max-w-xs leading-relaxed font-sans font-light">
                An elite digital studio crafting emotionally resonant, high-craftsmanship web experiences. Delivered with professional alignment.
              </p>
            </div>

            {/* Center col - Navigation categories links */}
            <div className="md:col-span-4 grid grid-cols-2 gap-4">
              <div className="space-y-3 flex flex-col">
                <span className="text-xs font-mono uppercase tracking-widest text-[#FFB090] font-semibold">Sanctuary</span>
                <button onClick={() => handleNavigate("/")} className="text-xs text-left text-brand-warm-white/70 hover:text-white transition-colors">Home Portal</button>
                <button onClick={() => handleNavigate("/services")} className="text-xs text-left text-brand-warm-white/70 hover:text-white transition-colors">Services breakdowns</button>
              </div>
              <div className="space-y-3 flex flex-col">
                <span className="text-xs font-mono uppercase tracking-widest text-[#FFB090] font-semibold">Philosophy</span>
                <button onClick={() => handleNavigate("/about")} className="text-xs text-left text-brand-warm-white/70 hover:text-white transition-colors">Studio About</button>
                <button onClick={() => handleNavigate("/contact")} className="text-xs text-left text-brand-warm-white/70 hover:text-white transition-colors">Intake Contact</button>
              </div>
            </div>

            {/* Right col - Legal directives and details */}
            <div className="md:col-span-4 space-y-4 flex flex-col items-start md:items-end md:text-right">
              <span className="text-xs font-mono uppercase tracking-widest text-[#CA5995] font-semibold">Directives</span>
              <button onClick={() => handleNavigate("/privacy-policy")} className="text-xs text-brand-warm-white/70 hover:text-[#FFB090] transition-colors">Privacy Policy Curation</button>
              <button onClick={() => handleNavigate("/terms-of-service")} className="text-xs text-brand-warm-white/70 hover:text-[#FFB090] transition-colors">Terms of Service Curation</button>
            </div>
          </div>

          <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono tracking-wider text-neutral-400">
            <div>
              Designed & Engineered with extreme focus by Meshweb.
            </div>
            <div className="mt-4 sm:mt-0 flex gap-4 text-[#FFA6C9]/50">
              <span>• Studio Curation •</span>
              <span>• Coastal Luxury •</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 8. Functional Cookie Consent preferences banner panel */}
      <CookieConsent onConsentChange={handleConsentChange} />

    </div>
  );
}
