import { groq } from 'next-sanity'

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
    "imageUrl": images[0].asset->url
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
    reviews,
    description,
    "images": images[].asset->url,
    colors,
    sizes,
    category->,
    style->,
    inventory,
    slug,
    productDetails,
    faqs
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
    "slug": slug.current,
    "imageUrl": image.asset->url
  }
`

// Filter products query
export const filterProductsQuery = groq`
  *[_type == "product" && 
    ($category == "all" || category->slug.current == $category) &&
    ($style == "all" || style->slug.current == $style) &&
    price >= $minPrice && 
    price <= $maxPrice
  ] {
    _id,
    title,
    price,
    originalPrice,
    rating,
    "imageUrl": images[0].asset->url,
    category->,
    style->
  }
` 