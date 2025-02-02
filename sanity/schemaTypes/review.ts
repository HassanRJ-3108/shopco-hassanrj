export default {
  name: "review",
  title: "Review",
  type: "document",
  fields: [
    {
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      options: { weak: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "customer",
      title: "Customer",
      type: "reference",
      to: [{ type: "customer" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule: any) => Rule.required().min(1).max(5),
    },
    {
      name: "content",
      title: "Content",
      type: "text",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
  ],
}

