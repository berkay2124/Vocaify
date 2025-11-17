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

/**
 * AŞAMA 16: Üretken AI Araç Kiti
 * İş ilanı, mülakat soruları ve e-posta metinleri oluşturur
 */

/**
 * İş İlanı Yazarı - Pozisyon ve sorumluluklar verilerek tam iş ilanı oluşturur
 * @param {string} positionTitle - Pozisyon adı
 * @param {Array<string>} responsibilities - Ana sorumluluklar (3 adet)
 * @returns {Promise<Object>} İş ilanı metni
 */
export async function generateJobDescription(positionTitle, responsibilities) {
    if (!positionTitle || !responsibilities || responsibilities.length === 0) {
        return {
            success: false,
            message: 'Pozisyon adı ve sorumluluklar gereklidir.'
        };
    }

    if (!ANTHROPIC_API_KEY) {
        console.warn('Anthropic API key bulunamadı. Demo modu kullanılıyor.');
        return {
            success: true,
            jobDescription: `${positionTitle} İş İlanı\n\nAramıza katılacak ${positionTitle} arıyoruz!\n\nSorumluluklar:\n${responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\nNitelikler:\n- İlgili alanda deneyim\n- Takım çalışmasına yatkınlık\n- Güçlü iletişim becerileri\n\nBaşvurmak için lütfen CV'nizi gönderin.`
        };
    }

    try {
        const prompt = `Sen bir İnsan Kaynakları uzmanısın. Aşağıdaki bilgileri kullanarak profesyonel, ilgi çekici ve detaylı bir iş ilanı oluştur:

POZİSYON: ${positionTitle}

ANA SORUMLULUKLAAR:
${responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}

GÖREV:
- Modern ve profesyonel bir dil kullan
- Şirket kültürüne vurgu yap
- Açık ve net nitelikler/gereksinimler belirt
- Başvuru süreci hakkında bilgi ver
- İlgi çekici ve motive edici bir ton kullan

FORMAT:
İş ilanını şu başlıklar altında oluştur:
1. Pozisyon Tanımı (1-2 paragraf)
2. Sorumluluklar (detaylı madde madde)
3. Aranan Nitelikler (madde madde)
4. Biz Kimiz? (şirket hakkında kısa bilgi)
5. Neler Sunuyoruz? (yan haklar)
6. Başvuru Süreci

SADECE metin döndür, JSON veya başka format kullanma.`;

        const response = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: MODEL,
                max_tokens: 2500,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`API isteği başarısız: ${response.status}`);
        }

        const data = await response.json();
        const jobDescription = data.content[0].text;

        return {
            success: true,
            jobDescription
        };

    } catch (error) {
        console.error('İş ilanı oluşturma hatası:', error);
        return {
            success: true,
            jobDescription: `${positionTitle} İş İlanı\n\nAramıza katılacak ${positionTitle} arıyoruz!\n\nSorumluluklar:\n${responsibilities.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\nNitelikler:\n- İlgili alanda deneyim\n- Takım çalışmasına yatkınlık\n- Güçlü iletişim becerileri\n\nBaşvurmak için lütfen CV'nizi gönderin.`
        };
    }
}

/**
 * Mülakat Sorusu Üretici - Aday CV'si ve iş ilanı analiz edilerek özel mülakat soruları oluşturur
 * @param {Object} candidate - Aday bilgileri (CV özeti, yetenekler)
 * @param {string} jobDescription - İş ilanı metni
 * @returns {Promise<Object>} 5 mülakat sorusu
 */
