'use client';

import React, { useState } from 'react';
import { Program } from '../../types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';
import PageHero from './PageHero';

interface ProgramsSectionProps {
  programs: Program[];
}

export default function ProgramsSection({ programs }: ProgramsSectionProps) {
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const getIcon = (name: string) => {
    const IconComponent = (Icons as any)[name];
    if (!IconComponent) return <Icons.Heart className="h-6 w-6" />;
    return <IconComponent className="h-6 w-6" />;
  };

  const handleSupportProgramClick = (progId: string) => {
    setSelectedProgram(null);
    router.push('/donate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 pb-20" id="shifat-programs-section">
      
      <PageHero
        pageKey="programs"
        defaultImage="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1600"
        badge="6 Core Delivery Sectors"
        title="Our Programs"
        description="Delivering robust medical assistance, public health training, and infrastructure construction in communities requiring immediate, high-trust support."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-brand-green uppercase tracking-widest font-mono">Pillars of Action</span>
          <h2 className="text-3xl font-extrabold text-brand-charcoal font-display">6 Primary Focal Pillars</h2>
          <p className="text-sm text-gray-500 font-sans">
            We operate fully certified programs that cover key healthcare delivery challenges in Eastern Africa.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, idx) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(idx * 0.1, 0.4) }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="h-48 overflow-hidden bg-gray-50 relative">
                  <Image
                    src={program.imageUrl}
                    alt={program.title}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-300"
                    unoptimized={true}
                  />
                  <div className="absolute top-4 left-4 p-3 rounded-xl bg-white shadow-md text-brand-blue">
                    {getIcon(program.iconName)}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-brand-charcoal font-display group-hover:text-brand-blue transition-colors">
                    {program.title}
                  </h3>
                  
                  <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-brand-green border border-emerald-100 font-mono">
                    {program.impactStat}
                  </span>

                  <p className="text-sm text-gray-500 leading-relaxed font-sans line-clamp-3 pt-1">
                    {program.description}
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-50 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedProgram(program)}
                  className="text-xs font-bold text-brand-blue hover:text-brand-blue-dark hover:underline transition-colors cursor-pointer"
                >
                  Learn Detailed Scope →
                </button>

                <button
                  onClick={() => handleSupportProgramClick(program.id)}
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-green hover:bg-brand-green-dark rounded-full shadow-sm transition-all cursor-pointer"
                >
                  Support Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col">
            
            <div className="h-56 sm:h-64 relative bg-gray-100 shrink-0">
              <Image
                src={selectedProgram.imageUrl}
                alt={selectedProgram.title}
                fill
                className="object-cover"
                unoptimized={true}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <button
                onClick={() => setSelectedProgram(null)}
                className="absolute right-4 top-4 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer z-10"
                aria-label="Close details"
              >
                <Icons.X className="h-5 w-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3">
                <div className="p-3 bg-white text-brand-green rounded-xl hidden sm:block">
                  {getIcon(selectedProgram.iconName)}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-blue-light font-mono">
                    Official SHiFAT Focus Pillar
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                    {selectedProgram.title}
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto font-sans leading-relaxed text-gray-600">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <span className="text-xs font-mono font-bold text-gray-500 uppercase">
                  Audited program statistics:
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-brand-green border border-emerald-100 font-mono">
                  <Icons.Award className="h-4 w-4" />
                  <span>{selectedProgram.impactStat}</span>
                </span>
              </div>

              <div className="space-y-4">
                <h4 className="text-base font-bold text-brand-charcoal font-display">Program Scope & Delivery</h4>
                <p className="text-sm sm:text-base leading-relaxed text-gray-600">
                  {selectedProgram.longDescription}
                </p>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-gray-100 text-xs text-gray-700">
                <p className="font-bold text-brand-charcoal uppercase tracking-wider font-mono">Core Program Initiatives Included:</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 list-disc">
                  <li>Procurement of high-capacity medical storage</li>
                  <li>Sustained regional public advocacy workshops</li>
                  <li>Rehabilitation and conversion of shallow boreholes</li>
                  <li>Stipends for local certified clinical facilitators</li>
                  <li>Supply chain integrity in high-temperature environments</li>
                  <li>Transparent monthly compliance tracking report</li>
                </ul>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shrink-0">
              <p className="text-xs text-gray-500 font-sans max-w-sm">
                *Your donation to this focus area triggers direct earmarking of materials to respective clinical hubs.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="px-5 py-2 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Close Scope details
                </button>
                <button
                  onClick={() => handleSupportProgramClick(selectedProgram.id)}
                  className="px-6 py-2.5 rounded-lg text-xs font-bold text-white brand-gradient shadow-md transition-all cursor-pointer"
                >
                  Donate to this Program
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
