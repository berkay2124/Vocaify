import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
    Award,
    Trophy,
    Star,
    Medal,
    Plus,
    Edit,
    Trash2,
    Target,
    Users,
    TrendingUp,
    Gift,
    CheckCircle
} from 'lucide-react';

/**
 * Gamification Settings Component
 *
 * HR Admin panel for managing badges and gamification rules.
 *
 * AŞAMA 26: Gamification & Kudos Module
 */
function GamificationSettings() {
    const { candidates, setCandidates } = useApp();
    const { currentUser } = useAuth();

    // Badge state
    const [badges, setBadges] = useState([
        {
            id: 1,
            name: 'Ayın Yıldızı',
            description: 'Ayın en iyi performans puanını alan çalışan',
            icon: '⭐',
            color: 'from-yellow-500 to-orange-500',
            criteria: 'performance_top',
            isActive: true,
            createdDate: '2025-11-01T10:00:00Z'
        },
        {
            id: 2,
            name: '1. Yıl Rozeti',
            description: 'Şirkette 1 yılını doldurdu',
            icon: '🎂',
            color: 'from-blue-500 to-cyan-500',
            criteria: 'tenure_1year',
            isActive: true,
            createdDate: '2025-11-01T10:00:00Z'
        },
        {
            id: 3,
            name: 'Kudos Şampiyonu',
            description: '50+ kudos aldı',
            icon: '🏆',
            color: 'from-purple-500 to-pink-500',
            criteria: 'kudos_50',
            isActive: true,
            createdDate: '2025-11-01T10:00:00Z'
        },
        {
            id: 4,
            name: 'Yenilikçi',
            description: 'En az 5 iyileştirme önerisi kabul edildi',
            icon: '💡',
            color: 'from-green-500 to-emerald-500',
            criteria: 'innovation_5',
            isActive: true,
            createdDate: '2025-11-01T10:00:00Z'
        },
        {
            id: 5,
            name: 'Takım Oyuncusu',
            description: 'Departmanda en çok kudos gönderen',
            icon: '🤝',
            color: 'from-indigo-500 to-purple-500',
            criteria: 'kudos_sender_top',
            isActive: true,
            createdDate: '2025-11-01T10:00:00Z'
        }
    ]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingBadge, setEditingBadge] = useState(null);

    const [newBadge, setNewBadge] = useState({
        name: '',
        description: '',
        icon: '🏅',
        color: 'from-purple-500 to-pink-500',
        criteria: 'custom',
        isActive: true
    });

    // Icon options
    const iconOptions = ['⭐', '🏆', '🏅', '🎖️', '👑', '💎', '🎯', '🚀', '💡', '🤝', '🎂', '🎉', '🔥', '💪', '🌟'];

    // Color gradient options
    const colorOptions = [
        { value: 'from-yellow-500 to-orange-500', label: 'Altın', preview: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
        { value: 'from-purple-500 to-pink-500', label: 'Mor-Pembe', preview: 'bg-gradient-to-r from-purple-500 to-pink-500' },
        { value: 'from-blue-500 to-cyan-500', label: 'Mavi', preview: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
        { value: 'from-green-500 to-emerald-500', label: 'Yeşil', preview: 'bg-gradient-to-r from-green-500 to-emerald-500' },
        { value: 'from-red-500 to-pink-500', label: 'Kırmızı', preview: 'bg-gradient-to-r from-red-500 to-pink-500' },
        { value: 'from-indigo-500 to-purple-500', label: 'İndigo', preview: 'bg-gradient-to-r from-indigo-500 to-purple-500' }
    ];

    // Criteria options
    const criteriaOptions = [
        { value: 'performance_top', label: 'Ayın En Yüksek Performansı' },
        { value: 'kudos_50', label: '50+ Kudos Aldı' },
        { value: 'kudos_100', label: '100+ Kudos Aldı' },
        { value: 'kudos_sender_top', label: 'En Çok Kudos Gönderen' },
        { value: 'tenure_1year', label: '1 Yıl Kıdem' },
        { value: 'tenure_3year', label: '3 Yıl Kıdem' },
        { value: 'tenure_5year', label: '5 Yıl Kıdem' },
        { value: 'innovation_5', label: '5+ İyileştirme Önerisi' },
        { value: 'custom', label: 'Özel Kriter' }
    ];

    // Create/Update badge
    const handleSaveBadge = () => {
        if (!newBadge.name.trim() || !newBadge.description.trim()) {
            alert('Lütfen rozet ismi ve açıklama girin.');
            return;
        }

        if (editingBadge) {
            // Update
            const updatedBadges = badges.map(b =>
                b.id === editingBadge.id
                    ? { ...b, ...newBadge }
                    : b
            );
            setBadges(updatedBadges);
            alert('Rozet başarıyla güncellendi!');
        } else {
            // Create
            const badge = {
                id: Date.now(),
                ...newBadge,
                createdDate: new Date().toISOString()
            };
            setBadges([...badges, badge]);
            alert('Rozet başarıyla oluşturuldu!');
        }

        setShowCreateModal(false);
        setEditingBadge(null);
        setNewBadge({
            name: '',
            description: '',
            icon: '🏅',
            color: 'from-purple-500 to-pink-500',
            criteria: 'custom',
            isActive: true
        });
    };

    // Edit badge
    const handleEditBadge = (badge) => {
        setEditingBadge(badge);
        setNewBadge({
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            color: badge.color,
            criteria: badge.criteria,
            isActive: badge.isActive
        });
        setShowCreateModal(true);
    };

    // Delete badge
    const handleDeleteBadge = (badgeId) => {
        if (!window.confirm('Bu rozeti silmek istediğinizden emin misiniz?')) return;
        setBadges(badges.filter(b => b.id !== badgeId));
        alert('Rozet silindi!');
    };

    // Toggle badge active status
    const toggleBadgeStatus = (badgeId) => {
        setBadges(badges.map(b =>
            b.id === badgeId ? { ...b, isActive: !b.isActive } : b
        ));
    };

    // Get employees count with badge
    const getEmployeesWithBadge = (badgeId) => {
        return candidates.filter(c =>
            c.status === 'personel' &&
            c.badges &&
            c.badges.some(b => b.badgeId === badgeId)
        ).length;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <Trophy className="w-8 h-8 text-yellow-400" />
                            Oyunlaştırma Ayarları
                        </h1>
                        <p className="text-gray-300">
                            Rozetleri yönetin ve çalışan bağlılığını artırın
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingBadge(null);
                            setNewBadge({
                                name: '',
                                description: '',
                                icon: '🏅',
                                color: 'from-purple-500 to-pink-500',
                                criteria: 'custom',
                                isActive: true
                            });
                            setShowCreateModal(true);
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Yeni Rozet Oluştur
                    </button>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass p-5 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Award className="w-8 h-8 text-purple-400" />
                        <div>
                            <div className="text-2xl font-bold text-white">{badges.length}</div>
                            <div className="text-sm text-gray-400">Toplam Rozet</div>
                        </div>
                    </div>
                </div>
                <div className="glass p-5 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                        <div>
                            <div className="text-2xl font-bold text-white">
                                {badges.filter(b => b.isActive).length}
                            </div>
                            <div className="text-sm text-gray-400">Aktif Rozet</div>
                        </div>
                    </div>
                </div>
                <div className="glass p-5 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="w-8 h-8 text-blue-400" />
                        <div>
                            <div className="text-2xl font-bold text-white">
                                {candidates.filter(c =>
                                    c.status === 'personel' && c.badges && c.badges.length > 0
                                ).length}
                            </div>
                            <div className="text-sm text-gray-400">Rozetli Çalışan</div>
                        </div>
                    </div>
                </div>
                <div className="glass p-5 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-8 h-8 text-yellow-400" />
                        <div>
                            <div className="text-2xl font-bold text-white">
                                {candidates.reduce((sum, c) =>
                                    sum + (c.badges ? c.badges.length : 0), 0
                                )}
                            </div>
                            <div className="text-sm text-gray-400">Verilen Rozet</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Badges Grid */}
            <div className="glass p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-4">Rozetler</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {badges.map(badge => (
                        <div
                            key={badge.id}
                            className={`relative bg-slate-800/50 border rounded-xl p-5 hover:bg-slate-800 transition-all ${
                                badge.isActive ? 'border-purple-500/30' : 'border-gray-700/30 opacity-60'
                            }`}
                        >
                            {/* Badge Icon */}
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-3xl shadow-lg`}>
                                    {badge.icon}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditBadge(badge)}
                                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteBadge(badge.id)}
                                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Badge Info */}
                            <h3 className="text-lg font-bold text-white mb-2">{badge.name}</h3>
                            <p className="text-sm text-gray-400 mb-3">{badge.description}</p>

                            {/* Criteria */}
                            <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
                                <div className="text-xs text-gray-500 mb-1">Kriter:</div>
                                <div className="text-sm text-purple-300">
                                    {criteriaOptions.find(c => c.value === badge.criteria)?.label || badge.criteria}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">
                                    <Users className="w-4 h-4 inline mr-1" />
                                    {getEmployeesWithBadge(badge.id)} çalışan
                                </span>
                                <button
                                    onClick={() => toggleBadgeStatus(badge.id)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        badge.isActive
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-gray-500/20 text-gray-400'
                                    }`}
                                >
                                    {badge.isActive ? 'Aktif' : 'Pasif'}
                                </button>
                            </div>
                        </div>
                    ))}

                    {badges.length === 0 && (
                        <div className="col-span-3 text-center py-12">
                            <Award className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400">Henüz rozet oluşturulmamış.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30">
                        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingBadge ? 'Rozeti Düzenle' : 'Yeni Rozet Oluştur'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setEditingBadge(null);
                                    }}
                                    className="text-white/70 hover:text-white text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Badge Preview */}
                            <div className="bg-slate-800/50 rounded-xl p-6 text-center">
                                <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${newBadge.color} flex items-center justify-center text-5xl shadow-lg mb-3`}>
                                    {newBadge.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white">{newBadge.name || 'Rozet İsmi'}</h3>
                                <p className="text-gray-400 text-sm mt-1">{newBadge.description || 'Açıklama'}</p>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Rozet İsmi *
                                </label>
                                <input
                                    type="text"
                                    value={newBadge.name}
                                    onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })}
                                    placeholder="örn: Ayın Yıldızı"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Açıklama *
                                </label>
                                <textarea
                                    value={newBadge.description}
                                    onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
                                    placeholder="Rozet nasıl kazanılır?"
                                    rows="3"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                                />
                            </div>

                            {/* Icon */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    İkon Seç
                                </label>
                                <div className="grid grid-cols-8 gap-2">
                                    {iconOptions.map(icon => (
                                        <button
                                            key={icon}
                                            onClick={() => setNewBadge({ ...newBadge, icon })}
                                            className={`p-3 rounded-xl text-2xl transition-all ${
                                                newBadge.icon === icon
                                                    ? 'bg-purple-600 ring-2 ring-purple-400'
                                                    : 'bg-slate-800 hover:bg-slate-700'
                                            }`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Renk Seç
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {colorOptions.map(color => (
                                        <button
                                            key={color.value}
                                            onClick={() => setNewBadge({ ...newBadge, color: color.value })}
                                            className={`p-3 rounded-xl transition-all ${
                                                newBadge.color === color.value
                                                    ? 'ring-2 ring-white'
                                                    : ''
                                            }`}
                                        >
                                            <div className={`h-8 rounded-lg ${color.preview}`}></div>
                                            <div className="text-xs text-gray-400 mt-1">{color.label}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Criteria */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Kazanma Kriteri
                                </label>
                                <select
                                    value={newBadge.criteria}
                                    onChange={(e) => setNewBadge({ ...newBadge, criteria: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                >
                                    {criteriaOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setEditingBadge(null);
                                    }}
                                    className="flex-1 px-6 py-3 rounded-xl font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleSaveBadge}
                                    className="flex-1 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                                >
                                    {editingBadge ? 'Güncelle' : 'Oluştur'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GamificationSettings;
