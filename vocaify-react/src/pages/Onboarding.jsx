import React, { useState, useEffect } from 'react';
import { UserPlus, CheckCircle, Circle, Calendar, User, TrendingUp, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

/**
 * Employee Onboarding Modülü
 * Yeni işe alınan personelin işe başlama sürecini yönetir
 * AŞAMA 18
 */
function Onboarding() {
    const { candidates, setCandidates } = useApp();
    const { currentUser } = useAuth();
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Varsayılan onboarding checklist
    const DEFAULT_CHECKLIST = [
        { id: 1, task: 'Sözleşme İmzalandı', completed: false, completedBy: '', completedDate: '' },
        { id: 2, task: 'IT Hesapları Oluşturuldu', completed: false, completedBy: '', completedDate: '' },
        { id: 3, task: 'Ekipman (Bilgisayar, Telefon) Hazırlandı', completed: false, completedBy: '', completedDate: '' },
        { id: 4, task: 'İlk Gün Oryantasyonu Tamamlandı', completed: false, completedBy: '', completedDate: '' },
        { id: 5, task: 'Ekip Tanışması Planlandı', completed: false, completedBy: '', completedDate: '' },
        { id: 6, task: 'Departman Eğitimi Verildi', completed: false, completedBy: '', completedDate: '' }
    ];

    // Personel statüsündeki çalışanları filtrele
    const employees = candidates.filter(c => c.status === 'personel');

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
                                    <div className="grid grid-cols-2 gap-4 text-sm">
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
                                                        <p className={`font-medium ${
                                                            item.completed ? 'text-green-300 line-through' : 'text-white'
                                                        }`}>
                                                            {item.task}
                                                        </p>
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
            )}
        </div>
    );
}

export default Onboarding;
