// === YARDIMCI FONKSİYONLAR ===

import { STATUS_CONFIG, CANDIDATE_STAGES, EMPLOYEE_STAGES } from './config.js';

// Tarih Formatlama
export function formatDate(iso) {
    return iso ? new Date(iso).toLocaleDateString('tr-TR') : 'N/A';
}

export function formatDateTime(iso) {
    return iso ? new Date(iso).toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : 'N/A';
}

// İstatistik Hesaplama
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

// Analitik Hesaplama
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

// Lokal CV Analiz Simülatörü
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
