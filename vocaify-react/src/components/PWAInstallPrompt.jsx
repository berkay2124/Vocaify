import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

/**
 * AŞAMA 38: PWA Install Prompt Component
 * Mobil cihazlarda "Ana Ekrana Ekle" prompt'u gösterir
 */
function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);

            // Kullanıcı daha önce reddetmediyse göster
            const hasDeclined = localStorage.getItem('pwa-install-declined');
            if (!hasDeclined) {
                setTimeout(() => setShowPrompt(true), 3000); // 3 saniye sonra göster
            }
        };

        window.addEventListener('beforeinstallprompt', handler);

        // App installed event
        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA installed successfully');
            setShowPrompt(false);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('✅ User accepted install prompt');
        } else {
            console.log('❌ User dismissed install prompt');
            localStorage.setItem('pwa-install-declined', 'true');
        }

        setShowPrompt(false);
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-install-declined', 'true');
    };

    // iOS check - iOS doesn't support beforeinstallprompt
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    // Don't show if already installed or on iOS
    if (isStandalone || !showPrompt) {
        return null;
    }

    // Show iOS-specific instructions
    if (isIOS && showPrompt) {
        return (
            <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slideUp">
                <div className="glass p-6 rounded-2xl border-2 border-purple-500/30 shadow-2xl">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                                <Download className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">Ana Ekrana Ekle</h3>
                                <p className="text-gray-400 text-xs">Vocaify'ı uygulama gibi kullanın</p>
                            </div>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="bg-white/5 p-4 rounded-lg space-y-2">
                        <p className="text-white text-sm font-medium mb-3">iOS Kurulum Adımları:</p>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">📱</span>
                            <div>
                                <p className="text-white text-sm font-medium">1. Paylaş butonuna dokun</p>
                                <p className="text-gray-400 text-xs">Safari alt menüsündeki kare + ok simgesi</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">➕</span>
                            <div>
                                <p className="text-white text-sm font-medium">2. "Ana Ekrana Ekle"yi seç</p>
                                <p className="text-gray-400 text-xs">Menüden bu seçeneği bul</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">✅</span>
                            <div>
                                <p className="text-white text-sm font-medium">3. "Ekle" butonuna dokun</p>
                                <p className="text-gray-400 text-xs">Vocaify artık ana ekranınızda!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Android/Desktop install prompt
    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slideUp">
            <div className="glass p-6 rounded-2xl border-2 border-purple-500/30 shadow-2xl">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                            <Download className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">Vocaify'ı Yükle</h3>
                            <p className="text-gray-400 text-xs">Ana ekrana ekleyerek uygulama gibi kullanın</p>
                        </div>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-3">
                    <div className="bg-white/5 p-3 rounded-lg">
                        <ul className="space-y-1 text-gray-300 text-sm">
                            <li className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                Offline çalışma desteği
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                Hızlı başlatma
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                Tam ekran deneyimi
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                Push bildirimleri
                            </li>
                        </ul>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleInstall}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium text-white hover:shadow-lg transition-all"
                        >
                            Yükle
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="px-4 py-3 bg-white/5 border border-purple-500/20 rounded-xl font-medium text-gray-300 hover:bg-white/10 transition-all"
                        >
                            Şimdi Değil
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PWAInstallPrompt;
