// === NAVIGATION COMPONENT ===

/**
 * Ana navigasyon bar'ını render eder
 * Dashboard, Adaylar, Personeller, AI Arama ve Analizler sekmelerini içerir
 *
 * @param {Object} state - Global uygulama state objesi
 * @param {Function} setActiveTab - Aktif sekmeyi değiştiren fonksiyon
 * @returns {string} Navigation HTML string'i
 */
export function renderNavigation(state, setActiveTab) {
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: 'trending-up' },
        { id: 'candidates', label: `Adaylar (${state.candidates.length})`, icon: 'users' },
        { id: 'employees', label: `Personeller (${state.employees.length})`, icon: 'award' },
        { id: 'search', label: 'AI Arama', icon: 'search' },
        { id: 'analytics', label: 'Analizler', icon: 'bar-chart-3' }
    ];

    return `
        <nav class="glass border-b border-purple-500/10 sticky top-[73px] z-30 rounded-none">
            <div class="max-w-7xl mx-auto px-6">
                <div class="flex gap-1 overflow-x-auto">
                    ${tabs.map(tab => `
                        <button onclick="window.setActiveTab('${tab.id}')"
                            class="px-6 py-4 flex items-center gap-2 transition-all whitespace-nowrap ${state.activeTab === tab.id
                                ? 'bg-purple-500/20 text-purple-300 border-b-2 border-purple-500'
                                : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                            }">
                            <i data-lucide="${tab.icon}" class="w-4 h-4"></i>
                            ${tab.label}
                        </button>
                    `).join('')}
                </div>
            </div>
        </nav>
    `;
}
