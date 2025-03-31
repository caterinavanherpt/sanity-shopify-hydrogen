import {defineField, defineType} from 'sanity'

export const swatchType = defineType({
    name: 'swatch',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            type: 'string',
        }),
        defineField({
            name: 'image',
            type: 'image'
        }),
    ]
})