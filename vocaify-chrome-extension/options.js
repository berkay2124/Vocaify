/**
 * Vocaify Chrome Extension - Options/Settings Page
 * AŞAMA 29: Kullanıcı ayarlarını yönetir
 */

const firebaseApiKeyInput = document.getElementById('firebaseApiKey');
const firebaseDatabaseURLInput = document.getElementById('firebaseDatabaseURL');
const claudeApiKeyInput = document.getElementById('claudeApiKey');
const saveBtn = document.getElementById('saveBtn');
const successMessage = document.getElementById('successMessage');

// Sayfa yüklendiğinde mevcut ayarları yükle
document.addEventListener('DOMContentLoaded', loadSettings);

// Kaydetilmiş ayarları yükle
function loadSettings() {
    chrome.storage.sync.get(['firebaseConfig', 'claudeApiKey'], (result) => {
        if (result.firebaseConfig) {
            firebaseApiKeyInput.value = result.firebaseConfig.apiKey || '';
            firebaseDatabaseURLInput.value = result.firebaseConfig.databaseURL || '';
        }

        if (result.claudeApiKey) {
            claudeApiKeyInput.value = result.claudeApiKey || '';
        }

        console.log('Ayarlar yüklendi');
    });
}

// Ayarları kaydet
saveBtn.addEventListener('click', () => {
    const firebaseConfig = {
        apiKey: firebaseApiKeyInput.value.trim(),
        databaseURL: firebaseDatabaseURLInput.value.trim()
    };

    const claudeApiKey = claudeApiKeyInput.value.trim();

    // Chrome Storage'a kaydet
    chrome.storage.sync.set({
        firebaseConfig: firebaseConfig,
        claudeApiKey: claudeApiKey
    }, () => {
        console.log('Ayarlar kaydedildi:', {
            firebase: !!firebaseConfig.apiKey,
            claude: !!claudeApiKey
        });

        // Başarı mesajı göster
        successMessage.style.display = 'block';

        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    });
});

// Enter tuşu ile kaydet
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        saveBtn.click();
    }
});
