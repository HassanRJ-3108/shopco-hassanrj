import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createClient } from 'next-sanity'

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false,
    apiVersion: '2024-12-25',
    token: process.env.SANITY_API_TOKEN,
})



export async function GET() {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const addresses = await client.fetch(
            `
      *[_type == "customer" && clerkId == $userId][0].addresses[isDefault == true]
    `,
            { userId },
        )

        return NextResponse.json({ addresses })
    } catch (error) {
        console.error("Error fetching default addresses:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

