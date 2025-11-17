import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Target, AlertTriangle, Lightbulb, Clock, BarChart3, Loader, CheckCircle, XCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeStrategicScenario } from '../utils/aiAnalyzer';

/**
 * AŞAMA 32: Strategic AI Modeling - What-If Scenario Analysis
 * İK Yöneticisinin "Ne Olur?" sorularına AI tabanlı stratejik tahminler sunar
 * Şirket geleceğini tahmin eden "stratejik beyin" modülü
 */
function StrategicModeling() {
    const { candidates, employees } = useApp();

    // State
    const [selectedScenario, setSelectedScenario] = useState('hiring_growth');
    const [scenarioParams, setScenarioParams] = useState({
        growthPercentage: 100,
        reductionPercentage: 10,
        timeframe: 6,
        boostPercentage: 20,
        targetDepartment: 'Tüm Şirket'
    });
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // Şirket verilerini hesapla
    const [companyData, setCompanyData] = useState({
        totalEmployees: 0,
        averageSalary: 0,
        monthlyBudget: 0,
        turnoverRate: 0,
        avgPerformance: 0,
        openPositions: 0
    });

    useEffect(() => {
        // Mevcut şirket verilerini hesapla
        const totalEmp = employees?.filter(e => e.status === 'calisan').length || 0;
        const avgSal = 50000; // Varsayılan ortalama maaş
        const turnover = 15; // Varsayılan yıllık turnover %
        const avgPerf = employees?.reduce((sum, e) => sum + (e.totalKpiScore || 0), 0) / (totalEmp || 1) || 70;
        const openPos = candidates?.filter(c => c.status === 'aday').length || 0;

        setCompanyData({
            totalEmployees: totalEmp,
            averageSalary: avgSal,
            monthlyBudget: totalEmp * avgSal,
            turnoverRate: turnover,
            avgPerformance: Math.round(avgPerf),
            openPositions: openPos
        });
    }, [employees, candidates]);

    // Senaryo tanımları
    const scenarios = [
        {
            id: 'hiring_growth',
            title: 'Ekip Büyütme',
            description: 'Ekibi hızlı büyütmenin maliyeti ve süresi',
            icon: Users,
            color: 'from-blue-600 to-cyan-600',
            example: 'Örn: Mühendislik ekibini %100 büyütürsem ne olur?'
        },
        {
            id: 'salary_reduction',
            title: 'Maaş Kısıtlaması',
            description: 'Maaş düşürmenin turnover etkisi',
            icon: DollarSign,
            color: 'from-red-600 to-orange-600',
            example: 'Örn: Maaşları %10 düşürürsem kaç kişi ayrılır?'
        },
        {
            id: 'turnover_prediction',
            title: 'Turnover Tahmini',
            description: 'Gelecek dönem ayrılma riski analizi',
            icon: TrendingUp,
            color: 'from-yellow-600 to-amber-600',
            example: 'Örn: Önümüzdeki 6 ayda kaç kişi ayrılabilir?'
        },
        {
            id: 'performance_boost',
            title: 'Performans Artırma',
            description: 'Eğitim yatırımı ve ROI analizi',
            icon: Target,
            color: 'from-green-600 to-emerald-600',
            example: 'Örn: Performansı %20 artırmak ne kadar sürer?'
        }
    ];

    // Senaryo analizi başlat
    const handleAnalyze = async () => {
        setLoading(true);
        console.log('🎯 Senaryo analizi başlatılıyor:', selectedScenario);

        try {
            const result = await analyzeStrategicScenario(
                selectedScenario,
                scenarioParams,
                companyData
            );

            if (result.success) {
                setAnalysisResult(result);
                console.log('✅ Analiz tamamlandı:', result);
            } else {
                alert('Analiz yapılamadı: ' + result.message);
            }
        } catch (error) {
            console.error('Analiz hatası:', error);
            alert('Bir hata oluştu: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Trend badge rengi
    const getTrendColor = (trend) => {
        switch (trend) {
            case 'increase': return 'text-green-400';
            case 'decrease': return 'text-blue-400';
            case 'warning': return 'text-yellow-400';
            case 'neutral': return 'text-gray-400';
            default: return 'text-gray-400';
        }
    };

    // Success probability rengi
    const getSuccessColor = (probability) => {
        const lowerProb = probability?.toLowerCase() || '';
        if (lowerProb.includes('yüksek') || lowerProb.includes('high')) return 'text-green-400';
        if (lowerProb.includes('orta') || lowerProb.includes('medium')) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                        <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Stratejik AI Modelleme</h1>
                        <p className="text-purple-200 text-sm">What-If Senaryoları ile Geleceği Tahmin Edin</p>
                    </div>
                </div>
                <p className="text-gray-300 text-sm">
                    AI destekli stratejik analizler ile "Ne Olur?" sorularınıza yanıt bulun.
                    İşe alım, maaş, performans ve turnover senaryolarını modelleyin.
                </p>
            </div>

            {/* Mevcut Şirket Durumu */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-400" />
                    Mevcut Şirket Durumu
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-xs mb-1">Toplam Çalışan</p>
                        <p className="text-white text-2xl font-bold">{companyData.totalEmployees}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-xs mb-1">Ort. Maaş</p>
                        <p className="text-white text-2xl font-bold">{Math.round(companyData.averageSalary / 1000)}K ₺</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-xs mb-1">Aylık Bütçe</p>
                        <p className="text-white text-2xl font-bold">{Math.round(companyData.monthlyBudget / 1000)}K ₺</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-xs mb-1">Turnover</p>
                        <p className="text-white text-2xl font-bold">%{companyData.turnoverRate}</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-xs mb-1">Ort. Performans</p>
                        <p className="text-white text-2xl font-bold">{companyData.avgPerformance}/100</p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-xs mb-1">Açık Pozisyon</p>
                        <p className="text-white text-2xl font-bold">{companyData.openPositions}</p>
                    </div>
                </div>
            </div>

            {/* Senaryo Seçimi */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">1️⃣ Senaryo Seçin</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {scenarios.map((scenario) => {
                        const Icon = scenario.icon;
                        const isSelected = selectedScenario === scenario.id;
                        return (
                            <button
                                key={scenario.id}
                                onClick={() => setSelectedScenario(scenario.id)}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${
                                    isSelected
                                        ? 'border-purple-500 bg-purple-500/20'
                                        : 'border-slate-700 bg-slate-800/50 hover:border-purple-500/50'
                                }`}
                            >
                                <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${scenario.color} mb-3`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-white font-bold mb-1">{scenario.title}</h3>
                                <p className="text-gray-400 text-xs mb-2">{scenario.description}</p>
                                <p className="text-purple-300 text-xs italic">{scenario.example}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Parametreler */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">2️⃣ Parametreleri Ayarlayın</h2>
                <div className="space-y-4">
                    {selectedScenario === 'hiring_growth' && (
                        <>
                            <div>
                                <label className="text-gray-300 font-medium mb-2 block">
                                    Büyüme Oranı: %{scenarioParams.growthPercentage}
                                    <span className="text-gray-500 text-sm ml-2">
                                        (+{Math.round(companyData.totalEmployees * scenarioParams.growthPercentage / 100)} kişi)
                                    </span>
                                </label>
                                <input
                                    type="range"
                                    min="10"
                                    max="200"
                                    step="10"
                                    value={scenarioParams.growthPercentage}
                                    onChange={(e) => setScenarioParams({ ...scenarioParams, growthPercentage: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>%10</span>
                                    <span>%100</span>
                                    <span>%200</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-gray-300 font-medium mb-2 block">Hedef Departman</label>
                                <select
                                    value={scenarioParams.targetDepartment}
                                    onChange={(e) => setScenarioParams({ ...scenarioParams, targetDepartment: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white"
                                >
                                    <option>Tüm Şirket</option>
                                    <option>Mühendislik</option>
                                    <option>Satış</option>
                                    <option>Pazarlama</option>
                                    <option>Ürün</option>
                                    <option>İK</option>
                                </select>
                            </div>
                        </>
                    )}

                    {selectedScenario === 'salary_reduction' && (
                        <div>
                            <label className="text-gray-300 font-medium mb-2 block">
                                Maaş Azaltma Oranı: %{scenarioParams.reductionPercentage}
                                <span className="text-gray-500 text-sm ml-2">
                                    (Piyasanın %{scenarioParams.reductionPercentage} altı)
                                </span>
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="30"
                                step="5"
                                value={scenarioParams.reductionPercentage}
                                onChange={(e) => setScenarioParams({ ...scenarioParams, reductionPercentage: parseInt(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>%5</span>
                                <span>%15</span>
                                <span>%30</span>
                            </div>
                        </div>
                    )}

                    {selectedScenario === 'turnover_prediction' && (
                        <div>
                            <label className="text-gray-300 font-medium mb-2 block">
                                Tahmin Süresi: {scenarioParams.timeframe} ay
                            </label>
                            <input
                                type="range"
                                min="3"
                                max="12"
                                step="3"
                                value={scenarioParams.timeframe}
                                onChange={(e) => setScenarioParams({ ...scenarioParams, timeframe: parseInt(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>3 ay</span>
                                <span>6 ay</span>
                                <span>9 ay</span>
                                <span>12 ay</span>
                            </div>
                        </div>
                    )}

                    {selectedScenario === 'performance_boost' && (
                        <>
                            <div>
                                <label className="text-gray-300 font-medium mb-2 block">
                                    Hedef Performans Artışı: %{scenarioParams.boostPercentage}
                                </label>
                                <input
                                    type="range"
                                    min="10"
                                    max="50"
                                    step="5"
                                    value={scenarioParams.boostPercentage}
                                    onChange={(e) => setScenarioParams({ ...scenarioParams, boostPercentage: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-600"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>%10</span>
                                    <span>%30</span>
                                    <span>%50</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-gray-300 font-medium mb-2 block">Hedef Departman</label>
                                <select
                                    value={scenarioParams.targetDepartment}
                                    onChange={(e) => setScenarioParams({ ...scenarioParams, targetDepartment: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white"
                                >
                                    <option>Tüm Şirket</option>
                                    <option>Mühendislik</option>
                                    <option>Satış</option>
                                    <option>Pazarlama</option>
                                    <option>Ürün</option>
                                    <option>İK</option>
                                </select>
                            </div>
                        </>
                    )}
                </div>

                {/* Analiz Butonu */}
                <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/50"
                >
                    {loading ? (
                        <>
                            <Loader className="w-6 h-6 animate-spin" />
                            AI Analizi Yapılıyor...
                        </>
                    ) : (
                        <>
                            <BarChart3 className="w-6 h-6" />
                            Senaryoyu Analiz Et
                        </>
                    )}
                </button>
            </div>

            {/* Analiz Sonuçları */}
            {analysisResult && (
                <div className="space-y-6">
                    {/* Özet */}
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                            Analiz Özeti
                        </h2>
                        <p className="text-white text-lg leading-relaxed">{analysisResult.summary}</p>
                        <div className="mt-4 flex items-center gap-4 text-sm">
                            <span className="text-purple-300">
                                {analysisResult.aiGenerated ? '🤖 AI Üretildi' : '📊 Kural Tabanlı'}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-400">
                                {new Date(analysisResult.timestamp).toLocaleString('tr-TR')}
                            </span>
                        </div>
                    </div>

                    {/* Ana Metrikler */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Maliyet */}
                        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-gray-300 text-sm font-medium">Tahmini Maliyet</p>
                            </div>
                            <p className="text-white text-3xl font-bold">
                                {analysisResult.estimatedCost >= 0 ? '+' : ''}{Math.round(analysisResult.estimatedCost / 1000)}K {analysisResult.estimatedCostCurrency}
                            </p>
                        </div>

                        {/* Süre */}
                        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-purple-600 rounded-lg">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-gray-300 text-sm font-medium">Tahmini Süre</p>
                            </div>
                            <p className="text-white text-3xl font-bold">{analysisResult.estimatedTime}</p>
                        </div>

                        {/* Başarı Olasılığı */}
                        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-green-600 rounded-lg">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-gray-300 text-sm font-medium">Başarı Olasılığı</p>
                            </div>
                            <p className={`text-3xl font-bold ${getSuccessColor(analysisResult.successProbability)}`}>
                                {analysisResult.successProbability}
                            </p>
                            <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full transition-all"
                                    style={{ width: `${analysisResult.successProbabilityScore}%` }}
                                />
                            </div>
                        </div>

                        {/* Risk Seviyesi */}
                        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-yellow-600 rounded-lg">
                                    <AlertTriangle className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-gray-300 text-sm font-medium">Risk Sayısı</p>
                            </div>
                            <p className="text-white text-3xl font-bold">{analysisResult.risks?.length || 0}</p>
                        </div>
                    </div>

                    {/* Detaylı Metrikler */}
                    {analysisResult.keyMetrics && analysisResult.keyMetrics.length > 0 && (
                        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">📊 Ana Metrikler</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {analysisResult.keyMetrics.map((metric, idx) => (
                                    <div key={idx} className="bg-slate-800/50 rounded-lg p-4 flex items-center justify-between">
                                        <span className="text-gray-300">{metric.label}</span>
                                        <span className={`text-xl font-bold ${getTrendColor(metric.trend)}`}>
                                            {metric.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Timeline */}
                    {analysisResult.timeline && analysisResult.timeline.length > 0 && (
                        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-purple-400" />
                                Zaman Çizelgesi
                            </h3>
                            <div className="space-y-3">
                                {analysisResult.timeline.map((phase, idx) => (
                                    <div key={idx} className="flex items-center gap-4 bg-slate-800/50 rounded-lg p-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-medium">{phase.phase}</p>
                                        </div>
                                        <div className="text-purple-300 font-medium">{phase.duration}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Riskler ve Fırsatlar */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Riskler */}
                        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-400" />
                                Riskler
                            </h3>
                            <ul className="space-y-2">
                                {analysisResult.risks?.map((risk, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-gray-300">
                                        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm">{risk}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Fırsatlar */}
                        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                                Fırsatlar
                            </h3>
                            <ul className="space-y-2">
                                {analysisResult.opportunities?.map((opp, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-gray-300">
                                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm">{opp}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Öneriler */}
                    {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-blue-400" />
                                AI Önerileri
                            </h3>
                            <ul className="space-y-3">
                                {analysisResult.recommendations.map((rec, idx) => (
                                    <li key={idx} className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                                            {idx + 1}
                                        </div>
                                        <span className="text-white flex-1">{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default StrategicModeling;
