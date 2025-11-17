// === DASHBOARD TAB ===

import { STATUS_CONFIG, CANDIDATE_STAGES } from '../config.js';
import { getStats, formatDate } from '../utils.js';

export function renderDashboard(state) {
    const stats = getStats(state.candidates, state.employees);
    const recentCandidates = state.candidates.slice(0, 5);

    return `
        <div class="space-y-6" style="animation: fadeIn 0.5s ease-out;">
            <div class="flex items-center justify-between">
                <h2 class="text-3xl font-bold text-white">Genel Bakış</h2>
                <div class="text-sm text-gray-400">
                    ${new Date().toLocaleString('tr-TR')}
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="glass p-6 rounded-2xl border border-blue-500/30 hover:scale-105 transition-all">
                    <div class="flex items-center justify-between mb-3">
                        <i data-lucide="users" class="w-10 h-10 text-blue-400"></i>
                        <span class="text-4xl font-bold text-white">${stats.totalCandidates}</span>
                    </div>
                    <p class="text-blue-300 font-medium mb-1">Toplam Aday</p>
                </div>
                <div class="glass p-6 rounded-2xl border border-emerald-500/30 hover:scale-105 transition-all">
                    <div class="flex items-center justify-between mb-3">
                        <i data-lucide="award" class="w-10 h-10 text-emerald-400"></i>
                        <span class="text-4xl font-bold text-white">${stats.activeEmployees}</span>
                    </div>
                    <p class="text-emerald-300 font-medium mb-1">Aktif Personel</p>
                </div>
                <div class="glass p-6 rounded-2xl border border-purple-500/30 hover:scale-105 transition-all">
                    <div class="flex items-center justify-between mb-3">
                        <i data-lucide="book-open" class="w-10 h-10 text-purple-400"></i>
                        <span class="text-4xl font-bold text-white">${stats.inTraining}</span>
                    </div>
                    <p class="text-purple-300 font-medium mb-1">Eğitimde</p>
                </div>
                <div class="glass p-6 rounded-2xl border border-orange-500/30 hover:scale-105 transition-all">
                    <div class="flex items-center justify-between mb-3">
                        <i data-lucide="alert-circle" class="w-10 h-10 text-orange-400"></i>
                        <span class="text-4xl font-bold text-white">${stats.onTrial}</span>
                    </div>
                    <p class="text-orange-300 font-medium mb-1">Deneme Sürecinde</p>
                </div>
            </div>

            <div class="glass p-6 rounded-2xl">
                <h3 class="text-xl font-bold text-white mb-6">Aday Süreç Akışı</h3>
                <div class="grid grid-cols-2 md:grid-cols-6 gap-2">
                    ${CANDIDATE_STAGES.map(status => {
                        const config = STATUS_CONFIG[status];
                        const count = state.candidates.filter(c => c.status === status).length;
                        return `
                            <div class="text-center">
                                <div class="${config.color} text-white rounded-lg p-4 mb-2 shadow-lg">
                                    <div class="text-3xl font-bold">${count}</div>
                                </div>
                                <p class="text-gray-300 text-sm font-medium">${config.label}</p>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="glass p-6 rounded-2xl">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-xl font-bold text-white flex items-center gap-2">
                            <i data-lucide="clock" class="w-5 h-5 text-purple-400"></i>
                            Son Eklenen Adaylar
                        </h3>
                        <button onclick="window.setActiveTab('candidates')" class="text-purple-400 hover:text-purple-300 text-sm">
                            Tümünü Gör
                        </button>
                    </div>
                    <div class="space-y-3 max-h-96 overflow-y-auto pr-2">
                        ${recentCandidates.length === 0 ? (
                            `<p class="text-gray-400 text-center p-4">CV Yükle butonuyla aday ekleyin.</p>`
                        ) : (
                            recentCandidates.map(c => renderMiniCard(c)).join('')
                        )}
                    </div>
                </div>

                <div class="glass p-6 rounded-2xl">
                    <h3 class="text-xl font-bold text-white flex items-center gap-2 mb-4">
                        <i data-lucide="target" class="w-5 h-5 text-orange-400"></i>
                        Bekleyen İşlemler
                    </h3>
                    <div class="space-y-3">
                        <div class="p-4 bg-orange-500/10 rounded-xl border border-orange-500/30">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <i data-lucide="clipboard-check" class="w-5 h-5 text-orange-400"></i>
                                    <div>
                                        <p class="text-white font-medium">Değerlendirme Bekleyen</p>
                                        <p class="text-gray-400 text-sm">Aday kararları</p>
                                    </div>
                                </div>
                                <span class="text-2xl font-bold text-orange-400">${stats.pendingEvaluations}</span>
                            </div>
                        </div>
                        <div class="p-4 bg-red-500/10 rounded-xl border border-red-500/30">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <i data-lucide="user-x" class="w-5 h-5 text-red-400"></i>
                                    <div>
                                        <p class="text-white font-medium">Çıkış Sürecinde</p>
                                        <p class="text-gray-400 text-sm">Eski personel</p>
                                    </div>
                                </div>
                                <span class="text-2xl font-bold text-red-400">${stats.exiting}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderMiniCard(candidate) {
    const config = STATUS_CONFIG[candidate.status] || {};

    return `
        <div class="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-all cursor-pointer"
             onclick='window.openModal("view", ${JSON.stringify(candidate).replace(/'/g, "&apos;").replace(/"/g, "&quot;")})'>
            <div class="flex items-center gap-4 overflow-hidden">
                <div class="w-12 h-12 gradient-bg rounded-full flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                    ${candidate.name.charAt(0).toUpperCase()}
                </div>
                <div class="overflow-hidden">
                    <p class="text-white font-semibold truncate">${candidate.name}</p>
                    <p class="text-gray-400 text-sm truncate">${candidate.analysis.position || 'N/A'}</p>
                </div>
            </div>
            <div class="flex items-center gap-3 flex-shrink-0">
                <span class="px-3 py-1 ${config.color} text-white text-xs rounded-full font-medium">
                    ${config.label}
                </span>
            </div>
        </div>
    `;
}
