"use client"

import React from 'react'
import { useParams, notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import HaikuDate from '@/components/ui/HaikuDate'

export default function ClientHaikuPage() {
  const { date } = useParams()

  if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    notFound()
    return null
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
  )
}
