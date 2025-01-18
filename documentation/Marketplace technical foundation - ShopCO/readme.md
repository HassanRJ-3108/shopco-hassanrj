# SHOP.CO

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
4. [Schemas](#schemas)
3. [API Endpoints](#api-endpoints)
5. [CMS Integration](#sanity-and-next-js-interaction)

## Project Overview

ShopCO is a modern, responsive e-commerce website and a comprehensive marketplace technical foundation for an innovative business idea. Developed as part of Hackathon 3, this project builds upon the UI/UX designs from Hackathon 2, transforming them into a fully functional platform.

The planning focuses on creating a dynamic business infrastructure, addressing data schemas for managing products, customers, orders, shipments, and payments. By leveraging Sanity CMS for content management and Next.js for frontend development, ShopCO ensures a seamless flow of data between the backend and frontend systems.

The vision behind ShopCO is to offer a scalable, efficient, and user-friendly marketplace with robust features like real-time updates, intuitive navigation, and a premium shopping experience. The project not only lays the groundwork for a thriving e-commerce business but also highlights a commitment to cutting-edge technology and user-centric design. 🚀

# **System Architecture**

## Pages

![Tools and Libraries Table](/documentation/images/user-system.png)

1. **Home Page**: A welcoming page showcasing featured products and categories with a sleek and responsive design.
2. **Shop Page**: A dedicated section to explore and filter products by categories and preferences.
3. **Cart Page**: Manage items added to the cart with real-time updates and quantity adjustments.
4. **Order Tracking Page**: Track the status and progress of ongoing orders with live updates.
5. **Track Order Page**: Users can input their order ID to find specific details about their order.
6. **Checkout Page**: A secure and smooth checkout process integrated with Stripe for payment.
7. **Thank You Page**: A confirmation page to thank users after successful order placement.



## Technologies Used

![Tools and Libraries Table](/documentation/images/tools.jpg)
### Frontend
- **Next.js**: For building server-rendered, dynamic UIs.
- **Tailwind CSS**: For responsive and beautiful designs.
- **Shadcn/UI**: For customizable UI components.

### Backend
- **Sanity CMS**: To manage and structure content effectively.
- **Clerk**: For user authentication and management.

### APIs
- **ShipEngine API**: For shipment tracking and delivery management.
- **Stripe API**: For secure and seamless payment processing.

### Tools
- **GitHub**: For version control and collaboration.
- **Postman**: To test and document APIs.
- **Vercel**: For fast and reliable deployment.


## API Endpoints

Here are the main API endpoints we'll be working with:

| Endpoint | Method | What it does |
|----------|--------|--------------|
| `/api/create-order` | POST | Creates a new order when someone buys something |
| `/api/orders` | GET | Fetches all orders (admin stuff) |
| `/api/shipengine/create-label` | POST | Makes a shipping label for orders |
| `/api/shipengine/get-rates` | GET | Checks shipping costs |
| `/api/shipengine/track-shipment` | GET | Tracks where a shipment is |
| `/api/track-orders` | GET | Lets users see all of their orders |
| `/api/send/confirmation-email` | POST | Sends an email to confirm an order |
| `/api/reviews/[productId]` | POST | Adds a review for a product |
| `/api/reviews/[productId]` | GET | Fetches reviews for a product |



## Sanity and Next JS Interaction
Sanity CMS is integrated into the Next.js application to provide dynamic and flexible content management. The interaction works as follows:

![Sanity and NextJS Intraction](/documentation/images/sanity-nextjs-intraction.png)

1. **Data Management in Sanity:** All the e-commerce data (e.g., products, orders, customers) is stored and managed in Sanity's content studio.

2. **Fetching Data:** Next.js fetches data from Sanity using GROQ queries via Sanity's API endpoints. These queries retrieve structured content, ensuring high flexibility.

3. **Server-side Rendering (SSR):** For dynamic pages like product detail pages, order details page.

4. **Static Site Generation (SSG):** Pages like home and category pages are pre-rendered at build time. 

5. **Real-time Updates:** Sanity's webhooks notify the application of changes, enabling immediate updates without manual rebuilds.

6. **Rendering Components:** The fetched data is passed to React components for rendering dynamic and interactive user interfaces.

This seamless integration ensures a robust and scalable e-commerce platform.

---




# ***Schemas***

We're using Sanity CMS, so our schemas are pretty straightforward. Here's a sneak peek at our product schema:



### **Product**
| Field             | Type           | Description                                    |
|-------------------|----------------|------------------------------------------------|
| `id`             | String         | Unique identifier for the product.            |
| `name`           | String         | Name of the product.                          |
| `price`          | Number         | Current selling price.                        |
| `stock`          | Number         | Quantity available in stock.                  |
| `description`    | String         | Detailed description of the product.          |
| `images`         | Array[String]  | List of image URLs for the product.           |
| `category`       | Reference      | Associated category of the product.           |
| `createdAt`      | Date           | Product creation date.                        |
| `slug`           | String         | URL-friendly identifier for the product.      |
| `rating`         | Number         | Average customer rating.                      |
| `originalPrice`  | Number         | Original price before any discounts.          |
| `colors`         | Array[String]  | Available colors for the product.             |
| `sizes`          | Array[String]  | Available sizes for the product.              |
| `tags`           | Array[String]  | Searchable tags associated with the product.  |
| `isNewArrival`   | Boolean        | Flag indicating if the product is a new arrival. |
| `isTopSelling`   | Boolean        | Flag indicating if the product is a top-seller. |
| `productDetails` | Object         | Additional details about the product.         |
| `faqs`           | Array[Object]  | Frequently asked questions about the product. |

### **Customer**
| Field         | Type       | Description                     |
|---------------|------------|---------------------------------|
| `customerId` | String     | Unique identifier for the customer. |
| `name`       | String     | Customer's full name.           |
| `email`      | String     | Email address of the customer.  |
| `phone`      | String     | Contact phone number.           |
| `address`    | String     | Residential address.            |
| `city`       | String     | City of residence.              |
| `state`      | String     | State of residence.             |
| `zipCode`    | String     | ZIP or postal code.             |

### **Order**
| Field             | Type           | Description                                    |
|-------------------|----------------|------------------------------------------------|
| `orderId`        | String         | Unique identifier for the order.              |
| `customer`       | Reference      | Customer who placed the order.                |
| `items`          | Array[Object]  | List of items in the order.                   |
| `totalAmount`    | Number         | Total cost of the order.                      |
| `status`         | String         | Current order status.                         |
| `shipping`       | Object         | Shipping details.                             |
| `createdAt`      | Date           | Order creation date.                          |
| `updatedAt`      | Date           | Last update date for the order.               |

### **Shipment**
| Field                  | Type           | Description                                |
|------------------------|----------------|--------------------------------------------|
| `shipmentId`          | String         | Unique identifier for the shipment.        |
| `order`               | Reference      | Associated order.                          |
| `carrier`             | String         | Shipping carrier name.                     |
| `status`              | String         | Current status of the shipment.            |
| `trackingId`          | String         | Tracking ID for the shipment.              |
| `estimatedDeliveryDate` | Date         | Expected delivery date.                    |
| `actualDeliveryDate`  | Date           | Actual delivery date.                      |
| `shippingLabel`       | String         | URL of the shipping label.                 |
| `createdAt`           | Date           | Shipment creation date.                    |
| `updatedAt`           | Date           | Last update date for the shipment.         |

### **Category**
| Field         | Type   | Description                     |
|---------------|--------|---------------------------------|
| `name`       | String | Name of the category.           |
| `slug`       | String | URL-friendly identifier.        |


### **Coupon**
| Field         | Type       | Description                     |
|---------------|------------|---------------------------------|
| `code`       | String     | Unique coupon code.             |
| `discountType` | String   | Type of discount (e.g., percentage, flat). |
| `discountValue` | Number   | Value of the discount.          |
| `minPurchase` | Number     | Minimum purchase amount required. |
| `expiryDate` | Date       | Expiration date of the coupon.  |
| `isActive`   | Boolean    | Indicates if the coupon is active. |


---

