'use client';

import React, { useState } from 'react';
import { Project } from '../../types';
import Image from 'next/image';
import { MapPin, CheckCircle, Flame, CalendarClock, Users, Globe } from 'lucide-react';

interface ProjectsSectionProps {
  projects: Project[];
}

const MAP_PINS = [
  { id: 'proj-1', name: 'Sheikh Mobile Clinic', lat: '45%', lng: '52%', city: 'Sheikh (Sahil)' },
  { id: 'proj-2', name: 'Salahlay Solar Well', lat: '65%', lng: '42%', city: 'Salahlay (Maroodi Jeeh)' },
  { id: 'proj-3', name: 'Burao Nutrition Hub', lat: '55%', lng: '65%', city: 'Burao Outskirts' },
  { id: 'proj-4', name: 'Erigavo Midwife Training', lat: '30%', lng: '80%', city: 'Erigavo (Sanaag)' },
  { id: 'proj-5', name: 'Gabilay Flood Outpost', lat: '58%', lng: '30%', city: 'Gabilay Valleys' }
];

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [highlightedProjectId, setHighlightedProjectId] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'maternal-child', name: 'Maternal Care' },
    { id: 'wash', name: 'WASH (Water)' },
    { id: 'nutrition', name: 'Nutrition' },
    { id: 'health-education', name: 'Health Training' },
    { id: 'emergency-relief', name: 'Emergency Relief' }
  ];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.programId === activeFilter);

  return (
    <div className="py-12 sm:py-16 space-y-16" id="shifat-projects-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-brand-blue border border-blue-100 uppercase tracking-widest font-mono">
            <span>Project Field Maps</span>
          </div>
          <h2 className="text-3xl font-extrabold text-brand-charcoal sm:text-4xl font-display">
            Realized Field Projects & Impact
          </h2>
          <p className="text-base text-gray-500 font-sans">
            Explore our continuous on-the-ground initiatives. Filter by developmental sector or click on our interactive schematic regional map pinpoints.
          </p>
        </div>

        <div className="bg-brand-charcoal rounded-2xl p-6 sm:p-8 text-white border border-gray-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950/40 text-brand-green border border-emerald-900/40">
                <Globe className="h-3.5 w-3.5" />
                <span>Horn of Africa Field Coordination</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display leading-tight">
                Interactive Regional Focus Pinpoints
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Our main field logistical assets are based in the high-density hubs of Hargeisa and Burao. Click any of the interactive project pins on the schematic map to highlight the corresponding detail card.
              </p>
              
              <div className="space-y-2 pt-2 text-xs">
                {MAP_PINS.map((pin) => (
                  <button
                    key={pin.id}
                    onClick={() => {
                      setHighlightedProjectId(pin.id);
                      const el = document.getElementById(pin.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      highlightedProjectId === pin.id
                        ? 'bg-brand-green/10 border-brand-green text-brand-green font-bold'
                        : 'bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${highlightedProjectId === pin.id ? 'bg-brand-green animate-ping' : 'bg-brand-blue'}`} />
                      <span>{pin.name}</span>
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono font-medium uppercase">{pin.city}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 flex justify-center">
              <div className="relative w-full aspect-16/10 bg-slate-900 rounded-xl border border-gray-800 overflow-hidden flex items-center justify-center p-4 shadow-inner">
                <svg className="absolute inset-0 h-full w-full opacity-10" viewBox="0 0 500 300" fill="none">
                  <path d="M 50 150 Q 150 100 250 120 T 450 60 L 500 300 L 0 300 Z" fill="#10b981" />
                  <path d="M 0 50 Q 200 150 500 50 L 500 0 L 0 0 Z" fill="#0284c7" />
                  <line x1="50" y1="0" x2="50" y2="300" stroke="white" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="150" y1="0" x2="150" y2="300" stroke="white" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="250" y1="0" x2="250" y2="300" stroke="white" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="350" y1="0" x2="350" y2="300" stroke="white" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="450" y1="0" x2="450" y2="300" stroke="white" strokeWidth="0.5" strokeDasharray="3 3" />
                </svg>

                <div className="absolute top-[58%] left-[24%] flex flex-col items-center">
                  <div className="h-4 w-4 bg-white text-brand-green rounded-full flex items-center justify-center shadow-lg ring-4 ring-brand-green/30 font-bold text-[8px] z-10 animate-pulse">
                    ★
                  </div>
                  <span className="text-[9px] font-bold text-white font-mono bg-brand-charcoal/80 px-1.5 py-0.5 rounded-sm border border-gray-700 mt-1 select-none">
                    Hargeisa HQ
                  </span>
                </div>

                {MAP_PINS.map((pin) => (
                  <button
                    key={pin.id}
                    onClick={() => {
                      setHighlightedProjectId(pin.id);
                      const el = document.getElementById(pin.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    style={{ top: pin.lat, left: pin.lng }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center cursor-pointer z-20"
                  >
                    <div className={`p-1.5 rounded-full shadow-lg transition-all ${
                      highlightedProjectId === pin.id 
                        ? 'bg-brand-green text-white ring-4 ring-brand-green/30 scale-120' 
                        : 'bg-brand-blue text-white hover:bg-brand-green hover:scale-110'
                    }`}>
                      <MapPin className="h-3 w-3" />
                    </div>
                    <span className="hidden sm:block absolute top-7 bg-brand-charcoal border border-gray-700 text-[8px] font-bold font-mono px-1.5 py-0.5 rounded-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-white">
                      {pin.name}
                    </span>
                  </button>
                ))}

                <div className="absolute bottom-3 left-3 flex gap-4 text-[9px] font-mono text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-white ring-2 ring-brand-green/40" />
                    <span>Headquarters</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                    <span>Relief Outpost</span>
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveFilter(cat.id);
                setHighlightedProjectId(null);
              }}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                activeFilter === cat.id
                  ? 'bg-brand-green border-brand-green text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              id={project.id}
              className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                highlightedProjectId === project.id
                  ? 'border-brand-green ring-4 ring-brand-green/10 shadow-lg scale-102'
                  : 'border-gray-100 shadow-xs'
              }`}
            >
              <div>
                <div className="h-44 overflow-hidden bg-gray-50 relative">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                    unoptimized={true}
                  />
                  
                  <span className={`absolute top-4 left-4 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white ${
                    project.status === 'Completed' ? 'bg-emerald-600' :
                    project.status === 'Ongoing' ? 'bg-brand-blue animate-pulse' :
                    'bg-amber-500'
                  }`}>
                    {project.status === 'Completed' ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Completed</span>
                      </span>
                    ) : project.status === 'Ongoing' ? (
                      <span className="flex items-center gap-1">
                        <Flame className="h-3 w-3 animate-bounce" />
                        <span>Ongoing Relief</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <CalendarClock className="h-3 w-3" />
                        <span>Planned Scope</span>
                      </span>
                    )}
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold font-mono text-brand-green flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{project.location}</span>
                    </span>
                    <h3 className="font-display text-base font-bold text-brand-charcoal leading-snug">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed font-sans line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="p-5 border-t border-gray-50 bg-slate-50/50 flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-50 text-brand-blue rounded-lg">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 block uppercase tracking-wider">Beneficiaries Assisted</span>
                  <span className="text-xs font-extrabold text-brand-charcoal">{project.beneficiaries}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
