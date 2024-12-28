export const style = {
  name: 'style',
  title: 'Style',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      }
    },
    {
        name: 'image',
        title: 'Image',
        type: 'image',
        validation: (Rule: any) => Rule.required()
      }
  ]
} 