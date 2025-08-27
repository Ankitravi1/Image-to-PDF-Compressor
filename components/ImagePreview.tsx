import React, { useEffect, useState, useRef } from 'react';

interface ImagePreviewProps {
    images: File[];
    onRemoveImage: (index: number) => void;
    onClearImages: () => void;
    onReorderImages: (reorderedImages: File[]) => void;
}

const ImageCard: React.FC<{ file: File; onRemove: () => void; pageNumber: number }> = ({ file, onRemove, pageNumber }) => {
    const [objectUrl, setObjectUrl] = useState<string | null>(null);

    useEffect(() => {
        const url = URL.createObjectURL(file);
        setObjectUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    return (
        <div className="relative group aspect-w-1 aspect-h-1 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden shadow-sm">
            {objectUrl ? (
                <img src={objectUrl} alt={file.name} className="object-cover w-full h-full" />
            ) : (
                <div className="flex items-center justify-center w-full h-full">Loading...</div>
            )}
             <div className="absolute top-2 left-2 bg-sky-500/80 backdrop-blur-sm text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                P.{pageNumber}
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button
                    onClick={onRemove}
                    className="absolute top-2 right-2 bg-white/20 hover:bg-white/40 text-white rounded-full p-1.5 transition-colors"
                    aria-label="Remove image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-xs truncate">{file.name}</p>
            </div>
        </div>
    );
};

export const ImagePreview: React.FC<ImagePreviewProps> = ({ images, onRemoveImage, onClearImages, onReorderImages }) => {
    if (images.length === 0) {
        return null;
    }

    const dragItemIndex = useRef<number | null>(null);
    const dragOverItemIndex = useRef<number | null>(null);
    const [dragging, setDragging] = useState(false);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        dragItemIndex.current = index;
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => setDragging(true), 0);
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        dragOverItemIndex.current = index;
    };

    const handleDrop = () => {
        if (dragItemIndex.current !== null && dragOverItemIndex.current !== null && dragItemIndex.current !== dragOverItemIndex.current) {
            const reorderedImages = [...images];
            const [draggedItem] = reorderedImages.splice(dragItemIndex.current, 1);
            reorderedImages.splice(dragOverItemIndex.current, 0, draggedItem);
            onReorderImages(reorderedImages);
        }
    };

    const handleDragEnd = () => {
        setDragging(false);
        dragItemIndex.current = null;
        dragOverItemIndex.current = null;
    };


    return (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">
                    Uploaded Images ({images.length})
                </h3>
                <button onClick={onClearImages} className="text-sm font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300 transition-colors">
                    Clear All
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {images.map((file, index) => (
                     <div
                        key={`${file.name}-${index}-${file.lastModified}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDrop={handleDrop}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                        className={`transition-opacity cursor-grab active:cursor-grabbing ${dragging && dragItemIndex.current === index ? 'opacity-50' : ''}`}
                    >
                        <ImageCard 
                            file={file} 
                            onRemove={() => onRemoveImage(index)}
                            pageNumber={index + 1} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};