export async function generateInterviewQuestions(candidate, jobDescription = '') {
    if (!candidate || !candidate.analysis) {
        return {
            success: false,
            message: 'Aday bilgileri gereklidir.'
        };
    }

    if (!ANTHROPIC_API_KEY) {
        console.warn('Anthropic API key bulunamadı. Demo modu kullanılıyor.');
        return {
            success: true,
            questions: [
                `${candidate.analysis.position || 'Bu pozisyon'} için en önemli becerileriniz nelerdir?`,
                'Kariyerinizdeki en büyük başarınızdan bahseder misiniz?',
                'Zor bir proje yönetme deneyiminizi anlatır mısınız?',
                'Ekip çalışmasında nasıl bir rol üstlenirsiniz?',
                'Neden bu pozisyona başvurdunuz ve şirketimize nasıl değer katabilirsiniz?'
            ]
        };
    }

    try {
        const prompt = `Sen deneyimli bir mülakat uzmanısın. Aşağıdaki aday profili ve iş ilanı için 5 spesifik, derinlemesine mülakat sorusu oluştur:

ADAY PROFİLİ:
- İsim: ${candidate.name}
- Pozisyon: ${candidate.analysis.position || 'Belirtilmemiş'}
- Deneyim: ${candidate.analysis.experience_years || 0} yıl
- Yetenekler: ${candidate.analysis.skills?.join(', ') || 'Belirtilmemiş'}
- Özet: ${candidate.analysis.summary || 'Yok'}

İŞ İLANI:
${jobDescription || 'Genel pozisyon için mülakat'}

GÖREV:
- Adayın CV'sine özel sorular sor (deneyimlerine, yeteneklerine dayalı)
- Hem teknik hem de davranışsal sorular dahil et
- STAR metoduna uygun sorular tercih et
- Açık uçlu sorular kullan
- Gerçek proje deneyimlerini öğrenmeyi hedefle

ZORUNLU FORMAT:
JSON formatında 5 soru döndür:
{
  "questions": [
    "Soru 1...",
    "Soru 2...",
    "Soru 3...",
    "Soru 4...",
    "Soru 5..."
  ]
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
            questions: parsedData.questions || []
        };

    } catch (error) {
        console.error('Mülakat sorusu oluşturma hatası:', error);
        return {
            success: true,
            questions: [
                `${candidate.analysis.position || 'Bu pozisyon'} için en önemli becerileriniz nelerdir?`,
                'Kariyerinizdeki en büyük başarınızdan bahseder misiniz?',
                'Zor bir proje yönetme deneyiminizi anlatır mısınız?',
                'Ekip çalışmasında nasıl bir rol üstlenirsiniz?',
                'Neden bu pozisyona başvurdunuz ve şirketimize nasıl değer katabilirsiniz?'
            ]
        };
    }
}

/**
 * E-posta Yazarı - Mülakata davet veya red e-postası oluşturur
 * @param {Object} candidate - Aday bilgileri
 * @param {string} emailType - 'invitation' (davet) veya 'rejection' (red)
 * @param {Object} details - Ek detaylar (mülakat tarihi, saati vb.)
 * @returns {Promise<Object>} E-posta metni
 */
export async function generateEmail(candidate, emailType, details = {}) {
    if (!candidate || !emailType) {
        return {
            success: false,
            message: 'Aday bilgileri ve e-posta tipi gereklidir.'
        };
    }

    if (!ANTHROPIC_API_KEY) {
        console.warn('Anthropic API key bulunamadı. Demo modu kullanılıyor.');

        if (emailType === 'invitation') {
            return {
                success: true,
                subject: 'Mülakat Davetiniz - Vocaify',
                body: `Sayın ${candidate.name},\n\n${candidate.analysis.position || 'Pozisyon'} başvurunuz için teşekkür ederiz. Sizi mülakata davet etmekten mutluluk duyuyoruz.\n\nMülakat Detayları:\nTarih: ${details.date || 'Belirtilecek'}\nSaat: ${details.time || 'Belirtilecek'}\nYer: ${details.location || 'Online/Ofis'}\n\nSaygılarımızla,\nİnsan Kaynakları Ekibi`
            };
        } else {
            return {
                success: true,
                subject: 'Başvurunuz Hakkında - Vocaify',
                body: `Sayın ${candidate.name},\n\n${candidate.analysis.position || 'Pozisyon'} başvurunuz için zaman ayırdığınız için teşekkür ederiz.\n\nMaalesef bu sefer başvurunuz değerlendirme sürecinde ilerletilmemiştir. CV'niz talent havuzumuzda saklanacak ve uygun pozisyonlar için sizinle iletişime geçeceğiz.\n\nBaşarılar dileriz.\n\nSaygılarımızla,\nİnsan Kaynakları Ekibi`
            };
        }
    }

    try {
        const isInvitation = emailType === 'invitation';

        const prompt = isInvitation
            ? `Sen profesyonel bir İnsan Kaynakları uzmanısın. Aşağıdaki aday için kibar, profesyonel ve motive edici bir mülakat davet e-postası yaz:

ADAY BİLGİLERİ:
- İsim: ${candidate.name}
- Pozisyon: ${candidate.analysis.position || 'Belirtilmemiş'}

MÜLAKAT DETAYLARI:
- Tarih: ${details.date || 'Belirlenecek'}
- Saat: ${details.time || 'Belirlenecek'}
- Yer: ${details.location || 'Online/Şirket Ofisi'}
- Süre: ${details.duration || '45-60 dakika'}

GÖREV:
- Profesyonel ve samimi bir ton kullan
- Adaya değer verildiğini hissettir
- Mülakat detaylarını net belirt
- Hazırlık için ipuçları ver
- İletişim bilgisi ekle

FORMAT:
JSON formatında döndür:
{
  "subject": "E-posta konusu",
  "body": "E-posta içeriği (paragraflar \\n\\n ile ayrılsın)"
}

SADECE JSON döndür.`
            : `Sen empatik bir İnsan Kaynakları uzmanısın. Aşağıdaki aday için kibar, saygılı ve umut verici bir red e-postası yaz:

ADAY BİLGİLERİ:
- İsim: ${candidate.name}
- Pozisyon: ${candidate.analysis.position || 'Belirtilmemiş'}

GÖREV:
- Son derece kibar ve saygılı bir ton kullan
- Adayın değerini vurgula
- Gelecekte tekrar başvurmayı teşvik et
- Talent havuzunda kalacağını belirt
- Pozitif bir not ile bitir

FORMAT:
JSON formatında döndür:
{
  "subject": "E-posta konusu",
  "body": "E-posta içeriği (paragraflar \\n\\n ile ayrılsın)"
}

SADECE JSON döndür.`;

        const response = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: MODEL,
                max_tokens: 1500,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
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
            subject: parsedData.subject || 'E-posta',
            body: parsedData.body || ''
        };

    } catch (error) {
        console.error('E-posta oluşturma hatası:', error);

        if (emailType === 'invitation') {
            return {
                success: true,
                subject: 'Mülakat Davetiniz - Vocaify',
                body: `Sayın ${candidate.name},\n\n${candidate.analysis.position || 'Pozisyon'} başvurunuz için teşekkür ederiz. Sizi mülakata davet etmekten mutluluk duyuyoruz.\n\nMülakat Detayları:\nTarih: ${details.date || 'Belirtilecek'}\nSaat: ${details.time || 'Belirtilecek'}\nYer: ${details.location || 'Online/Ofis'}\n\nSaygılarımızla,\nİnsan Kaynakları Ekibi`
            };
        } else {
            return {
                success: true,
                subject: 'Başvurunuz Hakkında - Vocaify',
                body: `Sayın ${candidate.name},\n\n${candidate.analysis.position || 'Pozisyon'} başvurunuz için zaman ayırdığınız için teşekkür ederiz.\n\nMaalesef bu sefer başvurunuz değerlendirme sürecinde ilerletilmemiştir. CV'niz talent havuzumuzda saklanacak ve uygun pozisyonlar için sizinle iletişime geçeceğiz.\n\nBaşarılar dileriz.\n\nSaygılarımızla,\nİnsan Kaynakları Ekibi`
            };
        }
    }
}

