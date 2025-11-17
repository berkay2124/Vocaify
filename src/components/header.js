// === HEADER COMPONENT ===

export function renderHeader(state, handleCVUpload, clearAllData) {
    return `
        <header class="glass border-b border-purple-500/20 sticky top-0 z-40">
            <div class="max-w-7xl mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <i data-lucide="brain" class="w-6 h-6 text-white"></i>
                        </div>
                        <div>
                            <h1 class="text-2xl font-bold text-white">Vocaify ATS</h1>
                            <p class="text-sm text-purple-300">AI-Powered HR Management System</p>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <button
                            onclick="window.clearAllData()"
                            class="px-3 py-3 bg-red-500/20 text-red-300 rounded-xl hover:shadow-lg hover:shadow-red-500/50 hover:scale-105 transition-all"
                            title="Tüm Verileri Temizle"
                        >
                            <i data-lucide="archive" class="w-5 h-5"></i>
                        </button>
                        <label class="cursor-pointer">
                            <input type="file" multiple accept=".pdf,.docx,.txt" onchange="window.handleCVUpload(event)" class="hidden"/>
                            <div class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all flex items-center gap-2 font-medium">
                                <i data-lucide="upload" class="w-5 h-5"></i>
                                CV Yükle
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </header>
    `;
}
