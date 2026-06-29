'use client';

import React, { useState, useEffect } from 'react';
import { Program } from '../../types';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  Heart, ShieldCheck, CheckCircle2, DollarSign, Smartphone,
  CreditCard, ChevronRight, Printer, RefreshCw, Banknote,
  Wallet, LogIn, UserPlus, Building2,
} from 'lucide-react';

interface DonateFormProps {
  programs?: Program[];
}

const PRESETS = [
  { amount: 15, label: '$15', desc: 'Safe birth & prenatal kits for 1 mother.' },
  { amount: 35, label: '$35', desc: '1 child\'s complete polio & measles immunization.' },
  { amount: 75, label: '$75', desc: 'Chlorinates & restores rural wells for 2 villages.' },
  { amount: 150, label: '$150', desc: 'RUTF therapeutic food for 2 malnourished children.' },
  { amount: 300, label: '$300', desc: 'Sponsors 1 local midwifery course scholarship.' },
];

export default function DonateForm({ programs }: DonateFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [selectedPreset, setSelectedPreset] = useState<number>(35);
  const [customAmount, setCustomAmount] = useState('');
  const [designation, setDesignation] = useState('general');
  const [donorType, setDonorType] = useState<'guest' | 'logged-in'>('guest');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'ZAAD' | 'EDAHAB' | 'PREMIER_WALLET' | 'CARD' | 'STRIPE' | 'BANK_TRANSFER'>('ZAAD');
  const [mobileNumber, setMobileNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [receiptData, setReceiptData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const campaign = searchParams.get('campaign');
    const campaignName = searchParams.get('campaignName');
    if (campaign) {
      setDesignation(campaign);
    }
  }, [searchParams]);

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedPreset;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount <= 0) { alert('Please select or input a valid donation amount.'); return; }
    setError('');
    setStatus('processing');

    try {
      const body: any = {
        amount: finalAmount,
        frequency: frequency === 'monthly' ? 'MONTHLY' : 'ONE_TIME',
        designation,
        paymentMethod,
        isAnonymous: donorType === 'guest' ? true : isAnonymous,
        campaignId: designation !== 'general' ? designation : undefined,
        donorName: donorType === 'guest' && !isAnonymous ? name : undefined,
        donorEmail: donorType === 'guest' && !isAnonymous ? email : undefined,
      };

      const res = await fetch('http://localhost:5201/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Donation failed' }));
        throw new Error(err.message || 'Donation failed');
      }

      const donation = await res.json();
      setReceiptData(donation);
      setStatus('success');
    } catch (err: any) {
      setError(err.message);
      setStatus('idle');
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setCustomAmount('');
    setSelectedPreset(35);
    setMobileNumber('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setError('');
    setReceiptData(null);
  };

  const paymentMethods = [
    { key: 'ZAAD', label: 'ZAAD Service', sub: 'Telesom Mobile', icon: Smartphone, color: 'green' },
    { key: 'EDAHAB', label: 'e-Dahab', sub: 'Somtel Mobile', icon: Smartphone, color: 'blue' },
    { key: 'PREMIER_WALLET', label: 'Premier Wallet', sub: 'Premier Bank', icon: Wallet, color: 'purple' },
    { key: 'CARD', label: 'Credit / Debit', sub: 'Visa & Mastercard', icon: CreditCard, color: 'gray' },
    { key: 'STRIPE', label: 'Stripe', sub: 'Online Payment', icon: Banknote, color: 'indigo' },
    { key: 'BANK_TRANSFER', label: 'Bank Transfer', sub: 'Direct Deposit', icon: Building2, color: 'amber' },
  ];

  const colorMap: Record<string, string> = {
    green: 'border-brand-green bg-emerald-50/20 ring-brand-green/10 text-brand-green',
    blue: 'border-brand-blue bg-blue-50/20 ring-brand-blue/10 text-brand-blue',
    purple: 'border-purple-500 bg-purple-50/20 ring-purple-500/10 text-purple-600',
    gray: 'border-gray-400 bg-gray-50 ring-gray-400/10 text-gray-600',
    indigo: 'border-indigo-500 bg-indigo-50/20 ring-indigo-500/10 text-indigo-600',
    amber: 'border-amber-500 bg-amber-50/20 ring-amber-500/10 text-amber-600',
  };

  return (
    <div className="mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8" id="shifat-donation-gateway">
      <div className="text-center space-y-4 mb-10">
        <h2 className="text-3xl font-extrabold text-brand-charcoal font-display">Support Our Lifesaving Mission</h2>
        <p className="text-base text-gray-500 max-w-2xl mx-auto font-sans">
          Make a tax-deductible contribution to SHiFAT. 100% of your gift is securely handled, and 88% goes directly to field medical resources.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="brand-gradient px-6 py-4 flex items-center justify-between text-white text-xs font-bold uppercase tracking-wider font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Secure 256-Bit SSL Secured Gateway</span>
          </div>
          <span className="hidden sm:inline bg-white/10 px-3 py-1 rounded-full">REGISTRATION: SL-SHF-2026/A</span>
        </div>

        {status === 'processing' && (
          <div className="py-24 px-6 text-center space-y-4 flex flex-col items-center justify-center">
            <RefreshCw className="h-12 w-12 text-brand-blue animate-spin" />
            <h3 className="text-xl font-bold text-gray-800 font-display">Processing Secure Contribution</h3>
            <p className="text-sm text-gray-500 max-w-md font-sans">
              Communicating with payment gateway... Please do not close or reload this window.
            </p>
          </div>
        )}

        {status === 'success' && receiptData && (
          <ReceiptView
            receipt={receiptData}
            isAnonymous={isAnonymous}
            donorName={name}
            donorEmail={email}
            onReset={resetForm}
            paymentMethod={paymentMethod}
            frequency={frequency}
          />
        )}

        {status === 'idle' && (
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
            <Step number={1} title="Select Contribution Amount">
              <div className="flex justify-center p-1 bg-gray-100 rounded-lg max-w-xs mx-auto">
                <ToggleBtn active={frequency === 'one-time'} onClick={() => setFrequency('one-time')}>Give Once</ToggleBtn>
                <ToggleBtn active={frequency === 'monthly'} onClick={() => setFrequency('monthly')}>Sponsor Monthly</ToggleBtn>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {PRESETS.map((preset) => (
                  <button key={preset.amount} type="button" onClick={() => { setSelectedPreset(preset.amount); setCustomAmount(''); }}
                    className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between cursor-pointer ${selectedPreset === preset.amount && !customAmount ? 'border-brand-green bg-emerald-50/50 shadow-xs ring-2 ring-brand-green/20' : 'border-gray-200 hover:border-gray-300'}`}>
                    <span className="text-lg font-extrabold text-brand-charcoal block mb-1">{preset.label}</span>
                    <span className="text-[10px] text-gray-500 leading-tight font-sans">{preset.desc}</span>
                  </button>
                ))}
              </div>
              <div className="relative max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">$</span>
                <input type="number" min="5" max="50000" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setSelectedPreset(0); }}
                  placeholder="Custom Amount (USD)"
                  className="w-full rounded-xl border border-gray-200 py-3.5 pl-8 pr-4 text-sm font-bold text-brand-charcoal placeholder-gray-400 focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:outline-hidden" />
              </div>
            </Step>

            <Step number={2} title="Designate Your Contribution">
              <select value={designation} onChange={(e) => setDesignation(e.target.value)}
                className="w-full sm:max-w-md rounded-xl border border-gray-200 p-3.5 text-sm font-semibold text-brand-charcoal focus:border-brand-green focus:outline-hidden">
                <option value="general">General Emergency Fund (Most Urgent Need)</option>
                {programs?.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
                <option value="maternal-child">Maternal & Child Health Wards</option>
                <option value="emergency-relief">Emergency Relief Operations</option>
                <option value="wash">WASH (Clean Water Wells & Sanitation)</option>
                <option value="vaccinations">Vaccination & Immunization Outreaches</option>
                <option value="nutrition">Nutrition & Food Security Centers</option>
              </select>
            </Step>

            <Step number={3} title="Donor Details">
              <div className="flex gap-3 mb-4">
                <button type="button" onClick={() => setDonorType('guest')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${donorType === 'guest' ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  <UserPlus className="h-4 w-4" /> Guest Donor
                </button>
                <button type="button" onClick={() => { setDonorType('logged-in'); router.push('/login'); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all cursor-pointer">
                  <LogIn className="h-4 w-4" /> Sign In
                </button>
              </div>

              {donorType === 'guest' && (
                <>
                  <label className="flex items-center gap-2.5 cursor-pointer pb-2 select-none">
                    <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="h-4.5 w-4.5 rounded border-gray-300 text-brand-green focus:ring-brand-green cursor-pointer" />
                    <span className="text-sm font-semibold text-gray-700">Donate completely anonymously</span>
                  </label>

                  {!isAnonymous && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Marian Ahmed" required
                          className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-brand-green focus:outline-hidden" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. marian@example.com" required
                          className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-brand-green focus:outline-hidden" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone (Optional)</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +252-63-4412345"
                          className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:border-brand-green focus:outline-hidden" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </Step>

            <Step number={4} title="Secure Payment Method">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {paymentMethods.map((pm) => {
                  const isActive = paymentMethod === pm.key;
                  const colors = colorMap[pm.color];
                  return (
                    <button key={pm.key} type="button" onClick={() => setPaymentMethod(pm.key as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${isActive ? `${colors} shadow-xs ring-2` : 'border-gray-200 hover:bg-gray-50'}`}>
                      <pm.icon className={`h-4 w-4 ${isActive ? '' : 'text-gray-500'}`} />
                      <span className={`text-[10px] font-bold ${isActive ? '' : 'text-brand-charcoal'}`}>{pm.label}</span>
                      <span className="text-[8px] text-gray-400 font-medium">{pm.sub}</span>
                    </button>
                  );
                })}
              </div>

              <div className="bg-brand-sand border border-gray-100 rounded-xl p-5 max-w-md">
                {(paymentMethod === 'ZAAD' || paymentMethod === 'EDAHAB') && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider font-mono" style={{ color: paymentMethod === 'ZAAD' ? '#10b981' : '#0284c7' }}>
                      Secure {paymentMethod === 'ZAAD' ? 'ZAAD' : 'e-Dahab'} Mobile Integration
                    </p>
                    <p className="text-xs text-gray-500 font-sans">An authorization prompt will be pushed to your phone.</p>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 font-mono">+252 (63)</span>
                      <input type="tel" required pattern="[0-9]{7}" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder={paymentMethod === 'ZAAD' ? '4xx-xxxx' : '6xx-xxxx'}
                        className="w-full rounded-lg border border-gray-200 py-2.5 pl-24 pr-4 text-sm font-bold font-mono focus:border-brand-green focus:outline-hidden" />
                    </div>
                  </div>
                )}

                {paymentMethod === 'PREMIER_WALLET' && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-purple-600 uppercase tracking-wider font-mono">Premier Wallet</p>
                    <p className="text-xs text-gray-500 font-sans">Enter your Premier Wallet ID to authorize payment.</p>
                    <input type="text" required placeholder="Premier Wallet ID"
                      className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm font-mono focus:border-purple-500 focus:outline-hidden mt-2" />
                  </div>
                )}

                {paymentMethod === 'CARD' && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider font-mono">Encrypted Card Gateway</p>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Card Number</label>
                      <input type="text" required pattern="[0-9]{16}" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="16-digit card number" className="w-full rounded-lg border border-gray-200 p-2 text-xs font-mono focus:border-brand-blue focus:outline-hidden" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Expiry</label>
                        <input type="text" required placeholder="MM/YY" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 p-2 text-xs font-mono focus:border-brand-blue focus:outline-hidden" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">CVV</label>
                        <input type="password" required maxLength={4} value={cardCvv} onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="3-4 digits" className="w-full rounded-lg border border-gray-200 p-2 text-xs font-mono focus:border-brand-blue focus:outline-hidden" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'STRIPE' && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider font-mono">Stripe Secure Checkout</p>
                    <p className="text-xs text-gray-500 font-sans">You will be redirected to Stripe's secure checkout page to complete payment.</p>
                    <div className="mt-2 p-3 bg-indigo-50 rounded-lg text-xs text-indigo-700 font-medium">
                      <CreditCard className="h-4 w-4 inline mr-1" />
                      Powered by Stripe — Visa, Mastercard, Amex accepted
                    </div>
                  </div>
                )}

                {paymentMethod === 'BANK_TRANSFER' && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wider font-mono">Direct Bank Transfer</p>
                    <p className="text-xs text-gray-500 font-sans">
                      After submitting, you will receive a unique reference number. Transfer the exact amount using the bank details below. Your donation will be marked complete once confirmed (1-3 business days).
                    </p>
                    <div className="bg-white border border-dashed border-amber-200 rounded-lg p-4 space-y-2 text-xs font-mono">
                      <div className="flex justify-between"><span className="text-gray-500">Bank:</span><span className="font-bold text-brand-charcoal">Dahabshil Bank International</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Account Name:</span><span className="font-bold text-brand-charcoal">SHiFAT Charity Trust</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Account No:</span><span className="font-bold text-brand-charcoal">1234-5678-9012</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">SWIFT Code:</span><span className="font-bold text-brand-charcoal">DAHAXXXX</span></div>
                      <div className="flex justify-between border-t border-amber-100 pt-2 mt-1"><span className="text-gray-500">Reference:</span><span className="font-bold text-brand-charcoal">SHiFAT-{Date.now().toString(36).toUpperCase()}</span></div>
                    </div>
                  </div>
                )}
              </div>
            </Step>

            {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}

            <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-500 font-sans">
                <ShieldCheck className="h-5 w-5 text-brand-green" />
                <span>Your details are safe and fully encrypted.</span>
              </div>
              <button type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 text-base font-extrabold text-white shadow-lg cursor-pointer transition-all duration-200 brand-gradient hover:shadow-xl active:scale-95">
                <Heart className="h-5 w-5 fill-white" />
                <span>{paymentMethod === 'BANK_TRANSFER' ? 'Generate Bank Transfer Invoice' : `Authorize $${finalAmount.toFixed(2)} USD`}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 text-brand-charcoal">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-brand-green text-xs font-bold font-mono">{number}</span>
        <h4 className="text-lg font-bold font-display">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function ToggleBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex-1 text-center py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${active ? 'bg-white text-brand-charcoal shadow-xs' : 'text-gray-500 hover:text-gray-800'}`}>
      {children}
    </button>
  );
}

function ReceiptView({ receipt, isAnonymous, donorName, donorEmail, onReset, paymentMethod, frequency }: {
  receipt: any; isAnonymous: boolean; donorName: string; donorEmail: string;
  onReset: () => void; paymentMethod: string; frequency: string;
}) {
  const receiptUrl = typeof window !== 'undefined' ? `${window.location.origin}/receipt/${receipt.receiptId}` : '';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(receiptUrl)}`;

  return (
    <div className="p-6 sm:p-10 space-y-8 animate-fade-in">
      <div className="text-center space-y-3">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-brand-green">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h3 className="text-2xl font-extrabold text-brand-charcoal font-display">Mahadsanid! (Thank You!)</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto font-sans">
          Your generous contribution has been securely processed. Below is your official tax-deductible donation receipt.
        </p>
      </div>

      <div id="donation-receipt" className="bg-brand-sand border border-dashed border-gray-300 rounded-xl p-6 space-y-6 max-w-lg mx-auto shadow-xs font-mono text-sm text-brand-charcoal">
        <div className="text-center border-b border-gray-200 pb-4">
          <span className="font-extrabold text-lg text-brand-charcoal block">SHiFAT CHARITY TRUST</span>
          <span className="text-[10px] text-gray-500 block">HARGEISA COORDINATION OFFICE</span>
          <span className="text-[10px] text-gray-400 block">TAX EXEMPT: SL-SHF-2026/A</span>
        </div>

        <div className="space-y-2 text-xs">
          <Row label="RECEIPT ID" value={receipt.receiptId} />
          <Row label="DATE" value={new Date(receipt.createdAt).toLocaleString()} />
          <Row label="DONOR" value={isAnonymous ? 'ANONYMOUS' : (donorName || receipt.donorName || 'DONOR').toUpperCase()} />
          {!isAnonymous && (donorEmail || receipt.donorEmail) && <Row label="EMAIL" value={donorEmail || receipt.donorEmail} />}
          <Row label="PAYMENT" value={paymentMethod} />
          <Row label="DESIGNATION" value={receipt.designation === 'general' ? 'General Emergency Fund' : receipt.designation} />
          <Row label="FREQUENCY" value={frequency} />
          {receipt.transactionRef && <Row label="TRANSACTION REF" value={receipt.transactionRef} />}
        </div>

        <div className="border-t border-b border-gray-200 py-3 flex justify-between items-center text-base">
          <span className="font-bold text-gray-700">TOTAL:</span>
          <span className="font-extrabold text-brand-green text-xl">${Number(receipt.amount).toFixed(2)} USD</span>
        </div>

        <div className="flex justify-center pt-2">
          <div className="text-center">
            <img src={qrUrl} alt="Verify Receipt" className="h-24 w-24 mx-auto" />
            <p className="text-[8px] text-gray-400 mt-1">Scan to verify receipt</p>
          </div>
        </div>

        <div className="text-center text-[10px] text-gray-500 leading-relaxed pt-2">
          "Mobilizing Communities For Development"<br />
          Your gift buys resources delivered directly to vulnerable families.
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
          <Printer className="h-4 w-4" /> Print / Save PDF
        </button>
        <button onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-green hover:bg-brand-green-dark transition-all cursor-pointer">
          <span>Make Another Donation</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}:</span>
      <span className="font-bold text-brand-charcoal break-all text-right">{value}</span>
    </div>
  );
}
