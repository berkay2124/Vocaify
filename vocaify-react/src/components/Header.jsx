import React from 'react';
import { Upload, Trash2, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * Uygulamanın üst başlık barını render eder
 * Logo, uygulama adı, CV yükleme butonu ve veri temizleme butonunu içerir
 */
function Header({ onCVUpload }) {
    const { clearAllData } = useApp();

    return (
        <header className="glass sticky top-0 z-40 border-b border-purple-500/20">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
                        <Zap className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Vocaify HR</h1>
                        <p className="text-purple-300 text-sm">AI Destekli İnsan Kaynakları</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <label className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all cursor-pointer font-medium flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        CV Yükle
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            multiple
                            onChange={onCVUpload}
                            className="hidden"
                        />
                    </label>
                    <button
                        onClick={clearAllData}
                        className="p-3 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-all"
                        title="Tüm Verileri Temizle"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
