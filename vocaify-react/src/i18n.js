import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    // HTTP backend ile translation dosyalarını yükle
    .use(HttpBackend)
    // Tarayıcı dilini otomatik algıla
    .use(LanguageDetector)
    // React-i18next'i başlat
    .use(initReactI18next)
    .init({
        // Fallback dili (İngilizce)
        fallbackLng: 'tr',
        // Default dil (Türkçe)
        lng: 'tr',
        // Debug modu (development)
        debug: process.env.NODE_ENV === 'development',

        // Desteklenen diller
        supportedLngs: ['tr', 'en'],

        // Namespace kullanımı
        ns: ['translation'],
        defaultNS: 'translation',

        // Backend yapılandırması
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },

        // Interpolation ayarları
        interpolation: {
            escapeValue: false, // React zaten XSS koruması sağlıyor
        },

        // Algılama ayarları
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng',
        },

        // React ayarları
        react: {
            useSuspense: false, // Suspense kullanma (loading state'leri kendin yönet)
        }
    });

export default i18n;
