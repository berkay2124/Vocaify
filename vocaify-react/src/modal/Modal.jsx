import React, { useState } from 'react';
import { XCircle, Eye, Award, DollarSign, FileStack, Zap, History, TrendingUp, Wand2, Calendar, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { canViewModalTab } from '../data/roles';
import { STATUS_CONFIG, EMPLOYEE_STAGES } from '../config/constants';
import DetailTab from './ModalTabs/DetailTab';
import EvaluationTab from './ModalTabs/EvaluationTab';
import OfferTab from './ModalTabs/OfferTab';
import DocumentsTab from './ModalTabs/DocumentsTab';
import ActionsTab from './ModalTabs/ActionsTab';
import HistoryTab from './ModalTabs/HistoryTab';
import PerformanceTab from './ModalTabs/PerformanceTab';
import AIToolkit from '../components/AIToolkit';
import InterviewScheduler from '../components/InterviewScheduler';

/**
 * Ana modal bileşenini render eder
 * Aday/personel detay modal'ı, sekme başlıkları ve içeriğini gösterir
 * AŞAMA 16: AI Araç Kiti entegrasyonu
 * AŞAMA 17: Mülakat Planlama entegrasyonu
 * AŞAMA 27: Bias-Free Mode (Tarafsız Mod) entegrasyonu
 */
function Modal() {
    const { showModal, selectedPerson, modalTab, setModalTab, closeModal } = useApp();
    const { currentUser } = useAuth();
    const [showAIToolkit, setShowAIToolkit] = useState(false);
    const [showInterviewScheduler, setShowInterviewScheduler] = useState(false);
    const [biasFreeMode, setBiasFreeMode] = useState(false); // AŞAMA 27: Tarafsız Mod

    if (!showModal || !selectedPerson) return null;

    const person = selectedPerson;
    const isEmployee = EMPLOYEE_STAGES.includes(person.status);

    const allModalTabs = [
        { id: 'detay', label: 'Detaylar', icon: Eye },
        !isEmployee && { id: 'degerlendirme', label: 'Değerlendirme', icon: Award },
        !isEmployee && { id: 'teklif', label: 'Teklif', icon: DollarSign },
        { id: 'dokumanlar', label: 'Özlük Dosyaları', icon: FileStack },
        { id: 'aksiyonlar', label: 'İK Aksiyonları', icon: Zap },
        { id: 'gecmis', label: 'Süreç Geçmişi', icon: History },
        isEmployee && { id: 'performans', label: 'Performans', icon: TrendingUp }
    ].filter(Boolean);

    // Kullanıcının rolüne göre görünür sekmeleri filtrele
    const modalTabs = currentUser
        ? allModalTabs.filter(tab => canViewModalTab(currentUser.role, tab.id))
        : allModalTabs;

    const getModalTabContent = () => {
        switch (modalTab) {
            case 'detay':
                return <DetailTab person={person} biasFreeMode={biasFreeMode} />;
            case 'degerlendirme':
                return <EvaluationTab person={person} />;
            case 'teklif':
                return <OfferTab person={person} />;
            case 'dokumanlar':
                return <DocumentsTab person={person} />;
            case 'aksiyonlar':
                return <ActionsTab person={person} />;
            case 'gecmis':
                return <HistoryTab person={person} />;
            case 'performans':
                return <PerformanceTab person={person} />;
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 modal-fade">
            <div className="fixed inset-0" onClick={closeModal}></div>

            <div className="glass max-w-4xl w-full max-h-[90vh] flex flex-col my-6 relative z-10 modal-zoom">
                {/* Modal Başlığı */}
                <div className="flex-shrink-0 p-6 flex justify-between items-start border-b border-purple-500/20">
                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 ${isEmployee ? 'bg-gradient-to-br from-emerald-500 to-green-500' : 'gradient-bg'} rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0`}>
                            {biasFreeMode ? '👤' : person.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white">
                                {biasFreeMode ? `Aday #${person.id.slice(-4)}` : person.name}
                            </h3>
                            <p className="text-purple-300">{person.analysis.position}</p>
                            <span className={`mt-2 inline-block px-3 py-1 ${STATUS_CONFIG[person.status].color} text-white text-xs rounded-full font-medium`}>
                                {STATUS_CONFIG[person.status].label}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Bias-Free Mode Toggle - AŞAMA 27 */}
                        {!isEmployee && (
                            <button
                                onClick={() => setBiasFreeMode(!biasFreeMode)}
                                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 font-medium text-sm ${
                                    biasFreeMode
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                }`}
                                title="Tarafsız Mod - İsim, yaş, cinsiyet bilgilerini gizler"
                            >
                                <EyeOff className="w-4 h-4" />
                                {biasFreeMode ? 'Tarafsız Mod: Aktif' : 'Tarafsız Mod'}
                            </button>
                        )}

                        {/* AI Asistan Butonu - AŞAMA 16 */}
                        {!isEmployee && (
                            <>
                                <button
                                    onClick={() => setShowInterviewScheduler(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 font-medium text-sm"
                                    title="Mülakat Planla"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Mülakat Planla
                                </button>
                                <button
                                    onClick={() => setShowAIToolkit(true)}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 font-medium text-sm"
                                    title="AI Araç Kiti"
                                >
                                    <Wand2 className="w-4 h-4" />
                                    AI Asistan
                                </button>
                            </>
                        )}
                        <button onClick={closeModal} className="text-gray-400 hover:text-white transition-all">
                            <XCircle className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Modal Sekme Başlıkları */}
                <div className="flex-shrink-0 flex gap-1 overflow-x-auto border-b border-purple-500/20 px-4">
                    {modalTabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setModalTab(tab.id)}
                                className={`px-4 py-3 flex items-center gap-2 transition-all whitespace-nowrap ${modalTab === tab.id
                                    ? 'text-purple-300 border-b-2 border-purple-500'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Modal Sekme İçeriği */}
                <div className="flex-grow p-6 overflow-y-auto">
                    {getModalTabContent()}
                </div>
            </div>

            {/* AI Toolkit Modal - AŞAMA 16 */}
            {showAIToolkit && (
                <AIToolkit
                    candidate={person}
                    onClose={() => setShowAIToolkit(false)}
                />
            )}

            {/* Interview Scheduler Modal - AŞAMA 17 */}
            {showInterviewScheduler && (
                <InterviewScheduler
                    candidate={person}
                    onClose={() => setShowInterviewScheduler(false)}
                />
            )}
        </div>
    );
}

export default Modal;
