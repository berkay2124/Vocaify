import React, { useState, useEffect, useMemo } from 'react';
import {
    UserMinus, AlertTriangle, TrendingDown, Users, Target, CheckCircle,
    XCircle, Star, ThumbsUp, ThumbsDown, MessageSquare, Lightbulb,
    BarChart3, PieChart, AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeExitInterviews } from '../utils/aiAnalyzer';

/**
 * AŞAMA 35: Exit Interview (İşten Ayrılma Görüşmesi)
 * Çalışanların ayrılma sebeplerini toplayıp AI ile toplu analiz yapar
 * Stratejik içgörüler sunarak turnover'ı azaltmaya yardımcı olur
 */
function ExitInterview() {
    const { exitInterviews, employees } = useApp();
    const { addExitInterview } = useApp();

    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        employeeId: '',
        employeeName: '',
        employeePosition: '',
        exitDate: new Date().toISOString().split('T')[0],
        exitReason: 'Daha İyi Fırsat',
        managerRating: 3,
        companyRating: 3,
        wouldRecommend: true,
        feedback: '',
        improvementSuggestions: ''
    });

    const exitReasonOptions = [
        'Daha İyi Fırsat',
        'Yetersiz Maaş',
        'Kötü Yönetici',
        'Kariyer Gelişimi Yok',
        'İş-Yaşam Dengesi',
        'Şirket Kültürü',
        'Uzaktan Çalışma İmkanı',
        'Kişisel Nedenler',
        'Emeklilik',
        'Diğer'
    ];

    // Employee seçimi için liste
    const activeEmployees = useMemo(() => {
        return employees.filter(emp => emp.status === 'aktif');
    }, [employees]);

    // Exit interview form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.employeeId || !formData.feedback.trim()) {
            alert('Lütfen çalışan seçin ve geri bildirim girin.');
            return;
        }

        setLoading(true);

        try {
            await addExitInterview(formData);
            alert('Exit interview başarıyla kaydedildi!');

            // Formu sıfırla
            setFormData({
                employeeId: '',
                employeeName: '',
                employeePosition: '',
                exitDate: new Date().toISOString().split('T')[0],
                exitReason: 'Daha İyi Fırsat',
                managerRating: 3,
                companyRating: 3,
                wouldRecommend: true,
                feedback: '',
                improvementSuggestions: ''
            });
            setShowForm(false);
        } catch (error) {
            console.error('Exit interview kaydetme hatası:', error);
            alert('Kaydetme sırasında hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    // Employee seçildiğinde bilgileri doldur
    const handleEmployeeSelect = (e) => {
        const empId = e.target.value;
        const employee = activeEmployees.find(emp => emp.id === empId);

        if (employee) {
            setFormData(prev => ({
                ...prev,
                employeeId: empId,
                employeeName: employee.name,
                employeePosition: employee.analysis?.position || employee.position || 'Belirtilmemiş'
            }));
        }
    };

    // AI analizi çalıştır
    const runAIAnalysis = async () => {
        if (exitInterviews.length === 0) {
            alert('Analiz için en az bir exit interview verisi gerekli.');
            return;
        }

        setAnalysisLoading(true);

        try {
            console.log('🤖 AI Exit Interview Analizi başlatılıyor...');
            const result = await analyzeExitInterviews(exitInterviews);

            if (result.success) {
                setAiAnalysis(result.analysis);
                console.log('✅ AI Analizi tamamlandı:', result.analysis);
            } else {
                alert('Analiz sırasında hata oluştu: ' + (result.error || 'Bilinmeyen hata'));
            }
        } catch (error) {
            console.error('AI analiz hatası:', error);
            alert('AI analizi sırasında hata oluştu.');
        } finally {
            setAnalysisLoading(false);
        }
    };

    // Otomatik analiz (exit interview sayısı değiştiğinde)
    useEffect(() => {
        if (exitInterviews.length > 0) {
            runAIAnalysis();
        }
    }, [exitInterviews.length]);

    // Risk seviyesi rengi
    const getRiskColor = (level) => {
        switch (level) {
            case 'Yüksek': return 'from-red-600 to-orange-600';
            case 'Orta': return 'from-yellow-600 to-amber-600';
            case 'Düşük': return 'from-green-600 to-emerald-600';
            default: return 'from-gray-600 to-slate-600';
        }
    };

    // Öncelik rengi
    const getPriorityColor = (recommendation) => {
        if (recommendation.includes('Yüksek')) return 'text-red-400';
        if (recommendation.includes('Orta')) return 'text-yellow-400';
        return 'text-green-400';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <UserMinus className="w-8 h-8 text-purple-400" />
                        Exit Interview (İşten Ayrılma Analizi)
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Ayrılan çalışanlardan geri bildirim toplayın ve AI ile stratejik içgörüler elde edin.
                    </p>
                </div>

                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium text-white hover:shadow-lg transition-all"
                >
                    {showForm ? 'Formu Kapat' : '+ Yeni Exit Interview'}
                </button>
            </div>

            {/* İstatistikler */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-blue-400" />
                        <div>
                            <p className="text-gray-400 text-sm">Toplam Exit Interview</p>
                            <p className="text-2xl font-bold text-white">{exitInterviews.length}</p>
                        </div>
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <Star className="w-8 h-8 text-yellow-400" />
                        <div>
                            <p className="text-gray-400 text-sm">Ortalama Yönetici Puanı</p>
                            <p className="text-2xl font-bold text-white">
                                {aiAnalysis?.averageManagerRating?.toFixed(1) || '-'} / 5
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <ThumbsUp className="w-8 h-8 text-green-400" />
                        <div>
                            <p className="text-gray-400 text-sm">Tavsiye Etme Oranı</p>
                            <p className="text-2xl font-bold text-white">
                                {aiAnalysis?.recommendationRate || '-'}%
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                        <div>
                            <p className="text-gray-400 text-sm">Risk Seviyesi</p>
                            <p className={`text-2xl font-bold ${
                                aiAnalysis?.riskLevel === 'Yüksek' ? 'text-red-400' :
                                aiAnalysis?.riskLevel === 'Orta' ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                                {aiAnalysis?.riskLevel || 'Bilinmiyor'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Exit Interview Form */}
            {showForm && (
                <div className="glass p-8 rounded-2xl">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-purple-400" />
                        Yeni Exit Interview Formu
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Çalışan Seçimi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Ayrılan Çalışan *
                                </label>
                                <select
                                    value={formData.employeeId}
                                    onChange={handleEmployeeSelect}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                >
                                    <option value="">Çalışan seçin...</option>
                                    {activeEmployees.map(emp => (
                                        <option key={emp.id} value={emp.id} className="bg-slate-800">
                                            {emp.name} - {emp.analysis?.position || emp.position || 'Pozisyon belirtilmemiş'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Ayrılma Tarihi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Ayrılma Tarihi *
                                </label>
                                <input
                                    type="date"
                                    value={formData.exitDate}
                                    onChange={(e) => setFormData({ ...formData, exitDate: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                />
                            </div>

                            {/* Ayrılma Nedeni */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Ayrılma Nedeni *
                                </label>
                                <select
                                    value={formData.exitReason}
                                    onChange={(e) => setFormData({ ...formData, exitReason: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                >
                                    {exitReasonOptions.map(reason => (
                                        <option key={reason} value={reason} className="bg-slate-800">
                                            {reason}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Yönetici Puanı */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Yönetici Puanı (1-5) *
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        value={formData.managerRating}
                                        onChange={(e) => setFormData({ ...formData, managerRating: parseInt(e.target.value) })}
                                        className="flex-1"
                                    />
                                    <span className="text-2xl font-bold text-purple-400 w-12 text-center">
                                        {formData.managerRating}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Çok Kötü</span>
                                    <span>Mükemmel</span>
                                </div>
                            </div>

                            {/* Şirket Puanı */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Şirket Puanı (1-5) *
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        value={formData.companyRating}
                                        onChange={(e) => setFormData({ ...formData, companyRating: parseInt(e.target.value) })}
                                        className="flex-1"
                                    />
                                    <span className="text-2xl font-bold text-purple-400 w-12 text-center">
                                        {formData.companyRating}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Çok Kötü</span>
                                    <span>Mükemmel</span>
                                </div>
                            </div>

                            {/* Tavsiye Eder mi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Şirketi Başkalarına Tavsiye Eder misiniz? *
                                </label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, wouldRecommend: true })}
                                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                                            formData.wouldRecommend
                                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                                                : 'bg-white/5 text-gray-400 border border-purple-500/20'
                                        }`}
                                    >
                                        <ThumbsUp className="w-5 h-5 mx-auto" />
                                        Evet
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, wouldRecommend: false })}
                                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                                            !formData.wouldRecommend
                                                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                                                : 'bg-white/5 text-gray-400 border border-purple-500/20'
                                        }`}
                                    >
                                        <ThumbsDown className="w-5 h-5 mx-auto" />
                                        Hayır
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Geri Bildirim */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Genel Geri Bildirim *
                            </label>
                            <textarea
                                value={formData.feedback}
                                onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                                required
                                rows="4"
                                placeholder="Şirketten ayrılma kararınıza neden olan faktörleri ve deneyiminizi paylaşın..."
                                className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                            />
                        </div>

                        {/* İyileştirme Önerileri */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                İyileştirme Önerileri
                            </label>
                            <textarea
                                value={formData.improvementSuggestions}
                                onChange={(e) => setFormData({ ...formData, improvementSuggestions: e.target.value })}
                                rows="3"
                                placeholder="Şirketin iyileştirebileceği alanlar hakkında önerilerinizi paylaşın..."
                                className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                            />
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium text-white hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {loading ? 'Kaydediliyor...' : 'Exit Interview Kaydet'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-3 bg-white/5 border border-purple-500/20 rounded-xl font-medium text-gray-300 hover:bg-white/10 transition-all"
                            >
                                İptal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* AI Analiz Sonuçları */}
            {exitInterviews.length > 0 && (
                <div className="space-y-6">
                    {/* AI Analiz Başlığı */}
                    <div className="glass p-6 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Target className="w-8 h-8 text-purple-400" />
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    AI Stratejik Analiz
                                </h2>
                                <p className="text-sm text-gray-400">
                                    {exitInterviews.length} exit interview verisi analiz edildi
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={runAIAnalysis}
                            disabled={analysisLoading}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-medium text-white hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {analysisLoading ? '🤖 Analiz Ediliyor...' : '🔄 Analizi Yenile'}
                        </button>
                    </div>

                    {aiAnalysis && (
                        <>
                            {/* Stratejik Özet */}
                            <div className={`glass p-8 rounded-2xl border-2 bg-gradient-to-r ${getRiskColor(aiAnalysis.riskLevel)}`}>
                                <div className="flex items-start gap-4">
                                    <AlertCircle className="w-12 h-12 text-white flex-shrink-0" />
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-3">
                                            Stratejik Özet
                                        </h3>
                                        <p className="text-xl text-white/90 leading-relaxed">
                                            {aiAnalysis.strategicSummary}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Ana Ayrılma Nedenleri */}
                            <div className="glass p-8 rounded-2xl">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <PieChart className="w-6 h-6 text-purple-400" />
                                    Ana Ayrılma Nedenleri
                                </h3>
                                <div className="space-y-4">
                                    {aiAnalysis.topReasons.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-white font-medium">{item.reason}</span>
                                                    <span className="text-purple-400 font-bold">{item.percentage}%</span>
                                                </div>
                                                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all"
                                                        style={{ width: `${item.percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-gray-400 text-sm w-16 text-right">
                                                {item.count} kişi
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Departman İçgörüleri */}
                            {aiAnalysis.departmentInsights && aiAnalysis.departmentInsights.length > 0 && (
                                <div className="glass p-8 rounded-2xl">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <BarChart3 className="w-6 h-6 text-purple-400" />
                                        Departman Bazlı Risk Analizi
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {aiAnalysis.departmentInsights.map((dept, index) => (
                                            <div key={index} className="bg-white/5 p-6 rounded-xl border border-purple-500/20">
                                                <h4 className="font-bold text-white mb-2">{dept.department}</h4>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <TrendingDown className={`w-5 h-5 ${
                                                        dept.turnoverRisk === 'Yüksek' ? 'text-red-400' :
                                                        dept.turnoverRisk === 'Orta' ? 'text-yellow-400' : 'text-green-400'
                                                    }`} />
                                                    <span className={`font-medium ${
                                                        dept.turnoverRisk === 'Yüksek' ? 'text-red-400' :
                                                        dept.turnoverRisk === 'Orta' ? 'text-yellow-400' : 'text-green-400'
                                                    }`}>
                                                        {dept.turnoverRisk} Risk
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-400">
                                                    Ana Sorun: {dept.mainIssue}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Aksiyon Önerileri */}
                            <div className="glass p-8 rounded-2xl">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Lightbulb className="w-6 h-6 text-yellow-400" />
                                    Aksiyon Odaklı Öneriler
                                </h3>
                                <div className="space-y-3">
                                    {aiAnalysis.actionableRecommendations.map((rec, index) => (
                                        <div key={index} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-purple-500/20">
                                            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                            <div className="flex-1">
                                                <p className={`font-medium ${getPriorityColor(rec)}`}>
                                                    {rec}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Önemli Alıntılar */}
                            {aiAnalysis.keyQuotes && aiAnalysis.keyQuotes.length > 0 && (
                                <div className="glass p-8 rounded-2xl">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <MessageSquare className="w-6 h-6 text-purple-400" />
                                        Çalışan Alıntıları
                                    </h3>
                                    <div className="space-y-4">
                                        {aiAnalysis.keyQuotes.map((quote, index) => (
                                            <div key={index} className="p-4 bg-white/5 rounded-xl border-l-4 border-purple-500">
                                                <p className="text-gray-300 italic">
                                                    "{quote}"
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {analysisLoading && (
                        <div className="glass p-12 rounded-2xl flex flex-col items-center justify-center gap-4">
                            <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-white font-medium text-lg">
                                🤖 Claude AI analiz yapıyor...
                            </p>
                            <p className="text-gray-400 text-sm">
                                {exitInterviews.length} exit interview verisi işleniyor
                            </p>
                        </div>
                    )}

                    {!aiAnalysis && !analysisLoading && exitInterviews.length > 0 && (
                        <div className="glass p-8 rounded-2xl text-center">
                            <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                            <p className="text-white font-medium">
                                Analiz henüz yapılmadı. Yukarıdaki butona tıklayarak AI analizini başlatın.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Boş Durum */}
            {exitInterviews.length === 0 && (
                <div className="glass p-12 rounded-2xl text-center">
                    <UserMinus className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">
                        Henüz Exit Interview Kaydı Yok
                    </h3>
                    <p className="text-gray-400 mb-6">
                        Ayrılan çalışanlardan geri bildirim toplamaya başlayın ve AI ile stratejik içgörüler elde edin.
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium text-white hover:shadow-lg transition-all"
                    >
                        İlk Exit Interview'ı Başlat
                    </button>
                </div>
            )}

            {/* Exit Interview Listesi */}
            {exitInterviews.length > 0 && (
                <div className="glass p-8 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6">
                        Exit Interview Geçmişi ({exitInterviews.length})
                    </h3>
                    <div className="space-y-4">
                        {exitInterviews.map((interview) => (
                            <div key={interview.id} className="bg-white/5 p-6 rounded-xl border border-purple-500/20">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h4 className="text-lg font-bold text-white">
                                            {interview.employeeName}
                                        </h4>
                                        <p className="text-sm text-gray-400">
                                            {interview.employeePosition} • Ayrılış: {new Date(interview.exitDate).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-medium">
                                        {interview.exitReason}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div className="text-center">
                                        <p className="text-xs text-gray-400 mb-1">Yönetici</p>
                                        <div className="flex items-center justify-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < interview.managerRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-gray-400 mb-1">Şirket</p>
                                        <div className="flex items-center justify-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < interview.companyRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-gray-400 mb-1">Tavsiye</p>
                                        {interview.wouldRecommend ? (
                                            <ThumbsUp className="w-5 h-5 text-green-400 mx-auto" />
                                        ) : (
                                            <ThumbsDown className="w-5 h-5 text-red-400 mx-auto" />
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 bg-white/5 rounded-lg">
                                    <p className="text-sm text-gray-300 mb-2">
                                        <strong className="text-white">Geri Bildirim:</strong> {interview.feedback}
                                    </p>
                                    {interview.improvementSuggestions && (
                                        <p className="text-sm text-gray-300">
                                            <strong className="text-white">Öneriler:</strong> {interview.improvementSuggestions}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
                                    <span>Görüşmeyi Yapan: {interview.conductedBy}</span>
                                    <span>•</span>
                                    <span>{new Date(interview.conductedDate).toLocaleDateString('tr-TR')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ExitInterview;
