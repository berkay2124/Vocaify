import React, { useState } from 'react';
import { Star, Send, MessageSquare, User, Calendar, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

/**
 * Mülakat Geri Bildirim Portalı
 * Yöneticiler mülakat sonrası bu sayfadan geri bildirim bırakır
 * AŞAMA 17
 */
function Feedback() {
    const { candidates, setCandidates } = useApp();
    const { currentUser } = useAuth();
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [technicalSkills, setTechnicalSkills] = useState(0);
    const [communication, setCommunication] = useState(0);
    const [cultureFit, setCultureFit] = useState(0);
    const [comments, setComments] = useState('');
    const [recommendation, setRecommendation] = useState('');
    const [feedbackSent, setFeedbackSent] = useState(false);

    // Mülakata atanan adayları filtrele (currentUser'a atanmış olanlar)
    const assignedCandidates = candidates.filter(c =>
        c.assignedInterviewers?.some(interviewer => interviewer.email === currentUser?.email)
    );

    const handleSubmitFeedback = () => {
        if (!selectedCandidate || rating === 0) {
            alert('Lütfen bir aday seçin ve genel değerlendirme yapın.');
            return;
        }

        const feedback = {
            interviewerEmail: currentUser?.email,
            interviewerName: currentUser?.displayName || currentUser?.email,
            date: new Date().toISOString(),
            rating: rating,
            technicalSkills: technicalSkills,
            communication: communication,
            cultureFit: cultureFit,
            comments: comments,
            recommendation: recommendation
        };

        // Candidate'e feedback ekle
        setCandidates(candidates.map(c => {
            if (c.id === selectedCandidate.id) {
                return {
                    ...c,
                    interviewFeedbacks: [...(c.interviewFeedbacks || []), feedback]
                };
            }
            return c;
        }));

        setFeedbackSent(true);

        // Reset form
        setTimeout(() => {
            setSelectedCandidate(null);
            setRating(0);
            setTechnicalSkills(0);
            setCommunication(0);
            setCultureFit(0);
            setComments('');
            setRecommendation('');
            setFeedbackSent(false);
        }, 2000);
    };

    const StarRating = ({ value, onChange, label }) => {
        const [hover, setHover] = useState(0);
        return (
            <div>
                <label className="text-gray-300 text-sm mb-2 block">{label}</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => onChange(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            className="transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-8 h-8 ${
                                    star <= (hover || value)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-600'
                                }`}
                            />
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    if (feedbackSent) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="glass p-12 rounded-2xl border border-green-500/30 text-center max-w-md">
                    <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-3">Geri Bildirim Kaydedildi!</h2>
                    <p className="text-gray-300">
                        {selectedCandidate?.name} için mülakat değerlendirmeniz başarıyla kaydedildi.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-purple-400" />
                        Mülakat Geri Bildirim Portalı
                    </h2>
                    <p className="text-gray-400">Mülakat yaptığınız adaylar için geri bildiriminizi bırakın</p>
                </div>
            </div>

            {assignedCandidates.length === 0 ? (
                <div className="glass p-12 rounded-2xl text-center">
                    <User className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Atanmış Aday Yok</h3>
                    <p className="text-gray-400">
                        Şu anda size atanmış bir mülakat bulunmuyor. Atama yapıldığında burada görünecektir.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sol: Aday Listesi */}
                    <div className="glass p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Atanan Adaylar ({assignedCandidates.length})
                        </h3>
                        <div className="space-y-3">
                            {assignedCandidates.map((candidate) => {
                                const hasFeedback = candidate.interviewFeedbacks?.some(
                                    f => f.interviewerEmail === currentUser?.email
                                );
                                return (
                                    <div
                                        key={candidate.id}
                                        onClick={() => setSelectedCandidate(candidate)}
                                        className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                                            selectedCandidate?.id === candidate.id
                                                ? 'bg-purple-500/20 border-purple-500'
                                                : 'bg-slate-700/30 border-slate-600 hover:border-purple-500/50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center text-white font-bold">
                                                {candidate.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-medium text-sm">{candidate.name}</p>
                                                <p className="text-gray-400 text-xs">{candidate.analysis.position}</p>
                                            </div>
                                        </div>
                                        {hasFeedback && (
                                            <div className="flex items-center gap-1 text-green-400 text-xs">
                                                <CheckCircle className="w-3 h-3" />
                                                Geri bildirim verildi
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sağ: Geri Bildirim Formu */}
                    <div className="lg:col-span-2 glass p-6 rounded-2xl">
                        {!selectedCandidate ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                    <p className="text-gray-400">
                                        Geri bildirim vermek için soldan bir aday seçin
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Aday Bilgisi */}
                                <div className="border-b border-purple-500/20 pb-4">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                            {selectedCandidate.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">{selectedCandidate.name}</h3>
                                            <p className="text-purple-300">{selectedCandidate.analysis.position}</p>
                                        </div>
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                        <p>• Deneyim: {selectedCandidate.analysis.experience_years} yıl</p>
                                        <p>• Yetenekler: {selectedCandidate.analysis.skills?.slice(0, 3).join(', ')}</p>
                                    </div>
                                </div>

                                {/* Genel Değerlendirme */}
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-4">Genel Değerlendirme</h4>
                                    <StarRating
                                        value={rating}
                                        onChange={setRating}
                                        label="Genel Puan (1-5 yıldız)"
                                    />
                                </div>

                                {/* Detaylı Değerlendirmeler */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <StarRating
                                        value={technicalSkills}
                                        onChange={setTechnicalSkills}
                                        label="Teknik Yetenek"
                                    />
                                    <StarRating
                                        value={communication}
                                        onChange={setCommunication}
                                        label="İletişim"
                                    />
                                    <StarRating
                                        value={cultureFit}
                                        onChange={setCultureFit}
                                        label="Kültürel Uyum"
                                    />
                                </div>

                                {/* Öneri */}
                                <div>
                                    <label className="text-gray-300 text-sm mb-2 block font-medium">
                                        Tavsiye Kararı
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="hire"
                                                checked={recommendation === 'hire'}
                                                onChange={(e) => setRecommendation(e.target.value)}
                                                className="text-green-500"
                                            />
                                            <span className="text-green-300 text-sm">✓ İşe Alınmalı</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="maybe"
                                                checked={recommendation === 'maybe'}
                                                onChange={(e) => setRecommendation(e.target.value)}
                                                className="text-yellow-500"
                                            />
                                            <span className="text-yellow-300 text-sm">? Kararsız</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="reject"
                                                checked={recommendation === 'reject'}
                                                onChange={(e) => setRecommendation(e.target.value)}
                                                className="text-red-500"
                                            />
                                            <span className="text-red-300 text-sm">✗ Uygun Değil</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Yorumlar */}
                                <div>
                                    <label className="text-gray-300 text-sm mb-2 block font-medium">
                                        Mülakat Notları ve Yorumlar
                                    </label>
                                    <textarea
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                        placeholder="Mülakat sırasında gözlemleriniz, güçlü/zayıf yönler, öne çıkan davranışlar..."
                                        className="w-full h-32 px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleSubmitFeedback}
                                    disabled={rating === 0}
                                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5" />
                                    Geri Bildirimi Gönder
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Daha Önce Verilen Geri Bildirimler */}
            {selectedCandidate && selectedCandidate.interviewFeedbacks && selectedCandidate.interviewFeedbacks.length > 0 && (
                <div className="glass p-6 rounded-2xl border-l-4 border-blue-500">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        Önceki Geri Bildirimler
                    </h3>
                    <div className="space-y-4">
                        {selectedCandidate.interviewFeedbacks.map((feedback, index) => (
                            <div key={index} className="bg-slate-800/50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-white font-medium">{feedback.interviewerName}</p>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${
                                                    i < feedback.rating
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-600'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm mb-2">
                                    {new Date(feedback.date).toLocaleDateString('tr-TR')}
                                </p>
                                {feedback.comments && (
                                    <p className="text-gray-300 text-sm italic">"{feedback.comments}"</p>
                                )}
                                {feedback.recommendation && (
                                    <div className="mt-2">
                                        <span className={`text-xs px-2 py-1 rounded ${
                                            feedback.recommendation === 'hire'
                                                ? 'bg-green-500/20 text-green-300'
                                                : feedback.recommendation === 'reject'
                                                ? 'bg-red-500/20 text-red-300'
                                                : 'bg-yellow-500/20 text-yellow-300'
                                        }`}>
                                            {feedback.recommendation === 'hire' ? 'İşe Alınmalı' :
                                             feedback.recommendation === 'reject' ? 'Uygun Değil' : 'Kararsız'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Feedback;
