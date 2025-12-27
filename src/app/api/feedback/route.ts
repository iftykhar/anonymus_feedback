import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

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

    // Save to Vercel KV
    await kv.lpush("feedback_list", newFeedback);

    return NextResponse.json({ success: true, feedback: newFeedback });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
