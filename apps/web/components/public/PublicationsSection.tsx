'use client';

import React, { useState } from 'react';
import { Publication } from '../../types';
import Image from 'next/image';
import { motion } from 'motion/react';
import { FileText, Calendar, BookOpen, Download, Search, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import PageHero from './PageHero';

interface PublicationsSectionProps {
  publications: Publication[];
}

const CATEGORY_DISPLAY: Record<string, string> = {
  'All': 'All',
  'ANNUAL_REPORT': 'Annual Report',
  'RESEARCH_PAPER': 'Research Paper',
  'FIELD_REPORT': 'Field Report',
  'TRAINING_GUIDE': 'Training Guide',
  'POLICY_BRIEF': 'Policy Brief',
};

export default function PublicationsSection({ publications }: PublicationsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

  const categories = ['All', 'ANNUAL_REPORT', 'RESEARCH_PAPER', 'FIELD_REPORT', 'TRAINING_GUIDE', 'POLICY_BRIEF'];

  const filteredPublications = publications.filter((pub) => {
    const matchesCategory = selectedCategory === 'All' || pub.category === selectedCategory;
    const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pub.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (pubId: string, pubTitle: string) => {
    if (downloadingId || downloadedIds.includes(pubId)) return;
    
    setDownloadingId(pubId);
    
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadedIds((prev) => [...prev, pubId]);
      
      const element = document.createElement('a');
      const fileContent = `SHiFAT Publication: ${pubTitle}\nPublished Date: ${publications.find(p => p.id === pubId)?.publicationDate}\n\nThis is a certified digital report of SHiFAT (Somali Health Initiative For All Trust). All rights reserved.`;
      const file = new Blob([fileContent], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${pubTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500);
  };

  return (
    <div className="space-y-16 pb-20" id="shifat-publications-page">
      
      <PageHero
        pageKey="publications"
        defaultImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600"
        badge="Official Knowledge Portal"
        title="Publications"
        description="Research, reports, and resources from our work in the Horn of Africa."
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold text-brand-green uppercase tracking-widest font-mono">Knowledge Repository</span>
          <h2 className="text-3xl font-extrabold text-brand-charcoal font-display leading-tight">
            Reports & Research
          </h2>
          <p className="text-base text-gray-500 font-sans leading-relaxed">
            We are committed to <span className="bg-slate-200/60 px-1 py-0.5 rounded-sm font-semibold text-brand-charcoal">transparency and knowledge sharing</span>. Explore our published reports, research papers, and organizational documents.
          </p>
          <div className="h-[2px] w-12 bg-brand-green/60 mx-auto mt-4 rounded-full" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-brand-blue border-brand-blue text-white shadow-xs'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {cat === 'All' ? 'All Documents' : CATEGORY_DISPLAY[cat] || cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:border-brand-blue focus:outline-hidden"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-4">
          {filteredPublications.length > 0 ? (
            filteredPublications.map((pub, idx) => {
              const isDownloading = downloadingId === pub.id;
              const isDownloaded = downloadedIds.includes(pub.id);

              return (
                <motion.div
                  key={pub.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.4) }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between shadow-2xs hover:shadow-xs hover:border-gray-200 transition-all duration-300 group"
                >
                  
                  <div className="flex gap-4 items-start flex-grow">
                    
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-400 group-hover:text-brand-blue group-hover:bg-blue-50/30 transition-colors shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-white ${
                          pub.category === 'ANNUAL_REPORT' ? 'bg-indigo-600' :
                          pub.category === 'RESEARCH_PAPER' ? 'bg-emerald-600' :
                          pub.category === 'FIELD_REPORT' ? 'bg-amber-600' :
                          pub.category === 'TRAINING_GUIDE' ? 'bg-cyan-600' :
                          'bg-slate-600'
                        }`}>
                          {CATEGORY_DISPLAY[pub.category] || pub.category}
                        </span>

                        <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 font-mono">
                          <Calendar className="h-3 w-3 text-brand-green" />
                          <span>{pub.publicationDate}</span>
                        </span>

                        <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 font-mono">
                          <BookOpen className="h-3 w-3 text-brand-blue" />
                          <span>{pub.pages}</span>
                        </span>

                      </div>

                      <h3 className="text-base font-bold text-brand-charcoal font-display group-hover:text-brand-blue transition-colors">
                        {pub.title}
                      </h3>

                      <p className="text-xs text-gray-500 leading-relaxed font-sans max-w-3xl">
                        {pub.description}
                      </p>

                    </div>
                  </div>

                  <div className="w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 md:pl-4">
                    <button
                      onClick={() => handleDownload(pub.id, pub.title)}
                      disabled={isDownloading}
                      className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
                        isDownloaded 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : isDownloading
                          ? 'bg-blue-50 text-brand-blue border border-brand-blue/30 cursor-not-allowed'
                          : 'bg-white border border-gray-200 hover:border-brand-blue text-brand-charcoal hover:text-brand-blue hover:bg-blue-50/10 hover:shadow-2xs'
                      }`}
                    >
                      {isDownloaded ? (
                        <>
                          <CheckCircle className="h-4 w-4 animate-bounce" />
                          <span>Downloaded</span>
                        </>
                      ) : isDownloading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                          <span>Download Report</span>
                        </>
                      )}
                    </button>
                  </div>

                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-xl border border-gray-100 p-6 text-gray-400 space-y-3"
            >
              <AlertCircle className="h-8 w-8 mx-auto text-gray-300" />
              <h4 className="text-base font-bold text-brand-charcoal">No documents found</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                We couldn't find any report or research paper matching your current query. Try clearing filters or checking your spelling.
              </p>
            </motion.div>
          )}
        </div>

        <div className="bg-brand-sand/60 border border-dashed border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-4 items-start">
          <div className="p-2.5 bg-emerald-50 rounded-xl text-brand-green border border-emerald-100 shrink-0">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-brand-charcoal font-display">Our Standards for Transparency & Stewardship</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-sans">
              SHiFAT maintains strict alignment with international accounting standards and regional regulatory demands. The field summaries, clinical assessments, and audited project records displayed on this page are provided directly by operational coordination staff based at our headquarters near General Hospital in Hargeisa. For media inquiries or specific academic collaboration requests, contact us at <span className="font-semibold text-brand-blue">media@shifat.org</span>.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
