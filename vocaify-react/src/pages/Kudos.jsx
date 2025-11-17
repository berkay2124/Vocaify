import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
    Heart,
    ThumbsUp,
    Star,
    Award,
    Send,
    Users,
    TrendingUp,
    MessageCircle,
    Filter,
    Trophy
} from 'lucide-react';

/**
 * Kudos Component
 *
 * Employee-facing page for sending and viewing kudos (recognition).
 * Enables peer-to-peer appreciation and team building.
 *
 * AŞAMA 26: Gamification & Kudos Module
 */
function Kudos() {
    const { candidates, setCandidates } = useApp();
    const { currentUser } = useAuth();

    // Find current employee
    const currentEmployee = candidates.find(c =>
        c.email?.toLowerCase() === currentUser?.email?.toLowerCase() &&
        c.status === 'personel'
    );

    // Kudos categories
    const kudosCategories = [
        { id: 'teamwork', label: 'İyi Takım Oyuncusu', icon: '🤝', color: 'from-blue-500 to-cyan-500' },
        { id: 'innovation', label: 'Yenilikçi Düşünce', icon: '💡', color: 'from-purple-500 to-pink-500' },
        { id: 'presentation', label: 'Harika Sunum', icon: '🎤', color: 'from-green-500 to-emerald-500' },
        { id: 'leadership', label: 'Liderlik', icon: '👑', color: 'from-yellow-500 to-orange-500' },
        { id: 'helping', label: 'Yardımsever', icon: '🙏', color: 'from-indigo-500 to-purple-500' },
        { id: 'achievement', label: 'Başarı', icon: '🎯', color: 'from-red-500 to-pink-500' },
        { id: 'quality', label: 'Kaliteli İş', icon: '⭐', color: 'from-amber-500 to-yellow-500' },
        { id: 'positive', label: 'Pozitif Enerji', icon: '😊', color: 'from-pink-500 to-rose-500' }
    ];

    // Send kudos state
    const [showSendModal, setShowSendModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(kudosCategories[0]);
    const [kudosMessage, setKudosMessage] = useState('');

    // Filter state
    const [filterCategory, setFilterCategory] = useState('all');

    // Get all employees except current user
    const allEmployees = candidates.filter(c =>
        c.status === 'personel' &&
        c.id !== currentEmployee?.id
    );

    // Get all kudos (from all employees)
    const getAllKudos = () => {
        let allKudos = [];
        candidates.forEach(c => {
            if (c.kudosReceived) {
                allKudos = [...allKudos, ...c.kudosReceived.map(k => ({ ...k, recipientName: c.name }))];
            }
        });
        return allKudos.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const allKudos = getAllKudos();

    // Filter kudos
    const filteredKudos = filterCategory === 'all'
        ? allKudos
        : allKudos.filter(k => k.category === filterCategory);

    // Get kudos sent by current user
    const myKudosSent = allKudos.filter(k => k.senderId === currentEmployee?.id);

    // Get kudos received by current user
    const myKudosReceived = currentEmployee?.kudosReceived || [];

    // Send kudos
    const handleSendKudos = () => {
        if (!selectedEmployee) {
            alert('Lütfen bir çalışan seçin.');
            return;
        }

        if (!kudosMessage.trim()) {
            alert('Lütfen bir mesaj yazın.');
            return;
        }

        const kudos = {
            id: Date.now(),
            senderId: currentEmployee.id,
            senderName: currentEmployee.name,
            senderEmail: currentEmployee.email,
            category: selectedCategory.id,
            categoryLabel: selectedCategory.label,
            categoryIcon: selectedCategory.icon,
            message: kudosMessage,
            date: new Date().toISOString(),
            isPublic: true
        };

        // Add kudos to recipient
        const updatedCandidates = candidates.map(c => {
            if (c.id === selectedEmployee.id) {
                return {
                    ...c,
                    kudosReceived: [...(c.kudosReceived || []), kudos]
                };
            }
            return c;
        });

        setCandidates(updatedCandidates);

        alert(`✅ ${selectedEmployee.name} adlı kişiye kudos gönderildi!`);

        // Reset form
        setShowSendModal(false);
        setSelectedEmployee(null);
        setKudosMessage('');
        setSelectedCategory(kudosCategories[0]);
    };

    // Get top kudos receivers
    const getTopReceivers = () => {
        const counts = {};
        candidates.forEach(c => {
            if (c.status === 'personel' && c.kudosReceived) {
                counts[c.id] = {
                    name: c.name,
                    count: c.kudosReceived.length
                };
            }
        });

        return Object.values(counts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    };

    const topReceivers = getTopReceivers();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <Heart className="w-8 h-8 text-pink-400" />
                            Kudos (Takdir)
                        </h1>
                        <p className="text-gray-300">
                            Takım arkadaşlarınızı takdir edin ve onların motivasyonunu artırın
                        </p>
                    </div>
                    <button
                        onClick={() => setShowSendModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
                    >
                        <Send className="w-5 h-5" />
                        Kudos Gönder
                    </button>
                </div>
            </div>

            {/* My Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass p-5 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{myKudosReceived.length}</div>
                            <div className="text-sm text-gray-400">Aldığım Kudos</div>
                        </div>
                    </div>
                </div>
                <div className="glass p-5 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <Send className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{myKudosSent.length}</div>
                            <div className="text-sm text-gray-400">Gönderdiğim Kudos</div>
                        </div>
                    </div>
                </div>
                <div className="glass p-5 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">
                                {topReceivers.findIndex(r => r.name === currentEmployee?.name) + 1 || '-'}
                            </div>
                            <div className="text-sm text-gray-400">Sıralamada</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Receivers Leaderboard */}
            <div className="glass p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    En Çok Kudos Alanlar
                </h2>
                <div className="space-y-3">
                    {topReceivers.map((receiver, index) => (
                        <div key={index} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                                index === 0 ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white' :
                                index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white' :
                                index === 2 ? 'bg-gradient-to-br from-amber-700 to-amber-800 text-white' :
                                'bg-slate-700 text-gray-300'
                            }`}>
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-white">{receiver.name}</div>
                                <div className="text-sm text-gray-400">{receiver.count} kudos</div>
                            </div>
                            {index === 0 && <Trophy className="w-6 h-6 text-yellow-400" />}
                            {index === 1 && <Award className="w-6 h-6 text-gray-400" />}
                            {index === 2 && <Award className="w-6 h-6 text-amber-700" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Kudos Feed */}
            <div className="glass p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <MessageCircle className="w-6 h-6 text-purple-400" />
                        Kudos Akışı
                    </h2>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 bg-slate-800 text-white rounded-xl border border-purple-500/30 focus:border-purple-500 transition-all"
                    >
                        <option value="all">Tüm Kategoriler</option>
                        {kudosCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-4">
                    {filteredKudos.length === 0 ? (
                        <div className="text-center py-12">
                            <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400">Henüz kudos gönderilmemiş.</p>
                        </div>
                    ) : (
                        filteredKudos.map(kudos => {
                            const category = kudosCategories.find(c => c.id === kudos.category);
                            return (
                                <div key={kudos.id} className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-5 hover:bg-slate-800 transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${category?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center text-2xl flex-shrink-0`}>
                                            {category?.icon || '👏'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-bold text-white">{kudos.senderName}</span>
                                                <span className="text-gray-400">→</span>
                                                <span className="font-bold text-purple-400">{kudos.recipientName}</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${category?.color || 'from-gray-500 to-gray-600'} text-white`}>
                                                    {kudos.categoryLabel}
                                                </span>
                                            </div>
                                            <p className="text-gray-300 mb-2">{kudos.message}</p>
                                            <div className="text-xs text-gray-500">
                                                {new Date(kudos.date).toLocaleDateString('tr-TR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Send Kudos Modal */}
            {showSendModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30">
                        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">Kudos Gönder</h2>
                                <button
                                    onClick={() => {
                                        setShowSendModal(false);
                                        setSelectedEmployee(null);
                                        setKudosMessage('');
                                    }}
                                    className="text-white/70 hover:text-white text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Select Employee */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Kime Kudos Göndermek İstersiniz? *
                                </label>
                                <select
                                    value={selectedEmployee?.id || ''}
                                    onChange={(e) => {
                                        const emp = allEmployees.find(em => em.id === e.target.value);
                                        setSelectedEmployee(emp);
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                >
                                    <option value="">Çalışan seçin...</option>
                                    {allEmployees.map(emp => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.name} - {emp.analysis?.position || 'Çalışan'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Select Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Kategori Seçin *
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {kudosCategories.map(category => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`p-4 rounded-xl transition-all flex items-center gap-3 ${
                                                selectedCategory.id === category.id
                                                    ? `bg-gradient-to-r ${category.color} text-white ring-2 ring-white/50`
                                                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                                            }`}
                                        >
                                            <span className="text-2xl">{category.icon}</span>
                                            <span className="font-medium text-sm">{category.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Mesajınız *
                                </label>
                                <textarea
                                    value={kudosMessage}
                                    onChange={(e) => setKudosMessage(e.target.value)}
                                    rows="4"
                                    placeholder="Neden bu kişiyi takdir etmek istiyorsunuz? Detayları paylaşın..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                                />
                            </div>

                            {/* Preview */}
                            {selectedEmployee && (
                                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
                                    <div className="text-sm text-purple-300 mb-2">Önizleme:</div>
                                    <div className="flex items-start gap-3">
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${selectedCategory.color} flex items-center justify-center text-2xl`}>
                                            {selectedCategory.icon}
                                        </div>
                                        <div>
                                            <div className="text-white font-bold mb-1">
                                                {currentEmployee?.name} → {selectedEmployee.name}
                                            </div>
                                            <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${selectedCategory.color} text-white mb-2`}>
                                                {selectedCategory.label}
                                            </div>
                                            <p className="text-gray-300 text-sm">{kudosMessage || 'Mesajınız burada görünecek...'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowSendModal(false);
                                        setSelectedEmployee(null);
                                        setKudosMessage('');
                                    }}
                                    className="flex-1 px-6 py-3 rounded-xl font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleSendKudos}
                                    className="flex-1 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Kudos Gönder
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Kudos;
