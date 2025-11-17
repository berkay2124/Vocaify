import React from 'react';
import { Users, UserCheck, TrendingUp, Briefcase } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getStats } from '../utils/helpers';
import { STATUS_CONFIG } from '../config/constants';

/**
 * Dashboard sekmesini render eder
 * İstatistikler ve hızlı genel bakış kartları gösterir
 */
function Dashboard() {
    const { candidates, employees, openModal } = useApp();
    const stats = getStats(candidates, employees);

    const recentCandidates = [...candidates]
        .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
        .slice(0, 5);

    const recentEmployees = [...employees]
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        .slice(0, 5);

    return (
        <div className="space-y-6" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <h2 className="text-3xl font-bold text-white mb-6">Dashboard</h2>

            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Users}
                    title="Toplam Adaylar"
                    value={stats.totalCandidates}
                    color="from-blue-500 to-purple-500"
                />
                <StatCard
                    icon={UserCheck}
                    title="Aktif Personel"
                    value={stats.activeEmployees}
                    color="from-green-500 to-emerald-500"
                />
                <StatCard
                    icon={TrendingUp}
                    title="Toplam Havuz"
                    value={stats.totalPool}
                    color="from-purple-500 to-pink-500"
                />
                <StatCard
                    icon={Briefcase}
                    title="Tüm Personel"
                    value={stats.totalEmployees}
                    color="from-orange-500 to-red-500"
                />
            </div>

            {/* Son Adaylar ve Personeller */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Son Adaylar */}
                <div className="glass p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">Son Yüklenen Adaylar</h3>
                    <div className="space-y-3">
                        {recentCandidates.length > 0 ? (
                            recentCandidates.map(candidate => (
                                <MiniCard
                                    key={candidate.id}
                                    person={candidate}
                                    onClick={() => openModal('view', candidate)}
                                />
                            ))
                        ) : (
                            <p className="text-gray-400 text-center py-4">Henüz aday yüklenmedi</p>
                        )}
                    </div>
                </div>

                {/* Son Personeller */}
                <div className="glass p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">Son Eklenen Personeller</h3>
                    <div className="space-y-3">
                        {recentEmployees.length > 0 ? (
                            recentEmployees.map(employee => (
                                <MiniCard
                                    key={employee.id}
                                    person={employee}
                                    onClick={() => openModal('view', employee)}
                                />
                            ))
                        ) : (
                            <p className="text-gray-400 text-center py-4">Henüz personel eklenmedi</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, title, value, color }) {
    return (
        <div className="glass p-6 rounded-2xl hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-4xl font-bold text-white">{value}</span>
            </div>
            <p className="text-gray-300 font-medium">{title}</p>
        </div>
    );
}

function MiniCard({ person, onClick }) {
    return (
        <div
            onClick={onClick}
            className="p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all cursor-pointer"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center text-white font-bold">
                    {person.name.charAt(0)}
                </div>
                <div className="flex-1">
                    <p className="text-white font-medium">{person.name}</p>
                    <p className="text-gray-400 text-sm">{person.analysis.position}</p>
                </div>
                <span className={`px-3 py-1 ${STATUS_CONFIG[person.status].color} text-white text-xs rounded-full font-medium`}>
                    {STATUS_CONFIG[person.status].label}
                </span>
            </div>
        </div>
    );
}

export default Dashboard;
