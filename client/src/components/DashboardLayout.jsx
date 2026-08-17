import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => (
  <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex gap-8 items-start">
    <Sidebar />
    <div className="flex-1 min-w-0">
      <div className="glass-card p-6 md:p-8">
        {children}
      </div>
    </div>
  </div>
);

export default DashboardLayout;
