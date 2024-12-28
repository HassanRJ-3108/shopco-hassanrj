export const product = {
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule: any) => Rule.required()
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule: any) => Rule.required()
        },
        {
            name: 'price',
            title: 'Price',
            type: 'number',
            validation: (Rule: any) => Rule.required().positive()
        },
        {
            name: 'rating',
            title: 'Rating',
            type: 'number',
            validation: (Rule: any) => Rule.required().min(0).max(5)
        },
        {
            name: 'originalPrice',
            title: 'Original Price',
            type: 'number',
            validation: (Rule: any) => Rule.positive()
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: (Rule: any) => Rule.required()
        },
        {
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [{ type: 'image' }],
            validation: (Rule: any) => Rule.required().min(1)
        },
        {
            name: 'colors',
            title: 'Colors',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    {
                        name: 'name',
                        title: 'Name',
                        type: 'string'
                    },
                    {
                        name: 'value',
                        title: 'Hex Value',
                        type: 'string'
                    }
                ]
            }]
        },
        {
            name: 'sizes',
            title: 'Sizes',
            type: 'array',
            of: [{ type: 'string' }]
        },
        {
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: [{ type: 'category' }],
            validation: (Rule: any) => Rule.required()
        },
        {
            name: 'style',
            title: 'Style',
            type: 'reference',
            to: [{ type: 'style' }],
            validation: (Rule: any) => Rule.required()
        },
        {
            name: 'isNewArrival',
            title: 'Is New Arrival',
            type: 'boolean',
            initialValue: false
        },
        {
            name: 'isTopSelling',
            title: 'Is Top Selling',
            type: 'boolean',
            initialValue: false
        },
        {
            name: 'inventory',
            title: 'Inventory',
            type: 'number',
            validation: (Rule: any) => Rule.required().integer().min(0)
        },
        {
            name: 'productDetails',
            title: 'Product Details',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (Rule: any) => Rule.required()
        },
        {
            name: 'faqs',
            title: 'FAQs',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    {
                        name: 'question',
                        title: 'Question',
                        type: 'string',
                        validation: (Rule: any) => Rule.required()
                    },
                    {
                        name: 'answer',
                        title: 'Answer',
                        type: 'array',
                        of: [{ type: 'block' }],
                        validation: (Rule: any) => Rule.required()
                    }
                ]
            }]
        }
    ]
}

