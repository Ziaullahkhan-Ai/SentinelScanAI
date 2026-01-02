
import React, { useState } from 'react';
import { AlertTrigger, AlertHistory, Category } from '../types';

interface AlertsPageProps {
  triggers: AlertTrigger[];
  setTriggers: React.Dispatch<React.SetStateAction<AlertTrigger[]>>;
  history: AlertHistory[];
}

const AlertsPage: React.FC<AlertsPageProps> = ({ triggers, setTriggers, history }) => {
  const [newTrigger, setNewTrigger] = useState<Partial<AlertTrigger>>({
    channel: 'email',
    enabled: true
  });

  const handleAddTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrigger.keyword && !newTrigger.category && newTrigger.sentimentThreshold === undefined) return;

    const trigger: AlertTrigger = {
      id: Date.now().toString(),
      keyword: newTrigger.keyword,
      category: newTrigger.category,
      sentimentThreshold: newTrigger.sentimentThreshold,
      channel: newTrigger.channel as 'email' | 'whatsapp',
      enabled: true
    };

    setTriggers(prev => [...prev, trigger]);
    setNewTrigger({ channel: 'email', enabled: true });
  };

  const removeTrigger = (id: string) => {
    setTriggers(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-1 space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Alert Rules</h2>
          <p className="text-slate-400 text-sm">Automate notifications based on intelligence markers.</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">Create New Rule</h3>
          <form onSubmit={handleAddTrigger} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Trigger by Keyword</label>
              <input 
                type="text" 
                value={newTrigger.keyword || ''}
                onChange={e => setNewTrigger({ ...newTrigger, keyword: e.target.value })}
                placeholder="e.g. Crypto, Election, Cyber"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Trigger by Category</label>
              <select 
                value={newTrigger.category || ''}
                onChange={e => setNewTrigger({ ...newTrigger, category: e.target.value as Category })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Any Category</option>
                {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Sentiment Threshold</label>
              <select 
                value={newTrigger.sentimentThreshold === undefined ? '' : newTrigger.sentimentThreshold}
                onChange={e => setNewTrigger({ ...newTrigger, sentimentThreshold: e.target.value === '' ? undefined : parseFloat(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">No Sentiment Filter</option>
                <option value="-0.8">Extremely Negative (&lt; -0.8)</option>
                <option value="-0.5">Very Negative (&lt; -0.5)</option>
                <option value="0.5">Very Positive (&gt; 0.5)</option>
                <option value="0.8">Extremely Positive (&gt; 0.8)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Delivery Channel</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  type="button"
                  onClick={() => setNewTrigger({ ...newTrigger, channel: 'email' })}
                  className={`py-2 rounded-lg border text-sm font-semibold transition-all ${newTrigger.channel === 'email' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'}`}
                >
                  <i className="fas fa-envelope mr-2"></i> Email
                </button>
                <button 
                  type="button"
                  onClick={() => setNewTrigger({ ...newTrigger, channel: 'whatsapp' })}
                  className={`py-2 rounded-lg border text-sm font-semibold transition-all ${newTrigger.channel === 'whatsapp' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'}`}
                >
                  <i className="fab fa-whatsapp mr-2"></i> WhatsApp
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/20 mt-4"
            >
              Save Alert Rule
            </button>
          </form>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase">Active Rules</h3>
          {triggers.length === 0 ? (
            <div className="text-slate-600 text-sm p-4 bg-slate-800/50 rounded-lg border border-dashed border-slate-700 text-center">No rules defined.</div>
          ) : (
            triggers.map(t => (
              <div key={t.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${t.channel === 'email' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    <i className={t.channel === 'email' ? 'fas fa-envelope' : 'fab fa-whatsapp'}></i>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-200">
                      {t.keyword || t.category || (t.sentimentThreshold !== undefined ? 'Sentiment ' + t.sentimentThreshold : 'Generic')}
                    </div>
                    <div className="text-xs text-slate-500 capitalize">{t.channel} Alert</div>
                  </div>
                </div>
                <button onClick={() => removeTrigger(t.id)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-times-circle text-lg"></i>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden flex flex-col h-full">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <i className="fas fa-history text-slate-400"></i>
              Alert Log History
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {history.length === 0 ? (
              <div className="p-20 text-center text-slate-500">
                <i className="fas fa-satellite-dish text-5xl mb-6 opacity-10"></i>
                <p>Standing by. No alerts triggered yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700">
                {history.map(item => (
                  <div key={item.id} className="p-6 hover:bg-slate-700/20 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${item.channel === 'email' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'}`}>
                            {item.channel}
                          </span>
                          <span className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="text-sm font-bold text-slate-100 mb-1">{item.message}</div>
                        <div className="text-xs text-slate-400 italic">Source: {item.articleTitle}</div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                        <i className="fas fa-bell"></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
