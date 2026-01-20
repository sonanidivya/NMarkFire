
import { FadeIn } from '@/components/animations/FadeIn';
import { client } from '@/sanity/lib/client';
import { TestimonialsCarousel } from './TestimonialsCarousel';

async function getTestimonials() {
  return await client.fetch(`
    *[_type == "testimonial" && isActive == true] | order(order asc) {
      _id,
      quote,
      rating,
      authorName,
      authorCompany,
      authorImage
    }
  `, {}, { next: { revalidate: 60 } })
}

export async function Testimonials() {
  const testimonials = await getTestimonials();

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-16 md:py-32 bg-slate-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <FadeIn>
                <div className="text-center mb-16 md:mb-20">
                    <div className="inline-block px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 mb-6 tracking-wider uppercase shadow-sm">Trusted Partners</div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">What Our Clients Say</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-xl leading-relaxed">Safety managers across industries rely on NMark for compliance and peace of mind.</p>
                </div>
            </FadeIn>
            
            <TestimonialsCarousel testimonials={testimonials} />
        </div>
    </section>
  );
}
