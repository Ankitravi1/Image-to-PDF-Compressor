
import React from 'react';
import { PdfIcon } from './icons/PdfIcon';
import { ActiveTab } from '../types';

interface HeaderProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
}

const NavButton: React.FC<{
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ isActive, onClick, children }) => {
    const baseClasses = "px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-sky-500";
    const activeClasses = "bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400";
    const inactiveClasses = "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800";
    
    return (
        <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            {children}
        </button>
    );
};

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
    return (
        <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg shadow-sm sticky top-0 z-40">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <PdfIcon className="h-8 w-8 text-sky-500" />
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Image Tools
                        </h1>
                    </div>
                    <nav className="flex items-center space-x-2">
                        <NavButton
                            isActive={activeTab === 'pdfConverter'}
                            onClick={() => setActiveTab('pdfConverter')}
                        >
                            PDF Converter
                        </NavButton>
                        <NavButton
                            isActive={activeTab === 'imageCompressor'}
                            onClick={() => setActiveTab('imageCompressor')}
                        >
                            Image Compressor
                        </NavButton>
                    </nav>
                </div>
            </div>
        </header>
    );
};
