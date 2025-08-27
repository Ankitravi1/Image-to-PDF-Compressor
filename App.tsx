import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImagePreview } from './components/ImagePreview';
import { SettingsPanel } from './components/SettingsPanel';
import { Footer } from './components/Footer';
import { ImageCompressor } from './components/ImageCompressor';
import { generatePdf } from './services/pdfService';
import { PageSize, ImageCompression, Orientation, ImagePosition, ActiveTab } from './types';
import { IMAGE_COMPRESSION_OPTIONS, PAGE_SIZES } from './constants';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('pdfConverter');

    // State for PDF Converter
    const [images, setImages] = useState<File[]>([]);
    const [pageSize, setPageSize] = useState<PageSize>(PAGE_SIZES[0].value);
    const [compression, setCompression] = useState<ImageCompression>(IMAGE_COMPRESSION_OPTIONS[1].value);
    const [orientation, setOrientation] = useState<Orientation>('portrait');
    const [imagePosition, setImagePosition] = useState<ImagePosition>('fit');
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFilesAccepted = useCallback((acceptedFiles: File[]) => {
        const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
        if (imageFiles.length !== acceptedFiles.length) {
            setError("Some files were not images and were ignored.");
        } else {
            setError(null);
        }
        setImages(prev => [...prev, ...imageFiles]);
    }, []);

    const handleRemoveImage = useCallback((index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    }, []);
    
    const handleClearImages = useCallback(() => {
        setImages([]);
    }, []);

    const handleReorderImages = useCallback((reorderedImages: File[]) => {
        setImages(reorderedImages);
    }, []);

    const handleConvert = useCallback(async () => {
        if (images.length === 0) {
            setError("Please upload at least one image.");
            return;
        }
        setIsConverting(true);
        setError(null);
        try {
            await generatePdf(images, pageSize, compression, orientation, imagePosition);
        } catch (e) {
            console.error(e);
            setError("An error occurred during PDF conversion. Please try again.");
        } finally {
            setIsConverting(false);
        }
    }, [images, pageSize, compression, orientation, imagePosition]);

    return (
        <div className="flex flex-col min-h-screen text-slate-800 dark:text-slate-200">
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {activeTab === 'pdfConverter' ? (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                            <div className="lg:col-span-2 space-y-6">
                                <ImageUploader onFilesAccepted={handleFilesAccepted} />
                                <ImagePreview 
                                    images={images} 
                                    onRemoveImage={handleRemoveImage}
                                    onClearImages={handleClearImages}
                                    onReorderImages={handleReorderImages}
                                />
                            </div>
                            <div className="lg:col-span-1">
                                <SettingsPanel
                                    pageSize={pageSize}
                                    setPageSize={setPageSize}
                                    compression={compression}
                                    setCompression={setCompression}
                                    orientation={orientation}
                                    setOrientation={setOrientation}
                                    imagePosition={imagePosition}
                                    setImagePosition={setImagePosition}
                                    onConvert={handleConvert}
                                    isConverting={isConverting}
                                    isDisabled={images.length === 0}
                                />
                            </div>
                        </div>
                        {error && (
                            <div className="mt-8 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md text-center">
                                {error}
                            </div>
                        )}
                    </>
                ) : (
                    <ImageCompressor />
                )}
            </main>
            <Footer />
        </div>
    );
};

export default App;