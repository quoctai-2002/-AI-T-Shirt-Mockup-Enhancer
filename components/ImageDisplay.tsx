import React, { useState } from 'react';
import { DownloadIcon } from './icons';
import { resizeAndDownloadImage } from '../utils/imageResizeUtils';

interface ImageDisplayProps {
  originalImage: string | null;
  generatedImages: string[] | null;
  collageImage: string | null;
  selectedColors: string[];
}

interface ImageCardProps {
  src: string;
  alt: string;
  onDownload: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ src, alt, onDownload }) => (
  <div className="flex flex-col items-center">
    <h3 className="text-xl font-semibold mb-4 text-gray-300">{alt}</h3>
    <div className="relative group w-full">
      <img src={src} alt={alt} className="rounded-lg shadow-lg w-full h-auto object-contain max-h-[80vh] bg-gray-800/50" />
      <button
        onClick={onDownload}
        className="absolute bottom-4 right-4 bg-orange-600 text-white p-3 rounded-full hover:bg-orange-700 transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500 opacity-0 group-hover:opacity-100"
        aria-label={`Download ${alt}`}
      >
        <DownloadIcon className="h-6 w-6" />
      </button>
    </div>
  </div>
);


export const ImageDisplay: React.FC<ImageDisplayProps> = ({ originalImage, generatedImages, collageImage, selectedColors }) => {
  const [downloadSize, setDownloadSize] = useState<number>(2048);

  if (!generatedImages || generatedImages.length === 0) {
    return null;
  }
  
  const handleDownloadAll = async () => {
    if (!generatedImages) return;
    for (const [index, image] of generatedImages.entries()) {
      const colorName = selectedColors[index]?.toLowerCase().replace(/\s+/g, '-') || `variation-${index + 1}`;
      const downloadName = `ai-variation-${colorName}-${downloadSize}px.png`;
      // Add a small delay between downloads to prevent browser from blocking them
      await new Promise(resolve => setTimeout(resolve, 250));
      await resizeAndDownloadImage(image, downloadSize, downloadName);
    }
  };

  return (
    <div className="w-full mt-12 space-y-16">
      {(originalImage || collageImage) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {originalImage && (
            <ImageCard 
              src={originalImage} 
              alt="Original Mockup" 
              onDownload={() => {
                const downloadName = `original-mockup-${downloadSize}px.png`;
                resizeAndDownloadImage(originalImage, downloadSize, downloadName);
              }}
            />
          )}
          {collageImage && (
             <ImageCard 
              src={collageImage} 
              alt="AI Generated Collage" 
              onDownload={() => {
                const downloadName = `ai-collage-${downloadSize}px.jpg`;
                resizeAndDownloadImage(collageImage, downloadSize, downloadName, 'image/jpeg');
              }}
            />
          )}
        </div>
      )}

      <div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
              Generated Variations
            </h2>
            <div className="flex items-center gap-4 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2">
                <div className="flex items-center gap-2">
                    <label htmlFor="download-size" className="text-sm font-medium text-gray-300 whitespace-nowrap">
                        Size:
                    </label>
                    <select
                        id="download-size"
                        value={downloadSize}
                        onChange={(e) => setDownloadSize(Number(e.target.value))}
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-md focus:ring-orange-500 focus:border-orange-500 block p-1.5 appearance-none"
                    >
                        <option value={2048}>2048px (Web)</option>
                        <option value={4096}>4096px (Print)</option>
                    </select>
                </div>
                <div className="w-px h-6 bg-gray-600"></div>
                <button
                    onClick={handleDownloadAll}
                    className="flex items-center justify-center gap-2 text-white font-semibold rounded-md hover:text-orange-400 transition-all duration-200"
                    aria-label="Download all generated variations"
                >
                    <DownloadIcon className="h-5 w-5" />
                    <span>Download All</span>
                </button>
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {generatedImages.map((image, index) => {
            const colorName = selectedColors[index] || `Variation ${index + 1}`;
            const downloadName = `ai-variation-${colorName.toLowerCase().replace(/\s+/g, '-')}-${downloadSize}px.png`;
            return (
             <div key={index} className="flex flex-col items-center gap-3">
                <div className="relative group w-full">
                    <img src={image} alt={`Generated Variation: ${colorName}`} className="rounded-lg shadow-md w-full h-auto object-cover aspect-square bg-gray-800/50" />
                    <button
                      onClick={() => resizeAndDownloadImage(image, downloadSize, downloadName)}
                      className="absolute bottom-2 right-2 bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500 opacity-0 group-hover:opacity-100"
                      aria-label={`Download ${colorName} variation`}
                    >
                      <DownloadIcon className="h-5 w-5" />
                    </button>
                </div>
                <p className="text-sm font-medium text-gray-300">{colorName}</p>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};