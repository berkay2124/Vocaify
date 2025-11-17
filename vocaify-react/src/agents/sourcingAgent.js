/**
 * AI Sourcing Agent
 * Halka açık LinkedIn profillerini otomatik olarak tarar ve analiz eder
 *
 * ÖNEMLİ: Bu modül etik ve yasal kurallara uygun olarak tasarlanmıştır:
 * - Sadece halka açık profilleri simüle eder
 * - Gerçek scraping yapmaz (demo amaçlıdır)
 * - Kullanıcı tarafından girilen kriterlerle eşleşen profiller üretir
 * - Production'da gerçek LinkedIn API veya iş ilanı platformları entegrasyonu gerektirir
 */

import { analyzeCVWithAI } from '../utils/aiAnalyzer';

/**
 * Demo profil veritabanı (simülasyon için)
 * Gerçek uygulamada bu veriler LinkedIn API veya benzer kaynaklardan gelir
 */
const DEMO_PROFILES = [
    {
        name: 'Ayşe Demir',
        title: 'Senior React Developer',
        location: 'İstanbul, Türkiye',
        summary: '8 yıllık React, TypeScript ve Node.js deneyimi. E-ticaret ve fintech projelerinde çalıştı.',
        skills: ['React', 'TypeScript', 'Node.js', 'Redux', 'GraphQL', 'AWS'],
        experience: '8 years',
        publicProfile: true
    },
    {
        name: 'Mehmet Yılmaz',
        title: 'Full Stack Developer',
        location: 'İstanbul, Türkiye',
        summary: '5 yıllık web geliştirme deneyimi. React, Vue.js ve Python Django ile çalışmalar.',
        skills: ['React', 'Vue.js', 'Python', 'Django', 'PostgreSQL', 'Docker'],
        experience: '5 years',
        publicProfile: true
    },
    {
        name: 'Zeynep Kaya',
        title: 'Frontend Developer',
        location: 'Ankara, Türkiye',
        summary: '4 yıl React ve modern JavaScript frameworkleri üzerine çalışmalar.',
        skills: ['React', 'JavaScript', 'CSS3', 'Tailwind', 'Next.js', 'Firebase'],
        experience: '4 years',
        publicProfile: true
    },
    {
        name: 'Can Özdemir',
        title: 'React Native Developer',
        location: 'İzmir, Türkiye',
        summary: '6 yıl mobil ve web uygulama geliştirme. React Native ve React.js uzmanlığı.',
        skills: ['React Native', 'React', 'JavaScript', 'iOS', 'Android', 'Redux'],
        experience: '6 years',
        publicProfile: true
    },
    {
        name: 'Elif Arslan',
        title: 'UI/UX Designer & Frontend Developer',
        location: 'İstanbul, Türkiye',
        summary: '7 yıl tasarım ve frontend geliştirme deneyimi. Figma, React ve TypeScript.',
        skills: ['React', 'TypeScript', 'Figma', 'UI/UX Design', 'HTML5', 'CSS3'],
        experience: '7 years',
        publicProfile: true
    },
    {
        name: 'Burak Şahin',
        title: 'Senior Software Engineer',
        location: 'İstanbul, Türkiye',
        summary: '10 yıl yazılım geliştirme. React, Angular, Node.js ve microservices mimarisi.',
        skills: ['React', 'Angular', 'Node.js', 'Kubernetes', 'Microservices', 'MongoDB'],
        experience: '10 years',
        publicProfile: true
    },
    {
        name: 'Selin Aydın',
        title: 'React Developer',
        location: 'Bursa, Türkiye',
        summary: '3 yıl React ve modern web teknolojileri üzerine çalışmalar.',
        skills: ['React', 'JavaScript', 'Redux', 'REST API', 'Git', 'Agile'],
        experience: '3 years',
        publicProfile: true
    },
    {
        name: 'Emre Çelik',
        title: 'Full Stack JavaScript Developer',
        location: 'Ankara, Türkiye',
        summary: '6 yıl MERN stack geliştirme. MongoDB, Express, React, Node.js.',
        skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'TypeScript'],
        experience: '6 years',
        publicProfile: true
    },
    {
        name: 'Deniz Kara',
        title: 'Frontend Architect',
        location: 'İstanbul, Türkiye',
        summary: '12 yıl frontend geliştirme ve mimari tasarım deneyimi. React ve Vue.js ekosistemi.',
        skills: ['React', 'Vue.js', 'Architecture', 'TypeScript', 'Webpack', 'Performance'],
        experience: '12 years',
        publicProfile: true
    },
    {
        name: 'Merve Yıldız',
        title: 'React & Redux Developer',
        location: 'İzmir, Türkiye',
        summary: '4 yıl React ve Redux ile state management üzerine çalışmalar.',
        skills: ['React', 'Redux', 'Redux Toolkit', 'TypeScript', 'Jest', 'Testing'],
        experience: '4 years',
        publicProfile: true
    }
];

