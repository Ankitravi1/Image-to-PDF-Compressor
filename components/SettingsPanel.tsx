import React from 'react';
import { PageSize, ImageCompression, Orientation, ImagePosition } from '../types';
import { PAGE_SIZES, IMAGE_COMPRESSION_OPTIONS, ORIENTATION_OPTIONS, IMAGE_POSITION_OPTIONS } from '../constants';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface SettingsPanelProps {
    pageSize: PageSize;
    setPageSize: (size: PageSize) => void;
    compression: ImageCompression;
    setCompression: (level: ImageCompression) => void;
    orientation: Orientation;
    setOrientation: (orientation: Orientation) => void;
    imagePosition: ImagePosition;
    setImagePosition: (position: ImagePosition) => void;
    onConvert: () => void;
    isConverting: boolean;
    isDisabled: boolean;
}

// FIX: Allow SegmentedControl to accept number values in addition to strings.
interface SegmentedControlProps<T extends string | number> {
    label: string;
    options: { value: T; label: string; description?: string }[];
    selectedValue: T;
    onChange: (value: T) => void;
}

// FIX: Allow SegmentedControl to accept number values in addition to strings.
const SegmentedControl = <T extends string | number,>({ label, options, selectedValue, onChange }: SegmentedControlProps<T>) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1 space-x-1">
            {options.map(option => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={`w-full text-center px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-700 focus:ring-sky-500
                        ${selectedValue === option.value ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                >
                    {option.label}
                </button>
            ))}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[1.25rem] px-1">
            {options.find(o => o.value === selectedValue)?.description || ''}
        </p>
    </div>
);


export const SettingsPanel: React.FC<SettingsPanelProps> = ({
    pageSize,
    setPageSize,
    compression,
    setCompression,
    orientation,
    setOrientation,
    imagePosition,
    setImagePosition,
    onConvert,
    isConverting,
    isDisabled,
}) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm space-y-6 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-4">
                PDF Options
            </h2>

            <SegmentedControl
                label="Page Size"
                options={PAGE_SIZES}
                selectedValue={pageSize}
                onChange={setPageSize}
            />
            
            <SegmentedControl
                label="Orientation"
                options={ORIENTATION_OPTIONS}
                selectedValue={orientation}
                onChange={setOrientation}
            />

            <SegmentedControl
                label="Image Position"
                options={IMAGE_POSITION_OPTIONS}
                selectedValue={imagePosition}
                onChange={setImagePosition}
            />
            
            <SegmentedControl
                label="Image Compression"
                options={IMAGE_COMPRESSION_OPTIONS}
                selectedValue={compression}
                onChange={setCompression}
            />

            <button
                onClick={onConvert}
                disabled={isDisabled || isConverting}
                className="w-full flex items-center justify-center bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-sky-500"
            >
                {isConverting ? (
                    <>
                        <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                        Converting...
                    </>
                ) : 'Convert to PDF'}
            </button>
        </div>
    );
};