import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
    BarChart3,
    PieChart as PieChartIcon,
    Table as TableIcon,
    LineChart as LineChartIcon,
    Filter,
    Eye,
    Save,
    FolderOpen,
    Download,
    Plus,
    Trash2,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';

/**
 * Report Builder Component
 *
 * Custom report builder for HR managers to create their own reports.
 * Allows selecting data sources, applying filters, and choosing visualizations.
 *
 * AŞAMA 25: Custom Report Builder
 */
function ReportBuilder() {
    const { candidates } = useApp();
    const { currentUser } = useAuth();

    // Report configuration state
    const [reportConfig, setReportConfig] = useState({
        name: '',
        dataSource: 'employees', // employees, candidates, performance
        filters: [],
        visualization: 'table', // table, bar, pie, line
        groupBy: 'department', // department, status, month
        metric: 'count' // count, avg_performance, total
    });

    const [savedReports, setSavedReports] = useState([
        {
            id: 1,
            name: 'Departman Bazlı Çalışan Dağılımı',
            dataSource: 'employees',
            filters: [{ field: 'status', operator: 'equals', value: 'personel' }],
            visualization: 'pie',
            groupBy: 'department',
            metric: 'count',
            createdDate: '2025-11-15T10:00:00Z'
        },
        {
            id: 2,
            name: '2025 Performans Analizi',
            dataSource: 'performance',
            filters: [
                { field: 'year', operator: 'equals', value: '2025' },
                { field: 'status', operator: 'equals', value: 'personel' }
            ],
            visualization: 'bar',
            groupBy: 'department',
            metric: 'avg_performance',
            createdDate: '2025-11-16T14:30:00Z'
        }
    ]);

    const [showPreview, setShowPreview] = useState(false);
    const [showSavedReports, setShowSavedReports] = useState(false);

    // Data source options
    const dataSourceOptions = [
        { value: 'employees', label: 'Çalışanlar', icon: '👥' },
        { value: 'candidates', label: 'Adaylar', icon: '📋' },
        { value: 'performance', label: 'Performans Notları', icon: '⭐' }
    ];

    // Visualization options
    const visualizationOptions = [
        { value: 'table', label: 'Tablo', icon: TableIcon },
        { value: 'bar', label: 'Çubuk Grafik', icon: BarChart3 },
        { value: 'pie', label: 'Pasta Grafik', icon: PieChartIcon },
        { value: 'line', label: 'Çizgi Grafik', icon: LineChartIcon }
    ];

    // Filter field options based on data source
    const getFilterFields = () => {
        switch (reportConfig.dataSource) {
            case 'employees':
                return [
                    { value: 'department', label: 'Departman' },
                    { value: 'status', label: 'Durum' },
                    { value: 'year', label: 'İşe Başlama Yılı' }
                ];
            case 'candidates':
                return [
                    { value: 'status', label: 'Durum' },
                    { value: 'platform', label: 'Platform' },
                    { value: 'month', label: 'Başvuru Ayı' }
                ];
            case 'performance':
                return [
                    { value: 'department', label: 'Departman' },
                    { value: 'rating', label: 'Puan' },
                    { value: 'year', label: 'Yıl' }
                ];
            default:
                return [];
        }
    };

    // Group by options
    const groupByOptions = [
        { value: 'department', label: 'Departman' },
        { value: 'status', label: 'Durum' },
        { value: 'month', label: 'Ay' },
        { value: 'year', label: 'Yıl' }
    ];

    // Metric options
    const metricOptions = [
        { value: 'count', label: 'Sayı' },
        { value: 'avg_performance', label: 'Ortalama Performans' },
        { value: 'avg_salary', label: 'Ortalama Maaş' }
    ];

    // Add filter
    const addFilter = () => {
        setReportConfig({
            ...reportConfig,
            filters: [
                ...reportConfig.filters,
                { field: getFilterFields()[0]?.value || '', operator: 'equals', value: '' }
            ]
        });
    };

    // Remove filter
    const removeFilter = (index) => {
        const newFilters = reportConfig.filters.filter((_, i) => i !== index);
        setReportConfig({ ...reportConfig, filters: newFilters });
    };

    // Update filter
    const updateFilter = (index, key, value) => {
        const newFilters = [...reportConfig.filters];
        newFilters[index][key] = value;
        setReportConfig({ ...reportConfig, filters: newFilters });
    };

    /**
     * Generate report data based on configuration
     */
    const generateReportData = (config = reportConfig) => {
        let data = [];

        // Get base data
        if (config.dataSource === 'employees') {
            data = candidates.filter(c => c.status === 'personel');
        } else if (config.dataSource === 'candidates') {
            data = candidates.filter(c => c.status !== 'personel');
        } else if (config.dataSource === 'performance') {
            data = candidates.filter(c => c.status === 'personel' && c.evaluations && c.evaluations.length > 0);
        }

        // Apply filters
        config.filters.forEach(filter => {
            if (!filter.field || !filter.value) return;

            data = data.filter(item => {
                if (filter.field === 'department') {
                    const dept = item.analysis?.position || item.offerDetails?.position || '';
                    return dept.toLowerCase().includes(filter.value.toLowerCase());
                }
                if (filter.field === 'status') {
                    return item.status === filter.value;
                }
                if (filter.field === 'year') {
                    const year = new Date(item.uploadDate || item.createdDate || Date.now()).getFullYear();
                    return year.toString() === filter.value;
                }
                if (filter.field === 'month') {
                    const month = new Date(item.uploadDate || item.createdDate || Date.now()).getMonth();
                    return month.toString() === filter.value;
                }
                if (filter.field === 'platform') {
                    return item.platform?.toLowerCase().includes(filter.value.toLowerCase());
                }
                if (filter.field === 'rating') {
                    if (item.evaluations && item.evaluations.length > 0) {
                        const avgRating = item.evaluations.reduce((sum, e) => sum + (e.rating || 0), 0) / item.evaluations.length;
                        return avgRating >= parseFloat(filter.value);
                    }
                    return false;
                }
                return true;
            });
        });

        // Group data
        const grouped = {};
        data.forEach(item => {
            let key = 'Diğer';

            if (config.groupBy === 'department') {
                key = item.analysis?.position || item.offerDetails?.position || 'Belirtilmemiş';
            } else if (config.groupBy === 'status') {
                key = item.status || 'Belirtilmemiş';
            } else if (config.groupBy === 'month') {
                const month = new Date(item.uploadDate || item.createdDate || Date.now()).getMonth();
                const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                               'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
                key = months[month];
            } else if (config.groupBy === 'year') {
                key = new Date(item.uploadDate || item.createdDate || Date.now()).getFullYear().toString();
            }

            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(item);
        });

        // Calculate metrics
        const result = Object.entries(grouped).map(([name, items]) => {
            let value = 0;

            if (config.metric === 'count') {
                value = items.length;
            } else if (config.metric === 'avg_performance') {
                const ratings = items
                    .filter(item => item.evaluations && item.evaluations.length > 0)
                    .flatMap(item => item.evaluations.map(e => e.rating || 0));
                value = ratings.length > 0
                    ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
                    : 0;
            } else if (config.metric === 'avg_salary') {
                // Demo - in production this would come from actual salary data
                value = Math.floor(Math.random() * 10000 + 15000);
            }

            return { name, value: parseFloat(value) };
        });

        return result.sort((a, b) => b.value - a.value);
    };

    // Save report
    const handleSaveReport = () => {
        if (!reportConfig.name.trim()) {
            alert('Lütfen rapora bir isim verin.');
            return;
        }

        const newReport = {
            id: Date.now(),
            ...reportConfig,
            createdDate: new Date().toISOString()
        };

        setSavedReports([...savedReports, newReport]);
        alert('Rapor başarıyla kaydedildi!');
    };

    // Load report
    const handleLoadReport = (report) => {
        setReportConfig({
            name: report.name,
            dataSource: report.dataSource,
            filters: report.filters,
            visualization: report.visualization,
            groupBy: report.groupBy,
            metric: report.metric
        });
        setShowSavedReports(false);
        setShowPreview(true);
    };

    // Delete saved report
    const handleDeleteReport = (reportId) => {
        if (!window.confirm('Bu raporu silmek istediğinizden emin misiniz?')) return;
        setSavedReports(savedReports.filter(r => r.id !== reportId));
    };

    // Render chart based on visualization type
    const renderVisualization = (data) => {
        const colors = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

        switch (reportConfig.visualization) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #8b5cf6' }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #8b5cf6' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                );

            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #8b5cf6' }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'table':
            default:
                return (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-purple-500/30">
                                    <th className="px-4 py-3 text-left text-white font-bold">
                                        {groupByOptions.find(opt => opt.value === reportConfig.groupBy)?.label || 'Kategori'}
                                    </th>
                                    <th className="px-4 py-3 text-right text-white font-bold">
                                        {metricOptions.find(opt => opt.value === reportConfig.metric)?.label || 'Değer'}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, idx) => (
                                    <tr key={idx} className="border-b border-purple-500/10 hover:bg-purple-500/10 transition-colors">
                                        <td className="px-4 py-3 text-gray-300">{row.name}</td>
                                        <td className="px-4 py-3 text-right text-white font-bold">{row.value}</td>
                                    </tr>
                                ))}
                                {data.length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="px-4 py-8 text-center text-gray-500">
                                            Veri bulunamadı
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                );
        }
    };

    const reportData = showPreview ? generateReportData() : [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <BarChart3 className="w-8 h-8 text-purple-400" />
                            Özel Rapor Oluşturucu
                        </h1>
                        <p className="text-gray-300">
                            Kendi özel raporlarınızı oluşturun ve analiz edin
                        </p>
                    </div>
                    <button
                        onClick={() => setShowSavedReports(true)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center gap-2"
                    >
                        <FolderOpen className="w-5 h-5" />
                        Kaydedilen Raporlar ({savedReports.length})
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Configuration Panel */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Report Name */}
                    <div className="glass p-6 rounded-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">1. Rapor İsmi</h2>
                        <input
                            type="text"
                            value={reportConfig.name}
                            onChange={(e) => setReportConfig({ ...reportConfig, name: e.target.value })}
                            placeholder="örn: Satış Departmanı Performans Raporu"
                            className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 border border-purple-500/30 focus:border-purple-500 transition-all"
                        />
                    </div>

                    {/* Data Source */}
                    <div className="glass p-6 rounded-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">2. Veri Kaynağı</h2>
                        <div className="space-y-2">
                            {dataSourceOptions.map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => setReportConfig({ ...reportConfig, dataSource: option.value, filters: [] })}
                                    className={`w-full p-4 rounded-xl font-medium transition-all flex items-center gap-3 ${
                                        reportConfig.dataSource === option.value
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                            : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                                    }`}
                                >
                                    <span className="text-2xl">{option.icon}</span>
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="glass p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">3. Filtreler</h2>
                            <button
                                onClick={addFilter}
                                className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {reportConfig.filters.length === 0 ? (
                            <p className="text-gray-400 text-sm">Filtre eklemek için + butonuna tıklayın</p>
                        ) : (
                            <div className="space-y-3">
                                {reportConfig.filters.map((filter, idx) => (
                                    <div key={idx} className="bg-slate-800/50 p-3 rounded-lg space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-purple-400 font-medium">Filtre {idx + 1}</span>
                                            <button
                                                onClick={() => removeFilter(idx)}
                                                className="text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <select
                                            value={filter.field}
                                            onChange={(e) => updateFilter(idx, 'field', e.target.value)}
                                            className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm"
                                        >
                                            {getFilterFields().map(field => (
                                                <option key={field.value} value={field.value}>{field.label}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            value={filter.value}
                                            onChange={(e) => updateFilter(idx, 'value', e.target.value)}
                                            placeholder="Değer girin..."
                                            className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Group By */}
                    <div className="glass p-6 rounded-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">4. Gruplama</h2>
                        <select
                            value={reportConfig.groupBy}
                            onChange={(e) => setReportConfig({ ...reportConfig, groupBy: e.target.value })}
                            className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 border border-purple-500/30"
                        >
                            {groupByOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Metric */}
                    <div className="glass p-6 rounded-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">5. Metrik</h2>
                        <select
                            value={reportConfig.metric}
                            onChange={(e) => setReportConfig({ ...reportConfig, metric: e.target.value })}
                            className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 border border-purple-500/30"
                        >
                            {metricOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Visualization */}
                    <div className="glass p-6 rounded-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">6. Görselleştirme</h2>
                        <div className="grid grid-cols-2 gap-2">
                            {visualizationOptions.map(option => {
                                const Icon = option.icon;
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => setReportConfig({ ...reportConfig, visualization: option.value })}
                                        className={`p-4 rounded-xl font-medium transition-all flex flex-col items-center gap-2 ${
                                            reportConfig.visualization === option.value
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                                        }`}
                                    >
                                        <Icon className="w-6 h-6" />
                                        <span className="text-sm">{option.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="glass p-6 rounded-2xl space-y-3">
                        <button
                            onClick={() => setShowPreview(true)}
                            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
                        >
                            <Eye className="w-5 h-5" />
                            Raporu Görüntüle
                        </button>
                        <button
                            onClick={handleSaveReport}
                            className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            Raporu Kaydet
                        </button>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="lg:col-span-2">
                    <div className="glass p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Rapor Önizleme</h2>
                            {showPreview && (
                                <button
                                    onClick={() => alert('Export özelliği yakında eklenecek!')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Export (CSV)
                                </button>
                            )}
                        </div>

                        {!showPreview ? (
                            <div className="text-center py-20">
                                <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Rapor Henüz Oluşturulmadı</h3>
                                <p className="text-gray-400 mb-6">
                                    Soldaki ayarlardan raporunuzu yapılandırın ve "Raporu Görüntüle" butonuna tıklayın.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Report Info */}
                                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
                                    <h3 className="text-lg font-bold text-white mb-2">
                                        {reportConfig.name || 'İsimsiz Rapor'}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 text-sm text-gray-300">
                                        <span className="px-3 py-1 bg-purple-500/20 rounded-full">
                                            {dataSourceOptions.find(opt => opt.value === reportConfig.dataSource)?.label}
                                        </span>
                                        <span className="px-3 py-1 bg-pink-500/20 rounded-full">
                                            {reportConfig.filters.length} Filtre
                                        </span>
                                        <span className="px-3 py-1 bg-blue-500/20 rounded-full">
                                            {groupByOptions.find(opt => opt.value === reportConfig.groupBy)?.label} Bazlı
                                        </span>
                                        <span className="px-3 py-1 bg-green-500/20 rounded-full">
                                            {metricOptions.find(opt => opt.value === reportConfig.metric)?.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Visualization */}
                                <div className="bg-slate-900/50 rounded-xl p-6">
                                    {reportData.length === 0 ? (
                                        <div className="text-center py-12">
                                            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                                            <p className="text-gray-400">
                                                Seçilen filtrelerle eşleşen veri bulunamadı. Filtreleri ayarlayın.
                                            </p>
                                        </div>
                                    ) : (
                                        renderVisualization(reportData)
                                    )}
                                </div>

                                {/* Summary Stats */}
                                {reportData.length > 0 && (
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-slate-800/50 rounded-xl p-4">
                                            <div className="text-gray-400 text-sm mb-1">Toplam Kayıt</div>
                                            <div className="text-2xl font-bold text-white">
                                                {reportData.reduce((sum, item) => sum + item.value, 0)}
                                            </div>
                                        </div>
                                        <div className="bg-slate-800/50 rounded-xl p-4">
                                            <div className="text-gray-400 text-sm mb-1">Kategori Sayısı</div>
                                            <div className="text-2xl font-bold text-white">{reportData.length}</div>
                                        </div>
                                        <div className="bg-slate-800/50 rounded-xl p-4">
                                            <div className="text-gray-400 text-sm mb-1">Ortalama</div>
                                            <div className="text-2xl font-bold text-white">
                                                {(reportData.reduce((sum, item) => sum + item.value, 0) / reportData.length).toFixed(1)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Saved Reports Modal */}
            {showSavedReports && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30">
                        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">Kaydedilen Raporlar</h2>
                                <button
                                    onClick={() => setShowSavedReports(false)}
                                    className="text-white/70 hover:text-white text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            {savedReports.length === 0 ? (
                                <div className="text-center py-12">
                                    <FolderOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                    <p className="text-gray-400">Henüz kaydedilmiş rapor bulunmuyor.</p>
                                </div>
                            ) : (
                                savedReports.map(report => (
                                    <div
                                        key={report.id}
                                        className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-5 hover:bg-slate-800 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-white mb-2">{report.name}</h3>
                                                <div className="flex flex-wrap gap-2 text-sm">
                                                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                                                        {dataSourceOptions.find(opt => opt.value === report.dataSource)?.label}
                                                    </span>
                                                    <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full">
                                                        {report.filters.length} Filtre
                                                    </span>
                                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                                                        {visualizationOptions.find(opt => opt.value === report.visualization)?.label}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleLoadReport(report)}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Yükle
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteReport(report.id)}
                                                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-sm">
                                            Oluşturulma: {new Date(report.createdDate).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReportBuilder;
