import React, { useState } from 'react';
import { Wand2, FileText, MessageSquare, Mail, Copy, X, Loader, AlertTriangle, DollarSign } from 'lucide-react';
import { generateJobDescription, generateInterviewQuestions, generateEmail, detectBiasInJobDescription, generateSalaryBenchmark } from '../utils/aiAnalyzer';

/**
 * AI Araç Kiti - Üretken AI özellikleri
 * İş ilanı yazma, mülakat soruları ve e-posta oluşturma
 * AŞAMA 16
 * AŞAMA 27: Bias (önyargı) tespiti eklendi
 * AŞAMA 28: Maaş kıyaslama eklendi
 */
function AIToolkit({ candidate, onClose }) {
    const [activeTab, setActiveTab] = useState('job'); // job, questions, email
    const [loading, setLoading] = useState(false);

    // İş İlanı state
    const [positionTitle, setPositionTitle] = useState(candidate?.analysis?.position || '');
    const [responsibility1, setResponsibility1] = useState('');
    const [responsibility2, setResponsibility2] = useState('');
    const [responsibility3, setResponsibility3] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [biasWarnings, setBiasWarnings] = useState([]); // AŞAMA 27: Bias uyarıları
    const [salaryBenchmark, setSalaryBenchmark] = useState(null); // AŞAMA 28: Maaş kıyaslama
    const [benchmarkLocation, setBenchmarkLocation] = useState('İstanbul'); // AŞAMA 28: Lokasyon

    // Mülakat Soruları state
    const [jobDescForQuestions, setJobDescForQuestions] = useState('');
    const [interviewQuestions, setInterviewQuestions] = useState([]);

    // E-posta state
    const [emailType, setEmailType] = useState('invitation');
    const [interviewDate, setInterviewDate] = useState('');
    const [interviewTime, setInterviewTime] = useState('');
    const [interviewLocation, setInterviewLocation] = useState('Online');
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');

    const tabs = [
        { id: 'job', label: 'İş İlanı Yazarı', icon: FileText },
        { id: 'questions', label: 'Mülakat Soruları', icon: MessageSquare },
        { id: 'email', label: 'E-posta Yazarı', icon: Mail }
    ];

    // Maaş Kıyaslama - AŞAMA 28
    const handleSalaryBenchmark = async () => {
        if (!positionTitle.trim()) {
            alert('Lütfen pozisyon adını girin.');
            return;
        }

        setLoading(true);
        try {
            console.log('💰 Maaş kıyaslaması yapılıyor...');
            const result = await generateSalaryBenchmark(positionTitle, benchmarkLocation);
            if (result.success) {
                setSalaryBenchmark(result);
                console.log(`✅ Maaş aralığı: ${result.minSalary} - ${result.maxSalary} ${result.currency}`);
            } else {
                alert(result.message || 'Maaş kıyaslaması yapılamadı.');
            }
        } catch (error) {
            console.error('Maaş kıyaslama hatası:', error);
            alert('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    // İş İlanı Oluştur
    const handleGenerateJobDescription = async () => {
        if (!positionTitle.trim()) {
            alert('Lütfen pozisyon adını girin.');
            return;
        }

        const responsibilities = [responsibility1, responsibility2, responsibility3].filter(r => r.trim());
        if (responsibilities.length === 0) {
            alert('Lütfen en az 1 sorumluluk girin.');
            return;
        }

        setLoading(true);
        setBiasWarnings([]); // Reset warnings
        try {
            // 1. İş ilanı oluştur
            const result = await generateJobDescription(positionTitle, responsibilities);
            if (result.success) {
                setJobDescription(result.jobDescription);

                // 2. AŞAMA 27: Bias (önyargı) kontrolü yap
                console.log('🔍 İş ilanı bias kontrolünden geçiriliyor...');
                const biasResult = await detectBiasInJobDescription(result.jobDescription);
                if (biasResult.success && biasResult.warnings && biasResult.warnings.length > 0) {
                    setBiasWarnings(biasResult.warnings);
                    console.log(`⚠️ ${biasResult.warnings.length} bias uyarısı bulundu.`);
                } else {
                    console.log('✅ Bias tespit edilmedi. İlan tarafsız görünüyor.');
                }
            } else {
                alert(result.message || 'İş ilanı oluşturulamadı.');
            }
        } catch (error) {
            console.error('İş ilanı hatası:', error);
            alert('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    // Mülakat Soruları Oluştur
    const handleGenerateQuestions = async () => {
        setLoading(true);
        try {
            const result = await generateInterviewQuestions(candidate, jobDescForQuestions);
            if (result.success) {
                setInterviewQuestions(result.questions);
            } else {
                alert(result.message || 'Sorular oluşturulamadı.');
            }
        } catch (error) {
            console.error('Soru oluşturma hatası:', error);
            alert('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    // E-posta Oluştur
    const handleGenerateEmail = async () => {
        setLoading(true);
        try {
            const details = {
                date: interviewDate,
                time: interviewTime,
                location: interviewLocation
            };
            const result = await generateEmail(candidate, emailType, details);
            if (result.success) {
                setEmailSubject(result.subject);
                setEmailBody(result.body);
            } else {
                alert(result.message || 'E-posta oluşturulamadı.');
            }
        } catch (error) {
            console.error('E-posta hatası:', error);
            alert('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    // Kopyala
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Panoya kopyalandı!');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="glass max-w-5xl w-full max-h-[90vh] rounded-2xl shadow-2xl flex flex-col border border-purple-500/30">
                {/* Header */}
                <div className="p-6 border-b border-purple-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Wand2 className="w-8 h-8 text-purple-400" />
                        <div>
                            <h2 className="text-2xl font-bold text-white">AI Araç Kiti</h2>
                            <p className="text-gray-400 text-sm">Üretken AI ile İK süreçlerinizi hızlandırın</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 px-6 pt-4 border-b border-purple-500/10">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-3 flex items-center gap-2 transition-all rounded-t-lg ${
                                    activeTab === tab.id
                                        ? 'bg-purple-500/20 text-purple-300 border-b-2 border-purple-500'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* İş İlanı Tab */}
                    {activeTab === 'job' && (
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
                                <p className="text-purple-200 text-sm">
                                    🚀 Pozisyon ve 3 ana sorumluluk girin, AI tam bir iş ilanı oluştursun!
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-gray-300 text-sm mb-2 block font-medium">Pozisyon Adı</label>
                                    <input
                                        type="text"
                                        value={positionTitle}
                                        onChange={(e) => setPositionTitle(e.target.value)}
                                        placeholder="Örn: Senior Full Stack Developer"
                                        className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-300 text-sm mb-2 block font-medium">Lokasyon</label>
                                    <select
                                        value={benchmarkLocation}
                                        onChange={(e) => setBenchmarkLocation(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="İstanbul">İstanbul</option>
                                        <option value="Ankara">Ankara</option>
                                        <option value="İzmir">İzmir</option>
                                        <option value="Bursa">Bursa</option>
                                        <option value="Antalya">Antalya</option>
                                        <option value="Türkiye">Türkiye (Genel)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Maaş Kıyaslama Butonu - AŞAMA 28 */}
                            <button
                                onClick={handleSalaryBenchmark}
                                disabled={loading}
                                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        Analiz ediliyor...
                                    </>
                                ) : (
                                    <>
                                        <DollarSign className="w-5 h-5" />
                                        Piyasa Maaş Aralığını Kıyasla
                                    </>
                                )}
                            </button>

                            {/* Maaş Kıyaslama Sonuçları - AŞAMA 28 */}
                            {salaryBenchmark && (
                                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-5">
                                    <div className="flex items-center gap-2 text-green-300 font-bold text-lg mb-3">
                                        <DollarSign className="w-6 h-6" />
                                        <span>Piyasa Maaş Aralığı</span>
                                    </div>

                                    <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                                        <div className="text-center">
                                            <p className="text-gray-400 text-sm mb-2">Tahmini Brüt Aylık Maaş</p>
                                            <p className="text-white text-3xl font-bold">
                                                {salaryBenchmark.minSalary.toLocaleString('tr-TR')} - {salaryBenchmark.maxSalary.toLocaleString('tr-TR')} ₺
                                            </p>
                                            <p className="text-gray-400 text-xs mt-1">
                                                {benchmarkLocation} • {new Date().getFullYear()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="bg-slate-700/30 rounded-lg p-3">
                                            <p className="text-purple-300 text-sm font-semibold mb-2">📊 Açıklama:</p>
                                            <p className="text-gray-300 text-sm">{salaryBenchmark.explanation}</p>
                                        </div>

                                        {salaryBenchmark.factors && salaryBenchmark.factors.length > 0 && (
                                            <div className="bg-slate-700/30 rounded-lg p-3">
                                                <p className="text-blue-300 text-sm font-semibold mb-2">🔍 Dikkate Alınan Faktörler:</p>
                                                <ul className="space-y-1">
                                                    {salaryBenchmark.factors.map((factor, idx) => (
                                                        <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                                                            <span className="text-blue-400 mt-0.5">•</span>
                                                            <span>{factor}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {salaryBenchmark.recommendation && (
                                            <div className="bg-slate-700/30 rounded-lg p-3">
                                                <p className="text-green-300 text-sm font-semibold mb-2">💡 Tavsiye:</p>
                                                <p className="text-gray-300 text-sm">{salaryBenchmark.recommendation}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-gray-300 text-sm font-medium block">Ana Sorumluluklar</label>
                                <input
                                    type="text"
                                    value={responsibility1}
                                    onChange={(e) => setResponsibility1(e.target.value)}
                                    placeholder="1. Sorumluluk (Örn: Web uygulamaları geliştirmek)"
                                    className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                />
                                <input
                                    type="text"
                                    value={responsibility2}
                                    onChange={(e) => setResponsibility2(e.target.value)}
                                    placeholder="2. Sorumluluk (Örn: Kod kalitesini sağlamak)"
                                    className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                />
                                <input
                                    type="text"
                                    value={responsibility3}
                                    onChange={(e) => setResponsibility3(e.target.value)}
                                    placeholder="3. Sorumluluk (Örn: Takım ile işbirliği yapmak)"
                                    className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            <button
                                onClick={handleGenerateJobDescription}
                                disabled={loading}
                                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        Oluşturuluyor...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-5 h-5" />
                                        İş İlanı Oluştur
                                    </>
                                )}
                            </button>

                            {jobDescription && (
                                <>
                                    {/* Bias Warnings - AŞAMA 27 */}
                                    {biasWarnings.length > 0 && (
                                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                            <div className="flex items-center gap-2 text-yellow-300 font-medium mb-3">
                                                <AlertTriangle className="w-5 h-5" />
                                                <span>Önyargı Uyarısı ({biasWarnings.length} sorun tespit edildi)</span>
                                            </div>
                                            <div className="space-y-3">
                                                {biasWarnings.map((warning, index) => (
                                                    <div key={index} className="bg-slate-700/30 rounded-lg p-3">
                                                        <div className="flex items-start gap-2 mb-2">
                                                            <span className="text-red-400 font-mono text-sm">❌</span>
                                                            <div className="flex-1">
                                                                <p className="text-red-300 font-semibold text-sm">"{warning.phrase}"</p>
                                                                <p className="text-gray-400 text-xs mt-1">{warning.reason}</p>
                                                            </div>
                                                        </div>
                                                        {warning.alternative && (
                                                            <div className="flex items-start gap-2 mt-2 pl-6">
                                                                <span className="text-green-400 font-mono text-sm">✓</span>
                                                                <div>
                                                                    <p className="text-green-300 text-sm">
                                                                        <strong>Öneri:</strong> "{warning.alternative}"
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-yellow-200 text-xs mt-3">
                                                💡 İpucu: Bu öneriler AI tarafından oluşturuldu. İlan metnini düzenleyerek daha kapsayıcı hale getirebilirsiniz.
                                            </p>
                                        </div>
                                    )}

                                    <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-purple-300 font-medium">Oluşturulan İş İlanı:</p>
                                            <button
                                                onClick={() => copyToClipboard(jobDescription)}
                                                className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all flex items-center gap-2 text-sm"
                                            >
                                                <Copy className="w-4 h-4" />
                                                Kopyala
                                            </button>
                                        </div>
                                        <div className="text-gray-300 text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                                            {jobDescription}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Mülakat Soruları Tab */}
                    {activeTab === 'questions' && (
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
                                <p className="text-purple-200 text-sm mb-2">
                                    🎯 <strong>{candidate?.name}</strong> için özel mülakat soruları
                                </p>
                                <p className="text-gray-400 text-xs">
                                    CV analizi: {candidate?.analysis?.position} • {candidate?.analysis?.experience_years} yıl deneyim
                                </p>
                            </div>

                            <div>
                                <label className="text-gray-300 text-sm mb-2 block font-medium">İş İlanı (Opsiyonel)</label>
                                <textarea
                                    value={jobDescForQuestions}
                                    onChange={(e) => setJobDescForQuestions(e.target.value)}
                                    placeholder="İş ilanı metnini buraya yapıştırın (opsiyonel, daha spesifik sorular için)"
                                    className="w-full h-32 px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
                                />
                            </div>

                            <button
                                onClick={handleGenerateQuestions}
                                disabled={loading}
                                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        Oluşturuluyor...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-5 h-5" />
                                        5 Mülakat Sorusu Oluştur
                                    </>
                                )}
                            </button>

                            {interviewQuestions.length > 0 && (
                                <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-purple-300 font-medium">Oluşturulan Mülakat Soruları:</p>
                                        <button
                                            onClick={() => copyToClipboard(interviewQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n\n'))}
                                            className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all flex items-center gap-2 text-sm"
                                        >
                                            <Copy className="w-4 h-4" />
                                            Hepsini Kopyala
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {interviewQuestions.map((question, index) => (
                                            <div key={index} className="p-3 bg-slate-700/30 rounded-lg">
                                                <p className="text-purple-300 text-sm font-semibold mb-2">Soru {index + 1}:</p>
                                                <p className="text-gray-300 text-sm">{question}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* E-posta Tab */}
                    {activeTab === 'email' && (
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
                                <p className="text-purple-200 text-sm">
                                    ✉️ Mülakata davet veya kibar red e-postası oluşturun
                                </p>
                            </div>

                            <div>
                                <label className="text-gray-300 text-sm mb-2 block font-medium">E-posta Tipi</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="invitation"
                                            checked={emailType === 'invitation'}
                                            onChange={(e) => setEmailType(e.target.value)}
                                            className="text-purple-500"
                                        />
                                        <span className="text-gray-300 text-sm">Mülakata Davet</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="rejection"
                                            checked={emailType === 'rejection'}
                                            onChange={(e) => setEmailType(e.target.value)}
                                            className="text-purple-500"
                                        />
                                        <span className="text-gray-300 text-sm">Kibar Red</span>
                                    </label>
                                </div>
                            </div>

                            {emailType === 'invitation' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-gray-300 text-sm mb-2 block">Tarih</label>
                                        <input
                                            type="date"
                                            value={interviewDate}
                                            onChange={(e) => setInterviewDate(e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-gray-300 text-sm mb-2 block">Saat</label>
                                        <input
                                            type="time"
                                            value={interviewTime}
                                            onChange={(e) => setInterviewTime(e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-gray-300 text-sm mb-2 block">Yer</label>
                                        <input
                                            type="text"
                                            value={interviewLocation}
                                            onChange={(e) => setInterviewLocation(e.target.value)}
                                            placeholder="Örn: Zoom/Ofis"
                                            className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleGenerateEmail}
                                disabled={loading}
                                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        Oluşturuluyor...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-5 h-5" />
                                        E-posta Oluştur
                                    </>
                                )}
                            </button>

                            {emailSubject && emailBody && (
                                <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-4 space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-purple-300 font-medium text-sm">Konu:</p>
                                            <button
                                                onClick={() => copyToClipboard(emailSubject)}
                                                className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs hover:bg-purple-500/30 transition-all"
                                            >
                                                <Copy className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <p className="text-white font-semibold">{emailSubject}</p>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-purple-300 font-medium text-sm">E-posta İçeriği:</p>
                                            <button
                                                onClick={() => copyToClipboard(emailBody)}
                                                className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all flex items-center gap-2 text-sm"
                                            >
                                                <Copy className="w-4 h-4" />
                                                Kopyala
                                            </button>
                                        </div>
                                        <div className="text-gray-300 text-sm whitespace-pre-wrap max-h-80 overflow-y-auto p-3 bg-slate-700/30 rounded-lg">
                                            {emailBody}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AIToolkit;
