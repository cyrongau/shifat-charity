'use client';

import React, { useState, useEffect } from 'react';
import { NewsItem } from '../../types';
import Image from 'next/image';
import { Calendar, User, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface NewsSectionProps {
  newsItems: NewsItem[];
}

export default function NewsSection({ newsItems }: NewsSectionProps) {
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [slideIndex, setSlideIndex] = useState(0);

  const sorted = [...newsItems].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const heroSlides = sorted.slice(0, 4);
  const featured = sorted.length > 4 ? sorted[4] : null;

  const categories = ['all', 'Announcement', 'Emergency', 'Campaign', 'Update'];
  const filteredNews = (activeCategory === 'all' ? sorted : sorted.filter(n => n.category === activeCategory))
    .filter((n) => n.id !== featured?.id);

  useEffect(() => {
    if (heroSlides.length < 2) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const slide = heroSlides[slideIndex];

  if (heroSlides.length === 0) {
    return <div className="py-12 text-center text-gray-400">No news articles available.</div>;
  }

  const currentSlide = heroSlides[slideIndex]!;

  return (
    <div className="space-y-12" id="shifat-news-section">
      {/* 1. Hero Slider */}
      <section className="relative h-[420px] lg:h-[500px] w-full overflow-hidden bg-gray-900 text-white">
        <div className="absolute inset-0">
          <Image
            src={currentSlide.imageUrl}
            alt={currentSlide.title}
              fill
              className="object-cover"
              unoptimized={true}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-green/85 via-brand-blue/70 to-brand-charcoal/50 z-10" />
          </div>

          <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl space-y-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                currentSlide.category === 'Emergency' ? 'bg-red-600' :
                currentSlide.category === 'Campaign' ? 'bg-brand-green' :
                currentSlide.category === 'Announcement' ? 'bg-brand-blue' :
                'bg-slate-700'
              }`}>
                {currentSlide.category}
              </span>
              <h1 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl text-white">
                {currentSlide.title}
              </h1>
              <p className="text-sm sm:text-base text-gray-300 line-clamp-2">{currentSlide.excerpt}</p>
              <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-brand-green" />
                  <span>{currentSlide.publishedAt}</span>
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-brand-blue" />
                  <span>BY: {(currentSlide.author?.fullName || 'Unknown').toUpperCase()}</span>
                </span>
              </div>
              <button
                onClick={() => setSelectedArticle(currentSlide)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-brand-green hover:bg-brand-green-dark transition-colors cursor-pointer mt-2"
              >
                Read Full Story <ArrowRight className="h-3.5 w-3.5" />
              </button>
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 2. Featured Post */}
        {featured && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="h-1 w-8 rounded-full bg-brand-green" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 font-mono">Featured Story</h2>
            </div>
            <div
              onClick={() => setSelectedArticle(featured)}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row cursor-pointer group"
            >
              <div className="md:w-2/5 h-64 md:h-auto bg-gray-50 relative">
                <Image src={featured.imageUrl} alt={featured.title} fill className="object-cover" unoptimized={true} />
                <span className={`absolute top-4 left-4 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white ${
                  featured.category === 'Emergency' ? 'bg-red-600' :
                  featured.category === 'Campaign' ? 'bg-brand-green' :
                  featured.category === 'Announcement' ? 'bg-brand-blue' : 'bg-slate-700'
                }`}>{featured.category}</span>
              </div>
              <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-center space-y-3">
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 font-mono">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-brand-green" /><span>{featured.publishedAt}</span></span>
                  <span className="flex items-center gap-1"><User className="h-3.5 w-3.5 text-brand-blue" /><span>BY: {(featured.author?.fullName || 'Unknown').toUpperCase()}</span></span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-brand-charcoal group-hover:text-brand-blue transition-colors font-display leading-snug">{featured.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-sans line-clamp-3">{featured.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue group-hover:underline pt-1">
                  Read Full Story <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </section>
        )}

        {/* 3. Section Header + Filter Buttons */}
        <section className="pb-16">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-brand-green border border-emerald-100 uppercase tracking-widest font-mono">
              <span>News Room</span>
            </div>
            <h2 className="text-3xl font-extrabold text-brand-charcoal sm:text-4xl font-display">
              News, Field Diaries & Announcements
            </h2>
            <p className="text-base text-gray-500 font-sans">
              Read direct stories from our mobile clinical officers, water technicians, and coordinators operating in remote zones.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center pb-6">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer uppercase ${
                  activeCategory === cat
                    ? 'bg-brand-blue border-brand-blue text-white shadow-xs'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                }`}>
                {cat === 'all' ? 'All Publications' : `${cat}s`}
              </button>
            ))}
          </div>

          {/* 4. Post Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {filteredNews.length === 0 && (
              <div className="col-span-2 text-center py-12 text-gray-400">No articles found for this category.</div>
            )}
            {filteredNews.map((article) => (
              <article key={article.id} onClick={() => setSelectedArticle(article)}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-pointer">
                <div>
                  <div className="h-56 overflow-hidden bg-gray-50 relative">
                    <Image src={article.imageUrl} alt={article.title} fill className="object-cover group-hover:scale-103 transition-transform" unoptimized={true} />
                    <span className={`absolute top-4 left-4 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white ${
                      article.category === 'Emergency' ? 'bg-red-600' :
                      article.category === 'Campaign' ? 'bg-brand-green' :
                      article.category === 'Announcement' ? 'bg-brand-blue' : 'bg-slate-700'
                    }`}>{article.category}</span>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 font-mono">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-brand-green" /><span>{article.publishedAt}</span></span>
                      <span className="flex items-center gap-1"><User className="h-3.5 w-3.5 text-brand-blue" /><span>BY: {(article.author?.fullName || 'Unknown').toUpperCase()}</span></span>
                    </div>
                    <h3 className="text-lg font-bold text-brand-charcoal group-hover:text-brand-blue transition-colors leading-snug font-display">{article.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans line-clamp-3">{article.excerpt}</p>
                  </div>
                </div>
                <div className="p-6 pt-0 flex justify-end">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:text-brand-blue-dark group-hover:underline">
                    Read Complete Update <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col">
            <button onClick={() => setSelectedArticle(null)}
              className="absolute right-4 top-4 z-10 p-2.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer">
              <X className="h-5 w-5" />
            </button>
            <div className="h-48 sm:h-56 bg-gray-100 shrink-0 relative">
              <Image src={selectedArticle.imageUrl} alt={selectedArticle.title} fill className="object-cover" unoptimized={true} />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-4 left-6">
                <span className="inline-block px-2.5 py-0.5 rounded-md text-[9px] font-bold bg-brand-green text-white uppercase tracking-wider font-mono">
                  {selectedArticle.category} publication
                </span>
              </div>
            </div>
            <div className="p-6 sm:p-8 space-y-4 overflow-y-auto">
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400 font-mono pb-2 border-b border-gray-100">
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-brand-green" /><span>PUBLISHED: {selectedArticle.publishedAt}</span></span>
                <span className="flex items-center gap-1"><User className="h-4 w-4 text-brand-blue" /><span>AUTHOR: {(selectedArticle.author?.fullName || 'Unknown').toUpperCase()}</span></span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-brand-charcoal font-display leading-tight">{selectedArticle.title}</h3>
              <p className="text-sm font-semibold text-gray-600 border-l-4 border-brand-blue pl-4 italic font-sans leading-relaxed">
                &ldquo;{selectedArticle.excerpt}&rdquo;
              </p>
              <p className="text-sm text-gray-600 leading-relaxed font-sans whitespace-pre-wrap">{selectedArticle.content}</p>
              <div className="bg-brand-sand border border-gray-100 rounded-xl p-4 text-xs text-gray-500 font-sans mt-6">
                <strong>SHiFAT Media & Publications Compliance:</strong> This field journal represents certified logs provided by on-site coordination desks. Photos and text descriptions are authorized by administrative boards in Hargeisa. For syndication permissions, email media@shifat.org.
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
              <button onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 rounded-lg text-xs font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                Close Reader View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
