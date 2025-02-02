import { auth } from "@clerk/nextjs/server"
import { client } from "@/sanity/lib/client"
import { userOrdersQuery } from "@/sanity/lib/queries"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Order {
  _id: string
  orderNumber: string
  createdAt: string
  totalAmount: number
  status: string
}

export default async function OrdersList() {
  const { userId } = await auth()
  const orders = await client.fetch<Order[]>(userOrdersQuery, { userId })

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
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order.orderNumber}</TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                <Button asChild>
                  <a href={`/profile/orders/${order._id}`}>Track Order</a>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