/**
 * AŞAMA 27: Bias (Önyargı) Tespiti
 * İş ilanı metnini önyargılı dil, cinsiyetçilik ve yaş/etnik ayrımcılık açısından tarar
 * @param {string} jobDescriptionText - İş ilanı metni
 * @returns {Promise<Object>} Tespit edilen bias uyarıları
 */
export async function detectBiasInJobDescription(jobDescriptionText) {
    if (!jobDescriptionText || jobDescriptionText.trim().length === 0) {
        return {
            success: false,
            message: 'İş ilanı metni gereklidir.'
        };
    }

    if (!ANTHROPIC_API_KEY) {
        console.warn('Anthropic API key bulunamadı. Demo bias kontrolü kullanılıyor.');
        return detectBiasDemo(jobDescriptionText);
    }

    try {
        const prompt = `Sen bir İnsan Kaynakları etik danışmanısın. Görevi: İş ilanlarını "önyargı" (bias), "cinsiyetçi dil", "yaş ayrımcılığı" ve "kapsayıcı olmayan ifadeler" açısından taramak.

İŞ İLANI METNİ:
${jobDescriptionText}

GÖREV:
Bu iş ilanını incele ve aşağıdaki tür önyargıları tespit et:

1. **Cinsiyetçi Dil**: "rockstar developer", "ninja coder", "genç ve dinamik", "baba gibi lider", vb.
2. **Yaş Ayrımcılığı**: "genç", "dinamik", "enerji dolu", "yeni mezun", vb.
3. **Etnik/Kültürel Önyargı**: Belirli etnik/kültürel gruplara işaret eden ifadeler
4. **Fiziksel Özellik Vurgusu**: Görünüşle ilgili beklentiler
5. **Aile Durumu Varsayımları**: "Bekâr", "esnek çalışma saatleri" (dolaylı olarak aile yükümlülüğü olmayan kişi arayışı), vb.

Eğer önyargı tespit edersen, şu bilgileri ver:
- phrase: Önyargılı ifade
- reason: Neden önyargılı? (Kısa açıklama)
- alternative: Daha kapsayıcı alternatif öneri

ZORUNLU FORMAT:
JSON formatında döndür:
{
  "warnings": [
    {
      "phrase": "genç ve dinamik",
      "reason": "Yaş ayrımcılığı içerir, deneyimli adayları dışlar",
      "alternative": "enerji dolu ve hızlı öğrenen"
    },
    {
      "phrase": "rockstar developer",
      "reason": "Cinsiyet stereotipi içerir, kadın adayları caydırabilir",
      "alternative": "deneyimli geliştirici" veya "yetenekli geliştirici"
    }
  ]
}

ÖNEMLI:
- Eğer HİÇBİR önyargı tespit edilmezse, boş array döndür: {"warnings": []}
- SADECE JSON döndür, başka metin ekleme
- Gerçekten sorunlu ifadeleri bul, abartma`;

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
            throw new Error(`API isteği başarısız: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.content[0].text;

        // JSON'u parse et
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.warn('AI yanıtında JSON bulunamadı, demo modu kullanılıyor.');
            return detectBiasDemo(jobDescriptionText);
        }

        const parsedData = JSON.parse(jsonMatch[0]);

        return {
            success: true,
            warnings: parsedData.warnings || []
        };

    } catch (error) {
        console.error('Bias tespiti hatası:', error);
        console.warn('AI bias kontrolü başarısız, demo modu kullanılıyor.');
        return detectBiasDemo(jobDescriptionText);
    }
}

/**
 * Demo/Fallback modu - Basit regex ile bias tespiti
 * @param {string} text - İş ilanı metni
 * @returns {Object} Demo bias uyarıları
 */
function detectBiasDemo(text) {
    const warnings = [];
    const lowerText = text.toLowerCase();

    // Yaygın önyargılı ifadeler
    const biasPatterns = [
        {
            keywords: ['genç', 'young', 'dinamik'],
            phrase: 'genç ve dinamik',
            reason: 'Yaş ayrımcılığı içerir, deneyimli adayları dışlar',
            alternative: 'enerji dolu ve hızlı öğrenen'
        },
        {
            keywords: ['rockstar', 'ninja', 'guru', 'wizard'],
            phrase: 'rockstar/ninja developer',
            reason: 'Cinsiyet stereotipi içerir, kadın adayları caydırabilir',
            alternative: 'deneyimli geliştirici'
        },
        {
            keywords: ['agresif', 'aggressive'],
            phrase: 'agresif satış',
            reason: 'Maskülen özellikleri vurgular, kapsayıcı değil',
            alternative: 'hedef odaklı satış'
        },
        {
            keywords: ['bekâr', 'single', 'evli', 'married'],
            phrase: 'bekâr/evli tercihi',
            reason: 'Aile durumu ayrımcılığı, yasalara aykırı',
            alternative: 'Kaldırılmalı - aile durumu sorgulanmamalı'
        },
        {
            keywords: ['native speaker', 'ana dil', 'anadil türkçe'],
            phrase: 'anadili türkçe',
            reason: 'Etnik/kültürel ayrımcılık içerebilir',
            alternative: 'akıcı Türkçe konuşabilen'
        }
    ];

    biasPatterns.forEach(pattern => {
        if (pattern.keywords.some(keyword => lowerText.includes(keyword))) {
            warnings.push({
                phrase: pattern.phrase,
                reason: pattern.reason,
                alternative: pattern.alternative
            });
        }
    });

    return {
        success: true,
        warnings
    };
}

/**
 * AŞAMA 28: AI Destekli Maaş Kıyaslama (Salary Benchmarking)
 * Pozisyon ve lokasyona göre piyasa maaş aralığı tahmini yapar
 * @param {string} positionTitle - Pozisyon adı (örn: "Senior React Developer")
 * @param {string} location - Lokasyon (örn: "İstanbul", "Ankara")
 * @returns {Promise<Object>} Tahmini maaş aralığı
 */
export async function generateSalaryBenchmark(positionTitle, location = 'Türkiye') {
    if (!positionTitle || positionTitle.trim().length === 0) {
        return {
            success: false,
            message: 'Pozisyon adı gereklidir.'
        };
    }

    if (!ANTHROPIC_API_KEY) {
        console.warn('Anthropic API key bulunamadı. Demo modu kullanılıyor.');
        return generateSalaryBenchmarkDemo(positionTitle, location);
    }

    try {
        const prompt = `Sen bir İnsan Kaynakları ve ücretlendirme uzmanısın. Aşağıdaki pozisyon için piyasa maaş aralığı tahmini yap:

POZİSYON: ${positionTitle}
LOKASYON: ${location}

GÖREV:
- 2024-2025 yılı Türkiye piyasa koşullarına göre gerçekçi bir maaş aralığı tahmin et
- Pozisyonun seniorlik seviyesini dikkate al (Junior/Mid-level/Senior)
- Lokasyona göre maaş farklılıklarını hesaba kat (İstanbul genelde %20-30 daha yüksek)
- Brüt aylık maaş olarak TL cinsinden ver
- Hem minimum hem maksimum değer öner

ZORUNLU FORMAT:
JSON formatında döndür:
{
  "minSalary": 45000,
  "maxSalary": 65000,
  "currency": "TRY",
  "period": "monthly",
  "explanation": "Senior React Developer pozisyonu için İstanbul'da piyasa ortalama maaş aralığı. Bu seviye için 5+ yıl deneyim beklenir.",
  "factors": [
    "Seniorlik seviyesi yüksek",
    "İstanbul lokasyonu premium",
    "Talep yüksek teknoloji stack'i"
  ],
  "recommendation": "Bu aralık rekabetçi bir teklif yapmanızı sağlar. Adayın deneyimine göre aralık içinde pozisyon alabilirsiniz."
}

ÖNEMLI:
- Gerçekçi değerler ver (abartma veya çok düşük tutma)
- TRY (Türk Lirası) cinsinden, aylık brüt maaş
- Pozisyon seviyesini dikkate al (Junior: 20-35K, Mid: 35-55K, Senior: 50-80K, Lead: 80-120K gibi)
- SADECE JSON döndür, başka metin ekleme`;

        const response = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: MODEL,
                max_tokens: 1500,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`API isteği başarısız: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.content[0].text;

        // JSON'u parse et
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.warn('AI yanıtında JSON bulunamadı, demo modu kullanılıyor.');
            return generateSalaryBenchmarkDemo(positionTitle, location);
        }

        const parsedData = JSON.parse(jsonMatch[0]);

        return {
            success: true,
            minSalary: parsedData.minSalary || 0,
            maxSalary: parsedData.maxSalary || 0,
            currency: parsedData.currency || 'TRY',
            period: parsedData.period || 'monthly',
            explanation: parsedData.explanation || '',
            factors: parsedData.factors || [],
            recommendation: parsedData.recommendation || ''
        };

    } catch (error) {
        console.error('Maaş kıyaslama hatası:', error);
        console.warn('AI salary benchmark başarısız, demo modu kullanılıyor.');
        return generateSalaryBenchmarkDemo(positionTitle, location);
    }
}

