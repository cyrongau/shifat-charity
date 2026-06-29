'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, Globe, Check } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || subscribing) return;

    setSubscribing(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 5000);
      }
    } catch {
      // Silently fail for now
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-brand-charcoal text-gray-300 border-t-4 border-brand-green" id="shifat-footer">
      {/* Upper Footer Segment */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <BrandLogo light showText className="h-10" />
            <p className="text-sm text-gray-400 leading-relaxed font-sans">
              SHiFAT (Somali Health Initiative For All Trust) is a registered non-profit organization dedicated to empowering vulnerable communities, strengthening maternal care, distributing crisis relief, and providing clean water solutions across the Horn of Africa.
            </p>
            <div className="flex gap-4">
              <a href="#facebook" className="text-gray-400 hover:text-brand-green transition-colors" aria-label="Facebook">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#twitter" className="text-gray-400 hover:text-brand-green transition-colors" aria-label="Twitter">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#instagram" className="text-gray-400 hover:text-brand-green transition-colors" aria-label="Instagram">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#linkedin" className="text-gray-400 hover:text-brand-green transition-colors" aria-label="LinkedIn">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#youtube" className="text-gray-400 hover:text-brand-green transition-colors" aria-label="YouTube">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase font-display border-b border-gray-800 pb-2">
              Explore SHiFAT
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-brand-green transition-colors">
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-brand-green transition-colors">
                  Health Programs
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-brand-green transition-colors">
                  Impact Projects
                </Link>
              </li>
              <li>
                <Link href="/campaigns" className="hover:text-brand-green transition-colors">
                  Health Campaigns
                </Link>
              </li>
              <li>
                <Link href="/partners" className="hover:text-brand-green transition-colors">
                  Our Global Partners
                </Link>
              </li>
              <li>
                <Link href="/publications" className="hover:text-brand-green transition-colors">
                  Reports & Publications
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase font-display border-b border-gray-800 pb-2">
              Contact & HQ
            </h3>
            <ul className="space-y-3.5 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                <span>
                  <strong>HQ Coordination Office:</strong><br />
                  Main Street, Near General Hospital,<br />
                  Hargeisa, Somaliland (Horn of Africa)
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-brand-blue shrink-0" />
                <span>+252 (63) 441-2345 / 551-6789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-blue shrink-0" />
                <span className="break-all">contact@shifat.org</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase font-display border-b border-gray-800 pb-2">
              Newsletter Signup
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Stay informed of medical updates, emergency appeals, and community success stories.
            </p>
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  disabled={subscribing}
                  className="w-full rounded-lg bg-gray-900 border border-gray-800 py-2.5 pl-3 pr-10 text-sm text-gray-200 placeholder-gray-500 focus:border-brand-green focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-md bg-brand-green hover:bg-brand-green-dark text-white transition-colors cursor-pointer disabled:opacity-50"
                  aria-label="Submit subscribe"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              {subscribed && (
                <div className="absolute left-0 mt-2 flex items-center gap-2 text-xs text-brand-green bg-emerald-950/40 px-3 py-1.5 rounded-md border border-emerald-900 animate-fade-in">
                  <Check className="h-3 w-3" />
                  <span>Subscribed! Thank you for staying connected.</span>
                </div>
              )}
            </form>
          </div>

        </div>
      </div>

      {/* Lower Copyright Segment */}
      <div className="bg-gray-950 py-6 text-center text-xs text-gray-500 border-t border-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Somali Health Initiative For All Trust (SHiFAT). All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-brand-green transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-brand-green transition-colors">Terms of Service</Link>
            <Link href="/about" className="hover:text-brand-green transition-colors">Tax Exemption Info</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
