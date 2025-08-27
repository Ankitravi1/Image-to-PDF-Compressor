
import React, { useState, useRef, useCallback } from 'react';
import { ImageIcon } from './icons/ImageIcon';

interface ImageUploaderProps {
    onFilesAccepted: (files: File[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesAccepted }) => {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragEvent = (e: React.DragEvent<HTMLDivElement>, inZone: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(inZone);
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        handleDragEvent(e, false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFilesAccepted(Array.from(e.dataTransfer.files));
            e.dataTransfer.clearData();
        }
    }, [onFilesAccepted]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFilesAccepted(Array.from(e.target.files));
        }
    };
    
    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div
            onDragEnter={(e) => handleDragEvent(e, true)}
            onDragLeave={(e) => handleDragEvent(e, false)}
            onDragOver={(e) => handleDragEvent(e, true)}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200 ease-in-out
                ${isDragging ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-sky-400 dark:hover:border-sky-500 bg-white dark:bg-slate-800'}`}
        >
            <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleChange}
            />
            <div className="flex flex-col items-center space-y-4 text-center">
                <ImageIcon className="h-12 w-12 text-slate-400 dark:text-slate-500" />
                <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
                    <span className="text-sky-500 dark:text-sky-400 font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    PNG, JPG, GIF, WEBP supported
                </p>
            </div>
        </div>
    );
};
