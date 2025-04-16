import React from 'react';
import Header from "../../../components/layout/Header";
import HaikuDate from "../../../components/ui/HaikuDate";
import { useParams, notFound } from 'next/navigation';

const HaikuDatePage: React.FC = () => {
  const { date } = useParams();

  // Validación de la fecha
  if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    notFound();
    return null; // Añadido para satisfacer el tipo de retorno de Next.js
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
}
export default HaikuDatePage;