/**
 * Arama kriterlerine göre profilleri filtreler
 * @param {string} keywords - Arama anahtar kelimeleri
 * @param {string} location - Lokasyon
 * @param {number} maxResults - Maksimum sonuç sayısı
 * @returns {Array} Filtrelenmiş profiller
 */
function filterProfiles(keywords, location, maxResults = 10) {
    const keywordsLower = keywords.toLowerCase();
    const locationLower = location.toLowerCase();

    let filtered = DEMO_PROFILES.filter(profile => {
        // Anahtar kelime kontrolü (title, summary veya skills'de)
        const keywordMatch =
            profile.title.toLowerCase().includes(keywordsLower) ||
            profile.summary.toLowerCase().includes(keywordsLower) ||
            profile.skills.some(skill => skill.toLowerCase().includes(keywordsLower));

        // Lokasyon kontrolü (boş ise atla)
        const locationMatch = !location ||
            profile.location.toLowerCase().includes(locationLower);

        return keywordMatch && locationMatch && profile.publicProfile;
    });

    // Maksimum sonuç sayısı kadar döndür
    return filtered.slice(0, maxResults);
}

/**
 * Profil bilgisini CV formatına dönüştürür
 * @param {Object} profile - Profil objesi
 * @returns {string} CV metni
 */
function profileToCVText(profile) {
    return `
Name: ${profile.name}
Title: ${profile.title}
Location: ${profile.location}

Professional Summary:
${profile.summary}

Skills:
${profile.skills.join(', ')}

Experience:
${profile.experience} of professional experience

LinkedIn Profile: Public
Source: LinkedIn (Public Data)
    `.trim();
}

/**
 * LinkedIn'de halka açık profil araması yapar (simülasyon)
 * @param {Object} criteria - Arama kriterleri
 * @param {string} criteria.keywords - Arama anahtar kelimeleri
 * @param {string} criteria.location - Lokasyon
 * @param {string} criteria.platform - Platform (LinkedIn)
 * @param {number} criteria.maxResults - Maksimum sonuç sayısı
 * @returns {Promise<Object>} Arama sonuçları
 */
export async function searchPublicProfiles(criteria) {
    const { keywords, location = '', maxResults = 10 } = criteria;

    // Simülasyon: Gerçek uygulamada burada LinkedIn API veya web scraping olur
    console.log('🔍 AI Sourcing başlatıldı:', criteria);

    // 1-3 saniye arasında bekleme (gerçek arama simülasyonu)
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));

    // Profilleri filtrele
    const matchedProfiles = filterProfiles(keywords, location, maxResults);

    console.log(`✅ ${matchedProfiles.length} halka açık profil bulundu`);

    return {
        success: true,
        platform: 'LinkedIn (Public Data)',
        searchCriteria: { keywords, location },
        totalFound: matchedProfiles.length,
        profiles: matchedProfiles,
        timestamp: new Date().toISOString()
    };
}

/**
 * Bulunan profilleri AI ile analiz eder ve puanlar
 * @param {Array} profiles - Profil listesi
 * @param {string} jobDescription - İş tanımı (opsiyonel)
 * @returns {Promise<Array>} Analiz edilmiş ve puanlanmış profiller
 */
