"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddressForm } from "@/components/profile/AddressForm"
import { AddressCard } from "@/components/profile/AddressCard"
import { PlusIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Address {
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export default function AddressList() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/addresses`)
      if (!response.ok) {
        throw new Error("Failed to fetch addresses")
      }
      const data = await response.json()
      setAddresses(data)
      setIsLoading(false)
    } catch (err) {
      setError((err as Error).message)
      setIsLoading(false)
    }
  }

  const addAddress = async (address: Address) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(address),
      })
      if (!response.ok) {
        throw new Error("Failed to add address")
      }
      await fetchAddresses()
      setIsDialogOpen(false)
    } catch (err) {
      console.error("Error adding address:", err)
    }
  }

  const deleteAddress = async (index: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/addresses?index=${index}`, { method: "DELETE" })
      if (!response.ok) {
        throw new Error("Failed to delete address")
      }
      await fetchAddresses()
    } catch (err) {
      console.error("Error deleting address:", err)
    }
  }

  if (isLoading) return <div>Loading addresses...</div>

  return (
    <div className="space-y-6">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">
            <PlusIcon className="mr-2 h-4 w-4" /> Add New Address
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <AddressForm onSubmit={addAddress} />
        </DialogContent>
      </Dialog>

      {addresses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {addresses.map((address, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <AddressCard address={address} onDelete={() => deleteAddress(index)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No addresses</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new address.</p>
          <div className="mt-6">
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusIcon className="mr-2 h-4 w-4" /> Add New Address
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}