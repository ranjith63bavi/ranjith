
import React, { useState, useCallback } from 'react';
import { getHepaPrediction } from './services/geminiService';
import { type Prediction } from './types';
import FileUpload from './components/FileUpload';
import PredictionDisplay from './components/PredictionDisplay';
import { AppHeader, AppFooter } from './components/LayoutComponents';
import { LoadingSpinner } from './components/IconComponents';

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles));
      setPrediction(null);
      setError(null);
    }
  };

  const handleAnalysis = useCallback(async () => {
    if (files.length === 0) {
      setError("Please upload medical documents first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const fileNames = files.map(f => f.name);
      const result = await getHepaPrediction(fileNames);
      setPrediction(result);
    } catch (err) {
      console.error("Error during analysis:", err);
      setError("An error occurred during the AI analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [files]);
  
  const resetState = () => {
    setFiles([]);
    setPrediction(null);
    setIsLoading(false);
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
        <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-10 transition-all duration-300">
          {!prediction && !isLoading && (
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Evaluate HCC Treatment Response
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Upload TR-MRI and TE-MRI documents to get an AI-powered prediction.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          
          {!prediction && (
             <FileUpload onFileChange={handleFileChange} fileCount={files.length} />
          )}

          {files.length > 0 && !isLoading && !prediction && (
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Selected Files:</h3>
              <ul className="list-disc list-inside mt-2">
                {files.map((file, index) => <li key={index}>{file.name}</li>)}
              </ul>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center p-8">
              <LoadingSpinner />
              <p className="text-lg font-semibold mt-4 text-gray-700 dark:text-gray-300">Hepa Predict is analyzing...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This may take a moment. Please wait.</p>
            </div>
          )}

          {prediction && !isLoading && (
            <PredictionDisplay prediction={prediction} onReset={resetState} />
          )}

          <div className="mt-8 flex justify-center">
            {!isLoading && !prediction && (
              <button
                onClick={handleAnalysis}
                disabled={files.length === 0 || isLoading}
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
              >
                Analyze Treatment Response
              </button>
            )}
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
};

export default App;
