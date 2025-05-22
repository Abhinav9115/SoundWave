/**
 * Utility for extracting dominant colors from images
 */
 
export async function extractDominantColor(imageUrl: string): Promise<string> {
  try {
    // Create a temporary image element
    const img = document.createElement('img');
    img.crossOrigin = 'Anonymous'; // Allow cross-origin images
    
    // Create a promise that resolves when the image loads
    const imageLoaded = new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    
    // Set the image source to trigger loading
    img.src = imageUrl;
    
    // Wait for image to load
    await imageLoaded;
    
    // Create a canvas to analyze the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Set canvas dimensions to image size
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw the image to the canvas
    ctx.drawImage(img, 0, 0);
    
    // Get the image data (pixels)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Store RGB values and their frequency
    const colorCounts: Record<string, { count: number; r: number; g: number; b: number }> = {};
    
    // Sample a subset of pixels for performance (every 10th pixel)
    for (let i = 0; i < data.length; i += 40) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Skip very dark or light pixels
      if ((r + g + b) < 30 || (r + g + b) > 740) continue;
      
      // Group similar colors by rounding to nearest 10
      const roundedR = Math.round(r / 10) * 10;
      const roundedG = Math.round(g / 10) * 10;
      const roundedB = Math.round(b / 10) * 10;
      
      const key = `${roundedR},${roundedG},${roundedB}`;
      
      if (!colorCounts[key]) {
        colorCounts[key] = { count: 0, r, g, b };
      }
      
      colorCounts[key].count++;
    }
    
    // Find the most frequent color
    let highestCount = 0;
    let dominantColor = { r: 0, g: 0, b: 0 };
    
    for (const key in colorCounts) {
      if (colorCounts[key].count > highestCount) {
        highestCount = colorCounts[key].count;
        dominantColor = colorCounts[key];
      }
    }
    
    // Convert to hex
    const hex = rgbToHex(dominantColor.r, dominantColor.g, dominantColor.b);
    return hex;
  } catch (error) {
    console.error('Error extracting color:', error);
    return '#9D4EDD'; // Default purple if extraction fails
  }
}

// Helper function to convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}
