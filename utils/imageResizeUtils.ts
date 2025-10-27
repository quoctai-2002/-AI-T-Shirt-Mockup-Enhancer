const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Required for tainted canvas
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
};

export const resizeAndDownloadImage = async (
  src: string,
  size: number,
  downloadName: string,
  mimeType: 'image/png' | 'image/jpeg' = 'image/png'
) => {
  try {
    const img = await loadImage(src);

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Use high-quality resizing
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, size, size);

    const resizedDataUrl = canvas.toDataURL(mimeType, 0.95);

    const link = document.createElement('a');
    link.href = resizedDataUrl;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to resize and download image:', error);
    // As a fallback, download the original image if resizing fails
    const link = document.createElement('a');
    link.href = src;
    link.download = downloadName.replace(`-${size}px`, '-original');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
