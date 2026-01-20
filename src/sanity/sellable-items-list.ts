import { defineType } from 'sanity';
import { createClient } from 'next-sanity';

// This component dynamically builds the sellable items list
export const sellableItemsListItem = async (S: any) => {
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'zc2umfrr',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN
  });

  // Fetch all documents
  const [products, variants, subCategories, systemTypes] = await Promise.all([
    client.fetch(`*[_type == "product" && !(_id in path("drafts.**"))]`),
    client.fetch(`*[_type == "variant" && !(_id in path("drafts.**"))]`),
    client.fetch(`*[_type == "subCategory" && !(_id in path("drafts.**"))]`),
    client.fetch(`*[_type == "systemType" && !(_id in path("drafts.**"))]`)
  ]);

  // Filter subCategories - only show if they have NO children
  const sellableSubCategories = [];
  for (const sub of subCategories) {
    const hasSystemChildren = systemTypes.some((sys: any) => sys.parent?._ref === sub._id);
    const hasProductChildren = products.some((prod: any) => prod.subCategory?._ref === sub._id);
    
    if (!hasSystemChildren && !hasProductChildren) {
      sellableSubCategories.push(sub._id);
    }
  }

  // Filter systemTypes - only show if they have NO children  
  const sellableSystemTypes = [];
  for (const sys of systemTypes) {
    const hasVariantChildren = variants.some((variant: any) => variant.parent?._ref === sys._id);
    const hasProductChildren = products.some((prod: any) => prod.systemType?._ref === sys._id);
    
    if (!hasVariantChildren && !hasProductChildren) {
      sellableSystemTypes.push(sys._id);
    }
  }

  // All products and variants are always sellable
  const allSellableIds = [
    ...products.map((p: any) => p._id),
    ...variants.map((v: any) => v._id),
    ...sellableSubCategories,
    ...sellableSystemTypes
  ];

  return S.listItem()
    .title('All Products (Sellable Leaves)')
    .icon(() => '📦')
    .child(
      S.documentList()
        .title('Sellable Items (Verified)')
        .filter(`_id in $ids`)
        .params({ ids: allSellableIds })
        .defaultOrdering([{field: '_updatedAt', direction: 'desc'}])
    );
};
