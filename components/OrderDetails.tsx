import { format } from 'date-fns'

interface Order {
  _id: string;
  status: string;
  trackingNumber?: string;
  createdAt: string;
  totalAmount: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

export function OrderDetails({ order }: { order: Order }) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Order Details</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Order ID: {order._id}</p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Order Status</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.status}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Tracking Number</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {order.trackingNumber || 'Not available yet'}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Order Date</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {format(new Date(order.createdAt), 'MMMM d, yyyy')}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${order.totalAmount.toFixed(2)}</dd>
          </div>
        </dl>
      </div>
      <div className="px-4 py-5 sm:px-6">
        <h4 className="text-lg leading-6 font-medium text-gray-900">Items</h4>
        <ul className="mt-2 divide-y divide-gray-200">
          {order.items.map((item, index) => (
            <li key={index} className="py-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-900">{item.name}</span>
                <span className="text-sm text-gray-500">Quantity: {item.quantity}</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-sm text-gray-500">Price: ${item.price.toFixed(2)}</span>
                <span className="text-sm text-gray-500">Total: ${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

