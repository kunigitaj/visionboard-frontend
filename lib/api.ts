// lib/api.ts

import { Goal } from '@/types/goal';

// Backend API
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// ---- Helper for safe fetch ----
async function safeJsonFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} - ${res.statusText}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

// ---- VisionBoard Backend Endpoints ----

export async function getGoals(): Promise<Goal[]> {
  return safeJsonFetch<Goal[]>(`${API_BASE}/goals`);
}

export async function createGoal(goal: { title: string; description?: string }) {
  await safeJsonFetch<void>(`${API_BASE}/goals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal),
  });
}

export async function deleteGoal(id: string) {
  await safeJsonFetch<void>(`${API_BASE}/goals/${id}`, { method: 'DELETE' });
}

export async function updateGoal(id: string, status: string) {
  await safeJsonFetch<void>(`${API_BASE}/goals/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}