import { type SchemaTypeDefinition } from 'sanity'
import { product } from './product'
import { category } from './category'
import { style } from './style'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, category, style],
}
