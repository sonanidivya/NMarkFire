
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Database, 
  Download, 
  LayoutGrid, 
  ShieldCheck, 
  Star,
  Zap,
  Box,
  Scale
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { defineQuery } from 'next-sanity';
import NextImage from 'next/image';
import type { Metadata } from 'next';
import { MAIN_CATEGORIES_NAV_QUERY } from '@/sanity/lib/queries';

// --- QUERIES ---
const PRODUCT_QUERY = defineQuery(`
  *[_type in ["product", "systemType", "variant"] && slug.current == $slug][0] {
    _id,
    _type,
    name,
    "slug": slug.current,
    description,
    image,
    gallery,
    fullDescription,
    certifications,
    features,
    specifications,
    "applications": applications,
    
    // Breadcrumb & Context Mapping
    _type == "product" => {
      "mainCategory": mainCategory->{name, "slug": slug.current},
      "subCategory": subCategory->{name, "slug": slug.current}
    },
    _type == "systemType" => {
      "subCategory": parent->{name, "slug": slug.current},
      "mainCategory": parent->parent->{name, "slug": slug.current}
    },
    _type == "variant" => {
      "subCategory": parent->parent->{name, "slug": slug.current},
      "mainCategory": parent->parent->parent->{name, "slug": slug.current}
    }
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
    description: item.description || `Browse ${item.name}`,
    openGraph: {
      images: item.image ? [urlFor(item.image).width(1200).height(630).url()] : [],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug: categorySlug, productSlug } = await params;
  
  // 1. Fetch Product & Nav
  const [item, navCategories] = await Promise.all([
      client.fetch(PRODUCT_QUERY, { slug: productSlug }),
      client.fetch(MAIN_CATEGORIES_NAV_QUERY, {}, { next: { revalidate: 0 } })
  ]);

  if (!item) {
    notFound();
  }

  // --- BREADCRUMBS ---
  const breadcrumbs = [{ name: 'Products', href: '/products' }];
  
  if (item.mainCategory) {
      breadcrumbs.push({ name: item.mainCategory.name, href: `/products/${item.mainCategory.slug}` });
  } else if (categorySlug) {
      breadcrumbs.push({ name: categorySlug, href: `/products/${categorySlug}` });
  }

  if (item.subCategory) {
       breadcrumbs.push({ name: item.subCategory.name, href: `/products/${item.subCategory.slug}` });
  }

  // --- MOCK SPECS FOR VISUAL IF EMPTY (Can be removed later) ---
  const stats = [
    { label: 'Warranty', value: '5 Years', icon: ShieldCheck },
    { label: 'Rating', value: '4.9/5', icon: Star },
    { label: 'Availability', value: 'In Stock', icon: Box },
    { label: 'Weight', value: 'Lightweight', icon: Scale },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-red-100 selection:text-red-900">
      <Navbar categories={navCategories} />
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-white">
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
                   {item.name}
                </span>
              </nav>

              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
                {item.name}
              </h1>
              
              <div className="flex flex-wrap gap-3 mb-8">
                 {item.certifications?.slice(0, 3).map((cert: string, idx: number) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-100">
                        <ShieldCheck className="w-4 h-4" /> {cert}
                    </span>
                 ))}

              </div>

              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                 {item.description || "Experience superior fire protection with our advanced engineering. Designed for reliability, safety, and ease of use in critical situations."}
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
                           {item.fullDescription ? (
                               <p>{item.fullDescription}</p>
                           ) : (
                               <p>
                                   {item.description}
                                   <br className="mb-4 block" />
                                   Our commitment to quality ensures that every {item.name} unit meets rigorous safety standards. 
                                   Whether for industrial, commercial, or residential use, this product delivers unmatched performance and reliability when you need it most.
                               </p>
                           )}
                      </div>
                  </section>

                  {/* 2. Key Features Layout (Card Grid) */}
                  {(item.features?.length > 0 || item.applications?.length > 0) && (
                      <section className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
                          
                          {/* Advantages */}
                          {item.features && item.features.length > 0 && (
                             <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-100">
                                 <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                     <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                                         <Star className="w-5 h-5 fill-red-600" />
                                     </div>
                                     Key Advantages
                                 </h3>
                                 <div className="grid sm:grid-cols-1 gap-4">
                                     {item.features.map((feature: string, idx: number) => (
                                         <div key={idx} className="group p-4 hover:bg-slate-50 rounded-2xl transition-colors border-b border-slate-100 last:border-0 flex items-start gap-4">
                                              <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" />
                                              <div>
                                                  <span className="font-bold text-slate-800 text-lg group-hover:text-red-600 transition-colors block mb-1">
                                                    {(typeof feature === 'object' && (feature as any)?.title) ? (feature as any).title : `Feature ${idx + 1}`}
                                                  </span>
                                                  {/* Show description if available, or the feature string itself if it's a simple list */}
                                                  {(typeof feature === 'string' || (feature as any)?.description) && (
                                                      <span className="text-slate-600 font-medium">
                                                          {typeof feature === 'string' ? feature : (feature as any)?.description}
                                                      </span>
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
                                     {/* Background Graphic */}
                                     <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                     
                                     <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 relative z-10">
                                         <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                                             <LayoutGrid className="w-5 h-5 text-white" />
                                         </div>
                                         Ideal Applications
                                     </h3>
                                     
                                     <div className="flex flex-wrap gap-3 relative z-10">
                                         {item.applications.map((app: any, idx: number) => (
                                             <div key={idx} className="flex items-center gap-3 pl-2 pr-4 py-2 bg-white/10 hover:bg-red-600/90 backdrop-blur-md border border-white/10 rounded-full transition-all cursor-default group">
                                                 <div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center font-bold text-xs">
                                                     {idx+1}
                                                 </div>
                                                 <span className="font-medium text-sm md:text-base tracking-wide">
                                                     {typeof app === 'string' ? app : app?.name || ''}
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
                          <p className="text-slate-500">Precise engineering data for {item.name}</p>
                      </div>

                      <div className="max-w-3xl mx-auto">
                          {item.specifications && item.specifications.length > 0 ? (
                              <div className="flex flex-col divide-y divide-slate-200">
                                  {item.specifications.map((spec: any, idx: number) => (
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
