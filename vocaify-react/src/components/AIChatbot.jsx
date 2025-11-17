import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader, Bot, User as UserIcon } from 'lucide-react';
import Anthropic from '@anthropic-ai/sdk';

/**
 * AI Chatbot Component
 *
 * Employee-facing AI assistant that answers questions using the knowledge base.
 * Uses Claude API with RAG (Retrieval-Augmented Generation) pattern.
 *
 * AŞAMA 24: AI Chatbot & Knowledge Base
 */
function AIChatbot({ employeeName, employeeEmail }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            content: `Merhaba ${employeeName || 'değerli çalışanımız'}! 👋\n\nBen Vocaify AI Asistanınızım. Size şirket politikaları, İK prosedürleri ve yan haklar hakkında yardımcı olabilirim.\n\nÖrnek sorular:\n• "Kaç gün yıllık iznim var?"\n• "Evden çalışma kuralları nedir?"\n• "Sağlık sigortası neyi kapsar?"\n• "Performans değerlendirmesi nasıl yapılır?"\n\nSormak istediğiniz bir şey var mı?`,
            timestamp: new Date().toISOString()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Demo knowledge base (in production, fetch from context/Firestore)
    const knowledgeBase = [
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
- Acil izinler için belgeler gereklidir.`
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
- VPN kullanımı zorunludur`
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
- Babalara 10 gün ücretli babalık izni`
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
- En yüksek performans gösterenler bonus alır`
        }
    ];

    /**
     * Search knowledge base for relevant documents
     * Simple keyword-based search (in production, use vector embeddings)
     */
    const searchKnowledgeBase = (query) => {
        const queryLower = query.toLowerCase();
        const keywords = queryLower.split(' ').filter(w => w.length > 2);

        // Score each document based on keyword matches
        const scoredDocs = knowledgeBase.map(doc => {
            let score = 0;
            const contentLower = (doc.title + ' ' + doc.content).toLowerCase();

            keywords.forEach(keyword => {
                // Title matches worth more
                if (doc.title.toLowerCase().includes(keyword)) score += 3;
                // Content matches
                const matches = (contentLower.match(new RegExp(keyword, 'g')) || []).length;
                score += matches;
            });

            return { doc, score };
        });

        // Return top 2 most relevant documents
        return scoredDocs
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 2)
            .map(item => item.doc);
    };

    /**
     * Send message to AI with knowledge base context
     */
    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: inputMessage,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            // 1. Search knowledge base for relevant documents
            const relevantDocs = searchKnowledgeBase(inputMessage);

            // 2. Build context from relevant documents
            let context = '';
            if (relevantDocs.length > 0) {
                context = 'İlgili Şirket Dökümanları:\n\n';
                relevantDocs.forEach((doc, idx) => {
                    context += `--- ${doc.title} (${doc.category}) ---\n${doc.content}\n\n`;
                });
            } else {
                context = 'Bilgi bankasında bu konuyla ilgili döküman bulunamadı.\n\n';
            }

            // 3. Call Claude API with RAG pattern
            const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || process.env.REACT_APP_ANTHROPIC_API_KEY;

            if (!apiKey) {
                // Demo mode - generate fake response
                console.warn('⚠️ Anthropic API key bulunamadı. Demo modu aktif.');

                const demoResponse = await generateDemoResponse(inputMessage, relevantDocs);

                const assistantMessage = {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: demoResponse,
                    timestamp: new Date().toISOString()
                };

                setMessages(prev => [...prev, assistantMessage]);
                setIsLoading(false);
                return;
            }

            // Real API call
            const client = new Anthropic({
                apiKey: apiKey,
                dangerouslyAllowBrowser: true
            });

            const response = await client.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1024,
                system: `Sen Vocaify şirketinin İK asistanısın. Çalışanlara şirket politikaları, İK prosedürleri ve yan haklar hakkında yardımcı oluyorsun.

ÖNEMLI KURALLAR:
1. Sadece verilen dökümanlardan bilgi ver. Bilmediğin bir şey sorulursa "Bu konuda bilgi bankamızda döküman bulamadım. Lütfen İK departmanı ile iletişime geçin." de.
2. Kısa, öz ve dostane cevaplar ver. Türkçe yaz.
3. Gerekirse madde madde açıkla.
4. Çalışanın adı: ${employeeName || 'Değerli çalışanımız'}

${context}`,
                messages: [
                    {
                        role: 'user',
                        content: inputMessage
                    }
                ]
            });

            const aiContent = response.content[0].text;

            const assistantMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: aiContent,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, assistantMessage]);

        } catch (error) {
            console.error('AI Chatbot error:', error);

            const errorMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                content: '❌ Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin veya İK departmanı ile iletişime geçin.',
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Generate demo response when API key is not available
     */
    const generateDemoResponse = async (query, relevantDocs) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (relevantDocs.length === 0) {
            return '❌ Bu konuda bilgi bankamızda döküman bulamadım. Lütfen İK departmanı ile iletişime geçin.';
        }

        const queryLower = query.toLowerCase();

        // Simple rule-based responses for demo
        if (queryLower.includes('izin') || queryLower.includes('tatil')) {
            return `📅 **Yıllık İzin Politikamız:**

Tüm çalışanlarımız yılda **14 iş günü** yıllık izin hakkına sahiptir.

**Kıdeme göre artış:**
• 5+ yıl kıdemi: 20 gün
• 10+ yıl kıdemi: 26 gün

**Önemli kurallar:**
✓ İzin talepleri en az 2 hafta önceden bildirilmeli
✓ Kullanılmayan izinler bir sonraki yıla devredilebilir (max 10 gün)
✓ Yönetici onayı gereklidir

İzin talebinizi Çalışan Portalındaki "İzin Talebi" sekmesinden gönderebilirsiniz.`;
        }

        if (queryLower.includes('evden') || queryLower.includes('remote') || queryLower.includes('uzaktan')) {
            return `🏠 **Evden Çalışma Politikamız:**

**Uygunluk:**
• Yazılım ve tasarım ekipleri: Haftada 3 gün
• Satış ve müşteri hizmetleri: Haftada 1 gün
• Yönetici onayı ile tam zamanlı uzaktan çalışma mümkün

**Gereksinimler:**
✓ Kararlı internet (min 25 Mbps)
✓ Mesai saatlerinde erişilebilir olma (09:00-18:00)
✓ Toplantılara kamera açık katılım
✓ VPN kullanımı zorunlu

**Ekipman:**
Şirket laptop'u evde kullanılabilir. İhtiyacınız olan ekipmanları talep edebilirsiniz.`;
        }

        if (queryLower.includes('sağlık') || queryLower.includes('sigorta') || queryLower.includes('yan hak')) {
            return `🏥 **Sağlık Sigortası ve Yan Haklarınız:**

**Sağlık Sigortası (Allianz):**
• Kapsam: Siz + eşiniz + 2 çocuğunuz
• Yıllık teminat: 50.000 TL
• Diş tedavisi: 5.000 TL/yıl
• Gözlük: 1.500 TL (2 yılda bir)

**Diğer Yan Haklar:**
💳 Yemek kartı: 1.500 TL/ay
📚 Eğitim bütçesi: 10.000 TL/yıl
🏋️ Spor salonu: %50 indirim
👶 Doğum izni: Anneler 180 gün, babalar 10 gün

Tüm yan haklarınız otomatik olarak aktiftir!`;
        }

        if (queryLower.includes('performans') || queryLower.includes('değerlendirme') || queryLower.includes('okr')) {
            return `📊 **Performans Değerlendirme Sürecimiz:**

**Değerlendirme Dönemleri:**
Yılda 2 kere → Q2 (Haziran) ve Year-End (Aralık)

**OKR Sistemi:**
• Her çeyrek başında 1 Objective + 3 Key Result belirlersiniz
• Yöneticiniz onaylar
• Çeyrek sonunda ilerleme raporlanır

**Değerlendirme Kriterleri:**
1. OKR tamamlanma (40%)
2. Takım çalışması (20%)
3. Teknik beceriler (20%)
4. İnovasyon (10%)
5. Şirket değerleri (10%)

**Terfi ve Maaş:**
4.5+ puan alanlar terfi için değerlendirilir. Maaş artışları %10-25 arasında.

OKR'larınızı "Performansım" sekmesinden yönetebilirsiniz.`;
        }

        // Generic response
        return `Sorduğunuz konu hakkında bilgi bankamızda şu döküman bulundu:

**${relevantDocs[0].title}** (${relevantDocs[0].category})

Detaylı bilgi için İK departmanı ile iletişime geçebilir veya daha spesifik bir soru sorabilirsiniz.

Örnek: "Kaç gün iznim var?", "Evden çalışma kuralları nedir?", "Sağlık sigortası neyi kapsar?"`;
    };

    // Handle Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-96 h-[600px] bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl shadow-2xl border border-purple-500/30 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Vocaify Asistan</h3>
                                <p className="text-xs text-purple-100">AI destekli İK yardımcınız</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    message.role === 'user'
                                        ? 'bg-purple-600'
                                        : 'bg-gradient-to-br from-pink-500 to-purple-500'
                                }`}>
                                    {message.role === 'user' ? (
                                        <UserIcon className="w-5 h-5 text-white" />
                                    ) : (
                                        <Bot className="w-5 h-5 text-white" />
                                    )}
                                </div>
                                <div className={`flex-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    <div className={`inline-block max-w-[85%] p-3 rounded-2xl ${
                                        message.role === 'user'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-slate-800 text-gray-100'
                                    }`}>
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 px-2">
                                        {new Date(message.timestamp).toLocaleTimeString('tr-TR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-slate-800 p-3 rounded-2xl">
                                    <Loader className="w-5 h-5 text-purple-400 animate-spin" />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-purple-500/20 bg-slate-900/50">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Bir şey sorun..."
                                disabled={isLoading}
                                className="flex-1 bg-slate-800 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || !inputMessage.trim()}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl px-4 py-2 hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl hover:shadow-purple-500/50 transition-all flex items-center justify-center hover:scale-110"
            >
                {isOpen ? (
                    <X className="w-7 h-7" />
                ) : (
                    <MessageCircle className="w-7 h-7" />
                )}
            </button>
        </div>
    );
}

export default AIChatbot;
