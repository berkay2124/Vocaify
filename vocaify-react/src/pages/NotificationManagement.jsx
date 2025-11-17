import React, { useState, useEffect } from 'react';
import {
    Bell, Slack, Zap, CheckCircle, XCircle, Settings, Send, Clock,
    AlertTriangle, UserPlus, Award, Receipt, UserMinus, TrendingUp,
    Briefcase, MessageSquare, Users, Calendar, Link2, Radio
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

/**
 * AŞAMA 36: Deep Slack/Teams Notification Integration
 * İK ve çalışanlar için Slack/Teams bildirim yönetimi
 * Vocaify'ı günlük iş akışının merkezine yerleştirir
 */
function NotificationManagement() {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('settings');

    // Notification settings state (simüle edilmiş)
    const [notificationSettings, setNotificationSettings] = useState({
        slack: {
            enabled: false,
            webhookUrl: '',
            channel: '#hr-notifications',
            connected: false
        },
        teams: {
            enabled: false,
            webhookUrl: '',
            channel: 'HR Team',
            connected: false
        }
    });

    // Notification types (İK Admin için)
    const [hrNotificationTypes, setHrNotificationTypes] = useState({
        new_leave_request: { enabled: true, label: 'Yeni İzin Talebi', icon: Calendar, color: 'blue' },
        new_expense_claim: { enabled: true, label: 'Yeni Gider Talebi', icon: Receipt, color: 'green' },
        new_exit_interview: { enabled: true, label: 'Yeni Exit Interview', icon: UserMinus, color: 'red' },
        new_candidate: { enabled: true, label: 'Yeni Aday Başvurusu', icon: UserPlus, color: 'purple' },
        interview_scheduled: { enabled: true, label: 'Mülakat Planlandı', icon: Calendar, color: 'yellow' },
        kudos_given: { enabled: false, label: 'Yeni Kudos Verildi', icon: Award, color: 'pink' },
        performance_due: { enabled: true, label: 'Performans Değerlendirmesi Yaklaşıyor', icon: TrendingUp, color: 'orange' }
    });

    // Notification types (Çalışan için)
    const [employeeNotificationTypes, setEmployeeNotificationTypes] = useState({
        leave_approved: { enabled: true, label: 'İzin Talebim Onaylandı', icon: CheckCircle, color: 'green' },
        leave_rejected: { enabled: true, label: 'İzin Talebim Reddedildi', icon: XCircle, color: 'red' },
        expense_approved: { enabled: true, label: 'Gider Talebim Onaylandı', icon: CheckCircle, color: 'green' },
        expense_rejected: { enabled: true, label: 'Gider Talebim Reddedildi', icon: XCircle, color: 'red' },
        kudos_received: { enabled: true, label: 'Kudos Aldım', icon: Award, color: 'yellow' },
        performance_review: { enabled: true, label: 'Performans Değerlendirmem Hazır', icon: TrendingUp, color: 'blue' },
        new_internal_job: { enabled: true, label: 'Yeni İç İlan Yayınlandı', icon: Briefcase, color: 'purple' },
        survey_available: { enabled: false, label: 'Yeni Anket Mevcut', icon: MessageSquare, color: 'cyan' }
    });

    // Notification history (simüle edilmiş)
    const [notificationHistory, setNotificationHistory] = useState([
        {
            id: 1,
            type: 'new_leave_request',
            platform: 'slack',
            message: '🏖️ Yeni İzin Talebi: Ahmet Yılmaz, 5 gün yıllık izin talep etti.',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            status: 'sent',
            recipient: '#hr-notifications'
        },
        {
            id: 2,
            type: 'kudos_received',
            platform: 'teams',
            message: '🏆 Tebrikler! Elif Demir sana bir Kudos gönderdi: "Harika sunum!"',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            status: 'sent',
            recipient: 'Mehmet Kaya'
        },
        {
            id: 3,
            type: 'expense_approved',
            platform: 'slack',
            message: '✅ Gider Talebiniz Onaylandı: 1,500₺ ulaşım gideri ödemesi yapılacak.',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            status: 'sent',
            recipient: 'Ayşe Yıldız'
        }
    ]);

    // Test notification gönder
    const sendTestNotification = (platform) => {
        const platformName = platform === 'slack' ? 'Slack' : 'Teams';

        if (!notificationSettings[platform].enabled) {
            alert(`Önce ${platformName} bildirimlerini aktif edin.`);
            return;
        }

        if (!notificationSettings[platform].webhookUrl.trim()) {
            alert(`Lütfen ${platformName} Webhook URL'sini girin.`);
            return;
        }

        // Simüle edilmiş bildirim
        const testNotification = {
            id: Date.now(),
            type: 'test',
            platform: platform,
            message: `🔔 Test Bildirimi: Vocaify ${platformName} entegrasyonu başarıyla çalışıyor! ✅`,
            timestamp: new Date().toISOString(),
            status: 'sent',
            recipient: notificationSettings[platform].channel
        };

        setNotificationHistory([testNotification, ...notificationHistory]);
        alert(`✅ Test bildirimi ${platformName}'e gönderildi!`);
    };

    // Bağlantıyı test et
    const testConnection = (platform) => {
        const platformName = platform === 'slack' ? 'Slack' : 'Teams';

        if (!notificationSettings[platform].webhookUrl.trim()) {
            alert(`Lütfen ${platformName} Webhook URL'sini girin.`);
            return;
        }

        // Simüle edilmiş bağlantı testi
        setNotificationSettings({
            ...notificationSettings,
            [platform]: {
                ...notificationSettings[platform],
                connected: true
            }
        });

        alert(`✅ ${platformName} bağlantısı başarıyla doğrulandı!`);
    };

    // Platform toggle
    const togglePlatform = (platform) => {
        setNotificationSettings({
            ...notificationSettings,
            [platform]: {
                ...notificationSettings[platform],
                enabled: !notificationSettings[platform].enabled
            }
        });
    };

    // Notification type toggle
    const toggleNotificationType = (category, typeKey) => {
        if (category === 'hr') {
            setHrNotificationTypes({
                ...hrNotificationTypes,
                [typeKey]: {
                    ...hrNotificationTypes[typeKey],
                    enabled: !hrNotificationTypes[typeKey].enabled
                }
            });
        } else {
            setEmployeeNotificationTypes({
                ...employeeNotificationTypes,
                [typeKey]: {
                    ...employeeNotificationTypes[typeKey],
                    enabled: !employeeNotificationTypes[typeKey].enabled
                }
            });
        }
    };

    // Platform icon
    const getPlatformIcon = (platform) => {
        return platform === 'slack' ? Slack : Zap;
    };

    // Status color
    const getStatusColor = (status) => {
        return status === 'sent' ? 'text-green-400' :
               status === 'failed' ? 'text-red-400' : 'text-yellow-400';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Bell className="w-8 h-8 text-purple-400" />
                    Bildirim Yönetimi
                </h1>
                <p className="text-gray-400 mt-2">
                    Slack ve Microsoft Teams entegrasyonu ile Vocaify'ı günlük iş akışınızın merkezine yerleştirin
                </p>
            </div>

            {/* Tabs */}
            <div className="glass rounded-2xl p-1 inline-flex gap-1">
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                        activeTab === 'settings'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <Settings className="w-5 h-5 inline mr-2" />
                    Ayarlar
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                        activeTab === 'history'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <Clock className="w-5 h-5 inline mr-2" />
                    Bildirim Geçmişi
                </button>
            </div>

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="space-y-6">
                    {/* Platform Configuration */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Slack */}
                        <div className={`glass p-8 rounded-2xl border-2 transition-all ${
                            notificationSettings.slack.enabled
                                ? 'border-green-500/50 bg-green-500/5'
                                : 'border-purple-500/20'
                        }`}>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                                        <Slack className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Slack</h3>
                                        <p className="text-sm text-gray-400">Workspace entegrasyonu</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => togglePlatform('slack')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                        notificationSettings.slack.enabled
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-600 text-gray-300'
                                    }`}
                                >
                                    {notificationSettings.slack.enabled ? 'Aktif' : 'Pasif'}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Webhook URL
                                    </label>
                                    <input
                                        type="text"
                                        value={notificationSettings.slack.webhookUrl}
                                        onChange={(e) => setNotificationSettings({
                                            ...notificationSettings,
                                            slack: { ...notificationSettings.slack, webhookUrl: e.target.value }
                                        })}
                                        placeholder="https://hooks.slack.com/services/..."
                                        className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Kanal
                                    </label>
                                    <input
                                        type="text"
                                        value={notificationSettings.slack.channel}
                                        onChange={(e) => setNotificationSettings({
                                            ...notificationSettings,
                                            slack: { ...notificationSettings.slack, channel: e.target.value }
                                        })}
                                        placeholder="#hr-notifications"
                                        className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => testConnection('slack')}
                                        className="flex-1 px-4 py-3 bg-white/5 border border-purple-500/20 rounded-xl font-medium text-gray-300 hover:bg-white/10 transition-all"
                                    >
                                        <Link2 className="w-4 h-4 inline mr-2" />
                                        Bağlantıyı Test Et
                                    </button>
                                    <button
                                        onClick={() => sendTestNotification('slack')}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium text-white hover:shadow-lg transition-all"
                                    >
                                        <Send className="w-4 h-4 inline mr-2" />
                                        Test Bildirimi
                                    </button>
                                </div>

                                {notificationSettings.slack.connected && (
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        <span className="text-green-300 text-sm font-medium">
                                            Bağlantı doğrulandı
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Microsoft Teams */}
                        <div className={`glass p-8 rounded-2xl border-2 transition-all ${
                            notificationSettings.teams.enabled
                                ? 'border-green-500/50 bg-green-500/5'
                                : 'border-purple-500/20'
                        }`}>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Microsoft Teams</h3>
                                        <p className="text-sm text-gray-400">Kanal entegrasyonu</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => togglePlatform('teams')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                        notificationSettings.teams.enabled
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-600 text-gray-300'
                                    }`}
                                >
                                    {notificationSettings.teams.enabled ? 'Aktif' : 'Pasif'}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Webhook URL
                                    </label>
                                    <input
                                        type="text"
                                        value={notificationSettings.teams.webhookUrl}
                                        onChange={(e) => setNotificationSettings({
                                            ...notificationSettings,
                                            teams: { ...notificationSettings.teams, webhookUrl: e.target.value }
                                        })}
                                        placeholder="https://outlook.office.com/webhook/..."
                                        className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Kanal
                                    </label>
                                    <input
                                        type="text"
                                        value={notificationSettings.teams.channel}
                                        onChange={(e) => setNotificationSettings({
                                            ...notificationSettings,
                                            teams: { ...notificationSettings.teams, channel: e.target.value }
                                        })}
                                        placeholder="HR Team"
                                        className="w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => testConnection('teams')}
                                        className="flex-1 px-4 py-3 bg-white/5 border border-purple-500/20 rounded-xl font-medium text-gray-300 hover:bg-white/10 transition-all"
                                    >
                                        <Link2 className="w-4 h-4 inline mr-2" />
                                        Bağlantıyı Test Et
                                    </button>
                                    <button
                                        onClick={() => sendTestNotification('teams')}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-medium text-white hover:shadow-lg transition-all"
                                    >
                                        <Send className="w-4 h-4 inline mr-2" />
                                        Test Bildirimi
                                    </button>
                                </div>

                                {notificationSettings.teams.connected && (
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        <span className="text-green-300 text-sm font-medium">
                                            Bağlantı doğrulandı
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notification Types - HR Admin */}
                    <div className="glass p-8 rounded-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">İK Yöneticisi Bildirimleri</h3>
                                <p className="text-gray-400 text-sm">
                                    İK ekibinin bilgilendirilmesi gereken olaylar
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(hrNotificationTypes).map(([key, type]) => {
                                const Icon = type.icon;
                                return (
                                    <div
                                        key={key}
                                        onClick={() => toggleNotificationType('hr', key)}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                            type.enabled
                                                ? 'bg-purple-500/10 border-purple-500/50'
                                                : 'bg-white/5 border-gray-500/20 opacity-60'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <Icon className={`w-5 h-5 text-${type.color}-400`} />
                                            <div className={`w-10 h-6 rounded-full transition-all ${
                                                type.enabled ? 'bg-green-600' : 'bg-gray-600'
                                            } relative`}>
                                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                                                    type.enabled ? 'right-1' : 'left-1'
                                                }`}></div>
                                            </div>
                                        </div>
                                        <p className="text-white font-medium text-sm">{type.label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Notification Types - Employee */}
                    <div className="glass p-8 rounded-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl">
                                <Radio className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Çalışan Bildirimleri</h3>
                                <p className="text-gray-400 text-sm">
                                    Çalışanların kişisel Slack/Teams hesaplarına gönderilecek bildirimler
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {Object.entries(employeeNotificationTypes).map(([key, type]) => {
                                const Icon = type.icon;
                                return (
                                    <div
                                        key={key}
                                        onClick={() => toggleNotificationType('employee', key)}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                            type.enabled
                                                ? 'bg-green-500/10 border-green-500/50'
                                                : 'bg-white/5 border-gray-500/20 opacity-60'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <Icon className={`w-5 h-5 text-${type.color}-400`} />
                                            <div className={`w-10 h-6 rounded-full transition-all ${
                                                type.enabled ? 'bg-green-600' : 'bg-gray-600'
                                            } relative`}>
                                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                                                    type.enabled ? 'right-1' : 'left-1'
                                                }`}></div>
                                            </div>
                                        </div>
                                        <p className="text-white font-medium text-sm">{type.label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Info Panel */}
                    <div className="glass p-6 rounded-2xl border-2 border-blue-500/30">
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="text-white font-bold mb-2">Vocaify'ı İş Akışınızın Merkezine Yerleştirin</h4>
                                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                                    Slack ve Microsoft Teams entegrasyonu ile artık Vocaify'dan ayrılmadan tüm kritik bildirimleri
                                    doğrudan iş akışınızda alabilirsiniz. İzin talepleri, gider onayları, kudos bildirimleri ve
                                    daha fazlası için gerçek zamanlı bildirimler.
                                </p>
                                <ul className="space-y-1 text-gray-400 text-xs">
                                    <li>• <strong className="text-white">İK Yöneticileri:</strong> Yeni izin talepleri, gider talepleri ve exit interview'lar için anında bildirim</li>
                                    <li>• <strong className="text-white">Çalışanlar:</strong> İzin/gider onayları, kudos ve performans değerlendirmeleri için kişisel bildirimler</li>
                                    <li>• <strong className="text-white">Otomatik:</strong> Tüm bildirimler sistemden otomatik olarak gönderilir, manuel işlem gerekmez</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
                <div className="space-y-4">
                    <div className="glass p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Clock className="w-6 h-6 text-purple-400" />
                            Son Gönderilen Bildirimler ({notificationHistory.length})
                        </h3>

                        {notificationHistory.length === 0 ? (
                            <div className="text-center py-12">
                                <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-400">Henüz bildirim gönderilmedi</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {notificationHistory.map((notification) => {
                                    const PlatformIcon = getPlatformIcon(notification.platform);
                                    return (
                                        <div key={notification.id} className="bg-white/5 p-4 rounded-xl border border-purple-500/20">
                                            <div className="flex items-start gap-4">
                                                <div className={`p-3 rounded-lg ${
                                                    notification.platform === 'slack'
                                                        ? 'bg-purple-500/20'
                                                        : 'bg-indigo-500/20'
                                                }`}>
                                                    <PlatformIcon className={`w-5 h-5 ${
                                                        notification.platform === 'slack'
                                                            ? 'text-purple-400'
                                                            : 'text-indigo-400'
                                                    }`} />
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-white font-medium">
                                                            {notification.platform === 'slack' ? 'Slack' : 'Teams'} → {notification.recipient}
                                                        </span>
                                                        <span className={`text-sm font-medium ${getStatusColor(notification.status)}`}>
                                                            {notification.status === 'sent' ? '✅ Gönderildi' : '❌ Başarısız'}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm mb-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-gray-500 text-xs">
                                                        {new Date(notification.timestamp).toLocaleString('tr-TR')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationManagement;
