'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5201/api';

const ACCENT_COLORS = [
  'border-brand-green text-brand-green',
  'border-brand-blue text-brand-blue',
  'border-amber-500 text-amber-500',
];

const FALLBACK_SLIDES = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1600',
    tagline: 'Empowering Mothers, Protecting Futures',
    title: 'Transforming Maternal & Child Health',
    description: 'Operating state-of-the-art neonatal wards and mobile antenatal clinics to ensure safe deliveries in pastoral communities across the Horn of Africa.',
    ctaText: 'Support Maternal Wards',
    ctaLink: '/donate',
    secondaryCtaText: 'Learn More',
    secondaryCtaLink: '/programs',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1541256996761-85df2efaa164?auto=format&fit=crop&q=80&w=1600',
    tagline: 'Water is Health, Water is Dignity',
    title: 'Solar-Powered Clean Water Networks',
    description: 'Replacing obsolete infrastructure with high-efficiency solar water wells to eradicate waterborne pathogens in Togdheer and Sanaag.',
    ctaText: 'Fund a Solar Well',
    ctaLink: '/donate',
    secondaryCtaText: 'Learn More',
    secondaryCtaLink: '/programs',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1600',
    tagline: 'Immediate Support When Drought Strikes',
    title: 'Emergency Relief & Nutrition Outposts',
    description: 'Activating critical medical centers and rapid water distribution channels during severe, climate-induced resource shortages.',
    ctaText: 'Provide Critical Aid',
    ctaLink: '/donate',
    secondaryCtaText: 'Learn More',
    secondaryCtaLink: '/campaigns',
  },
];

interface HeroSlideData {
  imageUrl: string;
  tagline: string | null;
  title: string | null;
  description: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  secondaryCtaText: string | null;
  secondaryCtaLink: string | null;
}

export default function Hero() {
  const router = useRouter();
  const [slides, setSlides] = useState<HeroSlideData[]>(FALLBACK_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE}/hero-slides?pageKey=home`)
      .then((r) => r.json())
      .then((res) => {
        const items: HeroSlideData[] = res.data || [];
        if (items.length > 0) setSlides(items);
      })
      .catch(() => {});
  }, []);

  const current = slides[currentSlide];
  const accent = ACCENT_COLORS[currentSlide % ACCENT_COLORS.length];

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = current!;

  return (
    <section className="relative h-[550px] lg:h-[650px] w-full overflow-hidden bg-gray-900 text-white" id="shifat-hero">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0.3, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.3 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 h-full w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal via-brand-charcoal/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={slide.imageUrl}
            alt={slide.title || ''}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl lg:max-w-3xl space-y-6">
          {slide.tagline && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-2 rounded-full border bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-xs ${accent}`}
            >
              <span className="flex h-2 w-2 rounded-full bg-current animate-ping" />
              <span>{slide.tagline}</span>
            </motion.div>
          )}

          {slide.title && (
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl text-white"
            >
              {slide.title}
            </motion.h1>
          )}

          {slide.description && (
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed font-sans"
            >
              {slide.description}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
          >
            {slide.ctaText && (
              <button
                onClick={() => {
                  router.push(slide.ctaLink || '/donate');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-3.5 text-base font-extrabold text-white shadow-lg cursor-pointer transition-all duration-200 brand-gradient hover:shadow-xl active:scale-95"
              >
                <Heart className="h-5 w-5 fill-white" />
                <span>{slide.ctaText}</span>
              </button>
            )}

            {slide.secondaryCtaText && (
              <button
                onClick={() => {
                  router.push(slide.secondaryCtaLink || '/programs');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/80 px-8 py-3 text-base font-bold text-white hover:bg-white hover:text-brand-charcoal transition-all duration-200 cursor-pointer"
              >
                <span>{slide.secondaryCtaText}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 z-30 hidden -translate-y-1/2 rounded-full bg-black/40 p-2.5 text-white hover:bg-brand-green/80 transition-colors focus:outline-hidden lg:block cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 rounded-full bg-black/40 p-2.5 text-white hover:bg-brand-blue/80 transition-colors focus:outline-hidden lg:block cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-8 bg-brand-green' : 'w-2.5 bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
