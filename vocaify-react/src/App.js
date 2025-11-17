import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import './i18n'; // Initialize i18n
import Header from './components/Header';
import Navigation from './components/Navigation';
import Loader from './components/Loader';
import Modal from './modal/Modal';
import Dashboard from './tabs/Dashboard';
import Candidates from './tabs/Candidates';
import Employees from './tabs/Employees';
import Search from './tabs/Search';
import Analytics from './tabs/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';
import Billing from './pages/Billing';
import Sourcing from './pages/Sourcing';
import SuperAdmin from './pages/SuperAdmin';
import Feedback from './pages/Feedback';
import Onboarding from './pages/Onboarding';
import Integrations from './pages/Integrations';
import EmployeeDashboard from './pages/EmployeeDashboard';
import PerformanceAdmin from './pages/PerformanceAdmin';
import SurveyAdmin from './pages/SurveyAdmin';
import { extractTextFromCV, validateFileSize, validateFileType } from './utils/cvParser';
import { ROLES } from './data/roles';
import { analyzeCVWithAI, isAIConfigured } from './utils/aiAnalyzer';
import './App.css';

/**
 * Protected Route Component
 * Giriş yapmamış kullanıcıları login sayfasına yönlendirir
 */
function ProtectedRoute({ children }) {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

/**
 * Main App Content Component
 * Ana uygulama içeriğini render eder (giriş yapılmış kullanıcılar için)
 */
function AppContent() {
    const { activeTab, loading, setLoading, addCandidate } = useApp();
    const { currentUser } = useAuth();

    // Employee rolü kontrolü - ESS Portal'a yönlendir
    if (currentUser?.role === ROLES.EMPLOYEE) {
        return <EmployeeDashboard />;
    }

    // CV yükleme handler'ı - Gerçek AI analizi ile
    const handleCVUpload = async (event) => {
        const files = Array.from(event.target.files);

        if (files.length === 0) return;

        setLoading(true);

        try {
            // AI yapılandırma durumu kontrolü
            if (!isAIConfigured()) {
                console.warn('⚠️ Anthropic API key yapılandırılmamış. Demo modu kullanılıyor.');
            }

            for (const file of files) {
                try {
                    // 1. Dosya validasyonu
                    if (!validateFileType(file)) {
                        alert(`${file.name}: Desteklenmeyen dosya formatı. Lütfen PDF veya DOCX yükleyin.`);
                        continue;
                    }

                    if (!validateFileSize(file)) {
                        alert(`${file.name}: Dosya boyutu çok büyük (maksimum 5MB).`);
                        continue;
                    }

                    // 2. CV'den metin çıkar
                    console.log(`📄 ${file.name} işleniyor...`);
                    const cvText = await extractTextFromCV(file);

                    if (!cvText || cvText.trim().length === 0) {
                        alert(`${file.name}: CV'den metin çıkarılamadı.`);
                        continue;
                    }

                    // 3. AI ile analiz et
                    console.log(`🤖 AI analizi yapılıyor...`);
                    const analysis = await analyzeCVWithAI(cvText);

                    // 4. Yeni aday oluştur
                    const newCandidate = {
                        id: 'CND-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                        name: analysis.name,
                        email: analysis.email,
                        phone: analysis.phone,
                        cvText: cvText,
                        analysis: {
                            skills: analysis.skills,
                            experience: `${analysis.experience_years} yıl`,
                            summary: analysis.summary,
                            aiRecommendation: analysis.aiRecommendation,
                            position: analysis.skills[0] || 'Genel'
                        },
                        status: 'aday',
                        uploadDate: new Date().toISOString(),
                        platform: 'Manuel Yükleme (AI)',
                        evaluations: [],
                        kpiScores: {},
                        totalKpiScore: 0,
                        interviewNotes: '',
                        hrNotes: [],
                        decision: '',
                        decisionBy: '',
                        decisionDate: '',
                        decisionReason: '',
                        offerDetails: {
                            position: analysis.skills[0] || '',
                            salary: '',
                            benefits: '',
                            offerSent: false,
                            offerAccepted: null,
                            startDate: ''
                        },
                        documents: [{
                            id: Date.now(),
                            name: file.name,
                            type: 'CV',
                            uploadDate: new Date().toISOString()
                        }],
                        trainings: [],
                        surveys: [],
                        statusHistory: [{
                            status: 'aday',
                            date: new Date().toISOString(),
                            note: 'AI ile analiz edildi ve oluşturuldu'
                        }]
                    };

                    // 5. Firestore'a kaydet
                    await addCandidate(newCandidate);
                    console.log(`✅ ${analysis.name} başarıyla eklendi!`);

                } catch (fileError) {
                    console.error(`${file.name} işlenirken hata:`, fileError);
                    alert(`${file.name} işlenirken hata oluştu: ${fileError.message}`);
                }
            }

        } catch (error) {
            console.error('CV yükleme hatası:', error);
            alert('CV yükleme sırasında bir hata oluştu.');
        } finally {
            setLoading(false);
            event.target.value = '';
        }
    };

    // Aktif sekmeyi render et
    const renderActiveTab = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'candidates':
                return <Candidates />;
            case 'employees':
                return <Employees />;
            case 'search':
                return <Search />;
            case 'sourcing':
                return <Sourcing />;
            case 'analytics':
                return <Analytics />;
            case 'billing':
                return <Billing />;
            case 'superadmin':
                return <SuperAdmin />;
            case 'feedback':
                return <Feedback />;
            case 'onboarding':
                return <Onboarding />;
            case 'integrations':
                return <Integrations />;
            case 'performance':
                return <PerformanceAdmin />;
            case 'surveys':
                return <SurveyAdmin />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Header onCVUpload={handleCVUpload} />
            <Navigation />
            <main className="max-w-7xl mx-auto px-6 py-8">
                {renderActiveTab()}
            </main>
            <Modal />
            <Loader loading={loading} />
        </div>
    );
}

/**
 * Main App Component
 * Router, Auth Provider ve App Provider'ı sarmallar
 */
function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <AppProvider>
                                    <AppContent />
                                </AppProvider>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
