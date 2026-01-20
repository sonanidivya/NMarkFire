'use client';

import { useRef, useState, useEffect } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { urlFor } from '@/sanity/lib/image';

interface CoreSolutionsProps {
  title?: string;
  description?: string;
  categories: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    image: Record<string, unknown>; // Keeping generic object for Sanity image
  }[];
}

export function CoreSolutions({ categories = [], title, description }: CoreSolutionsProps) {

  const defaultTitle = "Our Core Solutions";
  const defaultDescription = "Comprehensive protection for every risk. Click to explore detailed specifications and compliance ratings.";

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const displayCategories = (categories && categories.length > 0) ? categories : [{
      _id: 'placeholder',
      name: 'Categories Coming Soon',
      slug: '#',
      description: 'We are currently updating our product catalog. Check back soon for our full range of fire safety solutions.',
      image: null
  }];

  const shouldScroll = displayCategories.length > 3;

  // Auto-scroll effect logic for desktop marquee
  useEffect(() => {
    if (!shouldScroll) return;

    const scroll = () => {
      if (scrollContainerRef.current && !isPaused) {
        // Only auto-scroll on desktop where overflow-x is hidden (marquee mode)
        if (window.innerWidth >= 768) { 
            const container = scrollContainerRef.current;
            container.scrollLeft += 1;
            if (container.scrollLeft >= (container.scrollWidth / 3)) {
               container.scrollLeft = 0;
            }
        }
      }
    };
    const interval = setInterval(scroll, 20);
    return () => clearInterval(interval);
  }, [isPaused, shouldScroll]);

  return (
    <section className="py-12 md:py-20 bg-slate-50 overflow-hidden relative group/section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
           <FadeIn>
             <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">{title || defaultTitle}</h2>
             <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">
               {description || defaultDescription}
             </p>
           </FadeIn>
      </div>

      <div 
        className="relative w-full max-w-[2400px] mx-auto"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
         {/* Fade Gradients - Desktop Only (Only if scrolling) */}
         {shouldScroll && (
            <>
                <div className="hidden md:block absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
                <div className="hidden md:block absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
            </>
         )}
         
         {/* Controls (Only if scrolling) */}
         {shouldScroll && (
            <>
                <button 
                onClick={() => scrollContainerRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
                className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-4 rounded-full border border-slate-200 shadow-xl text-slate-900 transition-all opacity-0 group-hover/section:opacity-100 hover:scale-110"
                aria-label="Scroll Left"
                >
                <ChevronLeft className="h-8 w-8" />
                </button>
                
                <button 
                onClick={() => scrollContainerRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
                className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-4 rounded-full border border-slate-200 shadow-xl text-slate-900 transition-all opacity-0 group-hover/section:opacity-100 hover:scale-110"
                aria-label="Scroll Right"
                >
                <ChevronRight className="h-8 w-8" />
                </button>
            </>
         )}

         {/* Scroll Container */}
         <div 
           ref={scrollContainerRef}
           className={`flex flex-col md:flex-row overflow-visible md:overflow-x-hidden gap-8 py-4 px-4 items-stretch md:no-scrollbar ${!shouldScroll ? 'md:justify-center' : ''}`}
         >
            {/* Render items 3 times for desktop marquee, but only 1 set if not scrolling */}
            {[...Array(shouldScroll ? 3 : 1)].map((_, setIndex) => (
               <div 
                 key={setIndex} 
                 className={`flex-col md:flex-row gap-8 shrink-0 ${setIndex > 0 ? 'hidden md:flex' : 'flex'}`}
               >
                  {displayCategories.filter(item => item && item.slug).map((item: any, i) => {
                     // Dynamic Link Logic
                     let linkUrl = `/products/${item.slug}`;
                     if (item._type === 'variant' && item.parent?.slug) {
                         linkUrl = `/products/${item.parent.slug}/${item.slug}`;
                     }
                     // Fallback for empty descriptions
                     const desc = item.description || "View details for this solution.";

                     return (
                     <Link 
                       key={`${setIndex}-${i}`} 
                       href={linkUrl}
                       className="w-full md:w-[380px] shrink-0 group/card relative rounded-[2.5rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 overflow-hidden hover:-translate-y-1 block"
                     >
                        <div className="aspect-[4/3] bg-gradient-to-b from-slate-50 to-white relative overflow-hidden flex items-center justify-center p-4 border-b border-slate-100">
                           {/* Glow Effect */}
                           <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover/card:opacity-100"></div>

                           {item.image ? (
                              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm border border-slate-100 group-hover/card:shadow-md transition-all duration-500 bg-white p-2">
                                <NextImage 
                                    src={urlFor(item.image).url()} 
                                    alt={item.name}
                                    fill
                                    className="object-contain group-hover/card:scale-105 transition-transform duration-700" 
                                />
                              </div>
                           ) : (
                             <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
                                <span className="text-sm font-bold uppercase tracking-wider bg-slate-100 px-4 py-2 rounded-lg">Image Coming Soon</span>
                             </div>
                           )}
                        </div>
                        <div className="p-8">
                           <div className="font-bold text-2xl text-slate-900 mb-2 group-hover/card:text-red-600 transition-colors">{item.name}</div>
                           <p className="text-slate-500 text-lg font-medium line-clamp-2">{desc}</p>
                        </div>
                     </Link>
                  )})}
               </div>
            ))}
         </div>
      </div>
    </section>
  );
}
