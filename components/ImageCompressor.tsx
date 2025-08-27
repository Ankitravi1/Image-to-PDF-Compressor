
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ImageIcon } from './icons/ImageIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const dataURLtoFile = (dataurl: string, filename: string): File | null => {
    const arr = dataurl.split(',');
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

export const ImageCompressor: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [quality, setQuality] = useState(0.75);
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
    const [originalSize, setOriginalSize] = useState<number | null>(null);
    const [compressedSize, setCompressedSize] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const compressImage = useCallback(async (file: File, qualityValue: number) => {
        if (!file) return;
        setIsProcessing(true);
        
        const imageUrl = URL.createObjectURL(file);
        const img = new Image();

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if(ctx) {
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL('image/jpeg', qualityValue);
                setCompressedUrl(dataUrl);

                const compressedFile = dataURLtoFile(dataUrl, `compressed-${file.name}`);
                setCompressedSize(compressedFile?.size ?? null);
            }
            URL.revokeObjectURL(imageUrl);
            setIsProcessing(false);
        };
        img.onerror = () => {
             URL.revokeObjectURL(imageUrl);
             setIsProcessing(false);
        }
        img.src = imageUrl;
    }, []);

    useEffect(() => {
        if (imageFile) {
            compressImage(imageFile, quality);
            const url = URL.createObjectURL(imageFile);
            setOriginalUrl(url);
            setOriginalSize(imageFile.size);
            return () => URL.revokeObjectURL(url);
        }
    }, [imageFile, quality, compressImage]);
    
    const handleFileChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                setImageFile(file);
            }
        }
    };
    
    const handleDragEvent = (e: React.DragEvent<HTMLDivElement>, inZone: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(inZone);
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        handleDragEvent(e, false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    }, []);

    const handleDownload = () => {
        if (!compressedUrl || !imageFile) return;
        const link = document.createElement('a');
        link.href = compressedUrl;
        link.download = `compressed-${imageFile.name.split('.').slice(0, -1).join('.')}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleReset = () => {
        setImageFile(null);
        setOriginalUrl(null);
        setCompressedUrl(null);
        setOriginalSize(null);
        setCompressedSize(null);
        setQuality(0.75);
    };

    if (!imageFile) {
        return (
            <div id="image-compressor">
                <div
                    onDragEnter={(e) => handleDragEvent(e, true)}
                    onDragLeave={(e) => handleDragEvent(e, false)}
                    onDragOver={(e) => handleDragEvent(e, true)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200 ease-in-out
                        ${isDragging ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-sky-400 dark:hover:border-sky-500 bg-white dark:bg-slate-800'}`}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e.target.files)}
                    />
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <ImageIcon className="h-16 w-16 text-slate-400 dark:text-slate-500" />
                        <p className="text-xl font-medium text-slate-600 dark:text-slate-300">
                            <span className="text-sky-500 dark:text-sky-400 font-semibold">Upload an image</span> to compress
                        </p>
                        <p className="text-md text-slate-500 dark:text-slate-400">
                            Or drag and drop it here
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    
    const sizeReduction = originalSize && compressedSize ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0;

    return (
        <div id="image-compressor" className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
            <div className="flex justify-end items-center mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                <button onClick={handleReset} className="text-sm font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300 transition-colors">
                    Compress Another Image
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Original</h3>
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        {originalUrl && <img src={originalUrl} alt="Original" className="object-contain w-full h-full" />}
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                        <span className="font-medium text-slate-600 dark:text-slate-300 truncate max-w-[70%]">{imageFile.name}</span>
                        <span className="font-mono text-slate-500 dark:text-slate-400">{originalSize ? formatBytes(originalSize) : '...'}</span>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Compressed (JPEG)</h3>
                    <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        {isProcessing && <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-800/50 z-10"><SpinnerIcon className="h-8 w-8 animate-spin text-sky-500" /></div>}
                        {compressedUrl && <img src={compressedUrl} alt="Compressed" className="object-contain w-full h-full" />}
                    </div>
                     <div className="flex justify-between mt-2 text-sm">
                        <span className="font-medium text-slate-600 dark:text-slate-300">{compressedSize ? formatBytes(compressedSize) : '...'}</span>
                        {sizeReduction > 0 && 
                            <span className="font-mono text-green-600 dark:text-green-400">-{sizeReduction}%</span>
                        }
                    </div>
                </div>
            </div>
            
            <div className="mt-8 space-y-4">
                 <div>
                    <label htmlFor="quality-slider" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Quality: <span className="font-bold text-sky-600 dark:text-sky-400">{Math.round(quality * 100)}%</span>
                    </label>
                    <input
                        id="quality-slider"
                        type="range"
                        min="0.01"
                        max="1"
                        step="0.01"
                        value={quality}
                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-600"
                    />
                </div>
                <button
                    onClick={handleDownload}
                    disabled={isProcessing || !compressedUrl}
                    className="w-full flex items-center justify-center bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-sky-500"
                >
                    {isProcessing ? 'Processing...' : `Download Compressed Image`}
                </button>
            </div>
        </div>
    );
};
