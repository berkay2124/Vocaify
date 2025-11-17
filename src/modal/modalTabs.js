// === MODAL TAB CONTENTS ===

import { KPI_CATEGORIES, HR_NOTE_CATEGORIES, DOC_TYPES, EMPLOYEE_STAGES } from '../config.js';
import { formatDate, formatDateTime } from '../utils.js';

// DETAY SEKMESİ
export function renderModalTab_Detay(person) {
    return `
        <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-4 bg-slate-700/50 rounded-xl">
                    <p class="text-gray-400 text-sm mb-2 flex items-center gap-2"><i data-lucide="mail" class="w-4 h-4"></i> Email</p>
                    <p class="text-white font-medium truncate">${person.email || 'N/A'}</p>
                </div>
                <div class="p-4 bg-slate-700/50 rounded-xl">
                    <p class="text-gray-400 text-sm mb-2 flex items-center gap-2"><i data-lucide="phone" class="w-4 h-4"></i> Telefon</p>
                    <p class="text-white font-medium truncate">${person.phone || 'N/A'}</p>
                </div>
                <div class="p-4 bg-slate-700/50 rounded-xl">
                    <p class="text-gray-400 text-sm mb-2 flex items-center gap-2"><i data-lucide="briefcase" class="w-4 h-4"></i> Deneyim</p>
                    <p class="text-white font-medium">${person.analysis.experience_years || 0} yıl</p>
                </div>
            </div>

            <div class="p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                <p class="text-blue-300 text-sm font-medium mb-2">AI Profil Özeti</p>
                <p class="text-white leading-relaxed">${person.analysis.summary}</p>
            </div>

            ${person.analysis.aiRecommendation ? `
            <div class="p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
                <p class="text-purple-300 text-sm font-medium mb-2">AI Analizi ve Öneri</p>
                <p class="text-white leading-relaxed">${person.analysis.aiRecommendation}</p>
            </div>
            ` : ''}

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="interviewNotes" class="text-gray-400 text-sm mb-3 font-medium block">Mülakat Notları</label>
                    <textarea
                        id="interviewNotes"
                        placeholder="Mülakat notlarını buraya yazın..."
                        class="w-full h-40 px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white min-h-[120px] focus:outline-none focus:border-purple-500"
                    >${person.interviewNotes || ''}</textarea>
                </div>
                <div>
                    <label for="hrGeneralNotes" class="text-gray-400 text-sm mb-3 font-medium block">HR Gözlem Notları</label>
                    <textarea
                        id="hrGeneralNotes"
                        placeholder="Genel gözlemlerinizi buraya yazın..."
                        class="w-full h-40 px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white min-h-[120px] focus:outline-none focus:border-purple-500"
                    >${person.hrNotes?.find(n => n.category === 'Genel Gözlem')?.note || ''}</textarea>
                </div>
            </div>
            <button
                id="saveNotes"
                onclick="window.saveNotesFromModal('${person.id}')"
                class="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
            >
                <i data-lucide="save" class="w-4 h-4"></i> Notları Kaydet
            </button>
        </div>
    `;
}

