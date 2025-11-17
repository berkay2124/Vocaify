import React, { useState } from 'react';
import { Target, Plus, Star, Award, TrendingUp, CheckCircle, Clock, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

/**
 * Employee Performance & OKR Management
 * Çalışanların kendi performans hedeflerini yönetmesi
 * AŞAMA 21
 */
function MyPerformance() {
    const { currentUser } = useAuth();
    const { candidates, setCandidates } = useApp();

    // Çalışanın kendi kaydını bul
    const employeeRecord = candidates.find(c => c.email === currentUser?.email && c.status === 'personel');

    // OKR'lar ve değerlendirmeler
    const myOKRs = employeeRecord?.okrs || [];
    const myEvaluations = employeeRecord?.performanceEvaluations || [];

    // Yeni OKR state
    const [showNewOKR, setShowNewOKR] = useState(false);
    const [newOKR, setNewOKR] = useState({
        objective: '',
        keyResults: ['', '', ''],
        targetDate: '',
        progress: 0
    });

    // Key result input handler
    const handleKeyResultChange = (index, value) => {
        const updatedKRs = [...newOKR.keyResults];
        updatedKRs[index] = value;
        setNewOKR({ ...newOKR, keyResults: updatedKRs });
    };

    // OKR oluştur
    const handleCreateOKR = () => {
        if (!newOKR.objective || !newOKR.targetDate) {
            alert('Lütfen hedef ve tarih belirtin.');
            return;
        }

        const filteredKRs = newOKR.keyResults.filter(kr => kr.trim() !== '');
        if (filteredKRs.length === 0) {
            alert('En az bir anahtar sonuç belirtin.');
            return;
        }

        const okr = {
            id: Date.now(),
            objective: newOKR.objective,
            keyResults: filteredKRs,
            targetDate: newOKR.targetDate,
            progress: 0,
            status: 'pending',
            createdDate: new Date().toISOString()
        };

        if (employeeRecord) {
            const updatedCandidates = candidates.map(c => {
                if (c.id === employeeRecord.id) {
                    return {
                        ...c,
                        okrs: [...(c.okrs || []), okr]
                    };
                }
                return c;
            });
            setCandidates(updatedCandidates);
        }

        setShowNewOKR(false);
        setNewOKR({ objective: '', keyResults: ['', '', ''], targetDate: '', progress: 0 });
        alert('OKR başarıyla oluşturuldu! Yönetici onayı bekleniyor.');
    };

    // İlerleme güncelle
    const updateProgress = (okrId, newProgress) => {
        if (!employeeRecord) return;

        const updatedCandidates = candidates.map(c => {
            if (c.id === employeeRecord.id) {
                const updatedOKRs = c.okrs.map(o => {
                    if (o.id === okrId) {
                        return { ...o, progress: newProgress };
                    }
                    return o;
                });
                return { ...c, okrs: updatedOKRs };
            }
            return c;
        });

        setCandidates(updatedCandidates);
    };

    const statusColors = {
        pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        approved: 'bg-green-500/20 text-green-300 border-green-500/30',
        rejected: 'bg-red-500/20 text-red-300 border-red-500/30'
    };

    const statusLabels = {
        pending: 'Onay Bekliyor',
        approved: 'Onaylandı',
        rejected: 'Reddedildi'
    };

    // Ortalama değerlendirme puanı
    const averageRating = myEvaluations.length > 0
        ? (myEvaluations.reduce((sum, ev) => sum + ev.rating, 0) / myEvaluations.length).toFixed(1)
        : 0;

    return (
        <div className="space-y-6" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Target className="w-8 h-8 text-purple-400" />
                        Benim Performansım
                    </h2>
                    <p className="text-gray-400">Hedeflerinizi belirleyin ve ilerlemenizi takip edin</p>
                </div>
                <button
                    onClick={() => setShowNewOKR(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Hedef (OKR)
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <Target className="w-8 h-8 text-purple-400" />
                        <span className="text-2xl font-bold text-white">{myOKRs.length}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Toplam OKR</p>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                        <span className="text-2xl font-bold text-white">
                            {myOKRs.filter(o => o.status === 'approved').length}
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm">Onaylı Hedef</p>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <Star className="w-8 h-8 text-yellow-400" />
                        <span className="text-2xl font-bold text-white">{averageRating}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Ortalama Puan</p>
                </div>
            </div>

            {/* My OKRs */}
            <div className="glass p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-purple-400" />
                    Hedeflerim (OKR - Objectives & Key Results)
                </h3>

                {myOKRs.length === 0 ? (
                    <div className="text-center py-12">
                        <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">Henüz hedef belirlemediniz.</p>
                        <button
                            onClick={() => setShowNewOKR(true)}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all inline-flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            İlk Hedefinizi Oluşturun
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {myOKRs.map((okr) => (
                            <div key={okr.id} className="bg-slate-800/50 p-5 rounded-lg border-2 border-purple-500/20">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="text-white font-medium text-lg">{okr.objective}</h4>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[okr.status]}`}>
                                                {statusLabels[okr.status]}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm">
                                            Hedef Tarih: {new Date(okr.targetDate).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                </div>

                                {/* Key Results */}
                                <div className="mb-4">
                                    <p className="text-gray-300 text-sm font-medium mb-2">Anahtar Sonuçlar:</p>
                                    <ul className="space-y-1">
                                        {okr.keyResults.map((kr, idx) => (
                                            <li key={idx} className="text-gray-400 text-sm flex items-start gap-2">
                                                <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                                <span>{kr}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Progress */}
                                {okr.status === 'approved' && (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-gray-300 text-sm font-medium">İlerleme</p>
                                            <span className="text-purple-300 font-bold">{okr.progress}%</span>
                                        </div>
                                        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-3">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all"
                                                style={{ width: `${okr.progress}%` }}
                                            ></div>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={okr.progress}
                                            onChange={(e) => updateProgress(okr.id, parseInt(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>
                                )}

                                {okr.approvedBy && (
                                    <p className="text-xs text-gray-500 mt-3">
                                        {okr.approvedBy} tarafından {new Date(okr.approvedDate).toLocaleDateString('tr-TR')} tarihinde {okr.status === 'approved' ? 'onaylandı' : 'reddedildi'}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Performance Evaluations */}
            <div className="glass p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-yellow-400" />
                    Performans Değerlendirmelerim
                </h3>

                {myEvaluations.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">Henüz performans değerlendirmeniz bulunmuyor.</p>
                ) : (
                    <div className="space-y-4">
                        {myEvaluations.map((evaluation) => (
                            <div key={evaluation.id} className="bg-slate-800/50 p-5 rounded-lg border border-purple-500/20">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-white font-medium">{evaluation.cycleName}</h4>
                                    <div className="flex items-center gap-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${
                                                    i < evaluation.rating
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-gray-600'
                                                }`}
                                            />
                                        ))}
                                        <span className="text-yellow-300 font-bold ml-2">{evaluation.rating}/5</span>
                                    </div>
                                </div>

                                {evaluation.achievements && (
                                    <div className="mb-3">
                                        <p className="text-green-300 text-sm font-medium mb-1">✓ Başarılar:</p>
                                        <p className="text-gray-400 text-sm">{evaluation.achievements}</p>
                                    </div>
                                )}

                                {evaluation.improvements && (
                                    <div className="mb-3">
                                        <p className="text-blue-300 text-sm font-medium mb-1">↗ Gelişim Alanları:</p>
                                        <p className="text-gray-400 text-sm">{evaluation.improvements}</p>
                                    </div>
                                )}

                                {evaluation.goals && (
                                    <div className="mb-3">
                                        <p className="text-purple-300 text-sm font-medium mb-1">🎯 Gelecek Hedefler:</p>
                                        <p className="text-gray-400 text-sm">{evaluation.goals}</p>
                                    </div>
                                )}

                                {evaluation.comments && (
                                    <div className="mb-3">
                                        <p className="text-gray-300 text-sm font-medium mb-1">💬 Yorumlar:</p>
                                        <p className="text-gray-400 text-sm">{evaluation.comments}</p>
                                    </div>
                                )}

                                <p className="text-xs text-gray-500 mt-3">
                                    {evaluation.evaluatedBy} tarafından {new Date(evaluation.evaluatedDate).toLocaleDateString('tr-TR')} tarihinde değerlendirildi
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* New OKR Modal */}
            {showNewOKR && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="glass max-w-2xl w-full p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white">Yeni OKR Oluştur</h3>
                            <button
                                onClick={() => setShowNewOKR(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">Hedef (Objective)</label>
                                <input
                                    type="text"
                                    value={newOKR.objective}
                                    onChange={(e) => setNewOKR({ ...newOKR, objective: e.target.value })}
                                    placeholder="Örn: Müşteri memnuniyetini %20 artırmak"
                                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all"
                                />
                                <p className="text-gray-400 text-xs mt-1">
                                    Hedef, ulaşmak istediğiniz büyük resimdir. SMART olmalıdır.
                                </p>
                            </div>

                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">Anahtar Sonuçlar (Key Results)</label>
                                <div className="space-y-2">
                                    {newOKR.keyResults.map((kr, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                            <input
                                                type="text"
                                                value={kr}
                                                onChange={(e) => handleKeyResultChange(index, e.target.value)}
                                                placeholder={`Anahtar Sonuç ${index + 1} (opsiyonel)`}
                                                className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-gray-400 text-xs mt-1">
                                    Anahtar sonuçlar, hedefe ulaşmak için ölçülebilir adımlardır.
                                </p>
                            </div>

                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">Hedef Tamamlanma Tarihi</label>
                                <input
                                    type="date"
                                    value={newOKR.targetDate}
                                    onChange={(e) => setNewOKR({ ...newOKR, targetDate: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all"
                                />
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                <p className="text-blue-300 text-sm">
                                    <strong>OKR Nedir?</strong> Objectives and Key Results (Hedefler ve Anahtar Sonuçlar) -
                                    Google, Intel gibi şirketlerin kullandığı hedef belirleme metodolojisidir.
                                    Hedefinizi oluşturduktan sonra yöneticiniz onaylayacaktır.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleCreateOKR}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Target className="w-5 h-5" />
                                OKR Oluştur
                            </button>
                            <button
                                onClick={() => setShowNewOKR(false)}
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

export default MyPerformance;
