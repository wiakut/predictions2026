/**
 * Normalized prediction type
 */
export interface Prediction {
  id: number;
  text: string;
}

/**
 * Raw JSON formats that we support
 */
type RawPredictionString = string;
type RawPredictionObject = { text: string; id?: number };
type RawPredictionsData = 
  | RawPredictionString[]
  | RawPredictionObject[]
  | { predictions: RawPredictionString[] | RawPredictionObject[] };

/**
 * Normalizes predictions data from various formats to a consistent format
 * Supports:
 * - Array of strings: ["...", "..."]
 * - Array of objects: [{ "text": "..." }, ...]
 * - Object with predictions array: { predictions: [...] }
 */
export function normalizePredictions(
  data: RawPredictionsData | { predictions: RawPredictionsData }
): Prediction[] {
  let predictionsArray: (RawPredictionString | RawPredictionObject)[];

  // Handle object wrapper (e.g., { predictions: [...] })
  if (typeof data === 'object' && data !== null && 'predictions' in data) {
    predictionsArray = data.predictions as (RawPredictionString | RawPredictionObject)[];
  } else if (Array.isArray(data)) {
    predictionsArray = data;
  } else {
    throw new Error('Invalid predictions data format');
  }

  // Normalize to Prediction[]
  return predictionsArray.map((item, index) => {
    if (typeof item === 'string') {
      return {
        id: index,
        text: item,
      };
    } else if (typeof item === 'object' && item !== null && 'text' in item) {
      return {
        id: item.id ?? index,
        text: item.text,
      };
    } else {
      throw new Error(`Invalid prediction format at index ${index}`);
    }
  });
}

/**
 * Gets a random prediction that is different from the previous one
 */
export function getRandomPrediction(
  predictions: Prediction[],
  previousId: number | null
): Prediction {
  if (predictions.length === 0) {
    throw new Error('No predictions available');
  }

  if (predictions.length === 1) {
    return predictions[0];
  }

  // Filter out the previous prediction if it exists
  const availablePredictions = previousId !== null
    ? predictions.filter(p => p.id !== previousId)
    : predictions;

  // Select random prediction from available ones
  const randomIndex = Math.floor(Math.random() * availablePredictions.length);
  return availablePredictions[randomIndex];
}

/**
 * Gets a prediction by ID
 */
export function getPredictionById(
  predictions: Prediction[],
  id: number
): Prediction | null {
  return predictions.find(p => p.id === id) ?? null;
}

