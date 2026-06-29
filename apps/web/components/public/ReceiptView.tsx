'use client';

import { Printer } from 'lucide-react';
import Link from 'next/link';

interface ReceiptViewProps {
  donation: any;
}

export default function ReceiptView({ donation }: ReceiptViewProps) {
  const receiptUrl = typeof window !== 'undefined' ? `${window.location.origin}/receipt/${donation.receiptId}` : '';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(receiptUrl)}`;

  return (
    <div className="mx-auto max-w-lg py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="brand-gradient px-6 py-4 text-center">
          <h1 className="text-white font-display font-bold text-lg">Official Donation Receipt</h1>
          <p className="text-white/70 text-xs">SHiFAT Charity Trust — Tax Exempt: SL-SHF-2026/A</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-brand-sand border border-dashed border-gray-300 rounded-xl p-6 space-y-4 font-mono text-sm">
            <div className="text-center border-b border-gray-200 pb-3">
              <span className="font-extrabold text-lg text-brand-charcoal block">SHiFAT CHARITY TRUST</span>
              <span className="text-[10px] text-gray-500">HARGEISA COORDINATION OFFICE</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <Row label="Receipt ID" value={donation.receiptId} />
              <Row label="Date" value={new Date(donation.createdAt).toLocaleString()} />
              <Row label="Donor" value={donation.isAnonymous ? 'ANONYMOUS DONOR' : (donation.donorName || donation.user?.fullName || 'DONOR').toUpperCase()} />
              {donation.donorEmail && <Row label="Email" value={donation.donorEmail} />}
              <Row label="Payment Method" value={donation.paymentMethod} />
              <Row label="Designation" value={donation.designation === 'general' ? 'General Emergency Fund' : (donation.campaign?.title || donation.designation)} />
              <Row label="Status" value={donation.status} />
              {donation.transactionRef && <Row label="Transaction Ref" value={donation.transactionRef} />}
            </div>

            <div className="border-t border-b border-gray-200 py-3 flex justify-between items-center">
              <span className="font-bold text-gray-700 text-sm">Total Amount:</span>
              <span className="font-extrabold text-brand-green text-xl">${Number(donation.amount).toFixed(2)} USD</span>
            </div>

            <div className="flex justify-center pt-2">
              <div className="text-center">
                <img src={qrUrl} alt="Verify Receipt QR" className="h-28 w-28 mx-auto" />
                <p className="text-[8px] text-gray-400 mt-1">Scan to verify this receipt</p>
              </div>
            </div>

            <div className="text-center text-[10px] text-gray-500 leading-relaxed pt-2">
              &quot;Mobilizing Communities For Development&quot;<br />
              Verified SHiFAT donation record. Valid for tax deduction purposes.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
              <Printer className="h-4 w-4" /> Print / PDF
            </button>
            <Link href="/donate"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white brand-gradient hover:opacity-90 transition-opacity">
              <span>Make Another Donation</span>
            </Link>
          </div>
        </div>
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
