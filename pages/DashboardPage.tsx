
import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { Article, Category } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface DashboardPageProps {
  articles: Article[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ articles }) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const processedArticles = useMemo(() => articles.filter(a => a.processed), [articles]);

  const stats = useMemo(() => {
    const categories: Record<string, number> = {};
    const sentiments = { positive: 0, neutral: 0, negative: 0 };
    
    processedArticles.forEach(a => {
      const cat = a.analysis?.category || 'General';
      categories[cat] = (categories[cat] || 0) + 1;
      
      const score = a.analysis?.sentiment || 0;
      if (score > 0.3) sentiments.positive++;
      else if (score < -0.3) sentiments.negative++;
      else sentiments.neutral++;
    });

    const categoryData = Object.entries(categories).map(([name, value]) => ({ name, value }));
    const sentimentData = [
      { name: 'Positive', value: sentiments.positive, color: '#10b981' },
      { name: 'Neutral', value: sentiments.neutral, color: '#94a3b8' },
      { name: 'Negative', value: sentiments.negative, color: '#ef4444' }
    ];

    return { categoryData, sentimentData };
  }, [processedArticles]);

  const filteredList = useMemo(() => {
    return articles.filter(a => {
      const matchesCat = filterCategory === 'All' || (a.analysis?.category === filterCategory);
      const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.source.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [articles, filterCategory, searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Articles" value={articles.length} icon="fa-newspaper" color="text-blue-400" />
        <StatCard title="Processed (AI)" value={processedArticles.length} icon="fa-robot" color="text-indigo-400" />
        <StatCard 
          title="Avg Sentiment" 
          value={processedArticles.length ? (processedArticles.reduce((acc, a) => acc + (a.analysis?.sentiment || 0), 0) / processedArticles.length).toFixed(2) : 'N/A'} 
          icon="fa-smile" 
          color="text-emerald-400" 
        />
        <StatCard title="Active Alerts" value={processedArticles.filter(a => a.analysis && Math.abs(a.analysis.sentiment) > 0.8).length} icon="fa-exclamation-triangle" color="text-red-400" />
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <i className="fas fa-chart-bar text-indigo-400"></i>
            Category Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as Category] || '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <i className="fas fa-brain text-emerald-400"></i>
            Sentiment Analysis
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {stats.sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 ml-4">
              {stats.sentimentData.map(d => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                  <span className="text-slate-400">{d.name}:</span>
                  <span className="font-semibold text-slate-200">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* News Feed */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <i className="fas fa-list text-slate-400"></i>
            Live Intelligence Feed
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              <input 
                type="text" 
                placeholder="Search intel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
              />
            </div>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Categories</option>
              {Object.values(Category).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-700">
          {filteredList.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <i className="fas fa-inbox text-4xl mb-4 opacity-20"></i>
              <p>No intelligence found for the current filters.</p>
            </div>
          ) : (
            filteredList.map(article => (
              <ArticleRow key={article.id} article={article} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex items-center gap-4 hover:border-slate-600 transition-colors">
    <div className={`w-12 h-12 rounded-xl bg-slate-900/50 flex items-center justify-center text-xl ${color}`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</div>
      <div className="text-2xl font-bold text-slate-100">{value}</div>
    </div>
  </div>
);

const ArticleRow: React.FC<{ article: Article }> = ({ article }) => {
  const [expanded, setExpanded] = useState(false);

  const getSentimentLabel = (score: number) => {
    if (score > 0.3) return { label: 'Positive', color: 'text-emerald-400 bg-emerald-500/10' };
    if (score < -0.3) return { label: 'Negative', color: 'text-red-400 bg-red-500/10' };
    return { label: 'Neutral', color: 'text-slate-400 bg-slate-500/10' };
  };

  const sentiment = article.analysis ? getSentimentLabel(article.analysis.sentiment) : null;

  return (
    <div className={`p-6 transition-colors hover:bg-slate-700/30 ${expanded ? 'bg-slate-700/20' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{article.source}</span>
            <span className="text-xs text-slate-500">{new Date(article.pubDate).toLocaleString()}</span>
            {article.processed && (
              <>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border border-current ${sentiment?.color}`}>
                  {sentiment?.label} ({article.analysis?.sentiment.toFixed(1)})
                </span>
                <span className="text-xs font-medium text-slate-300 bg-slate-700 px-2 py-0.5 rounded">
                  {article.analysis?.category}
                </span>
              </>
            )}
          </div>
          <h4 className="text-lg font-semibold text-slate-100 mb-2 leading-tight">
            <a href={article.link} target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">
              {article.title}
            </a>
          </h4>
          {!article.processed && <div className="text-xs text-amber-500/80 font-medium italic">Pending AI Analysis...</div>}
          
          {article.processed && (
            <div className="mt-3">
              <p className="text-slate-400 text-sm line-clamp-2">{article.analysis?.summary}</p>
              <button 
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold mt-2 uppercase tracking-widest"
              >
                {expanded ? 'Hide Insights' : 'View AI Insights'}
              </button>
            </div>
          )}
        </div>
      </div>

      {expanded && article.analysis && (
        <div className="mt-6 pt-6 border-t border-slate-700/50 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-300">
          <div>
            <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Entities: People</h5>
            <div className="flex flex-wrap gap-2">
              {article.analysis.entities.people.length ? article.analysis.entities.people.map(p => (
                <span key={p} className="text-xs bg-slate-900 px-2 py-1 rounded text-slate-300 border border-slate-800">{p}</span>
              )) : <span className="text-xs text-slate-600">None detected</span>}
            </div>
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Organizations</h5>
            <div className="flex flex-wrap gap-2">
              {article.analysis.entities.organizations.length ? article.analysis.entities.organizations.map(o => (
                <span key={o} className="text-xs bg-slate-900 px-2 py-1 rounded text-slate-300 border border-slate-800">{o}</span>
              )) : <span className="text-xs text-slate-600">None detected</span>}
            </div>
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-500 uppercase mb-3">Locations</h5>
            <div className="flex flex-wrap gap-2">
              {article.analysis.entities.locations.length ? article.analysis.entities.locations.map(l => (
                <span key={l} className="text-xs bg-slate-900 px-2 py-1 rounded text-slate-300 border border-slate-800">{l}</span>
              )) : <span className="text-xs text-slate-600">None detected</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
