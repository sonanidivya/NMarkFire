'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { urlFor } from '@/sanity/lib/image';

interface NewTechnologyProps {
    items: any[];
}

export function NewTechnology({ items }: NewTechnologyProps) {
    if (!items || items.length === 0) return null;

    return (
        <section className="mx-4 md:mx-8 my-12 md:my-20 bg-[#050505] rounded-[2.5rem] md:rounded-[3.5rem] relative overflow-hidden shadow-2xl shadow-black/20">
            {/* Ambient Lighting Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-600/10 rounded-[100%] blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>

            <div className="px-6 py-12 md:p-16 relative z-10">
                <FadeIn>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-white/5 pb-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 backdrop-blur-sm">
                                <Sparkles className="w-2.5 h-2.5 text-red-500" />
                                <span>Future Ready</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-3 tracking-tight">
                                Innovations
                            </h2>
                            <p className="text-slate-400 max-w-lg text-base md:text-lg font-light leading-relaxed">
                                Pioneering the next generation of fire suppression engineering. 
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <Link 
                                href="/products#browse" 
                                className="group inline-flex items-center gap-3 text-white text-sm font-medium transition-all"
                            >
                                <span className="group-hover:text-red-400 decoration-red-500/30 underline-offset-8 transition-colors">View Catalog</span>
                                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-300">
                                    <ArrowRight className="w-3 h-3 group-hover:-rotate-45 transition-transform duration-300" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {items.map((item, index) => {
                        const productSlug = item.product?.slug;
                        const validSlug = productSlug || item.slug; 
                        const href = validSlug ? `/products/${validSlug}` : '#';
                        const image = item.product?.image || item.image;
                        const title = item.title || item.product?.name || item.name;
                        const desc = item.description;

                        return (
                            <FadeIn key={item._id} delay={index * 0.15} className="group">
                                <Link href={href} className="block relative h-full">
                                    {/* Glass Card Container */}
                                    <div className="relative h-full bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-3xl overflow-hidden hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 flex flex-col group-hover:shadow-[0_0_50px_-10px_rgba(220,38,38,0.1)]">
                                        
                                        {/* Image Header */}
                                        <div className="relative aspect-[16/10] w-full overflow-hidden p-6 flex items-center justify-center bg-gradient-to-b from-white/[0.02] to-transparent">
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 opacity-80"></div>
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                            {image && (
                                                <div className="relative z-0 w-full h-full transform group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-700 ease-out">
                                                     <Image
                                                        src={urlFor(image).url()}
                                                        alt={title}
                                                        fill
                                                        className="object-contain drop-shadow-xl"
                                                    />
                                                </div>
                                            )}
                                            
                                            {/* Badge */}
                                            <div className="absolute top-4 right-4 z-20">
                                                <div className="px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-md text-[9px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                                                    <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></div>
                                                    New
                                                </div>
                                            </div>
                                        </div>

                                        {/* Text Content */}
                                        <div className="p-6 flex flex-col flex-grow relative z-20 -mt-8">
                                            <div className="mb-2">
                                                <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-red-400 transition-colors line-clamp-2">
                                                    {title}
                                                </h3>
                                                <div className="h-0.5 w-8 bg-red-600 rounded-full group-hover:w-full transition-all duration-500 opacity-50"></div>
                                            </div>
                                            
                                            <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-2 font-light">
                                                {desc || "A masterpiece of engineering, designed to redefine safety standards."}
                                            </p>

                                            <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">
                                                    Spec
                                                </span>
                                                <div className="flex items-center gap-1 text-red-500 group-hover:translate-x-1 transition-transform">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Explore</span>
                                                    <ArrowRight className="w-2.5 h-2.5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </FadeIn>
                        );
                    })}
                </div>
                
                <div className="mt-8 md:hidden text-center">
                     <Link 
                        href="/products" 
                        className="inline-flex px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm font-bold items-center gap-2 hover:bg-white/10 transition-all active:scale-95"
                    >
                        View Full Catalog 
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
