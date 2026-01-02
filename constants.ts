
import { Category, RSSFeed } from './types';

export const DEFAULT_FEEDS: RSSFeed[] = [
  { id: '1', name: 'BBC News - World', url: 'http://feeds.bbci.co.uk/news/world/rss.xml', active: true },
  { id: '2', name: 'TechCrunch', url: 'https://techcrunch.com/feed/', active: true },
  { id: '3', name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', active: true },
  { id: '4', name: 'Financial Times', url: 'https://www.ft.com/news-feed?format=rss', active: true },
  { id: '5', name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', active: true }
];

export const CATEGORY_COLORS: Record<string, string> = {
  [Category.POLITICS]: '#f87171',
  [Category.TECH]: '#60a5fa',
  [Category.FINANCE]: '#34d399',
  [Category.SPORTS]: '#fbbf24',
  [Category.ENTERTAINMENT]: '#a78bfa',
  [Category.HEALTH]: '#ec4899',
  [Category.GENERAL]: '#94a3b8'
};
