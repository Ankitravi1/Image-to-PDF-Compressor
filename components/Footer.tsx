
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                <p>&copy; {new Date().getFullYear()} Image to PDF Converter. All rights reserved.</p>
                <p>Powered by React, Tailwind CSS, and jsPDF.</p>
            </div>
        </footer>
    );
};
