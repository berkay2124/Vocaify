// === ANALYTICS TAB ===

import { STATUS_CONFIG, PLATFORMS } from '../config.js';
import { getStats, getAnalytics } from '../utils.js';

export function renderAnalyticsTab(state) {
    const stats = getStats(state.candidates, state.employees);
    const analytics = getAnalytics(state.candidates, state.employees);

    return `
        <div class="space-y-6" style="animation: fadeIn 0.5s ease-out;">
            <h2 class="text-3xl font-bold text-white mb-6">Analizler ve Raporlar</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="glass p-6 rounded-2xl border border-green-500/30">
                    <div class="flex items-center justify-between mb-3">
                        <i data-lucide="badge-check" class="w-8 h-8 text-green-400"></i>
                        <span class="text-3xl font-bold text-white">${analytics.offersAccepted} / ${analytics.offersSent}</span>
                    </div>
                    <p class="text-green-300 font-medium mb-1">Teklif Kabul Oranı</p>
                </div>
                <div class="glass p-6 rounded-2xl border border-red-500/30">
                    <div class="flex items-center justify-between mb-3">
                        <i data-lucide="user-x" class="w-8 h-8 text-red-400"></i>
                        <span class="text-3xl font-bold text-white">${analytics.turnoverRate.toFixed(1)}%</span>
                    </div>
                    <p class="text-red-300 font-medium mb-1">Personel Devir Hızı</p>
                </div>
                <div class="glass p-6 rounded-2xl border border-blue-500/30">
                    <div class="flex items-center justify-between mb-3">
                        <i data-lucide="hard-drive" class="w-8 h-8 text-blue-400"></i>
                        <span class="text-3xl font-bold text-white">${state.candidates.length + state.employees.length}</span>
                    </div>
                    <p class="text-blue-300 font-medium mb-1">Toplam Havuz</p>
                </div>
                <div class="glass p-6 rounded-2xl border border-yellow-500/30">
                    <div class="flex items-center justify-between mb-3">
                        <i data-lucide="user-round-cog" class="w-8 h-8 text-yellow-400"></i>
                        <span class="text-3xl font-bold text-white">${stats.activeEmployees}</span>
                    </div>
                    <p class="text-yellow-300 font-medium mb-1">Aktif İş Gücü</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="glass p-6 rounded-2xl">
                    <h3 class="text-xl font-bold text-white mb-4">Yaşam Döngüsü Dağılımı</h3>
                    <div class="space-y-3">
                        ${Object.entries(STATUS_CONFIG).map(([status, config]) => {
                            const count = [...state.candidates, ...state.employees].filter(p => p.status === status).length;
                            const total = state.candidates.length + state.employees.length;
                            const percentage = total > 0 ? (count / total * 100) : 0;
                            if (count === 0) return '';
                            return `
                                <div>
                                    <div class="flex justify-between text-sm mb-1">
                                        <span class="text-gray-300">${config.label}</span>
                                        <span class="text-white font-medium">${count} (${percentage.toFixed(1)}%)</span>
                                    </div>
                                    <div class="w-full bg-slate-700 rounded-full h-2">
                                        <div class="${config.color} h-2 rounded-full" style="width: ${percentage}%"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                <div class="glass p-6 rounded-2xl">
                    <h3 class="text-xl font-bold text-white mb-4">Aday Kaynak Platformu</h3>
                    <div class="space-y-3">
                        ${[...new Set([...PLATFORMS, ...state.candidates.map(c => c.platform).filter(Boolean)])].map(platform => {
                            const count = state.candidates.filter(c => c.platform === platform).length;
                            if (count === 0) return '';
                            const percentage = state.candidates.length > 0 ? (count / state.candidates.length * 100) : 0;
                            return `
                                <div>
                                    <div class="flex justify-between text-sm mb-1">
                                        <span class="text-gray-300">${platform}</span>
                                        <span class="text-white font-medium">${count} (${percentage.toFixed(1)}%)</span>
                                    </div>
                                    <div class="w-full bg-slate-700 rounded-full h-2">
                                        <div class="gradient-bg h-2 rounded-full" style="width: ${percentage}%"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}
