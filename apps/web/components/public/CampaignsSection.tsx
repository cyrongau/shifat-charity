'use client';

import React from 'react';
import { Campaign } from '../../types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, Target, Sparkles, Heart } from 'lucide-react';

interface CampaignsSectionProps {
  campaigns: Campaign[];
}

export default function CampaignsSection({ campaigns }: CampaignsSectionProps) {
  const router = useRouter();

  return (
    <div className="py-12 sm:py-16" id="shifat-campaigns-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-brand-green border border-emerald-100">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Fundraising Campaigns</span>
          </div>
          <h2 className="text-3xl font-extrabold text-brand-charcoal sm:text-4xl font-display">
            Active Healthcare Campaigns
          </h2>
          <p className="text-base text-gray-500 font-sans">
            Participate in our targeted resource mobilization drives. Every cent raised is directly tracked and converted into critical field material.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row"
            >
              <div className="md:w-2/5 h-56 md:h-auto bg-gray-100 relative shrink-0">
                <Image
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
                <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  campaign.status === 'Active' ? 'bg-emerald-600 text-white animate-pulse' :
                  campaign.status === 'Completed' ? 'bg-gray-600 text-white' :
                  'bg-brand-blue text-white'
                }`}>
                  {campaign.status}
                </span>
              </div>

              <div className="p-6 md:w-3/5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex flex-col gap-1 text-[11px] font-bold text-gray-400 font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-brand-green" />
                      <span>{campaign.region}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-brand-blue" />
                      <span>LAUNCHED: {campaign.startDate}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-brand-charcoal font-display leading-snug">
                    {campaign.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed font-sans line-clamp-3">
                    {campaign.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 space-y-3">
                  {campaign.status !== 'Upcoming' && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                        <span className="flex items-center gap-1">
                          <Target className="h-3.5 w-3.5 text-brand-blue" />
                          <span>Goal Progress</span>
                        </span>
                        <span>{campaign.progressPercentage}%</span>
                      </div>
                      
                      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-green rounded-full transition-all duration-500" 
                          style={{ width: `${campaign.progressPercentage}%` }} 
                        />
                      </div>

                      <div className="flex justify-between text-[11px] font-bold font-mono text-gray-500">
                        <span>RAISED: {campaign.currentRaised}</span>
                        <span>TARGET: {campaign.targetAmount}</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    {campaign.status === 'Active' ? (
                      <button
                        onClick={() => {
                          router.push(`/donate?campaign=${campaign.id}&campaignName=${encodeURIComponent(campaign.title)}`);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white brand-gradient shadow-xs hover:shadow-md cursor-pointer"
                      >
                        <Heart className="h-3.5 w-3.5 fill-white" />
                        <span>Donate to Campaign</span>
                      </button>
                    ) : campaign.status === 'Completed' ? (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg block text-center w-full">
                        Campaign Goal Met! Thank You 🎉
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-brand-blue bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg block text-center w-full">
                        Launching Soon! Stay Tuned
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
