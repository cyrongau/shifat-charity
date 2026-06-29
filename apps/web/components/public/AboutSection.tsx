'use client';

import React, { useState } from 'react';
import { TeamMember } from '../../types';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Award, Compass, Eye, Heart, Target, Users, X, Mail, Globe, Sparkles } from 'lucide-react';
import PageHero from './PageHero';

interface AboutSectionProps {
  team: TeamMember[];
}

export default function AboutSection({ team }: AboutSectionProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const values = [
    {
      icon: <Heart className="h-6 w-6 text-brand-green" />,
      title: 'Compassion First',
      description: 'We believe premium healthcare is a fundamental human dignity. Every patient is treated with maximum empathy and care.'
    },
    {
      icon: <Target className="h-6 w-6 text-brand-blue" />,
      title: 'Grassroots Mobilization',
      description: 'Sustainable health relies on community consensus. We do not impose; we mobilize and train native residents to lead.'
    },
    {
      icon: <Award className="h-6 w-6 text-amber-500" />,
      title: 'Absolute Integrity',
      description: 'Stewardship of resources is sacred. We maintain transparent auditable ledger books for all donor contributions.'
    },
    {
      icon: <Users className="h-6 w-6 text-indigo-500" />,
      title: 'Inclusive Partnership',
      description: 'Collaborating with national ministries, international trusts, and local clan elders to generate lasting structures.'
    }
  ];

  return (
    <div className="space-y-16 pb-20" id="shifat-about-section">
      
      <PageHero
        pageKey="about"
        defaultImage="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=1600"
        badge="Our Core Story"
        title="Who We Are"
        description="Headquartered in Hargeisa, SHiFAT operates at the intersection of immediate emergency assistance and sustainable public health system development."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-brand-green uppercase tracking-widest font-mono">Foundations</span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-brand-charcoal font-display">
            What Drives Our Trust
          </h2>
          <p className="text-base text-gray-500 font-sans">
            Delivering healthcare is more than distribution—it's establishing mutual trust, deep community alignment, and long-term structures.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-gray-100 p-8 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 h-24 w-24 bg-emerald-50/50 rounded-bl-full" />
            <div className="flex items-center gap-3.5 mb-6">
              <div className="p-3 bg-emerald-50 text-brand-green rounded-xl">
                <Compass className="h-6 w-6 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-brand-charcoal font-display">Our Sacred Mission</h3>
            </div>
            <p className="text-gray-600 leading-relaxed font-sans text-base">
              To eliminate maternal mortality, provide clean sanitation, and mobilize rural communities across the Horn of Africa to take charge of their own healthcare. We deploy resources with precision, speed, and absolute financial integrity, ensuring those in remote pastoral regions are never left behind.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-gray-100 p-8 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 h-24 w-24 bg-blue-50/50 rounded-bl-full" />
            <div className="flex items-center gap-3.5 mb-6">
              <div className="p-3 bg-blue-50 text-brand-blue rounded-xl">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-brand-charcoal font-display">Our Future Vision</h3>
            </div>
            <p className="text-gray-600 leading-relaxed font-sans text-base">
              We envision a fully integrated, self-sustaining healthcare network where every mother has immediate access to certified birth wards, children are fully immunized against preventable pathogens, and drought-prone villages enjoy perpetual, solar-powered clean water streams.
            </p>
          </motion.div>

        </div>

        <div className="pt-8">
          <p className="text-center font-display text-xs font-bold uppercase tracking-widest text-gray-400">Our Core Operating Values</p>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -3 }}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-all"
              >
                <div className="mb-4">{value.icon}</div>
                <h4 className="font-bold text-brand-charcoal mb-2 font-display">{value.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-sans">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      <div className="bg-brand-sand border-t border-b border-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-xs font-bold text-brand-blue uppercase tracking-widest font-mono">Expert Personnel</span>
            <h2 className="text-3xl font-extrabold text-brand-charcoal font-display">
              Our Leadership & Medical Experts
            </h2>
            <p className="text-base text-gray-500 font-sans">
              Meet the dedicated humanitarian doctors, public health experts, and local mobilizers driving our field operations across Somaliland.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, idx) => (
              <motion.div 
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.min(idx * 0.1, 0.4) }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => setSelectedMember(member)}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 group cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-300"
                    unoptimized={true}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-xs font-bold text-white bg-brand-green px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                      Read Complete Bio
                    </span>
                  </div>
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    member.category === 'Leadership' ? 'bg-brand-blue text-white' :
                    member.category === 'Medical' ? 'bg-emerald-600 text-white' :
                    'bg-amber-500 text-white'
                  }`}>
                    {member.category}
                  </span>
                </div>

                <div className="p-5 space-y-1">
                  <h3 className="font-display text-lg font-bold text-brand-charcoal group-hover:text-brand-green transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">
                    {member.role}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2 pt-2 leading-relaxed font-sans">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute right-4 top-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
              aria-label="Close bio modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-5 h-64 md:h-full bg-gray-100 relative">
                <Image
                  src={selectedMember.imageUrl}
                  alt={selectedMember.name}
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
              </div>

              <div className="md:col-span-7 p-6 sm:p-8 space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-blue font-mono">
                    {selectedMember.category} Division
                  </span>
                  <h3 className="text-2xl font-extrabold text-brand-charcoal font-display">
                    {selectedMember.name}
                  </h3>
                  <p className="text-xs font-bold text-brand-green uppercase tracking-wider font-sans">
                    {selectedMember.role}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-600 leading-relaxed font-sans">
                    {selectedMember.bio}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4 flex flex-col gap-2.5 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{selectedMember.name.toLowerCase().replace(/[^a-z]/g, '')}@shifat.org</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span>Hargeisa HQ coordination office</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-bold text-white bg-brand-charcoal hover:bg-brand-charcoal/90 cursor-pointer"
                  >
                    Close Profile View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
