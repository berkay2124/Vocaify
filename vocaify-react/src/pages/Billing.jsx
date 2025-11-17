import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Check, Zap, Crown, Building2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Stripe publishable key (production'da environment variable'dan alın)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo');

/**
 * Billing (Faturalama) Sayfası
 * Fiyatlandırma planlarını gösterir ve Stripe Checkout entegrasyonu sağlar
 */
function Billing() {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Sahte abonelik durumu (production'da Firestore'dan gelecek)
    const [subscription, setSubscription] = useState({
        active: false,
        plan: null,
        endDate: null,
        status: 'none' // 'none', 'active', 'cancelled', 'past_due'
    });

    /**
     * Stripe Checkout'a yönlendirir
     * @param {string} planId - Plan ID'si
     * @param {number} price - Plan fiyatı
     */
    const handleCheckout = async (planId, planName, price) => {
        if (!currentUser) {
            alert('Lütfen önce giriş yapın.');
            return;
        }

        setLoading(true);
        setSelectedPlan(planId);

        try {
            // Production'da backend'e istek atılacak ve checkout session oluşturulacak
            // Şimdilik demo amaçlı simüle ediyoruz

            if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
                console.warn('⚠️ Stripe API key yapılandırılmamış. Demo modu.');
                alert(`Demo Mod: ${planName} planı için ödeme işlemi başlatılacaktı.\n\nProduction'da gerçek Stripe Checkout'a yönlendirilirsiniz.`);
                setLoading(false);
                setSelectedPlan(null);
                return;
            }

            // Backend endpoint'e istek at (şimdilik simüle)
            // const response = await fetch('/api/create-checkout-session', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         planId,
            //         userId: currentUser.uid,
            //         email: currentUser.email
            //     })
            // });
            // const session = await response.json();

            // Stripe Checkout'a yönlendir
            // const stripe = await stripePromise;
            // const { error } = await stripe.redirectToCheckout({
            //     sessionId: session.id
            // });

            // Geçici demo simülasyonu
            setTimeout(() => {
                alert(`✅ ${planName} planı için Stripe Checkout açılacaktı!\n\nŞimdilik demo modunda çalışıyoruz.`);
                setLoading(false);
                setSelectedPlan(null);
            }, 1500);

        } catch (error) {
            console.error('Checkout hatası:', error);
            alert('Ödeme işlemi başlatılırken bir hata oluştu.');
            setLoading(false);
            setSelectedPlan(null);
        }
    };

    /**
     * Aboneliği iptal eder
     */
    const handleCancelSubscription = () => {
        if (window.confirm('Aboneliğinizi iptal etmek istediğinizden emin misiniz?')) {
            // Production'da backend API'sine istek atılacak
            alert('Demo: Abonelik iptal işlemi başlatılacaktı.');
        }
    };

    return (
        <div className="min-h-screen py-8">
            {/* Abonelik Durumu */}
            {subscription.active && (
                <div className="max-w-7xl mx-auto mb-8">
                    <div className="glass p-6 rounded-2xl border-2 border-green-500/30">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                    <Check className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Aktif Abonelik</h3>
                                    <p className="text-gray-400">
                                        {subscription.plan} planı - Sonraki ödeme: {subscription.endDate}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleCancelSubscription}
                                className="px-6 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-all"
                            >
                                Aboneliği İptal Et
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Başlık */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                    Şeffaf <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Fiyatlandırma</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    İhtiyacınıza uygun planı seçin, istediğiniz zaman iptal edin
                </p>
            </div>

            {/* Fiyatlandırma Planları */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Başlangıç Planı */}
                <div className="glass p-8 rounded-2xl hover:scale-105 transition-transform">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Zap className="w-8 h-8 text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Başlangıç</h3>
                        <p className="text-gray-400 mb-6">Küçük ekipler için</p>
                        <div className="mb-4">
                            <span className="text-5xl font-black text-white">₺2,999</span>
                            <span className="text-gray-400">/ay</span>
                        </div>
                        <p className="text-sm text-gray-500">Yıllık ödeme ile %20 indirim</p>
                    </div>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                            50 CV/ay AI analizi
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                            Akıllı arama
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                            KPI değerlendirme
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                            Temel raporlar
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                            Email desteği
                        </li>
                    </ul>

                    <button
                        onClick={() => handleCheckout('starter', 'Başlangıç', 2999)}
                        disabled={loading && selectedPlan === 'starter'}
                        className="w-full px-6 py-3 border-2 border-purple-500 text-purple-400 font-semibold rounded-xl hover:bg-purple-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading && selectedPlan === 'starter' ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                İşleniyor...
                            </span>
                        ) : 'Başlayın'}
                    </button>
                </div>

                {/* Profesyonel Planı */}
                <div className="glass p-8 rounded-2xl border-2 border-purple-500 hover:scale-105 transition-transform relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full shadow-lg">
                            En Popüler
                        </span>
                    </div>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Crown className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Profesyonel</h3>
                        <p className="text-gray-400 mb-6">Büyüyen şirketler için</p>
                        <div className="mb-4">
                            <span className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">₺6,999</span>
                            <span className="text-gray-400">/ay</span>
                        </div>
                        <p className="text-sm text-gray-500">Yıllık ödeme ile %20 indirim</p>
                    </div>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                            <strong>Sınırsız</strong> CV analizi
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                            Gelişmiş AI eşleştirme
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                            Yaşam döngüsü yönetimi
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                            Performans takibi
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                            Gelişmiş raporlama
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                            Öncelikli destek
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                            API entegrasyonu
                        </li>
                    </ul>

                    <button
                        onClick={() => handleCheckout('professional', 'Profesyonel', 6999)}
                        disabled={loading && selectedPlan === 'professional'}
                        className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading && selectedPlan === 'professional' ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                İşleniyor...
                            </span>
                        ) : 'Hemen Başlayın'}
                    </button>
                </div>

                {/* Kurumsal Planı */}
                <div className="glass p-8 rounded-2xl hover:scale-105 transition-transform">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Building2 className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Kurumsal</h3>
                        <p className="text-gray-400 mb-6">Büyük organizasyonlar için</p>
                        <div className="mb-4">
                            <span className="text-5xl font-black text-white">Özel</span>
                        </div>
                        <p className="text-sm text-gray-500">İhtiyaçlarınıza özel paket</p>
                    </div>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                            Profesyonel'deki her şey
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                            Özel AI modeli eğitimi
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                            Çoklu şirket yönetimi
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                            Özel entegrasyonlar
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                            Özel sunucu seçeneği
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                            7/24 premium destek
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                            Eğitim ve danışmanlık
                        </li>
                    </ul>

                    <button
                        onClick={() => handleCheckout('enterprise', 'Kurumsal', 0)}
                        disabled={loading && selectedPlan === 'enterprise'}
                        className="w-full px-6 py-3 border-2 border-blue-500 text-blue-400 font-semibold rounded-xl hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading && selectedPlan === 'enterprise' ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                İşleniyor...
                            </span>
                        ) : 'İletişime Geçin'}
                    </button>
                </div>
            </div>

            {/* Bilgilendirme */}
            <div className="max-w-7xl mx-auto mt-12">
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="text-lg font-bold text-white mb-2">Ödeme Bilgilendirmesi</h4>
                            <ul className="text-gray-400 space-y-2">
                                <li>• Tüm ödemeler Stripe ile güvenli bir şekilde işlenir</li>
                                <li>• İstediğiniz zaman iptal edebilirsiniz, erken iptal ücreti yoktur</li>
                                <li>• Yıllık planlar için %20 indirim uygulanır</li>
                                <li>• Faturalar otomatik olarak email adresinize gönderilir</li>
                                <li>• 14 gün para iade garantisi (sorulsuz sualsiz)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Billing;
