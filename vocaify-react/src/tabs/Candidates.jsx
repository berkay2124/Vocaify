import React from 'react';
import { Eye, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../data/roles';
import { STATUS_CONFIG, CANDIDATE_STAGES, PLATFORMS } from '../config/constants';
import { formatDate } from '../utils/helpers';

/**
 * Adaylar sekmesini render eder
 * Filtreleme seçenekleri ve aday kartlarını listeler
 */
function Candidates() {
    const {
        candidates,
        filterStatus,
        setFilterStatus,
        filterPlatform,
        setFilterPlatform,
        openModal,
        setCandidates,
        saveToStorage,
        employees,
        setEmployees
    } = useApp();
    const { currentUser } = useAuth();

    // Filtrelenmiş adaylar (rol bazlı + status/platform filtresi)
    const filteredCandidates = candidates.filter(c => {
        // 1. Rol bazlı filtreleme
        if (currentUser) {
            // INTERVIEWER: Sadece kendisine atanan adaylar
            if (currentUser.role === ROLES.INTERVIEWER) {
                const isAssigned = c.assignedInterviewers?.some(
                    interviewer => interviewer.email === currentUser.email
                );
                if (!isAssigned) return false;
            }

            // HIRING_MANAGER: Sadece kendi departmanındaki adaylar
            if (currentUser.role === ROLES.HIRING_MANAGER) {
                if (c.department && currentUser.department && c.department !== currentUser.department) {
                    return false;
                }
            }

            // ADMIN ve RECRUITER: Tüm adayları görebilir (filtreleme yok)
        }

        // 2. Status ve platform filtresi
        const matchStatus = filterStatus === 'all' || c.status === filterStatus;
        const matchPlatform = filterPlatform === 'all' || c.platform === filterPlatform;
        return matchStatus && matchPlatform;
    });

    // Sonraki aşamaya taşı
    const moveToNextStage = (candidateId) => {
        const candidate = candidates.find(c => c.id === candidateId);
        if (!candidate) return;

        const currentStatus = candidate.status;
        const nextStatus = STATUS_CONFIG[currentStatus]?.next;
        if (!nextStatus) return;

        const newHistoryEntry = {
            status: nextStatus,
            date: new Date().toISOString(),
            note: `${STATUS_CONFIG[nextStatus].label} aşamasına geçirildi.`
        };

        if (nextStatus === 'personel') {
            // Adayı Personele Dönüştür
            const newEmployee = {
                ...candidate,
                status: 'personel',
                employeeId: `EMP-${Date.now()}`,
                startDate: candidate.offerDetails?.startDate || new Date().toISOString(),
                statusHistory: [...(candidate.statusHistory || []), newHistoryEntry],
                matchScore: null,
                matchReason: null,
                performanceReviews: []
            };

            setEmployees([newEmployee, ...employees]);
            setCandidates(candidates.filter(c => c.id !== candidateId));
        } else {
            // Adayın statüsünü güncelle
            setCandidates(candidates.map(c =>
                c.id === candidateId
                    ? {
                        ...c,
                        status: nextStatus,
                        statusHistory: [...(c.statusHistory || []), newHistoryEntry]
                    }
                    : c
            ));
        }
    };

    return (
        <div className="space-y-6" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <h2 className="text-3xl font-bold text-white mb-6">Adaylar ({filteredCandidates.length})</h2>

            {/* Filtreler */}
            <div className="glass p-4 rounded-xl flex flex-wrap gap-4">
                <div>
                    <label className="text-gray-300 text-sm mb-2 block">Durum Filtresi</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-slate-700 border border-purple-500/30 rounded-lg text-white"
                    >
                        <option value="all">Tümü</option>
                        {CANDIDATE_STAGES.map(stage => (
                            <option key={stage} value={stage}>
                                {STATUS_CONFIG[stage].label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-gray-300 text-sm mb-2 block">Platform Filtresi</label>
                    <select
                        value={filterPlatform}
                        onChange={(e) => setFilterPlatform(e.target.value)}
                        className="px-4 py-2 bg-slate-700 border border-purple-500/30 rounded-lg text-white"
                    >
                        <option value="all">Tümü</option>
                        {PLATFORMS.map(platform => (
                            <option key={platform} value={platform}>{platform}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Aday Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCandidates.map(candidate => (
                    <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onView={() => openModal('view', candidate)}
                        onMoveNext={() => moveToNextStage(candidate.id)}
                    />
                ))}
                {filteredCandidates.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-400 text-lg">Filtreye uygun aday bulunamadı</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function CandidateCard({ candidate, onView, onMoveNext }) {
    const nextStatus = STATUS_CONFIG[candidate.status]?.next;

    return (
        <div className="glass p-6 rounded-2xl hover:scale-105 transition-transform">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {candidate.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-white font-bold">{candidate.name}</h3>
                        <p className="text-purple-300 text-sm">{candidate.analysis.position}</p>
                    </div>
                </div>
                <span className={`px-3 py-1 ${STATUS_CONFIG[candidate.status].color} text-white text-xs rounded-full font-medium`}>
                    {STATUS_CONFIG[candidate.status].label}
                </span>
            </div>

            <div className="space-y-2 mb-4">
                <p className="text-gray-300 text-sm">
                    <strong>Deneyim:</strong> {candidate.analysis.experience_years} yıl
                </p>
                <p className="text-gray-300 text-sm">
                    <strong>Platform:</strong> {candidate.platform}
                </p>
                <p className="text-gray-300 text-sm">
                    <strong>Yüklenme:</strong> {formatDate(candidate.uploadDate)}
                </p>
                {candidate.totalKpiScore > 0 && (
                    <p className="text-gray-300 text-sm">
                        <strong>KPI Skoru:</strong> {candidate.totalKpiScore}/100
                    </p>
                )}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={onView}
                    className="flex-1 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all flex items-center justify-center gap-2"
                >
                    <Eye className="w-4 h-4" />
                    Detay
                </button>
                {nextStatus && (
                    <button
                        onClick={onMoveNext}
                        className="flex-1 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowRight className="w-4 h-4" />
                        {STATUS_CONFIG[nextStatus].label}
                    </button>
                )}
            </div>
        </div>
    );
}

export default Candidates;
