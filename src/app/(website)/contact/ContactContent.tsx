'use client';

import { useState } from 'react';
import { FadeIn } from '@/components/animations/FadeIn';
import { Mail, Phone, MapPin, Send, Globe2 } from 'lucide-react';

export function ContactContent() {
  return (
    <>
      {/* Hero Section - Matching Home/About Light Theme */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-red-100 mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default">
               <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
               </span>
               <span className="text-xs font-bold tracking-wider text-red-700 uppercase">24/7 Expert Support</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-tight text-slate-900">
              Let&apos;s Start a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">Safe Conversation.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12 font-normal">
              Have a question about our fire safety solutions? Our team of certified engineers is ready to assist you.
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Contact Info Side */}
          <FadeIn delay={0.2} direction="right">
            <div className="space-y-8">
               {/* Info Cards */}
               <div className="grid grid-cols-1 gap-6">
                  {[
                    { 
                      icon: Phone, 
                      title: "Sales & Support", 
                      content: "+91 97120 67899", 
                      sub: "Mon-Sat 9am to 7pm",
                      action: "Call Now",
                      href: "tel:+919712067899"
                    },
                    { 
                      icon: Mail, 
                      title: "Email Us", 
                      content: "support@nmarkfire.com", 
                      sub: "We reply within 2 hours",
                      action: "Send Email",
                      href: "mailto:support@nmarkfire.com"
                    },
                    { 
                      icon: MapPin, 
                      title: "Corporate HQ", 
                      content: "Surat, Gujarat, India", 
                      sub: "705, APMC Building, Krushi Bazar",
                      action: "Get Directions",
                      href: "https://www.google.com/maps/search/?api=1&query=705,7th+Floor,APMC+Building,Krushi+Bazar,Ring+Road,Surat-395003"
                    }
                  ].map((item, i) => (
                    <a 
                      key={i} 
                      href={item.href} 
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-start gap-6 p-8 rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 group"
                    >
                      <div className="p-4 rounded-2xl bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                         <item.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                         <h3 className="font-bold text-xl mb-1 text-slate-900 group-hover:text-red-600 transition-colors">{item.title}</h3>
                         <p className="text-slate-700 text-lg font-medium mb-1">{item.content}</p>
                         <p className="text-sm text-slate-400 font-medium uppercase tracking-wide">{item.sub}</p>
                      </div>
                      <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 text-slate-400 group-hover:border-red-200 group-hover:text-red-600 transition-all">
                         <ArrowRight className="w-4 h-4" />
                      </div>
                    </a>
                  ))}
               </div>

               {/* Map / Office Card */}
               <div className="p-10 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
                  <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                         <Globe2 className="w-6 h-6 text-red-500" />
                         <span className="text-sm font-bold uppercase tracking-widest text-slate-400">Global Reach</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Visit Our Facilities</h3>
                      <p className="text-slate-400 leading-relaxed mb-4 max-w-sm">
                        Experience our manufacturing excellence firsthand. Our state-of-the-art facility in Surat is open for partner visits.
                      </p>
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
                  <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
               </div>
            </div>
          </FadeIn>

          {/* Contact Form Side */}
          <FadeIn delay={0.4} direction="left">
            <div className="p-8 md:p-10 rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-50 to-orange-50 rounded-bl-[100%] opacity-50 -z-10"></div>
               <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Send us a Message</h3>
                  <p className="text-slate-500">Fill out the form below and we'll get back to you within 24 hours.</p>
               </div>
               <ContactForm />
            </div>
          </FadeIn>
          
        </div>
      </div>
    </>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    company: '' // Honeypot field
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'rate-limited'>('idle');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    // Honeypot check - if filled, return false but act like it worked (or just fail)
    if (formData.company) return false;

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';

    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[0-9+\-\s]{10,}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    
    // Block common spam domains
    const spamDomains = ['test.com', 'example.com', 'mail.ru'];
    if (formData.email.split('@')[1] && spamDomains.includes(formData.email.split('@')[1])) {
       newErrors.email = 'Please use a valid business email address';
    }

    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkRateLimit = () => {
    const lastSubmitted = localStorage.getItem('last_contact_submission');
    if (lastSubmitted) {
      const timeDiff = Date.now() - parseInt(lastSubmitted);
      // 5 minutes limit
      if (timeDiff < 5 * 60 * 1000) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Silent fail for honeypot
    if (formData.company) {
       setSubmitStatus('success'); 
       setFormData({ name: '', phone: '', email: '', message: '', company: '' });
       return;
    }

    if (!validate()) return;

    if (!checkRateLimit()) {
      setSubmitStatus('rate-limited');
      setTimeout(() => setSubmitStatus('idle'), 5000);
      return;
    }

    setIsSubmitting(true);
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to send message');
        }

        // Set rate limit timestamp
        localStorage.setItem('last_contact_submission', Date.now().toString());
        
        setSubmitStatus('success');
        setFormData({ name: '', phone: '', email: '', message: '', company: '' });
        
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitStatus('idle'), 5000);

    } catch (error) {
        console.error('Submission error:', error);
        // We could reuse 'rate-limited' styling or add a specific error state
        // For now, let's set a generic error status logic or alert
        alert('Failed to send message. Please try again later.'); // Simple fallback
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    if (errors[id]) {
        setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitStatus === 'success' && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          Message sent successfully. We&apos;ll be in touch!
        </div>
      )}
      
      {submitStatus === 'rate-limited' && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium animate-in fade-in slide-in-from-top-2">
           Please wait a few minutes before sending another message.
        </div>
      )}
      
      {/* Honeypot field - hidden from real users */}
      <div className="absolute opacity-0 -z-10 h-0 w-0 overflow-hidden">
        <input 
            type="text" 
            id="company" 
            tabIndex={-1} 
            value={formData.company}
            onChange={handleChange}
            autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-bold text-slate-700 ml-1">Name <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            id="name" 
            value={formData.name}
            onChange={handleChange}
            className={`flex h-14 w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-slate-900 focus:bg-white focus:ring-4 transition-all outline-none font-medium placeholder:font-normal ${
                errors.name 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-50' 
                : 'border-slate-200 focus:border-red-500 focus:ring-red-50 hover:border-slate-300'
            }`}
            placeholder="John Doe"
          />
          {errors.name && <p className="text-xs text-red-500 font-bold ml-1">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-bold text-slate-700 ml-1">Phone <span className="text-red-500">*</span></label>
          <input 
            type="tel" 
            id="phone" 
            value={formData.phone}
            onChange={handleChange}
            className={`flex h-14 w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-slate-900 focus:bg-white focus:ring-4 transition-all outline-none font-medium placeholder:font-normal ${
                errors.phone 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-50' 
                : 'border-slate-200 focus:border-red-500 focus:ring-red-50 hover:border-slate-300'
            }`}
            placeholder="+91..."
          />
          {errors.phone && <p className="text-xs text-red-500 font-bold ml-1">{errors.phone}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">Email <span className="text-red-500">*</span></label>
        <input 
          type="email" 
          id="email" 
          value={formData.email}
          onChange={handleChange}
          className={`flex h-14 w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-slate-900 focus:bg-white focus:ring-4 transition-all outline-none font-medium placeholder:font-normal ${
                errors.email 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-50' 
                : 'border-slate-200 focus:border-red-500 focus:ring-red-50 hover:border-slate-300'
          }`}
          placeholder="john@company.com"
        />
        {errors.email && <p className="text-xs text-red-500 font-bold ml-1">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-bold text-slate-700 ml-1">Message <span className="text-red-500">*</span></label>
        <textarea 
          id="message" 
          value={formData.message}
          onChange={handleChange}
          className={`flex min-h-[160px] w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-slate-900 focus:bg-white focus:ring-4 transition-all outline-none resize-none font-medium placeholder:font-normal ${
                errors.message 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-50' 
                : 'border-slate-200 focus:border-red-500 focus:ring-red-50 hover:border-slate-300'
          }`}
          placeholder="Tell us about your requirements..."
        />
        {errors.message && <p className="text-xs text-red-500 font-bold ml-1">{errors.message}</p>}
      </div>

      <button 
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center rounded-xl text-lg font-bold transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70 bg-red-600 text-white hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-red-600/30 h-14 px-8 mt-2"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'} 
        {!isSubmitting && <Send className="ml-2 h-5 w-5" />}
      </button>
    </form>
  );
}

// Icon for Success
function CheckCircle({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    )
}

function ArrowRight({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
    )
}
