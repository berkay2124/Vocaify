/**
 * Vocaify Chrome Extension - Background Service Worker
 * AŞAMA 29: Firebase ve Claude API entegrasyonu
 * Aday ekleme işlemlerini yönetir
 */

console.log('🚀 Vocaify Background Service Worker başlatıldı');

// Extension yüklendiğinde
chrome.runtime.onInstalled.addListener(() => {
    console.log('Vocaify Extension yüklendi!');
});

// Popup'tan gelen mesajları dinle
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background mesaj alındı:', request);

    if (request.action === 'addToVocaify') {
        handleAddToVocaify(request.candidate)
            .then(result => sendResponse(result))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Asenkron response
    }

    return false;
});

// Vocaify'a aday ekleme fonksiyonu
async function handleAddToVocaify(candidate) {
    try {
        console.log('Aday Vocaify\'a ekleniyor:', candidate);

        // 1. Kullanıcının Firebase config bilgilerini al
        const config = await getFirebaseConfig();
        if (!config || !config.apiKey) {
            throw new Error('Firebase yapılandırması bulunamadı. Lütfen eklenti ayarlarından Firebase bilgilerinizi girin.');
        }

        // 2. AI analizi yap (Claude API)
        const analysisResult = await analyzeWithClaude(candidate, config.claudeApiKey);

        // 3. Firebase'e kaydet
        const saveResult = await saveToFirebase(candidate, analysisResult, config);

        return {
            success: true,
            message: `${candidate.name} başarıyla Vocaify'a eklendi!`,
            candidateId: saveResult.candidateId
        };

    } catch (error) {
        console.error('Vocaify\'a ekleme hatası:', error);
        return {
            success: false,
            error: error.message || 'Aday eklenirken bir hata oluştu'
        };
    }
}

// Firebase config'i al (Chrome Storage'dan)
async function getFirebaseConfig() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['firebaseConfig', 'claudeApiKey'], (result) => {
            resolve({
                apiKey: result.firebaseConfig?.apiKey || '',
                databaseURL: result.firebaseConfig?.databaseURL || '',
                claudeApiKey: result.claudeApiKey || ''
            });
        });
    });
}

// Claude API ile CV analizi
async function analyzeWithClaude(candidate, apiKey) {
    if (!apiKey) {
        console.warn('Claude API key yok, demo analiz kullanılıyor');
        return createDemoAnalysis(candidate);
    }

    try {
        const cvText = createCVText(candidate);

        const prompt = `Aşağıdaki LinkedIn profil bilgisini analiz et ve JSON formatında çıkar:

PROFIL:
İsim: ${candidate.name}
Pozisyon: ${candidate.title}
Lokasyon: ${candidate.location}
Hakkında: ${candidate.about}
Deneyim: ${candidate.experience}
Eğitim: ${candidate.education}
Yetenekler: ${candidate.skills.join(', ')}

GÖREV:
- position: Kişinin pozisyonu
- skills: Yetenekler listesi (array)
- experience_years: Tahmini deneyim yılı (number)
- summary: Kısa özet (2-3 cümle)
- aiRecommendation: İşe alım tavsiyesi

SADECE JSON döndür:
{
  "position": "Senior Developer",
  "email": "",
  "phone": "",
  "skills": ["React", "Node.js"],
  "experience_years": 5,
  "summary": "...",
  "aiRecommendation": "Güçlü Aday - ..."
}`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 2000,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            })
        });

        if (!response.ok) {
            throw new Error('Claude API hatası');
        }

        const data = await response.json();
        const aiResponse = data.content[0].text;
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        } else {
            throw new Error('AI yanıtı parse edilemedi');
        }

    } catch (error) {
        console.error('Claude analiz hatası:', error);
        return createDemoAnalysis(candidate);
    }
}

// Demo analiz (API yoksa)
function createDemoAnalysis(candidate) {
    return {
        position: candidate.title || 'Pozisyon belirtilmemiş',
        email: '',
        phone: '',
        skills: candidate.skills.length > 0 ? candidate.skills : ['LinkedIn', 'Profesyonel İletişim'],
        experience_years: estimateExperienceYears(candidate.experience),
        summary: `LinkedIn'den eklendi. ${candidate.title || 'Pozisyon'} olarak çalışıyor. ${candidate.location ? `Lokasyon: ${candidate.location}.` : ''}`,
        aiRecommendation: 'LinkedIn Profili - Detaylı inceleme önerilir'
    };
}

// Deneyim yılını tahmin et
function estimateExperienceYears(experienceText) {
    if (!experienceText) return 0;

    // "5 yıl", "3 years" gibi ifadeleri ara
    const yearMatch = experienceText.match(/(\d+)\s*(yıl|yrs?|years?)/i);
    if (yearMatch) {
        return parseInt(yearMatch[1]);
    }

    return 2; // Varsayılan
}

// CV metni oluştur
function createCVText(candidate) {
    let text = `İsim: ${candidate.name}\n`;
    text += `Pozisyon: ${candidate.title}\n`;
    if (candidate.location) text += `Lokasyon: ${candidate.location}\n`;
    if (candidate.about) text += `\nHakkında:\n${candidate.about}\n`;
    if (candidate.experience) text += `\nDeneyim:\n${candidate.experience}\n`;
    if (candidate.education) text += `\nEğitim:\n${candidate.education}\n`;
    if (candidate.skills.length > 0) text += `\nYetenekler:\n${candidate.skills.join(', ')}\n`;
    return text;
}

// Firebase'e kaydet
async function saveToFirebase(candidate, analysis, config) {
    if (!config.apiKey || !config.databaseURL) {
        throw new Error('Firebase yapılandırması eksik');
    }

    try {
        // Benzersiz ID oluştur
        const candidateId = `linkedin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const candidateData = {
            id: candidateId,
            name: candidate.name,
            email: analysis.email || '',
            phone: analysis.phone || '',
            status: 'basvuru',
            uploadDate: candidate.addedDate,
            source: 'LinkedIn (Chrome Extension)',
            linkedInUrl: candidate.profileUrl,
            analysis: {
                position: analysis.position,
                skills: analysis.skills,
                experience_years: analysis.experience_years,
                summary: analysis.summary,
                aiRecommendation: analysis.aiRecommendation
            },
            linkedinData: {
                location: candidate.location,
                about: candidate.about,
                experience: candidate.experience,
                education: candidate.education,
                rawSkills: candidate.skills
            }
        };

        // Firebase REST API kullanarak kaydet
        const url = `${config.databaseURL}/candidates/${candidateId}.json`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(candidateData)
        });

        if (!response.ok) {
            throw new Error('Firebase kayıt hatası');
        }

        console.log('Firebase\'e kaydedildi:', candidateId);

        return { candidateId };

    } catch (error) {
        console.error('Firebase kayıt hatası:', error);
        throw new Error('Veritabanına kaydedilemedi: ' + error.message);
    }
}

console.log('Background Service Worker hazır!');
