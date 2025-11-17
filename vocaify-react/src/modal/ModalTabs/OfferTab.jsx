import React, { useState } from 'react';
import { Send, DollarSign, Loader } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateSalaryBenchmark } from '../../utils/aiAnalyzer';

/**
 * Modal'daki Teklif sekmesini render eder
 * İş teklifi formu (pozisyon, maaş, yan haklar) ve kabul/red butonlarını gösterir
 * AŞAMA 28: Maaş kıyaslama eklendi
 */
function OfferTab({ person }) {
    const { candidates, setCandidates, closeModal } = useApp();
    const [offerDetails, setOfferDetails] = useState(person.offerDetails || {});
    const [salaryBenchmark, setSalaryBenchmark] = useState(null); // AŞAMA 28
    const [benchmarkLocation, setBenchmarkLocation] = useState('İstanbul'); // AŞAMA 28
    const [loading, setLoading] = useState(false); // AŞAMA 28

    // AŞAMA 28: Maaş Kıyaslama
    const handleSalaryBenchmark = async () => {
        const positionTitle = offerDetails.position || person.analysis.position;
        if (!positionTitle) {
            alert('Pozisyon bilgisi bulunamadı.');
            return;
        }

        setLoading(true);
        try {
            console.log('💰 Maaş kıyaslaması yapılıyor...');
            const result = await generateSalaryBenchmark(positionTitle, benchmarkLocation);
            if (result.success) {
                setSalaryBenchmark(result);
                console.log(`✅ Maaş aralığı: ${result.minSalary} - ${result.maxSalary} ${result.currency}`);
            } else {
                alert(result.message || 'Maaş kıyaslaması yapılamadı.');
            }
        } catch (error) {
            console.error('Maaş kıyaslama hatası:', error);
            alert('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const updatedOffer = {
            ...offerDetails,
            position: formData.get('position'),
            salary: formData.get('salary'),
            benefits: formData.get('benefits'),
            startDate: formData.get('startDate'),
            offerSent: true
        };

        setCandidates(candidates.map(c =>
            c.id === person.id
                ? { ...c, offerDetails: updatedOffer }
                : c
        ));
        closeModal();
    };

    const updateOfferStatus = (accepted) => {
        setCandidates(candidates.map(c =>
            c.id === person.id
                ? {
                    ...c,
                    offerDetails: {
                        ...c.offerDetails,
                        offerAccepted: accepted
                    }
                }
                : c
        ));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* AŞAMA 28: Maaş Kıyaslama Bölümü */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-green-300 font-bold text-sm mb-1">💰 AI Maaş Kıyaslama</p>
                        <p className="text-gray-400 text-xs">Piyasa maaş aralığını öğrenin ve adil teklif yapın</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <select
                        value={benchmarkLocation}
                        onChange={(e) => setBenchmarkLocation(e.target.value)}
                        className="px-3 py-2 bg-slate-700/50 border border-green-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-green-500"
                    >
                        <option value="İstanbul">İstanbul</option>
                        <option value="Ankara">Ankara</option>
                        <option value="İzmir">İzmir</option>
                        <option value="Bursa">Bursa</option>
                        <option value="Antalya">Antalya</option>
                        <option value="Türkiye">Türkiye (Genel)</option>
                    </select>
                    <button
                        type="button"
                        onClick={handleSalaryBenchmark}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Analiz...
                            </>
                        ) : (
                            <>
                                <DollarSign className="w-4 h-4" />
                                Maaş Kıyasla
                            </>
                        )}
                    </button>
                </div>

                {/* Maaş Kıyaslama Sonuçları */}
                {salaryBenchmark && (
                    <div className="mt-4 bg-slate-800/50 rounded-lg p-4 space-y-3">
                        <div className="text-center pb-3 border-b border-green-500/20">
                            <p className="text-gray-400 text-xs mb-1">Tahmini Brüt Aylık Maaş</p>
                            <p className="text-white text-2xl font-bold">
                                {salaryBenchmark.minSalary.toLocaleString('tr-TR')} - {salaryBenchmark.maxSalary.toLocaleString('tr-TR')} ₺
                            </p>
                            <p className="text-gray-500 text-xs mt-1">{benchmarkLocation} • {new Date().getFullYear()}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-green-300 text-xs font-semibold">📊 Açıklama:</p>
                            <p className="text-gray-300 text-xs">{salaryBenchmark.explanation}</p>
                        </div>
                        {salaryBenchmark.recommendation && (
                            <div className="space-y-2">
                                <p className="text-blue-300 text-xs font-semibold">💡 Tavsiye:</p>
                                <p className="text-gray-300 text-xs">{salaryBenchmark.recommendation}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-gray-300 font-medium mb-2 block">Pozisyon</label>
                    <input
                        name="position"
                        type="text"
                        defaultValue={offerDetails.position || person.analysis.position}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white"
                    />
                </div>
                <div>
                    <label className="text-gray-300 font-medium mb-2 block">Maaş (Aylık Net)</label>
                    <input
                        name="salary"
                        type="number"
                        placeholder="50000"
                        defaultValue={offerDetails.salary || ''}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white"
                    />
                </div>
            </div>

            <div>
                <label className="text-gray-300 font-medium mb-2 block">Planlanan Başlangıç Tarihi</label>
                <input
                    name="startDate"
                    type="date"
                    defaultValue={offerDetails.startDate || ''}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white"
                />
            </div>

            <div>
                <label className="text-gray-300 font-medium mb-2 block">Yan Haklar</label>
                <textarea
                    name="benefits"
                    placeholder="Örn: Yemek Kartı, Özel Sağlık Sigortası..."
                    defaultValue={offerDetails.benefits || ''}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white min-h-[100px]"
                />
            </div>

            <button
                type="submit"
                className="w-full px-6 py-3 gradient-bg text-white rounded-xl hover:shadow-lg font-medium flex items-center justify-center gap-2"
            >
                <Send className="w-4 h-4" />
                {offerDetails.offerSent ? 'Teklifi Güncelle' : 'Teklifi Gönder/Kaydet'}
            </button>

            {offerDetails.offerSent && (
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => updateOfferStatus(true)}
                        className={`w-full p-3 rounded-xl border transition-all ${offerDetails.offerAccepted === true
                            ? 'bg-green-500 text-white scale-105'
                            : 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30'
                            }`}
                    >
                        ✓ Kabul Etti
                    </button>
                    <button
                        type="button"
                        onClick={() => updateOfferStatus(false)}
                        className={`w-full p-3 rounded-xl border transition-all ${offerDetails.offerAccepted === false
                            ? 'bg-red-500 text-white scale-105'
                            : 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30'
                            }`}
                    >
                        ✗ Reddetti
                    </button>
                </div>
            )}
        </form>
    );
}

export default OfferTab;
