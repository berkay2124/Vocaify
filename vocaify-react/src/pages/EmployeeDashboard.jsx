import React, { useState } from 'react';
import { User, Calendar, DollarSign, CheckCircle, Circle, LogOut, FileText, Clock, MessageSquare, Target, Star, Briefcase, Heart, Award, TrendingUp, Loader, Receipt, Upload, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import MyPerformance from './MyPerformance';
import CareerOpportunities from './CareerOpportunities';
import Kudos from './Kudos';
import AIChatbot from '../components/AIChatbot';
import { generateCareerPath } from '../utils/aiAnalyzer';

/**
 * Employee Self-Service Portal (ESS)
 * Çalışanların kendi bilgilerini yönetebileceği portal
 * AŞAMA 20
 */
function EmployeeDashboard() {
    const { currentUser, logout } = useAuth();
    const { candidates, setCandidates, expenses, addExpenseClaim } = useApp();
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

    // AŞAMA 30: Kariyer Yolu state
    const [targetRole, setTargetRole] = useState('');
    const [careerPath, setCareerPath] = useState(null);
    const [loadingCareerPath, setLoadingCareerPath] = useState(false);

    // AŞAMA 33: Gider Talebi state
    const [expenseForm, setExpenseForm] = useState({
        type: 'Ulaşım',
        amount: '',
        description: '',
        receipt: null
    });
    const [expenseSubmitted, setExpenseSubmitted] = useState(false);

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

    // AŞAMA 30: Kariyer yolu oluştur
    const handleGenerateCareerPath = async () => {
        if (!targetRole.trim()) {
            alert('Lütfen hedef rolünüzü girin.');
            return;
        }

        if (!employeeRecord) {
            alert('Çalışan kaydınız bulunamadı.');
            return;
        }

        setLoadingCareerPath(true);
        try {
            console.log('🎯 Kariyer yolu oluşturuluyor...');
            const result = await generateCareerPath(employeeRecord, targetRole);

            if (result.success) {
                setCareerPath(result);
                console.log('✅ Kariyer yolu oluşturuldu');
            } else {
                alert(result.message || 'Kariyer yolu oluşturulamadı.');
            }
        } catch (error) {
            console.error('Kariyer yolu hatası:', error);
            alert('Bir hata oluştu.');
        } finally {
            setLoadingCareerPath(false);
        }
    };

    // AŞAMA 33: Gider talebi gönder
    const handleExpenseSubmit = (e) => {
        e.preventDefault();

        if (!expenseForm.amount || parseFloat(expenseForm.amount) <= 0) {
            alert('Lütfen geçerli bir tutar girin.');
            return;
        }

        if (!expenseForm.description.trim()) {
            alert('Lütfen açıklama girin.');
            return;
        }

        // Yeni gider talebi oluştur
        addExpenseClaim({
            type: expenseForm.type,
            amount: expenseForm.amount,
            description: expenseForm.description,
            receipt: expenseForm.receipt
        });

        // Formu sıfırla
        setExpenseForm({
            type: 'Ulaşım',
            amount: '',
            description: '',
            receipt: null
        });

        setExpenseSubmitted(true);
        setTimeout(() => setExpenseSubmitted(false), 3000);

        alert('Gider talebiniz başarıyla gönderildi!');
    };

    // Çalışanın kendi gider talepleri
    const myExpenses = expenses.filter(exp => exp.employeeId === currentUser?.uid);

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
                        { id: 'expenses', label: 'Giderlerim', icon: Receipt },
                        { id: 'performance', label: 'Performansım', icon: Target },
                        { id: 'surveys', label: 'Anketlerim', icon: MessageSquare },
                        { id: 'kudos', label: 'Kudos (Takdir)', icon: Heart },
                        { id: 'mycareer', label: 'Kariyerim', icon: TrendingUp },
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

                            {/* Badges Display - AŞAMA 26 */}
                            {employeeRecord?.badges && employeeRecord.badges.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-purple-500/20">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <Award className="w-5 h-5 text-yellow-400" />
                                        Kazandığım Rozetler
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {employeeRecord.badges.map((badge, idx) => (
                                            <div
                                                key={idx}
                                                className={`bg-gradient-to-br ${badge.color || 'from-purple-500 to-pink-500'} rounded-xl p-4 text-center`}
                                            >
                                                <div className="text-3xl mb-2">{badge.icon || '🏅'}</div>
                                                <div className="text-white font-bold text-sm">{badge.name}</div>
                                                <div className="text-white/70 text-xs mt-1">
                                                    {new Date(badge.earnedDate).toLocaleDateString('tr-TR')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recent Kudos Display - AŞAMA 26 */}
                            {employeeRecord?.kudosReceived && employeeRecord.kudosReceived.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-purple-500/20">
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <Heart className="w-5 h-5 text-pink-400" />
                                        Son Aldığım Kudoslar ({employeeRecord.kudosReceived.length})
                                    </h3>
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {employeeRecord.kudosReceived.slice(0, 5).map((kudos, idx) => (
                                            <div key={idx} className="bg-slate-800/50 rounded-lg p-3 border border-purple-500/20">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xl">{kudos.categoryIcon || '👏'}</span>
                                                    <span className="text-purple-400 font-medium text-sm">{kudos.categoryLabel}</span>
                                                </div>
                                                <div className="text-white text-sm mb-1">
                                                    <strong>{kudos.senderName}</strong> seni takdir etti
                                                </div>
                                                <p className="text-gray-400 text-xs">{kudos.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {employeeRecord.kudosReceived.length > 5 && (
                                        <button
                                            onClick={() => setActiveSection('kudos')}
                                            className="mt-3 text-purple-400 hover:text-purple-300 text-sm font-medium"
                                        >
                                            Tümünü Gör ({employeeRecord.kudosReceived.length} kudos) →
                                        </button>
                                    )}
                                </div>
                            )}

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

                    {/* AŞAMA 33: Gider Talebi Bölümü */}
                    {activeSection === 'expenses' && (
                        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                            {/* Yeni Gider Talebi Formu */}
                            <div className="glass p-6 rounded-2xl mb-6">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Receipt className="w-6 h-6 text-green-400" />
                                    Yeni Gider Talebi
                                </h2>

                                {expenseSubmitted ? (
                                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 text-center">
                                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                                        <p className="text-green-300 font-medium">Gider talebiniz başarıyla gönderildi!</p>
                                        <p className="text-gray-400 text-sm mt-2">İK departmanı tarafından incelenecektir.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleExpenseSubmit} className="space-y-4">
                                        <div>
                                            <label className="text-gray-300 text-sm mb-2 block">Gider Tipi *</label>
                                            <select
                                                value={expenseForm.type}
                                                onChange={(e) => setExpenseForm({ ...expenseForm, type: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-green-500/30 focus:border-green-500 transition-all"
                                            >
                                                <option value="Ulaşım">🚗 Ulaşım</option>
                                                <option value="Yemek">🍽️ Yemek</option>
                                                <option value="Konaklama">🏨 Konaklama</option>
                                                <option value="Eğitim">📚 Eğitim</option>
                                                <option value="Ekipman">💻 Ekipman</option>
                                                <option value="Diğer">📄 Diğer</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-gray-300 text-sm mb-2 block">Tutar (₺) *</label>
                                            <input
                                                type="number"
                                                value={expenseForm.amount}
                                                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                                                placeholder="Örn: 250"
                                                min="0"
                                                step="0.01"
                                                className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-green-500/30 focus:border-green-500 transition-all"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="text-gray-300 text-sm mb-2 block">Açıklama *</label>
                                            <textarea
                                                value={expenseForm.description}
                                                onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                                                rows="3"
                                                className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-green-500/30 focus:border-green-500 transition-all resize-none"
                                                placeholder="Gider detayını açıklayın... (Örn: İstanbul - Ankara uçak bileti)"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="text-gray-300 text-sm mb-2 block">
                                                Makbuz/Fatura (Simüle)
                                            </label>
                                            <div className="border-2 border-dashed border-green-500/30 rounded-lg p-6 text-center bg-slate-800/30">
                                                <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                                                <p className="text-gray-400 text-sm mb-2">
                                                    Makbuz yükleme özelliği simüle edilmiştir
                                                </p>
                                                <p className="text-gray-500 text-xs">
                                                    Gerçek sistemde buradan PDF/JPG yükleyebilirsiniz
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            <Receipt className="w-5 h-5" />
                                            Gider Talebini Gönder
                                        </button>
                                    </form>
                                )}
                            </div>

                            {/* Gider Geçmişi */}
                            <div className="glass p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-green-400" />
                                    Gider Taleplerim
                                </h3>

                                {myExpenses.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Receipt className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                        <p className="text-gray-400">Henüz gider talebiniz bulunmuyor.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {myExpenses.map((expense) => {
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

                                            const statusIcons = {
                                                pending: <Clock className="w-4 h-4" />,
                                                approved: <CheckCircle className="w-4 h-4" />,
                                                rejected: <XCircle className="w-4 h-4" />
                                            };

                                            return (
                                                <div key={expense.id} className="bg-slate-800/50 p-4 rounded-lg border border-green-500/20">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-xl">{
                                                                    expense.type === 'Ulaşım' ? '🚗' :
                                                                    expense.type === 'Yemek' ? '🍽️' :
                                                                    expense.type === 'Konaklama' ? '🏨' :
                                                                    expense.type === 'Eğitim' ? '📚' :
                                                                    expense.type === 'Ekipman' ? '💻' : '📄'
                                                                }</span>
                                                                <span className="text-white font-medium">{expense.type}</span>
                                                            </div>
                                                            <p className="text-white text-2xl font-bold mb-1">
                                                                {expense.amount.toLocaleString('tr-TR')} ₺
                                                            </p>
                                                            <p className="text-gray-400 text-sm mb-2">{expense.description}</p>
                                                            <p className="text-gray-500 text-xs">
                                                                Tarih: {new Date(expense.submitDate).toLocaleDateString('tr-TR', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${statusColors[expense.status]}`}>
                                                            {statusIcons[expense.status]}
                                                            {statusLabels[expense.status]}
                                                        </div>
                                                    </div>

                                                    {expense.reviewedBy && (
                                                        <div className="pt-3 border-t border-slate-700/50">
                                                            <p className="text-gray-500 text-xs mb-1">
                                                                İnceleyen: <span className="text-gray-400">{expense.reviewedBy}</span>
                                                                {expense.reviewDate && (
                                                                    <span className="ml-2">
                                                                        ({new Date(expense.reviewDate).toLocaleDateString('tr-TR')})
                                                                    </span>
                                                                )}
                                                            </p>
                                                            {expense.reviewNote && (
                                                                <p className="text-gray-400 text-xs mt-1">
                                                                    Not: {expense.reviewNote}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Özet İstatistikler */}
                                {myExpenses.length > 0 && (
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                            <p className="text-gray-400 text-xs mb-1">Bekleyen</p>
                                            <p className="text-white text-xl font-bold">
                                                {myExpenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0).toLocaleString('tr-TR')} ₺
                                            </p>
                                        </div>
                                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                                            <p className="text-gray-400 text-xs mb-1">Onaylanan</p>
                                            <p className="text-white text-xl font-bold">
                                                {myExpenses.filter(e => e.status === 'approved').reduce((sum, e) => sum + e.amount, 0).toLocaleString('tr-TR')} ₺
                                            </p>
                                        </div>
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                            <p className="text-gray-400 text-xs mb-1">Reddedilen</p>
                                            <p className="text-white text-xl font-bold">
                                                {myExpenses.filter(e => e.status === 'rejected').reduce((sum, e) => sum + e.amount, 0).toLocaleString('tr-TR')} ₺
                                            </p>
                                        </div>
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

                    {/* Kudos Bölümü - AŞAMA 26 */}
                    {activeSection === 'kudos' && (
                        <Kudos />
                    )}

                    {/* Kariyerim Bölümü - AŞAMA 30 */}
                    {activeSection === 'mycareer' && (
                        <div className="glass p-6 rounded-2xl" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <TrendingUp className="w-7 h-7 text-green-400" />
                                Kariyerim - AI Gelişim Yolu
                            </h2>

                            {/* Mevcut Durum Kartı */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-6 rounded-xl border border-blue-500/30">
                                    <div className="flex items-center gap-3 mb-3">
                                        <User className="w-6 h-6 text-blue-400" />
                                        <h3 className="text-lg font-bold text-white">Mevcut Rolüm</h3>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-300">
                                        {employeeRecord?.analysis?.position || employeeRecord?.position || 'Belirtilmemiş'}
                                    </p>
                                    <p className="text-gray-400 text-sm mt-2">
                                        {employeeRecord?.analysis?.experience_years || 0} yıl deneyim
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-6 rounded-xl border border-purple-500/30">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Target className="w-6 h-6 text-purple-400" />
                                        <h3 className="text-lg font-bold text-white">Performansım</h3>
                                    </div>
                                    <p className="text-2xl font-bold text-purple-300">
                                        {employeeRecord?.totalKpiScore || 0}/100
                                    </p>
                                    <p className="text-gray-400 text-sm mt-2">
                                        {employeeRecord?.performanceLevel || 'Henüz değerlendirilmedi'}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 p-6 rounded-xl border border-green-500/30">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Star className="w-6 h-6 text-green-400" />
                                        <h3 className="text-lg font-bold text-white">Becerilerim</h3>
                                    </div>
                                    <p className="text-2xl font-bold text-green-300">
                                        {employeeRecord?.analysis?.skills?.length || 0} beceri
                                    </p>
                                    <p className="text-gray-400 text-sm mt-2">
                                        {employeeRecord?.badges?.length || 0} rozet kazandım
                                    </p>
                                </div>
                            </div>

                            {/* Beceriler Listesi */}
                            {employeeRecord?.analysis?.skills && employeeRecord.analysis.skills.length > 0 && (
                                <div className="bg-slate-800/50 p-5 rounded-xl border border-purple-500/20 mb-6">
                                    <h3 className="text-lg font-bold text-white mb-3">📚 Mevcut Becerilerim</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {employeeRecord.analysis.skills.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-medium border border-purple-500/30"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Hedef Girişi */}
                            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6 mb-6">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-green-400" />
                                    Kariyer Hedefiniz Nedir?
                                </h3>
                                <p className="text-gray-300 text-sm mb-4">
                                    Ulaşmak istediğiniz rolü yazın ve AI size özel bir gelişim yolu oluştursun.
                                </p>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={targetRole}
                                        onChange={(e) => setTargetRole(e.target.value)}
                                        placeholder="Örn: Kıdemli Yönetici, Senior Developer, Takım Lideri"
                                        className="flex-1 px-4 py-3 bg-slate-700/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
                                        onKeyPress={(e) => e.key === 'Enter' && handleGenerateCareerPath()}
                                    />
                                    <button
                                        onClick={handleGenerateCareerPath}
                                        disabled={loadingCareerPath}
                                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loadingCareerPath ? (
                                            <>
                                                <Loader className="w-5 h-5 animate-spin" />
                                                Oluşturuluyor...
                                            </>
                                        ) : (
                                            <>
                                                <TrendingUp className="w-5 h-5" />
                                                Gelişim Yolu Oluştur
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* AI Kariyer Yolu Sonuçları */}
                            {careerPath && (
                                <div className="space-y-6">
                                    {/* Analiz */}
                                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
                                        <h3 className="text-lg font-bold text-blue-300 mb-3">📊 Durum Analizi</h3>
                                        <p className="text-gray-300">{careerPath.analysis}</p>
                                    </div>

                                    {/* Beceri Boşlukları */}
                                    {careerPath.skillGaps && careerPath.skillGaps.length > 0 && (
                                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5">
                                            <h3 className="text-lg font-bold text-yellow-300 mb-3">⚠️ Geliştirmeniz Gereken Alanlar</h3>
                                            <ul className="space-y-2">
                                                {careerPath.skillGaps.map((gap, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-gray-300">
                                                        <Circle className="w-2 h-2 text-yellow-400 mt-2 flex-shrink-0" />
                                                        <span>{gap}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Gelişim Yolu Adımları */}
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <TrendingUp className="w-7 h-7 text-green-400" />
                                            3 Adımda Gelişim Yolunuz
                                        </h3>
                                        <div className="space-y-4">
                                            {careerPath.developmentPath && careerPath.developmentPath.map((step, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/50 transition-all"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                                                            {step.step}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h4 className="text-xl font-bold text-white">{step.title}</h4>
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                                    step.priority === 'Yüksek'
                                                                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                                                        : step.priority === 'Orta'
                                                                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                                                        : 'bg-green-500/20 text-green-300 border border-green-500/30'
                                                                }`}>
                                                                    {step.priority} Öncelik
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-300 mb-3">
                                                                <strong className="text-purple-300">Ne yapmalısınız:</strong> {step.action}
                                                            </p>
                                                            <p className="text-gray-400 text-sm mb-2">
                                                                <strong className="text-blue-300">Neden önemli:</strong> {step.reason}
                                                            </p>
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Clock className="w-4 h-4 text-green-400" />
                                                                <span className="text-green-300 font-medium">{step.timeline}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Özet Bilgiler */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                                            <p className="text-gray-400 text-sm mb-1">Tahmini Toplam Süre</p>
                                            <p className="text-2xl font-bold text-green-300">{careerPath.estimatedTimeToGoal}</p>
                                        </div>
                                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                                            <p className="text-gray-400 text-sm mb-1">Başarı Olasılığı</p>
                                            <p className="text-2xl font-bold text-purple-300">{careerPath.successProbability}</p>
                                        </div>
                                    </div>

                                    {/* Tavsiye */}
                                    {careerPath.recommendation && (
                                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-5">
                                            <h3 className="text-lg font-bold text-purple-300 mb-3">💡 AI Tavsiyesi</h3>
                                            <p className="text-gray-300">{careerPath.recommendation}</p>
                                        </div>
                                    )}
                                </div>
                            )}
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

            {/* AI Chatbot - AŞAMA 24 */}
            <AIChatbot
                employeeName={employeeRecord?.name || currentUser?.displayName}
                employeeEmail={currentUser?.email}
            />
        </div>
    );
}

export default EmployeeDashboard;
