'use client';

import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface FormCardProps {
  title: string;
  backHref: string;
  onSubmit?: () => void;
  children: React.ReactNode;
  loading?: boolean;
  extraButtons?: React.ReactNode;
}

export default function FormCard({ title, backHref, onSubmit, children, loading, extraButtons }: FormCardProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            className="p-2 rounded-lg text-gray-400 hover:text-brand-charcoal hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h2 className="text-lg font-display font-bold text-brand-charcoal">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {extraButtons}
          {onSubmit && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 brand-gradient text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save'}
          </button>
        )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        {children}
      </div>
    </div>
  );
}
