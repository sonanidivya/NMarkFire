import { notFound, permanentRedirect } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { defineQuery } from 'next-sanity';
import type { Metadata } from 'next';

// --- QUERIES ---
const PRODUCT_QUERY = defineQuery(`
  *[_type in ["product", "systemType", "variant"] && slug.current == $slug][0] {
    _id,
    _type,
    "slug": slug.current,
    name
  }
`);

export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string; productSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { productSlug } = await params;
  const item = await client.fetch(PRODUCT_QUERY, { slug: productSlug });

  if (!item) {
    return { title: 'Not Found | NMarkFire' };
  }

  return {
    title: `${item.name} | NMarkFire`,
  };
}

export default async function Page({ params }: PageProps) {
  const { productSlug } = await params;
  
  // 1. Fetch Item (Lightweight)
  const item = await client.fetch(PRODUCT_QUERY, { slug: productSlug });

  if (!item) {
    notFound();
  }

  // --- CANONICAL REDIRECT ---
  // We strictly enforce single-level URLs (/products/[slug]) for all product/variant types.
  // Any nested access (/products/[cat]/[item]) is permanently redirected.
  permanentRedirect(`/products/${item.slug}`);
}
