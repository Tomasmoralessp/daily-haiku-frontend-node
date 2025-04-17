// Define the Haiku interface here, or import it from its source
export interface Haiku {
  id: number;
  haiku: string;
  author: string;
  season: string;
  title?: string | null;
  notes?: string | null;
  source?: string;
  keywords?: string | string[] | null;
  image_url: string;
}

export async function getHaikuData(date: string): Promise<Haiku> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/haiku/${date}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch haiku: ${response.status} ${response.statusText}`);
  }
  return response.json();
}