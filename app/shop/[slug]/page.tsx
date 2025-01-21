import { Metadata } from 'next';
import { ProductDetail } from '@/components/product/product-details'
import { notFound } from 'next/navigation';
import { productQuery } from '@/sanity/lib/queries';
import { client } from '@/sanity/lib/client';
import { Product } from '@/types/product';
import { ProductReviews } from "@/components/product/product-reviews";
import RelatedProducts from "@/components/product/related-products";
import { Suspense } from 'react';
import Loader from '@/components/Loader';
import { Toaster } from '@/components/ui/toaster';
type ProductPageProps = {
  params: { slug: string };
};
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product: Product | null = await client.fetch(productQuery, { slug: params.slug });

    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The product you are looking for does not exist.',
      };
    }
    return {
      title: `${product.title} - Shop.co`,
      description: product.description,
      openGraph: {
        title: `${product.title} - Shop.co`,
        description: product.description,
        images: [
          {
            url: product.images[0],
            width: 800,
            height: 600,
            alt: product.title,
          },
        ],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
      description: 'An error occurred while fetching product information.',
    };
  }
}
export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const product: Product | null = await client.fetch(productQuery, { slug: params.slug });

    if (!product) {
      notFound();
    }
    return (
      <Suspense fallback={<div>{<Loader />}</div>}>
        <Toaster/>
        <ProductDetail product={product} />
        <ProductReviews product={product} />
        <RelatedProducts />
      </Suspense>
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

