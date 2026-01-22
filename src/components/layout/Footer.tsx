'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, ShieldCheck, ArrowUp } from 'lucide-react';

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-900 relative overflow-hidden">
      {/* Subtle Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-900/50 to-transparent opacity-50"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-900/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-900/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center space-x-3 group" onClick={scrollToTop}>
              <div className="p-2 bg-red-900/10 rounded-lg group-hover:bg-red-900/20 transition-colors">
                 <ShieldCheck className="h-8 w-8 text-red-600" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight group-hover:text-red-500 transition-colors">NMarkFire</span>
            </Link>
            <p className="text-neutral-500 leading-relaxed max-w-sm text-base">
              Leading provider of advanced fire suppression systems and safety equipment. Protecting lives with precision engineering and certified technology.
            </p>
            <div className="flex gap-4 pt-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-500 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-red-600/20 hover:-translate-y-1">
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-red-600 rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-3 text-base">
              {['Home', 'About Us', 'Products', 'Services', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} 
                    className="flex items-center group text-neutral-400 hover:text-white transition-colors"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-red-600 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-red-600 rounded-full"></span>
              Core Products
            </h3>
            <ul className="space-y-3 text-base">
              {[
                { name: 'Fire Extinguishers', href: '/products/fire-extinguishers' },
                { name: 'Suppression Systems', href: '/products/fire-suppression-system' },
                { name: 'Hydrant Systems', href: '/products/hydrant-sprinkler-systems' },
                { name: 'Fall Protection', href: '/products/fall-protection-systems' }
              ].map((product) => (
                <li key={product.name}>
                  <Link href={product.href} className="flex items-center group text-neutral-400 hover:text-white transition-colors">
                     <span className="w-0 group-hover:w-2 h-[1px] bg-red-600 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                     {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
               <span className="w-1 h-5 bg-red-600 rounded-full"></span>
               Contact Us
            </h3>
            <ul className="space-y-6 text-base">
              <li className="flex items-start gap-4 group">
                <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center shrink-0 group-hover:bg-red-600/20 group-hover:text-red-500 transition-colors">
                   <MapPin className="h-4 w-4" />
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="block text-white font-semibold mb-1 text-xs uppercase tracking-wider text-opacity-70">Registered Office</span>
                    <span className="block text-neutral-400 leading-snug">
                      Plot No-B.73, Govind Park Society,<br />
                      Varachha Road, Surat-395006
                    </span>
                  </div>
                  <div>
                    <span className="block text-white font-semibold mb-1 text-xs uppercase tracking-wider text-opacity-70">Corporate Office</span>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=705,7th+Floor,APMC+Building,Krushi+Bazar,Ring+Road,Surat-395003"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-neutral-400 hover:text-white transition-colors leading-snug"
                    >
                      705, 7th Floor, APMC Building,<br />
                      Krushi Bazar, Ring Road, Surat-395003
                    </a>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center shrink-0 group-hover:bg-red-600/20 group-hover:text-red-500 transition-colors">
                   <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-white font-semibold mb-1 text-xs uppercase tracking-wider text-opacity-70">Contact Number</span>
                  <a href="tel:+919712067899" className="text-neutral-400 hover:text-white transition-colors block font-medium">+91 97120 67899</a>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center shrink-0 group-hover:bg-red-600/20 group-hover:text-red-500 transition-colors">
                   <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-white font-semibold mb-1 text-xs uppercase tracking-wider text-opacity-70">Email Us</span>
                  <a href="mailto:support@nmarkfire.com" className="text-neutral-400 hover:text-white transition-colors block font-medium">support@nmarkfire.com</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-900/50 bg-neutral-950 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-neutral-500">
          <p>&copy; {new Date().getFullYear()} NMarkFire. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy-policy" className="hover:text-red-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-red-500 transition-colors">Terms of Service</Link>
            <Link href="/sitemap" className="hover:text-red-500 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>

      {/* Scroll To Top Button */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-4 bg-red-600 text-white rounded-full shadow-2xl shadow-red-600/30 hover:bg-red-700 hover:scale-110 active:scale-95 transition-all duration-300 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </footer>
  );
}
