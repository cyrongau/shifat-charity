'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5201/api';

interface Slide {
  imageUrl: string;
}

interface PageHeroProps {
  pageKey: string;
  defaultImage: string;
  badge: string;
  title: string;
  description: string;
}

export default function PageHero({ pageKey, defaultImage, badge, title, description }: PageHeroProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/hero-slides?pageKey=${pageKey}`)
      .then((r) => r.json())
      .then((res) => {
        const slides: Slide[] = res.data || [];
        if (slides.length > 0 && slides[0]?.imageUrl) {
          setImageUrl(slides[0].imageUrl);
        }
      })
      .catch(() => {});
  }, [pageKey]);

  const bgImage = imageUrl || defaultImage;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-brand-charcoal py-24 px-4 sm:px-6 lg:px-8 text-white border-b border-gray-800">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />

      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-brand-green border border-emerald-500/30 uppercase tracking-widest font-mono"
        >
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>{badge}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-white leading-none"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-xl text-gray-300 font-sans max-w-2xl mx-auto leading-relaxed"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '80px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="h-1 bg-brand-green mx-auto rounded-full"
        />
      </div>
    </div>
  );
}
