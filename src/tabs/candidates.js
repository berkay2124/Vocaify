// === CANDIDATES TAB ===

import { STATUS_CONFIG, CANDIDATE_STAGES, PLATFORMS } from '../config.js';
import { formatDate } from '../utils.js';

export function renderCandidatesTab(state) {
    const filtered = state.candidates
        .filter(c => {
            const statusMatch = state.filterStatus === 'all' || c.status === state.filterStatus;
            const platformMatch = state.filterPlatform === 'all' || c.platform === state.filterPlatform;
            return statusMatch && platformMatch;
        })
        .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

    return `
        <div class="space-y-6" style="animation: fadeIn 0.5s ease-out;">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 class="text-3xl font-bold text-white">Aday Yönetimi (${filtered.length})</h2>
                <div class="flex gap-3 flex-wrap">
                    <select onchange="window.setFilterStatus(this.value)" class="px-4 py-2 bg-slate-700 text-white rounded-lg border border-purple-500/30 focus:outline-none focus:border-purple-500">
                        <option value="all">Tüm Aşamalar</option>
                        ${CANDIDATE_STAGES.map(key => `<option value="${key}" ${state.filterStatus === key ? 'selected' : ''}>${STATUS_CONFIG[key].label}</option>`).join('')}
                    </select>
                    <select onchange="window.setFilterPlatform(this.value)" class="px-4 py-2 bg-slate-700 text-white rounded-lg border border-purple-500/30 focus:outline-none focus:border-purple-500">
                        <option value="all">Tüm Platformlar</option>
                        ${[...new Set([...PLATFORMS, ...state.candidates.map(c => c.platform).filter(Boolean)])].map(p => `<option value="${p}" ${state.filterPlatform === p ? 'selected' : ''}>${p}</option>`).join('')}
                    </select>
                </div>
            </div>

            ${filtered.length === 0 ? `
                <div class="glass p-12 rounded-2xl text-center">
                    <i data-lucide="users" class="w-16 h-16 text-gray-500 mx-auto mb-4"></i>
                    <p class="text-gray-400 text-lg">Bu filtrede aday bulunmuyor</p>
                </div>
            ` : `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${filtered.map(c => renderCandidateCard(c)).join('')}
                </div>
            `}
        </div>
    `;
}

export function renderCandidateCard(candidate) {
    const config = STATUS_CONFIG[candidate.status] || {};

    return `
        <div class="glass p-6 rounded-2xl hover:border-purple-500/40 transition-all">
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-4 overflow-hidden">
                    <div class="w-16 h-16 gradient-bg rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                        ${candidate.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="overflow-hidden">
                        <h3 class="text-xl font-bold text-white mb-1 truncate">${candidate.name}</h3>
                        <div class="flex items-center gap-2 text-gray-400 text-sm mb-1 truncate">
                            <i data-lucide="mail" class="w-4 h-4 flex-shrink-0"></i>
                            <span class="truncate">${candidate.email}</span>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                    <span class="px-4 py-2 ${config.color} text-white rounded-full text-sm font-medium">
                        ${config.label}
                    </span>
                    ${candidate.decision ? `
                        <span class="px-3 py-1 text-xs rounded-full ${candidate.decision === 'positive'
                                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }">
                            ${candidate.decision === 'positive' ? '✓ Olumlu' : '✗ Olumsuz'}
                        </span>
                    ` : ''}
                </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-slate-800/50 rounded-xl">
                <div>
                    <p class="text-gray-400 text-xs mb-1">Pozisyon</p>
                    <p class="text-white font-medium text-sm truncate">${candidate.analysis.position || 'N/A'}</p>
                </div>
                <div>
                    <p class="text-gray-400 text-xs mb-1">Deneyim</p>
                    <p class="text-white font-medium text-sm">${candidate.analysis.experience_years || 0} yıl</p>
                </div>
                <div>
                    <p class="text-gray-400 text-xs mb-1">Platform</p>
                    <p class="text-white font-medium text-sm">${candidate.platform}</p>
                </div>
                <div>
                    <p class="text-gray-400 text-xs mb-1">Başvuru</p>
                    <p class="text-white font-medium text-sm">${formatDate(candidate.uploadDate)}</p>
                </div>
            </div>
            <div class="flex gap-2 flex-wrap">
                <button onclick='window.openModal("view", ${JSON.stringify(candidate).replace(/'/g, "&apos;").replace(/"/g, "&quot;")})' class="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all flex items-center gap-2 border border-blue-500/30 text-sm">
                    <i data-lucide="eye" class="w-4 h-4"></i> Detay
                </button>
                <button onclick='window.openModal("evaluate", ${JSON.stringify(candidate).replace(/'/g, "&apos;").replace(/"/g, "&quot;")})' class="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all flex items-center gap-2 border border-green-500/30 text-sm">
                    <i data-lucide="award" class="w-4 h-4"></i> KPI
                </button>
                <button onclick='window.openModal("decision", ${JSON.stringify(candidate).replace(/'/g, "&apos;").replace(/"/g, "&quot;")})' class="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all flex items-center gap-2 border border-purple-500/30 text-sm">
                    <i data-lucide="clipboard-check" class="w-4 h-4"></i> Karar
                </button>
                ${candidate.decision === 'positive' && config.next ? `
                    <button onclick="window.moveToNextStage('${candidate.id}')" class="px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-all flex items-center gap-2 border border-emerald-500/30 text-sm">
                        <i data-lucide="arrow-right" class="w-4 h-4"></i> Sonraki Aşama
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}
