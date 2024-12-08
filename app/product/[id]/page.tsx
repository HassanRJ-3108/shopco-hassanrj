import { Metadata } from 'next';
import { ProductDetail } from '@/components/products/product-details';
import { products } from '@/lib/products';
import { notFound } from 'next/navigation';
import { ProductReviews } from '@/components/products/product-reviews';
import RelatedProducts from '@/components/products/related-products';

type ProductPageProps = {
  params: { id: string }; // Define `params` explicitly
  searchParams?: { [key: string]: string | string[] | undefined };
};

// Handle dynamic metadata generation
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for does not exist.',
    };
  }

  return {
    title: `${product.title} - Shop.co`,
    description: product.description,
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound(); // Built-in Next.js error page
  }

  return (
    <div>
      <ProductDetail product={product} />
      <ProductReviews />
      <RelatedProducts />
    </div>
  );
}
