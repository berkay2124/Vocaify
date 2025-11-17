import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/dataManager';

const AppContext = createContext();

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}

export function AppProvider({ children }) {
    // State
    const [activeTab, setActiveTab] = useState('dashboard');
    const [candidates, setCandidates] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [modalTab, setModalTab] = useState('detay');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPlatform, setFilterPlatform] = useState('all');

    // Load data on mount
    useEffect(() => {
        const data = loadFromStorage();
        setCandidates(data.candidates);
        setEmployees(data.employees);
    }, []);

    // Save data whenever candidates or employees change
    useEffect(() => {
        if (candidates.length > 0 || employees.length > 0) {
            saveToStorage(candidates, employees);
        }
    }, [candidates, employees]);

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

    // Data update functions
    const updateCandidate = (candidateId, updates) => {
        setCandidates(prevCandidates =>
            prevCandidates.map(c =>
                c.id === candidateId ? { ...c, ...updates } : c
            )
        );
    };

    const updateEmployee = (employeeId, updates) => {
        setEmployees(prevEmployees =>
            prevEmployees.map(e =>
                e.id === employeeId ? { ...e, ...updates } : e
            )
        );
    };

    const clearAllData = () => {
        if (window.confirm('TÜM ADAY VE PERSONEL VERİLERİ SİLİNECEK! Emin misiniz?')) {
            setCandidates([]);
            setEmployees([]);
        }
    };

    const value = {
        // State
        activeTab,
        candidates,
        employees,
        loading,
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
        setLoading,
        setSearchQuery,
        setSelectedPerson,
        setShowModal,
        setModalType,
        setModalTab,
        setFilterStatus,
        setFilterPlatform,
        // Functions
        openModal,
        closeModal,
        updateCandidate,
        updateEmployee,
        clearAllData
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}
