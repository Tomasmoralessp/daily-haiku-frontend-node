'use client';

import React, { useState } from "react";
import { Button } from "./button";
import { Share2, Heart, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Haiku } from "@/lib/haiku";


interface HaikuDateProps {
  date: string;
  haiku: Haiku;
}

const HaikuImage: React.FC<{ src: string; alt: string; borderRadius?: string; className?: string }> = ({ src, alt, borderRadius = '1rem', className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={cn("relative w-full aspect-square overflow-hidden", className, { 'rounded-2xl': borderRadius })} style={{ borderRadius }}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500 animate-pulse" />
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 dark:bg-red-900">
          <ImageIcon className="w-8 h-8 text-red-500 dark:text-red-400" />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          style={{ objectFit: 'cover', borderRadius }}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setIsLoaded(true);
            setError(true);
          }}
        />
      )}
    </div>
  );
};

const HaikuDate: React.FC<HaikuDateProps> = ({ date, haiku }) => {
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/haiku/${date}`;
    const message = `🌸 Check the haiku for ${date} — timeless poetry from Bashō and beyond.`;

    if (navigator.share) {
      navigator.share({ title: `Haiku for ${date}`, text: message, url: shareUrl }).catch((err) => {
        if (err.name !== 'AbortError') {
          console.error("Error sharing:", err);
          toast.error("Error sharing the haiku.");
        }
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${message} ${shareUrl}`)
        .then(() => toast.success("Link copied to clipboard!"))
        .catch((err) => {
          console.error("Error copying to clipboard:", err);
          toast.error("Could not copy link to clipboard.");
        });
    } else {
      toast.error("Sharing is not supported on this browser.");
    }
  };

  const handleSupportClick = () => {
    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 1000);
    window.open("https://buymeacoffee.com/tomasmorales", "_blank", "noopener,noreferrer");
  };

  let keywordsArray: string[] = [];
  if (typeof haiku.keywords === "string") {
    try {
      const parsed = JSON.parse(haiku.keywords);
      if (Array.isArray(parsed)) keywordsArray = parsed;
    } catch {
      keywordsArray = haiku.keywords.split(',').map(k => k.trim()).filter(Boolean);
      if (keywordsArray.length === 0 && haiku.keywords.trim()) keywordsArray = [haiku.keywords.trim()];
    }
  } else if (Array.isArray(haiku.keywords)) {
    keywordsArray = haiku.keywords.filter((k): k is string => typeof k === 'string' && k.trim() !== '');
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <div className="md:hidden flex flex-col space-y-6">
        <div className="px-4">
          <HaikuImage src={haiku.image_url} alt={haiku.title || `Haiku by ${haiku.author}`} borderRadius="1rem" className="shadow-lg" />
        </div>
        <div className="text-center px-4">
          <p className="text-2xl font-playfair leading-relaxed mb-4 whitespace-pre-line">{haiku.haiku}</p>
          <p className="text-lg uppercase font-inter">{haiku.author}</p>
          <p className="text-gray-400 uppercase text-sm mb-4">{haiku.season}</p>
          {keywordsArray.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {keywordsArray.map((keyword, index) => (
                <span key={index} className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded-full">#{keyword}</span>
              ))}
            </div>
          )}
          <div className="flex justify-center gap-3 mt-2">
            <Button variant="outline" size="sm" onClick={handleShare} className="bg-transparent text-white border-white hover:bg-white hover:text-black transition cursor-pointer rounded-md" aria-label="Share this haiku">
              <Share2 className="mr-1 h-4 w-4" />Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleSupportClick} className={cn("relative overflow-hidden border-gray-700 hover:border-red-500 cursor-pointer hover:text-red-500 transition-colors duration-300 rounded-md", isHeartAnimating ? "border-red-500 text-red-500" : "")} aria-label="Support the author">
              <Heart className={cn("mr-1 h-4 w-4 transition-transform duration-500", isHeartAnimating ? "scale-150 text-red-500" : "")} />Support
              {isHeartAnimating && <span className="absolute inset-0 bg-red-500/10 animate-pulse -z-10" aria-hidden="true" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden md:flex md:flex-row items-center justify-center w-full gap-12 lg:gap-16 px-4">
        <div className="w-2/5 flex flex-col items-center justify-center">
          <HaikuImage src={haiku.image_url} alt={haiku.title || `Haiku by ${haiku.author}`} borderRadius="1rem" className="shadow-lg" />
        </div>
        <div className="w-3/5 flex flex-col items-start justify-center">
          <div className="mb-6 max-w-lg">
            <p className="text-3xl lg:text-4xl font-playfair leading-relaxed mb-6 whitespace-pre-line">{haiku.haiku}</p>
          </div>
          <div>
            <p className="uppercase tracking-wide font-inter text-lg">{haiku.author}</p>
            <p className="uppercase tracking-wide text-gray-400 mb-4">#{haiku.season}</p>
            {keywordsArray.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {keywordsArray.map((keyword, index) => (
                    <span key={index} className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded-full">#{keyword}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={handleShare} className="border-gray-700 hover:bg-gray-800 rounded-md" aria-label="Share this haiku">
                <Share2 className="mr-1 h-4 w-4" />Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleSupportClick} className={cn("relative overflow-hidden border-gray-700 hover:border-red-500 hover:text-red-500 transition-colors duration-300 rounded-md", isHeartAnimating ? "border-red-500 text-red-500" : "")} aria-label="Support the author">
                <Heart className={cn("mr-1 h-4 w-4 transition-transform duration-500", isHeartAnimating ? "scale-150 text-red-500" : "")} />Support
                {isHeartAnimating && <span className="absolute inset-0 bg-red-500/10 animate-pulse -z-10" aria-hidden="true" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HaikuDate;
