import React, { useState } from 'react';
import { Calendar, Clock, Users, Send, X, CheckCircle } from 'lucide-react';

/**
 * Mülakat Planlama Komponenti
 * Calendly/Google Calendar simülasyonu ile mülakat planlama
 * AŞAMA 17
 */
function InterviewScheduler({ candidate, onClose }) {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [duration, setDuration] = useState('60');
    const [location, setLocation] = useState('online');
    const [selectedInterviewers, setSelectedInterviewers] = useState([]);
    const [notes, setNotes] = useState('');
    const [calendarType, setCalendarType] = useState('google');
    const [scheduleSent, setScheduleSent] = useState(false);

    // Demo mülakatçı listesi (gerçek uygulamada Firebase'den gelecek)
    const availableInterviewers = [
        { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@vocaify.com', role: 'Teknik Müdür' },
        { id: 2, name: 'Ayşe Demir', email: 'ayse@vocaify.com', role: 'İK Müdürü' },
        { id: 3, name: 'Mehmet Kaya', email: 'mehmet@vocaify.com', role: 'Takım Lideri' },
        { id: 4, name: 'Zeynep Şahin', email: 'zeynep@vocaify.com', role: 'Senior Developer' }
    ];

    const toggleInterviewer = (interviewer) => {
        if (selectedInterviewers.find(i => i.id === interviewer.id)) {
            setSelectedInterviewers(selectedInterviewers.filter(i => i.id !== interviewer.id));
        } else {
            setSelectedInterviewers([...selectedInterviewers, interviewer]);
        }
    };

    const handleSchedule = () => {
        if (!selectedDate || !selectedTime || selectedInterviewers.length === 0) {
            alert('Lütfen tarih, saat ve en az bir mülakatçı seçin.');
            return;
        }

        // Simüle edilmiş takvim entegrasyonu
        console.log('Mülakat planlandı:', {
            candidate: candidate.name,
            date: selectedDate,
            time: selectedTime,
            duration: duration,
            location: location,
            interviewers: selectedInterviewers,
            calendarType: calendarType,
            notes: notes
        });

        setScheduleSent(true);

        // 2 saniye sonra modalı kapat
        setTimeout(() => {
            onClose();
        }, 2000);
    };

    if (scheduleSent) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                <div className="glass max-w-md w-full rounded-2xl shadow-2xl p-8 border border-green-500/30 text-center">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Mülakat Planlandı!</h2>
                    <p className="text-gray-300 mb-4">
                        {calendarType === 'google' ? 'Google Takvim' : 'Outlook'} daveti tüm katılımcılara gönderildi.
                    </p>
                    <p className="text-gray-400 text-sm">
                        {candidate.name} için {selectedDate} tarihinde {selectedTime} saatinde mülakat.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="glass max-w-4xl w-full max-h-[90vh] rounded-2xl shadow-2xl flex flex-col border border-purple-500/30 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-purple-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-purple-400" />
                        <div>
                            <h2 className="text-2xl font-bold text-white">Mülakat Planla</h2>
                            <p className="text-gray-400 text-sm">
                                {candidate.name} - {candidate.analysis.position}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Takvim Türü Seçimi */}
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
                        <p className="text-purple-200 text-sm mb-3">📅 Takvim Entegrasyonu</p>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="google"
                                    checked={calendarType === 'google'}
                                    onChange={(e) => setCalendarType(e.target.value)}
                                    className="text-purple-500"
                                />
                                <span className="text-white text-sm">Google Takvim</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="outlook"
                                    checked={calendarType === 'outlook'}
                                    onChange={(e) => setCalendarType(e.target.value)}
                                    className="text-purple-500"
                                />
                                <span className="text-white text-sm">Outlook</span>
                            </label>
                        </div>
                    </div>

                    {/* Tarih ve Saat */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-gray-300 text-sm mb-2 block font-medium flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Tarih
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="text-gray-300 text-sm mb-2 block font-medium flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Saat
                            </label>
                            <input
                                type="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="text-gray-300 text-sm mb-2 block font-medium">
                                Süre (dk)
                            </label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            >
                                <option value="30">30 dakika</option>
                                <option value="45">45 dakika</option>
                                <option value="60">60 dakika</option>
                                <option value="90">90 dakika</option>
                            </select>
                        </div>
                    </div>

                    {/* Yer */}
                    <div>
                        <label className="text-gray-300 text-sm mb-2 block font-medium">
                            Mülakat Yeri
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="online"
                                    checked={location === 'online'}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="text-purple-500"
                                />
                                <span className="text-white text-sm">Online (Zoom/Teams)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="office"
                                    checked={location === 'office'}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="text-purple-500"
                                />
                                <span className="text-white text-sm">Ofis</span>
                            </label>
                        </div>
                    </div>

                    {/* Mülakatçı Seçimi */}
                    <div>
                        <label className="text-gray-300 text-sm mb-3 block font-medium flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Mülakatçı Seçimi ({selectedInterviewers.length} seçildi)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {availableInterviewers.map((interviewer) => {
                                const isSelected = selectedInterviewers.find(i => i.id === interviewer.id);
                                return (
                                    <div
                                        key={interviewer.id}
                                        onClick={() => toggleInterviewer(interviewer)}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                            isSelected
                                                ? 'bg-purple-500/20 border-purple-500'
                                                : 'bg-slate-700/30 border-slate-600 hover:border-purple-500/50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                                isSelected ? 'bg-purple-600' : 'bg-slate-600'
                                            }`}>
                                                {interviewer.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-medium text-sm">{interviewer.name}</p>
                                                <p className="text-gray-400 text-xs">{interviewer.role}</p>
                                                <p className="text-gray-500 text-xs">{interviewer.email}</p>
                                            </div>
                                            {isSelected && (
                                                <CheckCircle className="w-5 h-5 text-purple-400" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Notlar */}
                    <div>
                        <label className="text-gray-300 text-sm mb-2 block font-medium">
                            Mülakat Notları (Opsiyonel)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Bu mülakata özel notlarınız (adaya gönderilmez)"
                            className="w-full h-24 px-4 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
                        />
                    </div>

                    {/* Özet */}
                    {selectedDate && selectedTime && selectedInterviewers.length > 0 && (
                        <div className="bg-slate-800/50 border border-green-500/30 rounded-lg p-4">
                            <p className="text-green-300 font-medium mb-2">✓ Mülakat Özeti</p>
                            <div className="text-gray-300 text-sm space-y-1">
                                <p>• Tarih: {new Date(selectedDate).toLocaleDateString('tr-TR')} - {selectedTime}</p>
                                <p>• Süre: {duration} dakika</p>
                                <p>• Yer: {location === 'online' ? 'Online' : 'Ofis'}</p>
                                <p>• Mülakatçılar: {selectedInterviewers.map(i => i.name).join(', ')}</p>
                                <p>• Takvim: {calendarType === 'google' ? 'Google Takvim' : 'Outlook'}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-purple-500/20 flex items-center justify-between">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleSchedule}
                        disabled={!selectedDate || !selectedTime || selectedInterviewers.length === 0}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                        Mülakat Daveti Gönder
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InterviewScheduler;
