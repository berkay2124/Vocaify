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

/**
 * Başarılı işe alımları (personel statüsündeki çalışanları) analiz eder
 * KPI skorları ve CV özetlerinden ortak yetkinlikleri ve başarı kalıplarını çıkarır
 * @param {Array} employees - Tüm çalışanlar listesi
 * @returns {Promise<Object>} AI stratejik öngörü raporu
 */
export async function analyzePredictiveInsights(employees) {
    // Sadece personel statüsündeki çalışanları filtrele
    const successfulHires = employees.filter(emp => emp.status === 'personel');

    if (successfulHires.length === 0) {
        return {
            success: false,
            message: 'Henüz analiz edilecek yeterli personel verisi yok.',
            insights: []
        };
    }

    if (!ANTHROPIC_API_KEY) {
        console.warn('Anthropic API key bulunamadı. Demo modu kullanılıyor.');
        return analyzePredictiveInsightsDemo(successfulHires);
    }

    try {
        // Analiz için veri hazırla
        const analysisData = successfulHires.map(emp => ({
            name: emp.name,
            position: emp.analysis?.position || emp.position || 'Belirtilmemiş',
            experience_years: emp.analysis?.experience_years || 0,
            skills: emp.analysis?.skills || [],
            summary: emp.analysis?.summary || '',
            kpiScore: emp.totalKpiScore || 0,
            department: emp.department || 'Genel',
            startDate: emp.startDate
        }));

        const prompt = `Sen bir İnsan Kaynakları strateji danışmanısın. Aşağıda bir şirketin başarılı işe alımlarının (personel olarak işe başlayanların) verilerini göreceksin.

VERİ:
${JSON.stringify(analysisData, null, 2)}

GÖREV:
Bu başarılı işe alımlardaki ortak kalıpları, gizli yetkinlikleri ve başarı faktörlerini analiz et. Aşağıdaki soruları yanıtla:

1. KPI skorları ve yetenekler arasında hangi ortak paternler var?
2. Başarılı adaylarda öne çıkan "gizli" yetkinlikler nelerdir? (Sadece teknik değil, soft skill'ler de dahil)
3. Gelecekte en iyi kimi işe almalıyız? (Hangi profil başarı şansı en yüksek?)

ZORUNLU FORMAT:
Yanıtını şu JSON formatında ver, başka bir şey ekleme:
{
  "insights": [
    {
      "title": "İçgörü Başlığı",
      "description": "Detaylı açıklama (1-2 cümle)",
      "actionable": "Eylem önerisi (ne yapmalıyız?)"
    },
    {
      "title": "İkinci İçgörü Başlığı",
      "description": "...",
      "actionable": "..."
    },
    {
      "title": "Üçüncü İçgörü Başlığı",
      "description": "...",
      "actionable": "..."
    }
  ],
  "summary": "Tüm analizin özet sonucu (1-2 cümle)"
}

SADECE JSON döndür, başka metin ekleme.`;

        const response = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: MODEL,
                max_tokens: 3000,
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

        return {
            success: true,
            insights: parsedData.insights || [],
            summary: parsedData.summary || 'Analiz tamamlandı.',
            analyzedCount: successfulHires.length
        };

    } catch (error) {
        console.error('Tahminleme analizi hatası:', error);
        console.warn('AI analizi başarısız oldu, demo modu kullanılıyor.');
        return analyzePredictiveInsightsDemo(successfulHires);
    }
}

/**
 * Demo/Fallback modu - Tahminleme analizi için basit istatistik
 * @param {Array} successfulHires - Başarılı işe alımlar
 * @returns {Object} Demo öngörü raporu
 */
function analyzePredictiveInsightsDemo(successfulHires) {
    const avgKpiScore = successfulHires.reduce((sum, emp) => sum + (emp.totalKpiScore || 0), 0) / successfulHires.length;
    const allSkills = successfulHires.flatMap(emp => emp.analysis?.skills || []);
    const skillFrequency = {};
    allSkills.forEach(skill => {
        skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
    });
    const topSkills = Object.entries(skillFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([skill]) => skill);

    const avgExperience = successfulHires.reduce((sum, emp) => sum + (emp.analysis?.experience_years || 0), 0) / successfulHires.length;

    return {
        success: true,
        analyzedCount: successfulHires.length,
        insights: [
            {
                title: "Yüksek KPI Skoru = Başarı",
                description: `Başarılı adaylarınızın ortalama KPI skoru ${avgKpiScore.toFixed(0)}/100. Yüksek KPI skorlu adaylara öncelik verin.`,
                actionable: `${avgKpiScore.toFixed(0)} ve üzeri KPI skoruna sahip adayları öncelikli değerlendirin.`
            },
            {
                title: "Ortak Yetkinlik Profili",
                description: `En sık görülen yetenekler: ${topSkills.slice(0, 3).join(', ')}. Bu yeteneklere sahip adaylar daha başarılı oluyor.`,
                actionable: `Bu yetenekleri iş ilanlarında özellikle vurgulayın ve filtreleme kriterlerine ekleyin.`
            },
            {
                title: "İdeal Deneyim Seviyesi",
                description: `Başarılı adaylarınızın ortalama deneyimi ${avgExperience.toFixed(1)} yıl. Bu seviyedeki adaylar optimal performans gösteriyor.`,
                actionable: `${Math.max(0, avgExperience - 2).toFixed(0)}-${(avgExperience + 2).toFixed(0)} yıl arası deneyime sahip adaylara odaklanın.`
            }
        ],
        summary: `${successfulHires.length} başarılı işe alım analiz edildi. Ortalama KPI: ${avgKpiScore.toFixed(0)}, ideal deneyim: ${avgExperience.toFixed(1)} yıl.`
    };
}
