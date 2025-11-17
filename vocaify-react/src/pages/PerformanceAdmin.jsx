import React, { useState } from 'react';
import { Target, TrendingUp, Award, Star, Calendar, Users, Plus, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

/**
 * Performance Management Admin Panel
 * İK yöneticileri için performans döngüleri ve değerlendirme yönetimi
 * AŞAMA 21
 */
function PerformanceAdmin() {
    const { candidates, setCandidates } = useApp();
    const { currentUser } = useAuth();

    // Performans döngüleri state
    const [performanceCycles, setPerformanceCycles] = useState([
        {
            id: 1,
            name: '2025 Q1 Performans Değerlendirmesi',
            period: 'Q1 2025',
            startDate: '2025-01-01',
            endDate: '2025-03-31',
            status: 'active',
            participantCount: 0
        },
        {
            id: 2,
            name: '2024 Yıl Sonu Değerlendirmesi',
            period: 'Year-End 2024',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            status: 'completed',
            participantCount: 0
        }
    ]);

    const [showNewCycleModal, setShowNewCycleModal] = useState(false);
    const [newCycle, setNewCycle] = useState({
        name: '',
        period: '',
        startDate: '',
        endDate: '',
        status: 'active'
    });

    // Çalışanları filtrele
    const employees = candidates.filter(c => c.status === 'personel');

    // Tüm OKR'ları topla
    const allOKRs = employees.flatMap(emp =>
        (emp.okrs || []).map(okr => ({
            ...okr,
            employeeName: emp.name,
            employeeEmail: emp.email,
            employeeId: emp.id
        }))
    );

    // Pending approval OKRs
    const pendingOKRs = allOKRs.filter(okr => okr.status === 'pending');

    // Yeni döngü oluştur
    const handleCreateCycle = () => {
        if (!newCycle.name || !newCycle.period || !newCycle.startDate || !newCycle.endDate) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }

        const cycle = {
            id: Date.now(),
            ...newCycle,
            participantCount: employees.length
        };

        setPerformanceCycles([...performanceCycles, cycle]);
        setShowNewCycleModal(false);
        setNewCycle({ name: '', period: '', startDate: '', endDate: '', status: 'active' });
    };

    // OKR onaylama/reddetme
    const handleOKRApproval = (okr, approved) => {
        const updatedCandidates = candidates.map(c => {
            if (c.id === okr.employeeId) {
                const updatedOKRs = c.okrs.map(o => {
                    if (o.id === okr.id) {
                        return {
                            ...o,
                            status: approved ? 'approved' : 'rejected',
                            approvedBy: currentUser?.displayName || currentUser?.email,
                            approvedDate: new Date().toISOString()
                        };
                    }
                    return o;
                });
                return { ...c, okrs: updatedOKRs };
            }
            return c;
        });

        setCandidates(updatedCandidates);
    };

    // Performans değerlendirmesi yap
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showEvaluationModal, setShowEvaluationModal] = useState(false);
    const [evaluation, setEvaluation] = useState({
        cycle: '',
        rating: 0,
        achievements: '',
        improvements: '',
        goals: '',
        comments: ''
    });

    const handleEvaluate = (employee) => {
        setSelectedEmployee(employee);
        setShowEvaluationModal(true);
    };

    const submitEvaluation = () => {
        if (!evaluation.cycle || evaluation.rating === 0) {
            alert('Lütfen döngü seçin ve puan verin.');
            return;
        }

        const newEvaluation = {
            id: Date.now(),
            cycleId: evaluation.cycle,
            cycleName: performanceCycles.find(c => c.id === parseInt(evaluation.cycle))?.name,
            rating: evaluation.rating,
            achievements: evaluation.achievements,
            improvements: evaluation.improvements,
            goals: evaluation.goals,
            comments: evaluation.comments,
            evaluatedBy: currentUser?.displayName || currentUser?.email,
            evaluatedDate: new Date().toISOString()
        };

        const updatedCandidates = candidates.map(c => {
            if (c.id === selectedEmployee.id) {
                return {
                    ...c,
                    performanceEvaluations: [...(c.performanceEvaluations || []), newEvaluation]
                };
            }
            return c;
        });

        setCandidates(updatedCandidates);
        setShowEvaluationModal(false);
        setEvaluation({ cycle: '', rating: 0, achievements: '', improvements: '', goals: '', comments: '' });
        setSelectedEmployee(null);
        alert('Performans değerlendirmesi başarıyla kaydedildi!');
    };

    const statusColors = {
        active: 'bg-green-500/20 text-green-300 border-green-500/30',
        completed: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        draft: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };

    const statusLabels = {
        active: 'Aktif',
        completed: 'Tamamlandı',
        draft: 'Taslak'
    };

    const okrStatusColors = {
        pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        approved: 'bg-green-500/20 text-green-300 border-green-500/30',
        rejected: 'bg-red-500/20 text-red-300 border-red-500/30'
    };

    const okrStatusLabels = {
        pending: 'Onay Bekliyor',
        approved: 'Onaylandı',
        rejected: 'Reddedildi'
    };

    return (
        <div className="space-y-6" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-purple-400" />
                        Performans Yönetimi
                    </h2>
                    <p className="text-gray-400">Çalışan performansını yönetin ve değerlendirin</p>
                </div>
                <button
                    onClick={() => setShowNewCycleModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Döngü Oluştur
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <Calendar className="w-8 h-8 text-purple-400" />
                        <span className="text-2xl font-bold text-white">{performanceCycles.length}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Toplam Döngü</p>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <Users className="w-8 h-8 text-blue-400" />
                        <span className="text-2xl font-bold text-white">{employees.length}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Toplam Çalışan</p>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <Target className="w-8 h-8 text-green-400" />
                        <span className="text-2xl font-bold text-white">{allOKRs.length}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Toplam OKR</p>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <Clock className="w-8 h-8 text-yellow-400" />
                        <span className="text-2xl font-bold text-white">{pendingOKRs.length}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Onay Bekleyen</p>
                </div>
            </div>

            {/* Performance Cycles */}
            <div className="glass p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-purple-400" />
                    Performans Döngüleri
                </h3>
                <div className="space-y-3">
                    {performanceCycles.map((cycle) => (
                        <div key={cycle.id} className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-white font-medium">{cycle.name}</h4>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[cycle.status]}`}>
                                            {statusLabels[cycle.status]}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <span>{cycle.period}</span>
                                        <span>•</span>
                                        <span>{new Date(cycle.startDate).toLocaleDateString('tr-TR')} - {new Date(cycle.endDate).toLocaleDateString('tr-TR')}</span>
                                        <span>•</span>
                                        <span>{employees.length} Katılımcı</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pending OKR Approvals */}
            {pendingOKRs.length > 0 && (
                <div className="glass p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-yellow-400" />
                        Onay Bekleyen OKR'lar ({pendingOKRs.length})
                    </h3>
                    <div className="space-y-3">
                        {pendingOKRs.map((okr) => (
                            <div key={okr.id} className="bg-slate-800/50 p-4 rounded-lg border border-yellow-500/20">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Target className="w-5 h-5 text-yellow-400" />
                                            <h4 className="text-white font-medium">{okr.objective}</h4>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-2">{okr.employeeName}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {okr.keyResults.map((kr, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                                                    {kr}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOKRApproval(okr, true)}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all text-sm flex items-center gap-1"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Onayla
                                        </button>
                                        <button
                                            onClick={() => handleOKRApproval(okr, false)}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all text-sm"
                                        >
                                            Reddet
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Employee Performance Overview */}
            <div className="glass p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="w-6 h-6 text-purple-400" />
                    Çalışan Performansları
                </h3>
                <div className="space-y-3">
                    {employees.map((employee) => {
                        const employeeOKRs = employee.okrs || [];
                        const approvedOKRs = employeeOKRs.filter(o => o.status === 'approved').length;
                        const evaluations = employee.performanceEvaluations || [];
                        const lastEvaluation = evaluations[evaluations.length - 1];

                        return (
                            <div key={employee.id} className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                                            {employee.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-medium">{employee.name}</h4>
                                            <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                                                <span>{employeeOKRs.length} OKR</span>
                                                <span>•</span>
                                                <span>{approvedOKRs} Onaylı</span>
                                                <span>•</span>
                                                <span>{evaluations.length} Değerlendirme</span>
                                                {lastEvaluation && (
                                                    <>
                                                        <span>•</span>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                            <span className="text-yellow-300 font-medium">{lastEvaluation.rating}/5</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleEvaluate(employee)}
                                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all text-sm flex items-center gap-2"
                                    >
                                        <Award className="w-4 h-4" />
                                        Değerlendir
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* New Cycle Modal */}
            {showNewCycleModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="glass max-w-2xl w-full p-6 rounded-2xl">
                        <h3 className="text-2xl font-bold text-white mb-6">Yeni Performans Döngüsü</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">Döngü Adı</label>
                                <input
                                    type="text"
                                    value={newCycle.name}
                                    onChange={(e) => setNewCycle({ ...newCycle, name: e.target.value })}
                                    placeholder="Örn: 2025 Q2 Performans Değerlendirmesi"
                                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">Dönem</label>
                                <input
                                    type="text"
                                    value={newCycle.period}
                                    onChange={(e) => setNewCycle({ ...newCycle, period: e.target.value })}
                                    placeholder="Örn: Q2 2025"
                                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-gray-300 text-sm mb-2 block">Başlangıç Tarihi</label>
                                    <input
                                        type="date"
                                        value={newCycle.startDate}
                                        onChange={(e) => setNewCycle({ ...newCycle, startDate: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-300 text-sm mb-2 block">Bitiş Tarihi</label>
                                    <input
                                        type="date"
                                        value={newCycle.endDate}
                                        onChange={(e) => setNewCycle({ ...newCycle, endDate: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleCreateCycle}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                            >
                                Döngü Oluştur
                            </button>
                            <button
                                onClick={() => setShowNewCycleModal(false)}
                                className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Evaluation Modal */}
            {showEvaluationModal && selectedEmployee && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 overflow-y-auto">
                    <div className="glass max-w-3xl w-full p-6 rounded-2xl my-8">
                        <h3 className="text-2xl font-bold text-white mb-2">Performans Değerlendirmesi</h3>
                        <p className="text-gray-400 mb-6">{selectedEmployee.name}</p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">Döngü Seçin</label>
                                <select
                                    value={evaluation.cycle}
                                    onChange={(e) => setEvaluation({ ...evaluation, cycle: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all"
                                >
                                    <option value="">Döngü seçin...</option>
                                    {performanceCycles.map((cycle) => (
                                        <option key={cycle.id} value={cycle.id}>{cycle.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">Genel Performans Puanı (1-5)</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            onClick={() => setEvaluation({ ...evaluation, rating })}
                                            className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                                                evaluation.rating === rating
                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                                    : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                                            }`}
                                        >
                                            <Star className={`w-6 h-6 mx-auto ${evaluation.rating === rating ? 'fill-white' : ''}`} />
                                            <span className="text-sm mt-1">{rating}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">Başarılar ve Güçlü Yönler</label>
                                <textarea
                                    value={evaluation.achievements}
                                    onChange={(e) => setEvaluation({ ...evaluation, achievements: e.target.value })}
                                    rows="3"
                                    placeholder="Dönem boyunca gösterdiği başarılar..."
                                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">Gelişim Alanları</label>
                                <textarea
                                    value={evaluation.improvements}
                                    onChange={(e) => setEvaluation({ ...evaluation, improvements: e.target.value })}
                                    rows="3"
                                    placeholder="Geliştirilmesi gereken konular..."
                                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">Gelecek Dönem Hedefleri</label>
                                <textarea
                                    value={evaluation.goals}
                                    onChange={(e) => setEvaluation({ ...evaluation, goals: e.target.value })}
                                    rows="3"
                                    placeholder="Önümüzdeki dönem için hedefler..."
                                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">Ek Yorumlar</label>
                                <textarea
                                    value={evaluation.comments}
                                    onChange={(e) => setEvaluation({ ...evaluation, comments: e.target.value })}
                                    rows="3"
                                    placeholder="Genel yorumlar ve notlar..."
                                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={submitEvaluation}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Award className="w-5 h-5" />
                                Değerlendirmeyi Kaydet
                            </button>
                            <button
                                onClick={() => {
                                    setShowEvaluationModal(false);
                                    setSelectedEmployee(null);
                                    setEvaluation({ cycle: '', rating: 0, achievements: '', improvements: '', goals: '', comments: '' });
                                }}
                                className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PerformanceAdmin;
