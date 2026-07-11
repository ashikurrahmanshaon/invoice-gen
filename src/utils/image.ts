export const processImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!file.type.startsWith('image/')) {
        return reject(new Error('Invalid file type: Please upload an image.'));
      }
      
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_FILE_SIZE) {
        return reject(new Error('File size exceeds the 5MB limit.'));
      }

      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        return reject(new Error('Failed to read file'));
      }

      // Check if we need to resize (optional optimization, but good for local storage)
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          } else {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(dataUrl); // fallback to original if canvas fails
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to WebP for superior compression while maintaining transparency and visual quality
        const outputFormat = 'image/webp';
        const quality = 0.85; // 0.85 quality is visually indistinguishable but saves 75%+ size
        
        const resizedDataUrl = canvas.toDataURL(outputFormat, quality);
        resolve(resizedDataUrl);
      };
      
      img.onerror = () => {
        reject(new Error('Invalid image file'));
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsDataURL(file);
  });
};
