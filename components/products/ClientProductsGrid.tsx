import React, { Suspense } from 'react'
import { client } from '@/sanity/lib/client'
import { productsQuery } from '@/sanity/lib/queries'
import { ProductGrid } from './products-grid'
import Loader from '../Loader'

const ClientProductsGrid = async () => {

    const products = await client.fetch(productsQuery)
    


    return (
        <div>
            <Suspense fallback={<Loader />}>
                <ProductGrid products={products} />
            </Suspense>
        </div>
    )
}

export default ClientProductsGrid