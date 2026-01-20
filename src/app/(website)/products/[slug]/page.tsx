import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ChevronRight, Folder, Database, LayoutGrid, ArrowRight, ShieldCheck, Star, Zap, Box, Scale } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { defineQuery } from 'next-sanity';
import NextImage from 'next/image';
import type { Metadata } from 'next';
import { MAIN_CATEGORIES_NAV_QUERY } from '@/sanity/lib/queries';

// --- TYPES ---
interface HierarchyItem {
  _id: string;
  _type: 'mainCategory' | 'subCategory' | 'systemType' | 'variant' | 'product';
  name: string;
  slug: string;
  description: string;
  image?: Record<string, unknown>;
  // Parent refs
  parentMain?: { name: string; slug: string };
  parentSub?: { name: string; slug: string; parentMain?: { name: string; slug: string } };
  parentSystem?: { name: string; slug: string; parentSub?: { name: string; slug: string; parentMain?: { name: string; slug: string } } };
  // Children
  children?: HierarchyItem[]; 
  products?: Product[];
  // Features/Apps for System Type
  features?: ({title: string; description: string; icon?: string} | string)[];
  applications?: {name: string; image?: Record<string, unknown>}[];
  specifications?: {label: string, value: string}[];
  certifications?: string[];
  fullDescription?: string;
  hasVariants?: boolean;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: Record<string, unknown>;
  gallery?: Record<string, unknown>[];
  fullDescription?: string;
  certifications?: string[];
  features?: string[];
  specifications?: {label: string, value: string}[];
  applications?: {name: string; iconName?: string}[];
  mainCategory?: { name: string; slug: string };
  subCategory?: { name: string; slug: string };
}

// --- QUERIES ---

// 1. Fetch anything by slug to determine type
const RESOLVE_SLUG_QUERY = defineQuery(`
  *[slug.current == $slug && !(_id in path("drafts.**")) && _type in ["mainCategory", "subCategory", "systemType", "variant", "product"]] | order((_type != "product") desc)[0] {
    _id,
    _type,
    name,
    "slug": slug.current,
    description,
    image,
    
    // If it's a Main Category, fetch Sub Categories
    _type == "mainCategory" => {
      "children": *[_type == "subCategory" && parent._ref == ^._id] | order(displayOrder asc, _updatedAt desc) {
        _id,
        _type,
        name,
        "slug": slug.current,
        description,
        image
      }
    },

    // If it's a Sub Category, fetch System Types AND Standalone Products
    _type == "subCategory" => {
      "parentMain": parent->{name, "slug": slug.current},
      "children": *[_type == "systemType" && parent._ref == ^._id] | order(displayOrder asc, _updatedAt desc) {
        _id,
        _type,
        name,
        "slug": slug.current,
        description,
        image,
        features,
        applications,
        specifications,
        certifications,
        fullDescription
      },
      "products": *[_type == "product" && subCategory._ref == ^._id && !defined(systemType) && slug.current != ^.slug.current] {
        _id,
        name,
        "slug": slug.current,
        description,
        image
      }
    },

    // If it's a System Type, fetch Variants or Products
    _type == "systemType" => {
      features,
      applications,
      specifications,
      certifications,
      fullDescription,
      hasVariants,
      "parentSub": parent->{
        name, 
        "slug": slug.current,
        "parentMain": parent->{name, "slug": slug.current}
      },
      "children": *[_type == "variant" && parent._ref == ^._id] | order(displayOrder asc, _updatedAt desc) {
        _id,
        _type,
        name,
        "slug": slug.current,
        image
      },
      "products": *[_type == "product" && systemType._ref == ^._id && !defined(variant) && slug.current != ^.slug.current] {
        _id,
        name,
        "slug": slug.current,
        description,
        image
      }
    },

    // If it's a Variant (Treat exactly like a Product Page)
    _type == "variant" => {
      features,
      applications,
      specifications,
      certifications,
      fullDescription,
      "parentSystem": parent->{
        name, 
        "slug": slug.current,
        "parentSub": parent->{
            name,
            "slug": slug.current,
            "parentMain": parent->{name, "slug": slug.current}
        }
      },
      // Fetch products linked to this variant
      "products": *[_type == "product" && variant._ref == ^._id] {
        _id,
        name,
        "slug": slug.current,
        description,
        image,
        features,
        specifications,
        gallery,
        fullDescription,
        certifications,
        applications
      }
    },

    // If it's a Product
    _type == "product" => {
      mainCategory->{name, "slug": slug.current},
      subCategory->{name, "slug": slug.current},
      // Also fetch upwards if linked via System/Variant for breadcrumbs (optional/complex)
      gallery,
      fullDescription,
      certifications,
      features,
      specifications,
      applications
    }
  }
`);

