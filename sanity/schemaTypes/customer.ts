export default {
  name: "customer",
  title: "Customer",
  type: "document",
  fields: [
    {
      name: "firstName",
      title: "First Name",
      type: "string",
    },
    {
      name: "lastName",
      title: "Last Name",
      type: "string",
    },
    {
      name: "clerkId",
      title: "Clerk ID",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule: any) => Rule.required().email(),
    },
    {
      name: "phone",
      title: "Phone",
      type: "string",
    },
    {
      name: "addresses",
      title: "Addresses",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "addressLine1", type: "string", title: "Address Line 1" },
            { name: "addressLine2", type: "string", title: "Address Line 2" },
            { name: "city", type: "string", title: "City" },
            { name: "state", type: "string", title: "State" },
            { name: "zipCode", type: "string", title: "Zip Code" },
            { name: "country", type: "string", title: "Country" },
            { name: "isDefault", type: "boolean", title: "Is Default Address" },
          ],
        },
      ],
    },
    {
      name: "orders",
      title: "Orders",
      type: "array",
      of: [{ type: "reference", to: [{ type: "order" }] }],
    },
    {
      name: "wishlist",
      title: "Wishlist",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    },
    {
      name: "pendingDeliveries",
      title: "Pending Deliveries",
      type: "array",
      of: [{ type: "reference", to: [{ type: "order" }] }],
    },
    {
      name: "totalOrders",
      title: "Total Orders",
      type: "number",
      initialValue: 0,
    },
    {
      name: "totalWishlistItems",
      title: "Total Wishlist Items",
      type: "number",
      initialValue: 0,
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
    {
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
  ],
}

