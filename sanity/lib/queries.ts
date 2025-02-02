import { groq } from "next-sanity"


export const userAddressesQuery = groq`
  *[_type == "customer" && clerkId == $clerkId][0].addresses
`


export const userOrdersQuery = groq`
  *[_type == "order" && user._ref == $userId] | order(createdAt desc) {
    _id,
    orderNumber,
    createdAt,
    totalAmount,
    status,
    items[]{
      _key,
      product->{
        _id,
        title,
        "slug": slug.current,
        "imageUrl": images[0].asset->url
      },
      quantity,
      price
    }
  }
`

// Get user wishlist
export const userWishlistQuery = groq`
  *[_type == "wishlistItem" && user._ref == $userId] {
    _id,
    product->{
      _id,
      title,
      price,
      "slug": slug.current,
      "imageUrl": images[0].asset->url
    }
  }
`

// Get pending orders
export const pendingOrdersQuery = groq`
  *[_type == "order" && user._ref == $userId && status in ["pending", "processing"]] | order(createdAt desc) {
    _id,
    orderNumber,
    createdAt,
    totalAmount,
    status,
    items[]{
      _key,
      product->{
        _id,
        title,
        "slug": slug.current,
        "imageUrl": images[0].asset->url
      },
      quantity,
      price
    }
  }
`





// Get all products with basic info
export const productsQuery = groq`
  *[_type == "product"] {
    _id,
    title,
    slug,
    price,
    originalPrice,
    category->,
    style->,
    inventory,
    rating,
    "images": images[].asset->url,
    colors,
    sizes,
    createdAt,
    isNewArrival,
    isTopSelling
  }
`

// Get new arrivals
export const newArrivalsQuery = groq`
  *[_type == "product" && isNewArrival == true] {
    _id,
    title,
    slug,
    category->,
    price,
    originalPrice,
    rating,
    "imageUrl": images[0].asset->url
  }
`

// Get top selling products
export const topSellingQuery = groq`
  *[_type == "product" && isTopSelling == true] {
    _id,
    title,
    price,
    slug,
    originalPrice,
    rating,
    "imageUrl": images[0].asset->url
  }
`

// Get single product with all details
export const productQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    price,
    originalPrice,
    rating,
    description,
    "images": images[].asset->url,
    colors,
    sizes,
    tags,
    category->,
    style->,
    inventory,
    slug,
    productDetails,
    faqs,
    isNewArrival,
    isTopSelling
  }
`

// Get all categories
export const categoriesQuery = groq`
  *[_type == "category"] {
    _id,
    name,
    "slug": slug.current,
    "imageUrl": image.asset->url
  }
`

// Get all styles
export const stylesQuery = groq`
  *[_type == "style"] {
    _id,
    name,
    "slug": slug.current
  }
`

// Filter products query
export const filterProductsQuery = groq`
  *[_type == "product" && 
    ($category == "all" || category->slug.current == $category) &&
    ($style == "all" || style->slug.current == $style) &&
    price >= $minPrice && 
    price <= $maxPrice &&
    rating >= $rating &&
    ($newArrivals == false || isNewArrival == true) &&
    ($topSelling == false || isTopSelling == true)
  ] | order($sortField $sortOrder) {
    _id,
    title,
    price,
    originalPrice,
    rating,
    "imageUrl": images[0].asset->url,
    category->,
    style->,
    createdAt,
    isNewArrival,
    isTopSelling
  }
`

