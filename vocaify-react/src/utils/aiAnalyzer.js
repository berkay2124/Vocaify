/**
 * Anthropic API (Claude) ile CV analizi
 * CV metnini AI'ya gönderir ve yapılandırılmış veri alır
 */

const ANTHROPIC_API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-3-5-sonnet-20241022';

/**
 * CV metnini Anthropic API ile analiz eder
 * @param {string} cvText - CV'den çıkarılan metin
 * @returns {Promise<Object>} Analiz sonuçları
 */
export async function analyzeCVWithAI(cvText) {
    if (!ANTHROPIC_API_KEY) {
        console.warn('Anthropic API key bulunamadı. Demo modu kullanılıyor.');
        return analyzeCVDemo(cvText);
    }

    try {
        const prompt = `Aşağıdaki CV metnini analiz et ve bana şu bilgileri JSON formatında çıkar:

- name: Kişinin tam adı (string)
- email: E-posta adresi (string, yoksa boş string)
- phone: Telefon numarası (string, yoksa boş string)
- skills: Yetenekler listesi (array of strings, en az 3-5 yetenek)
- experience_years: Toplam deneyim yılı (number, tahmini)
- summary: CV'nin kısa özeti (string, 2-3 cümle)
- aiRecommendation: İşe alım tavsiyesi (string, "Güçlü Aday", "Orta Düzey Aday", veya "Deneyim Gerekli" olarak kategorize et ve kısa açıklama ekle)

SADECE JSON formatında yanıt ver, başka bir şey ekleme. Örnek format:
{
  "name": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "phone": "+90 555 123 4567",
  "skills": ["JavaScript", "React", "Node.js", "Python", "SQL"],
  "experience_years": 5,
  "summary": "5 yıllık deneyime sahip full-stack developer. React ve Node.js konusunda uzman.",
  "aiRecommendation": "Güçlü Aday - Modern web teknolojilerinde yetkin, proje deneyimi çeşitli."
}

CV Metni:
${cvText}`;

        const response = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: MODEL,
                max_tokens: 2000,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Anthropic API hatası:', errorData);
            throw new Error(`API isteği başarısız: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.content[0].text;

        // JSON'u parse et
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('AI yanıtında JSON bulunamadı');
        }

        const parsedData = JSON.parse(jsonMatch[0]);

        // Validation ve default değerler
        return {
            name: parsedData.name || 'İsim Bulunamadı',
            email: parsedData.email || '',
            phone: parsedData.phone || '',
            skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
            experience_years: typeof parsedData.experience_years === 'number' ? parsedData.experience_years : 0,
            summary: parsedData.summary || 'Özet bilgi bulunamadı.',
            aiRecommendation: parsedData.aiRecommendation || 'Değerlendirme yapılamadı.'
        };

    } catch (error) {
        console.error('CV analiz hatası:', error);

        // Hata durumunda demo modu kullan
        console.warn('AI analizi başarısız oldu, demo modu kullanılıyor.');
        return analyzeCVDemo(cvText);
    }
}

/**
 * Demo/Fallback modu - API olmadan basit metin analizi
 * @param {string} cvText - CV metni
 * @returns {Object} Demo analiz sonuçları
 */
function analyzeCVDemo(cvText) {
    const lowerText = cvText.toLowerCase();

    // Basit regex ile email ve telefon bulma
    const emailMatch = cvText.match(/[\w.-]+@[\w.-]+\.\w+/);
    const phoneMatch = cvText.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/);

    // İlk satırı isim olarak al (genellikle CV'lerin başında isim olur)
    const lines = cvText.split('\n').filter(line => line.trim().length > 0);
    const name = lines[0]?.trim() || 'İsim Bulunamadı';

    // Basit skill tespiti
    const skillKeywords = [
        'javascript', 'python', 'java', 'react', 'angular', 'vue',
        'node.js', 'sql', 'mongodb', 'docker', 'kubernetes', 'aws',
        'typescript', 'c++', 'c#', 'php', 'ruby', 'go', 'swift',
        'html', 'css', 'git', 'agile', 'scrum', 'rest api'
    ];

    const foundSkills = skillKeywords.filter(skill =>
        lowerText.includes(skill)
    );

    // Deneyim yılı tahmini (yıl sayıları ara)
    const yearMatches = cvText.match(/\b(19|20)\d{2}\b/g);
    let experienceYears = 0;
    if (yearMatches && yearMatches.length >= 2) {
        const years = yearMatches.map(y => parseInt(y)).sort();
        const earliest = years[0];
        const latest = years[years.length - 1];
        experienceYears = Math.max(0, new Date().getFullYear() - earliest);
    }

    return {
        name: name,
        email: emailMatch ? emailMatch[0] : '',
        phone: phoneMatch ? phoneMatch[0] : '',
        skills: foundSkills.length > 0 ? foundSkills : ['Genel Yetenek'],
        experience_years: Math.min(experienceYears, 30), // Maksimum 30 yıl
        summary: `${foundSkills.length} farklı teknik yetenek tespit edildi. ${experienceYears > 0 ? `Yaklaşık ${experienceYears} yıl deneyim.` : 'Deneyim süresi belirlenemedi.'}`,
        aiRecommendation: experienceYears >= 3 ? 'Orta Düzey Aday - Değerlendirmeye alınabilir' : 'Deneyim Gerekli - Detaylı inceleme önerilir'
    };
}

/**
 * API key'in yapılandırılıp yapılandırılmadığını kontrol eder
 * @returns {boolean} API key var mı?
 */
export function isAIConfigured() {
    return !!ANTHROPIC_API_KEY;
}
