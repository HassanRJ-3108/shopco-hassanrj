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

type ProductPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  console.log('Generating metadata for slug:', params.slug);
  try {
    const product: Product | null = await client.fetch(productQuery, { slug: params.slug });
    console.log('Metadata product fetch result:', product);

    if (!product) {
      console.log('Product not found for metadata');
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
  console.log('Rendering product page for slug:', params.slug);
  try {
    console.log('Fetching product data...');
    const product: Product | null = await client.fetch(productQuery, { slug: params.slug });
    console.log('Fetched product:', JSON.stringify(product, null, 2));

    if (!product) {
      console.log('Product not found, returning 404');
      notFound();
    }

    return (
      <Suspense fallback={<div>{<Loader />}</div>}>
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

