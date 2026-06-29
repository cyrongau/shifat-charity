'use client';

import React, { useState } from 'react';
import { Syringe, Baby, Heart, Droplet, ShieldAlert, Coins, TrendingUp } from 'lucide-react';

const REGION_DATA = {
  all: {
    vaccines: '250,000+',
    deliveries: '45,000+',
    waterBeneficiaries: '85,000+',
    emergencyPackages: '120,000+',
    description: 'Consolidated humanitarian reach across our 5 major focal regions in the Horn of Africa.'
  },
  maroodiJeeh: {
    vaccines: '80,000+',
    deliveries: '18,000+',
    waterBeneficiaries: '25,000+',
    emergencyPackages: '20,000+',
    description: 'Active programs around Hargeisa HQ and surrounding agricultural districts of Salahlay and Gabilay.'
  },
  togdheer: {
    vaccines: '75,000+',
    deliveries: '12,000+',
    waterBeneficiaries: '30,000+',
    emergencyPackages: '35,000+',
    description: 'Key vaccination camps, rural maternal outposts, and pastoral aid distribution around Burao.'
  },
  sanaag: {
    vaccines: '55,000+',
    deliveries: '9,000+',
    waterBeneficiaries: '20,000+',
    emergencyPackages: '45,000+',
    description: 'Focused borehole repairs and dry-season emergency water trucking to nomadic grazing routes.'
  },
  awdal: {
    vaccines: '40,000+',
    deliveries: '6,000+',
    waterBeneficiaries: '10,000+',
    emergencyPackages: '20,000+',
    description: 'Post-flood emergency medical relief, well chlorination campaigns, and school-based hygiene initiatives.'
  }
};