/**
 * Demo/Fallback modu - Basit kural tabanlı maaş tahmini
 * @param {string} positionTitle - Pozisyon adı
 * @param {string} location - Lokasyon
 * @returns {Object} Demo maaş aralığı
 */
function generateSalaryBenchmarkDemo(positionTitle, location = 'Türkiye') {
    const lowerTitle = positionTitle.toLowerCase();

    // Seniorlik seviyesi tespiti
    let seniorityMultiplier = 1;
    let seniority = 'Mid-level';

    if (lowerTitle.includes('junior') || lowerTitle.includes('jr')) {
        seniorityMultiplier = 0.6;
        seniority = 'Junior';
    } else if (lowerTitle.includes('senior') || lowerTitle.includes('sr')) {
        seniorityMultiplier = 1.5;
        seniority = 'Senior';
    } else if (lowerTitle.includes('lead') || lowerTitle.includes('principal') || lowerTitle.includes('chief')) {
        seniorityMultiplier = 2.2;
        seniority = 'Lead/Principal';
    } else if (lowerTitle.includes('manager') || lowerTitle.includes('director')) {
        seniorityMultiplier = 2.5;
        seniority = 'Management';
    }

    // Lokasyon çarpanı
    let locationMultiplier = 1;
    const lowerLocation = location.toLowerCase();

    if (lowerLocation.includes('istanbul') || lowerLocation.includes('İstanbul')) {
        locationMultiplier = 1.25;
    } else if (lowerLocation.includes('ankara') || lowerLocation.includes('izmir')) {
        locationMultiplier = 1.1;
    }

    // Temel maaş (ortalama mid-level developer için)
    const baseSalary = 40000;

    // Hesaplama
    const estimatedSalary = baseSalary * seniorityMultiplier * locationMultiplier;
    const minSalary = Math.round(estimatedSalary * 0.85);
    const maxSalary = Math.round(estimatedSalary * 1.25);

    return {
        success: true,
        minSalary,
        maxSalary,
        currency: 'TRY',
        period: 'monthly',
        explanation: `${seniority} seviyesindeki ${positionTitle} pozisyonu için ${location} lokasyonunda tahmini piyasa maaş aralığı.`,
        factors: [
            `Seniorlik: ${seniority}`,
            `Lokasyon: ${location}`,
            'Genel piyasa trendleri'
        ],
        recommendation: 'Bu aralık, sektör ortalamasına dayalı bir tahmindir. Şirket ölçeği ve adayın deneyimine göre ayarlayabilirsiniz.'
    };
}
