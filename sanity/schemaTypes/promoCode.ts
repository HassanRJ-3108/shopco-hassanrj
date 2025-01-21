export default {
    name: "promoCode",
    title: "Promo Code",
    type: "document",
    fields: [
      {
        name: "code",
        title: "Code",
        type: "string",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "discountPercentage",
        title: "Discount Percentage",
        type: "number",
        validation: (Rule) => Rule.required().min(0).max(100),
      },
      {
        name: "validFrom",
        title: "Valid From",
        type: "datetime",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "validTo",
        title: "Valid To",
        type: "datetime",
        validation: (Rule) => Rule.required(),
      },
    ],
  }
  
  