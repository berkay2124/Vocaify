/**
 * Vocaify Chrome Extension - Content Script
 * AŞAMA 29: LinkedIn profil sayfalarından bilgi çeker
 * LinkedIn sayfasında çalışır ve DOM'dan profil bilgilerini okur
 */

console.log('🎯 Vocaify Content Script yüklendi!');

// LinkedIn profil bilgilerini çek
function extractProfileData() {
    try {
        console.log('LinkedIn profili taranıyor...');

        // İsim (birden fazla selector dene)
        const nameSelectors = [
            'h1.text-heading-xlarge',
            'h1.inline.t-24.v-align-middle.break-words',
            '.pv-text-details__left-panel h1',
            'h1[class*="text-heading"]'
        ];

        let name = '';
        for (const selector of nameSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                name = element.textContent.trim();
                break;
            }
        }

        // Pozisyon/Unvan (birden fazla selector dene)
        const titleSelectors = [
            'div.text-body-medium.break-words',
            '.pv-text-details__left-panel .text-body-medium',
            'div[class*="text-body-medium"]',
            '.pv-top-card--list li:first-child'
        ];

        let title = '';
        for (const selector of titleSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim() && element.textContent.length < 200) {
                title = element.textContent.trim();
                break;
            }
        }

        // Lokasyon
        const locationSelectors = [
            'span.text-body-small.inline.t-black--light.break-words',
            '.pv-text-details__left-panel .text-body-small',
            'div.mt2 span.text-body-small'
        ];

        let location = '';
        for (const selector of locationSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                const text = element.textContent.trim();
                // "İstanbul, Türkiye" gibi lokasyon formatlarını kontrol et
                if (text.includes(',') || text.match(/[A-ZÇĞİÖŞÜ][a-zçğıöşü]+/)) {
                    location = text;
                    break;
                }
            }
        }

        // LinkedIn profil URL'si
        const profileUrl = window.location.href.split('?')[0];

        // Hakkında/About section
        let about = '';
        const aboutSection = document.querySelector('#about') || document.querySelector('[id*="about"]');
        if (aboutSection) {
            const aboutParent = aboutSection.closest('section');
            if (aboutParent) {
                const aboutText = aboutParent.querySelector('.inline-show-more-text span[aria-hidden="true"]');
                if (aboutText) {
                    about = aboutText.textContent.trim();
                }
            }
        }

        // Deneyim (en son pozisyon)
        let experience = '';
        const experienceSection = document.querySelector('#experience') || document.querySelector('[id*="experience"]');
        if (experienceSection) {
            const experienceParent = experienceSection.closest('section');
            if (experienceParent) {
                const firstExperience = experienceParent.querySelector('li.artdeco-list__item');
                if (firstExperience) {
                    const companyName = firstExperience.querySelector('.t-bold span[aria-hidden="true"]');
                    const duration = firstExperience.querySelector('.t-14.t-normal span[aria-hidden="true"]');
                    if (companyName) {
                        experience = companyName.textContent.trim();
                        if (duration) {
                            experience += ` (${duration.textContent.trim()})`;
                        }
                    }
                }
            }
        }

        // Eğitim
        let education = '';
        const educationSection = document.querySelector('#education') || document.querySelector('[id*="education"]');
        if (educationSection) {
            const educationParent = educationSection.closest('section');
            if (educationParent) {
                const firstEducation = educationParent.querySelector('li.artdeco-list__item');
                if (firstEducation) {
                    const schoolName = firstEducation.querySelector('.t-bold span[aria-hidden="true"]');
                    if (schoolName) {
                        education = schoolName.textContent.trim();
                    }
                }
            }
        }

        // Yetenekler (Skills)
        const skills = [];
        const skillsSection = document.querySelector('#skills') || document.querySelector('[id*="skills"]');
        if (skillsSection) {
            const skillsParent = skillsSection.closest('section');
            if (skillsParent) {
                const skillElements = skillsParent.querySelectorAll('.pvs-list__paged-list-item span[aria-hidden="true"]');
                skillElements.forEach((skillEl, index) => {
                    if (index < 10 && skillEl.textContent.trim()) { // İlk 10 yetenek
                        skills.push(skillEl.textContent.trim());
                    }
                });
            }
        }

        console.log('Çıkarılan veriler:', { name, title, location, profileUrl });

        return {
            name: name || 'İsim bulunamadı',
            title: title || 'Pozisyon belirtilmemiş',
            location: location || '',
            profileUrl: profileUrl,
            about: about || '',
            experience: experience || '',
            education: education || '',
            skills: skills,
            source: 'LinkedIn (Chrome Extension)',
            addedDate: new Date().toISOString()
        };
    } catch (error) {
        console.error('Profil çıkarma hatası:', error);
        return {
            error: 'Profil bilgileri çıkarılamadı',
            details: error.message
        };
    }
}

// Popup'tan gelen mesajları dinle
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Mesaj alındı:', request);

    if (request.action === 'getProfileData') {
        const profileData = extractProfileData();

        if (profileData.error) {
            sendResponse({
                success: false,
                error: profileData.error
            });
        } else {
            sendResponse({
                success: true,
                data: profileData
            });
        }
    }

    return true; // Asenkron response için
});

// Sayfa yüklendiğinde profil verilerini hazırla
window.addEventListener('load', () => {
    console.log('LinkedIn sayfa yüklendi, profil hazırlanıyor...');

    // 2 saniye bekle (LinkedIn dinamik olarak yüklenir)
    setTimeout(() => {
        const data = extractProfileData();
        console.log('Profil verileri hazır:', data);
    }, 2000);
});

console.log('Vocaify Content Script aktif!');
