import type {StructureResolver} from 'sanity/structure'
import { HierarchyTree } from './components/HierarchyTree'
import { BulkProductManager } from './components/BulkProductManager'
import { TestimonialsBulkManager, TrustedByBulkManager } from './components/GenericBulkManager'
import { createClient } from 'next-sanity'

// Initialize Sanity client for server-side data fetching
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'zc2umfrr',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('NMarkFire OS')
    .items([
      // 🧩 Home Page Control (Singleton)
      S.listItem()
        .title('Home Page Control')
        .icon(() => '🧩')
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homePage')
            .title('Home Page Configuration')
        ),
      
      S.divider(),

      
      // ✅ Trusted By (Logos)
      S.listItem()
        .title('Trusted By (Logos)')
        .icon(() => '🤝')
        .child(
            S.list()
                .title('Trusted By')
                .items([
                    S.listItem()
                        .title('All Partners')
                        .icon(() => '🏢')
                        .child(
                             S.documentTypeList('trustedByItem')
                                .title('Trusted Partners')
                                .defaultOrdering([{field: 'order', direction: 'asc'}])
                        ),
                    S.listItem()
                        .title('Bulk Manager (Admin)')
                        .icon(() => '⚡')
                        .child(
                            S.component()
                                .component(TrustedByBulkManager)
                                .title('Bulk Manager')
                        )
                ])
        ),

      // 💬 Testimonials
      S.listItem()
        .title('Testimonials')
        .icon(() => '💬')
        .child(
            S.list()
                .title('Testimonials')
                .items([
                    S.listItem()
                        .title('All Testimonials')
                        .icon(() => '📝')
                        .child(
                            S.documentTypeList('testimonial')
                                .title('All Testimonials')
                                .defaultOrdering([{field: 'order', direction: 'asc'}])
                        ),
                    S.listItem()
                        .title('Bulk Manager (Admin)')
                        .icon(() => '⚡')
                        .child(
                            S.component()
                                .component(TestimonialsBulkManager)
                                .title('Bulk Manager')
                        )
                ])
        ),

      S.divider(),



      S.divider(),

      
      // 🌳 Visual Product Hierarchy (New)
      S.listItem()
        .title('Product Hierarchy')
        .icon(() => '🌳')
        .child(
           S.component()
            .component(HierarchyTree)
            .title('Hierarchy Explorer')
        ),
      S.divider(),

      // 🛒 Bulk Product Manager
      S.listItem()
        .title('Bulk Product Manager')
        .icon(() => '🛒')
        .child(
           S.component()
            .component(BulkProductManager)
            .title('Bulk Product Manager')
        ),

      S.divider(),

      // 📂 Main Categories
      S.documentTypeListItem('mainCategory')
        .title('Main Categories')
        .icon(() => '📂')
        .child(
          S.documentTypeList('mainCategory')
            .title('Main Categories')
            .defaultOrdering([{field: 'order', direction: 'asc'}])
        ),

      // 📁 Sub Categories
      S.documentTypeListItem('subCategory')
        .title('Sub Categories')
        .icon(() => '📁')
        .child(
          S.documentTypeList('subCategory')
            .title('Sub Categories')
            .defaultOrdering([{field: 'displayOrder', direction: 'asc'}, {field: '_updatedAt', direction: 'desc'}])
        ),

      // 🧯 System Types
      S.documentTypeListItem('systemType')
        .title('System Types')
        .icon(() => '🧯')
        .child(
          S.documentTypeList('systemType')
            .title('System Types')
            .defaultOrdering([{field: 'displayOrder', direction: 'asc'}, {field: '_updatedAt', direction: 'desc'}])
        ),

      // 🔩 Variants
      S.documentTypeListItem('variant')
        .title('Variants')
        .icon(() => '🔩')
        .child(
          S.documentTypeList('variant')
            .title('Variants')
            .defaultOrdering([{field: 'displayOrder', direction: 'asc'}, {field: '_updatedAt', direction: 'desc'}])
        ),

      // 🎯 Applications
      S.documentTypeListItem('application')
        .title('Applications')
        .icon(() => '🎯')
        .child(
          S.documentTypeList('application')
            .title('Applications')
            .defaultOrdering([{field: 'priority', direction: 'desc'}, {field: 'title', direction: 'asc'}])
        ),

      S.divider(),


      // 📦 Products (Dynamic Sellable Items - Server-Side Evaluated)
      S.listItem()
        .title('All Products (Sellable Leaves)')
        .icon(() => '📦')
        .child(async () => {
          // Fetch all documents of relevant types (no drafts)
          const query = `{
            "products": *[_type == "product"],
            "variants": *[_type == "variant"],
            "subCategories": *[_type == "subCategory"],
            "systemTypes": *[_type == "systemType"]
          }`;
          
          const data = await client.fetch(query);
          
          // Build sets of IDs for quick lookups
          const sellableIds: string[] = [];
          
          // 1. All products are always sellable (leaf nodes)
          data.products.forEach((p: any) => sellableIds.push(p._id));
          
          // 2. All variants are always sellable (leaf nodes)
          data.variants.forEach((v: any) => sellableIds.push(v._id));
          
          // 3. SubCategories are sellable ONLY if they have NO children
          data.subCategories.forEach((sub: any) => {
            const hasSystemChildren = data.systemTypes.some((sys: any) => 
              sys.parent?._ref === sub._id
            );
            const hasProductChildren = data.products.some((prod: any) => 
              prod.subCategory?._ref === sub._id
            );
            
            if (!hasSystemChildren && !hasProductChildren) {
              sellableIds.push(sub._id);
            }
          });
          
          // 4. SystemTypes are sellable ONLY if they have NO children
          data.systemTypes.forEach((sys: any) => {
            const hasVariantChildren = data.variants.some((variant: any) => 
              variant.parent?._ref === sys._id
            );
            const hasProductChildren = data.products.some((prod: any) => 
              prod.systemType?._ref === sys._id
            );
            
            if (!hasVariantChildren && !hasProductChildren) {
              sellableIds.push(sys._id);
            }
          });
          
          // Return a document list filtered by the sellable IDs we calculated
          return S.documentList()
            .title('Sellable Items (Verified)')
            .apiVersion('2024-01-01')
            .filter('_id in $ids')
            .params({ ids: sellableIds })
            .defaultOrdering([{field: '_updatedAt', direction: 'desc'}]);
        }),


    ])
