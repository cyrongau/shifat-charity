'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Camera, Calendar } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string | null;
  isFeatured: boolean;
  projectId: string | null;
  createdAt: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5201/api/gallery?limit=100&isActive=true')
      .then((res) => res.json())
      .then((data) => setItems(data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(items.map((i) => i.category).filter(Boolean) as string[])];

  const heroSlides = items.slice(0, 4);
  const featuredItems = items.filter((i) => i.isFeatured);
  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter((i) => i.category === activeCategory);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setSlideIndex((p) => (p + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent" />
      </div>
    );
  }

  const currentSlide = heroSlides[slideIndex];

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Slider - Documented Impact Projects */}
      {heroSlides.length > 0 && currentSlide && (
        <section className="relative h-[450px] lg:h-[550px] w-full overflow-hidden bg-gray-900 text-white">
          <div className="absolute inset-0">
            <Image
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              fill
              className="object-cover"
              unoptimized={true}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/90 via-brand-charcoal/60 to-transparent z-10" />
          </div>

          <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-brand-green uppercase tracking-wider">
                <Camera className="h-4 w-4" />
                <span>Documented Impact</span>
              </div>
              <h1 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                {currentSlide.title}
              </h1>
              <p className="text-sm sm:text-base text-gray-300 line-clamp-2">
                {currentSlide.description}
              </p>
              <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 font-mono">
                <Calendar className="h-3.5 w-3.5 text-brand-green" />
                <span>{new Date(currentSlide.createdAt).toLocaleDateString()}</span>
                {currentSlide.category && (
                  <span className="px-2 py-0.5 rounded bg-white/10 text-white">
                    {currentSlide.category}
                  </span>
                )}
              </div>
            </div>
          </div>

          {heroSlides.length > 1 && (
            <>
              <button onClick={() => setSlideIndex((p) => (p - 1 + heroSlides.length) % heroSlides.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 rounded-full bg-black/40 p-2 text-white hover:bg-brand-green/80 transition-colors cursor-pointer hidden lg:block">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={() => setSlideIndex((p) => (p + 1) % heroSlides.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 rounded-full bg-black/40 p-2 text-white hover:bg-brand-blue/80 transition-colors cursor-pointer hidden lg:block">
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {heroSlides.map((_, i) => (
                  <button key={i} onClick={() => setSlideIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      i === slideIndex ? 'w-8 bg-brand-green' : 'w-2 bg-white/40'
                    }`} />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* 2. Featured Gallery Section */}
      <section className="py-20 bg-brand-sand/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-charcoal">
            Our Work In Pictures
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Documenting Impact<br />
            Every photograph tells a story of resilience, dignity, and the transformative power of community-driven healthcare.
          </p>
        </div>

        {featuredItems.length > 0 && (
          <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.slice(0, 6).map((item) => (
                <div key={item.id} className="group relative overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized={true}
                    />
                    {item.category && (
                      <span className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/50 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-brand-charcoal group-hover:text-brand-blue transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. Filter + Gallery Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-brand-green text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Camera className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-bold">No gallery images found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredItems.map((item) => (
                <div key={item.id} className="group relative overflow-hidden rounded-xl bg-gray-50 border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized={true}
                    />
                    {item.isFeatured && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-amber-400 text-white text-[9px] font-bold">
                        Featured
                      </span>
                    )}
                    {item.category && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/50 text-white text-[9px] font-bold backdrop-blur-sm">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div className="p-3.5">
                    <h4 className="text-sm font-bold text-brand-charcoal leading-tight">{item.title}</h4>
                    <p className="mt-1 text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <p className="mt-1.5 text-[10px] text-gray-400 font-mono">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
