import { type SchemaTypeDefinition } from 'sanity'
import { product, category, style } from './product'
import shipment from './shipment'
import order from './order'
import customer from './customer'
import reviews from './review'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, category, style, order, shipment, customer, reviews],
}