export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await client.fetch<HierarchyItem>(RESOLVE_SLUG_QUERY, { slug });

  if (!item) {
    return { title: 'Not Found | NMarkFire' };
  }

  return {
    title: `${item.name} | NMarkFire`,
    description: item.description || `Browse ${item.name}`,
    openGraph: {
      images: item.image ? [urlFor(item.image).width(1200).height(630).url()] : [],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  
  // Parallel fetch: Item data + Nav Text
  const [item, navCategories] = await Promise.all([
    client.fetch<HierarchyItem>(RESOLVE_SLUG_QUERY, { slug }),
    client.fetch(MAIN_CATEGORIES_NAV_QUERY, {}, { next: { revalidate: 0 } })
  ]);

  if (!item) {
    notFound();
  }

  // --- RENDER: PRODUCT PAGE ---
  if (item._type === 'product') {
    const product = item as unknown as Product;
    
    // Stats for Premium Layout
    const stats = [
        { label: 'Warranty', value: '5 Years', icon: ShieldCheck },
        { label: 'Rating', value: '4.9/5', icon: Star },
        { label: 'Availability', value: 'In Stock', icon: Box },
        { label: 'Weight', value: 'Lightweight', icon: Scale },
    ];

    // Breadcrumbs Logic for Product
    const breadcrumbs = [{ name: 'Products', href: '/products' }];
    if (product.mainCategory) {
        breadcrumbs.push({ name: product.mainCategory.name, href: `/products/${product.mainCategory.slug}` });
    }
    if (product.subCategory) {
        breadcrumbs.push({ name: product.subCategory.name, href: `/products/${product.subCategory.slug}` });
    }

    return (
      <div className="min-h-screen bg-slate-50 font-sans selection:bg-red-100 selection:text-red-900">
        <Navbar categories={navCategories} />
        
        {/* --- HERO SECTION --- */}
        <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden bg-white">
          {/* Abstract Background Elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 skew-x-12 translate-x-1/2 z-0" />
          <div className="absolute top-20 right-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl z-0" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Left: Text Content */}
              <div className="order-2 lg:order-1 animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm font-medium text-slate-400 mb-8 flex-wrap gap-2">
                  {breadcrumbs.map((crumb, idx) => (
                    <div key={crumb.href} className="flex items-center">
                      {idx > 0 && <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />}
                      <Link href={crumb.href} className="hover:text-red-600 transition-colors uppercase tracking-wider text-xs">
                          {crumb.name.replace('-', ' ')}
                      </Link>
                    </div>
                  ))}
                  <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
                  <span className="text-red-600 uppercase tracking-wider text-xs font-bold bg-red-50 px-2 py-1 rounded-md">
                      {product.name}
                  </span>
                </nav>

                <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
                  {product.name}
                </h1>
                
                <div className="flex flex-wrap gap-3 mb-8">
                   {product.certifications?.slice(0, 3).map((cert, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-100">
                          <ShieldCheck className="w-4 h-4" /> {cert}
                      </span>
                   ))}

                </div>

                <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                   {product.description || "Experience superior fire protection with our advanced engineering. Designed for reliability, safety, and ease of use in critical situations."}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                   <Link href="/contact" className="inline-flex items-center justify-center bg-red-600 text-white px-8 py-5 rounded-2xl font-bold text-lg hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/20 hover:-translate-y-1 transition-all group">
                       Get a Quote
                       <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                   </Link>
                </div>
              </div>

              {/* Right: Immersive Image */}
              <div className="order-1 lg:order-2 flex justify-center perspective-1000">
                 <div className="relative w-full aspect-square max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-200">
                    <div className="absolute inset-4 bg-gradient-to-tr from-slate-200 to-slate-50 rounded-full blur-2xl opacity-50 animate-pulse-slow"></div>
                    {/* Floating Card Container */}
                    <div className="relative w-full h-full bg-white/40 backdrop-blur-sm border border-white/60 rounded-[3rem] shadow-2xl shadow-slate-300/50 flex items-center justify-center p-12 lg:p-20 group hover:scale-[1.02] transition-transform duration-500 ease-out-back">
                        {product.image ? (
                            <NextImage 
                                src={urlFor(product.image).url()} 
                                alt={product.name} 
                                fill
                                className="object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700"
                                priority
                            />
                        ) : (
                            <div className="text-center opacity-30">
                                <Box className="w-32 h-32 mx-auto mb-4" />
                                <p className="font-bold">No Image</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Floating tag */}
                    <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce-slow">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <Star className="w-6 h-6 text-red-600 fill-red-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase">Rating</p>
                            <p className="text-lg font-bold text-slate-900">Top Rated</p>
                        </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- STATS BAR --- */}
        <div className="bg-slate-900 text-white py-12 relative z-20 -mt-8 mx-4 lg:mx-8 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                            <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                            <p className="text-xl lg:text-2xl font-bold text-white group-hover:text-red-400 transition-colors">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
                
                {/* LEFT COLUMN (Details + Features) */}
                <div className="lg:col-span-12 xl:col-span-12 space-y-24">
                    
                    {/* 1. About Section */}
                    <section className="max-w-4xl mx-auto text-center">
                        <span className="text-red-600 font-bold tracking-widest uppercase text-sm mb-4 block">Product Overview</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8">Engineered for Excellence</h2>
                        <div className="prose prose-lg prose-slate mx-auto text-slate-600 leading-relaxed md:text-xl">
                             {product.fullDescription ? (
                                 <p>{product.fullDescription}</p>
                             ) : (
                                 <p>
                                     {product.description}
                                     <br className="mb-4 block" />
                                     Our commitment to quality ensures that every {product.name} unit meets rigorous safety standards. 
                                     Whether for industrial, commercial, or residential use, this product delivers unmatched performance and reliability when you need it most.
                                 </p>
                             )}
                        </div>
                    </section>

                    {/* 2. Key Features Layout (Card Grid) */}
                    {((product.features && product.features.length > 0) || (product.applications && product.applications.length > 0)) && (
                        <section className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
                            
                            {/* Advantages */}
                            {product.features && product.features.length > 0 && (
                               <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-100">
                                   <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                       <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                                           <Star className="w-5 h-5 fill-red-600" />
                                       </div>
                                       Key Advantages
                                   </h3>
                                   <div className="grid sm:grid-cols-1 gap-4">
                                       {product.features.map((feature, idx) => (
                                           <div key={idx} className="group p-4 hover:bg-slate-50 rounded-2xl transition-colors border-b border-slate-100 last:border-0 flex items-start gap-4">
                                                <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" />
                                                <div>
                                                    <span className="font-bold text-slate-800 text-lg group-hover:text-red-600 transition-colors block mb-1">Feature {idx + 1}</span>
                                                    <span className="text-slate-600 font-medium">{feature}</span>
                                                </div>
                                           </div>
                                       ))}
                                   </div>
                               </div>
                            )}

                               {/* Applications (Pill Design) */}
                            <div className="space-y-8">
                               {product.applications && product.applications.length > 0 && (
                                   <div className="bg-slate-900 text-white p-8 lg:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                                       {/* Background Graphic */}
                                       <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                       
                                       <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 relative z-10">
                                           <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                                               <LayoutGrid className="w-5 h-5 text-white" />
                                           </div>
                                           Ideal Applications
                                       </h3>
                                       
                                       <div className="flex flex-wrap gap-3 relative z-10">
                                           {product.applications.map((app, idx) => (
                                               <div key={idx} className="flex items-center gap-3 pl-2 pr-4 py-2 bg-white/10 hover:bg-red-600/90 backdrop-blur-md border border-white/10 rounded-full transition-all cursor-default group">
                                                   <div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold text-xs">
                                                       {idx+1}
                                                   </div>
                                                   <span className="font-medium text-sm md:text-base tracking-wide">
                                                       {app.name}
                                                   </span>
                                               </div>
                                           ))}
                                       </div>
                                   </div>
                               )}

                               {/* CTA Card if Apps exist, else it will just show this alone */}
                               <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-8 lg:p-10 rounded-[2.5rem] shadow-xl text-center">
                                   <h3 className="text-2xl font-bold mb-4">Ready to Order?</h3>
                                   <p className="text-red-100 mb-8">Contact our sales team for bulk pricing and custom configurations.</p>
                                   <Link href="/contact" className="inline-block bg-white text-red-600 px-8 py-3 rounded-xl font-bold hover:bg-red-50 transition-colors w-full">
                                       Contact Sales
                                   </Link>
                               </div>
                            </div>

                        </section>
                    )}

                    {/* 3. Tech Specs Table */}
                    <section className="bg-slate-50 rounded-[3rem] p-8 md:p-12 border border-slate-200/60">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-slate-900 mb-4 inline-flex items-center gap-3">
                                <Database className="w-8 h-8 text-red-600" />
                                Technical Specifications
                            </h3>
                            <p className="text-slate-500">Precise engineering data for {product.name}</p>
                        </div>

                        <div className="max-w-3xl mx-auto">
                            {product.specifications && product.specifications.length > 0 ? (
                                <div className="flex flex-col divide-y divide-slate-200">
                                    {product.specifications.map((spec, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-4 group hover:bg-slate-50/50 transition-colors px-4 rounded-lg">
                                            <span className="font-medium text-slate-500">{spec.label}</span>
                                            <span className="font-bold text-slate-900 text-right group-hover:text-red-700 transition-colors">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 border-dashed">
                                    <p className="text-slate-400 mb-4">Detailed technical specifications sheet available upon request.</p>
                                    <button className="text-red-600 font-bold hover:underline">Download Datasheet (PDF)</button>
                                </div>
                            )}
                        </div>
                    </section>
                    
                </div>
            </div>
        </div>
      </div>
    );
  }

  // --- AUTO-REDIRECT FOR SINGLE ITEM (Leaf Node Optimization) ---
  // If a category/system has exactly ONE item (either 1 system OR 1 product) and nothing else,
  // skip the listing page and go straight to that item.
  
  const childCount = item.children ? item.children.length : 0;
  const productCount = item.products ? item.products.length : 0;
  
  // Case 1: Single System Type (Child)
  if (childCount === 1 && productCount === 0) {
      const singleChild = item.children![0];
      // Construct URL: /products/current-slug/child-slug
      // Note: We use the current item's slug as the parent base.
      const redirectUrl = `/products/${item.slug}/${singleChild.slug}`;
      
                   // Perform server-side redirect
      const { redirect } = await import('next/navigation');
      redirect(redirectUrl);
  }

  // Case 2: Single Product (Leaf)
  if (childCount === 0 && productCount === 1) {
      const singleProduct = item.products![0];
      
      // Construct clearer URL: /products/main-category/product-slug
      // This avoids /products/same-name/same-name URLs
      let categorySlug = item.slug;

      // Try to find the Main Category slug for a better URL
      if (item._type === 'subCategory' && item.parentMain) {
          categorySlug = item.parentMain.slug;
      } else if (item._type === 'systemType' && item.parentSub?.parentMain) {
          // If parentSub.parentMain exists, use its slug (Top-level clean URL)
          categorySlug = item.parentSub.parentMain.slug;
      } else if (singleProduct.mainCategory?.slug) {
          // If we have the product's main category locally
          categorySlug = singleProduct.mainCategory.slug;
      }

      // If categorySlug is still null/undefined, fallback to current item slug
      if (!categorySlug) categorySlug = item.slug;

      // Check current path to prevent infinite redirect loop
      // logic: if we are already at /products/cat/prod, don't redirect.
      // But server-side here we are at /products/[slug]. 
      // The redirect target is /products/[categorySlug]/[productSlug]
      
      const redirectUrl = `/products/${categorySlug}/${singleProduct.slug}`;
      
      // Perform server-side redirect
      const { redirect } = await import('next/navigation');
      redirect(redirectUrl);
  }


  // --- RENDER: LEAF NODE (Generic Item treated as Product) ---
  // If it has no variants/children AND no sub-products, treat as a "Leaf" Product Page.
  // This rule applies even if "hasVariants" is checked but none exist yet.
  const isLeafChildren = item.children && item.children.length > 0;
  const isLeafProducts = item.products && item.products.length > 0;
  const isGenericLeaf = !isLeafChildren && !isLeafProducts;

  if (isGenericLeaf) {
    // Stats for Premium Layout
    const stats = [
        { label: 'Warranty', value: '5 Years', icon: ShieldCheck },
        { label: 'Rating', value: '4.9/5', icon: Star },
        { label: 'Availability', value: 'In Stock', icon: Box },
        { label: 'Weight', value: 'Lightweight', icon: Scale },
    ];

    // Breadcrumbs Logic for Leaf (Re-calculate since we are returning early)
    const breadcrumbs = [{ name: 'Products', href: '/products' }];
    if (item._type === 'subCategory' && item.parentMain) {
       breadcrumbs.push({ name: item.parentMain.name, href: `/products/${item.parentMain.slug}` });
    }
    if (item._type === 'systemType' && item.parentSub) {
       if (item.parentSub.parentMain) {
          breadcrumbs.push({ name: item.parentSub.parentMain.name, href: `/products/${item.parentSub.parentMain.slug}` });
       }
       breadcrumbs.push({ name: item.parentSub.name, href: `/products/${item.parentSub.slug}` });
    }

    return (
      <div className="min-h-screen bg-slate-50 font-sans selection:bg-red-100 selection:text-red-900">
        <Navbar categories={navCategories} />
        
        {/* --- HERO SECTION --- */}
        <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 skew-x-12 translate-x-1/2 z-0" />
          <div className="absolute top-20 right-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl z-0" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Left: Text Content */}
              <div className="order-2 lg:order-1 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <nav className="flex items-center text-sm font-medium text-slate-400 mb-8 flex-wrap gap-2">
                  {breadcrumbs.map((crumb, idx) => (
                    <div key={crumb.href} className="flex items-center">
                      {idx > 0 && <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />}
                      <Link href={crumb.href} className="hover:text-red-600 transition-colors uppercase tracking-wider text-xs">
                          {crumb.name.replace('-', ' ')}
                      </Link>
                    </div>
                  ))}
                  <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
                  <span className="text-red-600 uppercase tracking-wider text-xs font-bold bg-red-50 px-2 py-1 rounded-md">
                      {item.name}
                  </span>
                </nav>

                <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
                  {item.name}
                </h1>
                
                <div className="flex flex-wrap gap-3 mb-8">
                   {item.certifications?.slice(0, 3).map((cert, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-100">
                          <ShieldCheck className="w-4 h-4" /> {cert}
                      </span>
                   ))}

                </div>

                <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                   {item.description || "Detailed information coming soon."}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                   <Link href="/contact" className="inline-flex items-center justify-center bg-red-600 text-white px-8 py-5 rounded-2xl font-bold text-lg hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/20 hover:-translate-y-1 transition-all group">
                       Get a Quote
                       <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                   </Link>
                </div>
              </div>

              {/* Right: Immersive Image */}
              <div className="order-1 lg:order-2 flex justify-center perspective-1000">
                 <div className="relative w-full aspect-square max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-200">
                    <div className="absolute inset-4 bg-gradient-to-tr from-slate-200 to-slate-50 rounded-full blur-2xl opacity-50 animate-pulse-slow"></div>
                    <div className="relative w-full h-full bg-white/40 backdrop-blur-sm border border-white/60 rounded-[3rem] shadow-2xl shadow-slate-300/50 flex items-center justify-center p-12 lg:p-20 group hover:scale-[1.02] transition-transform duration-500 ease-out-back">
                        {item.image ? (
                            <NextImage 
                                src={urlFor(item.image).url()} 
                                alt={item.name} 
                                fill
                                className="object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700"
                                priority
                            />
                        ) : (
                            <div className="text-center opacity-30">
                                <Box className="w-32 h-32 mx-auto mb-4" />
                                <p className="font-bold">No Image</p>
                            </div>
                        )}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- STATS BAR --- */}
        <div className="bg-slate-900 text-white py-12 relative z-20 -mt-8 mx-4 lg:mx-8 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                            <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-white/50 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                            <p className="text-xl lg:text-2xl font-bold text-white group-hover:text-red-400 transition-colors">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
                
                {/* LEFT COLUMN (Details + Features) */}
                <div className="lg:col-span-12 xl:col-span-12 space-y-24">
                    
                    {/* 1. About Section */}
                    <section className="max-w-4xl mx-auto text-center">
                        <span className="text-red-600 font-bold tracking-widest uppercase text-sm mb-4 block">Product Overview</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8">About {item.name}</h2>
                        <div className="prose prose-lg prose-slate mx-auto text-slate-600 leading-relaxed md:text-xl">
                             {item.fullDescription ? (
                                 <p>{item.fullDescription}</p>
                             ) : (
                                 <p>{item.description}</p>
                             )}
                        </div>
                    </section>

                    {/* 2. Key Features Layout (Card Grid) */}
                    {((item.features && item.features.length > 0) || (item.applications && item.applications.length > 0)) && (
                        <section className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
                            
                            {/* Advantages (Object Based) */}
                            {item.features && item.features.length > 0 && (
                               <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-100">
                                   <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                       <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                                           <Star className="w-5 h-5 fill-red-600" />
                                       </div>
                                       Key Advantages
                                   </h3>
                                   <div className="grid sm:grid-cols-1 gap-4">
                                       {item.features.map((feature, idx) => (
                                           <div key={idx} className="group p-4 hover:bg-slate-50 rounded-2xl transition-colors border-b border-slate-100 last:border-0 flex items-start gap-4">
                                                <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" />
                                                <div>
                                                    <span className="font-bold text-slate-800 text-lg group-hover:text-red-600 transition-colors block mb-1">
                                                        {typeof feature === 'string' ? feature : feature.title}
                                                    </span>
                                                    {typeof feature !== 'string' && feature.description && (
                                                        <span className="text-slate-600 font-medium">{feature.description}</span>
                                                    )}
                                                </div>
                                           </div>
                                       ))}
                                   </div>
                               </div>
                            )}

                             {/* Applications (Pill Design) */}
                            <div className="space-y-8">
                               {item.applications && item.applications.length > 0 && (
                                   <div className="bg-slate-900 text-white p-8 lg:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                                       <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                       
                                       <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 relative z-10">
                                           <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                                               <LayoutGrid className="w-5 h-5 text-white" />
                                           </div>
                                           Ideal Applications
                                       </h3>
                                       
                                       <div className="flex flex-wrap gap-3 relative z-10">
                                           {item.applications.map((app, idx) => (
                                               <div key={idx} className="flex items-center gap-3 pl-2 pr-4 py-2 bg-white/10 hover:bg-red-600/90 backdrop-blur-md border border-white/10 rounded-full transition-all cursor-default group">
                                                   <div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold text-xs">
                                                       {idx+1}
                                                   </div>
                                                   <span className="font-medium text-sm md:text-base tracking-wide">
                                                       {app.name}
                                                   </span>
                                               </div>
                                           ))}
                                       </div>
                                   </div>
                               )}

                               <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-8 lg:p-10 rounded-[2.5rem] shadow-xl text-center">
                                   <h3 className="text-2xl font-bold mb-4">Ready to Order?</h3>
                                   <p className="text-red-100 mb-8">Contact our sales team for bulk pricing and custom configurations.</p>
                                   <Link href="/contact" className="inline-block bg-white text-red-600 px-8 py-3 rounded-xl font-bold hover:bg-red-50 transition-colors w-full">
                                       Contact Sales
                                   </Link>
                               </div>
                            </div>
                        </section>
                    )}

                    {/* 3. Tech Specs Table */}
                    <section className="bg-slate-50 rounded-[3rem] p-8 md:p-12 border border-slate-200/60">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-slate-900 mb-4 inline-flex items-center gap-3">
                                <Database className="w-8 h-8 text-red-600" />
                                Technical Specifications
                            </h3>
                            <p className="text-slate-500">Precise engineering data for {item.name}</p>
                        </div>

                        <div className="max-w-3xl mx-auto">
                            {item.specifications && item.specifications.length > 0 ? (
                                <div className="flex flex-col divide-y divide-slate-200">
                                    {item.specifications.map((spec, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-4 group hover:bg-slate-50/50 transition-colors px-4 rounded-lg">
                                            <span className="font-medium text-slate-500">{spec.label}</span>
                                            <span className="font-bold text-slate-900 text-right group-hover:text-red-700 transition-colors">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 border-dashed">
                                    <p className="text-slate-400 mb-4">Detailed technical specifications sheet available upon request.</p>
                                    <button className="text-red-600 font-bold hover:underline">Download Datasheet (PDF)</button>
                                </div>
                            )}
                        </div>
                    </section>
                    
                </div>
            </div>
        </div>
      </div>
    );
  }

  // --- RENDER: CATEGORY VIEW (Main, Sub, or System) ---
  // Determine Breadcrumbs based on hierarchy
  let breadcrumbs = [{ name: 'Products', href: '/products' }];
  
  if (item._type === 'subCategory' && item.parentMain) {
     breadcrumbs.push({ name: item.parentMain.name, href: `/products/${item.parentMain.slug}` });
  }
  if (item._type === 'systemType' && item.parentSub) {
     if (item.parentSub.parentMain) {
        breadcrumbs.push({ name: item.parentSub.parentMain.name, href: `/products/${item.parentSub.parentMain.slug}` });
     }
     breadcrumbs.push({ name: item.parentSub.name, href: `/products/${item.parentSub.slug}` });
  }

  // Variant Breadcrumbs (Deepest Level)
  if (item._type === 'variant' && item.parentSystem) {
     // 1. Main Category
     if (item.parentSystem.parentSub?.parentMain) {
        breadcrumbs.push({ name: item.parentSystem.parentSub.parentMain.name, href: `/products/${item.parentSystem.parentSub.parentMain.slug}` });
     }
     // 2. Sub Category
     if (item.parentSystem.parentSub) {
        breadcrumbs.push({ name: item.parentSystem.parentSub.name, href: `/products/${item.parentSystem.parentSub.slug}` });
     }
     // 3. System Type
     breadcrumbs.push({ name: item.parentSystem.name, href: `/products/${item.parentSystem.slug}` });
  }
  
  // Combine Children (Subcats/Systems) and Products
  const hasChildren = item.children && item.children.length > 0;
  const hasProducts = item.products && item.products.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar categories={navCategories} />
      <div className="pt-36 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm text-muted-foreground mb-8 flex-wrap gap-2">
            {breadcrumbs.map((crumb, i) => (
              <div key={crumb.href} className="flex items-center">
                 <Link href={crumb.href} className="hover:text-red-600 transition-colors font-medium">{crumb.name}</Link>
                 <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
              </div>
            ))}
            <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
               {item.name}
            </span>
          </nav>
          
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">{item.name}</h1>
            <p className="text-lg text-muted-foreground">{item.description}</p>
          </div>


          {/* Leaf Node View (No variants) - Treat as Product/Service Page */}
          {/* Strict Rule: Only show this if hasVariants is FALSE (or undefined/null which implies false) */}
          {false && ( // Logic replaced by isGenericLeaf block above
             <>
             <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mt-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Hero Image */}
                <div className="relative group">
                    <div className="rounded-[2.5rem] bg-gradient-to-br from-slate-50 to-white border border-slate-100 p-8 shadow-2xl shadow-slate-200/50 overflow-hidden">
                        <div className="relative aspect-square w-full flex items-center justify-center">
                        {item.image ? (
                            <NextImage 
                                src={urlFor(item.image as any).url()} 
                                alt={item.name} 
                                fill
                                className="object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                        ) : (
                            // Branded Fallback for Leaf Page
                            <div className="flex flex-col items-center justify-center">
                                <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                    <img src="/images/logo/black_mode.svg" alt="NMark" className="w-16 h-16 opacity-20 grayscale" />
                                </div>
                                <span className="text-slate-400 font-medium">Image Not Available</span>
                            </div>
                        )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col text-left">
                    <div className="h-1 w-20 bg-red-600 rounded-full mb-8"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                        About {item.name}
                    </h2>
                    <p className="text-lg text-slate-600 mb-10 leading-relaxed font-light">
                        {item.description || `Detailed information about ${item.name} is coming soon. Please contact us for specifications and ordering details.`}
                    </p>
                    
                <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/contact" className="inline-flex items-center justify-center bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 group">
                            Request Information
                            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
             </div>
             
             {/* EXTENDED CONTENT FOR LEAF NODE */}
             
             {/* 1. Full Description / Certs */}
             <div className="mb-24">
                 <div className="flex flex-col md:flex-row gap-12 items-start">
                     <div className="flex-1">
                        {(item.certifications?.length ?? 0) > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {(item.certifications ?? []).map((cert: string, idx: number) => (
                                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider border border-red-100">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> {cert}
                                    </span>
                                ))}
                            </div>
                        )}
                        <h3 className="text-3xl font-bold text-slate-900 mb-6">Product Details</h3>
                        <div className="prose prose-lg prose-slate text-slate-600 leading-relaxed">
                             {item.fullDescription ? (
                                <p>{item.fullDescription}</p>
                             ) : (
                                <p className="italic text-slate-500">
                                    {item.description}
                                    <br/><br/>
                                    Complete technical brochure and detailed operational manuals are available on request. Please contact our sales team for document packages.
                                </p>
                             )}
                        </div>
                     </div>
                     
                     {/* 2. Specs Side Table */}
                     <div className="w-full md:w-1/3 shrink-0">
                         <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                            <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Database className="w-5 h-5 text-red-600" />
                                Specifications
                            </h4>
                            
                            {(item.specifications?.length ?? 0) > 0 ? (
                                <div className="space-y-4">
                                    {(item.specifications ?? []).map((spec: any, idx: number) => (
                                        <div key={idx} className="flex flex-col border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-1">{spec.label}</span>
                                            <span className="text-sm font-semibold text-slate-900">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-slate-400 text-sm mb-4">Specific technical data is configured per project requirements.</p>
                                    <Link href="/contact" className="text-red-600 font-bold text-sm hover:underline">
                                        Request Spec Sheet
                                    </Link>
                                </div>
                            )}
                         </div>
                     </div>
                 </div>
             </div>

             {/* Combined Features & Applications Section (Leaf Node) */}
             {((item.features?.length ?? 0) > 0 || (item.applications?.length ?? 0) > 0) && (
                <section className="mb-24">
                     <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">
                        
                        {/* LEFT: Key Features (Advantages) */}
                        {(item.features?.length ?? 0) > 0 && (
                            <div className="lg:col-span-8">
                                <div className="mb-10">
                                    <span className="text-red-600 font-bold tracking-widest uppercase text-sm mb-2 block">Why Choose This?</span>
                                    <h3 className="text-3xl font-bold text-slate-900">Key Advantages</h3>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {(item.features ?? []).map((feature: any, idx: number) => (
                                        <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-red-100 shadow-sm hover:shadow-md transition-all group">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                    <CheckCircle2 className="w-5 h-5 text-red-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 mb-1 leading-tight">
                                                        {typeof feature === 'string' ? feature : feature.title}
                                                    </h4>
                                                    {typeof feature !== 'string' && feature.description && (
                                                        <p className="text-slate-500 text-xs leading-relaxed">
                                                            {feature.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* RIGHT: Ideal Applications (Simple List) */}
                        {(item.applications?.length ?? 0) > 0 && (
                             <div className="lg:col-span-4 lg:sticky lg:top-36">
                                <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl shadow-slate-200">
                                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                        <div className="p-2 bg-red-600 rounded-lg">
                                            <LayoutGrid className="w-5 h-5" />
                                        </div>
                                        Ideal Applications
                                    </h3>
                                    <div className="space-y-4">
                                        {(item.applications ?? []).map((app: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-red-600 transition-colors">
                                                    <span className="text-xs font-bold">{idx + 1}</span>
                                                </div>
                                                <span className="font-medium text-lg text-slate-200 group-hover:text-white transition-colors">
                                                    {app.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-10 pt-8 border-t border-white/10">
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Versatile protection for diverse environments.
                                        </p>
                                    </div>
                                </div>
                             </div>
                        )}
                     </div>
                </section>
             )}
             </>
          )}

          {/* Render Sub-Categories / System Types / Variants */}
          {/* Strict Rule: Show grid if hasChildren OR hasVariants=true (placeholder empty grid if no children yet) */}
          {(hasChildren || item.hasVariants) && (
             <div className="mb-20">
                <div className="flex items-center gap-4 mb-10">
                   <div className="h-10 w-2 bg-red-600 rounded-full"></div>
                   <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                      Explore {item.name}
                   </h2>
                </div>
                
                {/* Empty State for Variants */}
                {item.hasVariants && !hasChildren && (
                    <div className="bg-slate-50 rounded-2xl p-12 text-center border border-dashed border-slate-300">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Database className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Variants Coming Soon</h3>
                        <p className="text-slate-500">Specific variants for this system are being updated.</p>
                    </div>
                )}

                <div className={`grid gap-8 ${
                    item.children && item.children.length === 1 
                        ? 'grid-cols-1 max-w-md mx-auto' 
                        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                }`}>
                   {item.children && item.children.map((child) => (
                      <Link href={`/products/${child.slug}`} key={child._id} className="group block h-full">
                         <div className={`bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-red-100 transition-all duration-300 overflow-hidden h-full flex flex-col relative top-0 hover:-top-1 ${item.children!.length === 1 ? 'ring-1 ring-slate-100/50' : ''}`}>

                            {/* Card Image */}
                            <div className="h-56 relative bg-slate-50 border-b border-slate-50 flex items-center justify-center overflow-hidden group-hover:bg-white transition-colors">
                                {child.image ? (
                                    <NextImage 
                                      src={urlFor(child.image).url()} 
                                      alt={child.name} 
                                      fill
                                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                ) : (
                                    // Branded Fallback
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-red-50/20 flex flex-col items-center justify-center">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-red-100 rounded-full scale-150 opacity-20 animate-pulse"></div>
                                            <img src="/images/logo/black_mode.svg" alt="NMark" className="w-16 h-16 opacity-20 grayscale" />
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Card Content */}
                            <div className="p-8 flex flex-col flex-1">
                                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-red-600 transition-colors">
                                    {child.name}
                                </h3>
                                <div className="mb-8 flex-1">
                                    <p className="text-slate-500 text-base leading-relaxed font-light">
                                        {child.description || `Discover our range of ${child.name} engineered for superior fire protection.`}
                                    </p>
                                </div>
                                
                                <div className="mt-auto border-t border-slate-100 pt-4 flex flex-col gap-3">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Collection</span>
                                    <div className="flex items-center justify-between w-full text-red-600 font-bold text-sm tracking-wide group/btn">
                                        View Products
                                        <ArrowLeft className="w-4 h-4 rotate-180 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                         </div>
                      </Link>
                   ))}
                </div>
             </div>
          )}

          {/* Render Direct Products */}
          {hasProducts && (
             <div>
                {hasChildren && <div className="border-t border-slate-100 my-12"></div>}
                
                <h2 className="text-2xl font-bold mb-8 text-slate-900 flex items-center gap-2">
                   <LayoutGrid className="w-6 h-6 text-red-600" />
                   Products
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                   {item.products!.map((prod) => (
                      <Link href={`/products/${prod.slug}`} key={prod._id} className="group h-full">
                         <div className="rounded-2xl border bg-white border-slate-200 shadow-sm hover:shadow-xl hover:shadow-red-900/5 transition-all duration-300 overflow-hidden h-full flex flex-col">
                            <div className="aspect-[4/3] bg-slate-50 p-6 flex items-center justify-center relative overflow-hidden">
                               {prod.image ? (
                                 <NextImage 
                                   src={urlFor(prod.image).url()} 
                                   alt={prod.name} 
                                   fill
                                   className="object-contain p-2 hover:scale-105 transition-transform duration-500" 
                                 />
                               ) : (
                                 <span className="text-xs text-muted-foreground">Image Coming Soon</span>
                               )}
                            </div>
                           <div className="p-6 flex-1 flex flex-col">
                             <h3 className="text-lg font-bold mb-2 text-slate-900 group-hover:text-red-600 transition-colors">
                               {prod.name}
                             </h3>
                             <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-1">
                               {prod.description}
                             </p>
                             <div className="mt-auto pt-4 border-t border-slate-100 flex items-center text-red-600 font-semibold text-sm">
                                View Details <ArrowLeft className="w-4 h-4 ml-2 rotate-180 transition-transform group-hover:translate-x-1" />
                             </div>
                           </div>
                         </div>
                      </Link>
                   ))}
                </div>
             </div>
          )}
      </div>
      {/* Debug Data for Subagent Verification */}
      <div style={{ display: 'none' }} id="debug-data">
          {JSON.stringify(item, null, 2)}
      </div>
    </div>
  );
}
