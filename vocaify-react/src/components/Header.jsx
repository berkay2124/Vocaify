import React from 'react';
import { Upload, Trash2, Zap, LogOut, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

/**
 * Uygulamanın üst başlık barını render eder
 * Logo, uygulama adı, kullanıcı bilgisi, CV yükleme, veri temizleme ve çıkış butonunu içerir
 */
function Header({ onCVUpload }) {
    const { clearAllData } = useApp();
    const { currentUser, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Çıkış yapılırken hata:', error);
        }
    };

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
                    {/* User Info */}
                    {currentUser && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-xl border border-purple-500/20">
                            <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-white text-sm font-medium">
                                    {currentUser.displayName || currentUser.email}
                                </p>
                                <p className="text-gray-400 text-xs">
                                    {currentUser.email}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* CV Upload Button */}
                    <label className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all cursor-pointer font-medium flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        <span className="hidden sm:inline">CV Yükle</span>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            multiple
                            onChange={onCVUpload}
                            className="hidden"
                        />
                    </label>

                    {/* Clear Data Button */}
                    <button
                        onClick={clearAllData}
                        className="p-3 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-all"
                        title="Tüm Verileri Temizle"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="p-3 bg-orange-500/20 text-orange-300 rounded-xl hover:bg-orange-500/30 transition-all"
                        title="Çıkış Yap"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
