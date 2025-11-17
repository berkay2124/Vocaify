// === UYGULAMA KONFİGÜRASYONU ===

// Veri depolama anahtarları
export const STORAGE_KEYS = {
    CANDIDATES: 'vocaify-ats-candidates-v4',
    EMPLOYEES: 'vocaify-ats-employees-v4'
};

// Personel Yaşam Döngüsü Konfigürasyonu
export const STATUS_CONFIG = {
    'aday': { label: 'Aday', color: 'bg-blue-500', next: 'egitim', type: 'candidate' },
    'egitim': { label: 'Eğitim', color: 'bg-purple-500', next: 'oryantasyon', type: 'candidate' },
    'oryantasyon': { label: 'Oryantasyon', color: 'bg-yellow-500', next: 'deneme', type: 'candidate' },
    'deneme': { label: 'Deneme Süreci', color: 'bg-orange-500', next: 'iki-aylik', type: 'candidate' },
    'iki-aylik': { label: '2 Aylık Personel', color: 'bg-teal-500', next: 'personel', type: 'candidate' },
    'personel': { label: 'Personel', color: 'bg-green-500', next: null, type: 'employee' },
    'eski-personel': { label: 'Eski Personel', color: 'bg-gray-500', next: null, type: 'employee' }
};

// Aday ve Personel Aşamaları
export const CANDIDATE_STAGES = Object.keys(STATUS_CONFIG).filter(k => STATUS_CONFIG[k].type === 'candidate');
export const EMPLOYEE_STAGES = Object.keys(STATUS_CONFIG).filter(k => STATUS_CONFIG[k].type === 'employee');

// KPI Değerlendirme Kategorileri
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

// Başvuru Platformları
export const PLATFORMS = [
    'Manuel Yükleme',
    'Kariyer.net',
    'LinkedIn',
    'Indeed',
    'Referans',
    'Diğer'
];

// HR Not Kategorileri
export const HR_NOTE_CATEGORIES = [
    'Genel Gözlem',
    'Mülakat Notu',
    'Gelişim Alanı',
    'Güçlü Yön',
    'Geri Bildirim'
];

// Döküman Türleri
export const DOC_TYPES = [
    'CV',
    'İş Sözleşmesi',
    'Kimlik Fotokopisi',
    'İkametgah',
    'Sağlık Raporu',
    'Diploma',
    'Diğer Özlük Dosyası'
];
