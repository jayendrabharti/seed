export const cropImageToSquare = (
  imageFile: File,
): Promise<{ croppedFile: File; previewUrl: string }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(imageFile);

    img.onload = () => {
      // Clean up the temporary object URL
      URL.revokeObjectURL(objectUrl);

      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Calculate square dimensions (using the smaller dimension)
      const size = Math.min(img.width, img.height);
      canvas.width = size;
      canvas.height = size;

      // Calculate center crop position
      const startX = (img.width - size) / 2;
      const startY = (img.height - size) / 2;

      // Draw the cropped image
      ctx.drawImage(img, startX, startY, size, size, 0, 0, size, size);

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Could not create blob'));
            return;
          }

          // Create a new file from the blob
          const croppedFile = new File([blob], imageFile.name, {
            type: imageFile.type,
            lastModified: Date.now(),
          });

          // Create preview URL
          const previewUrl = URL.createObjectURL(croppedFile);

          resolve({ croppedFile, previewUrl });
        },
        imageFile.type,
        0.95,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };

    img.src = objectUrl;
  });
};
