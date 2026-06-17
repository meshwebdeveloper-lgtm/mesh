export interface ContactFormData {
  fullName: string;
  email: string;
  projectType: string;
  websiteFocus: string;
  budget: string;
  customBudget?: string;
  message: string;
}

export interface AnalyticsEvent {
  timestamp: string;
  userId: string;
  sessionId: string;
  pagesVisited: string;     // comma-separated or json string
  scrollDepth: number;     // highest scroll percentage reached
  location: string;        // country/city derived from service
  timeSpent: number;       // total seconds on site
  buttonsClicked: string;  // comma-separated list of buttons clicked
  inputType: string;       // "mouse", "keyboard", "touch"
  browser: string;
  os: string;
  pcSpecs: string;         // Device memory, CPU cores, etc.
  mobileModel: string;
  screenResolution: string;
  language: string;
  referrer: string;
  localStorageUsage: string;
}

export interface CookieConsentPreferences {
  accepted: boolean;
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  timestamp: string;
}
