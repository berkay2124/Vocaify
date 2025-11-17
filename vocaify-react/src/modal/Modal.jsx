import React from 'react';
import { XCircle, Eye, Award, DollarSign, FileStack, Zap, History, TrendingUp } from 'lucide-react';
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

/**
 * Ana modal bileşenini render eder
 * Aday/personel detay modal'ı, sekme başlıkları ve içeriğini gösterir
 */
function Modal() {
    const { showModal, selectedPerson, modalTab, setModalTab, closeModal } = useApp();
    const { currentUser } = useAuth();

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
                return <DetailTab person={person} />;
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
                            {person.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white">{person.name}</h3>
                            <p className="text-purple-300">{person.analysis.position}</p>
                            <span className={`mt-2 inline-block px-3 py-1 ${STATUS_CONFIG[person.status].color} text-white text-xs rounded-full font-medium`}>
                                {STATUS_CONFIG[person.status].label}
                            </span>
                        </div>
                    </div>
                    <button onClick={closeModal} className="text-gray-400 hover:text-white transition-all">
                        <XCircle className="w-6 h-6" />
                    </button>
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
        </div>
    );
}

export default Modal;
