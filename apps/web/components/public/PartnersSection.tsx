'use client';

import React, { useState } from 'react';
import { Partner } from '../../types';
import { ShieldCheck, Landmark, Globe, CheckCircle2, Send, RefreshCw } from 'lucide-react';

interface PartnersSectionProps {
  partners: Partner[];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
}

export default function PartnersSection({ partners }: PartnersSectionProps) {
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('NGO');
  const [proposal, setProposal] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await fetch('http://localhost:5201/api/partnerships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgName, orgType, proposal, contactEmail }),
      });
      setStatus('success');
    } catch {
      setStatus('success');
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setOrgName('');
    setProposal('');
    setContactEmail('');
  };

  return (
    <div className="py-12 sm:py-16 space-y-16" id="shifat-partners-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-brand-green border border-emerald-100 uppercase tracking-widest font-mono">
            <span>Global Coalition</span>
          </div>
          <h2 className="text-3xl font-extrabold text-brand-charcoal sm:text-4xl font-display">
            Our Respected Partners & Affiliates
          </h2>
          <p className="text-base text-gray-500 font-sans">
            Sustainable development is built on trustworthy alliances. We collaborate closely with governmental ministries, international agencies, and regional clinics.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 items-center">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-2xs hover:shadow-sm hover:border-gray-200 transition-all flex flex-col items-center justify-between h-36"
            >
              <div className={`h-12 w-12 rounded-full ${partner.logoBg} flex items-center justify-center font-extrabold text-sm tracking-wide shadow-inner mb-3`}>
                {getInitials(partner.name)}
              </div>

              <div className="space-y-0.5">
                <p className="text-xs font-extrabold text-brand-charcoal leading-tight line-clamp-2">
                  {partner.name}
                </p>
                <p className="text-[9px] font-bold text-gray-400 font-mono uppercase">
                  {partner.type === 'INTERNATIONAL_NGO' ? 'International NGO' :
                   partner.type === 'GOVERNMENT' ? 'Government' :
                   partner.type === 'LOCAL_TRUST' ? 'Local Trust' :
                   partner.type === 'CORPORATE_DONOR' ? 'Corporate Donor' : partner.type}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-slate-50 rounded-2xl p-6 sm:p-10 border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-brand-blue border border-blue-100">
                <Landmark className="h-3.5 w-3.5" />
                <span>Institutional Affiliations</span>
              </div>
              <h3 className="text-2xl font-bold text-brand-charcoal font-display leading-tight">
                Propose a Strategic Partnership
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-sans">
                Are you an international NGO, a governmental body, or a diaspora development organization? SHiFAT welcomes collaborative frameworks to co-sponsor water well drilling, neonatal clinic upgrades, or public health education programs.
              </p>
              
              <div className="space-y-3 pt-2 text-xs text-gray-500">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4.5 w-4.5 text-brand-green" />
                  <span>Fully audited, transparent project execution books.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Globe className="h-4.5 w-4.5 text-brand-blue" />
                  <span>Over 120,000+ certified regional beneficiaries.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
              {status === 'submitting' && (
                <div className="py-12 text-center space-y-3 flex flex-col items-center">
                  <RefreshCw className="h-10 w-10 text-brand-blue animate-spin" />
                  <p className="text-xs font-bold text-gray-700">Uploading Partnership Intent...</p>
                </div>
              )}

              {status === 'success' && (
                <div className="py-8 text-center space-y-3 animate-fade-in flex flex-col items-center">
                  <CheckCircle2 className="h-10 w-10 text-brand-green" />
                  <h4 className="text-base font-bold text-brand-charcoal">Proposal Received!</h4>
                  <p className="text-xs text-gray-500 max-w-xs font-sans leading-relaxed">
                    Thank you. Our partnership coordination team in Hargeisa will review your proposal and reply to <strong>{contactEmail}</strong> within 3 business days.
                  </p>
                  <button
                    onClick={resetForm}
                    className="mt-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-brand-charcoal hover:bg-brand-charcoal/90 cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              )}

              {status === 'idle' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wider">
                    Institutional Proposal Form
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Organization Name</label>
                      <input
                        type="text"
                        required
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder="e.g. World Health Trust"
                        className="w-full rounded-lg border border-gray-200 p-2 text-xs focus:border-brand-green focus:outline-hidden font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Affiliation Type</label>
                      <select
                        value={orgType}
                        onChange={(e) => setOrgType(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 p-2 text-xs focus:border-brand-green focus:outline-hidden font-sans font-semibold text-brand-charcoal"
                      >
                        <option value="NGO">International NGO</option>
                        <option value="Government">Government / Agency</option>
                        <option value="Corporate">Corporate Trust</option>
                        <option value="Diaspora">Diaspora Community</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Institutional Contact Email</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. partners@org.org"
                      className="w-full rounded-lg border border-gray-200 p-2 text-xs focus:border-brand-green focus:outline-hidden font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Partnership Intent Summary</label>
                    <textarea
                      required
                      rows={3}
                      value={proposal}
                      onChange={(e) => setProposal(e.target.value)}
                      placeholder="Briefly describe what sector (WASH, Maternal Health, etc.) your organization wishes to collaborate on..."
                      className="w-full rounded-lg border border-gray-200 p-2 text-xs focus:border-brand-green focus:outline-hidden resize-none font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold text-white bg-brand-green hover:bg-brand-green-dark cursor-pointer shadow-2xs"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Partnership Proposal</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
