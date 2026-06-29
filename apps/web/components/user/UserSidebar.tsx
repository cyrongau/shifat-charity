'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Heart, Receipt, User, LogOut, RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/donations', label: 'Donation History', icon: Heart },
  { href: '/dashboard/subscriptions', label: 'My Subscriptions', icon: RefreshCw },
  { href: '/dashboard/profile', label: 'My Profile', icon: User },
];

export default function UserSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full brand-gradient flex items-center justify-center text-sm font-bold text-white">
            {user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-brand-charcoal truncate">{user?.fullName || user?.email}</div>
            <div className="text-[11px] text-gray-400 capitalize">{user?.role?.toLowerCase()}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-brand-green/10 text-brand-green font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-brand-charcoal'
              }`}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
