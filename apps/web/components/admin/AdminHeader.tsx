'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import Link from 'next/link';

const breadcrumbMap: Record<string, string> = {
  admin: 'Dashboard',
  users: 'Users',
  programs: 'Programs',
  projects: 'Projects',
  campaigns: 'Campaigns',
  news: 'News',
  publications: 'Publications',
  team: 'Team',
  careers: 'Careers',
  partners: 'Partners',
  faqs: 'FAQs',
  donations: 'Donations',
  applications: 'Applications',
  contacts: 'Contacts',
  newsletter: 'Newsletter',
  media: 'Media',
  announcements: 'Announcements',
  gallery: 'Gallery',
  'hero-slides': 'Hero Slides',
  'mailing-lists': 'Mailing Lists',
  'email-campaigns': 'Email Campaigns',
  settings: 'Settings',
  profile: 'My Profile',
};

export default function AdminHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1] || '';
  const title = breadcrumbMap[lastSegment] || 'Admin';

  const initials = (user?.fullName || user?.email || 'U')
    .split(' ')
    .map((s) => s.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-brand-charcoal">{title}</h1>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="h-8 w-8 rounded-full brand-gradient flex items-center justify-center text-xs font-bold text-white">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-brand-charcoal leading-tight">
                {user?.fullName || user?.email}
              </div>
              <div className="text-xs text-gray-400 capitalize leading-tight">
                {user?.role?.toLowerCase()}
              </div>
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-50">
              <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                <div className="text-sm font-medium text-brand-charcoal">
                  {user?.fullName || user?.email}
                </div>
                <div className="text-xs text-gray-400 capitalize">{user?.role?.toLowerCase()}</div>
              </div>

              <Link
                href="/admin/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User className="h-4 w-4 text-gray-400" />
                Profile
              </Link>

              <Link
                href="/admin/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-4 w-4 text-gray-400" />
                Settings
              </Link>

              <button
                onClick={() => { setMenuOpen(false); logout(); }}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
