'use client';

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  MutableRefObject,
} from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';

/* ──────────────── Types ──────────────── */
interface HaikuItem {
  date: string;
  haiku: string;
  author: string;
  season: string;
}

interface ApiResponse {
  items: HaikuItem[];
  nextPage: number | null;
}

/* ───────────── Config ───────────── */
const PAGE_SIZE = 20;        // items per request
const ROOT_MARGIN = '150px'; // preload when sentinel 150 px before viewport

/* ──────────── Component ─────────── */
export default function HistoryPage() {
  /* State */
  const [haikus, setHaikus] = useState<HaikuItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  /* Sentinel element */
  const loaderRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  /* Fetch one page */
  const loadPage = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/haiku/history?page=${page}&limit=${PAGE_SIZE}`
      );
      if (!res.ok) throw new Error(`Failed to fetch page ${page}`);
      const data: ApiResponse = await res.json();

      setHaikus(prev => [...prev, ...data.items]);
      setPage(data.nextPage ?? page + 1);
      setHasMore(Boolean(data.nextPage));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  /* Load first page on mount */
  useEffect(() => {
    loadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Infinite scroll with IntersectionObserver */
  useEffect(() => {
    if (!hasMore) return; // nothing left → no observer

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) loadPage();
      },
      { rootMargin: ROOT_MARGIN }
    );

    const node = loaderRef.current;
    if (node) observer.observe(node);

    /* Cleanup */
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [loadPage, hasMore]);

  /* ────────────── JSX ────────────── */
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />

      <main className="flex-1 pt-28 pb-12 px-4 sm:px-6 lg:px-8 sm:max-w-3xl sm:mx-auto">
        <h1 className="text-2xl sm:text-3xl font-playfair mb-6">Haiku History</h1>

        {haikus.length === 0 && !loading && (
          <p className="text-gray-400 text-lg sm:text-xl">No haikus found.</p>
        )}

        <ul className="space-y-4">
          {haikus.map(item => (
            <li
              key={item.date}
              className="border border-white/10 rounded-lg p-4 sm:p-5 hover:bg-white/5 transition"
            >
              <Link href={`/haiku/${item.date}`} className="block space-y-1">
                <p className="text-white font-semibold">{item.date}</p>
                <p className="text-gray-300 italic line-clamp-3">{item.haiku}</p>
                <p className="text-gray-500 text-xs mt-1 uppercase tracking-wide">
                  {item.author} &bull; {item.season}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        {/* Sentinel / loader */}
        <div ref={loaderRef} className="mt-6 flex justify-center">
          {loading && <p className="text-gray-400">Loading…</p>}
          {!hasMore && haikus.length > 0 && (
            <p className="text-gray-500 text-sm">End of history</p>
          )}
        </div>
      </main>
    </div>
  );
}
