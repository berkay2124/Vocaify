// === SEARCH TAB ===

import { renderCandidateCard } from './candidates.js';

export function renderSearchTab(state) {
    const searchResults = state.candidates.filter(c => c.matchScore > 0);

    return `
        <div class="space-y-6" style="animation: fadeIn 0.5s ease-out;">
            <h2 class="text-3xl font-bold text-white">AI ile Akıllı Arama (Lokal Simülasyon)</h2>
            <div class="glass p-6 rounded-2xl">
                <div class="flex gap-3 mb-6">
                    <div class="flex-1 relative">
                        <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"></i>
                        <input
                            type="text"
                            id="search-input"
                            value="${state.searchQuery}"
                            oninput="window.updateSearchQuery(this.value)"
                            onkeypress="if(event.key === 'Enter') window.handleSmartSearch()"
                            placeholder="Örn: Python ve React bilen, 5+ yıl deneyimli..."
                            class="w-full pl-12 pr-6 py-4 bg-slate-700/50 border-2 border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                        />
                    </div>
                    <button
                        onclick="window.handleSmartSearch()"
                        ${!state.searchQuery.trim() ? 'disabled' : ''}
                        class="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                    >
                        <i data-lucide="zap" class="w-5 h-5"></i>
                        AI Ara
                    </button>
                </div>

                ${searchResults.length > 0 ? `
                    <div class="space-y-4">
                        <p class="text-gray-300 text-sm mb-4">${searchResults.length} aday bulundu</p>
                        ${searchResults.map(c => renderCandidateCard(c)).join('')}
                    </div>
                ` : `
                    <div class="text-center py-12">
                        <i data-lucide="search" class="w-16 h-16 text-gray-500 mx-auto mb-4"></i>
                        <p class="text-gray-400">Kriterlerinizi yazın</p>
                        <p class="text-gray-500 text-sm mt-2">AI, en uygun adayları bulacak</p>
                    </div>
                `}
            </div>
        </div>
    `;
}
