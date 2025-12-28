import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import fs from "fs/promises";
import path from "path";

const STORAGE_PATH = path.join(process.cwd(), "storage", "feedback.json");

interface Review {
  id: string;
  content: string;
  rating: number | null;
  answers: Record<string, string>;
  subject: string | null;
  name: string | null;
  timestamp: string;
}

export async function GET() {
  try {
    let reviews: Review[] = [];

    // Try Vercel KV
    const hasKV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
    if (hasKV) {
      try {
        reviews = (await kv.lrange("feedback_list", 0, -1)) as Review[];
      } catch (kvError) {
        console.error("KV Retrieval Error in Reviews API:", kvError);
      }
    }

    // Fallback to local if KV is empty or failed
    if (!reviews || reviews.length === 0) {
      try {
        const data = await fs.readFile(STORAGE_PATH, "utf-8");
        reviews = JSON.parse(data);
      } catch {
        reviews = [];
      }
    }

    // Filter and sanitize for public display
    // We only send content, rating, subject, name, and timestamp
    const publicReviews = Array.isArray(reviews) 
      ? reviews
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .map((r: Review) => ({
            id: r.id,
            content: r.content,
            rating: r.rating,
            subject: r.subject,
            name: r.name || "Anonymous",
            timestamp: r.timestamp
          }))
      : [];

    return NextResponse.json(publicReviews);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal Server Error", details: message },
      { status: 500 }
    );
  }
}
