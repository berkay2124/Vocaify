import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { BadgeCheck, UserX, HardDrive, UserRoundCog, Sparkles, TrendingUp, Lightbulb } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getStats, getAnalytics } from '../utils/helpers';
import { STATUS_CONFIG, PLATFORMS } from '../config/constants';
import { analyzePredictiveInsights } from '../utils/aiAnalyzer';

Chart.register(...registerables);

/**
 * Analizler ve raporlar sekmesini render eder
 * İstatistikler, yaşam döngüsü dağılımı (Doughnut Chart) ve platform analizi (Bar Chart) içerir
 * AI Strateji: Tahminleme ve stratejik öneriler (AŞAMA 15)
 */
function Analytics() {
    const { candidates, employees } = useApp();
    const stats = getStats(candidates, employees);
    const analytics = getAnalytics(candidates, employees);

    const lifecycleChartRef = useRef(null);
    const platformChartRef = useRef(null);
    const lifecycleChartInstance = useRef(null);
    const platformChartInstance = useRef(null);

    // AI Strateji state
    const [aiInsights, setAiInsights] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);

    useEffect(() => {
        // Destroy existing charts
        if (lifecycleChartInstance.current) {
            lifecycleChartInstance.current.destroy();
        }
        if (platformChartInstance.current) {
            platformChartInstance.current.destroy();
        }

        // Prepare data
        const lifecycleData = prepareLifecycleData(candidates, employees);
        const platformData = preparePlatformData(candidates);

        // Create Lifecycle Doughnut Chart
        if (lifecycleChartRef.current && lifecycleData.labels.length > 0) {
            lifecycleChartInstance.current = new Chart(lifecycleChartRef.current, {
                type: 'doughnut',
                data: {
                    labels: lifecycleData.labels,
                    datasets: [{
                        data: lifecycleData.values,
                        backgroundColor: lifecycleData.colors,
                        borderColor: '#0f172a',
                        borderWidth: 2,
                        hoverOffset: 15
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#e5e7eb',
                                padding: 15,
                                font: { size: 12, family: 'Inter' },
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            titleColor: '#e5e7eb',
                            bodyColor: '#e5e7eb',
                            borderColor: '#667eea',
                            borderWidth: 1,
                            padding: 12,
                            displayColors: true,
                            callbacks: {
                                label: function (context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Create Platform Bar Chart
        if (platformChartRef.current && platformData.labels.length > 0) {
            platformChartInstance.current = new Chart(platformChartRef.current, {
                type: 'bar',
                data: {
                    labels: platformData.labels,
                    datasets: [{
                        label: 'Aday Sayısı',
                        data: platformData.values,
                        backgroundColor: 'rgba(102, 126, 234, 0.8)',
                        borderColor: '#667eea',
                        borderWidth: 2,
                        borderRadius: 8,
                        hoverBackgroundColor: 'rgba(118, 75, 162, 0.9)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: '#94a3b8',
                                font: { size: 11, family: 'Inter' },
                                precision: 0
                            },
                            grid: {
                                color: 'rgba(148, 163, 184, 0.1)',
                                drawBorder: false
                            }
                        },
                        x: {
                            ticks: {
                                color: '#94a3b8',
                                font: { size: 11, family: 'Inter' },
                                maxRotation: 45,
                                minRotation: 0
                            },
                            grid: { display: false }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            titleColor: '#e5e7eb',
                            bodyColor: '#e5e7eb',
                            borderColor: '#667eea',
                            borderWidth: 1,
                            padding: 12,
                            displayColors: false,
                            callbacks: {
                                label: function (context) {
                                    const value = context.parsed.y;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return `Aday: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Cleanup
        return () => {
            if (lifecycleChartInstance.current) lifecycleChartInstance.current.destroy();
            if (platformChartInstance.current) platformChartInstance.current.destroy();
        };
    }, [candidates, employees]);

    // AI Strateji Analizi Tetikle
    const handleAIAnalysis = async () => {
        setAiLoading(true);
        setAiError(null);

        try {
            const result = await analyzePredictiveInsights(employees);

            if (!result.success) {
                setAiError(result.message);
                setAiInsights(null);
            } else {
                setAiInsights(result);
            }
        } catch (error) {
            console.error('AI analizi hatası:', error);
            setAiError('AI analizi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
            setAiInsights(null);
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="space-y-6" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <h2 className="text-3xl font-bold text-white mb-6">Analizler ve Raporlar</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnalyticsCard
                    icon={BadgeCheck}
                    value={`${analytics.offersAccepted} / ${analytics.offersSent}`}
                    label="Teklif Kabul Oranı"
                    color="border-green-500/30"
                    iconColor="text-green-400"
                />
                <AnalyticsCard
                    icon={UserX}
                    value={`${analytics.turnoverRate.toFixed(1)}%`}
                    label="Personel Devir Hızı"
                    color="border-red-500/30"
                    iconColor="text-red-400"
                />
                <AnalyticsCard
                    icon={HardDrive}
                    value={candidates.length + employees.length}
                    label="Toplam Havuz"
                    color="border-blue-500/30"
                    iconColor="text-blue-400"
                />
                <AnalyticsCard
                    icon={UserRoundCog}
                    value={stats.activeEmployees}
                    label="Aktif İş Gücü"
                    color="border-yellow-500/30"
                    iconColor="text-yellow-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6">Yaşam Döngüsü Dağılımı</h3>
                    <div className="flex items-center justify-center" style={{ minHeight: '300px' }}>
                        <canvas ref={lifecycleChartRef}></canvas>
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6">Aday Kaynak Platformu</h3>
                    <div className="flex items-center justify-center" style={{ minHeight: '300px' }}>
                        <canvas ref={platformChartRef}></canvas>
                    </div>
                </div>
            </div>

            {/* AI Strateji Bölümü - AŞAMA 15 */}
            <div className="glass p-6 rounded-2xl border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-purple-400" />
                        <div>
                            <h3 className="text-2xl font-bold text-white">AI Strateji Danışmanı</h3>
                            <p className="text-gray-400 text-sm">Başarılı işe alımlarınızı analiz ederek stratejik öneriler sunar</p>
                        </div>
                    </div>
                    <button
                        onClick={handleAIAnalysis}
                        disabled={aiLoading || employees.filter(e => e.status === 'personel').length === 0}
                        className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                            aiLoading
                                ? 'bg-purple-500/20 text-purple-300 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                        }`}
                    >
                        {aiLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-300"></div>
                                Analiz Ediliyor...
                            </>
                        ) : (
                            <>
                                <TrendingUp className="w-5 h-5" />
                                Tahminleme Analizi Yap
                            </>
                        )}
                    </button>
                </div>

                {/* Hata Durumu */}
                {aiError && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                        <p className="text-red-300 text-sm">{aiError}</p>
                    </div>
                )}

                {/* Analiz Sonuçları */}
                {aiInsights && aiInsights.success && (
                    <div className="space-y-4">
                        {/* Özet */}
                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
                            <p className="text-purple-200 font-medium">
                                📊 {aiInsights.analyzedCount} başarılı işe alım analiz edildi
                            </p>
                            <p className="text-gray-300 text-sm mt-2">{aiInsights.summary}</p>
                        </div>

                        {/* İçgörüler */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {aiInsights.insights.map((insight, index) => (
                                <div
                                    key={index}
                                    className="glass p-5 rounded-xl hover:scale-105 transition-transform border border-purple-500/20"
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <Lightbulb className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                                        <h4 className="text-white font-bold text-lg">{insight.title}</h4>
                                    </div>
                                    <p className="text-gray-300 text-sm mb-3">{insight.description}</p>
                                    <div className="bg-green-500/10 border-l-4 border-green-500 p-3 rounded">
                                        <p className="text-green-300 text-xs font-medium">💡 Eylem Önerisi:</p>
                                        <p className="text-green-200 text-sm mt-1">{insight.actionable}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* İlk Durum - Henüz analiz yapılmamış */}
                {!aiInsights && !aiError && !aiLoading && (
                    <div className="text-center py-12">
                        <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                        <p className="text-gray-400 text-lg mb-2">
                            Stratejik öneriler için AI analizi yapın
                        </p>
                        <p className="text-gray-500 text-sm">
                            Başarılı işe alımlarınızdaki gizli kalıpları keşfedin
                        </p>
                    </div>
                )}

                {/* Yeterli veri yok uyarısı */}
                {employees.filter(e => e.status === 'personel').length === 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
                        <p className="text-yellow-300 text-sm">
                            ⚠️ AI analizi için en az 1 personel kaydı gereklidir. Lütfen önce adayları "Personel" aşamasına taşıyın.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function AnalyticsCard({ icon: Icon, value, label, color, iconColor }) {
    return (
        <div className={`glass p-6 rounded-2xl border ${color}`}>
            <div className="flex items-center justify-between mb-3">
                <Icon className={`w-8 h-8 ${iconColor}`} />
                <span className="text-3xl font-bold text-white">{value}</span>
            </div>
            <p className="text-gray-300 font-medium mb-1">{label}</p>
        </div>
    );
}

function prepareLifecycleData(candidates, employees) {
    const allPeople = [...candidates, ...employees];
    const labels = [];
    const values = [];
    const colors = [];

    const statusColors = {
        'aday': '#3b82f6',
        'egitim': '#8b5cf6',
        'oryantasyon': '#eab308',
        'deneme': '#f97316',
        'iki-aylik': '#14b8a6',
        'personel': '#22c55e',
        'eski-personel': '#6b7280'
    };

    Object.entries(STATUS_CONFIG).forEach(([status, config]) => {
        const count = allPeople.filter(p => p.status === status).length;
        if (count > 0) {
            labels.push(config.label);
            values.push(count);
            colors.push(statusColors[status] || '#667eea');
        }
    });

    return { labels, values, colors };
}

function preparePlatformData(candidates) {
    const labels = [];
    const values = [];

    const platforms = [...new Set([...PLATFORMS, ...candidates.map(c => c.platform).filter(Boolean)])];

    platforms.forEach(platform => {
        const count = candidates.filter(c => c.platform === platform).length;
        if (count > 0) {
            labels.push(platform);
            values.push(count);
        }
    });

    return { labels, values };
}

export default Analytics;
