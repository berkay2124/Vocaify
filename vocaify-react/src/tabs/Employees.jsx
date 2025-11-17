import React from 'react';
import { Eye, UserMinus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STATUS_CONFIG, EMPLOYEE_STAGES } from '../config/constants';
import { formatDate } from '../utils/helpers';

/**
 * Personeller sekmesini render eder
 * Filtreleme ve personel kartlarını listeler
 */
function Employees() {
    const {
        employees,
        setEmployees,
        filterStatus,
        setFilterStatus,
        openModal
    } = useApp();

    // Filtrelenmiş personeller
    const filteredEmployees = employees.filter(e => {
        return filterStatus === 'all' || e.status === filterStatus;
    });

    // Personeli çıkış sürecine al
    const moveEmployeeToExit = (employeeId) => {
        if (!window.confirm('Bu personelin çıkış işlemini başlatmak istediğinizden emin misiniz?')) {
            return;
        }

        setEmployees(employees.map(e => {
            if (e.id === employeeId) {
                const newHistoryEntry = {
                    status: 'eski-personel',
                    date: new Date().toISOString(),
                    note: 'Çıkış işlemi yapıldı.'
                };

                return {
                    ...e,
                    status: 'eski-personel',
                    exitDate: new Date().toISOString(),
                    statusHistory: [...(e.statusHistory || []), newHistoryEntry]
                };
            }
            return e;
        }));
    };

    return (
        <div className="space-y-6" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <h2 className="text-3xl font-bold text-white mb-6">Personeller ({filteredEmployees.length})</h2>

            {/* Filtreler */}
            <div className="glass p-4 rounded-xl">
                <label className="text-gray-300 text-sm mb-2 block">Durum Filtresi</label>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 bg-slate-700 border border-purple-500/30 rounded-lg text-white"
                >
                    <option value="all">Tümü</option>
                    {EMPLOYEE_STAGES.map(stage => (
                        <option key={stage} value={stage}>
                            {STATUS_CONFIG[stage].label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Personel Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map(employee => (
                    <EmployeeCard
                        key={employee.id}
                        employee={employee}
                        onView={() => openModal('view', employee)}
                        onExit={() => moveEmployeeToExit(employee.id)}
                    />
                ))}
                {filteredEmployees.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-400 text-lg">Filtreye uygun personel bulunamadı</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function EmployeeCard({ employee, onView, onExit }) {
    const isActive = employee.status === 'personel';

    return (
        <div className="glass p-6 rounded-2xl hover:scale-105 transition-transform">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {employee.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-white font-bold">{employee.name}</h3>
                        <p className="text-green-300 text-sm">{employee.analysis.position}</p>
                    </div>
                </div>
                <span className={`px-3 py-1 ${STATUS_CONFIG[employee.status].color} text-white text-xs rounded-full font-medium`}>
                    {STATUS_CONFIG[employee.status].label}
                </span>
            </div>

            <div className="space-y-2 mb-4">
                <p className="text-gray-300 text-sm">
                    <strong>Başlangıç:</strong> {formatDate(employee.startDate)}
                </p>
                <p className="text-gray-300 text-sm">
                    <strong>Deneyim:</strong> {employee.analysis.experience_years} yıl
                </p>
                {employee.performanceReviews && employee.performanceReviews.length > 0 && (
                    <p className="text-gray-300 text-sm">
                        <strong>Son Değerlendirme:</strong> {employee.performanceReviews[0].score}/10
                    </p>
                )}
                {employee.totalKpiScore > 0 && (
                    <p className="text-gray-300 text-sm">
                        <strong>KPI Skoru:</strong> {employee.totalKpiScore}/100
                    </p>
                )}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={onView}
                    className="flex-1 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all flex items-center justify-center gap-2"
                >
                    <Eye className="w-4 h-4" />
                    Detay
                </button>
                {isActive && (
                    <button
                        onClick={onExit}
                        className="flex-1 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                    >
                        <UserMinus className="w-4 h-4" />
                        Çıkış
                    </button>
                )}
            </div>
        </div>
    );
}

export default Employees;
