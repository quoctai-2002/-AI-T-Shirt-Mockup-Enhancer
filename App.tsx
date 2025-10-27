
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { ColorSelector } from './components/ColorSelector';
import { ShotSelector, ShotType } from './components/ShotSelector';
import LoadingSpinner from './components/LoadingSpinner';
import { WandIcon } from './components/icons';
import { generateBulkMockups } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import { createCollage } from './utils/collageUtils';

// Popular t-shirt colors found on Etsy
const etsyColors = [
  'Black', 'Pepper', 'White', 'Ivory', 'Yam', 
  'Moss', 'Denim', 'Blue Jean', 'Blossom', 'Crunchberry'
];

const App: React.FC = () => {
  const [mockupFile, setMockupFile] = useState<File | null>(null);
  const [mockupPreview, setMockupPreview] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [shotType, setShotType] = useState<ShotType>('full');
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [collageImage, setCollageImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: File) => {
    setMockupFile(file);
    setGeneratedImages(null);
    setCollageImage(null);
    setError(null);
    if (mockupPreview) {
      URL.revokeObjectURL(mockupPreview);
    }
    setMockupPreview(URL.createObjectURL(file));
  }, [mockupPreview]);
  
  const handleColorChange = useCallback((color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  }, []);

  const handleSelectAllColors = useCallback(() => {
    setSelectedColors(etsyColors);
  }, []);

  const handleClearColors = useCallback(() => {
    setSelectedColors([]);
  }, []);

  const handleShotTypeChange = useCallback((type: ShotType) => {
    setShotType(type);
  }, []);

  const handleGenerateClick = async () => {
    if (!mockupFile) {
      setError('Please upload a mockup image first.');
      return;
    }
    if (selectedColors.length === 0) {
      setError('Please select at least one color.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);
    setCollageImage(null);

    try {
      const { base64, mimeType } = await fileToBase64(mockupFile);
      // Sort selected colors to match the order in etsyColors for consistent collage generation
      const sortedSelectedColors = [...selectedColors].sort((a, b) => etsyColors.indexOf(a) - etsyColors.indexOf(b));

      const resultImageUrls = await generateBulkMockups(base64, mimeType, sortedSelectedColors, shotType);
      setGeneratedImages(resultImageUrls);
      
      if (resultImageUrls && resultImageUrls.length >= 5) {
        const collageDataUrl = await createCollage(resultImageUrls);
        setCollageImage(collageDataUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const canGenerate = !isLoading && !!mockupFile && selectedColors.length > 0;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-7xl mx-auto flex flex-col items-center">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
            AI T-Shirt Mockup Enhancer
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
            Upload your design, select from best-selling colors, and get hyper-realistic mockups ready for your store.
          </p>
        </header>

        <div className="w-full max-w-lg bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-gray-700 backdrop-blur-sm">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">1. Upload Your Mockup</label>
              <ImageUploader onImageUpload={handleImageUpload} />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">2. Select Shirt Colors</label>
               <ColorSelector
                availableColors={etsyColors}
                selectedColors={selectedColors}
                onColorChange={handleColorChange}
                onSelectAll={handleSelectAllColors}
                onClear={handleClearColors}
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">3. Choose Shot Type</label>
               <ShotSelector selectedShot={shotType} onShotChange={handleShotTypeChange} />
            </div>
            <button
              onClick={handleGenerateClick}
              disabled={!canGenerate}
              className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white font-bold py-3 px-4 rounded-md hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <WandIcon className="h-5 w-5" />
                  <span>
                    {selectedColors.length > 0 ? `Generate ${selectedColors.length} Variation(s)` : 'Generate Variations'}
                  </span>
                </>
              )}
            </button>
          </div>
          {error && <p className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
        </div>

        {isLoading && (
          <div className="mt-12">
            <LoadingSpinner count={selectedColors.length} />
          </div>
        )}

        {generatedImages && mockupPreview && (
          <ImageDisplay 
            originalImage={mockupPreview} 
            generatedImages={generatedImages}
            collageImage={collageImage}
            selectedColors={selectedColors}
          />
        )}
      </main>
      <footer className="w-full max-w-7xl mx-auto text-center py-6 mt-8 border-t border-gray-800">
        <p className="text-gray-500 text-sm">Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
