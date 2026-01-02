
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Article, RSSFeed, AlertTrigger, AlertHistory, User, Category } from './types';
import { DEFAULT_FEEDS } from './constants';
import { fetchRSSFeed, processArticle } from './services/newsService';

// Pages
import DashboardPage from './pages/DashboardPage';
import FeedsPage from './pages/FeedsPage';
import AlertsPage from './pages/AlertsPage';
import LoginPage from './pages/LoginPage';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatBot from './components/ChatBot';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sentinel_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('sentinel_articles');
    return saved ? JSON.parse(saved) : [];
  });

  const [feeds, setFeeds] = useState<RSSFeed[]>(() => {
    const saved = localStorage.getItem('sentinel_feeds');
    return saved ? JSON.parse(saved) : DEFAULT_FEEDS;
  });

  const [triggers, setTriggers] = useState<AlertTrigger[]>(() => {
    const saved = localStorage.getItem('sentinel_triggers');
    return saved ? JSON.parse(saved) : [];
  });

  const [alertHistory, setAlertHistory] = useState<AlertHistory[]>(() => {
    const saved = localStorage.getItem('sentinel_alert_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Persistence
  useEffect(() => {
    if (user) localStorage.setItem('sentinel_user', JSON.stringify(user));
    else localStorage.removeItem('sentinel_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sentinel_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('sentinel_feeds', JSON.stringify(feeds));
  }, [feeds]);

  useEffect(() => {
    localStorage.setItem('sentinel_triggers', JSON.stringify(triggers));
  }, [triggers]);

  useEffect(() => {
    localStorage.setItem('sentinel_alert_history', JSON.stringify(alertHistory));
  }, [alertHistory]);

  const refreshNews = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setStatusMsg('Polling intelligence sources...');

    try {
      let newArticles: Article[] = [];
      const activeFeeds = feeds.filter(f => f.active);
      
      for (const feed of activeFeeds) {
        const items = await fetchRSSFeed(feed);
        newArticles = [...newArticles, ...items];
      }

      setArticles(prev => {
        const existingIds = new Set(prev.map(a => a.id));
        const uniqueNew = newArticles.filter(a => !existingIds.has(a.id));
        return [...uniqueNew, ...prev].slice(0, 500);
      });

      setStatusMsg(`Polled ${activeFeeds.length} feeds. Found ${newArticles.length} items.`);
    } catch (err) {
      console.error(err);
      setStatusMsg('Failed to sync feeds.');
    } finally {
      setIsProcessing(false);
    }
  }, [feeds, isProcessing]);

  const runAnalysis = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    const unprocessed = articles.filter(a => !a.processed).slice(0, 10);
    if (unprocessed.length === 0) {
      setStatusMsg('All items analyzed.');
      setIsProcessing(false);
      return;
    }

    setStatusMsg(`Analyzing batch of ${unprocessed.length}...`);
    
    try {
      const updatedArticles = [...articles];
      for (const art of unprocessed) {
        const idx = updatedArticles.findIndex(a => a.id === art.id);
        if (idx !== -1) {
          const processed = await processArticle(art);
          updatedArticles[idx] = processed;
          checkTriggers(processed);
        }
      }
      setArticles(updatedArticles);
      setStatusMsg('Intelligence processing successful.');
    } catch (err) {
      console.error(err);
      setStatusMsg('AI processing error.');
    } finally {
      setIsProcessing(false);
    }
  }, [articles, isProcessing, triggers]);

  const checkTriggers = useCallback((article: Article) => {
    if (!article.analysis) return;
    
    triggers.forEach(t => {
      if (!t.enabled) return;

      let triggered = false;
      const lowerTitle = article.title.toLowerCase();
      
      if (t.keyword && lowerTitle.includes(t.keyword.toLowerCase())) triggered = true;
      
      if (t.sentimentThreshold !== undefined) {
        if (t.sentimentThreshold < 0 && article.analysis!.sentiment <= t.sentimentThreshold) triggered = true;
        if (t.sentimentThreshold > 0 && article.analysis!.sentiment >= t.sentimentThreshold) triggered = true;
      }
      
      if (t.category && article.analysis!.category === t.category) triggered = true;

      if (triggered) {
        const newAlert: AlertHistory = {
          id: Date.now().toString() + Math.random(),
          timestamp: new Date().toISOString(),
          articleTitle: article.title,
          channel: t.channel,
          message: `CRITICAL ALERT: Intelligence hit for [${t.keyword || t.category || 'Marker'}] in ${article.source}`
        };
        setAlertHistory(prev => [newAlert, ...prev]);
      }
    });
  }, [triggers]);

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={setUser} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="flex h-screen bg-slate-900 text-slate-50 overflow-hidden selection:bg-indigo-500/30">
        <Sidebar onLogout={handleLogout} />
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <Header 
            status={statusMsg} 
            isProcessing={isProcessing} 
            onRefresh={refreshNews} 
            onAnalyze={runAnalysis}
            user={user}
          />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
            <Routes>
              <Route path="/" element={<DashboardPage articles={articles} />} />
              <Route path="/feeds" element={<FeedsPage feeds={feeds} setFeeds={setFeeds} />} />
              <Route path="/alerts" element={<AlertsPage triggers={triggers} setTriggers={setTriggers} history={alertHistory} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <ChatBot articles={articles} />
        </div>
      </div>
    </Router>
  );
};

export default App;
