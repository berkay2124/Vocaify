// === UYGULAMA KONFİGÜRASYONU ===

/**
 * localStorage'da kullanılan anahtar isimleri
 * @type {Object}
 * @property {string} CANDIDATES - Adaylar için storage anahtarı
 * @property {string} EMPLOYEES - Personeller için storage anahtarı
 */
export const STORAGE_KEYS = {
    CANDIDATES: 'vocaify-ats-candidates-v4',
    EMPLOYEES: 'vocaify-ats-employees-v4'
};

/**
 * Personel yaşam döngüsü aşamaları ve özellikleri
 * @type {Object.<string, {label: string, color: string, next: string|null, type: string}>}
 * @property {Object} aday - Başlangıç aşaması
 * @property {Object} egitim - Eğitim aşaması
 * @property {Object} oryantasyon - Oryantasyon aşaması
 * @property {Object} deneme - Deneme süreci aşaması
 * @property {Object} iki-aylik - İki aylık personel aşaması
 * @property {Object} personel - Aktif personel aşaması
 * @property {Object} eski-personel - Çıkış yapmış personel aşaması
 */
export const STATUS_CONFIG = {
    'aday': { label: 'Aday', color: 'bg-blue-500', next: 'egitim', type: 'candidate' },
    'egitim': { label: 'Eğitim', color: 'bg-purple-500', next: 'oryantasyon', type: 'candidate' },
    'oryantasyon': { label: 'Oryantasyon', color: 'bg-yellow-500', next: 'deneme', type: 'candidate' },
    'deneme': { label: 'Deneme Süreci', color: 'bg-orange-500', next: 'iki-aylik', type: 'candidate' },
    'iki-aylik': { label: '2 Aylık Personel', color: 'bg-teal-500', next: 'personel', type: 'candidate' },
    'personel': { label: 'Personel', color: 'bg-green-500', next: null, type: 'employee' },
    'eski-personel': { label: 'Eski Personel', color: 'bg-gray-500', next: null, type: 'employee' }
};

/**
 * Aday (candidate) tipindeki aşamaların listesi
 * @type {string[]}
 */
export const CANDIDATE_STAGES = Object.keys(STATUS_CONFIG).filter(k => STATUS_CONFIG[k].type === 'candidate');

/**
 * Personel (employee) tipindeki aşamaların listesi
 * @type {string[]}
 */
export const EMPLOYEE_STAGES = Object.keys(STATUS_CONFIG).filter(k => STATUS_CONFIG[k].type === 'employee');

/**
 * KPI değerlendirmesinde kullanılan kategori listesi
 * @type {string[]}
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
 * Adayların başvuru yapabileceği platform listesi
 * @type {string[]}
 */
export const PLATFORMS = [
    'Manuel Yükleme',
    'Kariyer.net',
    'LinkedIn',
    'Indeed',
    'Referans',
    'Diğer'
];

/**
 * HR notları için kategori listesi
 * @type {string[]}
 */
export const HR_NOTE_CATEGORIES = [
    'Genel Gözlem',
    'Mülakat Notu',
    'Gelişim Alanı',
    'Güçlü Yön',
    'Geri Bildirim'
];

/**
 * Özlük dosyası türleri listesi
 * @type {string[]}
 */
export const DOC_TYPES = [
    'CV',
    'İş Sözleşmesi',
    'Kimlik Fotokopisi',
    'İkametgah',
    'Sağlık Raporu',
    'Diploma',
    'Diğer Özlük Dosyası'
];
