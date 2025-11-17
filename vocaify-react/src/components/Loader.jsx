import React from 'react';
import { Loader as LoaderIcon } from 'lucide-react';

/**
 * Yükleme spinner'ını render eder
 * @param {boolean} loading - Yükleme durumu
 */
function Loader({ loading }) {
    if (!loading) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="glass p-8 rounded-2xl flex flex-col items-center gap-4">
                <LoaderIcon className="w-12 h-12 text-purple-400 animate-spin" />
                <p className="text-white font-medium">AI Analiz Ediliyor...</p>
            </div>
        </div>
    );
}

export default Loader;
