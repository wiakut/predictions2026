'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import type { Prediction } from '@/src/lib/predictions';

interface PredictionCardProps {
  prediction: Prediction;
  onTryAgain: () => void;
  shareUrl: string;
}

// Staggered word animation component
function StaggeredText({ text }: { text: string }) {
  // Split by words and spaces, preserving spaces
  const words = text.split(/(\s+)/);

  return (
    <>
      {words.map((word, index) => {
        // Skip empty strings from split
        if (!word) return null;
        
        return (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              ease: "easeOut"
            }}
            className="inline"
          >
            {word}
          </motion.span>
        );
      })}
    </>
  );
}

export default function PredictionCard({ prediction, onTryAgain, shareUrl }: PredictionCardProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if Web Share API is available
    setCanShare(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateCardImage = async (): Promise<File | null> => {
    if (!cardRef.current) return null;

    setIsGeneratingImage(true);
    
    try {
      // Create a canvas from the card element
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
      });

      // Convert canvas to blob
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'prediction-2026.png', { type: 'image/png' });
            resolve(file);
          } else {
            resolve(null);
          }
          setIsGeneratingImage(false);
        }, 'image/png');
      });
    } catch (error) {
      console.error('Failed to generate image:', error);
      setIsGeneratingImage(false);
      return null;
    }
  };

  const handleShare = async () => {
    // First try to share as image if Web Share API supports files
    const supportsFileShare = typeof navigator !== 'undefined' 
      && 'share' in navigator 
      && 'canShare' in navigator;

    if (supportsFileShare) {
      const imageFile = await generateCardImage();
      
      if (imageFile) {
        try {
          // Check if we can share files
          const shareData: any = {
            title: 'Твоє передбачення на 2026',
            text: prediction.text,
            files: [imageFile],
          };

          // Some browsers support canShare to check if files can be shared
          if (navigator.canShare && navigator.canShare(shareData)) {
            await navigator.share(shareData);
            return;
          }
        } catch (err: any) {
          // If file sharing fails, fall back to text sharing or download
          if (err.name !== 'AbortError') {
            console.error('File share failed, trying download:', err);
          } else {
            // User cancelled
            return;
          }
        }
      }
    }

    // Fallback: Try text sharing or download image
    if (canShare) {
      try {
        await navigator.share({
          title: 'Твоє передбачення на 2026',
          text: prediction.text,
          url: shareUrl,
        });
      } catch (err) {
        // If text sharing also fails, download the image
        const imageFile = await generateCardImage();
        if (imageFile) {
          downloadImage(imageFile);
        }
      }
    } else {
      // No share API, just download the image
      const imageFile = await generateCardImage();
      if (imageFile) {
        downloadImage(imageFile);
      } else {
        // Last resort: copy URL
        handleCopy();
      }
    }
  };

  const downloadImage = (file: File) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="
        bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px]
        shadow-[0_8px_32px_rgba(142,93,103,0.1)]
        p-6 md:p-10 max-w-2xl w-full
      "
    >
      {/* Shareable card content (for image generation) - positioned off-screen for html2canvas */}
      <div
        ref={cardRef}
        className="fixed -left-[9999px] top-0"
        style={{ width: '600px' }}
      >
        <div className="
          bg-gradient-to-b from-[#FDE2E4] via-[#FDF0F0] to-[#FFF1E6]
          p-8 flex items-center justify-center
          min-h-[400px]
        ">
          <div className="
            bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px]
            shadow-[0_8px_32px_rgba(142,93,103,0.1)]
            p-8 w-full
          ">
            <p className="text-sm italic text-primary-text/70 text-center mb-4">
              Твоє передбачення на 2026 рік✨
            </p>
            <p className="text-2xl font-medium text-primary-text leading-relaxed text-center">
              {prediction.text}
            </p>
          </div>
        </div>
      </div>

      {/* Visible card content */}
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-sm italic text-primary-text/70"
          >
            Твоє передбачення на 2026 рік✨
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl md:text-2xl lg:text-3xl font-medium text-primary-text leading-relaxed"
          >
            <StaggeredText text={prediction.text} />
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex justify-center items-center pt-4"
        >
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isGeneratingImage}
            className="
              px-6 py-3 bg-accent text-primary-text font-semibold rounded-full
              shadow-[0_4px_16px_rgba(255,193,204,0.3)]
              hover:shadow-[0_6px_20px_rgba(255,193,204,0.5)]
              transition-all duration-200 w-full sm:w-auto
              flex items-center justify-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isGeneratingImage ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Генерується...
              </>
            ) : copied ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Готово!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Поділитись
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

