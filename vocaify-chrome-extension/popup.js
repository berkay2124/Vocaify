/**
 * Vocaify Chrome Extension - Popup Script
 * AŞAMA 29: LinkedIn'den tek tıkla aday ekleme
 */

// DOM elementleri
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const notLinkedIn = document.getElementById('notLinkedIn');
const candidateCard = document.getElementById('candidateCard');
const actionButtons = document.getElementById('actionButtons');
const candidateName = document.getElementById('candidateName');
const candidateTitle = document.getElementById('candidateTitle');
const candidateInfo = document.getElementById('candidateInfo');
const addToVocaifyBtn = document.getElementById('addToVocaify');
const refreshDataBtn = document.getElementById('refreshData');

let currentCandidate = null;

// Hata göster
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    successMessage.classList.add('hidden');
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);
}

// Başarı göster
function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 5000);
}

// Durumu güncelle
function updateStatus(text, isOnline = true) {
    statusText.textContent = text;
    if (isOnline) {
        statusDot.classList.remove('offline');
    } else {
        statusDot.classList.add('offline');
    }
}

// LinkedIn'de mi kontrol et
async function checkLinkedInPage() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab.url || !tab.url.includes('linkedin.com')) {
            updateStatus('LinkedIn\'de değilsiniz', false);
            notLinkedIn.classList.remove('hidden');
            candidateCard.classList.add('hidden');
            actionButtons.classList.add('hidden');
            return false;
        }

        if (!tab.url.includes('/in/')) {
            updateStatus('LinkedIn profil sayfasında değilsiniz', false);
            notLinkedIn.classList.remove('hidden');
            candidateCard.classList.add('hidden');
            actionButtons.classList.add('hidden');
            return false;
        }

        return true;
    } catch (error) {
        console.error('LinkedIn kontrol hatası:', error);
        showError('Sayfa bilgisi alınamadı');
        return false;
    }
}

// LinkedIn'den profil bilgilerini al
async function fetchLinkedInProfile() {
    try {
        updateStatus('Profil bilgileri alınıyor...');

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Content script'e mesaj gönder
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'getProfileData' });

        if (response && response.success) {
            currentCandidate = response.data;
            displayCandidate(currentCandidate);
            updateStatus('Profil hazır!');
            return true;
        } else {
            showError(response?.error || 'Profil bilgileri alınamadı');
            updateStatus('Profil alınamadı', false);
            return false;
        }
    } catch (error) {
        console.error('Profil alma hatası:', error);
        showError('Content script hatası. Sayfayı yenileyin.');
        updateStatus('Hata oluştu', false);
        return false;
    }
}

// Adayı göster
function displayCandidate(candidate) {
    candidateName.textContent = candidate.name || 'İsim bulunamadı';
    candidateTitle.textContent = candidate.title || 'Pozisyon belirtilmemiş';
    candidateInfo.textContent = candidate.location ? `📍 ${candidate.location}` : '';

    candidateCard.classList.remove('hidden');
    actionButtons.classList.remove('hidden');
    notLinkedIn.classList.add('hidden');
}

// Vocaify'a aday ekle
async function addCandidateToVocaify() {
    if (!currentCandidate) {
        showError('Önce profil bilgilerini yükleyin');
        return;
    }

    try {
        addToVocaifyBtn.disabled = true;
        addToVocaifyBtn.innerHTML = '<div class="loading"></div><span>Ekleniyor...</span>';

        // Background script'e mesaj gönder (Firebase ve AI işlemleri için)
        const response = await chrome.runtime.sendMessage({
            action: 'addToVocaify',
            candidate: currentCandidate
        });

        if (response && response.success) {
            showSuccess(`✅ ${currentCandidate.name} Vocaify'a eklendi!`);
            addToVocaifyBtn.innerHTML = '<span>✓</span><span>Başarıyla Eklendi</span>';

            // 2 saniye sonra butonu sıfırla
            setTimeout(() => {
                addToVocaifyBtn.innerHTML = '<span>➕</span><span>Vocaify\'a Ekle</span>';
                addToVocaifyBtn.disabled = false;
            }, 2000);
        } else {
            showError(response?.error || 'Aday eklenirken hata oluştu');
            addToVocaifyBtn.innerHTML = '<span>➕</span><span>Vocaify\'a Ekle</span>';
            addToVocaifyBtn.disabled = false;
        }
    } catch (error) {
        console.error('Vocaify\'a ekleme hatası:', error);
        showError('Ekleme işlemi başarısız');
        addToVocaifyBtn.innerHTML = '<span>➕</span><span>Vocaify\'a Ekle</span>';
        addToVocaifyBtn.disabled = false;
    }
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Vocaify Extension popup açıldı');

    const isLinkedIn = await checkLinkedInPage();
    if (isLinkedIn) {
        await fetchLinkedInProfile();
    }
});

// Buton event listeners
addToVocaifyBtn.addEventListener('click', addCandidateToVocaify);
refreshDataBtn.addEventListener('click', async () => {
    const isLinkedIn = await checkLinkedInPage();
    if (isLinkedIn) {
        await fetchLinkedInProfile();
    }
});
