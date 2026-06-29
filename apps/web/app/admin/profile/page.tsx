'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/auth-context';

export default function AdminProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ fullName: '', phone: '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) setProfile({ fullName: user.fullName || '', phone: user.phone || '' });
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true); setProfileMsg(''); setProfileError('');
    const token = localStorage.getItem('shifat_token');
    try {
      const res = await fetch('http://localhost:5201/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to update profile');
      setProfileMsg('Profile updated successfully');
    } catch (err: any) { setProfileError(err.message); }
    finally { setProfileLoading(false); }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.newPassword !== password.confirmPassword) { setPasswordError('Passwords do not match'); return; }
    setPasswordLoading(true); setPasswordMsg(''); setPasswordError('');
    const token = localStorage.getItem('shifat_token');
    try {
      const res = await fetch('http://localhost:5201/api/auth/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: password.currentPassword, newPassword: password.newPassword }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to change password');
      setPasswordMsg('Password changed successfully');
      setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) { setPasswordError(err.message); }
    finally { setPasswordLoading(false); }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-charcoal">My Profile</h1>
        <p className="text-sm text-gray-500">Manage your account details and password.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-display font-bold text-brand-charcoal mb-4">Personal Information</h2>
        {profileMsg && <div className="bg-emerald-50 text-emerald-700 text-sm px-3 py-2 rounded-lg mb-4">{profileMsg}</div>}
        {profileError && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">{profileError}</div>}
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={user?.email || ''} disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
            <p className="text-[10px] text-gray-400 mt-0.5">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" value={profile.fullName} onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none" placeholder="+252..." />
          </div>
          <button type="submit" disabled={profileLoading} className="px-5 py-2 brand-gradient text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            {profileLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-display font-bold text-brand-charcoal mb-4">Change Password</h2>
        {passwordMsg && <div className="bg-emerald-50 text-emerald-700 text-sm px-3 py-2 rounded-lg mb-4">{passwordMsg}</div>}
        {passwordError && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">{passwordError}</div>}
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input type="password" value={password.currentPassword} onChange={(e) => setPassword((p) => ({ ...p, currentPassword: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" value={password.newPassword} onChange={(e) => setPassword((p) => ({ ...p, newPassword: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none" required minLength={6} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input type="password" value={password.confirmPassword} onChange={(e) => setPassword((p) => ({ ...p, confirmPassword: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-green focus:border-brand-green outline-none" required />
          </div>
          <button type="submit" disabled={passwordLoading} className="px-5 py-2 brand-gradient text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            {passwordLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-display font-bold text-brand-charcoal mb-4">Account Details</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1.5 border-b border-gray-50">
            <span className="text-gray-500">Role</span>
            <span className="font-medium text-brand-charcoal capitalize">{user?.role?.toLowerCase()}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-50">
            <span className="text-gray-500">Email Verified</span>
            <span className={`font-medium ${user?.emailVerified ? 'text-emerald-600' : 'text-amber-600'}`}>{user?.emailVerified ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
