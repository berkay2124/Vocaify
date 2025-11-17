import React, { useState } from 'react';
import { MessageSquare, Plus, Users, BarChart3, PieChart, TrendingUp, Clock, CheckCircle, X, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Employee Engagement Survey Admin Panel
 * İK yöneticileri için pulse survey yönetimi ve analitik
 * AŞAMA 22
 */
function SurveyAdmin() {
    const { candidates, setCandidates } = useApp();
    const { currentUser } = useAuth();

    // Demo surveys - gerçekte bunlar state veya Firebase'den gelecek
    const [surveys, setSurveys] = useState([
        {
            id: 1,
            name: 'Haftalık Mutluluk Anketi',
            description: 'Genel iş memnuniyetinizi ölçmek için haftalık anket',
            status: 'active',
            questions: [
                { id: 1, type: 'rating', question: 'Bu hafta işinizden ne kadar mutlusunuz?', required: true },
                { id: 2, type: 'rating', question: 'Takım arkadaşlarınızla iletişiminizi nasıl değerlendirirsiniz?', required: true },
                { id: 3, type: 'text', question: 'Bu hafta sizi en çok ne motive etti?', required: false }
            ],
            createdBy: 'İK Admin',
            createdDate: '2025-03-01',
            responses: []
        },
        {
            id: 2,
            name: 'Aylık Bağlılık Anketi',
            description: 'Organizasyonel bağlılık ve gelişim alanlarını değerlendirme',
            status: 'completed',
            questions: [
                { id: 1, type: 'rating', question: 'Şirket kültürünü nasıl değerlendirirsiniz?', required: true },
                { id: 2, type: 'rating', question: 'Kariyer gelişim fırsatlarından memnun musunuz?', required: true },
                { id: 3, type: 'rating', question: 'Yöneticinizden aldığınız desteği nasıl buluyorsunuz?', required: true },
                { id: 4, type: 'text', question: 'Şirketimizi geliştirmek için önerileriniz nelerdir?', required: false }
            ],
            createdBy: 'İK Admin',
            createdDate: '2025-02-01',
            responses: [] // Gerçekte burası dolu olacak
        }
    ]);

    // Yeni anket oluşturma
    const [showNewSurveyModal, setShowNewSurveyModal] = useState(false);
    const [newSurvey, setNewSurvey] = useState({
        name: '',
        description: '',
        questions: [
            { id: 1, type: 'rating', question: '', required: true }
        ]
    });

    // Sonuç görüntüleme
    const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [showResultsModal, setShowResultsModal] = useState(false);

    // Çalışanları filtrele
    const employees = candidates.filter(c => c.status === 'personel');

    // Soru ekleme
    const addQuestion = () => {
        setNewSurvey({
            ...newSurvey,
            questions: [
                ...newSurvey.questions,
                { id: Date.now(), type: 'rating', question: '', required: false }
            ]
        });
    };

    // Soru silme
    const removeQuestion = (questionId) => {
        setNewSurvey({
            ...newSurvey,
            questions: newSurvey.questions.filter(q => q.id !== questionId)
        });
    };

    // Soru güncelleme
    const updateQuestion = (questionId, field, value) => {
        setNewSurvey({
            ...newSurvey,
            questions: newSurvey.questions.map(q =>
                q.id === questionId ? { ...q, [field]: value } : q
            )
        });
    };

    // Anket oluştur
    const handleCreateSurvey = () => {
        if (!newSurvey.name || !newSurvey.description) {
            alert('Lütfen anket adı ve açıklaması girin.');
            return;
        }

        if (newSurvey.questions.some(q => !q.question)) {
            alert('Lütfen tüm soruları doldurun.');
            return;
        }

        const survey = {
            id: Date.now(),
            ...newSurvey,
            status: 'active',
            createdBy: currentUser?.displayName || currentUser?.email,
            createdDate: new Date().toISOString(),
            responses: []
        };

        setSurveys([...surveys, survey]);

        // Tüm çalışanlara bildirim olarak ekle
        const updatedCandidates = candidates.map(c => {
            if (c.status === 'personel') {
                return {
                    ...c,
                    pendingSurveys: [...(c.pendingSurveys || []), survey.id]
                };
            }
            return c;
        });
        setCandidates(updatedCandidates);

        setShowNewSurveyModal(false);
        setNewSurvey({
            name: '',
            description: '',
            questions: [{ id: 1, type: 'rating', question: '', required: true }]
        });

        alert('Anket başarıyla oluşturuldu ve tüm çalışanlara gönderildi!');
    };

    // Sonuçları hesapla (demo data)
    const calculateResults = (survey) => {
        // Demo sonuçlar - gerçekte survey.responses'tan gelecek
        const ratingQuestions = survey.questions.filter(q => q.type === 'rating');

        // Her soru için ortalama puan
        const questionResults = ratingQuestions.map((q, idx) => ({
            question: q.question.substring(0, 50) + (q.question.length > 50 ? '...' : ''),
            average: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0 arası rastgele
            responses: Math.floor(Math.random() * employees.length * 0.7 + employees.length * 0.3)
        }));

        // Genel dağılım
        const distribution = [
            { name: '5 Yıldız', value: Math.floor(Math.random() * 20 + 30) },
            { name: '4 Yıldız', value: Math.floor(Math.random() * 15 + 25) },
            { name: '3 Yıldız', value: Math.floor(Math.random() * 10 + 15) },
            { name: '2 Yıldız', value: Math.floor(Math.random() * 5 + 5) },
            { name: '1 Yıldız', value: Math.floor(Math.random() * 3 + 2) }
        ];

        // Genel ortalama
        const totalAvg = questionResults.reduce((sum, q) => sum + parseFloat(q.average), 0) / questionResults.length;

        return {
            questionResults,
            distribution,
            totalAverage: totalAvg.toFixed(1),
            responseRate: Math.floor(Math.random() * 20 + 70), // 70-90% arası
            totalResponses: Math.floor(employees.length * 0.8)
        };
    };

    const viewResults = (survey) => {
        setSelectedSurvey(survey);
        setShowResultsModal(true);
    };

    const statusColors = {
        active: 'bg-green-500/20 text-green-300 border-green-500/30',
        completed: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        draft: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };

    const statusLabels = {
        active: 'Aktif',
        completed: 'Tamamlandı',
        draft: 'Taslak'
    };

    const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

    return (
        <div className="space-y-6" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-purple-400" />
                        Vocaify Pulse - Bağlılık Anketleri
                    </h2>
                    <p className="text-gray-400">Çalışan mutluluğunu ve bağlılığını ölçün</p>
                </div>
                <button
                    onClick={() => setShowNewSurveyModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Anket Oluştur
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <MessageSquare className="w-8 h-8 text-purple-400" />
                        <span className="text-2xl font-bold text-white">{surveys.length}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Toplam Anket</p>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                        <span className="text-2xl font-bold text-white">
                            {surveys.filter(s => s.status === 'active').length}
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm">Aktif Anket</p>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <Users className="w-8 h-8 text-blue-400" />
                        <span className="text-2xl font-bold text-white">{employees.length}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Toplam Çalışan</p>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <Star className="w-8 h-8 text-yellow-400" />
                        <span className="text-2xl font-bold text-white">4.3</span>
                    </div>
                    <p className="text-gray-400 text-sm">Ortalama Puan</p>
                </div>
            </div>

            {/* Surveys List */}
            <div className="glass p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-purple-400" />
                    Anketler
                </h3>
                <div className="space-y-4">
                    {surveys.map((survey) => (
                        <div key={survey.id} className="bg-slate-800/50 p-5 rounded-lg border border-purple-500/20">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-white font-medium text-lg">{survey.name}</h4>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[survey.status]}`}>
                                            {statusLabels[survey.status]}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-2">{survey.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span>{survey.questions.length} Soru</span>
                                        <span>•</span>
                                        <span>{survey.createdBy} tarafından oluşturuldu</span>
                                        <span>•</span>
                                        <span>{new Date(survey.createdDate).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => viewResults(survey)}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all text-sm flex items-center gap-2"
                                >
                                    <BarChart3 className="w-4 h-4" />
                                    Sonuçları Gör
                                </button>
                            </div>

                            {/* Questions Preview */}
                            <div className="mt-3 pt-3 border-t border-purple-500/20">
                                <p className="text-gray-400 text-xs mb-2">Sorular:</p>
                                <div className="space-y-1">
                                    {survey.questions.slice(0, 3).map((q, idx) => (
                                        <div key={q.id} className="text-gray-500 text-xs flex items-start gap-2">
                                            <span className="text-purple-400">{idx + 1}.</span>
                                            <span>{q.question}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs ${q.type === 'rating' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}`}>
                                                {q.type === 'rating' ? '1-5 Puan' : 'Açık Uçlu'}
                                            </span>
                                        </div>
                                    ))}
                                    {survey.questions.length > 3 && (
                                        <p className="text-gray-600 text-xs">+{survey.questions.length - 3} soru daha...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* New Survey Modal */}
            {showNewSurveyModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 overflow-y-auto">
                    <div className="glass max-w-3xl w-full p-6 rounded-2xl my-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white">Yeni Bağlılık Anketi</h3>
                            <button
                                onClick={() => setShowNewSurveyModal(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">Anket Adı</label>
                                <input
                                    type="text"
                                    value={newSurvey.name}
                                    onChange={(e) => setNewSurvey({ ...newSurvey, name: e.target.value })}
                                    placeholder="Örn: Haftalık Mutluluk Anketi"
                                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">Açıklama</label>
                                <textarea
                                    value={newSurvey.description}
                                    onChange={(e) => setNewSurvey({ ...newSurvey, description: e.target.value })}
                                    rows="2"
                                    placeholder="Anketin amacını açıklayın..."
                                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all resize-none"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-gray-300 text-sm">Sorular</label>
                                    <button
                                        onClick={addQuestion}
                                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Soru Ekle
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {newSurvey.questions.map((q, idx) => (
                                        <div key={q.id} className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20">
                                            <div className="flex items-start gap-3 mb-3">
                                                <span className="text-purple-400 font-bold mt-2">{idx + 1}.</span>
                                                <div className="flex-1 space-y-2">
                                                    <input
                                                        type="text"
                                                        value={q.question}
                                                        onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                                                        placeholder="Sorunuzu girin..."
                                                        className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-purple-500/30 focus:border-purple-500 transition-all text-sm"
                                                    />
                                                    <div className="flex items-center gap-4">
                                                        <select
                                                            value={q.type}
                                                            onChange={(e) => updateQuestion(q.id, 'type', e.target.value)}
                                                            className="px-3 py-2 bg-slate-700 text-white rounded border border-purple-500/30 focus:border-purple-500 transition-all text-sm"
                                                        >
                                                            <option value="rating">1-5 Puanlama</option>
                                                            <option value="text">Açık Uçlu</option>
                                                        </select>
                                                        <label className="flex items-center gap-2 text-sm text-gray-400">
                                                            <input
                                                                type="checkbox"
                                                                checked={q.required}
                                                                onChange={(e) => updateQuestion(q.id, 'required', e.target.checked)}
                                                                className="rounded"
                                                            />
                                                            Zorunlu
                                                        </label>
                                                    </div>
                                                </div>
                                                {newSurvey.questions.length > 1 && (
                                                    <button
                                                        onClick={() => removeQuestion(q.id)}
                                                        className="text-red-400 hover:text-red-300 transition-colors mt-2"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                <p className="text-blue-300 text-sm">
                                    <strong>💡 Not:</strong> Anket tüm çalışanlara anonim olarak gönderilecektir.
                                    Yanıtlar toplu halde değerlendirilecek ve bireysel kimlikler gizli kalacaktır.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleCreateSurvey}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <MessageSquare className="w-5 h-5" />
                                Anketi Oluştur ve Gönder
                            </button>
                            <button
                                onClick={() => setShowNewSurveyModal(false)}
                                className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Modal */}
            {showResultsModal && selectedSurvey && (() => {
                const results = calculateResults(selectedSurvey);
                return (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 overflow-y-auto">
                        <div className="glass max-w-6xl w-full p-6 rounded-2xl my-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{selectedSurvey.name} - Sonuçlar</h3>
                                    <p className="text-gray-400 text-sm mt-1">Anonim ve toplu sonuçlar</p>
                                </div>
                                <button
                                    onClick={() => setShowResultsModal(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="glass p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm mb-1">Ortalama Puan</p>
                                    <div className="flex items-center gap-2">
                                        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                                        <span className="text-3xl font-bold text-white">{results.totalAverage}</span>
                                        <span className="text-gray-400">/5.0</span>
                                    </div>
                                </div>
                                <div className="glass p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm mb-1">Katılım Oranı</p>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-6 h-6 text-blue-400" />
                                        <span className="text-3xl font-bold text-white">{results.responseRate}%</span>
                                    </div>
                                </div>
                                <div className="glass p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm mb-1">Toplam Yanıt</p>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-6 h-6 text-green-400" />
                                        <span className="text-3xl font-bold text-white">{results.totalResponses}</span>
                                        <span className="text-gray-400">/ {employees.length}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                {/* Bar Chart - Soru Bazlı Ortalamalar */}
                                <div className="glass p-4 rounded-lg">
                                    <h4 className="text-white font-medium mb-4">Soru Bazlı Ortalama Puanlar</h4>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={results.questionResults}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                            <XAxis dataKey="question" stroke="#888" tick={{ fill: '#888', fontSize: 12 }} />
                                            <YAxis domain={[0, 5]} stroke="#888" tick={{ fill: '#888' }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #8b5cf6', borderRadius: '8px' }}
                                                labelStyle={{ color: '#fff' }}
                                            />
                                            <Bar dataKey="average" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Pie Chart - Puan Dağılımı */}
                                <div className="glass p-4 rounded-lg">
                                    <h4 className="text-white font-medium mb-4">Puan Dağılımı</h4>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <RePieChart>
                                            <Pie
                                                data={results.distribution}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {results.distribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Detailed Results Table */}
                            <div className="glass p-4 rounded-lg">
                                <h4 className="text-white font-medium mb-4">Detaylı Sonuçlar</h4>
                                <div className="space-y-3">
                                    {results.questionResults.map((qr, idx) => (
                                        <div key={idx} className="bg-slate-800/50 p-4 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-white text-sm">{selectedSurvey.questions[idx]?.question}</p>
                                                <div className="flex items-center gap-2">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                    <span className="text-white font-bold">{qr.average}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-400 text-xs">{qr.responses} yanıt</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setShowResultsModal(false)}
                                className="w-full mt-6 px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}

export default SurveyAdmin;
