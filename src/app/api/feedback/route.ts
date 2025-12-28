import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import fs from "fs/promises";
import path from "path";

const STORAGE_PATH = path.join(process.cwd(), "storage", "feedback.json");

// Helper to ensure storage directory exists
async function ensureStorage() {
  const dir = path.dirname(STORAGE_PATH);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

export async function POST(req: Request) {
  try {
    const { content, rating, answers, subject, name } = await req.json();

    // Validation
    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "Feedback content is required." },
        { status: 400 }
      );
    }

    if (rating !== undefined && (typeof rating !== "number" || rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5." },
        { status: 400 }
      );
    }

    const newFeedback = {
      id: crypto.randomUUID(),
      content: content.trim(),
      rating: rating || null,
      answers: answers || {},
      subject: subject || null,
      name: name || null,
      timestamp: new Date().toISOString(),
    };

    // Try to use Vercel KV
    const hasKV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
    
    if (hasKV) {
      try {
        await kv.lpush("feedback_list", newFeedback);
        return NextResponse.json({ success: true, feedback: newFeedback, storage: "vercel-kv" });
      } catch (kvError) {
        console.error("KV Storage Error, falling back to local if allowed:", kvError);
      }
    }

    // Fallback to local storage (production check discouraged, but for this specific user request it's helpful)
    try {
      if (process.env.VERCEL) {
        throw new Error("Local filesystem is read-only on Vercel. Please set up KV storage.");
      }

      await ensureStorage();
      let feedbackList = [];
      try {
        const data = await fs.readFile(STORAGE_PATH, "utf-8");
        feedbackList = JSON.parse(data);
      } catch {
        feedbackList = [];
      }
      feedbackList.push(newFeedback);
      await fs.writeFile(STORAGE_PATH, JSON.stringify(feedbackList, null, 2));

      return NextResponse.json({ success: true, feedback: newFeedback, storage: "local-file" });
    } catch (localError: unknown) {
      const msg = localError instanceof Error ? localError.message : String(localError);
      return NextResponse.json(
        { 
          error: "Storage Error", 
          details: "Both Vercel KV and local storage failed. " + msg 
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal Server Error", details: message },
      { status: 500 }
    );
  }
}