export default function ImpactStats() {
  const [selectedRegion, setSelectedRegion] = useState<keyof typeof REGION_DATA>('all');
  const activeData = REGION_DATA[selectedRegion];

  return (
    <div className="bg-white py-16 sm:py-24" id="shifat-impact-stats">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-brand-green border border-emerald-100">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Proven Community Impact</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-brand-charcoal">
            Our Work in Numbers
          </h2>
          <p className="text-base sm:text-lg text-gray-500 font-sans">
            Every dollar contributed and hour volunteered directly impacts lives on the ground. Select a region below to filter our certified impact statistics.
          </p>
        </div>

        {/* Region Selector Tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {[
            { id: 'all', name: 'All Regions' },
            { id: 'maroodiJeeh', name: 'Maroodi Jeeh (Hargeisa)' },
            { id: 'togdheer', name: 'Togdheer' },
            { id: 'sanaag', name: 'Sanaag' },
            { id: 'awdal', name: 'Awdal' },
          ].map((region) => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id as keyof typeof REGION_DATA)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all cursor-pointer ${
                selectedRegion === region.id
                  ? 'bg-brand-blue text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {region.name}
            </button>
          ))}
        </div>

        {/* Selected Region Description */}
        <p className="mt-4 text-center text-sm font-medium text-gray-500 font-mono">
          &ldquo;{activeData.description}&rdquo;
        </p>

        {/* Core Metric Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Card 1 */}
          <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-brand-sand p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-emerald-50 opacity-50" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-brand-green">
              <Syringe className="h-6 w-6" />
            </div>
            <p className="mt-6 text-3xl font-extrabold tracking-tight text-brand-charcoal">
              {activeData.vaccines}
            </p>
            <p className="mt-2 text-sm font-semibold text-gray-500 uppercase tracking-wider font-display">
              Vaccinations Administered
            </p>
            <p className="mt-1 text-xs text-gray-400 font-sans">
              Polio, Measles, & DPT protection delivered to remote routes.
            </p>
          </div>

          {/* Card 2 */}
          <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-brand-sand p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-blue-50 opacity-50" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-brand-blue">
              <Baby className="h-6 w-6" />
            </div>
            <p className="mt-6 text-3xl font-extrabold tracking-tight text-brand-charcoal">
              {activeData.deliveries}
            </p>
            <p className="mt-2 text-sm font-semibold text-gray-500 uppercase tracking-wider font-display">
              Safe Child Deliveries
            </p>
            <p className="mt-1 text-xs text-gray-400 font-sans">
              Assisted by midwives & ultrasound-equipped clinical wards.
            </p>
          </div>

          {/* Card 3 */}
          <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-brand-sand p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-sky-50 opacity-50" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
              <Droplet className="h-6 w-6" />
            </div>
            <p className="mt-6 text-3xl font-extrabold tracking-tight text-brand-charcoal">
              {activeData.waterBeneficiaries}
            </p>
            <p className="mt-2 text-sm font-semibold text-gray-500 uppercase tracking-wider font-display">
              WASH Water Access
            </p>
            <p className="mt-1 text-xs text-gray-400 font-sans">
              Villagers secured with solar pumped boreholes & hygiene packs.
            </p>
          </div>

          {/* Card 4 */}
          <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-brand-sand p-6 shadow-xs hover:shadow-md transition-shadow">
            <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-red-50 opacity-50" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <p className="mt-6 text-3xl font-extrabold tracking-tight text-brand-charcoal">
              {activeData.emergencyPackages}
            </p>
            <p className="mt-2 text-sm font-semibold text-gray-500 uppercase tracking-wider font-display">
              Relief Packs Distributed
            </p>
            <p className="mt-1 text-xs text-gray-400 font-sans">
              Drought food supplies, rehydration salts, & emergency shelters.
            </p>
          </div>

        </div>

        {/* Funding Allocation Breakdown Block */}
        <div className="mt-16 bg-slate-50 rounded-2xl p-6 sm:p-10 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-brand-blue border border-blue-100">
                <Coins className="h-3.5 w-3.5" />
                <span>Financial Integrity</span>
              </div>
              <h3 className="text-2xl font-bold text-brand-charcoal font-display">
                How Your Support is Allocated
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-sans">
                At SHiFAT, we take absolute pride in our stewardship of funds. Every single contribution is strictly auditable. Over 88% of our annual budget is funneled directly into program costs, purchasing live-saving medicine, drilling water holes, and running mobile outreach camps.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-xs bg-brand-green" />
                  <span className="text-xs font-bold text-gray-700">88% Direct Program Implementation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-xs bg-brand-blue" />
                  <span className="text-xs font-bold text-gray-700">8% Community Advocacy & Training</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-xs bg-gray-400" />
                  <span className="text-xs font-bold text-gray-700">4% General & Admin Oversight</span>
                </div>
              </div>
            </div>

            {/* Custom SVG Allocation Chart */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="relative w-full max-w-md bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
                <p className="text-xs font-bold text-gray-400 font-mono text-center uppercase tracking-wider mb-4">
                  Budget Stream Optimization
                </p>
                <div className="space-y-4">
                  {/* Row 1 */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                      <span>Medical Equipment, Drills & Emergency Logistics</span>
                      <span>88%</span>
                    </div>
                    <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-green rounded-full" style={{ width: '88%' }} />
                    </div>
                  </div>
                  {/* Row 2 */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                      <span>Midwifery & Field Health Worker Stipends</span>
                      <span>8%</span>
                    </div>
                    <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-blue rounded-full" style={{ width: '8%' }} />
                    </div>
                  </div>
                  {/* Row 3 */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                      <span>Governance, Auditing & Secure Gateway Management</span>
                      <span>4%</span>
                    </div>
                    <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-400 rounded-full" style={{ width: '4%' }} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-brand-green shrink-0">
                    <Heart className="h-5 w-5 fill-brand-green" />
                  </div>
                  <p className="text-xs text-gray-500 font-sans">
                    <strong>Somaliland Tax-Exemption Code:</strong> SL-SHF-2026/A. Contributions are eligible for international charitable deductions.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
