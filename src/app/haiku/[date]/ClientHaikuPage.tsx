// src/app/haiku/[date]/ClientHaikuPage.tsx (Client Component)
'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import HaikuDate from '../../../components/ui/HaikuDate'
import Header from '../../../components/layout/Header'

const ClientHaikuPage = () => {
    const { date } = useParams();

    if (!date || typeof date !== 'string' || !/^\d{4}-\d{02}-\d{02}$/.test(date)) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-black">
                <p className="text-red-400 text-xl">Fecha no válida</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-black text-white">
            <Header />
            <main className="flex-1 flex flex-col pt-10 px-4 sm:px-6 lg:px-8">
                <div className="flex-1 flex items-center justify-center">
                    <HaikuDate date={date} />
                </div>
            </main>
        </div>
    );
};

export default ClientHaikuPage;