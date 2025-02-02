import { NextResponse } from "next/server"

export async function GET() {
  // In a real application, you would fetch this from a database or external service
  const discountRate = 0.014 // 1.4% discount

  return NextResponse.json({ rate: discountRate })
}

