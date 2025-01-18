export default {
    name: 'review',
    title: 'Review',
    type: 'document',
    fields: [
      {
        name: 'product',
        title: 'Product',
        type: 'reference',
        to: [{ type: 'product' }],
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'customer',
        title: 'Customer',
        type: 'reference',
        to: [{ type: 'customer' }],
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'order',
        title: 'Order',
        type: 'reference',
        to: [{ type: 'order' }],
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'rating',
        title: 'Rating',
        type: 'number',
        validation: (Rule) => Rule.required().min(1).max(5),
      },
      {
        name: 'content',
        title: 'Content',
        type: 'text',
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'date',
        title: 'Date',
        type: 'datetime',
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'isVerified',
        title: 'Is Verified',
        type: 'boolean',
        initialValue: true,
      },
    ],
  }
  
  