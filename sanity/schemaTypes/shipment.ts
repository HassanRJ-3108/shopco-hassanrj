export default {
  name: "shipment",
  title: "Shipment",
  type: "document",
  fields: [
    {
      name: "trackingId",
      title: "Tracking ID",
      type: "string",
    },
    {
      name: "order",
      title: "Order",
      type: "reference",
      to: [{ type: "order" }],
    },
    {
      name: "carrier",
      title: "Carrier",
      type: "string",
    },
    {
      name: "status",
      title: "Status",
      type: "string",
    },
    {
      name: "estimatedDeliveryDate",
      title: "Estimated Delivery Date",
      type: "date",
    },
    {
      name: "actualDeliveryDate",
      title: "Actual Delivery Date",
      type: "date",
    },
    {
      name: "shippingLabel",
      title: "Shipping Label",
      type: "file",
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

