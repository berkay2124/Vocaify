// === LOADER COMPONENT ===

/**
 * Yükleme (loading) spinner'ını render eder
 * loading false ise boş string döner
 *
 * @param {boolean} loading - Yüklenme durumu
 * @returns {string} Loader HTML string'i veya boş string
 */
export function renderLoader(loading) {
    if (!loading) return '';

    return `
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center modal-fade">
            <div class="glass p-8 rounded-2xl">
                <div class="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p class="text-white text-center font-medium">İşleniyor...</p>
            </div>
        </div>
    `;
}
