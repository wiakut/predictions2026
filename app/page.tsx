'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import predictionsData from '@/src/data/predictions.json';
import { normalizePredictions, getRandomPrediction, getPredictionById, type Prediction } from '@/src/lib/predictions';
import PredictionCard from '@/components/PredictionCard';

// Bokeh circle component
function BokehCircle({ delay = 0, duration = 20, size = 200, x = 0, y = 0 }: { delay?: number; duration?: number; size?: number; x?: number; y?: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-white/30 blur-3xl"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
      }}
      animate={{
        x: [0, 50, -30, 0],
        y: [0, -40, 30, 0],
        scale: [1, 1.2, 0.8, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null);
  const [previousPredictionId, setPreviousPredictionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showHero, setShowHero] = useState(true);

  // Load and normalize predictions
  useEffect(() => {
    try {
      const normalized = normalizePredictions(predictionsData);
      setPredictions(normalized);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading predictions:', error);
      setIsLoading(false);
    }
  }, []);

  // Check for prediction ID in URL on mount
  useEffect(() => {
    if (predictions.length === 0) return;

    const predictionId = searchParams.get('p');
    if (predictionId) {
      const id = parseInt(predictionId, 10);
      if (!isNaN(id)) {
        const prediction = getPredictionById(predictions, id);
        if (prediction) {
          setCurrentPrediction(prediction);
          setPreviousPredictionId(prediction.id);
          setShowHero(false);
        }
      }
    }
  }, [predictions, searchParams]);

  const handleGetPrediction = useCallback(() => {
    if (predictions.length === 0) return;

    setShowHero(false);
    
    // Small delay before showing prediction for smooth transition
    setTimeout(() => {
      const newPrediction = getRandomPrediction(predictions, previousPredictionId);
      setCurrentPrediction(newPrediction);
      setPreviousPredictionId(newPrediction.id);

      // Update URL with prediction ID
      const newUrl = `/?p=${newPrediction.id}`;
      router.replace(newUrl, { scroll: false });
    }, 300);
  }, [predictions, previousPredictionId, router]);

  const handleTryAgain = useCallback(() => {
    if (predictions.length === 0) return;

    const newPrediction = getRandomPrediction(predictions, previousPredictionId);
    setCurrentPrediction(newPrediction);
    setPreviousPredictionId(newPrediction.id);

    // Update URL with prediction ID
    const newUrl = `/?p=${newPrediction.id}`;
    router.replace(newUrl, { scroll: false });
  }, [predictions, previousPredictionId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FDE2E4] via-[#FDF0F0] to-[#FFF1E6]">
        <div className="text-primary-text">Завантаження...</div>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${currentPrediction ? `/?p=${currentPrediction.id}` : ''}`
    : '';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 md:py-16 bg-gradient-to-b from-[#FDE2E4] via-[#FDF0F0] to-[#FFF1E6] overflow-hidden relative">
      {/* Bokeh background circles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <BokehCircle delay={0} duration={25} size={300} x={10} y={20} />
        <BokehCircle delay={5} duration={30} size={250} x={80} y={60} />
        <BokehCircle delay={10} duration={20} size={280} x={50} y={80} />
        <BokehCircle delay={15} duration={35} size={200} x={20} y={70} />
      </div>

      <main className="flex flex-col items-center justify-center space-y-8 md:space-y-12 w-full max-w-4xl relative z-10">
        <AnimatePresence mode="wait">
          {showHero && !currentPrediction ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6 md:space-y-8 w-full"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl md:text-6xl lg:text-7xl font-serif-heading font-bold text-primary-text"
              >
                Твоє передбачення на 2026
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg md:text-xl lg:text-2xl text-primary-text/80 max-w-2xl mx-auto leading-relaxed"
              >
                Відкрий магію нового року. Що принесе тобі цей час?
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="pt-4"
              >
                <motion.button
                  onClick={handleGetPrediction}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="
                    px-8 py-4 md:px-12 md:py-5 bg-accent
                    text-primary-text text-lg md:text-xl font-semibold rounded-full
                    shadow-[0_8px_32px_rgba(255,193,204,0.4)]
                    hover:shadow-[0_12px_40px_rgba(255,193,204,0.6)]
                    transition-shadow duration-300
                  "
                >
                  Отримати передбачення
                </motion.button>
              </motion.div>
            </motion.div>
          ) : currentPrediction ? (
            <motion.div
              key="prediction"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full"
            >
              <PredictionCard
                prediction={currentPrediction}
                onTryAgain={handleTryAgain}
                shareUrl={shareUrl}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FDE2E4] via-[#FDF0F0] to-[#FFF1E6]">
        <div className="text-primary-text">Завантаження...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
