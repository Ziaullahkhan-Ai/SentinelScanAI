
import { Article, RSSFeed } from "../types";
import { analyzeArticle } from "./geminiService";

// Helper to fetch RSS and convert to JSON (bypassing CORS issues via public proxy)
export async function fetchRSSFeed(feed: RSSFeed): Promise<Article[]> {
  try {
    // Using a public RSS to JSON converter
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
    const data = await response.json();

    if (data.status !== 'ok') {
      throw new Error(data.message || 'Failed to fetch RSS');
    }

    return data.items.map((item: any) => ({
      id: item.guid || item.link,
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      content: item.description || item.content || '',
      source: feed.name,
      processed: false,
    }));
  } catch (error) {
    console.error(`Error fetching feed ${feed.name}:`, error);
    return [];
  }
}

export async function processArticle(article: Article): Promise<Article> {
  const analysis = await analyzeArticle(article.title, article.content);
  return {
    ...article,
    analysis,
    processed: true,
  };
}
