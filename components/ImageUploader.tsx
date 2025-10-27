
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFileName(file.name);
      onImageUpload(file);
    }
  };
  
  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(file));
        setFileName(file.name);
        onImageUpload(file);
    }
  }, [onImageUpload]);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="w-full">
      <label htmlFor="file-upload" className="cursor-pointer">
        <div 
          onDrop={onDrop}
          onDragOver={onDragOver}
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          {preview ? (
            <img src={preview} alt="Mockup preview" className="h-full w-full object-contain p-2" />
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
              <UploadIcon className="w-10 h-10 mb-3" />
              <p className="mb-2 text-sm"><span className="font-semibold text-orange-400">Click to upload</span> or drag and drop</p>
              <p className="text-xs">PNG, JPG, or WEBP</p>
            </div>
          )}
        </div>
      </label>
      <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
      {fileName && <p className="text-sm text-gray-400 mt-2 text-center">Selected: {fileName}</p>}
    </div>
  );
};
