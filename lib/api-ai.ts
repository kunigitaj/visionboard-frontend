// lib/api-ai.ts

// AI Service API
const AI_API_BASE = process.env.NEXT_PUBLIC_AI_API_BASE_URL || 'http://localhost:8000';

// ---- Types for AI Responses ----
type GoalPlanResponse = { plan: string };
type SentimentResponse = { sentiment: string };
type KeywordsResponse = { keywords: string[] };
type PredictResponse = { score: number };
type RephraseResponse = { rephrased: string };

// ---- Helper for safe fetch ----
async function safeJsonFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} - ${res.statusText}`);
  }
  return res.json();
}

// ---- AI Service Endpoints ----

export async function generateGoalPlan(text: string): Promise<string> {
  const data = await safeJsonFetch<GoalPlanResponse>(`${AI_API_BASE}/generate_goal_plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return data.plan;
}

export async function analyzeSentiment(text: string): Promise<string> {
  const data = await safeJsonFetch<SentimentResponse>(`${AI_API_BASE}/sentiment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return data.sentiment;
}

export async function extractKeywords(text: string, top_n = 5): Promise<string[]> {
  const data = await safeJsonFetch<KeywordsResponse>(`${AI_API_BASE}/keywords`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, top_n }),
  });
  return data.keywords;
}

export async function predictGoalSuccess(title: string, description: string): Promise<number> {
  const data = await safeJsonFetch<PredictResponse>(`${AI_API_BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  return data.score;
}

export async function rephraseGoal(text: string): Promise<string> {
  const data = await safeJsonFetch<RephraseResponse>(`${AI_API_BASE}/rephrase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return data.rephrased;
}