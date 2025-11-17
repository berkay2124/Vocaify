import React, { useState } from 'react';
import { Search, MapPin, Globe, Sparkles, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { runSourcingTask } from '../agents/sourcingAgent';

/**
 * AI Sourcing Sayfası
 * İK uzmanlarının otomatik profil araması yapmasını sağlar
 */
function Sourcing() {
    const [formData, setFormData] = useState({
        keywords: '',
        location: '',
        platform: 'linkedin',
        jobDescription: ''
    });

    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!formData.keywords.trim()) {
            setError('Lütfen anahtar kelime girin.');
            return;
        }

        setSearching(true);
        setError('');
        setResults(null);

        try {
            const sourcingResults = await runSourcingTask({
                keywords: formData.keywords,
                location: formData.location,
                platform: formData.platform,
                jobDescription: formData.jobDescription
            });

            setResults(sourcingResults);
        } catch (err) {
            console.error('Sourcing hatası:', err);
            setError('Arama sırasında bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-black text-white mb-4">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        AI Sourcing
                    </span>{' '}
                    Asistanı
                </h1>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                    Otomatik profil tarama ile ideal adayları bulun. AI destekli analiz ile en uygun adaylar sizin için puanlanır.
                </p>
            </div>

            {/* Info Box */}
            <div className="glass p-6 rounded-2xl border border-blue-500/30">
                <div className="flex items-start gap-4">
                    <Sparkles className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">Nasıl Çalışır?</h3>
                        <ul className="text-gray-300 space-y-2 text-sm">
                            <li>• Arama kriterlerinizi girin (anahtar kelime, lokasyon)</li>
                            <li>• AI asistanı halka açık LinkedIn profillerini tarar</li>
                            <li>• Her profil AI ile analiz edilir ve puanlanır</li>
                            <li>• En uygun adaylar size önerilir</li>
                        </ul>
                        <p className="text-xs text-gray-500 mt-4">
                            ⚖️ Etik Not: Sadece halka açık profil verileri kullanılır. KVKK ve GDPR uyumludur.
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="glass p-8 rounded-2xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Keywords */}
                    <div>
                        <label className="text-gray-300 text-sm font-medium mb-2 block">
                            Anahtar Kelimeler *
                        </label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="keywords"
                                value={formData.keywords}
                                onChange={handleInputChange}
                                placeholder="Örn: React Developer, UI/UX Designer"
                                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="text-gray-300 text-sm font-medium mb-2 block">
                            Lokasyon
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="Örn: İstanbul, Ankara"
                                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Platform */}
                <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">
                        Platform
                    </label>
                    <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                            name="platform"
                            value={formData.platform}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-500"
                        >
                            <option value="linkedin">LinkedIn (Halka Açık Veri)</option>
                        </select>
                    </div>
                </div>

                {/* Job Description */}
                <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">
                        İş Tanımı (Opsiyonel)
                    </label>
                    <textarea
                        name="jobDescription"
                        value={formData.jobDescription}
                        onChange={handleInputChange}
                        placeholder="İş tanımını girin, AI daha iyi eşleştirme yapabilsin..."
                        rows="4"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                        <p className="text-red-300 text-sm">{error}</p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={searching}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold rounded-xl hover:shadow-xl hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                    {searching ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Aranıyor...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            AI ile Arama Başlat
                        </>
                    )}
                </button>
            </form>

            {/* Results */}
            {results && (
                <div className="space-y-6">
                    {/* Results Summary */}
                    <div className="glass p-6 rounded-2xl">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Arama Sonuçları
                                </h3>
                                <p className="text-gray-400">
                                    "{results.searchCriteria?.keywords}" kriteri ile{' '}
                                    <span className="text-purple-400 font-semibold">
                                        {results.totalFound}
                                    </span>{' '}
                                    halka açık profil bulundu ve analiz edildi
                                </p>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-xl border border-green-500/30">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span className="text-green-300 font-medium">Tamamlandı</span>
                            </div>
                        </div>
                    </div>

                    {/* No Results */}
                    {results.totalFound === 0 && (
                        <div className="glass p-12 rounded-2xl text-center">
                            <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">
                                Arama kriterlerinize uygun profil bulunamadı.
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                Farklı anahtar kelimeler veya lokasyon deneyin.
                            </p>
                        </div>
                    )}

                    {/* Profile Cards */}
                    {results.profiles && results.profiles.length > 0 && (
                        <div className="grid grid-cols-1 gap-6">
                            {results.profiles.map((profile, index) => (
                                <div key={index} className="glass p-6 rounded-2xl hover:border-purple-500/50 transition-all">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="text-xl font-bold text-white">
                                                    {profile.name}
                                                </h4>
                                                {profile.aiAnalysis?.matchScore && (
                                                    <div className="px-3 py-1 bg-purple-500/20 rounded-full flex items-center gap-2">
                                                        <TrendingUp className="w-4 h-4 text-purple-400" />
                                                        <span className="text-purple-300 font-semibold text-sm">
                                                            {profile.aiAnalysis.matchScore}% Eşleşme
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-purple-300 font-medium mb-1">
                                                {profile.title}
                                            </p>
                                            <p className="text-gray-400 text-sm flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                {profile.location}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="px-3 py-1 bg-blue-500/20 rounded-lg border border-blue-500/30">
                                                <p className="text-blue-300 text-xs font-medium">
                                                    LinkedIn
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-300 mb-4">
                                        {profile.summary}
                                    </p>

                                    {/* Skills */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {profile.skills.slice(0, 6).map((skill, skillIndex) => (
                                            <span
                                                key={skillIndex}
                                                className="px-3 py-1 bg-slate-700/50 text-gray-300 text-sm rounded-lg border border-purple-500/20"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    {/* AI Analysis */}
                                    {profile.aiAnalysis && (
                                        <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Award className="w-4 h-4 text-purple-400" />
                                                <p className="text-purple-300 font-semibold text-sm">
                                                    AI Analizi
                                                </p>
                                            </div>
                                            <p className="text-gray-300 text-sm">
                                                {profile.aiAnalysis.summary}
                                            </p>
                                            <p className="text-purple-400 text-sm mt-2 font-medium">
                                                {profile.aiAnalysis.recommendation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Sourcing;
