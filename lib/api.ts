import { client } from '@/sanity/lib/client'
import { Product, Category, Style } from '@/types/product'
import { groq } from 'next-sanity'

export async function getProducts(): Promise<Product[]> {
  return client.fetch(
    groq`*[_type == "product"] {
      _id,
      title,
      slug,
      price,
      originalPrice,
      rating,
      "images": images[].asset->url,
      category->{
        _id,
        name,
        "slug": slug.current
      },
      style->{
        _id,
        name,
        "slug": slug.current
      },
      colors,
      sizes,
      isNewArrival,
      isTopSelling,
      createdAt
    }`
  )
}

export async function getCategories(): Promise<Category[]> {
  return client.fetch(
    groq`*[_type == "category"] {
      _id,
      name,
      "slug": slug.current
    }`
  )
}

export async function getStyles(): Promise<Style[]> {
  return client.fetch(
    groq`*[_type == "style"] {
      _id,
      name,
      "slug": slug.current
    }`
  )
}

export async function searchProducts(query: string): Promise<Product[]> {
  const searchQuery = groq`
    *[_type == "product" && (
      title match $query || 
      $query in tags[] || 
      category->name match $query || 
      style->name match $query
    )] {
      _id,
      title,
      slug,
      price,
      originalPrice,
      rating,
      "images": images[].asset->url,
      category->{
        _id,
        name,
        "slug": slug.current
      },
      style->{
        _id,
        name,
        "slug": slug.current
      },
      colors,
      sizes,
      tags,
      isNewArrival,
      isTopSelling,
      createdAt
    }
  `

  return client.fetch(searchQuery, { query: `*${query}*` })
}

