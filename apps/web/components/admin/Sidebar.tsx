'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Users, Heart, Target, Megaphone,
  Newspaper, BookOpen, Briefcase, Handshake, DollarSign,
  MessageSquare, FileText, Settings, Image, LogOut, ChevronLeft, ChevronRight,
  HelpCircle, Mail, Bell, Camera, ChevronDown, User,
} from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

interface NavChild {
  href: string;
  label: string;
  adminOnly?: boolean;
}

interface NavGroup {
  label: string;
  icon: any;
  adminOnly?: boolean;
  children: NavChild[];
}

interface NavSingle {
  href: string;
  label: string;
  icon: any;
  adminOnly?: boolean;
}

type NavItem = NavSingle | NavGroup;

function isGroup(item: NavItem): item is NavGroup {
  return 'children' in item;
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users, adminOnly: true },
  {
    label: 'Content Editor',
    icon: FileText,
    children: [
      { href: '/admin/programs', label: 'Programs' },
      { href: '/admin/projects', label: 'Projects' },
      { href: '/admin/campaigns', label: 'Campaigns' },
      { href: '/admin/news', label: 'News' },
      { href: '/admin/gallery', label: 'Gallery' },
      { href: '/admin/publications', label: 'Publications' },
      { href: '/admin/faqs', label: 'FAQs' },
      { href: '/admin/announcements', label: 'Announcements' },
      { href: '/admin/hero-slides', label: 'Hero Slides' },
      { href: '/admin/media', label: 'Media' },
    ],
  },
  {
    label: 'Newsletter',
    icon: Mail,
    children: [
      { href: '/admin/newsletter', label: 'Subscribers' },
      { href: '/admin/mailing-lists', label: 'Mailing Lists' },
      { href: '/admin/email-campaigns', label: 'Email Campaigns' },
    ],
  },
  { href: '/admin/donations', label: 'Donations', icon: DollarSign },
  {
    label: 'People',
    icon: Users,
    children: [
      { href: '/admin/team', label: 'Team' },
      { href: '/admin/careers', label: 'Careers' },
      { href: '/admin/partners', label: 'Partners' },
      { href: '/admin/applications', label: 'Applications' },
    ],
  },
  { href: '/admin/contacts', label: 'Contacts', icon: MessageSquare },
  { href: '/admin/profile', label: 'Profile', icon: User },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  minimized: boolean;
  onToggle: () => void;
}

function NavGroupItem({ group, minimized, pathname, isAdmin }: { group: NavGroup; minimized: boolean; pathname: string; isAdmin: boolean }) {
  const [open, setOpen] = useState(false);

  if (group.adminOnly && !isAdmin) return null;

  const isChildActive = group.children.some((c) => {
    if (c.adminOnly && !isAdmin) return false;
    return pathname === c.href || pathname.startsWith(c.href + '/');
  });

  if (minimized) {
    return (
      <div className="relative group/nav">
        <div className="flex items-center justify-center px-0 py-2.5 mx-auto w-10 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
          <group.icon className="h-4 w-4 flex-shrink-0" />
        </div>
        <div className="absolute left-full top-0 ml-2 bg-brand-charcoal border border-gray-700 rounded-lg py-1.5 min-w-40 shadow-xl opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all z-50">
          {group.children.map((child) => {
            if (child.adminOnly && !isAdmin) return null;
            const active = pathname === child.href || pathname.startsWith(child.href + '/');
            return (
              <Link
                key={child.href}
                href={child.href}
                className={`block px-3 py-1.5 text-xs transition-colors ${active ? 'bg-brand-green/20 text-brand-green-light font-medium' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
          isChildActive
            ? 'bg-brand-green/20 text-brand-green-light font-medium'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        <group.icon className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1 text-left whitespace-nowrap overflow-hidden">{group.label}</span>
        <ChevronDown className={`h-3.5 w-3.5 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="ml-7 mt-0.5 space-y-0.5 border-l border-gray-700 pl-2">
          {group.children.map((child) => {
            if (child.adminOnly && !isAdmin) return null;
            const active = pathname === child.href || pathname.startsWith(child.href + '/');
            return (
              <Link
                key={child.href}
                href={child.href}
                className={`block px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  active
                    ? 'bg-brand-green/20 text-brand-green-light font-medium'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ minimized, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen bg-brand-charcoal text-white flex flex-col transition-all duration-300 ease-in-out ${
        minimized ? 'w-16' : 'w-64'
      }`}
    >
      <button
        onClick={onToggle}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-50 flex items-center justify-center w-5 h-10 rounded-full bg-brand-charcoal border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors cursor-pointer shadow-md"
        title={minimized ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {minimized ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      <Link href="/" className={`flex items-center border-b border-gray-700 ${minimized ? 'justify-center px-0 py-4' : 'gap-2 px-5 py-4'}`}>
        <div className="h-8 w-8 rounded-lg brand-gradient flex items-center justify-center text-xs font-bold flex-shrink-0">
          S
        </div>
        <span className={`font-display font-bold text-lg overflow-hidden whitespace-nowrap transition-all duration-300 ${
          minimized ? 'w-0 opacity-0' : 'w-auto opacity-100'
        }`}>
          SHiFAT Admin
        </span>
      </Link>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item, idx) => {
          if (isGroup(item)) {
            return (
              <NavGroupItem
                key={item.label}
                group={item}
                minimized={minimized}
                pathname={pathname}
                isAdmin={isAdmin}
              />
            );
          }

          if (item.adminOnly && !isAdmin) return null;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-lg text-sm transition-colors ${
                minimized
                  ? 'justify-center px-0 py-2.5 mx-auto w-10'
                  : 'gap-3 px-3 py-2'
              } ${
                isActive
                  ? 'bg-brand-green/20 text-brand-green-light font-medium'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              title={minimized ? item.label : undefined}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                minimized ? 'w-0 opacity-0' : 'w-auto opacity-100'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className={`border-t border-gray-700 p-3 space-y-2 ${minimized ? 'flex flex-col items-center' : ''}`}>
        {minimized ? (
          <div className="h-8 w-8 rounded-full brand-gradient flex items-center justify-center text-xs font-bold text-white">
            {user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        ) : (
          <div className="px-3 py-2 text-xs text-gray-400">
            <div className="font-medium text-gray-300">{user?.fullName || user?.email}</div>
            <div className="capitalize">{user?.role?.toLowerCase()}</div>
          </div>
        )}

        <button
          onClick={logout}
          className={`flex items-center rounded-lg text-sm text-gray-300 hover:bg-red-500/20 hover:text-red-300 transition-colors ${
            minimized ? 'justify-center p-2 w-10 mx-auto' : 'w-full gap-3 px-3 py-2'
          }`}
          title={minimized ? 'Sign Out' : undefined}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
            minimized ? 'w-0 opacity-0' : 'w-auto opacity-100'
          }`}>
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}
