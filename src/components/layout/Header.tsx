import React from "react";
import Link from "next/link";
import Image from "next/image";

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-5 flex justify-between items-center backdrop-blur-lg bg-black/70 border-b border-white/5">
      {/* Logo con texto */}
      <Link href="/" className="flex items-center space-x-2">
      <span className="font-playfair text-xl tracking-wider text-white">
          DailyHaiku
        </span>
        <Image
          src="/favicon.ico" 
          alt="Logo Daily Haiku"
          width={24}
          height={24}
        />
      </Link>

      {/* Navegación Principal */}
      <nav className="flex items-center space-x-5">
        <Link
          href="/history"
          className="text-sm text-gray-300 hover:text-pink-300 transition font-medium"
        >
          History
        </Link>
        <Link
          href="/about"
          className="text-sm text-gray-300 hover:text-pink-300 transition font-medium"
        >
          About the project
        </Link>
      </nav>
    </header>
  );
};

export default Header;