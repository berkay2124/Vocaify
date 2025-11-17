import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { BadgeCheck, UserX, HardDrive, UserRoundCog } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getStats, getAnalytics } from '../utils/helpers';
import { STATUS_CONFIG, PLATFORMS } from '../config/constants';

Chart.register(...registerables);

/**
 * Analizler ve raporlar sekmesini render eder
 * İstatistikler, yaşam döngüsü dağılımı (Doughnut Chart) ve platform analizi (Bar Chart) içerir
 */
function Analytics() {
    const { candidates, employees } = useApp();
    const stats = getStats(candidates, employees);
    const analytics = getAnalytics(candidates, employees);

    const lifecycleChartRef = useRef(null);
    const platformChartRef = useRef(null);
    const lifecycleChartInstance = useRef(null);
    const platformChartInstance = useRef(null);

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
