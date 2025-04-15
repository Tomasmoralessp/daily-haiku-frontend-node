// Asegúrate de que la ruta sea algo como: src/components/HaikuDisplay.tsx
"use client"; // ¡Importante! Este componente necesita ser Cliente.

import React, { useEffect, useState } from "react";
import { Button } from "./button"; // Asume que './button' es la ruta correcta en tu proyecto Next
import { Share2, Heart } from "lucide-react";
import { toast } from "sonner"; // Asume que Sonner está configurado globalmente (p. ej., en layout.tsx)
import { Image } from "lucide-react";

// La interfaz Haiku se mantiene igual
interface Haiku {
  id: number;
  haiku: string;
  author: string;
  season: string;
  title?: string | null;
  notes?: string | null;
  source?: string;
  keywords?: string | string[] | null;
  image_url: string;
}

interface HaikuDateProps {
  date: string;
}


const HaikuDisplay: React.FC<HaikuDateProps> = ({ date }) => {
  const [data, setData] = useState<Haiku | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  useEffect(() => {
    // *** CAMBIO CLAVE: Acceso a variable de entorno ***
    // Asegúrate de que NEXT_PUBLIC_API_URL esté definida en tu .env.local
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error("Error: NEXT_PUBLIC_API_URL no está definida.");
      setError("La configuración para cargar datos no está completa.");
      setLoading(false);
      return;
    }

    fetch(`${apiUrl}/api/haiku/${date}`)
      .then((response) => {
        if (!response.ok) {
          // Intenta obtener más detalles del error si es posible
          return response.text().then(text => {
            throw new Error(`Error al obtener el haiku: ${response.status} ${response.statusText} - ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError(error.message || "Ocurrió un error desconocido al cargar el haiku.");
        setLoading(false);
      });
  }, [date]); // El array vacío asegura que se ejecute solo al montar

  const handleShare = () => {
    const today = new Date().toISOString().split("T")[0];
    // Asegúrate que esta URL base sea la correcta para tu app desplegada o local
    const shareUrl = `${window.location.origin}/haiku/${today}`;
    const message = `🌸 Check today's haiku (${today}) — timeless poetry from Bashō and beyond.`;

    if (navigator.share) {
      navigator
        .share({
          title: "Daily Haiku",
          text: message,
          url: shareUrl,
        })
        .catch((err) => {
          // Evitar error si el usuario cancela el share
          if (err.name !== 'AbortError') {
            console.error("Error sharing:", err);
            toast.error("Error sharing the haiku.");
          }
        });
    } else if (navigator.clipboard) {
       // Fallback a copiar al portapapeles si navigator.share no está disponible
      navigator.clipboard.writeText(`${message} ${shareUrl}`)
        .then(() => toast.success("Link copied to clipboard!"))
        .catch(err => {
           console.error("Error copying to clipboard:", err);
           toast.error("Could not copy link to clipboard.");
        });
    } else {
        // Si ninguna opción está disponible (muy raro)
        toast.error("Sharing is not supported on this browser.");
    }
  };

  const handleSupportClick = () => {
    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 1000); // Duración de la animación
    // Abrir enlace en nueva pestaña
    window.open("https://buymeacoffee.com/tomasmorales", "_blank", "noopener,noreferrer");
  };

  // --- Renderizado condicional (se mantiene igual) ---
  if (loading) {
    return (
      // Considera usar un componente Skeleton Loader para mejor UX
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-400 text-xl animate-pulse">Cargando haiku...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-red-400 text-xl">Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-400 text-xl">No hay haiku disponible.</p>
      </div>
    );
  }

  // --- Procesamiento de Keywords (se mantiene igual) ---
  let keywordsArray: string[] = [];
  if (typeof data.keywords === "string") {
    try {
      // Intenta parsear, pero maneja el caso de que ya sea un array en formato string "[tag1, tag2]"
      // o simplemente un string "tag1,tag2"
      const parsed = JSON.parse(data.keywords);
      if (Array.isArray(parsed)) {
         keywordsArray = parsed;
      }
    } catch (error) {
       // Si falla el parseo JSON, quizás es una lista separada por comas
       keywordsArray = data.keywords.split(',').map(k => k.trim()).filter(k => k);
       if(keywordsArray.length === 0 && data.keywords.trim()){ // Si split falla pero hay texto
           keywordsArray = [data.keywords.trim()]; // Trátalo como una sola keyword
       }
      console.warn("Keywords no son un JSON array válido, intentando split por coma:", error);
    }
  } else if (Array.isArray(data.keywords)) {
    keywordsArray = data.keywords;
  }
  // Filtrar posibles strings vacíos si vienen en el array
  keywordsArray = keywordsArray.filter(k => typeof k === 'string' && k.trim() !== '');


  // --- JSX (se mantiene igual, asumiendo que las clases de Tailwind y componentes UI funcionan) ---
  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      {/* Mobile layout */}
      <div className="md:hidden flex flex-col space-y-6">
        {/* Haiku Image */}
        <div className="px-4">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-lg">
             {/* Usar next/image si quieres optimización de imágenes */}
            <Image
              src={data.image_url}
              alt={data.title || `Haiku by ${data.author}`} // Alt text descriptivo
              className="w-full h-auto rounded-2xl object-contain"
              width={50}
              height={50}
              // Podrías añadir width/height si los conoces para evit
              // ar layout shift
            />
          </div>
        </div>

        {/* Haiku Text */}
        <div className="text-center px-4">
          {/* Usar dangerouslySetInnerHTML es arriesgado si 'haiku' viene de usuario */}
          {/* Mejor asegurarse que el backend sanitiza o renderizar como texto */}
          <p className="text-2xl font-playfair leading-relaxed mb-4 whitespace-pre-line">{data.haiku}</p>
          <p className="text-lg uppercase font-medium">{data.author}</p>
          <p className="text-gray-400 uppercase text-sm mb-4">{data.season}</p>

          {/* Keywords */}
          {keywordsArray.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {keywordsArray.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded-full"
                >
                  #{keyword}
                </span>
              ))}
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-center gap-3 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="bg-transparent text-white border-white hover:bg-white hover:text-black transition cursor-pointer "
            aria-label="Share this haiku"
          >
            <Share2 className="mr-1 h-4 w-4" />
            Share
          </Button>



            <Button
              variant="outline"
              size="sm"
              onClick={handleSupportClick}
              className={`relative overflow-hidden border-gray-700 hover:border-red-500 hover:text-red-500 cursor-pointer transition-colors duration-300 ${
                isHeartAnimating ? "border-red-500 text-red-500" : ""
              }`}
              aria-label="Support the author"
            >
              <Heart
                className={`mr-1 h-4 w-4 transition-transform duration-500 ${
                  isHeartAnimating ? "scale-150 text-red-500" : ""
                }`}
                // aria-hidden="true" // Si el texto "Support" es suficiente
              />
              Support
              {isHeartAnimating && (
                <span className="absolute inset-0 bg-red-500/10 animate-pulse -z-10" aria-hidden="true"/>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex md:flex-row items-center justify-center w-full gap-12 lg:gap-16 px-4">
         {/* Image */}
        <div className="w-2/5 flex flex-col items-center justify-center">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg">
             {/* Usar next/image si quieres optimización de imágenes */}
            <Image
              src={data.image_url}
              alt={data.title || `Haiku by ${data.author}`} // Alt text descriptivo
              className="w-full h-full object-cover rounded-2xl"
              width={50}
              height={50}
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent to-black/10 pointer-events-none" aria-hidden="true"/>
          </div>
        </div>

        {/* Texto y metadatos */}
        <div className="w-3/5 flex flex-col items-start justify-center">
          <div className="mb-6 max-w-lg">
            <p className="text-3xl lg:text-4xl font-playfair leading-relaxed mb-6 whitespace-pre-line">{data.haiku}</p>
          </div>

          <div>
            <p className="uppercase tracking-wide font-inter text-lg">{data.author}</p>
            <p className="uppercase tracking-wide text-gray-400 mb-4">#{data.season}</p>

            {keywordsArray.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {keywordsArray.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded-full"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3">
               <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="border-gray-700 hover:bg-gray-800"
                aria-label="Share this haiku"
              >
                <Share2 className="mr-1 h-4 w-4" />
                Share
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSupportClick}
                className={`relative overflow-hidden border-gray-700 hover:border-red-500 hover:text-red-500 transition-colors duration-300 ${
                  isHeartAnimating ? "border-red-500 text-red-500" : ""
                }`}
                aria-label="Support the author"
              >
                <Heart
                  className={`mr-1 h-4 w-4 transition-transform duration-500 ${
                    isHeartAnimating ? "scale-150 text-red-500" : ""
                  }`}
                 // aria-hidden="true"
                />
                Support
                {isHeartAnimating && (
                  <span className="absolute inset-0 bg-red-500/10 animate-pulse -z-10" aria-hidden="true"/>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HaikuDisplay;


// --- Consideración Adicional: Data Fetching en Next.js ---
//
// Este componente actualmente carga los datos en el cliente usando useEffect.
// En Next.js, a menudo es preferible cargar los datos iniciales en el servidor
// dentro del componente Page (ej: src/app/page.tsx o src/app/haiku/[date]/page.tsx).
//
// Si hicieras eso:
// 1. La función Page sería `async` y haría el `Workspace` directamente (sin `useEffect`).
//    Usaría `process.env.API_URL` (sin NEXT_PUBLIC_).
// 2. Pasarías los `data` (o `error`) como props a `<HaikuDisplay data={data} />`.
// 3. Este componente `HaikuDisplay` seguiría necesitando `"use client";` por los botones
//    y la animación, pero podrías quitar el `useEffect` del fetch, y los estados
//    `loading`, `error` y `data`, recibiéndolos como props.
//
// Ejemplo de cómo se vería la página contenedora (simplificado):
/*
   // En src/app/page.tsx (o similar)
   async function getDailyHaiku() {
     const apiUrl = process.env.API_URL; // Variable de servidor
     if (!apiUrl) throw new Error("API URL not configured");
     const res = await fetch(`${apiUrl}/daily_haiku`, { cache: 'no-store' }); // O configurar revalidación
     if (!res.ok) throw new Error("Failed to fetch haiku");
     return res.json();
   }

   export default async function HomePage() {
     try {
       const haikuData = await getDailyHaiku();
       return <HaikuDisplay initialData={haikuData} />; // Pasa datos como prop
     } catch (error) {
       // Manejar error de carga inicial aquí
       return <div>Error cargando haiku: {error.message}</div>;
     }
   }

   // Y en HaikuDisplay:
   // const HaikuDisplay: React.FC<{ initialData: Haiku | null }> = ({ initialData }) => {
   //   const [data, setData] = useState(initialData); // Usar prop para estado inicial
   //   // ... quitar useEffect fetch, loading, error states ...
   //   // ... el resto de la lógica (botones, animación) se mantiene ...
   // }
*/
// Este enfoque mejora el rendimiento inicial y SEO, pero requiere reestructurar un poco.
// La versión actual con useEffect funcionará, pero es menos "idiomática" de Next.js App Router.