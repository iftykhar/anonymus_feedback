The feedback system uses a **Hybrid Storage** approach. It works automatically in local development using your filesystem, but for production on Vercel, it requires a **Redis instance** (Vercel KV or Upstash).

> [!NOTE]
> **Vercel KV is actually powered by Upstash.** You can use either a Vercel-native KV instance or a standalone Upstash account.

## How to fix the 500 Storage Error on Vercel

To get feedback working in production, follow these steps:

1.  **Open your Vercel Dashboard**: Navigate to the project `anonymusfeedback-five`.
2.  **Go to the Storage Tab**: Click on "Storage" in the top navigation menu of your project.
3.  **Create a KV Database**:
    - Click **"Create Database"**.
    - Select **"KV"**.
    - Choose a name (e.g., `feedback-db`) and click **"Create"**.
4.  **Connect to Project**:
    - Once created, select your project from the "Connect" dropdown.
    - Click **"Connect"**. 
    - Vercel will automatically add the required environment variables (`KV_URL`, `KV_REST_API_URL`, etc.).
5.  **Redeploy**:
    - Go to the **Deployments** tab.
    - Click the three dots next to your latest deployment and select **"Redeploy"**.

## Local Development Setup

If you want to use the KV database locally instead of the local filesystem:

1.  Open your terminal in the project folder.
2.  Run `vercel link` (if not already linked).
3.  Run `vercel env pull .env.local`.
4.  Restart your server with `npm run dev`.

The app will now use the cloud KV database instead of `storage/feedback.json`.
