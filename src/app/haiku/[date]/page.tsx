// src/app/haiku/[date]/page.tsx (Server Component)
import { Metadata } from 'next';
import ClientHaikuPage from './ClientHaikuPage';
import { Haiku } from '@/components/ui/HaikuDate'; // Asegúrate de que esta interfaz esté accesible

// Genera los metadatos dinámicamente basados en la fecha
export const generateMetadata = async ({ params }: { params: { date: string } }): Promise<Metadata> => {
    const { date } = params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Validación de la fecha
    if (!date || typeof date !== 'string' || !/^\d{4}-\d{02}-\d{02}$/.test(date)) {
        return {
            title: "Haiku no encontrado",
            description: "No se encontró el haiku para la fecha especificada.",
        };
    }

    try {
        // Fetch data for the specific haiku
        const response = await fetch(`${apiUrl}/api/haiku/${date}`);
        if (!response.ok) {
            // Manejar el caso donde no se encuentra el haiku para la fecha dada
            if (response.status === 404) {
                return {
                    title: "Haiku no encontrado",
                    description: "No existe un haiku para esta fecha.",
                };
            } else {
                // Manejar otros errores
                return {
                    title: "Error al cargar Haiku",
                    description: "Ocurrió un error al cargar los detalles del haiku.",
                };
            }
        }
        const haikuData: Haiku = await response.json();

        // Formatear la fecha para usarla en los metadatos
        const prettyDate = new Date(date).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

        // Usar directamente la URL de Supabase desde haikuData.image_url
        const imageUrl = haikuData.image_url;

        return {
            title: haikuData.title ? `${haikuData.title} | Haiku del ${prettyDate}` : `Haiku del ${prettyDate}`,
            description: `Haiku publicado el ${prettyDate}. ${haikuData.haiku}`, // Incluye el haiku en la descripción
            openGraph: {
                title: haikuData.title ? `${haikuData.title} | Haiku para el ${prettyDate}` : `Haiku para el ${prettyDate}`,
                description: `Descubre el haiku diario, poesía atemporal. ${haikuData.haiku}`,
                url: `https://dailyhaiku.vercel.app/haiku/${date}`, // Usa una URL absoluta
                images: [
                    {
                        url: imageUrl,
                        width: 1200,  // Proporciona las dimensiones
                        height: 630,
                        alt: haikuData.title ? `Haiku: ${haikuData.title}` : `Haiku del ${prettyDate}`,
                    },
                ],
                type: 'article',
            },
            twitter: {
                card: 'summary_large_image',
                title: haikuData.title ? `${haikuData.title} | Haiku para el ${prettyDate}` : `Haiku para el ${prettyDate}`,
                description: `Descubre poesía japonesa todos los días. ${haikuData.haiku}`,
                images: [imageUrl], // Usa la URL absoluta
            },
        };
    } catch (error) {
        console.error("Error al obtener metadatos del haiku:", error);
        return {
            title: "Error al cargar Haiku",
            description: "Ocurrió un error al cargar los metadatos del haiku.",
        };
    }
};

const Page = () => {
    return <ClientHaikuPage />;
};

export default Page;

