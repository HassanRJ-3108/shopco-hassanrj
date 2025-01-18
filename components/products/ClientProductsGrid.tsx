import React, { Suspense } from 'react'
import { client } from '@/sanity/lib/client'
import { productsQuery, categoriesQuery, stylesQuery } from '@/sanity/lib/queries'
import { ProductGrid } from './products-grid'
import Loader from '../Loader'
import { Product, Category, Style } from '@/types/product'

const ClientProductsGrid = async () => {
    const products: Product[] = await client.fetch(productsQuery)
    const categories: Category[] = await client.fetch(categoriesQuery)
    const styles: Style[] = await client.fetch(stylesQuery)

    return (
        <Suspense fallback={<Loader />}>
            <ProductGrid 
                initialProducts={products} 
                categories={categories.map(cat => cat.name)}
                styles={styles.map(style => style.name)}
            />
        </Suspense>
    )
}

export default ClientProductsGrid
