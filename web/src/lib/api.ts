export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export type SitePage = {
  address: string;
  title: string;
  body: string;
  authorName: string;
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
