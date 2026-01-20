'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Star, User } from 'lucide-react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

interface Testimonial {
    _id: string;
    quote: string;
    rating: number;
    authorName: string;
    authorCompany: string;
    authorImage?: any;
}

interface TestimonialsCarouselProps {
    testimonials: Testimonial[];
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ 
        loop: true, 
        align: 'center',
        containScroll: 'trimSnaps' 
    }, [
        Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
    ]);

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    return (
        <div className="relative group">
            {/* Full-width Breakout Container */}
            <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
                
                {/* Left Gradient Mask */}
                <div className="absolute inset-y-0 left-0 w-12 md:w-32 z-10 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none" />
                
                {/* Carousel Viewport */}
                <div className="px-4 md:px-8" ref={emblaRef}>
                    <div className="flex -ml-4 md:-ml-8 items-stretch">
                        {testimonials.map((testimonial) => (
                            <div 
                                key={testimonial._id} 
                                className="flex-[0_0_85%] md:flex-[0_0_450px] lg:flex-[0_0_500px] pl-4 md:pl-8 min-w-0 relative"
                            >
                                <div className="h-full p-8 sm:p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 relative flex flex-col select-none">
                                    <div className="flex gap-1 mb-6">
                                        {[...Array(testimonial.rating || 5)].map((_, j) => (
                                            <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-slate-600 mb-8 text-lg font-medium leading-relaxed italic z-10 flex-grow">
                                        &quot;{testimonial.quote}&quot;
                                    </p>
                                    
                                    <div className="flex items-center gap-4 pt-6 border-t border-slate-50 mt-auto">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden relative shrink-0">
                                            {testimonial.authorImage ? (
                                                <Image 
                                                    src={urlFor(testimonial.authorImage).url()} 
                                                    alt={testimonial.authorName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <User className="w-6 h-6 text-slate-400" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{testimonial.authorName}</div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">{testimonial.authorCompany}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Gradient Mask */}
                <div className="absolute inset-y-0 right-0 w-12 md:w-32 z-10 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />
                
                {/* Navigation Buttons (Desktop only) */}
                {/* Navigation Buttons (Desktop only) */}
                {scrollSnaps.length > 1 && (
                    <div className="hidden md:block">
                        <button 
                            onClick={scrollPrev}
                            className="absolute top-1/2 left-4 xl:left-8 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-red-600 hover:border-red-100 hover:scale-110 active:scale-95 transition-all outline-none z-20 group/btn"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button 
                            onClick={scrollNext}
                            className="absolute top-1/2 right-4 xl:right-8 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-red-600 hover:border-red-100 hover:scale-110 active:scale-95 transition-all outline-none z-20 group/btn"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                )}

            </div>

            {/* Pagination Dots (Mobile only) */}
            {/* Pagination Dots (Mobile only) */}
            {scrollSnaps.length > 1 && (
                <div className="flex justify-center gap-2 mt-8 md:hidden relative z-20">
                    {scrollSnaps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => emblaApi && emblaApi.scrollTo(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                index === selectedIndex ? "bg-red-600 w-6" : "bg-slate-300"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