export async function analyzeProfiles(profiles, jobDescription = '') {
    console.log(`🤖 ${profiles.length} profil AI ile analiz ediliyor...`);

    const analyzedProfiles = [];

    for (const profile of profiles) {
        try {
            // Profili CV formatına dönüştür
            const cvText = profileToCVText(profile);

            // AI analizi yap
            const analysis = await analyzeCVWithAI(cvText);

            // Profil ile analizi birleştir
            const analyzedProfile = {
                ...profile,
                aiAnalysis: {
                    skills: analysis.skills,
                    experienceYears: analysis.experience_years,
                    summary: analysis.summary,
                    recommendation: analysis.aiRecommendation,
                    matchScore: calculateMatchScore(profile, jobDescription)
                },
                analyzedAt: new Date().toISOString()
            };

            analyzedProfiles.push(analyzedProfile);
            console.log(`✓ ${profile.name} analiz edildi`);

        } catch (error) {
            console.error(`✗ ${profile.name} analiz edilirken hata:`, error);
            // Hata durumunda profili yine de ekle ama analiz olmadan
            analyzedProfiles.push({
                ...profile,
                aiAnalysis: null,
                error: 'Analiz başarısız'
            });
        }
    }

    return analyzedProfiles;
}

/**
 * Profil ile iş tanımı arasında eşleşme puanı hesaplar
 * @param {Object} profile - Profil objesi
 * @param {string} jobDescription - İş tanımı
 * @returns {number} 0-100 arası puan
 */
function calculateMatchScore(profile, jobDescription) {
    if (!jobDescription) return 75; // Default puan

    const jobLower = jobDescription.toLowerCase();
    let score = 60; // Base score

    // Skill eşleşmesi
    const matchingSkills = profile.skills.filter(skill =>
        jobLower.includes(skill.toLowerCase())
    );
    score += matchingSkills.length * 5;

    // Title eşleşmesi
    if (jobLower.includes(profile.title.toLowerCase())) {
        score += 10;
    }

    // Maksimum 100 puan
    return Math.min(score, 100);
}

/**
 * Sourcing görevi çalıştırır (ana fonksiyon)
 * @param {Object} task - Sourcing görevi
 * @param {string} task.keywords - Arama anahtar kelimeleri
 * @param {string} task.location - Lokasyon
 * @param {string} task.platform - Platform
 * @param {string} task.jobDescription - İş tanımı (opsiyonel)
 * @returns {Promise<Object>} Sonuçlar
 */
export async function runSourcingTask(task) {
    try {
        console.log('🚀 Sourcing görevi başlatılıyor...', task);

        // 1. Profil ara
        const searchResults = await searchPublicProfiles({
            keywords: task.keywords,
            location: task.location,
            platform: task.platform,
            maxResults: 10
        });

        if (searchResults.totalFound === 0) {
            return {
                success: true,
                totalFound: 0,
                analyzed: 0,
                profiles: [],
                message: 'Arama kriterlerinize uygun profil bulunamadı.'
            };
        }

        // 2. Profilleri AI ile analiz et
        const analyzedProfiles = await analyzeProfiles(
            searchResults.profiles,
            task.jobDescription
        );

        // 3. Puanlarına göre sırala (en yüksekten düşüğe)
        const sortedProfiles = analyzedProfiles.sort((a, b) => {
            const scoreA = a.aiAnalysis?.matchScore || 0;
            const scoreB = b.aiAnalysis?.matchScore || 0;
            return scoreB - scoreA;
        });

        return {
            success: true,
            platform: searchResults.platform,
            totalFound: searchResults.totalFound,
            analyzed: sortedProfiles.length,
            profiles: sortedProfiles,
            searchCriteria: searchResults.searchCriteria,
            completedAt: new Date().toISOString()
        };

    } catch (error) {
        console.error('Sourcing görevi hatası:', error);
        throw error;
    }
}
