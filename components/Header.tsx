
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  status: string;
  isProcessing: boolean;
  onRefresh: () => void;
  onAnalyze: () => void;
  user: User;
}

const Header: React.FC<HeaderProps> = ({ status, isProcessing, onRefresh, onAnalyze, user }) => {
  return (
    <header className="h-20 bg-slate-800/50 backdrop-blur-md border-b border-slate-700 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">System Status</span>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
            <span className="text-sm font-medium text-slate-200">{status || (isProcessing ? 'Processing...' : 'System Ready')}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onRefresh}
          disabled={isProcessing}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fas fa-sync-alt"></i>
          <span>Fetch News</span>
        </button>

        <button 
          onClick={onAnalyze}
          disabled={isProcessing}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fas fa-brain"></i>
          <span>Analyze Batch</span>
        </button>

        <div className="h-8 w-px bg-slate-700 mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-slate-200">{user.username}</div>
            <div className="text-xs text-slate-400 capitalize">{user.role}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-600 border border-slate-500 flex items-center justify-center text-slate-200">
            <i className="fas fa-user"></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
