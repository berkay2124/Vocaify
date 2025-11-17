import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Loader from './components/Loader';
import Modal from './modal/Modal';
import Dashboard from './tabs/Dashboard';
import Candidates from './tabs/Candidates';
import Employees from './tabs/Employees';
import Search from './tabs/Search';
import Analytics from './tabs/Analytics';
import { localAnalyzeCV } from './utils/helpers';
import './App.css';

function AppContent() {
    const { activeTab, loading, setLoading, setCandidates, candidates } = useApp();

    // CV yükleme handler'ı
    const handleCVUpload = (event) => {
        const files = Array.from(event.target.files);
        setLoading(true);

        const newCandidatesList = [];

        setTimeout(() => {
            for (const file of files) {
                const analysis = localAnalyzeCV(file.name);
                const newCandidate = {
                    id: 'CND-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                    name: analysis.name,
                    email: analysis.email,
                    phone: analysis.phone,
                    cvText: `[Simüle edilmiş CV metni: ${file.name}]`,
                    analysis: analysis,
                    status: 'aday',
                    uploadDate: new Date().toISOString(),
                    platform: 'Manuel Yükleme',
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
                        position: analysis.position || '',
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
                        note: 'Aday oluşturuldu'
                    }]
                };
                newCandidatesList.push(newCandidate);
            }

            setCandidates([...newCandidatesList, ...candidates]);
            setLoading(false);
            event.target.value = '';
        }, 1000);
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
            case 'analytics':
                return <Analytics />;
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

function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}

export default App;
