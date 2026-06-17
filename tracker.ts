import { AnalyticsEvent, CookieConsentPreferences } from "../types";

class MeshwebTracker {
  private userId: string = "";
  private sessionId: string = "";
  private pagesVisited: string[] = [];
  private maxScrollDepth: number = 0;
  private location: string = "Pending...";
  private startTime: number = Date.now();
  private buttonsClicked: string[] = [];
  private inputTypeUsed: Set<string> = new Set();
  private eventQueue: any[] = [];
  private flushInterval: any = null;

  constructor() {
    if (typeof window === "undefined") return;

    this.initIds();
    this.detectLocation();
    this.setupListeners();
    this.startPeriodicFlush();
  }

  private initIds() {
    // Persistent User ID (anonymous organic)
    let uid = localStorage.getItem("mweb_uid");
    if (!uid) {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        uid = crypto.randomUUID();
      } else {
        uid = "uid_" + Math.random().toString(36).substring(2, 15) + "_" + Date.now().toString(36);
      }
      localStorage.setItem("mweb_uid", uid);
    }
    this.userId = uid;

    // Session ID is generated dynamically per tab load
    this.sessionId = "sid_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36).substring(4);
  }

  private detectLocation() {
    // Derive city, country from free ipapi lookup
    fetch("https://ipapi.co/json/")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        this.location = `${data.city || ""}, ${data.region_code || ""}, ${data.country_name || ""}`.trim() || "Remote Site";
      })
      .catch(() => {
        this.location = "Unknown Location";
      });
  }

  private setupListeners() {
    // Add current initial page
    this.trackPageVisit(window.location.pathname);

    // Track scrolls
    window.addEventListener("scroll", () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((window.scrollY / docHeight) * 100);
      if (pct > this.maxScrollDepth) {
        this.maxScrollDepth = Math.min(100, pct);
      }
    }, { passive: true });

    // Track general click event to capture button clicks list and input type
    window.addEventListener("mousedown", (e: MouseEvent) => {
      this.inputTypeUsed.add("mouse");
      
      const target = e.target as HTMLElement;
      const clickable = target.closest("a, button, [role='button']");
      if (clickable) {
        const text = (clickable.textContent || "").trim().substring(0, 30) || clickable.id || "unlabelled";
        this.buttonsClicked.push(text);
      }
    });

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      this.inputTypeUsed.add("keyboard");
    });

    window.addEventListener("touchstart", () => {
      this.inputTypeUsed.add("touch");
    }, { passive: true });
  }

  public trackPageVisit(p: string) {
    if (!this.pagesVisited.includes(p)) {
      this.pagesVisited.push(p);
    }
  }

  private getDeviceSpecs(): { browser: string; os: string; specs: string; mobModel: string; scr: string } {
    const ua = navigator.userAgent;
    
    // Simple browser detection
    let browser = "Other";
    if (ua.indexOf("Firefox") > -1) browser = "Firefox";
    else if (ua.indexOf("Chrome") > -1) browser = "Chrome";
    else if (ua.indexOf("Safari") > -1) browser = "Safari";
    else if (ua.indexOf("Edge") > -1) browser = "Edge";

    // Simple OS detection
    let os = "Other OS";
    if (ua.indexOf("Windows") > -1) os = "Windows";
    else if (ua.indexOf("Macintosh") > -1) os = "macOS";
    else if (ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) os = "iOS";
    else if (ua.indexOf("Android") > -1) os = "Android";
    else if (ua.indexOf("Linux") > -1) os = "Linux";

    // PC Specifications details
    const cores = navigator.hardwareConcurrency || "Unknown";
    const mem = (navigator as any).deviceMemory || "Unknown";
    const specs = `Cores: ${cores}, Mem: ${mem}GB`;

    // Mobile check
    let mobModel = "N/A (Desktop)";
    if (/android/i.test(ua)) {
      const match = ua.match(/Android\s+([^\s;]+)/);
      mobModel = `Android ${match ? match[1] : "OS"}`;
    } else if (/iphone|ipad|ipod/i.test(ua)) {
      mobModel = "iPhone/iPad";
    }

    const scr = `${window.screen.width}x${window.screen.height}`;

    return { browser, os, specs, mobModel, scr };
  }

  private measureLocalStorage(): string {
    try {
      const test = "test_ls";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      const keysLength = JSON.stringify(localStorage).length;
      return `Enabled (Size: ${keysLength} chars)`;
    } catch {
      return "Disabled/Exception";
    }
  }

  private checkTrackingConsent(): boolean {
    const consentStr = localStorage.getItem("mweb_cookies");
    if (!consentStr) return false; // Default: opt-out until cookie banner accept
    try {
      const pref: CookieConsentPreferences = JSON.parse(consentStr);
      return pref.accepted && pref.analytics;
    } catch {
      return false;
    }
  }

  private startPeriodicFlush() {
    this.flushInterval = setInterval(() => {
      this.flushQueue();
    }, 30000); // 30 seconds batch flush
  }

  public flushQueue() {
    if (!this.checkTrackingConsent()) {
      return; // Do not send if visitor un-checked analytics cookie consent
    }

    const duration = Math.round((Date.now() - this.startTime) / 1000);
    const { browser, os, specs, mobModel, scr } = this.getDeviceSpecs();
    const lsUsage = this.measureLocalStorage();

    const payload: AnalyticsEvent = {
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId,
      pagesVisited: this.pagesVisited.join(", "),
      scrollDepth: this.maxScrollDepth,
      location: this.location,
      timeSpent: duration,
      buttonsClicked: this.buttonsClicked.join(", ") || "None",
      inputType: Array.from(this.inputTypeUsed).join("+") || "mouse",
      browser,
      os,
      pcSpecs: specs,
      mobileModel: mobModel,
      screenResolution: scr,
      language: navigator.language || "en",
      referrer: document.referrer || "Direct Visit",
      localStorageUsage: lsUsage
    };

    // Push into event queue and flush
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: [payload] })
    })
    .then((res) => {
      if (res.ok) {
        // Clear components of analytics that are absolute sums (scroll, referrer, location can stay)
        // Buttons clicked are flushed so we don't duplicate them in next logs
        this.buttonsClicked = [];
      }
    })
    .catch((err) => {
      console.warn("[Tracker Flush Error]: Backend unreachable. Preserving logging queues.", err);
    });
  }

  public shutdown() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    // Attempt one last synchronous-looking flush on close if possible
    this.flushQueue();
  }
}

// Global visual tracking singleton instantiator
let trackerInstance: MeshwebTracker | null = null;

export function getTracker() {
  if (typeof window !== "undefined" && !trackerInstance) {
    trackerInstance = new MeshwebTracker();
  }
  return trackerInstance;
}
