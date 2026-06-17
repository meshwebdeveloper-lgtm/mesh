import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory fallback database for form submissions, analytics, and cookie preferences in case Google Sheets is not configured or fails
const localSubmissions: any[] = [];
const localAnalytics: any[] = [];
const localCookieConsents: any[] = [];

// Helper function to append to Google Sheets with service account
async function appendToSheet(tabName: string, row: any[]): Promise<{ success: boolean; mode: "sheets" | "memory" }> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SHEET_ID;
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

  if (!spreadsheetId || !clientEmail || !privateKey) {
    console.warn(`[Google Sheets Fallback] Credentials not configured. Saving to memory tab: ${tabName}`);
    if (tabName === "Form Responses") {
      localSubmissions.push(row);
    } else if (tabName === "Cookie Consents") {
      localCookieConsents.push(row);
    } else {
      localAnalytics.push(row);
    }
    return { success: true, mode: "memory" };
  }

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });
    const sheets = google.sheets({ version: "v4", auth });
    
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${tabName}!A1`, // Append starting at column A of the sheet tab name
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [row],
      },
    });
    console.log(`[Google Sheets] Successfully appended row to tab "${tabName}"`);
    return { success: true, mode: "sheets" };
  } catch (error) {
    console.error(`[Google Sheets Error] Custom write failed for ${tabName}:`, error);
    // Keep in local cache as fallback so user has perfect UX
    if (tabName === "Form Responses") {
      localSubmissions.push(row);
    } else if (tabName === "Cookie Consents") {
      localCookieConsents.push(row);
    } else {
      localAnalytics.push(row);
    }
    return { success: true, mode: "memory" };
  }
}

// SECURE SERVER-SIDE ENDPOINTS FOR CONTACT FORM & TRACKING
app.post("/api/contact", async (req, res) => {
  try {
    const { fullName, email, projectType, websiteFocus, budget, customBudget, message } = req.body;

    // Field-level validation
    if (!fullName || !email || !projectType || !websiteFocus || !budget || !message) {
      return res.status(400).json({ error: "Please fill in all required fields." });
    }

    const timestamp = new Date().toISOString();
    const finalBudget = budget === "Custom" ? `Custom: ${customBudget || "Not specified"}` : budget;

    const row = [
      timestamp,
      fullName,
      email,
      projectType,
      websiteFocus,
      finalBudget,
      customBudget || "",
      message
    ];

    const result = await appendToSheet("Form Responses", row);
    return res.status(200).json({ 
      success: true, 
      message: "Form response saved successfully!", 
      mode: result.mode 
    });
  } catch (err: any) {
    console.error("Error handling contact submission:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/cookies", async (req, res) => {
  try {
    const { accepted, essential, analytics, marketing, personalization } = req.body;
    const timestamp = new Date().toISOString();
    
    const row = [
      timestamp,
      accepted ? "Accepted" : "Customized",
      essential ? "true" : "false",
      analytics ? "true" : "false",
      marketing ? "true" : "false",
      personalization ? "true" : "false"
    ];

    const result = await appendToSheet("Cookie Consents", row);
    return res.status(200).json({ 
      success: true, 
      message: "Cookie preference registered", 
      mode: result.mode 
    });
  } catch (err: any) {
    console.error("Error handling cookie preference submit:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/analytics", async (req, res) => {
  try {
    const { events } = req.body;
    if (!events || !Array.isArray(events)) {
      return res.status(400).json({ error: "Invalid analytics batch." });
    }

    console.log(`[Analytics Server] Received batch of ${events.length} events.`);
    
    let mode: "sheets" | "memory" = "sheets";

    for (const evt of events) {
      const timestamp = evt.timestamp || new Date().toISOString();
      const row = [
        timestamp,
        evt.userId || "",
        evt.sessionId || "",
        evt.pagesVisited || "",
        evt.scrollDepth || 0,
        evt.location || "",
        evt.timeSpent || 0,
        evt.buttonsClicked || "",
        evt.inputType || "",
        evt.browser || "",
        evt.os || "",
        evt.pcSpecs || "",
        evt.mobileModel || "",
        evt.screenResolution || "",
        evt.language || "",
        evt.referrer || "",
        evt.localStorageUsage || ""
      ];

      const resWrite = await appendToSheet("Analytics", row);
      if (resWrite.mode === "memory") {
        mode = "memory";
      }
    }

    return res.status(200).json({ success: true, mode });
  } catch (err: any) {
    console.error("Error handling analytics tracking:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to view collected mock submissions (for testing/debugging and offline evaluation)
app.get("/api/local-db", (req, res) => {
  res.json({
    formResponses: localSubmissions,
    analytics: localAnalytics,
    cookieConsents: localCookieConsents,
    envStatus: {
      sheetsIdConfigured: !!process.env.GOOGLE_SHEETS_SHEET_ID,
      clientEmailConfigured: !!process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      privateKeyConfigured: !!process.env.GOOGLE_SHEETS_PRIVATE_KEY
    }
  });
});

async function runServer() {
  // Vite as development middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Meshweb Server] Running at http://localhost:${PORT}`);
  });
}

runServer();
