import React, { useState } from 'react';
import { Mail, Phone, Briefcase, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EMPLOYEE_STAGES } from '../../config/constants';

/**
 * Modal'daki Detaylar sekmesini render eder
 * Kişi bilgileri, AI özeti, mülakat ve HR notlarını gösterir
 */
function DetailTab({ person }) {
    const { candidates, employees, setCandidates, setEmployees } = useApp();
    const [interviewNotes, setInterviewNotes] = useState(person.interviewNotes || '');
    const [hrNotes, setHrNotes] = useState(
        person.hrNotes?.find(n => n.category === 'Genel Gözlem')?.note || ''
    );

    const saveNotes = () => {
        const isEmployee = EMPLOYEE_STAGES.includes(person.status);
        const updateFn = isEmployee ? setEmployees : setCandidates;
        const dataArray = isEmployee ? employees : candidates;

        updateFn(dataArray.map(p => {
            if (p.id === person.id) {
                let newHrNotes = [...(p.hrNotes || [])];
                const existingNoteIndex = newHrNotes.findIndex(n => n.category === 'Genel Gözlem');

                if (hrNotes) {
                    if (existingNoteIndex > -1) {
                        newHrNotes[existingNoteIndex].note = hrNotes;
                        newHrNotes[existingNoteIndex].date = new Date().toISOString();
                    } else {
                        newHrNotes.unshift({
                            id: Date.now(),
                            note: hrNotes,
                            author: 'İK Ekibi',
                            category: 'Genel Gözlem',
                            date: new Date().toISOString()
                        });
                    }
                }

                return {
                    ...p,
                    interviewNotes,
                    hrNotes: newHrNotes
                };
            }
            return p;
        }));

        alert('Notlar Kaydedildi!');
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-700/50 rounded-xl">
                    <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Email
                    </p>
                    <p className="text-white font-medium truncate">{person.email || 'N/A'}</p>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-xl">
                    <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4" /> Telefon
                    </p>
                    <p className="text-white font-medium truncate">{person.phone || 'N/A'}</p>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-xl">
                    <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Deneyim
                    </p>
                    <p className="text-white font-medium">{person.analysis.experience_years || 0} yıl</p>
                </div>
            </div>

            <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                <p className="text-blue-300 text-sm font-medium mb-2">AI Profil Özeti</p>
                <p className="text-white leading-relaxed">{person.analysis.summary}</p>
            </div>

            {person.analysis.aiRecommendation && (
                <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
                    <p className="text-purple-300 text-sm font-medium mb-2">AI Analizi ve Öneri</p>
                    <p className="text-white leading-relaxed">{person.analysis.aiRecommendation}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-gray-400 text-sm mb-3 font-medium block">
                        Mülakat Notları
                    </label>
                    <textarea
                        value={interviewNotes}
                        onChange={(e) => setInterviewNotes(e.target.value)}
                        placeholder="Mülakat notlarını buraya yazın..."
                        className="w-full h-40 px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white min-h-[120px] focus:outline-none focus:border-purple-500"
                    />
                </div>
                <div>
                    <label className="text-gray-400 text-sm mb-3 font-medium block">
                        HR Gözlem Notları
                    </label>
                    <textarea
                        value={hrNotes}
                        onChange={(e) => setHrNotes(e.target.value)}
                        placeholder="Genel gözlemlerinizi buraya yazın..."
                        className="w-full h-40 px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white min-h-[120px] focus:outline-none focus:border-purple-500"
                    />
                </div>
            </div>

            <button
                onClick={saveNotes}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
            >
                <Save className="w-4 h-4" /> Notları Kaydet
            </button>
        </div>
    );
}

export default DetailTab;
