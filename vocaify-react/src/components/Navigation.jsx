import React from 'react';
import { LayoutDashboard, Users, UserCheck, Search, BarChart3, CreditCard, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';

/**
 * Ana navigasyon sekmelerini render eder
 */
function Navigation() {
    const { t } = useTranslation();
    const { activeTab, setActiveTab } = useApp();

    const tabs = [
        { id: 'dashboard', label: t('navigation.dashboard'), icon: LayoutDashboard },
        { id: 'candidates', label: t('navigation.candidates'), icon: Users },
        { id: 'employees', label: t('navigation.employees'), icon: UserCheck },
        { id: 'search', label: t('navigation.aiSearch'), icon: Search },
        { id: 'sourcing', label: 'AI Sourcing', icon: Sparkles },
        { id: 'analytics', label: t('navigation.analytics'), icon: BarChart3 },
        { id: 'billing', label: t('navigation.billing'), icon: CreditCard }
    ];

    return (
        <nav className="glass border-b border-purple-500/20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex gap-2 overflow-x-auto">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-4 flex items-center gap-2 transition-all whitespace-nowrap ${
                                    isActive
                                        ? 'text-purple-300 border-b-2 border-purple-500'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}

export default Navigation;
