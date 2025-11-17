import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
    loadFromFirestore,
    addCandidate as addCandidateToFirestore,
    addEmployee as addEmployeeToFirestore,
    updateCandidateInFirestore,
    updateEmployeeInFirestore,
    moveCandidateToEmployee,
    clearAllDataInFirestore
} from '../utils/dataManager';

const AppContext = createContext();

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}

export function AppProvider({ children }) {
    const { currentUser } = useAuth();

    // State
    const [activeTab, setActiveTab] = useState('dashboard');
    const [candidates, setCandidates] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [expenses, setExpenses] = useState([]); // AŞAMA 33: Gider talepleri
    const [exitInterviews, setExitInterviews] = useState([]); // AŞAMA 35: Exit Interview verileri
    const [notificationSettings, setNotificationSettings] = useState({ // AŞAMA 36: Slack/Teams bildirim ayarları
        slack: { enabled: false, webhookUrl: '', channel: '#hr-notifications', connected: false },
        teams: { enabled: false, webhookUrl: '', channel: 'HR Team', connected: false }
    });
    const [notificationHistory, setNotificationHistory] = useState([]); // AŞAMA 36: Bildirim geçmişi
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [modalTab, setModalTab] = useState('detay');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPlatform, setFilterPlatform] = useState('all');

    /**
     * Kullanıcı değiştiğinde Firestore'dan verileri yükle
     */
    useEffect(() => {
        if (currentUser) {
            loadDataFromFirestore();
        } else {
            setCandidates([]);
            setEmployees([]);
            setDataLoading(false);
        }
    }, [currentUser]);

    /**
     * Firestore'dan verileri yükle
     */
    const loadDataFromFirestore = async () => {
        if (!currentUser) return;

        try {
            setDataLoading(true);
            const data = await loadFromFirestore(currentUser.uid);
            setCandidates(data.candidates);
            setEmployees(data.employees);
        } catch (error) {
            console.error('Veri yükleme hatası:', error);
        } finally {
            setDataLoading(false);
        }
    };

    /**
     * Yeni aday ekle
     */
    const addCandidate = async (candidate) => {
        if (!currentUser) return;

        try {
            await addCandidateToFirestore(currentUser.uid, candidate);
            setCandidates(prev => [candidate, ...prev]);
        } catch (error) {
            console.error('Aday ekleme hatası:', error);
            throw error;
        }
    };

    /**
     * Aday güncelle
     */
    const updateCandidate = async (candidateId, updates) => {
        if (!currentUser) return;

        try {
            // Önce local state'i güncelle (optimistic update)
            setCandidates(prevCandidates =>
                prevCandidates.map(c =>
                    c.id === candidateId ? { ...c, ...updates } : c
                )
            );

            // Sonra Firestore'a yaz
            await updateCandidateInFirestore(currentUser.uid, candidateId, updates);
        } catch (error) {
            console.error('Aday güncelleme hatası:', error);
            // Hata durumunda verileri yeniden yükle
            await loadDataFromFirestore();
            throw error;
        }
    };

    /**
     * Yeni personel ekle
     */
    const addEmployee = async (employee) => {
        if (!currentUser) return;

        try {
            await addEmployeeToFirestore(currentUser.uid, employee);
            setEmployees(prev => [employee, ...prev]);
        } catch (error) {
            console.error('Personel ekleme hatası:', error);
            throw error;
        }
    };

    /**
     * Personel güncelle
     */
    const updateEmployee = async (employeeId, updates) => {
        if (!currentUser) return;

        try {
            // Önce local state'i güncelle (optimistic update)
            setEmployees(prevEmployees =>
                prevEmployees.map(e =>
                    e.id === employeeId ? { ...e, ...updates } : e
                )
            );

            // Sonra Firestore'a yaz
            await updateEmployeeInFirestore(currentUser.uid, employeeId, updates);
        } catch (error) {
            console.error('Personel güncelleme hatası:', error);
            // Hata durumunda verileri yeniden yükle
            await loadDataFromFirestore();
            throw error;
        }
    };

    /**
     * Adayı personele dönüştür
     */
    const promoteCandidateToEmployee = async (candidateId, employeeData) => {
        if (!currentUser) return;

        try {
            // Local state'i güncelle
            setCandidates(prev => prev.filter(c => c.id !== candidateId));
            setEmployees(prev => [employeeData, ...prev]);

            // Firestore'da işlemi gerçekleştir
            await moveCandidateToEmployee(currentUser.uid, candidateId, employeeData);
        } catch (error) {
            console.error('Aday personele dönüştürme hatası:', error);
            // Hata durumunda verileri yeniden yükle
            await loadDataFromFirestore();
            throw error;
        }
    };

    /**
     * Tüm verileri temizle
     */
    const clearAllData = async () => {
        if (!currentUser) return;

        if (window.confirm('TÜM ADAY VE PERSONEL VERİLERİ SİLİNECEK! Emin misiniz?')) {
            try {
                setLoading(true);
                await clearAllDataInFirestore(currentUser.uid);
                setCandidates([]);
                setEmployees([]);
            } catch (error) {
                console.error('Veri temizleme hatası:', error);
                alert('Veriler temizlenirken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        }
    };

    // Modal functions
    const openModal = (type, person) => {
        setModalType(type);
        setSelectedPerson(JSON.parse(JSON.stringify(person))); // Deep copy
        setModalTab('detay');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedPerson(null);
        setModalType('');
    };

    /**
     * AŞAMA 33: Expense Management Functions
     */

    // Yeni gider talebi oluştur (Çalışan)
    const addExpenseClaim = (expenseData) => {
        const newExpense = {
            id: 'EXP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            employeeId: currentUser?.uid || 'unknown',
            employeeName: currentUser?.name || 'Unknown Employee',
            type: expenseData.type,
            amount: parseFloat(expenseData.amount),
            currency: '₺',
            description: expenseData.description || '',
            receipt: expenseData.receipt || 'placeholder-receipt.jpg', // Simüle
            status: 'pending',
            submitDate: new Date().toISOString(),
            reviewDate: null,
            reviewedBy: null,
            reviewNote: ''
        };

        setExpenses(prev => [newExpense, ...prev]);
        console.log('✅ Yeni gider talebi oluşturuldu:', newExpense.id);
        return newExpense;
    };

    // Gider talebini güncelle (İK Admin)
    const updateExpenseClaim = (expenseId, updates) => {
        setExpenses(prev => prev.map(exp =>
            exp.id === expenseId ? { ...exp, ...updates } : exp
        ));
        console.log('✅ Gider talebi güncellendi:', expenseId);
    };

    // Gider talebini onayla (İK Admin)
    const approveExpenseClaim = (expenseId, note = '') => {
        setExpenses(prev => prev.map(exp =>
            exp.id === expenseId ? {
                ...exp,
                status: 'approved',
                reviewDate: new Date().toISOString(),
                reviewedBy: currentUser?.name || 'Admin',
                reviewNote: note
            } : exp
        ));
        console.log('✅ Gider talebi onaylandı:', expenseId);
    };

    // Gider talebini reddet (İK Admin)
    const rejectExpenseClaim = (expenseId, note = '') => {
        setExpenses(prev => prev.map(exp =>
            exp.id === expenseId ? {
                ...exp,
                status: 'rejected',
                reviewDate: new Date().toISOString(),
                reviewedBy: currentUser?.name || 'Admin',
                reviewNote: note
            } : exp
        ));
        console.log('❌ Gider talebi reddedildi:', expenseId);
    };

    /**
     * AŞAMA 35: Exit Interview Functions
     */

    // Yeni exit interview kaydı oluştur
    const addExitInterview = (exitData) => {
        const newExitInterview = {
            id: 'EXIT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            employeeId: exitData.employeeId,
            employeeName: exitData.employeeName,
            employeePosition: exitData.employeePosition,
            exitDate: exitData.exitDate || new Date().toISOString(),
            exitReason: exitData.exitReason,
            managerRating: exitData.managerRating,
            companyRating: exitData.companyRating,
            wouldRecommend: exitData.wouldRecommend,
            feedback: exitData.feedback,
            improvementSuggestions: exitData.improvementSuggestions,
            conductedBy: currentUser?.name || 'HR Admin',
            conductedDate: new Date().toISOString()
        };

        setExitInterviews(prev => [newExitInterview, ...prev]);
        console.log('✅ Exit interview kaydedildi:', newExitInterview.id);
        return newExitInterview;
    };

    // Exit interview güncelle
    const updateExitInterview = (exitId, updates) => {
        setExitInterviews(prev => prev.map(exit =>
            exit.id === exitId ? { ...exit, ...updates } : exit
        ));
        console.log('✅ Exit interview güncellendi:', exitId);
    };

    /**
     * AŞAMA 36: Notification Management Functions
     */

    // Bildirim gönder (Slack/Teams simülasyonu)
    const sendNotification = (type, message, recipient = 'hr-notifications') => {
        // Aktif platform kontrolü
        const activePlatform = notificationSettings.slack.enabled ? 'slack' :
                               notificationSettings.teams.enabled ? 'teams' : null;

        if (!activePlatform) {
            console.log('⚠️ Bildirim gönderilmedi: Aktif platform yok');
            return;
        }

        const notification = {
            id: 'NOTIF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            type: type,
            platform: activePlatform,
            message: message,
            timestamp: new Date().toISOString(),
            status: 'sent',
            recipient: recipient
        };

        setNotificationHistory(prev => [notification, ...prev]);
        console.log(`📤 ${activePlatform.toUpperCase()} bildirimi gönderildi:`, message);
        return notification;
    };

    // Bildirim ayarlarını güncelle
    const updateNotificationSettings = (platform, updates) => {
        setNotificationSettings(prev => ({
            ...prev,
            [platform]: {
                ...prev[platform],
                ...updates
            }
        }));
        console.log(`✅ ${platform} bildirim ayarları güncellendi`);
    };

    const value = {
        // State
        activeTab,
        candidates,
        employees,
        expenses,
        exitInterviews,
        notificationSettings,
        notificationHistory,
        loading,
        dataLoading,
        searchQuery,
        selectedPerson,
        showModal,
        modalType,
        modalTab,
        filterStatus,
        filterPlatform,
        // Setters
        setActiveTab,
        setCandidates,
        setEmployees,
        setExpenses,
        setNotificationSettings,
        setNotificationHistory,
        setLoading,
        setSearchQuery,
        setSelectedPerson,
        setShowModal,
        setModalType,
        setModalTab,
        setFilterStatus,
        setFilterPlatform,
        // CRUD Functions
        addCandidate,
        updateCandidate,
        addEmployee,
        updateEmployee,
        promoteCandidateToEmployee,
        clearAllData,
        loadDataFromFirestore,
        // Modal Functions
        openModal,
        closeModal,
        // Expense Functions (AŞAMA 33)
        addExpenseClaim,
        updateExpenseClaim,
        approveExpenseClaim,
        rejectExpenseClaim,
        // Exit Interview Functions (AŞAMA 35)
        addExitInterview,
        updateExitInterview,
        // Notification Functions (AŞAMA 36)
        sendNotification,
        updateNotificationSettings
    };

    // Veriler yüklenene kadar loading göster
    if (dataLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="glass p-8 rounded-2xl flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white font-medium">Verileriniz yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}
