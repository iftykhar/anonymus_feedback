import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const STORAGE_PATH = path.join(process.cwd(), "storage", "feedback.json");

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

    // Read existing data
    let feedbackList = [];
    try {
      const data = await fs.readFile(STORAGE_PATH, "utf-8");
      feedbackList = JSON.parse(data);
    } catch {
      feedbackList = [];
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

    feedbackList.push(newFeedback);

    // Save back to file
    await fs.writeFile(STORAGE_PATH, JSON.stringify(feedbackList, null, 2));

    return NextResponse.json({ success: true, feedback: newFeedback });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
