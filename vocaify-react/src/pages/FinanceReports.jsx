import React, { useState, useMemo } from 'react';
import {
    DollarSign, Download, Calendar, TrendingUp, Users, Receipt,
    CheckCircle, FileText, BarChart3, AlertCircle, Filter, FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * AŞAMA 37: Finance Reporting Output
 * Finans departmanı için muhasebe çıktıları ve maaş yükü raporları
 * CSV export ile entegre finans sistemlerine veri aktarımı
 */
function FinanceReports() {
    const { expenses, employees } = useApp();

    const [dateFilter, setDateFilter] = useState('all'); // all, thisMonth, lastMonth, thisYear
    const [exportFormat, setExportFormat] = useState('csv'); // csv, excel

    // Onaylanmış masrafları filtrele
    const approvedExpenses = useMemo(() => {
        return expenses.filter(exp => exp.status === 'approved');
    }, [expenses]);

    // Tarih filtreleme
    const filteredExpenses = useMemo(() => {
        if (dateFilter === 'all') return approvedExpenses;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return approvedExpenses.filter(exp => {
            const expDate = new Date(exp.submitDate);
            const expMonth = expDate.getMonth();
            const expYear = expDate.getFullYear();

            switch (dateFilter) {
                case 'thisMonth':
                    return expMonth === currentMonth && expYear === currentYear;
                case 'lastMonth':
                    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                    return expMonth === lastMonth && expYear === lastMonthYear;
                case 'thisYear':
                    return expYear === currentYear;
                default:
                    return true;
            }
        });
    }, [approvedExpenses, dateFilter]);

    // Finansal özetler
    const financialSummary = useMemo(() => {
        const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const expenseCount = filteredExpenses.length;

        // Tip bazlı gruplandırma
        const byType = filteredExpenses.reduce((acc, exp) => {
            acc[exp.type] = (acc[exp.type] || 0) + exp.amount;
            return acc;
        }, {});

        // Çalışan bazlı gruplandırma
        const byEmployee = filteredExpenses.reduce((acc, exp) => {
            const existing = acc.find(item => item.employeeId === exp.employeeId);
            if (existing) {
                existing.amount += exp.amount;
                existing.count += 1;
            } else {
                acc.push({
                    employeeId: exp.employeeId,
                    employeeName: exp.employeeName,
                    amount: exp.amount,
                    count: 1
                });
            }
            return acc;
        }, []);

        return {
            totalExpenses,
            expenseCount,
            averageExpense: expenseCount > 0 ? totalExpenses / expenseCount : 0,
            byType,
            byEmployee: byEmployee.sort((a, b) => b.amount - a.amount)
        };
    }, [filteredExpenses]);

    // Maaş yükü hesaplama (tahmini)
    const salaryBurden = useMemo(() => {
        // Aktif çalışanlar
        const activeEmployees = employees.filter(emp => emp.status === 'aktif');
        const employeeCount = activeEmployees.length;

        // Tahmini ortalama maaş (simülasyon - gerçekte salary field'ından gelecek)
        const estimatedAverageSalary = 15000; // ₺
        const totalMonthlySalary = employeeCount * estimatedAverageSalary;
        const totalYearlySalary = totalMonthlySalary * 12;

        // Sosyal güvenlik ve diğer maliyetler (%40 ekleme)
        const employerBurden = totalYearlySalary * 0.4;
        const totalYearlyCost = totalYearlySalary + employerBurden;

        // Gider talepleri ekle
        const yearlyExpenses = expenses
            .filter(exp => exp.status === 'approved')
            .reduce((sum, exp) => sum + exp.amount, 0);

        return {
            employeeCount,
            monthlySalary: totalMonthlySalary,
            yearlySalary: totalYearlySalary,
            employerBurden,
            totalYearlyCost,
            yearlyExpenses,
            grandTotal: totalYearlyCost + yearlyExpenses
        };
    }, [employees, expenses]);

    // CSV Export
    const exportToCSV = () => {
        if (filteredExpenses.length === 0) {
            alert('Export edilecek veri yok.');
            return;
        }

        // CSV başlıkları
        const headers = [
            'Talep No',
            'Çalışan Adı',
            'Gider Tipi',
            'Tutar (₺)',
            'Açıklama',
            'Talep Tarihi',
            'Onay Tarihi',
            'Onaylayan',
            'Onay Notu'
        ];

        // CSV satırları
        const rows = filteredExpenses.map(exp => [
            exp.id,
            exp.employeeName,
            exp.type,
            exp.amount.toFixed(2),
            `"${(exp.description || '').replace(/"/g, '""')}"`, // CSV escape
            new Date(exp.submitDate).toLocaleDateString('tr-TR'),
            exp.reviewDate ? new Date(exp.reviewDate).toLocaleDateString('tr-TR') : '',
            exp.reviewedBy || '',
            `"${(exp.reviewNote || '').replace(/"/g, '""')}"`
        ]);

        // CSV içerik
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // BOM ekle (Türkçe karakterler için)
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

        // Download
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);

        const fileName = `Vocaify_Gider_Raporu_${dateFilter}_${new Date().toISOString().split('T')[0]}.csv`;
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log(`✅ CSV export tamamlandı: ${fileName}`);
    };

    // Excel-friendly export (tab-separated)
    const exportToExcel = () => {
        if (filteredExpenses.length === 0) {
            alert('Export edilecek veri yok.');
            return;
        }

        // Tab-separated values (Excel doğrudan açar)
        const headers = [
            'Talep No',
            'Çalışan Adı',
            'Gider Tipi',
            'Tutar (₺)',
            'Açıklama',
            'Talep Tarihi',
            'Onay Tarihi',
            'Onaylayan',
            'Onay Notu'
        ];

        const rows = filteredExpenses.map(exp => [
            exp.id,
            exp.employeeName,
            exp.type,
            exp.amount.toFixed(2),
            exp.description || '',
            new Date(exp.submitDate).toLocaleDateString('tr-TR'),
            exp.reviewDate ? new Date(exp.reviewDate).toLocaleDateString('tr-TR') : '',
            exp.reviewedBy || '',
            exp.reviewNote || ''
        ]);

        const tsvContent = [
            headers.join('\t'),
            ...rows.map(row => row.join('\t'))
        ].join('\n');

        const BOM = '\uFEFF';
        const blob = new Blob([BOM + tsvContent], { type: 'text/tab-separated-values;charset=utf-8;' });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);

        const fileName = `Vocaify_Gider_Raporu_${dateFilter}_${new Date().toISOString().split('T')[0]}.xls`;
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log(`✅ Excel export tamamlandı: ${fileName}`);
    };

    // Tip renkleri
    const getTypeColor = (type) => {
        const colors = {
            'Ulaşım': 'text-blue-400',
            'Yemek': 'text-green-400',
            'Konaklama': 'text-purple-400',
            'Eğitim': 'text-yellow-400',
            'Ekipman': 'text-red-400',
            'Diğer': 'text-gray-400'
        };
        return colors[type] || 'text-gray-400';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-green-400" />
                    Finans Raporları
                </h1>
                <p className="text-gray-400 mt-2">
                    Muhasebe çıktıları, gider raporları ve maaş yükü analizi
                </p>
            </div>

            {/* Maaş Yükü Widget */}
            <div className="glass p-8 rounded-2xl border-2 border-green-500/30">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Yıllık Toplam Maliyet Tahmini</h3>
                        <p className="text-gray-400 text-sm">Maaş, sosyal güvenlik ve gider talepleri dahil</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white/5 p-6 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="w-5 h-5 text-blue-400" />
                            <p className="text-gray-400 text-sm">Aktif Çalışan</p>
                        </div>
                        <p className="text-3xl font-bold text-white">{salaryBurden.employeeCount}</p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-5 h-5 text-green-400" />
                            <p className="text-gray-400 text-sm">Aylık Maaş Toplamı</p>
                        </div>
                        <p className="text-3xl font-bold text-white">
                            {salaryBurden.monthlySalary.toLocaleString('tr-TR')} ₺
                        </p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="w-5 h-5 text-yellow-400" />
                            <p className="text-gray-400 text-sm">Yıllık Maaş + SGK</p>
                        </div>
                        <p className="text-3xl font-bold text-white">
                            {salaryBurden.totalYearlyCost.toLocaleString('tr-TR')} ₺
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            (+%40 işveren yükü: {salaryBurden.employerBurden.toLocaleString('tr-TR')} ₺)
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-6 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-5 h-5 text-white" />
                            <p className="text-white/80 text-sm font-medium">Toplam Yıllık Yük</p>
                        </div>
                        <p className="text-3xl font-bold text-white">
                            {salaryBurden.grandTotal.toLocaleString('tr-TR')} ₺
                        </p>
                        <p className="text-xs text-white/60 mt-1">
                            Giderler dahil: +{salaryBurden.yearlyExpenses.toLocaleString('tr-TR')} ₺
                        </p>
                    </div>
                </div>

                <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-blue-300 font-medium text-sm mb-1">Tahmin Notu</p>
                        <p className="text-gray-300 text-xs">
                            Maaş tutarları ortalama 15,000₺ üzerinden tahmin edilmiştir. Gerçek tutarlar için
                            personel kayıtlarında maaş bilgilerini güncelleyin. İşveren yükü %40 olarak hesaplanmıştır.
                        </p>
                    </div>
                </div>
            </div>

            {/* Gider Özetleri */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                        <div>
                            <p className="text-gray-400 text-sm">Toplam Ödeme</p>
                            <p className="text-2xl font-bold text-white">
                                {financialSummary.totalExpenses.toLocaleString('tr-TR')} ₺
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Receipt className="w-8 h-8 text-blue-400" />
                        <div>
                            <p className="text-gray-400 text-sm">Talep Sayısı</p>
                            <p className="text-2xl font-bold text-white">
                                {financialSummary.expenseCount}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <BarChart3 className="w-8 h-8 text-yellow-400" />
                        <div>
                            <p className="text-gray-400 text-sm">Ortalama Gider</p>
                            <p className="text-2xl font-bold text-white">
                                {financialSummary.averageExpense.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="w-8 h-8 text-purple-400" />
                        <div>
                            <p className="text-gray-400 text-sm">Çalışan Sayısı</p>
                            <p className="text-2xl font-bold text-white">
                                {financialSummary.byEmployee.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtreler ve Export */}
            <div className="glass p-6 rounded-2xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-purple-400" />
                            <span className="text-white font-medium">Filtreler:</span>
                        </div>
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="px-4 py-2 bg-white/5 border border-purple-500/20 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        >
                            <option value="all" className="bg-slate-800">Tüm Zamanlar</option>
                            <option value="thisMonth" className="bg-slate-800">Bu Ay</option>
                            <option value="lastMonth" className="bg-slate-800">Geçen Ay</option>
                            <option value="thisYear" className="bg-slate-800">Bu Yıl</option>
                        </select>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={exportToCSV}
                            disabled={filteredExpenses.length === 0}
                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-medium text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            CSV İndir
                        </button>
                        <button
                            onClick={exportToExcel}
                            disabled={filteredExpenses.length === 0}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-medium text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <FileSpreadsheet className="w-5 h-5" />
                            Excel İndir
                        </button>
                    </div>
                </div>
            </div>

            {/* Tip Bazlı Dağılım */}
            <div className="glass p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-purple-400" />
                    Gider Tipi Dağılımı
                </h3>
                <div className="space-y-4">
                    {Object.entries(financialSummary.byType)
                        .sort((a, b) => b[1] - a[1])
                        .map(([type, amount]) => {
                            const percentage = (amount / financialSummary.totalExpenses) * 100;
                            return (
                                <div key={type} className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`font-medium ${getTypeColor(type)}`}>
                                                {type}
                                            </span>
                                            <span className="text-white font-bold">
                                                {amount.toLocaleString('tr-TR')} ₺
                                            </span>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-gray-400 text-sm w-16 text-right">
                                        {percentage.toFixed(1)}%
                                    </span>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Çalışan Bazlı Gider Tablosu */}
            <div className="glass p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Users className="w-6 h-6 text-purple-400" />
                    Çalışan Bazlı Gider Analizi
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-purple-500/20">
                                <th className="text-left py-3 px-4 text-gray-400 font-medium">Çalışan</th>
                                <th className="text-right py-3 px-4 text-gray-400 font-medium">Talep Sayısı</th>
                                <th className="text-right py-3 px-4 text-gray-400 font-medium">Toplam Tutar</th>
                                <th className="text-right py-3 px-4 text-gray-400 font-medium">Ortalama</th>
                            </tr>
                        </thead>
                        <tbody>
                            {financialSummary.byEmployee.map((emp, index) => (
                                <tr key={emp.employeeId} className="border-b border-purple-500/10 hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-4 text-white font-medium">
                                        {index + 1}. {emp.employeeName}
                                    </td>
                                    <td className="py-3 px-4 text-right text-gray-300">
                                        {emp.count}
                                    </td>
                                    <td className="py-3 px-4 text-right text-white font-bold">
                                        {emp.amount.toLocaleString('tr-TR')} ₺
                                    </td>
                                    <td className="py-3 px-4 text-right text-gray-400">
                                        {(emp.amount / emp.count).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detaylı Gider Listesi */}
            <div className="glass p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Receipt className="w-6 h-6 text-purple-400" />
                    Detaylı Gider Listesi ({filteredExpenses.length} Kayıt)
                </h3>
                {filteredExpenses.length === 0 ? (
                    <div className="text-center py-12">
                        <Receipt className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">Seçilen filtreye göre onaylanmış gider bulunamadı</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-purple-500/20">
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Talep No</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Çalışan</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Tip</th>
                                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Tutar</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Açıklama</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Tarih</th>
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Onaylayan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExpenses
                                    .sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate))
                                    .map((exp) => (
                                        <tr key={exp.id} className="border-b border-purple-500/10 hover:bg-white/5 transition-colors">
                                            <td className="py-3 px-4 text-gray-300 font-mono text-sm">
                                                {exp.id.substring(0, 12)}...
                                            </td>
                                            <td className="py-3 px-4 text-white font-medium">
                                                {exp.employeeName}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`${getTypeColor(exp.type)} font-medium`}>
                                                    {exp.type}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right text-white font-bold">
                                                {exp.amount.toLocaleString('tr-TR')} ₺
                                            </td>
                                            <td className="py-3 px-4 text-gray-300 max-w-xs truncate">
                                                {exp.description || '-'}
                                            </td>
                                            <td className="py-3 px-4 text-gray-400 text-sm">
                                                {new Date(exp.reviewDate).toLocaleDateString('tr-TR')}
                                            </td>
                                            <td className="py-3 px-4 text-gray-300 text-sm">
                                                {exp.reviewedBy || '-'}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-purple-500/30">
                                    <td colSpan="3" className="py-4 px-4 text-white font-bold text-lg">
                                        TOPLAM
                                    </td>
                                    <td className="py-4 px-4 text-right text-green-400 font-bold text-xl">
                                        {financialSummary.totalExpenses.toLocaleString('tr-TR')} ₺
                                    </td>
                                    <td colSpan="3"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>

            {/* Info Panel */}
            <div className="glass p-6 rounded-2xl border-2 border-green-500/30">
                <div className="flex items-start gap-4">
                    <DollarSign className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                        <h4 className="text-white font-bold mb-2">Finans Departmanı Entegrasyonu</h4>
                        <p className="text-gray-300 text-sm leading-relaxed mb-3">
                            Bu raporlar, Vocaify'dan muhasebe sistemlerinize (SAP, Oracle, vb.) veri aktarımını kolaylaştırır.
                            CSV ve Excel formatında export ile tüm onaylanmış masrafları finans departmanınıza iletebilirsiniz.
                        </p>
                        <ul className="space-y-1 text-gray-400 text-xs">
                            <li>• <strong className="text-white">CSV Export:</strong> Muhasebe yazılımlarına doğrudan import (Türkçe karakter desteği)</li>
                            <li>• <strong className="text-white">Tarih Filtreleme:</strong> Aylık/yıllık dönem raporları</li>
                            <li>• <strong className="text-white">Maaş Yükü:</strong> Toplam personel maliyeti tahmini (%40 SGK yükü dahil)</li>
                            <li>• <strong className="text-white">Detaylı Analiz:</strong> Tip ve çalışan bazlı dağılım</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FinanceReports;