// DEĞERLENDİRME SEKMESİ
export function renderModalTab_Degerlendirme(person) {
    const totalScore = person.totalKpiScore || 0;

    return `
        <form onsubmit="window.handleModalFormSubmit(event)" data-modal-type="evaluate" class="space-y-6">
            <div class="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 p-6 rounded-xl text-center">
                <p class="text-gray-300 text-sm mb-2">Toplam KPI Skoru (100 Üzerinden)</p>
                <p class="text-5xl font-bold text-white">${totalScore}</p>
                <div class="mt-3 w-full bg-slate-700 rounded-full h-3">
                    <div class="gradient-bg h-3 rounded-full transition-all" style="width: ${totalScore}%"></div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${KPI_CATEGORIES.map((kpi, index) => {
                    const score = person.kpiScores?.[kpi] || 0;
                    return `
                        <div class="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                            <div class="flex justify-between items-center mb-3">
                                <label for="${kpi}" class="text-white font-medium">${kpi}</label>
                                <span class="text-purple-400 font-bold text-lg" id="kpi-val-${index}">${score}/10</span>
                            </div>
                            <input
                                id="${kpi}" name="${kpi}" type="range" min="0" max="10"
                                value="${score}"
                                class="kpi-slider w-full"
                                oninput="document.getElementById('kpi-val-${index}').innerText = this.value + '/10'"
                            />
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="pt-6 border-t border-slate-700">
                <button type="submit" class="w-full px-6 py-3 gradient-bg text-white rounded-lg hover:shadow-xl transition-all font-medium flex items-center justify-center gap-2">
                    <i data-lucide="save" class="w-4 h-4"></i> KPI Puanlarını Kaydet
                </button>
            </div>
        </form>
    `;
}

// TEKLİF SEKMESİ
export function renderModalTab_Teklif(person) {
    return `
        <form onsubmit="window.handleModalFormSubmit(event)" data-modal-type="offer" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="position" class="text-gray-300 font-medium mb-2 block">Pozisyon</label>
                    <input id="position" name="position" type="text" value="${person.offerDetails?.position || person.analysis.position}" class="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white" />
                </div>
                <div>
                    <label for="salary" class="text-gray-300 font-medium mb-2 block">Maaş (Aylık Net)</label>
                    <input id="salary" name="salary" type="number" placeholder="50000" value="${person.offerDetails?.salary || ''}" class="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white" />
                </div>
            </div>
            <div>
                <label for="startDate" class="text-gray-300 font-medium mb-2 block">Planlanan Başlangıç Tarihi</label>
                <input id="startDate" name="startDate" type="date" value="${person.offerDetails?.startDate || ''}" class="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white" />
            </div>
            <div>
                <label for="benefits" class="text-gray-300 font-medium mb-2 block">Yan Haklar</label>
                <textarea id="benefits" name="benefits" placeholder="Örn: Yemek Kartı, Özel Sağlık Sigortası..." class="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white min-h-[100px]">${person.offerDetails?.benefits || ''}</textarea>
            </div>
            <button type="submit" class="w-full px-6 py-3 gradient-bg text-white rounded-xl hover:shadow-lg font-medium flex items-center justify-center gap-2">
                <i data-lucide="send" class="w-4 h-4"></i> ${person.offerDetails?.offerSent ? 'Teklifi Güncelle' : 'Teklifi Gönder/Kaydet'}
            </button>

            ${person.offerDetails?.offerSent ? `
                <div class="flex gap-4">
                    <button
                        type="button"
                        onclick="window.updateOfferStatus(true)"
                        class="w-full p-3 rounded-xl border transition-all ${person.offerDetails.offerAccepted === true ? 'bg-green-500 text-white scale-105' : 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30'}"
                    >
                        ✓ Kabul Etti
                    </button>
                    <button
                        type="button"
                        onclick="window.updateOfferStatus(false)"
                        class="w-full p-3 rounded-xl border transition-all ${person.offerDetails.offerAccepted === false ? 'bg-red-500 text-white scale-105' : 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30'}"
                    >
                        ✗ Reddetti
                    </button>
                </div>
            ` : ''}
        </form>
    `;
}

// DÖKÜMANLAR SEKMESİ
export function renderModalTab_Dokumanlar(person) {
    return `
        <div class="space-y-6">
            <div>
                <h4 class="text-white text-lg font-medium mb-3">Yeni Özlük Dosyası Yükle</h4>
                <form onsubmit="window.handleDocumentUpload(event)" class="p-4 bg-slate-700/30 rounded-xl space-y-3">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label for="file" class="text-gray-300 text-sm mb-1 block">Dosya</label>
                            <input id="file" name="file" type="file" class="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30" required />
                        </div>
                        <div>
                            <label for="type" class="text-gray-300 text-sm mb-1 block">Dosya Türü</label>
                            <select id="type" name="type" class="w-full px-4 py-2.5 bg-slate-700 border border-purple-500/30 rounded-lg text-white" required>
                                ${DOC_TYPES.map(type => `<option value="${type}">${type}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <button type="submit" class="w-full px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg font-medium flex items-center justify-center gap-2">
                        <i data-lucide="file-up" class="w-4 h-4"></i> Dosyayı Ekle
                    </button>
                </form>
            </div>

            <div>
                <h4 class="text-white text-lg font-medium mb-3">Mevcut Dosyalar (${person.documents.length})</h4>
                <div class="space-y-2 max-h-64 overflow-y-auto pr-2">
                    ${person.documents.length > 0 ? person.documents.map(doc => `
                        <div class="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                            <div class="flex items-center gap-3">
                                <i data-lucide="file-text" class="w-5 h-5 text-purple-400"></i>
                                <div>
                                    <p class="text-white text-sm font-medium">${doc.name}</p>
                                    <p class="text-gray-400 text-xs">${doc.type}</p>
                                </div>
                            </div>
                            <span class="text-gray-400 text-xs">${formatDate(doc.uploadDate)}</span>
                        </div>
                    `).join('') : `
                        <p class="text-gray-400 text-center p-4">Yüklenmiş dosya bulunmuyor.</p>
                    `}
                </div>
            </div>
        </div>
    `;
}

// AKSİYONLAR SEKMESİ
export function renderModalTab_Aksiyonlar(person) {
    return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form onsubmit="window.handleModalFormSubmit(event)" data-modal-type="hrnote" class="space-y-4 p-4 glass-light rounded-xl">
                <h4 class="text-lg font-semibold text-white">HR Notu Ekle</h4>
                <textarea name="note" placeholder="Gözlemler..." class="w-full h-24 px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white" required></textarea>
                <input name="author" type="text" value="İK Ekibi" class="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white" required />
                <select name="category" class="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white">
                    ${HR_NOTE_CATEGORIES.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                </select>
                <button type="submit" class="w-full px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:shadow-lg font-medium flex items-center justify-center gap-2">
                    <i data-lucide="message-square" class="w-4 h-4"></i> Not Ekle
                </button>
            </form>

            <form onsubmit="window.handleModalFormSubmit(event)" data-modal-type="training" class="space-y-4 p-4 glass-light rounded-xl">
                <h4 class="text-lg font-semibold text-white">Eğitim Ata</h4>
                <input name="title" type="text" placeholder="Eğitim Başlığı" class="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white" required />
                <textarea name="description" placeholder="Detay veya link..." class="w-full h-24 px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white"></textarea>
                <button type="submit" class="w-full mt-[52px] px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg font-medium flex items-center justify-center gap-2">
                    <i data-lucide="book-open" class="w-4 h-4"></i> Eğitimi Ata
                </button>
            </form>

            <form onsubmit="window.handleModalFormSubmit(event)" data-modal-type="survey" class="space-y-4 p-4 glass-light rounded-xl">
                <h4 class="text-lg font-semibold text-white">Anket Gönder</h4>
                <input name="title" type="text" placeholder="Anket Başlığı" class="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white" required />
                <input name="link" type="url" placeholder="https://google.forms/..." class="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white" required />
                <button type="submit" class="w-full mt-[52px] px-6 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl hover:shadow-lg font-medium flex items-center justify-center gap-2">
                    <i data-lucide="list-checks" class="w-4 h-4"></i> Anket Ata
                </button>
            </form>
        </div>
    `;
}

// GEÇMİŞ SEKMESİ
export function renderModalTab_Gecmis(person) {
    return `
        <div class="space-y-4 max-h-96 overflow-y-auto pr-2">
            <h4 class="text-lg font-semibold text-white">Süreç Geçmişi</h4>
            ${[...(person.statusHistory || [])].reverse().map(entry => {
                const STATUS_CONFIG_LOCAL = {
                    'aday': { label: 'Aday', color: 'bg-blue-500' },
                    'egitim': { label: 'Eğitim', color: 'bg-purple-500' },
                    'oryantasyon': { label: 'Oryantasyon', color: 'bg-yellow-500' },
                    'deneme': { label: 'Deneme Süreci', color: 'bg-orange-500' },
                    'iki-aylik': { label: '2 Aylık Personel', color: 'bg-teal-500' },
                    'personel': { label: 'Personel', color: 'bg-green-500' },
                    'eski-personel': { label: 'Eski Personel', color: 'bg-gray-500' }
                };
                return `
                    <div class="flex items-start gap-4">
                        <div class="mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${STATUS_CONFIG_LOCAL[entry.status]?.color || 'bg-gray-500'}">
                            <i data-lucide="check" class="w-5 h-5 text-white"></i>
                        </div>
                        <div>
                            <p class="text-white font-medium">${STATUS_CONFIG_LOCAL[entry.status]?.label || entry.status}</p>
                            <p class="text-gray-400 text-sm">${entry.note}</p>
                            <p class="text-gray-500 text-xs">${formatDateTime(entry.date)}</p>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// PERFORMANS SEKMESİ
export function renderModalTab_Performans(person) {
    return `
        <div class="space-y-6">
            <form onsubmit="window.handleModalFormSubmit(event)" data-modal-type="performance" class="space-y-4 p-4 glass-light rounded-xl">
                <h4 class="text-lg font-semibold text-white">Yeni Performans Değerlendirmesi</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input name="period" type="text" placeholder="Dönem (örn: 2025 Q4)" class="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white" required />
                    <input name="manager" type="text" placeholder="Değerlendiren Yönetici" class="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white" required />
                    <input name="score" type="number" min="1" max="10" step="0.1" placeholder="Puan (1-10)" class="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white" required />
                </div>
                <textarea name="strengths" placeholder="Güçlü yönler..." class="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white min-h-[100px]"></textarea>
                <textarea name="weaknesses" placeholder="Gelişim alanları..." class="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white min-h-[100px]"></textarea>
                <button type="submit" class="w-full px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg font-medium flex items-center justify-center gap-2">
                    <i data-lucide="save" class="w-4 h-4"></i> Değerlendirmeyi Kaydet
                </button>
            </form>

            <div class="space-y-3 max-h-64 overflow-y-auto pr-2">
                <h4 class="text-lg font-semibold text-white">Geçmiş Değerlendirmeler</h4>
                ${person.performanceReviews?.length > 0 ? person.performanceReviews.map(review => `
                    <div class="p-4 bg-slate-700/50 rounded-xl border-l-4 border-green-500">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <p class="text-white font-bold">${review.period} - (Puan: ${review.score}/10)</p>
                                <p class="text-gray-400 text-sm">Değerlendiren: ${review.manager}</p>
                            </div>
                            <span class="text-gray-400 text-xs">${formatDate(review.date)}</span>
                        </div>
                        <p class="text-green-300 text-sm mt-1"><strong>Güçlü:</strong> ${review.strengths}</p>
                        <p class="text-orange-300 text-sm mt-1"><strong>Gelişim:</strong> ${review.weaknesses}</p>
                    </div>
                `).join('') : `
                    <p class="text-gray-500 text-center p-4">Geçmiş değerlendirme bulunmuyor.</p>
                `}
            </div>
        </div>
    `;
}
