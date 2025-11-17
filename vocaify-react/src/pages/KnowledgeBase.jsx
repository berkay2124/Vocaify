import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
    BookOpen,
    Plus,
    Edit,
    Trash2,
    Search,
    FileText,
    Calendar,
    User,
    Tag,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

/**
 * Knowledge Base Component
 *
 * HR Admin panel for managing internal knowledge base documents.
 * These documents are used by the AI Chatbot to answer employee questions.
 *
 * AŞAMA 24: AI Chatbot & Knowledge Base
 */
function KnowledgeBase() {
    const { candidates, setCandidates } = useApp();
    const { currentUser } = useAuth();

    // Knowledge base stored in context (in production, use Firestore)
    const [knowledgeBase, setKnowledgeBase] = useState([
        {
            id: 1,
            title: 'Yıllık İzin Politikası',
            category: 'İzin Politikaları',
            content: `# Yıllık İzin Politikası

## Genel Kurallar
- Tüm çalışanlar yılda 14 iş günü yıllık izin hakkına sahiptir.
- 5+ yıl kıdemi olan çalışanlar 20 gün, 10+ yıl kıdemi olanlar 26 gün izin kullanabilir.
- Yıllık izinler, yönetici onayı ile kullanılabilir.
- İzin talepleri en az 2 hafta önceden bildirilmelidir.

## İzin Biriktirme
- Kullanılmayan izinler bir sonraki yıla devredilebilir (maksimum 10 gün).
- 2 yıl üst üste kullanılmayan izinler iptal olur.

## Acil İzin
- Acil durumlarda (hastalık, ölüm vb.) izin süresi esnetilebilir.
- Acil izinler için belgeler gereklidir.`,
            createdBy: 'İK Departmanı',
            createdDate: '2025-11-01T10:00:00Z',
            lastModified: '2025-11-15T14:30:00Z'
        },
        {
            id: 2,
            title: 'Evden Çalışma Kuralları',
            category: 'Çalışma Kuralları',
            content: `# Evden Çalışma (Remote Work) Politikası

## Uygunluk
- Tüm yazılım geliştirme ve tasarım ekipleri haftada 3 gün evden çalışabilir.
- Satış ve müşteri hizmetleri ekipleri haftada 1 gün evden çalışabilir.
- Yönetici onayı ile tam zamanlı uzaktan çalışma mümkündür.

## Gereksinimler
- Kararlı internet bağlantısı (minimum 25 Mbps)
- Sessiz ve profesyonel çalışma ortamı
- Mesai saatlerinde (09:00-18:00) erişilebilir olmak
- Tüm toplantılara kamera açık katılmak

## İletişim
- Slack'te her zaman aktif olmak
- E-postalara 2 saat içinde cevap vermek
- Haftalık takım toplantılarına katılım zorunludur

## Ekipman
- Şirket laptop'u evde kullanılabilir
- Monitor, klavye gibi ekipman talep edilebilir
- VPN kullanımı zorunludur`,
            createdBy: 'İK Departmanı',
            createdDate: '2025-10-15T09:00:00Z',
            lastModified: '2025-11-10T11:20:00Z'
        },
        {
            id: 3,
            title: 'Sağlık Sigortası ve Yan Haklar',
            category: 'Yan Haklar',
            content: `# Sağlık Sigortası ve Yan Haklar

## Sağlık Sigortası
- Tüm çalışanlar özel sağlık sigortası (Allianz Sigorta) ile kapsanır.
- Sigorta, çalışan + eş + 2 çocuk kapsar.
- Yıllık teminat: 50.000 TL
- Diş tedavisi: Yıllık 5.000 TL
- Gözlük: 2 yılda bir, 1.500 TL

## Yemek Kartı
- Aylık 1.500 TL yemek kartı yüklenir.
- Tüm market ve restoranlarda geçerlidir.

## Eğitim Bütçesi
- Her çalışan yıllık 10.000 TL eğitim bütçesine sahiptir.
- Online kurslar, konferanslar, sertifikalar için kullanılabilir.
- Yönetici onayı gereklidir.

## Spor Salonu
- Anlaşmalı spor salonlarında %50 indirim
- Yoga, pilates derslerine ücretsiz katılım

## Doğum İzni
- Annelere 180 gün ücretli doğum izni (yasal 112 gün + şirket 68 gün)
- Babalara 10 gün ücretli babalık izni`,
            createdBy: 'İK Departmanı',
            createdDate: '2025-09-20T13:00:00Z',
            lastModified: '2025-11-01T16:45:00Z'
        },
        {
            id: 4,
            title: 'Performans Değerlendirme Süreci',
            category: 'İK Prosedürleri',
            content: `# Performans Değerlendirme Süreci

## Değerlendirme Dönemleri
- Yılda 2 kere: Q2 (Haziran) ve Year-End (Aralık)
- Her değerlendirme öncesi OKR'lar güncellenir

## OKR (Objectives and Key Results)
- Her çalışan çeyrek başında 1 Objective ve 3 Key Result belirler
- Yönetici OKR'ları onaylar
- Çeyrek sonunda ilerleme raporlanır

## Değerlendirme Kriterleri
1. OKR Tamamlanma Oranı (40%)
2. Takım Çalışması ve İletişim (20%)
3. Teknik Beceriler / Yetkinlik (20%)
4. İnovasyon ve Girişimcilik (10%)
5. Şirket Değerlerine Uyum (10%)

## Puanlama
- 5 yıldız: Beklentilerin üzerinde
- 4 yıldız: Beklentileri karşılıyor
- 3 yıldız: Gelişim gerekiyor
- 1-2 yıldız: Performans planı gerekiyor

## Terfi ve Maaş Artışı
- 4.5+ puan alanlar terfi için değerlendirilir
- Maaş artışları yıllık %10-25 arasında değişir
- En yüksek performans gösterenler bonus alır`,
            createdBy: 'İK Departmanı',
            createdDate: '2025-11-12T10:30:00Z',
            lastModified: '2025-11-16T09:15:00Z'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingDoc, setEditingDoc] = useState(null);

    const [newDoc, setNewDoc] = useState({
        title: '',
        category: 'İzin Politikaları',
        content: ''
    });

    // Categories for knowledge base
    const categories = [
        'İzin Politikaları',
        'Çalışma Kuralları',
        'Yan Haklar',
        'İK Prosedürleri',
        'Şirket Politikaları',
        'Teknoloji ve Araçlar',
        'Diğer'
    ];

    // Filter documents
    const filteredDocs = knowledgeBase.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             doc.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Create or update document
    const handleSaveDoc = () => {
        if (!newDoc.title.trim() || !newDoc.content.trim()) {
            alert('Lütfen başlık ve içerik alanlarını doldurun.');
            return;
        }

        if (editingDoc) {
            // Update existing document
            const updatedDocs = knowledgeBase.map(doc => {
                if (doc.id === editingDoc.id) {
                    return {
                        ...doc,
                        title: newDoc.title,
                        category: newDoc.category,
                        content: newDoc.content,
                        lastModified: new Date().toISOString()
                    };
                }
                return doc;
            });
            setKnowledgeBase(updatedDocs);
            alert('Döküman başarıyla güncellendi!');
        } else {
            // Create new document
            const doc = {
                id: Date.now(),
                title: newDoc.title,
                category: newDoc.category,
                content: newDoc.content,
                createdBy: currentUser?.displayName || currentUser?.email || 'İK Departmanı',
                createdDate: new Date().toISOString(),
                lastModified: new Date().toISOString()
            };
            setKnowledgeBase([...knowledgeBase, doc]);
            alert('Döküman başarıyla eklendi!');
        }

        // Reset form
        setNewDoc({ title: '', category: 'İzin Politikaları', content: '' });
        setShowCreateModal(false);
        setEditingDoc(null);
    };

    // Delete document
    const handleDeleteDoc = (docId) => {
        if (!window.confirm('Bu dökümanı silmek istediğinizden emin misiniz?')) {
            return;
        }
        setKnowledgeBase(knowledgeBase.filter(doc => doc.id !== docId));
        alert('Döküman başarıyla silindi!');
    };

    // Edit document
    const handleEditDoc = (doc) => {
        setEditingDoc(doc);
        setNewDoc({
            title: doc.title,
            category: doc.category,
            content: doc.content
        });
        setShowCreateModal(true);
    };

    // Get category color
    const getCategoryColor = (category) => {
        const colors = {
            'İzin Politikaları': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            'Çalışma Kuralları': 'bg-green-500/20 text-green-400 border-green-500/30',
            'Yan Haklar': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            'İK Prosedürleri': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
            'Şirket Politikaları': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
            'Teknoloji ve Araçlar': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
            'Diğer': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        };
        return colors[category] || colors['Diğer'];
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-purple-400" />
                            Bilgi Bankası
                        </h1>
                        <p className="text-gray-300">
                            AI Chatbot için İK dökümanlarını yönetin
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingDoc(null);
                            setNewDoc({ title: '', category: 'İzin Politikaları', content: '' });
                            setShowCreateModal(true);
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Yeni Döküman Ekle
                    </button>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-blue-300 text-sm">
                        <strong>💡 Bilgi:</strong> Buraya eklediğiniz dökümanlar, çalışanların AI chatbot asistanına sorduğu
                        sorulara cevap vermek için kullanılır. Politikalarınızı ve prosedürlerinizi detaylı şekilde ekleyin.
                    </p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="glass p-6 rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Döküman ara..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-800 text-white rounded-xl border border-purple-500/30 focus:border-purple-500 transition-all"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-3 bg-slate-800 text-white rounded-xl border border-purple-500/30 focus:border-purple-500 transition-all"
                    >
                        <option value="all">Tüm Kategoriler</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-400" />
                        <div>
                            <div className="text-2xl font-bold text-white">{knowledgeBase.length}</div>
                            <div className="text-sm text-gray-400">Toplam Döküman</div>
                        </div>
                    </div>
                </div>
                <div className="glass p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                        <Tag className="w-8 h-8 text-green-400" />
                        <div>
                            <div className="text-2xl font-bold text-white">{categories.length}</div>
                            <div className="text-sm text-gray-400">Kategori</div>
                        </div>
                    </div>
                </div>
                <div className="glass p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-purple-400" />
                        <div>
                            <div className="text-2xl font-bold text-white">
                                {knowledgeBase.filter(d => {
                                    const daysSince = (Date.now() - new Date(d.createdDate)) / (1000 * 60 * 60 * 24);
                                    return daysSince <= 7;
                                }).length}
                            </div>
                            <div className="text-sm text-gray-400">Son 7 Gün</div>
                        </div>
                    </div>
                </div>
                <div className="glass p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-yellow-400" />
                        <div>
                            <div className="text-2xl font-bold text-white">{filteredDocs.length}</div>
                            <div className="text-sm text-gray-400">Filtrelenmiş</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Documents List */}
            <div className="glass p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-4">Dökümanlar</h2>

                {filteredDocs.length === 0 ? (
                    <div className="text-center py-12">
                        <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">Döküman bulunamadı.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredDocs.map(doc => (
                            <div
                                key={doc.id}
                                className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-5 hover:bg-slate-800 transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white">{doc.title}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(doc.category)}`}>
                                                {doc.category}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                {doc.createdBy}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                Oluşturuldu: {new Date(doc.createdDate).toLocaleDateString('tr-TR')}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                Güncellendi: {new Date(doc.lastModified).toLocaleDateString('tr-TR')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEditDoc(doc)}
                                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDoc(doc.id)}
                                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-slate-900/50 rounded-lg p-4 max-h-40 overflow-y-auto">
                                    <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">
                                        {doc.content.substring(0, 300)}{doc.content.length > 300 ? '...' : ''}
                                    </pre>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30">
                        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingDoc ? 'Dökümanı Düzenle' : 'Yeni Döküman Ekle'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setEditingDoc(null);
                                        setNewDoc({ title: '', category: 'İzin Politikaları', content: '' });
                                    }}
                                    className="text-white/70 hover:text-white text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Döküman Başlığı *
                                </label>
                                <input
                                    type="text"
                                    value={newDoc.title}
                                    onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                                    placeholder="örn: Yıllık İzin Politikası"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Kategori *
                                </label>
                                <select
                                    value={newDoc.category}
                                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    İçerik * (Markdown desteklenir)
                                </label>
                                <textarea
                                    value={newDoc.content}
                                    onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                                    rows="15"
                                    placeholder="Döküman içeriğini buraya yazın... Markdown formatında yazabilirsiniz."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors font-mono resize-none"
                                />
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                <p className="text-yellow-300 text-sm">
                                    <strong>💡 İpucu:</strong> Dökümanınızı detaylı yazın. AI chatbot bu içeriği kullanarak
                                    çalışanların sorularını yanıtlayacak. Başlıklar, listeler ve net açıklamalar kullanın.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setEditingDoc(null);
                                        setNewDoc({ title: '', category: 'İzin Politikaları', content: '' });
                                    }}
                                    className="flex-1 px-6 py-3 rounded-xl font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleSaveDoc}
                                    className="flex-1 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                                >
                                    {editingDoc ? 'Güncelle' : 'Kaydet'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default KnowledgeBase;
