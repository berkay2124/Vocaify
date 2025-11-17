import { STATUS_CONFIG, KPI_CATEGORIES } from '../config/constants';

/**
 * ISO tarih string'ini okunabilir formata dönüştürür
 * @param {string} isoString - ISO format tarih
 * @returns {string} "15 Ocak 2025" formatında tarih
 */
export function formatDate(isoString) {
    if (!isoString) return 'Tarih Yok';
    const date = new Date(isoString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('tr-TR', options);
}

/**
 * ISO tarih string'ini tarih ve saat formatına dönüştürür
 * @param {string} isoString - ISO format tarih
 * @returns {string} "15 Ocak 2025 14:30" formatında tarih
 */
export function formatDateTime(isoString) {
    if (!isoString) return 'Tarih Yok';
    const date = new Date(isoString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('tr-TR', options);
}

/**
 * Aday ve personel verilerinden genel istatistikleri hesaplar
 * @param {Array} candidates - Aday listesi
 * @param {Array} employees - Personel listesi
 * @returns {Object} İstatistik objesi
 */
export function getStats(candidates, employees) {
    const totalCandidates = candidates.length;
    const activeEmployees = employees.filter(e => e.status === 'personel').length;
    const totalEmployees = employees.length;

    return {
        totalCandidates,
        activeEmployees,
        totalEmployees,
        totalPool: totalCandidates + totalEmployees
    };
}

/**
 * Analiz metriklerini hesaplar
 * @param {Array} candidates - Aday listesi
 * @param {Array} employees - Personel listesi
 * @returns {Object} Analiz metrikleri
 */
export function getAnalytics(candidates, employees) {
    const offersSent = candidates.filter(c => c.offerDetails?.offerSent).length;
    const offersAccepted = candidates.filter(c => c.offerDetails?.offerAccepted === true).length;

    const allEmployees = employees.length;
    const exitedEmployees = employees.filter(e => e.status === 'eski-personel').length;
    const turnoverRate = allEmployees > 0 ? (exitedEmployees / allEmployees) * 100 : 0;

    return {
        offersSent,
        offersAccepted,
        turnoverRate
    };
}

/**
 * CV dosya adından simüle edilmiş AI analizi üretir
 * @param {string} fileName - CV dosya adı
 * @returns {Object} Analiz objesi
 */
export function localAnalyzeCV(fileName) {
    const firstNames = ['Ahmet', 'Mehmet', 'Ayşe', 'Fatma', 'Ali', 'Zeynep', 'Can', 'Elif', 'Burak', 'Selin'];
    const lastNames = ['Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Yıldız', 'Aydın', 'Öztürk'];
    const positions = [
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Developer',
        'UI/UX Designer',
        'Product Manager',
        'Data Analyst',
        'DevOps Engineer',
        'QA Engineer'
    ];
    const skills = [
        ['JavaScript', 'React', 'Node.js', 'TypeScript'],
        ['Python', 'Django', 'PostgreSQL', 'Redis'],
        ['Java', 'Spring Boot', 'MySQL', 'Kafka'],
        ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
        ['Agile', 'Scrum', 'JIRA', 'Product Strategy'],
        ['SQL', 'Python', 'Tableau', 'Excel'],
        ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
        ['Selenium', 'Jest', 'Cypress', 'Test Automation']
    ];

    const randomName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
    const posIndex = Math.floor(Math.random() * positions.length);

    return {
        name: `${randomName} ${randomLast}`,
        email: `${randomName.toLowerCase()}.${randomLast.toLowerCase()}@example.com`,
        phone: `+90 5${Math.floor(Math.random() * 100000000).toString().padStart(9, '0')}`,
        position: positions[posIndex],
        experience_years: Math.floor(Math.random() * 10) + 1,
        skills: skills[posIndex],
        summary: `${positions[posIndex]} pozisyonunda ${Math.floor(Math.random() * 10) + 1} yıl deneyimli, ${skills[posIndex].join(', ')} konularında uzman profesyonel.`,
        aiRecommendation: `Teknik yetkinlikleri güçlü, takım çalışmasına uyumlu. ${positions[posIndex]} pozisyonu için uygun bir aday.`
    };
}
