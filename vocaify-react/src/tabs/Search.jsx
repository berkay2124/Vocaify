import React, { useState } from 'react';
import { Search as SearchIcon, Sparkles, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STATUS_CONFIG } from '../config/constants';

/**
 * AI Arama sekmesini render eder
 * Arama çubuğu ve sonuç listesini gösterir
 */
function Search() {
    const { candidates, setCandidates, setLoading, openModal } = useApp();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSmartSearch = () => {
        if (!searchQuery.trim()) return;

        setLoading(true);

        setTimeout(() => {
            const query = searchQuery.toLowerCase();
            const results = candidates.map(c => {
                let score = 0;
                const reason = [];
                if (c.name.toLowerCase().includes(query)) score += 30;
                if (c.analysis.position.toLowerCase().includes(query)) score += 20;
                if (c.analysis.skills.some(s => query.includes(s.toLowerCase()))) {
                    score += 40;
                    reason.push('Beceri eşleşmesi');
                }
                if (c.analysis.summary.toLowerCase().includes(query)) score += 10;

                return {
                    ...c,
                    matchScore: Math.min(95, score),
                    matchReason: reason.join(', ') || 'Genel anahtar kelime eşleşmesi'
                };
            })
                .filter(c => c.matchScore > 20)
                .sort((a, b) => b.matchScore - a.matchScore);

            const resultIds = new Set(results.map(r => r.id));
            const rest = candidates.filter(c => !resultIds.has(c.id));

            setCandidates([...results, ...rest]);
            setLoading(false);
        }, 1000);
    };

    const searchResults = candidates.filter(c => c.matchScore && c.matchScore > 20);

    return (
        <div className="space-y-6" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <h2 className="text-3xl font-bold text-white mb-6">AI Akıllı Arama</h2>

            {/* Arama Çubuğu */}
            <div className="glass p-6 rounded-2xl">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSmartSearch()}
                        placeholder="Örn: React Developer, Python, 5 yıl deneyim..."
                        className="flex-1 px-6 py-4 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    />
                    <button
                        onClick={handleSmartSearch}
                        className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center gap-2"
                    >
                        <Sparkles className="w-5 h-5" />
                        AI Ara
                    </button>
                </div>
                <p className="text-gray-400 text-sm mt-3">
                    💡 İpucu: Pozisyon, beceri veya deneyim yılı gibi kriterleri yazın
                </p>
            </div>

            {/* Arama Sonuçları */}
            {searchResults.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">
                        Arama Sonuçları ({searchResults.length})
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {searchResults.map(candidate => (
                            <SearchResultCard
                                key={candidate.id}
                                candidate={candidate}
                                onView={() => openModal('view', candidate)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {searchResults.length === 0 && searchQuery && (
                <div className="glass p-12 rounded-2xl text-center">
                    <SearchIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Henüz arama yapmadınız veya sonuç bulunamadı</p>
                </div>
            )}
        </div>
    );
}

function SearchResultCard({ candidate, onView }) {
    return (
        <div className="glass p-6 rounded-xl hover:scale-[1.02] transition-transform">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 gradient-bg rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {candidate.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <h4 className="text-white font-bold text-lg">{candidate.name}</h4>
                        <p className="text-purple-300">{candidate.analysis.position}</p>
                        <p className="text-gray-400 text-sm mt-1">
                            {candidate.analysis.skills.slice(0, 4).join(', ')}
                        </p>
                        {candidate.matchReason && (
                            <p className="text-green-300 text-sm mt-2">
                                ✓ {candidate.matchReason}
                            </p>
                        )}
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-purple-400 mb-1">
                            {candidate.matchScore}%
                        </div>
                        <p className="text-gray-400 text-sm">Eşleşme</p>
                        <span className={`mt-2 inline-block px-3 py-1 ${STATUS_CONFIG[candidate.status].color} text-white text-xs rounded-full font-medium`}>
                            {STATUS_CONFIG[candidate.status].label}
                        </span>
                    </div>
                </div>
                <button
                    onClick={onView}
                    className="ml-4 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all flex items-center gap-2"
                >
                    <Eye className="w-4 h-4" />
                    Detay
                </button>
            </div>
        </div>
    );
}

export default Search;
