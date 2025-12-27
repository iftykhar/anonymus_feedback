import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (email === "admin@gmail.com" && password === "pass-123456") {
      // In a real app, we would set a JWT or session cookie here
      return NextResponse.json({ success: true, message: "Login successful" });
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
