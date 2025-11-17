import React, { useState, useEffect } from 'react';
import { Users, Shield, CreditCard, Ban, CheckCircle, RefreshCw } from 'lucide-react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../data/roles';

/**
 * Super Admin Panel - Müşteri Yönetimi
 * Sadece SUPER_ADMIN rolüne sahip kullanıcılar erişebilir
 * Vocaify işletmecisinin tüm müşterileri yönettiği panel
 */
function SuperAdmin() {
    const { currentUser } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        suspended: 0,
        starter: 0,
        professional: 0,
        enterprise: 0
    });

    // Tüm müşterileri (users) yükle
    useEffect(() => {
        loadAllCustomers();
    }, []);

    const loadAllCustomers = async () => {
        setLoading(true);
        try {
            // Firebase'deki tüm kullanıcıları çek
            const usersRef = collection(db, 'users');
            const usersSnapshot = await getDocs(usersRef);

            const customersList = [];
            usersSnapshot.forEach((doc) => {
                const userData = doc.data();
                // Super Admin'i listeden çıkar
                if (userData.role !== ROLES.SUPER_ADMIN) {
                    customersList.push({
                        id: doc.id,
                        ...userData
                    });
                }
            });

            setCustomers(customersList);
            calculateStats(customersList);
        } catch (error) {
            console.error('Müşteriler yüklenirken hata:', error);
            alert('Müşteriler yüklenemedi: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (customersList) => {
        const stats = {
            total: customersList.length,
            active: customersList.filter(c => !c.suspended).length,
            suspended: customersList.filter(c => c.suspended).length,
            starter: customersList.filter(c => c.subscriptionPlan === 'starter').length,
            professional: customersList.filter(c => c.subscriptionPlan === 'professional').length,
            enterprise: customersList.filter(c => c.subscriptionPlan === 'enterprise').length
        };
        setStats(stats);
    };

    const handleToggleSuspend = async (customerId, currentSuspendedStatus) => {
        const action = currentSuspendedStatus ? 'aktifleştir' : 'askıya al';
        const confirmMessage = `Bu müşteriyi ${action}mak istediğinizden emin misiniz?`;

        if (!window.confirm(confirmMessage)) return;

        try {
            const userRef = doc(db, 'users', customerId);
            await updateDoc(userRef, {
                suspended: !currentSuspendedStatus,
                suspendedAt: !currentSuspendedStatus ? new Date().toISOString() : null,
                suspendedBy: !currentSuspendedStatus ? currentUser?.email : null
            });

            // Listeyi güncelle
            setCustomers(customers.map(c =>
                c.id === customerId
                    ? { ...c, suspended: !currentSuspendedStatus }
                    : c
            ));

            calculateStats(customers.map(c =>
                c.id === customerId
                    ? { ...c, suspended: !currentSuspendedStatus }
                    : c
            ));

            alert(`Müşteri başarıyla ${action}ldı!`);
        } catch (error) {
            console.error('Müşteri durumu güncellenirken hata:', error);
            alert('İşlem başarısız: ' + error.message);
        }
    };

    // Rol badge rengi
    const getRoleBadgeColor = (role) => {
        const colors = {
            [ROLES.ADMIN]: 'bg-red-500/20 text-red-300 border-red-500/30',
            [ROLES.HIRING_MANAGER]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
            [ROLES.RECRUITER]: 'bg-green-500/20 text-green-300 border-green-500/30',
            [ROLES.INTERVIEWER]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
        };
        return colors[role] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    };

    // Abonelik badge rengi
    const getSubscriptionBadgeColor = (plan) => {
        const colors = {
            'starter': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
            'professional': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
            'enterprise': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
            'free': 'bg-gray-500/20 text-gray-300 border-gray-500/30'
        };
        return colors[plan] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Shield className="w-8 h-8 text-purple-400" />
                        Süper Admin Paneli
                    </h2>
                    <p className="text-gray-400">Vocaify müşteri yönetim sistemi</p>
                </div>

                <button
                    onClick={loadAllCustomers}
                    className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Yenile
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="glass p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-purple-400" />
                        <span className="text-gray-400 text-sm">Toplam Müşteri</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>

                <div className="glass p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-gray-400 text-sm">Aktif</span>
                    </div>
                    <p className="text-3xl font-bold text-green-400">{stats.active}</p>
                </div>

                <div className="glass p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <Ban className="w-5 h-5 text-red-400" />
                        <span className="text-gray-400 text-sm">Askıda</span>
                    </div>
                    <p className="text-3xl font-bold text-red-400">{stats.suspended}</p>
                </div>

                <div className="glass p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-5 h-5 text-purple-400" />
                        <span className="text-gray-400 text-sm">Başlangıç</span>
                    </div>
                    <p className="text-3xl font-bold text-purple-400">{stats.starter}</p>
                </div>

                <div className="glass p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-5 h-5 text-pink-400" />
                        <span className="text-gray-400 text-sm">Profesyonel</span>
                    </div>
                    <p className="text-3xl font-bold text-pink-400">{stats.professional}</p>
                </div>

                <div className="glass p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-5 h-5 text-orange-400" />
                        <span className="text-gray-400 text-sm">Kurumsal</span>
                    </div>
                    <p className="text-3xl font-bold text-orange-400">{stats.enterprise}</p>
                </div>
            </div>

            {/* Customers Table */}
            <div className="glass rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-800/50 border-b border-purple-500/20">
                            <tr>
                                <th className="text-left p-4 text-gray-400 font-semibold">Müşteri</th>
                                <th className="text-left p-4 text-gray-400 font-semibold">Email</th>
                                <th className="text-left p-4 text-gray-400 font-semibold">Rol</th>
                                <th className="text-left p-4 text-gray-400 font-semibold">Abonelik</th>
                                <th className="text-left p-4 text-gray-400 font-semibold">Kayıt Tarihi</th>
                                <th className="text-left p-4 text-gray-400 font-semibold">Durum</th>
                                <th className="text-center p-4 text-gray-400 font-semibold">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center p-8 text-gray-500">
                                        Henüz müşteri bulunmuyor
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        className={`border-b border-purple-500/10 hover:bg-slate-800/30 transition-all ${
                                            customer.suspended ? 'opacity-50' : ''
                                        }`}
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center text-white font-bold">
                                                    {customer.displayName?.charAt(0) || customer.email?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">
                                                        {customer.displayName || 'İsimsiz'}
                                                    </p>
                                                    <p className="text-gray-500 text-xs">ID: {customer.id.slice(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-gray-300">{customer.email}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(customer.role)}`}>
                                                {customer.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSubscriptionBadgeColor(customer.subscriptionPlan)}`}>
                                                {customer.subscriptionPlan || 'Free'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-gray-300 text-sm">
                                                {customer.createdAt
                                                    ? new Date(customer.createdAt).toLocaleDateString('tr-TR')
                                                    : 'Bilinmiyor'}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            {customer.suspended ? (
                                                <span className="flex items-center gap-1 text-red-400 text-sm">
                                                    <Ban className="w-4 h-4" />
                                                    Askıda
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-green-400 text-sm">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Aktif
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleToggleSuspend(customer.id, customer.suspended)}
                                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                                                        customer.suspended
                                                            ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                                                            : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                                                    }`}
                                                >
                                                    {customer.suspended ? 'Aktifleştir' : 'Askıya Al'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info Box */}
            <div className="glass p-6 rounded-xl border-l-4 border-purple-500">
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    Süper Admin Notları
                </h3>
                <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Askıya alınan müşteriler sistemde oturum açamaz</li>
                    <li>• Müşteri verileri silinmez, sadece erişim engellenir</li>
                    <li>• Tüm işlemler loglanır ve Firebase'e kaydedilir</li>
                    <li>• Abonelik bilgileri Stripe ile senkronize edilmelidir</li>
                </ul>
            </div>
        </div>
    );
}

export default SuperAdmin;
