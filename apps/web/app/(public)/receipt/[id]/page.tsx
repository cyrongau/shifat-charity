import type { Metadata } from 'next';
import ReceiptView from '../../../../components/public/ReceiptView';

export const metadata: Metadata = {
  title: 'Donation Receipt | SHiFAT',
  description: 'Verify your SHiFAT donation receipt.',
};

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let donation: any = null;
  let error = '';

  try {
    const res = await fetch(`http://localhost:5201/api/donations/receipt/${id}`, { cache: 'no-store' });
    if (res.ok) {
      donation = await res.json();
    } else {
      error = 'Receipt not found';
    }
  } catch {
    error = 'Could not load receipt';
  }

  if (error || !donation) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">Receipt Not Found</h1>
          <p className="text-gray-500">{error || 'No donation receipt matches this ID.'}</p>
        </div>
      </div>
    );
  }

  return <ReceiptView donation={donation} />;
}
