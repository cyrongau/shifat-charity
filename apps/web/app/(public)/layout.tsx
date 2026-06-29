'use client';
import { AuthProvider } from '../../lib/auth-context';
import AnnouncementBar from '../../components/public/AnnouncementBar';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </AuthProvider>
  );
}
