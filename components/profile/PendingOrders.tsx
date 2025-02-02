import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { client } from "@/sanity/lib/client"
import { pendingOrdersQuery } from "@/sanity/lib/queries"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PendingOrder {
  _id: string
  orderNumber: string
  createdAt: string
  totalAmount: number
  status: string
}

export default async function PendingOrders() {
  const { userId } = await auth()
  const pendingOrders = await client.fetch<PendingOrder[]>(pendingOrdersQuery, { userId })

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingOrders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order.orderNumber}</TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                <Button asChild>
                  <Link href={`/profile/orders/${order._id}`}>Track Order</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

