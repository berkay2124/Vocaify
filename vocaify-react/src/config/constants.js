/**
 * localStorage'da kullanılan anahtar isimleri
 * @type {Object}
 */
export const STORAGE_KEYS = {
    CANDIDATES: 'vocaify-ats-candidates-v4',
    EMPLOYEES: 'vocaify-ats-employees-v4'
};

/**
 * Aday ve personel durumları konfigürasyonu
 * @type {Object}
 */
export const STATUS_CONFIG = {
    'aday': {
        label: 'Aday',
        color: 'bg-blue-500',
        next: 'egitim'
    },
    'egitim': {
        label: 'Eğitim',
        color: 'bg-purple-500',
        next: 'oryantasyon'
    },
    'oryantasyon': {
        label: 'Oryantasyon',
        color: 'bg-yellow-500',
        next: 'deneme'
    },
    'deneme': {
        label: 'Deneme Süreci',
        color: 'bg-orange-500',
        next: 'iki-aylik'
    },
    'iki-aylik': {
        label: '2 Aylık Personel',
        color: 'bg-teal-500',
        next: 'personel'
    },
    'personel': {
        label: 'Personel',
        color: 'bg-green-500',
        next: null
    },
    'eski-personel': {
        label: 'Eski Personel',
        color: 'bg-gray-500',
        next: null
    }
};

/**
 * Aday aşamaları (personel olmadan önce)
 * @type {Array<string>}
 */
export const CANDIDATE_STAGES = ['aday', 'egitim', 'oryantasyon', 'deneme', 'iki-aylik'];

/**
 * Personel aşamaları
 * @type {Array<string>}
 */
export const EMPLOYEE_STAGES = ['personel', 'eski-personel'];

/**
 * KPI değerlendirme kategorileri (her biri 0-10 arası puanlanır)
 * @type {Array<string>}
 */
export const KPI_CATEGORIES = [
    'İletişim Becerileri',
    'Teknik Yeterlilik',
    'Problem Çözme',
    'Takım Çalışması',
    'Adaptasyon',
    'İnisiyatif Alma',
    'Güvenilirlik',
    'Öğrenme Hızı',
    'Kültürel Uyum',
    'Liderlik Potansiyeli'
];

/**
 * HR notu kategorileri
 * @type {Array<string>}
 */
export const HR_NOTE_CATEGORIES = [
    'Genel Gözlem',
    'Davranışsal',
    'Teknik Yetkinlik',
    'Kültürel Uyum',
    'İletişim',
    'Diğer'
];

/**
 * Özlük dosyası türleri
 * @type {Array<string>}
 */
export const DOC_TYPES = [
    'CV',
    'Diploma',
    'Sertifika',
    'Kimlik',
    'İkametgah',
    'SGK Belgesi',
    'Sözleşme',
    'Diğer'
];

/**
 * Aday kaynak platformları
 * @type {Array<string>}
 */
export const PLATFORMS = [
    'Kariyer.net',
    'LinkedIn',
    'Yenibiris.com',
    'İşkur',
    'Referans',
    'Manuel Yükleme'
];
