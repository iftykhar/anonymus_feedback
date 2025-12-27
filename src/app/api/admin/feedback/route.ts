import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET() {
  try {
    // Get all feedback from Vercel KV list
    // lrange with 0, -1 gets all elements. 
    // Since we use LPUSH, they are already in reverse chronological order.
    const feedbackList = await kv.lrange("feedback_list", 0, -1);

    return NextResponse.json(feedbackList || []);
  } catch (error) {
    console.error("Error reading feedback from KV:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
