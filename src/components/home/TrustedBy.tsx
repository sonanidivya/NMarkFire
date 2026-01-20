
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

// Fetch active partners
async function getTrustedPartners() {
  return await client.fetch(`
    *[_type == "trustedByItem" && isActive == true] | order(order asc) {
      _id,
      name,
      logo,
      link
    }
  `, {}, { next: { revalidate: 60 } }) // Cache for 1 min
}

export async function TrustedBy() {
  const partners = await getTrustedPartners()

  if (!partners || partners.length === 0) return null

  return (
    <section className="w-full py-20 bg-[#0A0A0A] border-t border-white/10 relative overflow-hidden">
      {/* Premium Spotlight Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center">
            
          <h3 className="text-sm font-semibold tracking-[0.25em] text-white/60 uppercase mb-16 text-center select-none font-manrope">
             Trusted By Industry Leaders
          </h3>

          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
            {partners.map((partner: any) => (
              <div 
                key={partner._id} 
                className="group relative flex flex-col items-center justify-center gap-4 transition-transform duration-500 hover:scale-110 cursor-pointer"
                title={partner.name}
              >
                {partner.link ? (
                  <Link href={partner.link} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3">
                     <div className="relative w-40 h-16 md:w-52 md:h-20 opacity-70 group-hover:opacity-100 transition-all duration-500 will-change-transform filter brightness-0 invert">
                        <PartnerLogo partner={partner} />
                     </div>
                     <span className="text-xs font-medium tracking-widest text-white/40 uppercase group-hover:text-white/80 transition-colors duration-500 font-manrope">
                        {partner.name}
                     </span>
                  </Link>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                     <div className="relative w-40 h-16 md:w-52 md:h-20 opacity-70 group-hover:opacity-100 transition-all duration-500 will-change-transform filter brightness-0 invert">
                        <PartnerLogo partner={partner} />
                     </div>
                     <span className="text-xs font-medium tracking-widest text-white/40 uppercase group-hover:text-white/80 transition-colors duration-500 font-manrope">
                        {partner.name}
                     </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PartnerLogo({ partner }: { partner: any }) {
    if (!partner.logo) {
        return (
            <div className="flex items-center justify-center w-full h-full border border-neutral-700 rounded bg-neutral-800 text-neutral-400 text-xs font-bold p-2 text-center">
                {partner.name}
            </div>
        )
    }

    return (
        <Image
          src={urlFor(partner.logo).url()}
          alt={partner.name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 128px, 160px"
        />
    )
}
