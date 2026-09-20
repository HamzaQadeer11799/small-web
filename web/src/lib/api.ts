export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export type SitePage = {
  address: string;
  title: string;
  body: string;
  authorName: string;
};

export type PersonRow = {
  id: string;
  name: string;
};

export type VisitWay =
  | 'typed'
  | 'link'
  | 'back'
  | 'forward'
  | 'history'
  | 'search';

export type HistoryRow = {
  address: string;
  at: string;
  via: VisitWay;
};

export type SearchHit = {
  address: string;
  title: string;
};

export function normalizeAddress(value: string): string {
  return value.trim().toLowerCase();
}

export async function fetchSite(
  address: string,
): Promise<{ page: SitePage | null; missing: boolean }> {
  const response = await fetch(
    `${API_URL}/sites/${encodeURIComponent(address)}`,
  );

  if (response.status === 404) {
    return { page: null, missing: true };
  }

  if (!response.ok) {
    throw new Error('Could not load that address');
  }

  const page = (await response.json()) as SitePage;
  return { page, missing: false };
}

export async function publishSite(input: {
  personId: string;
  address: string;
  body: string;
}): Promise<SitePage> {
  const response = await fetch(`${API_URL}/sites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error(
      response.status === 409
        ? 'That address is already taken'
        : 'Could not publish',
    );
  }
  return (await response.json()) as SitePage;
}

export async function fetchSearch(q: string): Promise<SearchHit[]> {
  const response = await fetch(
    `${API_URL}/sites?q=${encodeURIComponent(q)}`,
  );
  if (!response.ok) {
    throw new Error('Could not search');
  }
  return (await response.json()) as SearchHit[];
}

export async function fetchPeople(): Promise<PersonRow[]> {
  const response = await fetch(`${API_URL}/people`);
  if (!response.ok) {
    throw new Error('Could not load people');
  }
  return (await response.json()) as PersonRow[];
}

export async function fetchHistory(personId: string): Promise<HistoryRow[]> {
  const response = await fetch(`${API_URL}/people/${personId}/history`);
  if (!response.ok) {
    throw new Error('Could not load history');
  }
  return (await response.json()) as HistoryRow[];
}

export async function recordVisit(input: {
  personId: string;
  address: string;
  via: VisitWay;
}): Promise<void> {
  await fetch(`${API_URL}/visits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}
