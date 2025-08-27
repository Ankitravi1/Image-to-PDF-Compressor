import { PageSize, ImageCompression, Orientation, ImagePosition } from '../types';

declare global {
    interface Window {
        jspdf: any;
    }
}

const compressAndGetDataUrl = (imageFile: File, quality: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const imageUrl = URL.createObjectURL(imageFile);
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                URL.revokeObjectURL(imageUrl);
                return reject(new Error('Could not get canvas context'));
            }
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            URL.revokeObjectURL(imageUrl);
            resolve(dataUrl);
        };
        img.onerror = (err) => {
            URL.revokeObjectURL(imageUrl);
            reject(err);
        };
        img.src = imageUrl;
    });
};

export const generatePdf = async (
  images: File[],
  pageSize: PageSize,
  compression: ImageCompression,
  orientation: Orientation,
  imagePosition: ImagePosition
): Promise<void> => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: orientation === 'portrait' ? 'p' : 'l',
        unit: 'px',
        format: pageSize,
        putOnlyUsedFonts: true,
        compress: true,
    });

    const pageDimensions = {
        width: doc.internal.pageSize.getWidth(),
        height: doc.internal.pageSize.getHeight()
    };
    
    const margin = 20;

    for (let i = 0; i < images.length; i++) {
        if (i > 0) {
            doc.addPage();
        }

        const imageFile = images[i];

        try {
            const compressedImageDataUrl = await compressAndGetDataUrl(imageFile, compression);
            
            const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = (err) => reject(err);
                img.src = compressedImageDataUrl;
            });

            const loadedImg = await imageLoadPromise;
            const imgWidth = loadedImg.width;
            const imgHeight = loadedImg.height;

            const printableWidth = pageDimensions.width - margin * 2;
            const printableHeight = pageDimensions.height - margin * 2;

            let finalWidth: number;
            let finalHeight: number;
            let x: number;
            let y: number;

            if (imagePosition === 'stretch') {
                finalWidth = printableWidth;
                finalHeight = printableHeight;
                x = margin;
                y = margin;
            } else { // 'fit'
                const ratio = Math.min(printableWidth / imgWidth, printableHeight / imgHeight);
                finalWidth = imgWidth * ratio;
                finalHeight = imgHeight * ratio;
                x = margin + (printableWidth - finalWidth) / 2;
                y = margin + (printableHeight - finalHeight) / 2;
            }
            
            doc.addImage(loadedImg, 'JPEG', x, y, finalWidth, finalHeight);
        } catch (error) {
            console.error(`Error processing image ${imageFile.name}:`, error);
            doc.text(`Error loading image: ${imageFile.name}`, margin, margin);
        }
    }

    doc.save(`converted-images-${Date.now()}.pdf`);
};