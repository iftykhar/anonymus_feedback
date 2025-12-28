import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import fs from "fs/promises";
import path from "path";

const STORAGE_PATH = path.join(process.cwd(), "storage", "feedback.json");

export async function GET() {
  try {
    // Try to get from Vercel KV first
    const hasKV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
    
    if (hasKV) {
      try {
        const feedbackList = await kv.lrange("feedback_list", 0, -1);
        if (feedbackList && feedbackList.length > 0) {
           return NextResponse.json(feedbackList);
        }
      } catch (kvError) {
        console.error("KV Retrieval Error, falling back to local:", kvError);
      }
    }

    // Fallback to local storage
    try {
      const data = await fs.readFile(STORAGE_PATH, "utf-8");
      const feedbackList = JSON.parse(data);

      // Current structured data might already be in reverse order, but locally we'll ensure it
      const sortedFeedback = Array.isArray(feedbackList) 
        ? feedbackList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        : [];

      return NextResponse.json(sortedFeedback);
    } catch {
      // If file doesn't exist, return empty array
      return NextResponse.json([]);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("General Admin API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: message },
      { status: 500 }
    );
  }
}
