// === MODAL COMPONENT ===

import { STATUS_CONFIG, EMPLOYEE_STAGES } from '../config.js';
import {
    renderModalTab_Detay,
    renderModalTab_Degerlendirme,
    renderModalTab_Teklif,
    renderModalTab_Dokumanlar,
    renderModalTab_Aksiyonlar,
    renderModalTab_Gecmis,
    renderModalTab_Performans
} from './modalTabs.js';

export function renderModal(state) {
    if (!state.showModal || !state.selectedPerson) return '';

    const person = state.selectedPerson;
    const isEmployee = EMPLOYEE_STAGES.includes(person.status);

    // Hangi sekmelerin gösterileceğini belirle
    const modalTabs = [
        { id: 'detay', label: 'Detaylar', icon: 'eye' },
        !isEmployee && { id: 'degerlendirme', label: 'Değerlendirme', icon: 'award' },
        !isEmployee && { id: 'teklif', label: 'Teklif', icon: 'dollar-sign' },
        { id: 'dokumanlar', label: 'Özlük Dosyaları', icon: 'file-stack' },
        { id: 'aksiyonlar', label: 'İK Aksiyonları', icon: 'zap' },
        { id: 'gecmis', label: 'Süreç Geçmişi', icon: 'history' },
        isEmployee && { id: 'performans', label: 'Performans', icon: 'trending-up' }
    ].filter(Boolean); // false olanları (null) kaldır

    return `
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 modal-fade">
            <div class="fixed inset-0" onclick="window.closeModal()"></div>

            <div class="glass max-w-4xl w-full max-h-[90vh] flex flex-col my-6 relative z-10 modal-zoom">
                <!-- Modal Başlığı -->
                <div class="flex-shrink-0 p-6 flex justify-between items-start border-b border-purple-500/20">
                    <div class="flex items-center gap-4">
                        <div class="w-16 h-16 ${isEmployee ? 'bg-gradient-to-br from-emerald-500 to-green-500' : 'gradient-bg'} rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0">
                            ${person.name.charAt(0)}
                        </div>
                        <div>
                            <h3 class="text-2xl font-bold text-white">${person.name}</h3>
                            <p class="text-purple-300">${person.analysis.position}</p>
                            <span class="mt-2 px-3 py-1 ${STATUS_CONFIG[person.status].color} text-white text-xs rounded-full font-medium">
                                ${STATUS_CONFIG[person.status].label}
                            </span>
                        </div>
                    </div>
                    <button onclick="window.closeModal()" class="text-gray-400 hover:text-white transition-all">
                        <i data-lucide="x-circle" class="w-6 h-6"></i>
                    </button>
                </div>

                <!-- Modal Sekme Başlıkları -->
                <div class="flex-shrink-0 flex gap-1 overflow-x-auto border-b border-purple-500/20 px-4">
                    ${modalTabs.map(tab => `
                        <button
                            key="${tab.id}"
                            onclick="window.setModalTab('${tab.id}')"
                            class="px-4 py-3 flex items-center gap-2 transition-all whitespace-nowrap ${state.modalTab === tab.id
                                ? 'text-purple-300 border-b-2 border-purple-500'
                                : 'text-gray-400 hover:text-white'
                            }"
                        >
                            <i data-lucide="${tab.icon}" class="w-4 h-4"></i>
                            ${tab.label}
                        </button>
                    `).join('')}
                </div>

                <!-- Modal Sekme İçeriği -->
                <div class="flex-grow p-6 overflow-y-auto">
                    ${getModalTabContent(state)}
                </div>
            </div>
        </div>
    `;
}

function getModalTabContent(state) {
    switch (state.modalTab) {
        case 'detay':
            return renderModalTab_Detay(state.selectedPerson);
        case 'degerlendirme':
            return renderModalTab_Degerlendirme(state.selectedPerson);
        case 'teklif':
            return renderModalTab_Teklif(state.selectedPerson);
        case 'dokumanlar':
            return renderModalTab_Dokumanlar(state.selectedPerson);
        case 'aksiyonlar':
            return renderModalTab_Aksiyonlar(state.selectedPerson);
        case 'gecmis':
            return renderModalTab_Gecmis(state.selectedPerson);
        case 'performans':
            return renderModalTab_Performans(state.selectedPerson);
        default:
            return '';
    }
}
