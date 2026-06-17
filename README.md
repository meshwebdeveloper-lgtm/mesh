# 🌌 Meshweb Studio - Google Sheets Data Integration Guide

This guide details how to securely connect **Meshweb's** professional contact form, granular web analytics tracer, and premium cookie consent trackers to a single central Google Sheet spreadsheet.

---

## 📊 Overview

All client-side interactions on Meshweb are aggregated and securely routed through the Node/Express server (`server.ts`) before being synced with Google Sheets using the official **Google Sheets v4 API**. 

If Google Sheets credentials are not defined or are invalid, the system automatically falls back to an **In-Memory Local Database** with zero performance friction, so your visitors always experience perfect luxury-grade loading speeds. You can view cached submissions in real-time by visiting:
👉 `https://<your-domain>/api/local-db`

---

## 🛠️ Step-by-Step Google Sheets Setup

To establish the live connection, follow these three simple steps:

### 1. Create Your Google Spreadsheet & Configure Sheets
1. Create a new Google Sheet inside your Google Drive.
2. Create **three separate sheets (tabs)** inside your spreadsheet and name them exactly as follows:
   * **`Form Responses`**
   * **`Analytics`**
   * **`Cookie Consents`**
3. Inside each tab, paste the following header rows into **row 1**:
   * **`Form Responses` tab header (Columns A to H):**
     `Timestamp` | `Full Name` | `Email` | `Project Type` | `Website Focus` | `Budget` | `Custom Budget Details` | `Message`
   * **`Analytics` tab header (Columns A to Q):**
     `Timestamp` | `User ID` | `Session ID` | `Pages Visited` | `Scroll Depth (%)` | `Coordinates / Geolocation` | `Time Spent (s)` | `Buttons Clicked` | `Input / Interaction Type` | `Browser` | `OS` | `PC Specs` | `Mobile Model` | `Screen Resolution` | `Language` | `Referrer` | `Local Storage Usage`
   * **`Cookie Consents` tab header (Columns A to F):**
     `Timestamp` | `Consent Decision` | `Essential Authorized` | `Analytics Tracking Allowed` | `Marketing Tracking Allowed` | `Personalization Tracking Allowed`

4. Copy the unique **Spreadsheet ID** from your browser's address bar. It resides inside the URL as shown below:
   `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID_IS_HERE]/edit`

---

### 2. Generate a Google API Service Account Key
To allow our server to write data into the sheet without exposing public keys:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create standard credentials by enabling the **Google Sheets API**.
3. Create a **Service Account** under **IAM & Admin -> Service Accounts**.
4. Create a new API Key for the Service Account in **JSON format**:
   * Select your Service Account.
   * Go to the **Keys** tab -> **Add Key** -> **Create new key**.
   * Retrieve the downloaded `.json` config file.
5. Search for the `"client_email"` and `"private_key"` parameters inside the JSON file. You will use these in your credentials!

---

### 3. Share Spreadsheet Permissions
Your Service Account key acts as a virtual user. 

1. Copy the value of `"client_email"` from your downloaded JSON file (e.g., `meshweb-tracker@your-project.iam.gserviceaccount.com`).
2. Open your Google Spreadsheet, click **Share** at the top right, and invite the Service Account email.
3. Grant **Editor** roles to the Service Account email so that the API can write entries into your rows. (Uncheck "Notify people" before clicking Save).

---

## 🔑 Environment Variables Configuration

In order to run the applet on your production environments or Cloud Containers, configure the following secrets inside your environment parameters or your `.env` file:

```env
# Google Spreadsheet ID to sync records
GOOGLE_SHEETS_SHEET_ID=your_spreadsheet_id_here

# Service Account client email
GOOGLE_SHEETS_CLIENT_EMAIL=meshweb-tracker@your-project.iam.gserviceaccount.com

# Private Key (Keep quotes and format newlines with \n)
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

> **Pro-Tip:** If using an interface that strips formatting, ensure any raw `\n` characters in your private key are correctly escaped like `\\n` so that Node.js will parse the system key string correctly.

---

## 🚀 Deployment

The server is optimized out-of-the-box for superfast deployments. Run the commands based on your stage:

```bash
# Install all required compiled modules
npm install

# Run the live environment
npm run dev

# Generate high-performance production build
npm run build

# Start the optimized Node/Express system
npm run start
```

Your data streams are now fully synchronized under a unified professional database model. Live analytics logging tracks all visitors beautifully and safely!
