
export enum Category {
  POLITICS = 'Politics',
  TECH = 'Tech',
  FINANCE = 'Finance',
  SPORTS = 'Sports',
  ENTERTAINMENT = 'Entertainment',
  HEALTH = 'Health',
  GENERAL = 'General'
}

export interface AnalysisResult {
  summary: string;
  category: Category;
  sentiment: number; // -1 to +1
  confidence: number;
  entities: {
    people: string[];
    organizations: string[];
    locations: string[];
  };
}

export interface Article {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  content: string;
  source: string;
  analysis?: AnalysisResult;
  processed: boolean;
}

export interface RSSFeed {
  id: string;
  name: string;
  url: string;
  active: boolean;
  lastFetch?: string;
}

export interface AlertTrigger {
  id: string;
  keyword?: string;
  sentimentThreshold?: number;
  category?: Category;
  channel: 'email' | 'whatsapp';
  enabled: boolean;
}

export interface AlertHistory {
  id: string;
  timestamp: string;
  articleTitle: string;
  channel: string;
  message: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'viewer';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  sources?: { title: string; uri: string }[];
}
