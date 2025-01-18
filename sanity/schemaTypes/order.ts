export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
    },
    {
      name: 'customer',
      title: 'Customer',
      type: 'reference',
      to: [{ type: 'customer' }],
    },
    {
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'productId', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'quantity', type: 'number' },
            { name: 'price', type: 'number' },
            { name: 'color', type: 'string' },
            { name: 'size', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'totalAmount',
      title: 'Total Amount',
      type: 'number',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
    },
    {
      name: 'shipping',
      title: 'Shipping',
      type: 'object',
      fields: [
        {
          name: 'carrier',
          type: 'string',
        },
        {
          name: 'service',
          type: 'string',
        },
        {
          name: 'trackingNumber',
          type: 'string',
        },
        {
          name: 'cost',
          type: 'number',
        },
        {
          name: 'estimatedDays',
          type: 'number',
        },
        {
          name: 'rateId',
          type: 'string',
        },
        {
          name: 'label',
          type: 'object',
          fields: [
            { name: 'id', type: 'string' },
            { name: 'pdf', type: 'string' },
            { name: 'png', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'tracking',
      title: 'Tracking',
      type: 'object',
      fields: [
        {
          name: 'status',
          type: 'string',
        },
        {
          name: 'updatedAt',
          type: 'datetime',
        },
        {
          name: 'events',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'date', type: 'datetime' },
                { name: 'status', type: 'string' },
                { name: 'description', type: 'string' },
                { name: 'location', type: 'string' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    },
    {
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      orderNumber: 'orderNumber',
      customerName: 'customer.name',
      status: 'status',
      total: 'totalAmount',
    },
    prepare(selection: any) {
      const { orderNumber, customerName, status, total } = selection;
      return {
        title: `Order ${orderNumber}`,
        subtitle: `${customerName} - ${status} - $${total}`,
      };
    },
  },
};

