import { defineField, defineType } from 'sanity';

// Mirrors the props of src/components/common/PricingCard.jsx exactly.
export default defineType({
  name: 'pricingCard',
  title: 'Pricing card',
  type: 'object',
  fields: [
    defineField({ name: 'pill', title: 'Pill (programme tag)', type: 'string' }),
    defineField({ name: 'name', title: 'Programme name', type: 'string' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'text', rows: 2 }),
    defineField({ name: 'price', title: 'Price', type: 'string', description: 'e.g. 4,999' }),
    defineField({ name: 'origPrice', title: 'Original price (struck through)', type: 'string' }),
    defineField({ name: 'priceSub', title: 'Price subtext', type: 'string' }),
    defineField({ name: 'ctaLabel', title: 'CTA label', type: 'string', initialValue: 'Enrol now' }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'detail', title: 'Detail', type: 'string' },
        ],
        preview: { select: { title: 'title', subtitle: 'detail' } },
      }],
    }),
    defineField({
      name: 'chips',
      title: 'Meta chips',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Label', type: 'string' },
          { name: 'value', title: 'Value', type: 'string' },
        ],
        preview: { select: { title: 'label', subtitle: 'value' } },
      }],
    }),
  ],
});
