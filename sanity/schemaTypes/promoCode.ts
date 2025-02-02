export default {
  name: "promoCode",
  title: "Promo Code",
  type: "document",
  fields: [
    {
      name: "code",
      title: "Code",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "discountPercentage",
      title: "Discount Percentage",
      type: "number",
      validation: (Rule: any) => Rule.required().min(0).max(100),
    },
    {
      name: "validFrom",
      title: "Valid From",
      type: "datetime",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "validTo",
      title: "Valid To",
      type: "datetime",
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

