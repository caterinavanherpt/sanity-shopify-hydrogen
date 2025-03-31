import {defineField, defineType, defineArrayMember} from 'sanity'

export const parentProductType = defineType({
    name: 'parentProduct',
    type: 'document',
    fields: [
        defineField({
            name: 'productTitle',
            type: 'string',
        }),
        defineField({
            name: 'urlHandle',
            type: 'slug',
            options: {
                source: 'productTitle'
            }
        }),
        defineField({
            name: 'swatches',
            type: 'array',
            of: [defineArrayMember({ type: 'reference', to:[{type:'swatch'}] })]
        }),
        defineField({
            name: 'products',
            type: 'array',
            of: [defineArrayMember({ type: 'reference', to:[{type:'product'}] })]
        }),
        defineField({
            name: 'overview',
            type: 'array',
            of:[defineArrayMember({type:'block'})]
        }),
        defineField({
            name: 'sizingDetails',
            type: 'array',
            of:[defineArrayMember({type:'block'})]
        }),
        // defineField({
        //     name: 'care',
        //     type: 'array',
        //     of:[defineArrayMember({type:'reference', to:[{type:'care'}]})]
        // }),
    ]
})