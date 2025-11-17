import React, { useState } from 'react';
import { Link2, CheckCircle, Circle, Slack, Calendar, Mail, Database, Building2, Zap } from 'lucide-react';

/**
 * Integrations Hub - Entegrasyon Merkezi
 * Üçüncü parti SaaS araçlarıyla entegrasyonları yönetir
 * AŞAMA 19
 */
function Integrations() {
    // Simüle edilmiş bağlantı durumları
    const [connections, setConnections] = useState({
        slack: false,
        google_calendar: false,
        outlook_calendar: false,
        sap: false,
        workday: false,
        teams: false
    });

    // Entegrasyon listesi
    const integrations = [
        {
            id: 'slack',
            name: 'Slack',
            icon: Slack,
            category: 'Communication',
            description: 'Yeni aday başvuruları ve mülakat bildirimleri için Slack kanallarınıza otomatik mesajlar gönderin.',
            features: [
                'Yeni CV yüklendiğinde otomatik bildirim',
                'Mülakat planlandığında takım kanalına mesaj',
                'Teklif onayları için approval workflow'
            ],
            color: 'from-purple-600 to-pink-600',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/30'
        },
        {
            id: 'google_calendar',
            name: 'Google Calendar',
            icon: Calendar,
            category: 'Calendar',
            description: 'Mülakat randevularını otomatik olarak Google Takvim\'e ekleyin ve katılımcılara davet gönderin.',
            features: [
                'Otomatik takvim daveti oluşturma',
                'Mülakatçılar için zamanlama senkronizasyonu',
                'Mülakat öncesi hatırlatma e-postaları'
            ],
            color: 'from-blue-600 to-cyan-600',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/30'
        },
        {
            id: 'outlook_calendar',
            name: 'Outlook Calendar',
            icon: Mail,
            category: 'Calendar',
            description: 'Microsoft Outlook ile entegre olun ve tüm mülakat randevularınızı Outlook Takvim\'de yönetin.',
            features: [
                'Microsoft Teams toplantı entegrasyonu',
                'Outlook takvim senkronizasyonu',
                'Exchange Server desteği'
            ],
            color: 'from-blue-500 to-indigo-600',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/30'
        },
        {
            id: 'teams',
            name: 'Microsoft Teams',
            icon: Zap,
            category: 'Communication',
            description: 'Microsoft Teams kanallarına bildirim gönderin ve online mülakat toplantıları oluşturun.',
            features: [
                'Teams kanallarına otomatik bildirim',
                'Online mülakat için toplantı linki',
                'Takım işbirliği için kanal entegrasyonu'
            ],
            color: 'from-indigo-600 to-purple-600',
            bgColor: 'bg-indigo-500/10',
            borderColor: 'border-indigo-500/30'
        },
        {
            id: 'sap',
            name: 'SAP SuccessFactors',
            icon: Database,
            category: 'HR Systems',
            description: 'SAP SuccessFactors ile entegre olun ve personel verilerini otomatik senkronize edin.',
            features: [
                'Personel bilgilerini SAP\'ye otomatik aktarma',
                'Özlük dosyası senkronizasyonu',
                'Bordro entegrasyonu için veri paylaşımı'
            ],
            color: 'from-yellow-600 to-orange-600',
            bgColor: 'bg-yellow-500/10',
            borderColor: 'border-yellow-500/30'
        },
        {
            id: 'workday',
            name: 'Workday',
            icon: Building2,
            category: 'HR Systems',
            description: 'Workday HCM ile entegre olun ve işe alım sürecinizi kurumsal İK sisteminizle senkronize edin.',
            features: [
                'Workday HCM entegrasyonu',
                'Otomatik personel profili oluşturma',
                'İşe alım workflow senkronizasyonu'
            ],
            color: 'from-green-600 to-emerald-600',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/30'
        }
    ];

    // Kategorilere göre grupla
    const categories = {
        'Communication': integrations.filter(i => i.category === 'Communication'),
        'Calendar': integrations.filter(i => i.category === 'Calendar'),
        'HR Systems': integrations.filter(i => i.category === 'HR Systems')
    };

    // Bağlantı toggle (simülasyon)
    const toggleConnection = (integrationId) => {
        setConnections({
            ...connections,
            [integrationId]: !connections[integrationId]
        });
    };

    return (
        <div className="space-y-6" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Link2 className="w-8 h-8 text-purple-400" />
                        Entegrasyon Merkezi
                    </h2>
                    <p className="text-gray-400">
                        Vocaify'ı mevcut iş araçlarınızla entegre edin ve iş akışınızı otomatikleştirin
                    </p>
                </div>
                <div className="glass px-6 py-3 rounded-lg text-center">
                    <p className="text-gray-400 text-sm">Aktif Entegrasyonlar</p>
                    <p className="text-3xl font-bold text-white">
                        {Object.values(connections).filter(Boolean).length} / {integrations.length}
                    </p>
                </div>
            </div>

            {/* Integration Stats */}
            <div className="glass p-6 rounded-2xl border border-purple-500/20">
                <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-xl font-bold text-white">Güçlü Entegrasyon Ekosistemi</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                    Vocaify, işe alım sürecinizi kolaylaştırmak için en popüler iş araçlarıyla entegre olur.
                    Slack'te bildirim alın, Google Calendar'da mülakat planlayın, SAP'ye otomatik veri aktarın.
                    Tüm iş akışınız tek platformda, senkronize ve otomatik.
                </p>
            </div>

            {/* Integrations by Category */}
            {Object.entries(categories).map(([categoryName, categoryIntegrations]) => (
                <div key={categoryName}>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                        {categoryName}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryIntegrations.map((integration) => {
                            const Icon = integration.icon;
                            const isConnected = connections[integration.id];

                            return (
                                <div
                                    key={integration.id}
                                    className={`glass p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
                                        isConnected
                                            ? 'border-green-500/50 bg-green-500/5'
                                            : integration.borderColor
                                    }`}
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${integration.color}`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-white">{integration.name}</h4>
                                                <p className="text-xs text-gray-400">{integration.category}</p>
                                            </div>
                                        </div>
                                        {isConnected ? (
                                            <CheckCircle className="w-6 h-6 text-green-400" />
                                        ) : (
                                            <Circle className="w-6 h-6 text-gray-600" />
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                                        {integration.description}
                                    </p>

                                    {/* Features */}
                                    <div className={`mb-4 p-3 rounded-lg ${integration.bgColor} border ${integration.borderColor}`}>
                                        <p className="text-xs font-bold text-gray-300 mb-2">Özellikler:</p>
                                        <ul className="space-y-1">
                                            {integration.features.map((feature, index) => (
                                                <li key={index} className="text-xs text-gray-400 flex items-start gap-2">
                                                    <span className="text-purple-400 mt-0.5">•</span>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => toggleConnection(integration.id)}
                                        className={`w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                                            isConnected
                                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                                : `bg-gradient-to-r ${integration.color} text-white hover:shadow-lg`
                                        }`}
                                    >
                                        <Link2 className="w-4 h-4" />
                                        {isConnected ? 'Bağlantıyı Kes' : 'Bağla'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Coming Soon */}
            <div className="glass p-6 rounded-2xl border border-gray-500/20">
                <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-6 h-6 text-gray-400" />
                    <h3 className="text-xl font-bold text-white">Yakında Gelenler</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['LinkedIn', 'Jira', 'Zapier', 'API Access'].map((tool) => (
                        <div key={tool} className="bg-slate-800/30 p-4 rounded-lg text-center">
                            <p className="text-gray-400 font-medium">{tool}</p>
                            <p className="text-xs text-gray-500 mt-1">Yakında</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Integrations;
