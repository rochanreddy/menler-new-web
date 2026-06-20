import { defineField, defineType } from 'sanity';
import { orderRankField } from '@sanity/orderable-document-list';

// A playbook / catalog add-on shown on the checkout page (/checkout) under
// "Add playbooks & catalogs". Mirrors the CATALOG array in src/pages/Checkout.jsx.
export default defineType({
  name: 'playbook',
  title: 'Playbook / Catalog',
  type: 'document',
  fields: [
    orderRankField({ type: 'playbook' }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'desc', title: 'Description', type: 'text', rows: 2 }),
    defineField({
      name: 'price', title: 'Price (₹)', type: 'number',
      description: 'Original price shown struck-through. Everything is FREE during launch, so this is just for display.',
    }),
    defineField({
      name: 'active', title: 'Show on checkout', type: 'boolean',
      initialValue: true,
      description: 'Turn off to hide this item from the checkout page without deleting it.',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'price', active: 'active' },
    prepare({ title, subtitle, active }) {
      return {
        title: active === false ? `${title} (hidden)` : title,
        subtitle: subtitle != null ? `₹${subtitle}` : '',
      };
    },
  },
});
