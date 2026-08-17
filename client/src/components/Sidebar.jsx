import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, MessageSquareText, Landmark, UserCircle } from 'lucide-react';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/assistant', label: 'AI Assistant', icon: MessageSquareText },
  { to: '/schemes', label: 'Schemes', icon: Landmark },
  { to: '/profile', label: 'Settings', icon: UserCircle },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className="hidden lg:flex w-16 hover:w-60 shrink-0 flex-col gap-1 transition-all duration-300 ease-in-out group min-h-[calc(100vh-180px)]">
      {/* Navigation */}
      <nav className="glass-card p-2 flex flex-col gap-1 h-full">
        {items.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-grad-primary text-white shadow-glow'
                  : 'text-ink-dim hover:text-ink hover:bg-white/[0.05]'
              }`}
              title={item.label}
            >
              <item.icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
