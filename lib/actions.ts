"use server"

import { auth } from "@clerk/nextjs/server"
import { clerkClient } from "@clerk/clerk-sdk-node"

export async function updateProfile(data: { firstName: string; lastName: string }) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("User not authenticated")
  }

  try {
    await clerkClient.users.updateUser(userId, {
      firstName: data.firstName,
      lastName: data.lastName,
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error
  }
}