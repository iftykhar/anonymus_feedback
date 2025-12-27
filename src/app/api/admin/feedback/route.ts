import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const STORAGE_PATH = path.join(process.cwd(), "storage", "feedback.json");

export async function GET() {
  try {
    const data = await fs.readFile(STORAGE_PATH, "utf-8");
    const feedbackList = JSON.parse(data);
    
    // Sort by timestamp descending
    feedbackList.sort((a: { timestamp: string }, b: { timestamp: string }) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json(feedbackList);
  } catch (error) {
    console.error("Error reading feedback:", error);
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
  }
}
