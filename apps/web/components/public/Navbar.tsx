'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, Heart, ChevronDown, Activity, HeartHandshake, Compass, FileText, Sparkles, ArrowRight, HelpCircle, User, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useAuth } from '../../lib/auth-context';

function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!user) return null;

  const isStaff = user.role === 'ADMIN' || user.role === 'STAFF';
  const dashboardHref = isStaff ? '/admin' : '/dashboard';
  const profileHref = isStaff ? '/admin/profile' : '/dashboard/profile';

  const initials = (user.fullName || user.email)
    .split(' ')
    .map((s) => s.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        title="Account menu"
      >
        <div className="h-8 w-8 rounded-full brand-gradient flex items-center justify-center text-xs font-bold text-white">
          {initials}
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-50 animate-fade-in">
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="text-sm font-medium text-brand-charcoal leading-tight">
              {user.fullName || user.email}
            </div>
            <div className="text-[11px] text-gray-400 capitalize leading-tight">
              {user.role?.toLowerCase()}
            </div>
          </div>

          <Link
            href={dashboardHref}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LayoutDashboard className="h-4 w-4 text-gray-400" />
            Dashboard
          </Link>

          <Link
            href={profileHref}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-4 w-4 text-gray-400" />
            My Profile
          </Link>

          <button
            onClick={() => { setOpen(false); logout(); }}
            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

function MobileUserMenu({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const isStaff = user.role === 'ADMIN' || user.role === 'STAFF';
  const dashboardHref = isStaff ? '/admin' : '/dashboard';

  const initials = (user.fullName || user.email)
    .split(' ')
    .map((s) => s.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-gray-50 rounded-xl p-3 space-y-2">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full brand-gradient flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-brand-charcoal truncate">{user.fullName || user.email}</div>
          <div className="text-[10px] text-gray-400 capitalize">{user.role?.toLowerCase()}</div>
        </div>
      </div>
      <div className="flex gap-2">
        <Link
          href={dashboardHref}
          onClick={onClose}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-brand-blue bg-blue-50 hover:bg-blue-100 transition-colors"
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          Dashboard
        </Link>
        <button
          onClick={() => { onClose(); logout(); }}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5201/api';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const currentView = pathname === '/' ? 'home' : pathname.slice(1);

  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'initiatives' | 'involved' | null>(null);
  
  // Mobile accordion states
  const [mobileInitiativesOpen, setMobileInitiativesOpen] = useState(false);
  const [mobileInvolvedOpen, setMobileInvolvedOpen] = useState(false);

  // Featured program for mega menu
  const [featuredProgram, setFeaturedProgram] = useState<{ id: string; title: string; description: string; impactStat: string; slug: string } | null>(null);

  useEffect(() => {
    fetch(`${API}/settings`)
      .then((r) => r.json())
      .then((settings) => {
        if (settings.featuredProgramId) {
          fetch(`${API}/programs/${settings.featuredProgramId}`)
            .then((r) => r.json())
            .then((prog) => setFeaturedProgram(prog))
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  const initiativesDropdownRef = useRef<HTMLDivElement>(null);
  const involvedDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        initiativesDropdownRef.current && 
        !initiativesDropdownRef.current.contains(event.target as Node) &&
        involvedDropdownRef.current && 
        !involvedDropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavClick = (id: string) => {
    const href = id === 'home' ? '/' : `/${id}`;
    router.push(href);
    setIsOpen(false);
    setActiveDropdown(null);
    setMobileInitiativesOpen(false);
    setMobileInvolvedOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const initiativesItems = [
    { id: 'programs', label: 'Programs', desc: 'Our health pillars & medical operations' },
    { id: 'campaigns', label: 'Campaigns', desc: 'Active funding & vaccination drives' },
    { id: 'projects', label: 'Projects', desc: 'Ongoing & completed regional works' },
    { id: 'publications', label: 'Publications', desc: 'Reports, research & transparency records' }
  ];

  const involvedItems = [
    { id: 'get-involved', label: 'Get Involved', desc: 'Volunteer & career opportunities' },
    { id: 'partners', label: 'Partners', desc: 'Global coalitions & regional trusts' },
    { id: 'contact', label: 'Contact Us', desc: 'Direct HQ communication channels & FAQ' }
  ];

  // Check if an item in the dropdown is active to highlight the parent tab
  const isInitiativesActive = ['programs', 'campaigns', 'projects', 'publications'].includes(currentView);
  const isInvolvedActive = ['get-involved', 'partners', 'contact'].includes(currentView);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 shadow-xs backdrop-blur-md" id="shifat-header">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link 
          href="/" 
          className="cursor-pointer transition-transform duration-200 active:scale-95"
          aria-label="SHiFAT Home"
        >
          <BrandLogo className="h-10" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
          
          {/* Home Direct Link */}
          <Link
            href="/"
            className={`px-3 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
              currentView === 'home'
                ? 'text-brand-blue bg-blue-50/50'
                : 'text-gray-600 hover:text-brand-green hover:bg-gray-50'
            }`}
          >
            Home
          </Link>

          {/* About Us Direct Link */}
          <Link
            href="/about"
            className={`px-3 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
              currentView === 'about'
                ? 'text-brand-blue bg-blue-50/50'
                : 'text-gray-600 hover:text-brand-green hover:bg-gray-50'
            }`}
          >
            About Us
          </Link>

          {/* DROPDOWN 1: Our Initiatives */}
          <div 
            ref={initiativesDropdownRef} 
            className="relative"
            onMouseEnter={() => setActiveDropdown('initiatives')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'initiatives' ? null : 'initiatives')}
              className={`px-3 py-2 text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5 ${
                isInitiativesActive
                  ? 'text-brand-blue bg-blue-50/50'
                  : 'text-gray-600 hover:text-brand-green hover:bg-gray-50'
              }`}
            >
              <span>Our Initiatives</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'initiatives' ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Panel - Converted to Visual Mega Menu */}
            {activeDropdown === 'initiatives' && (
              <div className="absolute left-1/2 -translate-x-[35%] top-full pt-2 w-[840px] z-50">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl ring-1 ring-black/5 animate-fade-in transition-all grid grid-cols-12 gap-6">
                  
                  {/* Left Column: 4 Core Initiatives Categories (Col span 7) */}
                  <div className="col-span-7 space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest font-mono">Knowledge & Impact Sectors</span>
                      <span className="text-[10px] font-bold text-brand-green bg-emerald-50 px-2.5 py-0.5 rounded-md uppercase font-mono">SHiFAT Trust</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Programs */}
                      <Link
                        href="/programs"
                        className={`group text-left p-3 rounded-xl border border-transparent hover:border-gray-100 hover:bg-slate-50/50 transition-all ${
                          currentView === 'programs' ? 'bg-blue-50/30 border-blue-100' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="p-1.5 rounded-lg bg-emerald-50 text-brand-green group-hover:bg-brand-green group-hover:text-white transition-colors">
                            <Activity className="h-4 w-4" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-brand-charcoal group-hover:text-brand-blue transition-colors">Programs</span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                          6 certified healthcare delivery pillars including Maternal Care & WASH services.
                        </p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-blue mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          Explore Pillars <ArrowRight className="h-3 w-3" />
                        </span>
                      </Link>

                      {/* Campaigns */}
                      <Link
                        href="/campaigns"
                        className={`group text-left p-3 rounded-xl border border-transparent hover:border-gray-100 hover:bg-slate-50/50 transition-all ${
                          currentView === 'campaigns' ? 'bg-blue-50/30 border-blue-100' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <HeartHandshake className="h-4 w-4" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-brand-charcoal group-hover:text-brand-blue transition-colors">Campaigns</span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                          Active emergency funding, regional vaccination drives, and medical supply support.
                        </p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-blue mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          View Active Drives <ArrowRight className="h-3 w-3" />
                        </span>
                      </Link>

                      {/* Projects */}
                      <Link
                        href="/projects"
                        className={`group text-left p-3 rounded-xl border border-transparent hover:border-gray-100 hover:bg-slate-50/50 transition-all ${
                          currentView === 'projects' ? 'bg-blue-50/30 border-blue-100' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                            <Compass className="h-4 w-4" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-brand-charcoal group-hover:text-brand-blue transition-colors">Projects</span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                          Sustained construction, medical clinic buildings, and solar well installations.
                        </p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-blue mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          View Works <ArrowRight className="h-3 w-3" />
                        </span>
                      </Link>

                      {/* Publications */}
                      <Link
                        href="/publications"
                        className={`group text-left p-3 rounded-xl border border-transparent hover:border-gray-100 hover:bg-slate-50/50 transition-all ${
                          currentView === 'publications' ? 'bg-blue-50/30 border-blue-100' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                            <FileText className="h-4 w-4" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-brand-charcoal group-hover:text-brand-blue transition-colors">Publications</span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                          Official peer-reviewed reports, annual transparent reviews, and policy briefs.
                        </p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-blue mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          Read Reports <ArrowRight className="h-3 w-3" />
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Featured Banner & quick actions (Col span 5) */}
                  <div className="col-span-5 bg-gradient-to-br from-slate-900 to-brand-charcoal rounded-xl p-5 text-white flex flex-col justify-between border border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-28 w-28 bg-emerald-500/10 rounded-bl-full pointer-events-none" />

                    {featuredProgram ? (
                      <>
                        <div className="space-y-3.5 z-10">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 font-mono">Active Relief Focus</span>
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs sm:text-sm font-extrabold font-display leading-tight">{featuredProgram.title}</h4>
                            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                              {featuredProgram.description}
                            </p>
                          </div>
                          {featuredProgram.impactStat && (
                            <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-[10px]">
                              <span className="text-brand-green font-bold font-mono">{featuredProgram.impactStat}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2 pt-4 z-10">
                          <button
                            onClick={() => handleNavClick('donate')}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-brand-green hover:bg-brand-green-dark transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01]"
                          >
                            <Heart className="h-3.5 w-3.5 fill-white animate-pulse" />
                            <span>Support This Initiative</span>
                          </button>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleNavClick('get-involved')}
                              className="inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold text-slate-200 hover:text-white border border-white/10 hover:border-white/25 hover:bg-white/5 transition-colors cursor-pointer"
                            >
                              <Sparkles className="h-3 w-3 text-brand-green" />
                              <span>Volunteer</span>
                            </button>
                            <button
                              onClick={() => handleNavClick('contact')}
                              className="inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold text-slate-200 hover:text-white border border-white/10 hover:border-white/25 hover:bg-white/5 transition-colors cursor-pointer"
                            >
                              <HelpCircle className="h-3 w-3 text-brand-blue" />
                              <span>Quick FAQ</span>
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="z-10 flex items-center justify-center h-full text-slate-500 text-xs text-center px-4">
                        No featured program selected. Configure one in Settings &rarr; Mega Menu.
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* News Direct Link */}
          <Link
            href="/news"
            className={`px-3 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
              currentView === 'news'
                ? 'text-brand-blue bg-blue-50/50'
                : 'text-gray-600 hover:text-brand-green hover:bg-gray-50'
            }`}
          >
            News Room
          </Link>

          {/* Gallery Direct Link */}
          <Link
            href="/gallery"
            className={`px-3 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
              currentView === 'gallery'
                ? 'text-brand-blue bg-blue-50/50'
                : 'text-gray-600 hover:text-brand-green hover:bg-gray-50'
            }`}
          >
            Gallery
          </Link>

          {/* DROPDOWN 2: Get Involved */}
          <div 
            ref={involvedDropdownRef} 
            className="relative"
            onMouseEnter={() => setActiveDropdown('involved')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'involved' ? null : 'involved')}
              className={`px-3 py-2 text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5 ${
                isInvolvedActive
                  ? 'text-brand-blue bg-blue-50/50'
                  : 'text-gray-600 hover:text-brand-green hover:bg-gray-50'
              }`}
            >
              <span>Get Involved</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === 'involved' ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Panel */}
            {activeDropdown === 'involved' && (
              <div className="absolute right-0 top-full pt-2 w-80 z-50">
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-xl ring-1 ring-black/5 animate-fade-in transition-all">
                  <div className="space-y-1">
                    {involvedItems.map((item) => (
                      <Link
                        key={item.id}
                        href={`/${item.id}`}
                        className={`flex w-full flex-col text-left px-3 py-2.5 rounded-xl transition-all ${
                          currentView === item.id
                            ? 'bg-blue-50 text-brand-blue'
                            : 'hover:bg-slate-50 text-gray-700'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-bold">{item.label}</span>
                        <span className="text-[11px] text-gray-400 font-sans mt-0.5 leading-none">{item.desc}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

        </nav>

        {/* CTA Button + User Menu */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white shadow-md transition-all duration-200 brand-gradient hover:shadow-lg active:scale-95"
          >
            <Heart className="h-4 w-4 fill-white animate-pulse" />
            <span>Donate Now</span>
          </Link>

          <UserMenu />
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center lg:hidden gap-2">
          {/* Mobile Donate CTA (visible even on small screens) */}
          <Link
            href="/donate"
            className="sm:hidden p-2 rounded-full text-white bg-brand-green shadow-sm hover:bg-brand-green-dark transition-all duration-150"
            aria-label="Donate"
          >
            <Heart className="h-4 w-4 fill-white" />
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-hidden cursor-pointer"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="lg:hidden animate-fade-in border-t border-gray-100 bg-white shadow-xl max-h-[85vh] overflow-y-auto">
          <div className="space-y-1 px-4 py-3 pb-4">
            
            {/* Direct Home Link */}
            <Link
              href="/"
              onClick={() => { setIsOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex w-full items-center px-4 py-3 text-base font-bold rounded-lg transition-colors ${
                currentView === 'home'
                  ? 'text-brand-blue bg-blue-50/80'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-brand-green'
              }`}
            >
              Home
            </Link>

            {/* Direct About Us Link */}
            <Link
              href="/about"
              onClick={() => { setIsOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex w-full items-center px-4 py-3 text-base font-bold rounded-lg transition-colors ${
                currentView === 'about'
                  ? 'text-brand-blue bg-blue-50/80'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-brand-green'
              }`}
            >
              About Us
            </Link>

            {/* Collapsible Mobile Dropdown 1: Initiatives */}
            <div className="space-y-1">
              <button
                onClick={() => setMobileInitiativesOpen(!mobileInitiativesOpen)}
                className="flex w-full items-center justify-between px-4 py-3 text-base font-bold rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <span>Our Initiatives</span>
                <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${mobileInitiativesOpen ? 'rotate-180 text-brand-blue' : ''}`} />
              </button>

              {mobileInitiativesOpen && (
                <div className="pl-4 border-l border-gray-100 space-y-1 animate-fade-in">
                  {initiativesItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex w-full flex-col text-left px-4 py-2.5 rounded-lg transition-colors cursor-pointer ${
                        currentView === item.id
                          ? 'text-brand-blue bg-blue-50/50'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-sm font-bold">{item.label}</span>
                      <span className="text-[10px] text-gray-400 font-sans mt-0.5">{item.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Direct News Room Link */}
            <Link
              href="/news"
              onClick={() => { setIsOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex w-full items-center px-4 py-3 text-base font-bold rounded-lg transition-colors ${
                currentView === 'news'
                  ? 'text-brand-blue bg-blue-50/80'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-brand-green'
              }`}
            >
              News Room
            </Link>

            {/* Direct Gallery Link */}
            <Link
              href="/gallery"
              onClick={() => { setIsOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex w-full items-center px-4 py-3 text-base font-bold rounded-lg transition-colors ${
                currentView === 'gallery'
                  ? 'text-brand-blue bg-blue-50/80'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-brand-green'
              }`}
            >
              Gallery
            </Link>

            {/* Collapsible Mobile Dropdown 2: Get Involved */}
            <div className="space-y-1">
              <button
                onClick={() => setMobileInvolvedOpen(!mobileInvolvedOpen)}
                className="flex w-full items-center justify-between px-4 py-3 text-base font-bold rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <span>Get Involved</span>
                <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${mobileInvolvedOpen ? 'rotate-180 text-brand-blue' : ''}`} />
              </button>

              {mobileInvolvedOpen && (
                <div className="pl-4 border-l border-gray-100 space-y-1 animate-fade-in">
                  {involvedItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex w-full flex-col text-left px-4 py-2.5 rounded-lg transition-colors cursor-pointer ${
                        currentView === item.id
                          ? 'text-brand-blue bg-blue-50/50'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-sm font-bold">{item.label}</span>
                      <span className="text-[10px] text-gray-400 font-sans mt-0.5">{item.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 px-4 space-y-2">
              {/* Mobile User Menu */}
              <MobileUserMenu onClose={() => { setIsOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

              <Link
                href="/donate"
                onClick={() => { setIsOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-base font-extrabold text-white shadow-md brand-gradient"
              >
                <Heart className="h-5 w-5 fill-white" />
                <span>Donate Now</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
