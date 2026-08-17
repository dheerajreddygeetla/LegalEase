import React from 'react';
import { Mail, MapPin, Calendar } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import GlassCard from '../components/ui/GlassCard';

const Profile = () => {
  const userName = localStorage.getItem('userName') || 'User';
  const initial = userName.charAt(0).toUpperCase();

  return (
    <DashboardLayout>
      <span className="kicker">Account</span>
      <h1 className="font-display text-3xl font-bold text-ink mt-3 mb-8">Your profile</h1>

      <GlassCard className="flex items-center gap-5 mb-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-grad-primary font-display text-2xl font-bold text-white shadow-glow">
          {initial}
        </div>
        <div>
          <p className="font-display text-xl font-semibold text-ink">{userName}</p>
          <p className="text-ink-dim text-sm mt-1">User profile and preferences.</p>
        </div>
      </GlassCard>

      <div className="grid sm:grid-cols-3 gap-4">
        <GlassCard className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-blue shrink-0" />
          <span className="text-sm text-ink-dim">Email on file</span>
        </GlassCard>
        <GlassCard className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-blue shrink-0" />
          <span className="text-sm text-ink-dim">Location not set</span>
        </GlassCard>
        <GlassCard className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-blue shrink-0" />
          <span className="text-sm text-ink-dim">Member since —</span>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
