import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
    Heart,
    Trophy,
    TrendingUp,
    Users,
    Award,
    BarChart3,
    Filter,
    MessageCircle
} from 'lucide-react';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

/**
 * Kudos Feed Component (Admin)
 *
 * HR Admin dashboard for viewing kudos feed and leaderboards.
 * Shows company-wide kudos activity and engagement metrics.
 *
 * AŞAMA 26: Gamification & Kudos Module
 */
function KudosFeed() {
    const { candidates } = useApp();

    const [filterCategory, setFilterCategory] = useState('all');
    const [filterDepartment, setFilterDepartment] = useState('all');

    // Kudos categories
    const kudosCategories = [
        { id: 'teamwork', label: 'İyi Takım Oyuncusu', icon: '🤝' },
        { id: 'innovation', label: 'Yenilikçi Düşünce', icon: '💡' },
        { id: 'presentation', label: 'Harika Sunum', icon: '🎤' },
        { id: 'leadership', label: 'Liderlik', icon: '👑' },
        { id: 'helping', label: 'Yardımsever', icon: '🙏' },
        { id: 'achievement', label: 'Başarı', icon: '🎯' },
        { id: 'quality', label: 'Kaliteli İş', icon: '⭐' },
        { id: 'positive', label: 'Pozitif Enerji', icon: '😊' }
    ];

    // Get all employees
    const employees = candidates.filter(c => c.status === 'personel');

    // Get all kudos
    const getAllKudos = () => {
        let allKudos = [];
        candidates.forEach(c => {
            if (c.kudosReceived) {
                allKudos = [...allKudos, ...c.kudosReceived.map(k => ({
                    ...k,
                    recipientId: c.id,
                    recipientName: c.name,
                    recipientDepartment: c.analysis?.position || c.offerDetails?.position || 'Belirtilmemiş'
                }))];
            }
        });
        return allKudos.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const allKudos = getAllKudos();

    // Filter kudos
    const filteredKudos = allKudos.filter(k => {
        if (filterCategory !== 'all' && k.category !== filterCategory) return false;
        if (filterDepartment !== 'all' && k.recipientDepartment !== filterDepartment) return false;
        return true;
    });

    // Get leaderboard (top kudos receivers)
    const getLeaderboard = () => {
        const counts = {};
        employees.forEach(emp => {
            counts[emp.id] = {
                id: emp.id,
                name: emp.name,
                department: emp.analysis?.position || emp.offerDetails?.position || 'Belirtilmemiş',
                count: emp.kudosReceived ? emp.kudosReceived.length : 0
            };
        });

        return Object.values(counts)
            .filter(emp => emp.count > 0)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    };

    const leaderboard = getLeaderboard();

    // Get kudos by category (for chart)
    const getKudosByCategory = () => {
        const counts = {};
        kudosCategories.forEach(cat => {
            counts[cat.id] = {
                name: cat.label,
                value: allKudos.filter(k => k.category === cat.id).length
            };
        });

        return Object.values(counts)
            .filter(c => c.value > 0)
            .sort((a, b) => b.value - a.value);
    };

    const kudosByCategory = getKudosByCategory();

    // Get departments
    const departments = [...new Set(employees.map(e =>
        e.analysis?.position || e.offerDetails?.position || 'Belirtilmemiş'
    ))];

    // Get kudos by department
    const getKudosByDepartment = () => {
        const counts = {};
        departments.forEach(dept => {
            counts[dept] = allKudos.filter(k => k.recipientDepartment === dept).length;
        });

        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .filter(d => d.value > 0)
            .sort((a, b) => b.value - a.value);
    };

    const kudosByDepartment = getKudosByDepartment();

    // Colors for charts
    const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass p-6 rounded-2xl">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Heart className="w-8 h-8 text-pink-400" />
                    Kudos Akışı ve Liderlik Tablosu
                </h1>
                <p className="text-gray-300">
                    Şirket genelinde takdir kültürünü izleyin ve analiz edin
                </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass p-5 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{allKudos.length}</div>
                            <div className="text-sm text-gray-400">Toplam Kudos</div>
                        </div>
                    </div>
                </div>
                <div className="glass p-5 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">
                                {employees.filter(e => e.kudosReceived && e.kudosReceived.length > 0).length}
                            </div>
                            <div className="text-sm text-gray-400">Kudos Alan Çalışan</div>
                        </div>
                    </div>
                </div>
                <div className="glass p-5 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">
                                {employees.length > 0 ? (allKudos.length / employees.length).toFixed(1) : 0}
                            </div>
                            <div className="text-sm text-gray-400">Çalışan Başına</div>
                        </div>
                    </div>
                </div>
                <div className="glass p-5 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">
                                {leaderboard[0]?.name.split(' ')[0] || '-'}
                            </div>
                            <div className="text-sm text-gray-400">En Çok Kudos Alan</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leaderboard */}
            <div className="glass p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    Liderlik Tablosu - En Çok Kudos Alanlar
                </h2>
                <div className="space-y-3">
                    {leaderboard.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            Henüz kudos verilmemiş
                        </div>
                    ) : (
                        leaderboard.map((emp, index) => (
                            <div key={emp.id} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl hover:bg-slate-800 transition-all">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                                    index === 0 ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white' :
                                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900' :
                                    index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                                    'bg-slate-700 text-gray-300'
                                }`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-white text-lg">{emp.name}</div>
                                    <div className="text-sm text-gray-400">{emp.department}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-pink-400">{emp.count}</div>
                                    <div className="text-xs text-gray-500">kudos</div>
                                </div>
                                {index === 0 && <Trophy className="w-8 h-8 text-yellow-400" />}
                                {index === 1 && <Award className="w-7 h-7 text-gray-300" />}
                                {index === 2 && <Award className="w-7 h-7 text-amber-600" />}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Distribution */}
                <div className="glass p-6 rounded-2xl">
                    <h2 className="text-xl font-bold text-white mb-4">Kategori Dağılımı</h2>
                    {kudosByCategory.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={kudosByCategory}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {kudosByCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #8b5cf6' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center py-12 text-gray-400">Henüz veri yok</div>
                    )}
                </div>

                {/* Department Distribution */}
                <div className="glass p-6 rounded-2xl">
                    <h2 className="text-xl font-bold text-white mb-4">Departman Dağılımı</h2>
                    {kudosByDepartment.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={kudosByDepartment}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="name" stroke="#888" angle={-45} textAnchor="end" height={100} />
                                <YAxis stroke="#888" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #8b5cf6' }}
                                />
                                <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center py-12 text-gray-400">Henüz veri yok</div>
                    )}
                </div>
            </div>

            {/* Kudos Feed */}
            <div className="glass p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <MessageCircle className="w-6 h-6 text-purple-400" />
                        Kudos Akışı ({filteredKudos.length})
                    </h2>
                    <div className="flex gap-3">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2 bg-slate-800 text-white rounded-xl border border-purple-500/30 focus:border-purple-500 transition-all text-sm"
                        >
                            <option value="all">Tüm Kategoriler</option>
                            {kudosCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                        </select>
                        <select
                            value={filterDepartment}
                            onChange={(e) => setFilterDepartment(e.target.value)}
                            className="px-4 py-2 bg-slate-800 text-white rounded-xl border border-purple-500/30 focus:border-purple-500 transition-all text-sm"
                        >
                            <option value="all">Tüm Departmanlar</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {filteredKudos.length === 0 ? (
                        <div className="text-center py-12">
                            <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400">
                                {filterCategory !== 'all' || filterDepartment !== 'all'
                                    ? 'Seçilen filtrelerle eşleşen kudos bulunamadı.'
                                    : 'Henüz kudos gönderilmemiş.'}
                            </p>
                        </div>
                    ) : (
                        filteredKudos.map(kudos => {
                            const category = kudosCategories.find(c => c.id === kudos.category);
                            return (
                                <div key={kudos.id} className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-4 hover:bg-slate-800 transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl">{category?.icon || '👏'}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-bold text-white">{kudos.senderName}</span>
                                                <span className="text-gray-400">→</span>
                                                <span className="font-bold text-purple-400">{kudos.recipientName}</span>
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                                                    {kudos.categoryLabel}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {kudos.recipientDepartment}
                                                </span>
                                            </div>
                                            <p className="text-gray-300 text-sm mb-2">{kudos.message}</p>
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
        </div>
    );
}

export default KudosFeed;
