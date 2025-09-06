
import React from 'react';
import { type Prediction } from '../types';
import { CalendarIcon, ClockIcon } from './IconComponents';

interface PredictionDisplayProps {
  prediction: Prediction;
  onReset: () => void;
}

const TimeCard: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-gray-700 p-4 rounded-lg w-24 h-24 shadow-inner">
    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{value}</span>
    <span className="text-sm text-gray-600 dark:text-gray-300 uppercase tracking-wider">{label}</span>
  </div>
);

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ prediction, onReset }) => {
  return (
    <div className="text-center animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Hepa Predict Analysis Complete
      </h2>
      
      <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap my-8">
        <TimeCard value={prediction.years} label="Years" />
        <TimeCard value={prediction.months} label="Months" />
        <TimeCard value={prediction.hours} label="Hours" />
        <TimeCard value={prediction.minutes} label="Minutes" />
        <TimeCard value={prediction.seconds} label="Seconds" />
      </div>

      <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg text-left mt-8">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">Clinical Summary</h3>
        <p className="text-gray-600 dark:text-gray-300">
          {prediction.summary}
        </p>
      </div>

      <div className="mt-8">
         <button
            onClick={onReset}
            className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
         >
            Start New Analysis
        </button>
      </div>
    </div>
  );
};

export default PredictionDisplay;
