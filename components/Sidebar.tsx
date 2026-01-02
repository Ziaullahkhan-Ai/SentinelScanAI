
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: 'fa-chart-pie' },
    { name: 'Sources', path: '/feeds', icon: 'fa-rss' },
    { name: 'Alerts', path: '/alerts', icon: 'fa-bell' },
  ];

  const clearSystemData = () => {
    if (confirm('System wipe requested. All news and logs will be deleted. Continue?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 hidden md:flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <i className="fas fa-shield-alt text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-bold tracking-tight">SENTINEL<span className="text-indigo-500">AI</span></h1>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                }`}
              >
                <i className={`fas ${item.icon} w-5 ${isActive ? 'text-white' : 'text-indigo-500/60 group-hover:text-indigo-400'}`}></i>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-2">
        <button
          onClick={clearSystemData}
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-amber-400 transition-colors rounded-lg hover:bg-amber-400/5 text-xs font-bold uppercase tracking-widest"
        >
          <i className="fas fa-eraser w-5"></i>
          <span>Wipe System Data</span>
        </button>
        <div className="h-px bg-slate-700 mx-2"></div>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
        >
          <i className="fas fa-sign-out-alt w-5"></i>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
