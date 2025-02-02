import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { promoCode } = await req.json()

    // In a real application, you would validate the promo code against a database
    // For this example, we'll just check if the code is "DISCOUNT10"
    if (promoCode === "DISCOUNT10") {
      return NextResponse.json({ valid: true, discount: 10 })
    } else {
      return NextResponse.json({ valid: false, discount: 0 })
    }
  } catch (error: any) {
    console.error("Error applying promo code:", error)
    return NextResponse.json({ error: error.message || "Failed to apply promo code" }, { status: 500 })
  }
}

