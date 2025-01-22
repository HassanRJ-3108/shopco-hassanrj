'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from 'react-hot-toast'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(5, 'Zip code must be at least 5 characters'),
})

export function CheckoutForm() {
  const { state, dispatch } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // Get shipping rates
      const ratesResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/shipengine/get-rates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipToAddress: {
            name: values.name,
            phone: values.phone,
            addressLine1: values.address,
            cityLocality: values.city,
            stateProvince: values.state,
            postalCode: values.zipCode,
            countryCode: 'US',
            addressResidentialIndicator: 'yes',
          },
          packages: state.items.map(item => ({
            weight: { value: 16, unit: 'ounce' },
            dimensions: { length: 10, width: 8, height: 4, unit: 'inch' },
          })),
        }),
      })

      if (!ratesResponse.ok) {
        throw new Error('Failed to get shipping rates')
      }

      const ratesData = await ratesResponse.json()

      // For this example, we'll just use the first rate
      const selectedRate = ratesData.rateResponse.rates[0]

      // Create shipping label
      const labelResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/shipengine/create-label`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rateId: selectedRate.rateId }),
      })

      if (!labelResponse.ok) {
        throw new Error('Failed to create shipping label')
      }

      const labelData = await labelResponse.json()

      // Create order in Sanity
      const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: values,
          items: state.items,
          totalAmount: state.items.reduce((total, item) => total + item.price * item.quantity, 0),
          shippingLabel: labelData.labelDownload.pdf,
          trackingNumber: labelData.trackingNumber,
        }),
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create order')
      }

      const orderData = await orderResponse.json()

      // Clear cart
      dispatch({ type: 'CLEAR_CART' })

      // Show success message
      toast.success('Order placed successfully!')

      // Redirect to order confirmation page
      window.location.href = `/order-confirmation/${orderData._id}`
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('An error occurred during checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Anytown" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input placeholder="CA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input placeholder="12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Place Order'}
        </Button>
      </form>
    </Form>
  )
}

