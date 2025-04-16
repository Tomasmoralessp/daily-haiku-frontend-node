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
        const fetchHaikuHistory = async () => { // Changed function name for clarity
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/haiku/history`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch haiku history: ${response.status}`);
                }
                const data = await response.json();
                setHaikus(data);
                setLoading(false);
            } catch (error) {
                console.error("Error loading haikus:", error);
                setLoading(false);
            }
        };
        fetchHaikuHistory();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-black text-white">
            <Header />

            <main className="flex-1 pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
                <h1 className="text-3xl font-playfair mb-6">Haiku History</h1>

                {loading ? (
                    <p className="text-gray-400 text-xl">Loading history...</p>
                ) : haikus.length === 0 ? (
                    <p className="text-gray-400 text-xl">No haikus found.</p>
                ) : (
                    <ul className="space-y-4">
                        {haikus.map((item) => (
                            <li
                                key={item.date}
                                className="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition"
                            >
                                <Link href={`/haiku/${item.date}`} className="block">
                                    <p className="text-white font-semibold">{item.date}</p>
                                    <p className="text-gray-300 italic truncate">{item.haiku}</p>
                                    <p className="text-gray-500 text-sm mt-1 uppercase">
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