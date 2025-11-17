import React, { useState } from 'react';
import { User, Calendar, DollarSign, CheckCircle, Circle, LogOut, FileText, Clock, MessageSquare, Target, Star, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import MyPerformance from './MyPerformance';
import CareerOpportunities from './CareerOpportunities';

/**
 * Employee Self-Service Portal (ESS)
 * Çalışanların kendi bilgilerini yönetebileceği portal
 * AŞAMA 20
 */
function EmployeeDashboard() {
    const { currentUser, logout } = useAuth();
    const { candidates, setCandidates } = useApp();
    const [activeSection, setActiveSection] = useState('profile');

    // Çalışanın kendi kaydını bul
    const employeeRecord = candidates.find(c => c.email === currentUser?.email && c.status === 'personel');

    // Profil bilgileri state
    const [profileData, setProfileData] = useState({
        name: employeeRecord?.name || currentUser?.displayName || '',
        email: currentUser?.email || '',
        phone: employeeRecord?.phone || '',
        address: employeeRecord?.address || '',
        emergencyContact: employeeRecord?.emergencyContact || '',
        emergencyPhone: employeeRecord?.emergencyPhone || ''
    });

    // İzin talebi state
    const [leaveRequest, setLeaveRequest] = useState({
        type: 'annual',
        startDate: '',
        endDate: '',
        reason: ''
    });

    const [leaveRequests, setLeaveRequests] = useState(employeeRecord?.leaveRequests || []);
    const [requestSubmitted, setRequestSubmitted] = useState(false);

    // Profil güncelleme
    const handleProfileUpdate = () => {
        if (employeeRecord) {
            const updatedCandidates = candidates.map(c => {
                if (c.id === employeeRecord.id) {
                    return {
                        ...c,
                        name: profileData.name,
                        phone: profileData.phone,
                        address: profileData.address,
                        emergencyContact: profileData.emergencyContact,
                        emergencyPhone: profileData.emergencyPhone
                    };
                }
                return c;
            });
            setCandidates(updatedCandidates);
            alert('Profil bilgileriniz başarıyla güncellendi!');
        }
    };

    // İzin talebi gönder
    const handleLeaveRequestSubmit = () => {
        if (!leaveRequest.startDate || !leaveRequest.endDate) {
            alert('Lütfen başlangıç ve bitiş tarihlerini seçin.');
            return;
        }

        const newRequest = {
            id: Date.now(),
            type: leaveRequest.type,
            startDate: leaveRequest.startDate,
            endDate: leaveRequest.endDate,
            reason: leaveRequest.reason,
            status: 'pending',
            submittedDate: new Date().toISOString()
        };

        const updatedRequests = [...leaveRequests, newRequest];
        setLeaveRequests(updatedRequests);

        if (employeeRecord) {
            const updatedCandidates = candidates.map(c => {
                if (c.id === employeeRecord.id) {
                    return { ...c, leaveRequests: updatedRequests };
                }
                return c;
            });
            setCandidates(updatedCandidates);
        }

        setRequestSubmitted(true);
        setTimeout(() => {
            setRequestSubmitted(false);
            setLeaveRequest({ type: 'annual', startDate: '', endDate: '', reason: '' });
        }, 2000);
    };

    // Onboarding görevi tamamla (çalışan tarafından)
    const toggleTask = (taskId) => {
        if (!employeeRecord || !employeeRecord.onboardingChecklist) return;

        const updatedChecklist = employeeRecord.onboardingChecklist.map(item => {
            if (item.id === taskId) {
                return {
                    ...item,
                    completed: !item.completed,
                    completedBy: !item.completed ? (currentUser?.displayName || currentUser?.email) : '',
                    completedDate: !item.completed ? new Date().toISOString() : ''
                };
            }
            return item;
        });

        const updatedCandidates = candidates.map(c => {
            if (c.id === employeeRecord.id) {
                return { ...c, onboardingChecklist: updatedChecklist };
            }
            return c;
        });

        setCandidates(updatedCandidates);
    };

    // İzin türü etiketleri
    const leaveTypeLabels = {
        annual: 'Yıllık İzin',
        sick: 'Hastalık İzni',
        personal: 'Mazeret İzni',
        unpaid: 'Ücretsiz İzin'
    };

    // İzin durumu renkleri
    const statusColors = {
        pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        approved: 'bg-green-500/20 text-green-300 border-green-500/30',
        rejected: 'bg-red-500/20 text-red-300 border-red-500/30'
    };

    const statusLabels = {
        pending: 'Beklemede',
        approved: 'Onaylandı',
        rejected: 'Reddedildi'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="glass border-b border-purple-500/20 sticky top-0 z-50 backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Çalışan Portalı</h1>
                            <p className="text-xs text-gray-400">Hoş geldiniz, {currentUser?.displayName || currentUser?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Çıkış
                    </button>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex gap-3 mb-6 overflow-x-auto">
                    {[
                        { id: 'profile', label: 'Benim Profilim', icon: User },
                        { id: 'leave', label: 'İzin Talebi', icon: Calendar },
                        { id: 'performance', label: 'Performansım', icon: Target },
                        { id: 'surveys', label: 'Anketlerim', icon: MessageSquare },
                        { id: 'career', label: 'Kariyer Fırsatları', icon: Briefcase },
                        { id: 'payroll', label: 'Maaş Bordrosu', icon: DollarSign },
                        { id: 'tasks', label: 'Görevlerim', icon: CheckCircle }
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveSection(tab.id)}
                                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                                    activeSection === tab.id
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                        : 'glass text-gray-300 hover:bg-purple-500/10'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {/* Profil Bölümü */}
                    {activeSection === 'profile' && (
                        <div className="glass p-6 rounded-2xl" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <User className="w-6 h-6 text-purple-400" />
                                Benim Profilim
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-gray-300 text-sm mb-2 block">Ad Soyad</label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-300 text-sm mb-2 block">E-posta</label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        disabled
                                        className="w-full px-4 py-3 bg-slate-700 text-gray-400 rounded-lg border border-gray-600 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-300 text-sm mb-2 block">Telefon</label>
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-300 text-sm mb-2 block">Adres</label>
                                    <input
                                        type="text"
                                        value={profileData.address}
                                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-300 text-sm mb-2 block">Acil Durum İletişim Kişisi</label>
                                    <input
                                        type="text"
                                        value={profileData.emergencyContact}
                                        onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-300 text-sm mb-2 block">Acil Durum Telefon</label>
                                    <input
                                        type="tel"
                                        value={profileData.emergencyPhone}
                                        onChange={(e) => setProfileData({ ...profileData, emergencyPhone: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleProfileUpdate}
                                className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                            >
                                Profili Güncelle
                            </button>
                        </div>
                    )}

                    {/* İzin Talebi Bölümü */}
                    {activeSection === 'leave' && (
                        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                            <div className="glass p-6 rounded-2xl mb-6">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Calendar className="w-6 h-6 text-purple-400" />
                                    Yeni İzin Talebi
                                </h2>

                                {requestSubmitted ? (
                                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 text-center">
                                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                                        <p className="text-green-300 font-medium">İzin talebiniz başarıyla gönderildi!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-gray-300 text-sm mb-2 block">İzin Türü</label>
                                            <select
                                                value={leaveRequest.type}
                                                onChange={(e) => setLeaveRequest({ ...leaveRequest, type: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all"
                                            >
                                                <option value="annual">Yıllık İzin</option>
                                                <option value="sick">Hastalık İzni</option>
                                                <option value="personal">Mazeret İzni</option>
                                                <option value="unpaid">Ücretsiz İzin</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-gray-300 text-sm mb-2 block">Başlangıç Tarihi</label>
                                                <input
                                                    type="date"
                                                    value={leaveRequest.startDate}
                                                    onChange={(e) => setLeaveRequest({ ...leaveRequest, startDate: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-gray-300 text-sm mb-2 block">Bitiş Tarihi</label>
                                                <input
                                                    type="date"
                                                    value={leaveRequest.endDate}
                                                    onChange={(e) => setLeaveRequest({ ...leaveRequest, endDate: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-gray-300 text-sm mb-2 block">Açıklama (Opsiyonel)</label>
                                            <textarea
                                                value={leaveRequest.reason}
                                                onChange={(e) => setLeaveRequest({ ...leaveRequest, reason: e.target.value })}
                                                rows="3"
                                                className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all resize-none"
                                                placeholder="İzin sebebinizi açıklayabilirsiniz..."
                                            />
                                        </div>
                                        <button
                                            onClick={handleLeaveRequestSubmit}
                                            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            <Calendar className="w-5 h-5" />
                                            İzin Talebini Gönder
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* İzin Geçmişi */}
                            <div className="glass p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-purple-400" />
                                    İzin Geçmişim
                                </h3>
                                {leaveRequests.length === 0 ? (
                                    <p className="text-gray-400 text-center py-8">Henüz izin talebiniz bulunmuyor.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {leaveRequests.map((request) => (
                                            <div key={request.id} className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-white font-medium">{leaveTypeLabels[request.type]}</span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[request.status]}`}>
                                                        {statusLabels[request.status]}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-sm">
                                                    {new Date(request.startDate).toLocaleDateString('tr-TR')} - {new Date(request.endDate).toLocaleDateString('tr-TR')}
                                                </p>
                                                {request.reason && (
                                                    <p className="text-gray-500 text-xs mt-2">{request.reason}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Maaş Bordrosu Bölümü */}
                    {activeSection === 'payroll' && (
                        <div className="glass p-6 rounded-2xl" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <DollarSign className="w-6 h-6 text-purple-400" />
                                Maaş Bordrosu
                            </h2>
                            <div className="text-center py-12">
                                <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Bordro Sistemi Yakında!</h3>
                                <p className="text-gray-400 mb-6">
                                    Maaş bordrolarınızı görüntüleyebileceğiniz sistem şu anda geliştirilmektedir.
                                </p>
                                <button
                                    onClick={() => alert('Bordro sistemi yakında aktif olacak!')}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all inline-flex items-center gap-2"
                                >
                                    <FileText className="w-5 h-5" />
                                    Bordrolarımı Görüntüle
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Performans Bölümü */}
                    {activeSection === 'performance' && (
                        <MyPerformance />
                    )}

                    {/* Anketlerim Bölümü - AŞAMA 22 */}
                    {activeSection === 'surveys' && (
                        <div className="glass p-6 rounded-2xl" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <MessageSquare className="w-6 h-6 text-purple-400" />
                                Bağlılık Anketlerim
                            </h2>

                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                                <p className="text-blue-300 text-sm">
                                    <strong>🔒 Gizlilik:</strong> Tüm yanıtlarınız anonimdir. Bireysel cevaplarınız kimsenin göremez,
                                    sadece toplu istatistikler İK tarafından değerlendirilir.
                                </p>
                            </div>

                            {/* Demo Anket - Gerçekte backend'den gelecek */}
                            {(() => {
                                const [surveyAnswers, setSurveyAnswers] = useState({});
                                const [completedSurveys, setCompletedSurveys] = useState([]);

                                const demoSurvey = {
                                    id: 1,
                                    name: 'Haftalık Mutluluk Anketi',
                                    description: 'Genel iş memnuniyetinizi ölçmek için haftalık anket',
                                    questions: [
                                        { id: 1, type: 'rating', question: 'Bu hafta işinizden ne kadar mutlusunuz?', required: true },
                                        { id: 2, type: 'rating', question: 'Takım arkadaşlarınızla iletişiminizi nasıl değerlendirirsiniz?', required: true },
                                        { id: 3, type: 'text', question: 'Bu hafta sizi en çok ne motive etti?', required: false }
                                    ]
                                };

                                const handleRatingClick = (questionId, rating) => {
                                    setSurveyAnswers({
                                        ...surveyAnswers,
                                        [questionId]: rating
                                    });
                                };

                                const handleTextChange = (questionId, text) => {
                                    setSurveyAnswers({
                                        ...surveyAnswers,
                                        [questionId]: text
                                    });
                                };

                                const handleSubmitSurvey = () => {
                                    // Zorunlu soruları kontrol et
                                    const requiredQuestions = demoSurvey.questions.filter(q => q.required);
                                    const allAnswered = requiredQuestions.every(q => surveyAnswers[q.id]);

                                    if (!allAnswered) {
                                        alert('Lütfen tüm zorunlu soruları cevaplayın.');
                                        return;
                                    }

                                    // Anketi tamamlandı olarak işaretle
                                    setCompletedSurveys([...completedSurveys, demoSurvey.id]);
                                    setSurveyAnswers({});
                                    alert('Anket yanıtlarınız başarıyla gönderildi! Teşekkür ederiz.');
                                };

                                const isSurveyCompleted = completedSurveys.includes(demoSurvey.id);

                                return (
                                    <div>
                                        {isSurveyCompleted ? (
                                            <div className="text-center py-12">
                                                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                                <h3 className="text-xl font-bold text-white mb-2">Tüm anketleri tamamladınız!</h3>
                                                <p className="text-gray-400">Yeni anketler eklendiğinde burada görünecektir.</p>
                                            </div>
                                        ) : (
                                            <div className="bg-slate-800/50 p-6 rounded-lg border border-purple-500/20">
                                                <h3 className="text-xl font-bold text-white mb-2">{demoSurvey.name}</h3>
                                                <p className="text-gray-400 text-sm mb-6">{demoSurvey.description}</p>

                                                <div className="space-y-6">
                                                    {demoSurvey.questions.map((q, idx) => (
                                                        <div key={q.id} className="bg-slate-900/50 p-4 rounded-lg">
                                                            <div className="flex items-start gap-2 mb-3">
                                                                <span className="text-purple-400 font-bold">{idx + 1}.</span>
                                                                <div className="flex-1">
                                                                    <p className="text-white font-medium">
                                                                        {q.question}
                                                                        {q.required && <span className="text-red-400 ml-1">*</span>}
                                                                    </p>

                                                                    {q.type === 'rating' ? (
                                                                        <div className="flex gap-2 mt-3">
                                                                            {[1, 2, 3, 4, 5].map((rating) => (
                                                                                <button
                                                                                    key={rating}
                                                                                    onClick={() => handleRatingClick(q.id, rating)}
                                                                                    className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                                                                                        surveyAnswers[q.id] === rating
                                                                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                                                                            : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                                                                                    }`}
                                                                                >
                                                                                    <Star className={`w-6 h-6 mx-auto ${surveyAnswers[q.id] === rating ? 'fill-white' : ''}`} />
                                                                                    <span className="text-sm mt-1">{rating}</span>
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <textarea
                                                                            value={surveyAnswers[q.id] || ''}
                                                                            onChange={(e) => handleTextChange(q.id, e.target.value)}
                                                                            rows="3"
                                                                            placeholder="Yanıtınızı buraya yazın..."
                                                                            className="w-full mt-3 px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all resize-none"
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={handleSubmitSurvey}
                                                    className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                    Anketi Gönder
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {/* Kariyer Fırsatları Bölümü - AŞAMA 23 */}
                    {activeSection === 'career' && (
                        <CareerOpportunities />
                    )}

                    {/* Görevlerim Bölümü */}
                    {activeSection === 'tasks' && (
                        <div className="glass p-6 rounded-2xl" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <CheckCircle className="w-6 h-6 text-purple-400" />
                                Onboarding Görevlerim
                            </h2>

                            {!employeeRecord?.onboardingChecklist ? (
                                <p className="text-gray-400 text-center py-8">Henüz size atanmış görev bulunmuyor.</p>
                            ) : (
                                <div className="space-y-3">
                                    {employeeRecord.onboardingChecklist.map((task) => (
                                        <div
                                            key={task.id}
                                            onClick={() => toggleTask(task.id)}
                                            className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                                                task.completed
                                                    ? 'bg-green-500/10 border-green-500/30'
                                                    : 'bg-slate-700/30 border-slate-600 hover:border-purple-500/50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {task.completed ? (
                                                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                                                ) : (
                                                    <Circle className="w-6 h-6 text-gray-500 flex-shrink-0" />
                                                )}
                                                <div className="flex-1">
                                                    <p className={`font-medium ${task.completed ? 'text-green-300 line-through' : 'text-white'}`}>
                                                        {task.task}
                                                    </p>
                                                    {task.completed && task.completedBy && (
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {task.completedBy} tarafından {new Date(task.completedDate).toLocaleDateString('tr-TR')} tarihinde tamamlandı
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {employeeRecord?.onboardingChecklist && employeeRecord.onboardingChecklist.every(t => t.completed) && (
                                <div className="mt-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6 text-center">
                                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                                    <h4 className="text-xl font-bold text-green-300 mb-2">Tebrikler! 🎉</h4>
                                    <p className="text-gray-300">Tüm onboarding görevlerinizi tamamladınız!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EmployeeDashboard;
