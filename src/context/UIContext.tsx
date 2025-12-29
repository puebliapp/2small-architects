'use client';
import React, { createContext, useContext, useState } from 'react';

interface UIContextType {
    isAboutOpen: boolean;
    toggleAbout: () => void;
    closeAbout: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    const toggleAbout = () => setIsAboutOpen(prev => !prev);
    const closeAbout = () => setIsAboutOpen(false);

    return (
        <UIContext.Provider value={{ isAboutOpen, toggleAbout, closeAbout }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}
