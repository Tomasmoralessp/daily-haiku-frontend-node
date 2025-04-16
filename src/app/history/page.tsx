'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/layout/Header";

interface HaikuItem {
  date: string;
  haiku: string;
  author: string;
  season: string;
}

const HistoryPage: React.FC = () => {
  const [haikus, setHaikus] = useState<HaikuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHaikuHistory = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/haiku/history`);
        if (!response.ok) throw new Error(`Failed to fetch haiku history: ${response.status}`);
        const data = await response.json();
        setHaikus(data);
      } catch (error) {
        console.error("Error loading haikus:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHaikuHistory();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />

      <main className="flex-1 pt-28 pb-12 px-4 sm:px-6 lg:px-8 sm:max-w-3xl sm:mx-auto">
        <h1 className="text-2xl sm:text-3xl font-playfair mb-6">Haiku History</h1>

        {loading ? (
          <p className="text-gray-400 text-lg sm:text-xl">Loading history...</p>
        ) : haikus.length === 0 ? (
          <p className="text-gray-400 text-lg sm:text-xl">No haikus found.</p>
        ) : (
          <ul className="space-y-4">
            {haikus.map((item) => (
              <li
                key={item.date}
                className="border border-white/10 rounded-lg p-4 sm:p-5 hover:bg-white/5 transition"
              >
                <Link href={`/haiku/${item.date}`} className="block space-y-1">
                  <p className="text-white font-semibold text-base sm:text-lg">{item.date}</p>
                  <p className="text-gray-300 italic text-sm sm:text-base line-clamp-3">{item.haiku}</p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1 uppercase tracking-wide">
                    {item.author} • {item.season}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;
