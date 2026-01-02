
import React, { useState } from 'react';
import { RSSFeed } from '../types';

interface FeedsPageProps {
  feeds: RSSFeed[];
  setFeeds: React.Dispatch<React.SetStateAction<RSSFeed[]>>;
}

const FeedsPage: React.FC<FeedsPageProps> = ({ feeds, setFeeds }) => {
  const [newFeedName, setNewFeedName] = useState('');
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [error, setError] = useState('');

  const handleAddFeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedName || !newFeedUrl) {
      setError('Please fill in all fields.');
      return;
    }
    
    try {
      new URL(newFeedUrl);
    } catch {
      setError('Invalid URL format.');
      return;
    }

    const newFeed: RSSFeed = {
      id: Date.now().toString(),
      name: newFeedName,
      url: newFeedUrl,
      active: true,
    };

    setFeeds(prev => [...prev, newFeed]);
    setNewFeedName('');
    setNewFeedUrl('');
    setError('');
  };

  const toggleFeed = (id: string) => {
    setFeeds(prev => prev.map(f => f.id === id ? { ...f, active: !f.active } : f));
  };

  const removeFeed = (id: string) => {
    if (confirm('Are you sure you want to remove this feed?')) {
      setFeeds(prev => prev.filter(f => f.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">News Sources</h2>
          <p className="text-slate-400">Configure the RSS feeds Sentinel AI monitors.</p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4">Add New Source</h3>
        <form onSubmit={handleAddFeed} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Source Name</label>
            <input 
              type="text" 
              value={newFeedName}
              onChange={(e) => setNewFeedName(e.target.value)}
              placeholder="e.g. Wall Street Journal"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">RSS URL</label>
            <input 
              type="text" 
              value={newFeedUrl}
              onChange={(e) => setNewFeedUrl(e.target.value)}
              placeholder="https://example.com/rss"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {error && <p className="md:col-span-2 text-red-400 text-sm">{error}</p>}
          <div className="md:col-span-2 flex justify-end">
            <button 
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-lg shadow-indigo-600/20"
            >
              Add Source
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-700">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Source</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">URL</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {feeds.map(feed => (
              <tr key={feed.id} className="hover:bg-slate-700/20 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-semibold text-slate-200">{feed.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-slate-500 truncate block max-w-xs">{feed.url}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold ${
                    feed.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${feed.active ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
                    {feed.active ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => toggleFeed(feed.id)}
                      title={feed.active ? 'Deactivate' : 'Activate'}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        feed.active ? 'text-amber-400 hover:bg-amber-400/10' : 'text-emerald-400 hover:bg-emerald-400/10'
                      }`}
                    >
                      <i className={`fas ${feed.active ? 'fa-pause' : 'fa-play'}`}></i>
                    </button>
                    <button 
                      onClick={() => removeFeed(feed.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedsPage;
