import React from 'react';

interface LogoProps {
    lightTheme?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ lightTheme = false }) => {
    return (
        <div className="flex items-center gap-2">
            <div className="bg-[#16a34a] w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-black text-lg">A</span>
            </div>
            <span className={`text-xl font-bold tracking-tight ${lightTheme ? 'text-white' : 'text-slate-900'}`}>
                AgriBridge
            </span>
        </div>
    );
};
