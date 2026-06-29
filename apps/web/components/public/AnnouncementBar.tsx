'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5201/api';

interface Announcement {
  id: string;
  title: string;
  content: string;
  link?: string;
}

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [visible, setVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(`${API}/announcements/featured`)
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : [];
        setAnnouncements(items);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (announcements.length < 2) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const handleAdvance = () => {
    if (currentIndex < announcements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setVisible(false);
    }
  };

  if (!visible || announcements.length === 0) return null;

  const current = announcements[currentIndex];
  if (!current) return null;

  return (
    <div className="bg-gradient-to-r from-brand-blue to-blue-700 text-white text-[11px] sm:text-xs font-medium relative overflow-hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 min-w-0"
          >
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/20 text-[9px] font-bold uppercase tracking-wider">
              {current.title}
            </span>
            <span className="truncate">{current.content}</span>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-2 flex-shrink-0">
          {current.link && (
            <Link
              href={current.link}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/15 hover:bg-white/25 transition-colors text-[10px] font-bold uppercase"
            >
              Learn More <ExternalLink className="h-3 w-3" />
            </Link>
          )}

          {announcements.length > 1 && (
            <div className="flex items-center gap-1">
              {announcements.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}

          <button
            onClick={handleAdvance}
            className="p-0.5 rounded hover:bg-white/20 transition-colors cursor-pointer ml-2"
            aria-label="Advance or close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
