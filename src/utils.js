// === YARDIMCI FONKSİYONLAR ===

import { STATUS_CONFIG, CANDIDATE_STAGES, EMPLOYEE_STAGES } from './config.js';

/**
 * ISO tarih string'ini Türkçe tarih formatına dönüştürür
 * @param {string} iso - ISO 8601 formatında tarih string'i
 * @returns {string} 'GG.AA.YYYY' formatında tarih veya 'N/A'
 */
export function formatDate(iso) {
    return iso ? new Date(iso).toLocaleDateString('tr-TR') : 'N/A';
}

/**
 * ISO tarih string'ini Türkçe tarih-saat formatına dönüştürür
 * @param {string} iso - ISO 8601 formatında tarih-saat string'i
 * @returns {string} 'GG.AA.YYYY, SS:DD' formatında tarih-saat veya 'N/A'
 */
export function formatDateTime(iso) {
    return iso ? new Date(iso).toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : 'N/A';
}

/**
 * Aday ve personel verilerinden genel istatistikleri hesaplar
 * @param {Array} candidates - Aday listesi
 * @param {Array} employees - Personel listesi
 * @returns {Object} İstatistik objesi
 * @returns {number} returns.totalCandidates - Toplam aday sayısı
 * @returns {number} returns.activeEmployees - Aktif personel sayısı
 * @returns {number} returns.inTraining - Eğitimdeki aday sayısı
 * @returns {number} returns.onTrial - Deneme sürecindeki sayı
 * @returns {number} returns.exiting - Eski personel sayısı
 * @returns {number} returns.newThisMonth - Bu ay eklenen aday sayısı
 * @returns {number} returns.pendingEvaluations - Değerlendirme bekleyen sayı
 */
export function getStats(candidates, employees) {
    return {
        totalCandidates: candidates.length,
        activeEmployees: employees.filter(e => e.status === 'personel').length,
        inTraining: candidates.filter(c => c.status === 'egitim').length,
        onTrial: candidates.filter(c => ['oryantasyon', 'deneme', 'iki-aylik'].includes(c.status)).length,
        exiting: employees.filter(e => e.status === 'eski-personel').length,
        newThisMonth: candidates.filter(c => new Date(c.uploadDate).getMonth() === new Date().getMonth()).length,
        pendingEvaluations: candidates.filter(c => !c.decision && c.status === 'aday').length
    };
}

/**
 * Aday ve personel verilerinden analitik metrikleri hesaplar
 * @param {Array} candidates - Aday listesi
 * @param {Array} employees - Personel listesi
 * @returns {Object} Analitik metrikleri
 * @returns {number} returns.offersSent - Gönderilen teklif sayısı
 * @returns {number} returns.offersAccepted - Kabul edilen teklif sayısı
 * @returns {number} returns.turnoverRate - Personel devir hızı yüzdesi
 * @returns {number} returns.totalExiting - Çıkış yapan toplam personel
 */
export function getAnalytics(candidates, employees) {
    const allPeople = [...candidates, ...employees];
    const offersSent = allPeople.filter(p => p.offerDetails?.offerSent).length;
    const offersAccepted = allPeople.filter(p => p.offerDetails?.offerAccepted === true).length;
    const active = employees.filter(e => e.status === 'personel').length;
    const exiting = employees.filter(e => e.status === 'eski-personel').length;
    const totalStaff = active + exiting;
    const turnoverRate = totalStaff > 0 ? (exiting / totalStaff) * 100 : 0;

    return {
        offersSent,
        offersAccepted,
        turnoverRate,
        totalExiting: exiting
    };
}

/**
 * CV dosya adından simüle edilmiş AI analiz sonucu oluşturur (demo amaçlı)
 * @param {string} fileName - CV dosya adı
 * @returns {Object} Simüle edilmiş aday bilgileri
 * @returns {string} returns.name - Aday adı
 * @returns {string} returns.email - Email adresi
 * @returns {string} returns.phone - Telefon numarası
 * @returns {string} returns.position - Pozisyon
 * @returns {string[]} returns.skills - Beceriler listesi
 * @returns {number} returns.experience_years - Deneyim yılı
 * @returns {string} returns.education - Eğitim bilgisi
 * @returns {string} returns.summary - Özet bilgi
 * @returns {string} returns.aiRecommendation - AI tavsiyesi
 */
export function localAnalyzeCV(fileName) {
    const name = fileName.replace(/\.(pdf|docx|txt)$/i, '').replace(/[_-]/g, ' ');
    const positions = ["Yazılım Geliştirici", "İK Uzmanı", "Pazarlama Müdürü", "Proje Yöneticisi"];
    const randomPos = positions[Math.floor(Math.random() * positions.length)];
    const randomExp = Math.floor(Math.random() * 10) + 1;

    return {
        name: name || "Simüle Aday",
        email: `${name.split(' ')[0] || 'aday'}@vocaify.demo`,
        phone: `+90 555 ${Math.floor(100 + Math.random() * 900)} XX XX`,
        position: randomPos,
        skills: ["React", "Node.js", "Proje Yönetimi", "İletişim"],
        experience_years: randomExp,
        education: "Boğaziçi Üniversitesi",
        summary: `${randomExp} yıl deneyimli ${randomPos}. Güçlü teknik ve sosyal becerilere sahip. Simüle edilmiş AI özetidir.`,
        aiRecommendation: "Aday, pozisyon için güçlü bir potansiyele sahip görünüyor. Teknik becerileri mülakatta test edilmeli."
    };
}
