import React from "react";
import Link from "next/link";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-white text-center bg-black">
      <h1 className="text-4xl sm:text-5xl font-semibold mb-10 tracking-tight">
        A Pause in the Scroll
      </h1>

      <p className="text-lg sm:text-xl text-gray-300 mb-6 leading-relaxed max-w-2xl">
        <span className="font-medium text-white">DailyHaiku</span> is a quiet digital space —  
        a moment of stillness in a noisy feed.
      </p>

      <p className="text-md sm:text-lg text-gray-400 mb-6 leading-relaxed max-w-2xl">
        Every haiku shared here is a real poem, written centuries ago by masters like 
        <span className="text-white font-medium"> Bashō, Buson, and Issa</span>.  
        These are English translations, curated daily with care.
      </p>

      <p className="text-md sm:text-lg text-gray-500 mb-12 leading-relaxed max-w-2xl italic">
        No algorithms. No AI. Just timeless verses — one per day.
      </p>

      <a
        href="https://buymeacoffee.com/tomasmorales"
        target="_blank"
        className="inline-block border border-white text-white font-medium px-6 py-3 rounded-full hover:bg-white hover:text-black transition"
      >
        Support the project
      </a>

      <div className="mt-12">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-white transition underline"
        >
          ← Back to today&apos;s haiku
        </Link>
      </div>

      <footer className="mt-16 text-sm text-gray-500">
        <p className="mb-2">Created with care by Tomás Morales Galván</p>
        <a
          href="https://github.com/Tomasmoralessp"
          target="_blank"
          className="underline hover:text-white transition"
        >
          github.com/Tomasmoralessp
        </a>
      </footer>
    </div>
  );
};

export default AboutPage;
