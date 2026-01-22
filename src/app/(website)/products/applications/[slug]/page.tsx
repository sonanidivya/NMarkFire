import { client } from '@/sanity/lib/client';
import { PRODUCTS_BY_APPLICATION_QUERY } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { Navbar } from '@/components/layout/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight, Home, LayoutGrid } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';

export const revalidate = 60; 

// Helper to format slug to title
const formatSlug = (slug: string) => {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    
    // Future: We could fetch the actual 'application' document to get the real SEO title 
    // instead of just formatting the slug. For now, this is consistent with the request.
    const title = formatSlug(resolvedParams.slug);

    return {
        title: `${title} Fire Safety Solutions | NMark`,
        description: `Explore our certified fire suppression systems designed specifically for ${title}.`,
    };
}

export default async function ApplicationPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const title = formatSlug(resolvedParams.slug);

    // FETCH MATCHING PRODUCTS (Strict Match)
    // The query now handles all the complex logic (Variants/Leaf Nodes only)
    const products = await client.fetch(PRODUCTS_BY_APPLICATION_QUERY, { slug: resolvedParams.slug });

    // Fetch nav categories separately or reuse layout wrapper if available, 
    // for now we'll fetch them for the Navbar or pass empty if Navbar fetches internally (Navbar usually needs props)
    const navCategories = await client.fetch(`*[_type == "mainCategory" && showOnNav == true] | order(order asc) { _id, name, "slug": slug.current }`);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar categories={navCategories} />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                <FadeIn>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                        <Link href="/" className="hover:text-red-600 transition-colors"><Home className="w-4 h-4" /></Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href="/products" className="hover:text-red-600 transition-colors">Products</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="font-semibold text-slate-900">Applications</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-red-600 font-bold">{title}</span>
                    </div>

                    <div className="mb-12">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-4 border border-red-200">
                            Industry Application
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                            Solutions for <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">{title}</span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
                            Certified fire safety systems engineered specifically to protect {title.toLowerCase()} environments and critical assets.
                        </p>
                    </div>
                </FadeIn>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {products.map((product: any, idx: number) => {
                            // Determine link URL:
                            // Note: Our strict URL policy redirects /products/[parent]/[child] -> /products/[child-slug]
                            // The standardized, shortest link is /products/[slug]
                            let linkUrl = `/products/${product.slug}`;
                            
                            return (
                                <FadeIn key={product._id} delay={idx * 0.1}>
                                    <Link href={linkUrl} className="group block h-full">
                                        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-red-500/5 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                                            <div className="relative aspect-[4/3] mb-6 bg-slate-50 rounded-2xl flex items-center justify-center p-6 group-hover:bg-red-50/20 transition-colors">
                                                {product.image ? (
                                                     <Image
                                                        src={urlFor(product.image).url()}
                                                        alt={product.name}
                                                        fill
                                                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="text-center opacity-40">
                                                        <LayoutGrid className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                                                        <p className="text-xs font-bold text-slate-400">No Image</p>
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-2">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-grow">
                                                {product.description}
                                            </p>
                                            
                                            <div className="mt-auto border-t border-slate-50 pt-4 flex items-center justify-between">
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-red-500 transition-colors">
                                                    View Details
                                                </span>
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </FadeIn>
                            );
                        })}
                    </div>
                ) : (
                    <FadeIn>
                        <div className="bg-white rounded-[2rem] border border-slate-200 border-dashed p-12 text-center max-w-2xl mx-auto">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <LayoutGrid className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No specific products found for {title}</h3>
                            <p className="text-slate-500 mb-8">
                                We are currently updating our catalog for this application. Please check back soon or browse our full range.
                            </p>
                            <Link href="/products" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-slate-900 text-white font-bold hover:bg-red-600 transition-colors">
                                View Full Catalog <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    </FadeIn>
                )}
            </div>
        </div>
    );
}
