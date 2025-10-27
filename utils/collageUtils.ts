
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
};

export const createCollage = async (imageSources: string[]): Promise<string> => {
  if (imageSources.length < 5) {
    throw new Error("Need at least 5 images to create a collage.");
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  const images = await Promise.all(imageSources.slice(0, 5).map(loadImage));

  const largeSize = 1024;
  const smallSize = largeSize / 2;
  const padding = 20;

  canvas.width = largeSize + smallSize * 2 + padding * 3;
  canvas.height = largeSize + padding * 2;

  ctx.fillStyle = '#111827'; // bg-gray-900
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(images[0], padding, padding, largeSize, largeSize);

  const startX = largeSize + padding * 2;
  ctx.drawImage(images[1], startX, padding, smallSize, smallSize);
  ctx.drawImage(images[2], startX + smallSize + padding, padding, smallSize, smallSize);
  ctx.drawImage(images[3], startX, padding + smallSize + padding, smallSize, smallSize);
  ctx.drawImage(images[4], startX + smallSize + padding, padding + smallSize + padding, smallSize, smallSize);

  return canvas.toDataURL('image/jpeg', 0.95);
};
