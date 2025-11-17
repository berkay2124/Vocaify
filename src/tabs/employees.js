// === EMPLOYEES TAB ===

import { STATUS_CONFIG, EMPLOYEE_STAGES } from '../config.js';
import { formatDate } from '../utils.js';

/**
 * Personeller sekmesini render eder
 * Aktif ve eski personelleri listeler
 *
 * @param {Object} state - Global uygulama state objesi
 * @returns {string} Personeller tab HTML string'i
 */
export function renderEmployeesTab(state) {
    const filtered = state.employees
        .filter(e => state.filterStatus === 'all' || e.status === state.filterStatus)
        .sort((a, b) => (a.status === 'eski-personel' ? 1 : -1)); // Eski personeller sonda

    return `
        <div class="space-y-6" style="animation: fadeIn 0.5s ease-out;">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 class="text-3xl font-bold text-white">Personel Yönetimi (${filtered.length})</h2>
                <div class="flex gap-3 flex-wrap">
                    <select onchange="window.setFilterStatus(this.value)" class="px-4 py-2 bg-slate-700 text-white rounded-lg border border-purple-500/30 focus:outline-none focus:border-purple-500">
                        <option value="all">Tüm Personeller</option>
                        ${EMPLOYEE_STAGES.map(key => `<option value="${key}" ${state.filterStatus === key ? 'selected' : ''}>${STATUS_CONFIG[key].label}</option>`).join('')}
                    </select>
                </div>
            </div>

            ${filtered.length === 0 ? `
                <div class="glass p-12 rounded-2xl text-center">
                    <i data-lucide="award" class="w-16 h-16 text-gray-500 mx-auto mb-4"></i>
                    <p class="text-gray-400 text-lg">Henüz personel bulunmuyor</p>
                </div>
            ` : `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${filtered.map(employee => renderEmployeeCard(employee)).join('')}
                </div>
            `}
        </div>
    `;
}

/**
 * Tek bir personel kartını render eder
 * Personel bilgileri, performans ve aksiyon butonlarını içerir
 *
 * @param {Object} employee - Personel objesi
 * @returns {string} Personel kartı HTML string'i
 */
function renderEmployeeCard(employee) {
    const config = STATUS_CONFIG[employee.status] || {};

    return `
        <div class="glass p-6 rounded-2xl transition-all ${config.color === 'bg-gray-500' ? 'border-gray-500/20 opacity-70' : 'border-purple-500/20 hover:border-emerald-500/40'}">
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-4 overflow-hidden">
                    <div class="w-16 h-16 ${config.color === 'bg-gray-500' ? 'bg-gray-600' : 'bg-gradient-to-br from-emerald-500 to-green-500'} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                        ${employee.name.charAt(0)}
                    </div>
                    <div class="overflow-hidden">
                        <h3 class="text-2xl font-bold text-white mb-1 truncate">${employee.name}</h3>
                        <p class="text-gray-400 text-sm mb-1">${employee.employeeId}</p>
                        <p class="text-emerald-300 font-medium truncate">${employee.analysis.position}</p>
                    </div>
                </div>
                <span class="px-4 py-2 ${config.color} text-white rounded-full text-sm font-medium">
                    ${config.label}
                </span>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-4 p-4 bg-slate-800/50 rounded-xl">
                <div>
                    <p class="text-gray-400 text-xs mb-1">İşe Başlama</p>
                    <p class="text-white font-medium text-sm">${formatDate(employee.startDate)}</p>
                </div>
                <div>
                    <p class="text-gray-400 text-xs mb-1">Çalışma Süresi</p>
                    <p class="text-white font-medium text-sm">
                        ${Math.floor((new Date() - new Date(employee.startDate)) / (1000 * 60 * 60 * 24 * 30))} ay
                    </p>
                </div>
            </div>
            <div class="flex gap-2 flex-wrap">
                <button onclick='window.openModal("view", ${JSON.stringify(employee).replace(/'/g, "&apos;").replace(/"/g, "&quot;")})' class="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all flex items-center gap-2 border border-blue-500/30 text-sm">
                    <i data-lucide="eye" class="w-4 h-4"></i> Detay
                </button>
                ${employee.status === 'personel' ? `
                    <button onclick='window.openModal("performance", ${JSON.stringify(employee).replace(/'/g, "&apos;").replace(/"/g, "&quot;")})' class="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all flex items-center gap-2 border border-green-500/30 text-sm">
                        <i data-lucide="trending-up" class="w-4 h-4"></i> Performans
                    </button>
                    <button onclick='window.openModal("survey", ${JSON.stringify(employee).replace(/'/g, "&apos;").replace(/"/g, "&quot;")})' class="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all flex items-center gap-2 border border-blue-500/30 text-sm">
                        <i data-lucide="list-checks" class="w-4 h-4"></i> Anket
                    </button>
                    <button onclick="window.moveEmployeeToExit('${employee.id}')" class="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2 border border-red-500/30 text-sm">
                        <i data-lucide="user-x" class="w-4 h-4"></i> Çıkış
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}
