import React, { useState, useEffect } from 'react';
import { UserPlus, CheckCircle, Circle, Calendar, User, TrendingUp, Award, Globe, Shield, Mail, FileText, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

/**
 * Employee Onboarding Modülü
 * Yeni işe alınan personelin işe başlama sürecini yönetir
 * AŞAMA 18 + AŞAMA 34: Global Compliance Integration
 */
function Onboarding() {
    const { candidates, setCandidates } = useApp();
    const { currentUser } = useAuth();
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Varsayılan onboarding checklist (AŞAMA 34: Compliance adımları eklendi)
    const DEFAULT_CHECKLIST = [
        { id: 1, task: 'Sözleşme İmzalandı', completed: false, completedBy: '', completedDate: '', category: 'legal' },
        { id: 2, task: 'Yasal Evraklar Tamamlandı (Compliance Docs)', completed: false, completedBy: '', completedDate: '', category: 'compliance' },
        { id: 3, task: 'KVKK/GDPR Bildirimi Yapıldı', completed: false, completedBy: '', completedDate: '', category: 'compliance' },
        { id: 4, task: 'Hoş Geldin E-postası Gönderildi (AI Generated)', completed: false, completedBy: '', completedDate: '', category: 'communication' },
        { id: 5, task: 'IT Hesapları Oluşturuldu', completed: false, completedBy: '', completedDate: '', category: 'technical' },
        { id: 6, task: 'Ekipman (Bilgisayar, Telefon) Hazırlandı', completed: false, completedBy: '', completedDate: '', category: 'technical' },
        { id: 7, task: 'İlk Gün Oryantasyonu Tamamlandı', completed: false, completedBy: '', completedDate: '', category: 'onboarding' },
        { id: 8, task: 'Ekip Tanışması Planlandı', completed: false, completedBy: '', completedDate: '', category: 'onboarding' },
        { id: 9, task: 'Departman Eğitimi Verildi', completed: false, completedBy: '', completedDate: '', category: 'training' },
        { id: 10, task: 'İş Sağlığı ve Güvenliği Eğitimi Tamamlandı', completed: false, completedBy: '', completedDate: '', category: 'compliance' }
    ];

    // Personel statüsündeki çalışanları filtrele
    const employees = candidates.filter(c => c.status === 'personel');

    // AŞAMA 34: Compliance requirements based on country
    const getComplianceRequirements = (country) => {
        const requirements = {
            'Türkiye': {
                law: 'KVKK (Kişisel Verilerin Korunması Kanunu)',
                color: 'from-red-600 to-orange-600',
                icon: '🇹🇷',
                checklist: [
                    'KVKK Aydınlatma Metni İmzalatıldı',
                    'Kişisel veri işleme izni alındı',
                    'İş sözleşmesi noter onaylı'
                ]
            },
            'Almanya': {
                law: 'GDPR (General Data Protection Regulation)',
                color: 'from-yellow-600 to-amber-600',
                icon: '🇩🇪',
                checklist: [
                    'GDPR uyumluluğu sağlandı',
                    'Veri işleme sözleşmesi imzalandı',
                    'Çalışan hakları bildirimi yapıldı'
                ]
            },
            'ABD': {
                law: 'Employment Laws (State-specific)',
                color: 'from-blue-600 to-cyan-600',
                icon: '🇺🇸',
                checklist: [
                    'I-9 formu tamamlandı',
                    'W-4 formu dolduruldu',
                    'State-specific compliance sağlandı'
                ]
            },
            'İngiltere': {
                law: 'UK GDPR & Employment Law',
                color: 'from-indigo-600 to-purple-600',
                icon: '🇬🇧',
                checklist: [
                    'UK GDPR uyumluluğu sağlandı',
                    'Right to Work belgesi kontrol edildi',
                    'Employment contract imzalandı'
                ]
            },
            'Fransa': {
                law: 'GDPR & French Labor Code',
                color: 'from-blue-600 to-indigo-600',
                icon: '🇫🇷',
                checklist: [
                    'GDPR uyumluluğu',
                    'Code du Travail gereklilikleri',
                    'Medical examination tamamlandı'
                ]
            }
        };

        return requirements[country] || {
            law: 'General Compliance',
            color: 'from-gray-600 to-slate-600',
            icon: '🌍',
            checklist: [
                'Yerel yasalara uygunluk kontrol edildi',
                'İş sözleşmesi imzalandı',
                'Şirket politikaları kabul edildi'
            ]
        };
    };

    // Seçilen personelin checklist'ini otomatik oluştur (eğer yoksa)
    useEffect(() => {
        if (selectedEmployee && !selectedEmployee.onboardingChecklist) {
            const updatedCandidates = candidates.map(c => {
                if (c.id === selectedEmployee.id) {
                    const updated = {
                        ...c,
                        onboardingChecklist: DEFAULT_CHECKLIST,
                        onboardingStartDate: new Date().toISOString()
                    };
                    setSelectedEmployee(updated);
                    return updated;
                }
                return c;
            });
            setCandidates(updatedCandidates);
        }
    }, [selectedEmployee]);

    // Checklist item'ı tamamlandı olarak işaretle
    const toggleChecklistItem = (itemId) => {
        if (!selectedEmployee) return;

        const updatedChecklist = selectedEmployee.onboardingChecklist.map(item => {
            if (item.id === itemId) {
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
            if (c.id === selectedEmployee.id) {
                const updated = { ...c, onboardingChecklist: updatedChecklist };
                setSelectedEmployee(updated);
                return updated;
            }
            return c;
        });

        setCandidates(updatedCandidates);
    };

    // Progress hesaplama
    const calculateProgress = (employee) => {
        if (!employee.onboardingChecklist) return 0;
        const completed = employee.onboardingChecklist.filter(item => item.completed).length;
        const total = employee.onboardingChecklist.length;
        return Math.round((completed / total) * 100);
    };

    // Onboarding tamamlanma durumu
    const isOnboardingComplete = (employee) => {
        return calculateProgress(employee) === 100;
    };

    return (
        <div className="space-y-6" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <UserPlus className="w-8 h-8 text-purple-400" />
                        Employee Onboarding
                    </h2>
                    <p className="text-gray-400">Yeni personelin işe başlama sürecini yönetin ve takip edin</p>
                </div>
                <div className="glass px-6 py-3 rounded-lg">
                    <p className="text-gray-400 text-sm">Toplam Yeni Personel</p>
                    <p className="text-3xl font-bold text-white">{employees.length}</p>
                </div>
            </div>

            {employees.length === 0 ? (
                <div className="glass p-12 rounded-2xl text-center">
                    <UserPlus className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Henüz Yeni Personel Yok</h3>
                    <p className="text-gray-400">
                        Bir aday "Personel" statüsüne taşındığında, onboarding süreci otomatik olarak başlatılır.
                    </p>
                </div>
            ) : (
                <>
                    {/* AŞAMA 34: Global Compliance Overview Widget */}
                    <div className="glass p-6 rounded-2xl border-2 border-blue-500/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl">
                                <Globe className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    Global Compliance Overview
                                    <Shield className="w-5 h-5 text-blue-400" />
                                </h3>
                                <p className="text-gray-400 text-sm">Ülke bazlı yasal gereklilikler ve uyum durumu</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {['Türkiye', 'Almanya', 'ABD', 'İngiltere', 'Fransa'].map((country) => {
                                const employeesInCountry = employees.filter(e => (e.country || 'Türkiye') === country);
                                const compliance = getComplianceRequirements(country);

                                if (employeesInCountry.length === 0) return null;

                                return (
                                    <div key={country} className={`bg-gradient-to-br ${compliance.color}/10 border border-${compliance.color.split('-')[1]}/30 rounded-lg p-4`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-2xl">{compliance.icon}</span>
                                            <div>
                                                <p className="text-white font-bold text-sm">{country}</p>
                                                <p className="text-gray-400 text-xs">{employeesInCountry.length} çalışan</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-700/50">
                                            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                                                <Shield className="w-3 h-3" />
                                                Gerekli:
                                            </p>
                                            <p className="text-xs text-white font-medium">{compliance.law}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Compliance Warnings */}
                        {employees.some(e => !e.country) && (
                            <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-yellow-300 font-medium text-sm mb-1">Uyarı: Eksik Ülke Bilgisi</p>
                                    <p className="text-gray-400 text-xs">
                                        {employees.filter(e => !e.country).length} çalışanın ülke bilgisi eksik.
                                        Yasal uyumluluk için lütfen güncelleyin.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sol: Personel Listesi */}
                    <div className="glass p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Yeni Personel ({employees.length})
                        </h3>
                        <div className="space-y-3">
                            {employees.map((employee) => {
                                const progress = calculateProgress(employee);
                                const isComplete = isOnboardingComplete(employee);
                                return (
                                    <div
                                        key={employee.id}
                                        onClick={() => setSelectedEmployee(employee)}
                                        className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                                            selectedEmployee?.id === employee.id
                                                ? 'bg-purple-500/20 border-purple-500'
                                                : 'bg-slate-700/30 border-slate-600 hover:border-purple-500/50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                                                isComplete ? 'bg-green-600' : 'gradient-bg'
                                            }`}>
                                                {employee.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-medium text-sm">{employee.name}</p>
                                                <p className="text-gray-400 text-xs">{employee.analysis.position}</p>
                                            </div>
                                            {isComplete && (
                                                <CheckCircle className="w-5 h-5 text-green-400" />
                                            )}
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs text-gray-400">İlerleme</span>
                                                <span className="text-xs font-bold text-purple-300">{progress}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all ${
                                                        isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-purple-600 to-pink-600'
                                                    }`}
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <Calendar className="w-3 h-3" />
                                            {employee.startDate
                                                ? new Date(employee.startDate).toLocaleDateString('tr-TR')
                                                : 'Başlangıç tarihi belirtilmemiş'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sağ: Onboarding Checklist */}
                    <div className="lg:col-span-2 glass p-6 rounded-2xl">
                        {!selectedEmployee ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <UserPlus className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                    <p className="text-gray-400">
                                        Onboarding görevlerini görmek için soldan bir personel seçin
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Personel Bilgisi */}
                                <div className="border-b border-purple-500/20 pb-4">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl ${
                                            isOnboardingComplete(selectedEmployee) ? 'bg-green-600' : 'gradient-bg'
                                        }`}>
                                            {selectedEmployee.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-white">{selectedEmployee.name}</h3>
                                            <p className="text-purple-300">{selectedEmployee.analysis.position}</p>
                                        </div>
                                        {isOnboardingComplete(selectedEmployee) && (
                                            <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-lg">
                                                <Award className="w-5 h-5 text-green-400" />
                                                <span className="text-green-300 font-medium">Tamamlandı!</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-400">İşe Başlama Tarihi</p>
                                            <p className="text-white font-medium">
                                                {selectedEmployee.startDate
                                                    ? new Date(selectedEmployee.startDate).toLocaleDateString('tr-TR')
                                                    : 'Belirtilmemiş'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Onboarding İlerlemesi</p>
                                            <p className="text-white font-medium">{calculateProgress(selectedEmployee)}%</p>
                                        </div>
                                        {/* AŞAMA 34: Country & Legal Status */}
                                        <div>
                                            <p className="text-gray-400 flex items-center gap-1">
                                                <Globe className="w-3 h-3" />
                                                Ülke
                                            </p>
                                            <p className="text-white font-medium">
                                                {getComplianceRequirements(selectedEmployee.country || 'Türkiye').icon} {selectedEmployee.country || 'Türkiye'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 flex items-center gap-1">
                                                <FileText className="w-3 h-3" />
                                                Çalışma Şekli
                                            </p>
                                            <p className="text-white font-medium">
                                                {selectedEmployee.legalStatus === 'Remote' ? '🏠 Uzaktan' :
                                                 selectedEmployee.legalStatus === 'Hybrid' ? '🔄 Hibrit' :
                                                 '🏢 Ofis'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* AŞAMA 34: Compliance Requirements for this Country */}
                                    <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Shield className="w-4 h-4 text-blue-400" />
                                            <p className="text-white font-medium text-sm">
                                                Yasal Gereklilikler: {getComplianceRequirements(selectedEmployee.country || 'Türkiye').law}
                                            </p>
                                        </div>
                                        <ul className="space-y-1">
                                            {getComplianceRequirements(selectedEmployee.country || 'Türkiye').checklist.map((item, idx) => (
                                                <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                                                    <CheckCircle className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Checklist */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <TrendingUp className="w-5 h-5 text-purple-400" />
                                        <h4 className="text-lg font-bold text-white">Onboarding Görevleri</h4>
                                    </div>

                                    <div className="space-y-3">
                                        {selectedEmployee.onboardingChecklist && selectedEmployee.onboardingChecklist.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => toggleChecklistItem(item.id)}
                                                className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                                                    item.completed
                                                        ? 'bg-green-500/10 border-green-500/30'
                                                        : 'bg-slate-700/30 border-slate-600 hover:border-purple-500/50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {item.completed ? (
                                                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                                                    ) : (
                                                        <Circle className="w-6 h-6 text-gray-500 flex-shrink-0" />
                                                    )}
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className={`font-medium ${
                                                                item.completed ? 'text-green-300 line-through' : 'text-white'
                                                            }`}>
                                                                {item.task}
                                                            </p>
                                                            {/* AŞAMA 34: Category Badge */}
                                                            {item.category === 'compliance' && (
                                                                <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-300 flex items-center gap-1">
                                                                    <Shield className="w-3 h-3" />
                                                                    Uyumluluk
                                                                </span>
                                                            )}
                                                            {item.category === 'communication' && (
                                                                <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300 flex items-center gap-1">
                                                                    <Mail className="w-3 h-3" />
                                                                    İletişim
                                                                </span>
                                                            )}
                                                        </div>
                                                        {item.completed && item.completedBy && (
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {item.completedBy} tarafından {new Date(item.completedDate).toLocaleDateString('tr-TR')} tarihinde tamamlandı
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Onboarding Tamamlandı Mesajı */}
                                {isOnboardingComplete(selectedEmployee) && (
                                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6 text-center">
                                        <Award className="w-12 h-12 text-green-400 mx-auto mb-3" />
                                        <h4 className="text-xl font-bold text-green-300 mb-2">
                                            Onboarding Tamamlandı! 🎉
                                        </h4>
                                        <p className="text-gray-300">
                                            {selectedEmployee.name} başarıyla işe alım sürecini tamamladı ve ekibe katıldı.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                </>
            )}
        </div>
    );
}

export default Onboarding;
