// src/lib/QueryProvider.tsx
"use client"; // Marca este componente como Cliente

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Usamos useState para asegurar que QueryClient se cree una sola vez en el cliente
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}