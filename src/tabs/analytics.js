// === ANALYTICS TAB ===

import { STATUS_CONFIG, PLATFORMS } from '../config.js';
import { getStats, getAnalytics } from '../utils.js';

// Chart instances (to destroy before re-creating)
let lifecycleChart = null;
let platformChart = null;

export function renderAnalyticsTab(state) {
    const stats = getStats(state.candidates, state.employees);
    const analytics = getAnalytics(state.candidates, state.employees);

    // Render sonrası chart'ları initialize et
    setTimeout(() => initCharts(state), 100);

    return `
        <div class="space-y-6" style="animation: fadeIn 0.5s ease-out;">
            <h2 class="text-3xl font-bold text-white mb-6">Analizler ve Raporlar</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="glass p-6 rounded-2xl border border-green-500/30">
                    <div class="flex items-center justify-between mb-3">
                        <i data-lucide="badge-check" class="w-8 h-8 text-green-400"></i>
                        <span class="text-3xl font-bold text-white">${analytics.offersAccepted} / ${analytics.offersSent}</span>
                    </div>
                    <p class="text-green-300 font-medium mb-1">Teklif Kabul Oranı</p>
                </div>
                <div class="glass p-6 rounded-2xl border border-red-500/30">
                    <div class="flex items-center justify-between mb-3">
                        <i data-lucide="user-x" class="w-8 h-8 text-red-400"></i>
                        <span class="text-3xl font-bold text-white">${analytics.turnoverRate.toFixed(1)}%</span>
                    </div>
                    <p class="text-red-300 font-medium mb-1">Personel Devir Hızı</p>
                </div>
                <div class="glass p-6 rounded-2xl border border-blue-500/30">
                    <div class="flex items-center justify-between mb-3">
                        <i data-lucide="hard-drive" class="w-8 h-8 text-blue-400"></i>
                        <span class="text-3xl font-bold text-white">${state.candidates.length + state.employees.length}</span>
                    </div>
                    <p class="text-blue-300 font-medium mb-1">Toplam Havuz</p>
                </div>
                <div class="glass p-6 rounded-2xl border border-yellow-500/30">
                    <div class="flex items-center justify-between mb-3">
                        <i data-lucide="user-round-cog" class="w-8 h-8 text-yellow-400"></i>
                        <span class="text-3xl font-bold text-white">${stats.activeEmployees}</span>
                    </div>
                    <p class="text-yellow-300 font-medium mb-1">Aktif İş Gücü</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Yaşam Döngüsü Dağılımı - Doughnut Chart -->
                <div class="glass p-6 rounded-2xl">
                    <h3 class="text-xl font-bold text-white mb-6">Yaşam Döngüsü Dağılımı</h3>
                    <div class="flex items-center justify-center" style="min-height: 300px;">
                        <canvas id="lifecycleChart"></canvas>
                    </div>
                </div>

                <!-- Aday Kaynak Platformu - Bar Chart -->
                <div class="glass p-6 rounded-2xl">
                    <h3 class="text-xl font-bold text-white mb-6">Aday Kaynak Platformu</h3>
                    <div class="flex items-center justify-center" style="min-height: 300px;">
                        <canvas id="platformChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Initialize Charts
function initCharts(state) {
    // Destroy existing charts if any
    if (lifecycleChart) {
        lifecycleChart.destroy();
    }
    if (platformChart) {
        platformChart.destroy();
    }

    // Prepare Lifecycle Data
    const lifecycleData = prepareLifecycleData(state);

    // Prepare Platform Data
    const platformData = preparePlatformData(state);

    // Create Lifecycle Doughnut Chart
    const lifecycleCanvas = document.getElementById('lifecycleChart');
    if (lifecycleCanvas && lifecycleData.labels.length > 0) {
        lifecycleChart = new Chart(lifecycleCanvas, {
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
                            font: {
                                size: 12,
                                family: 'Inter'
                            },
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
                            label: function(context) {
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
    const platformCanvas = document.getElementById('platformChart');
    if (platformCanvas && platformData.labels.length > 0) {
        platformChart = new Chart(platformCanvas, {
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
                            font: {
                                size: 11,
                                family: 'Inter'
                            },
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
                            font: {
                                size: 11,
                                family: 'Inter'
                            },
                            maxRotation: 45,
                            minRotation: 0
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: '#e5e7eb',
                        bodyColor: '#e5e7eb',
                        borderColor: '#667eea',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
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
}

// Prepare Lifecycle Chart Data
function prepareLifecycleData(state) {
    const allPeople = [...state.candidates, ...state.employees];
    const labels = [];
    const values = [];
    const colors = [];

    // Color mapping for each status (mor/mavi/pembe tonları)
    const statusColors = {
        'aday': '#3b82f6',           // blue-500
        'egitim': '#8b5cf6',         // purple-500
        'oryantasyon': '#eab308',    // yellow-500
        'deneme': '#f97316',         // orange-500
        'iki-aylik': '#14b8a6',      // teal-500
        'personel': '#22c55e',       // green-500
        'eski-personel': '#6b7280'   // gray-500
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

// Prepare Platform Chart Data
function preparePlatformData(state) {
    const labels = [];
    const values = [];

    const platforms = [...new Set([...PLATFORMS, ...state.candidates.map(c => c.platform).filter(Boolean)])];

    platforms.forEach(platform => {
        const count = state.candidates.filter(c => c.platform === platform).length;
        if (count > 0) {
            labels.push(platform);
            values.push(count);
        }
    });

    return { labels, values };
}
