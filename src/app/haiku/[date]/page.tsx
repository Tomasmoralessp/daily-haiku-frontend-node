"use client"
import Header from "../../../components/layout/Header";
import HaikuDate from "../../../components/ui/HaikuDate";
import { useParams } from 'next/navigation';



const HaikuDatePage: React.FC = () => {
  const { date } = useParams();
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-1 flex flex-col pt-10 px-4 sm:px-6 lg:px-8">
        <div className="flex-1 flex items-center justify-center">
          <HaikuDate date={date} /> {/* ← pasa date así */}
        </div>
      </main>
    </div>
  );
}
export default HaikuDatePage;
