import React from "react";
import Link from "next/link"; // Importa Link de Next.js
// Ya no importamos useState, usePathname, useIsMobile, Menu, X, etc.

const Header: React.FC = () => {
  // No necesitamos estado ni lógica de hooks aquí

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-5 flex justify-between items-center backdrop-blur-lg bg-black/70 border-b border-white/5">
      {/* Logo Link */}
      <Link href="/" className="font-playfair text-xl tracking-wider text-white">
        DailyHaiku 🌸
      </Link>

      {/* Navegación Principal */}
      {/* Nota: Sin los hooks, no hay lógica integrada aquí para un menú móvil tipo "hamburguesa" */}
      {/* o para resaltar el enlace activo. Esto tendría que manejarse de otra forma si es necesario */}
      {/* (p. ej., CSS puro para responsive, o pasar props si el estado se maneja más arriba). */}
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

      {/* Ya no hay botón de menú móvil aquí porque quitamos el estado */}

    </header>
  );
};

export default Header;