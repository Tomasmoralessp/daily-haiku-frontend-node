"use client"
import React from 'react';
import Header from "../../../components/layout/Header";
import HaikuDate from "../../../components/ui/HaikuDate";
import { useParams, notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';

// Asegúrate de que la interfaz Haiku esté disponible aquí o impórtala si es necesario
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
// Genera los metadatos dinámicamente basados en la fecha
export const generateMetadata = async (
    { params }: { params: { date: string } },
    parent: ResolvingMetadata
): Promise<Metadata> => {
    const { date } = params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Validación de la fecha
    if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return {
            title: "Haiku no encontrado",
        }
    }

    try {
        // Fetch data for the specific haiku
        const response = await fetch(`${apiUrl}/api/haiku/${date}`);

        if (!response.ok) {
            // Manejar el caso donde no se encuentra el haiku para la fecha dada
            return {
                title: "Haiku no encontrado",
                description: "No se pudo encontrar el haiku para la fecha seleccionada.",
            };
        }
        const haikuData: Haiku = await response.json();

        // Construct the image URL.  Assumes image_url is a full URL.  Adjust as needed.
        const imageUrl = haikuData.image_url;

        return {
            title: haikuData.title ? `${haikuData.title} | Haiku del ${date}` : `Haiku del ${date}`,
            description: haikuData.haiku,
            openGraph: {
                images: [imageUrl], // Usa la URL de la imagen del haiku
            },
            twitter: {
                images: [imageUrl]
            }
        };
    } catch (error) {
        console.error("Error al obtener metadatos del haiku:", error);
        return {
            title: "Error al cargar Haiku",
            description: "Ocurrió un error al cargar los metadatos del haiku.",
        };
    }
};

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