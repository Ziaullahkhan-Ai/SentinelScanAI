
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { AnalysisResult, Category } from "../types";

// Safe retrieval of API Key
const getApiKey = () => {
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  return (window as any).API_KEY || '';
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise 2-3 sentence summary of the article content.",
    },
    category: {
      type: Type.STRING,
      description: "Classification of the article.",
      enum: Object.values(Category),
    },
    sentiment: {
      type: Type.NUMBER,
      description: "Sentiment score from -1 (very negative) to +1 (very positive).",
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence level in the analysis from 0 to 1.",
    },
    entities: {
      type: Type.OBJECT,
      properties: {
        people: { type: Type.ARRAY, items: { type: Type.STRING } },
        organizations: { type: Type.ARRAY, items: { type: Type.STRING } },
        locations: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["people", "organizations", "locations"],
    },
  },
  required: ["summary", "category", "sentiment", "confidence", "entities"],
};

export async function analyzeArticle(title: string, content: string): Promise<AnalysisResult> {
  if (!apiKey) {
    console.error("API Key missing. Cannot analyze article.");
    return fallbackResult();
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following news article:
      Title: ${title}
      Content Snippet: ${content.substring(0, 2000)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
      },
    });

    const text = response.text || "{}";
    const result = JSON.parse(text.trim());
    return result as AnalysisResult;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return fallbackResult();
  }
}

function fallbackResult(): AnalysisResult {
  return {
    summary: "Analysis unavailable. Please check system logs or API configuration.",
    category: Category.GENERAL,
    sentiment: 0,
    confidence: 0,
    entities: { people: [], organizations: [], locations: [] },
  };
}

export function createSentinelChat(context: string): Chat {
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `You are Sentinel Analyst, an expert media intelligence AI. 
      You help users interpret news data, identify trends, and analyze global events.
      Context of currently loaded news: ${context.substring(0, 5000)}
      Always be professional, insightful, and data-driven. 
      Use Google Search grounding for any queries about recent news not in the provided context.`,
      tools: [{ googleSearch: {} }]
    },
  });
}
