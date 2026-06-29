'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function MediaPage() {
  const [copied, setCopied] = useState(false);
  const uploadUrl = 'http://localhost:9001';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(uploadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-brand-charcoal">Media Library</h1>
        <p className="text-gray-500 mt-1">Manage uploaded media files and assets.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-brand-charcoal">Upload via MinIO Console</h2>
        <p className="text-sm text-gray-500">
          Files can be uploaded directly through the MinIO browser-based console. Use the URL below
          to access the console, then navigate to the appropriate bucket to upload or manage files.
        </p>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={uploadUrl}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 font-mono outline-none"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <p className="text-xs text-gray-400">
          Note: This page is a placeholder. A full media management interface will be added in a
          future release.
        </p>
      </div>
    </div>
  );
}
