import React, { useState, useMemo } from 'react';
import { DollarSign, FileText, CheckCircle, XCircle, Clock, TrendingUp, Users, Receipt, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * AŞAMA 33: Expense Management - Admin Panel
 * İK Adminlerinin tüm gider taleplerini görüntüleyip onaylama/reddetme yetkisi
 */
function ExpenseAdmin() {
    const { expenses, approveExpenseClaim, rejectExpenseClaim } = useApp();

    // State
    const [filterStatus, setFilterStatus] = useState('all'); // all, pending, approved, rejected
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [reviewNote, setReviewNote] = useState('');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewAction, setReviewAction] = useState(''); // approve or reject

    // Filtrelenmiş gider talepleri
    const filteredExpenses = useMemo(() => {
        if (filterStatus === 'all') return expenses;
        return expenses.filter(exp => exp.status === filterStatus);
    }, [expenses, filterStatus]);

    // İstatistikler
    const stats = useMemo(() => {
        const pending = expenses.filter(e => e.status === 'pending');
        const approved = expenses.filter(e => e.status === 'approved');
        const rejected = expenses.filter(e => e.status === 'rejected');

        const totalPending = pending.reduce((sum, e) => sum + e.amount, 0);
        const totalApproved = approved.reduce((sum, e) => sum + e.amount, 0);
        const totalRejected = rejected.reduce((sum, e) => sum + e.amount, 0);

        return {
            pendingCount: pending.length,
            approvedCount: approved.length,
            rejectedCount: rejected.length,
            totalPending,
            totalApproved,
            totalRejected
        };
    }, [expenses]);

    // Review modal aç
    const openReviewModal = (expense, action) => {
        setSelectedExpense(expense);
        setReviewAction(action);
        setReviewNote('');
        setShowReviewModal(true);
    };

    // Review işlemi
    const handleReview = () => {
        if (!selectedExpense) return;

        if (reviewAction === 'approve') {
            approveExpenseClaim(selectedExpense.id, reviewNote);
        } else if (reviewAction === 'reject') {
            rejectExpenseClaim(selectedExpense.id, reviewNote);
        }

        setShowReviewModal(false);
        setSelectedExpense(null);
        setReviewNote('');
        setReviewAction('');
    };

    // Statü badge rengi
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Beklemede
                </span>;
            case 'approved':
                return <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Onaylandı
                </span>;
            case 'rejected':
                return <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-medium flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> Reddedildi
                </span>;
            default:
                return null;
        }
    };

    // Gider tipi ikonu
    const getExpenseTypeIcon = (type) => {
        switch (type) {
            case 'Ulaşım':
                return '🚗';
            case 'Yemek':
                return '🍽️';
            case 'Konaklama':
                return '🏨';
            case 'Eğitim':
                return '📚';
            case 'Ekipman':
                return '💻';
            default:
                return '📄';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl">
                        <Receipt className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Gider Yönetimi</h1>
                        <p className="text-green-200 text-sm">Çalışan Gider Taleplerini Yönetin</p>
                    </div>
                </div>
                <p className="text-gray-300 text-sm">
                    Tüm gider taleplerini görüntüleyin, onaylayın veya reddedin. Toplam ödenecek tutarları takip edin.
                </p>
            </div>

            {/* İstatistikler */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Bekleyen Talepler */}
                <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-yellow-600 rounded-lg">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-gray-300 text-sm font-medium">Bekleyen</p>
                    </div>
                    <p className="text-white text-3xl font-bold mb-1">{stats.pendingCount}</p>
                    <p className="text-yellow-300 text-sm font-medium">
                        {stats.totalPending.toLocaleString('tr-TR')} ₺
                    </p>
                </div>

                {/* Onaylanan Talepler */}
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-600 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-gray-300 text-sm font-medium">Onaylanan</p>
                    </div>
                    <p className="text-white text-3xl font-bold mb-1">{stats.approvedCount}</p>
                    <p className="text-green-300 text-sm font-medium">
                        {stats.totalApproved.toLocaleString('tr-TR')} ₺
                    </p>
                </div>

                {/* Reddedilen Talepler */}
                <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-red-600 rounded-lg">
                            <XCircle className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-gray-300 text-sm font-medium">Reddedilen</p>
                    </div>
                    <p className="text-white text-3xl font-bold mb-1">{stats.rejectedCount}</p>
                    <p className="text-red-300 text-sm font-medium">
                        {stats.totalRejected.toLocaleString('tr-TR')} ₺
                    </p>
                </div>

                {/* Toplam Ödenecek */}
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-gray-300 text-sm font-medium">Toplam Ödenecek</p>
                    </div>
                    <p className="text-white text-3xl font-bold mb-1">
                        {stats.totalPending.toLocaleString('tr-TR')} ₺
                    </p>
                    <p className="text-blue-300 text-xs">Bekleyen talepler</p>
                </div>
            </div>

            {/* Filtre */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <p className="text-white font-medium">Talep Filtresi:</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-4 py-2 rounded-lg transition-all ${
                                filterStatus === 'all'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            }`}
                        >
                            Tümü ({expenses.length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('pending')}
                            className={`px-4 py-2 rounded-lg transition-all ${
                                filterStatus === 'pending'
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            }`}
                        >
                            Bekleyen ({stats.pendingCount})
                        </button>
                        <button
                            onClick={() => setFilterStatus('approved')}
                            className={`px-4 py-2 rounded-lg transition-all ${
                                filterStatus === 'approved'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            }`}
                        >
                            Onaylanan ({stats.approvedCount})
                        </button>
                        <button
                            onClick={() => setFilterStatus('rejected')}
                            className={`px-4 py-2 rounded-lg transition-all ${
                                filterStatus === 'rejected'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            }`}
                        >
                            Reddedilen ({stats.rejectedCount})
                        </button>
                    </div>
                </div>
            </div>

            {/* Talepler Listesi */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden">
                {filteredExpenses.length === 0 ? (
                    <div className="p-12 text-center">
                        <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">Gider talebi bulunamadı.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-900/50 border-b border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Talep No
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Çalışan
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Tip
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Tutar
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Açıklama
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Tarih
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Durum
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {filteredExpenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-white font-mono text-sm">{expense.id.split('-')[1]}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-bold">
                                                    {expense.employeeName.charAt(0)}
                                                </div>
                                                <p className="text-white text-sm font-medium">{expense.employeeName}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="flex items-center gap-2 text-white">
                                                <span className="text-xl">{getExpenseTypeIcon(expense.type)}</span>
                                                <span className="text-sm">{expense.type}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-white text-lg font-bold">
                                                {expense.amount.toLocaleString('tr-TR')} {expense.currency}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-300 text-sm max-w-xs truncate">{expense.description}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-gray-400 text-xs">
                                                {new Date(expense.submitDate).toLocaleDateString('tr-TR')}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(expense.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {expense.status === 'pending' ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openReviewModal(expense, 'approve')}
                                                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-xs font-medium flex items-center gap-1"
                                                    >
                                                        <CheckCircle className="w-3 h-3" />
                                                        Onayla
                                                    </button>
                                                    <button
                                                        onClick={() => openReviewModal(expense, 'reject')}
                                                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-xs font-medium flex items-center gap-1"
                                                    >
                                                        <XCircle className="w-3 h-3" />
                                                        Reddet
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-gray-500 text-xs">
                                                    {expense.reviewedBy && (
                                                        <p>İnceleyen: {expense.reviewedBy}</p>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {showReviewModal && selectedExpense && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            {reviewAction === 'approve' ? 'Gider Talebini Onayla' : 'Gider Talebini Reddet'}
                        </h2>

                        {/* Talep Detayları */}
                        <div className="bg-slate-800/50 rounded-lg p-4 mb-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Çalışan:</span>
                                <span className="text-white font-medium">{selectedExpense.employeeName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Tip:</span>
                                <span className="text-white font-medium">
                                    {getExpenseTypeIcon(selectedExpense.type)} {selectedExpense.type}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 text-sm">Tutar:</span>
                                <span className="text-white text-lg font-bold">
                                    {selectedExpense.amount.toLocaleString('tr-TR')} ₺
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-400 text-sm block mb-1">Açıklama:</span>
                                <p className="text-white text-sm">{selectedExpense.description}</p>
                            </div>
                        </div>

                        {/* Review Notu */}
                        <div className="mb-4">
                            <label className="text-gray-300 font-medium mb-2 block">
                                İnceleme Notu (Opsiyonel)
                            </label>
                            <textarea
                                value={reviewNote}
                                onChange={(e) => setReviewNote(e.target.value)}
                                placeholder="Onay/red gerekçenizi yazın..."
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 resize-none"
                                rows="3"
                            />
                        </div>

                        {/* Butonlar */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowReviewModal(false)}
                                className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all font-medium"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleReview}
                                className={`flex-1 px-4 py-3 text-white rounded-xl font-medium transition-all ${
                                    reviewAction === 'approve'
                                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                                        : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700'
                                }`}
                            >
                                {reviewAction === 'approve' ? 'Onayla' : 'Reddet'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ExpenseAdmin;
