import React, { useState } from 'react';
import { Mail, Phone, Briefcase, Save, UserPlus, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import RoleGuard from '../../components/RoleGuard';
import { EMPLOYEE_STAGES } from '../../config/constants';

/**
 * Modal'daki Detaylar sekmesini render eder
 * Kişi bilgileri, AI özeti, mülakat ve HR notlarını gösterir
 * AŞAMA 27: Bias-Free Mode desteği
 */
function DetailTab({ person, biasFreeMode = false }) {
    const { candidates, employees, setCandidates, setEmployees } = useApp();
    const { currentUser } = useAuth();
    const [interviewNotes, setInterviewNotes] = useState(person.interviewNotes || '');
    const [hrNotes, setHrNotes] = useState(
        person.hrNotes?.find(n => n.category === 'Genel Gözlem')?.note || ''
    );
    const [newInterviewerEmail, setNewInterviewerEmail] = useState('');
    const [assignedInterviewers, setAssignedInterviewers] = useState(person.assignedInterviewers || []);

    const addInterviewer = () => {
        if (!newInterviewerEmail || !newInterviewerEmail.includes('@')) {
            alert('Lütfen geçerli bir email adresi girin.');
            return;
        }

        if (assignedInterviewers.some(i => i.email === newInterviewerEmail)) {
            alert('Bu mülakatçı zaten atanmış.');
            return;
        }

        const newInterviewer = {
            email: newInterviewerEmail,
            assignedBy: currentUser?.email || 'Sistem',
            assignedDate: new Date().toISOString()
        };

        setAssignedInterviewers([...assignedInterviewers, newInterviewer]);
        setNewInterviewerEmail('');
    };

    const removeInterviewer = (email) => {
        setAssignedInterviewers(assignedInterviewers.filter(i => i.email !== email));
    };

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
                    hrNotes: newHrNotes,
                    assignedInterviewers
                };
            }
            return p;
        }));

        alert('Notlar ve atamalar kaydedildi!');
    };

    return (
        <div className="space-y-6">
            {/* Bias-Free Mode Banner - AŞAMA 27 */}
            {biasFreeMode && (
                <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                    <div className="flex items-center gap-2 text-green-300 font-medium mb-2">
                        <EyeOff className="w-5 h-5" />
                        <span>Tarafsız Mod Aktif</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                        Adayın isim, fotoğraf, yaş ve cinsiyet bilgileri gizlendi.
                        Değerlendirmenizi yalnızca yetenekler, deneyim ve yetkinlikler üzerinden yapın.
                    </p>
                </div>
            )}

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

            {/* Mülakatçı Atama (Sadece izni olan kullanıcılar görebilir) */}
            <RoleGuard permission="assign_interviewer">
                <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                    <p className="text-green-300 text-sm font-medium mb-3 flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        Mülakatçı Ataması
                    </p>

                    <div className="flex gap-2 mb-3">
                        <input
                            type="email"
                            value={newInterviewerEmail}
                            onChange={(e) => setNewInterviewerEmail(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addInterviewer()}
                            placeholder="Mülakatçı email adresi"
                            className="flex-1 px-4 py-2 bg-slate-700/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:border-green-500"
                        />
                        <button
                            onClick={addInterviewer}
                            className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all"
                        >
                            Ata
                        </button>
                    </div>

                    {assignedInterviewers.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-gray-400 text-xs mb-2">Atanmış Mülakatçılar:</p>
                            {assignedInterviewers.map((interviewer, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg">
                                    <div className="text-sm">
                                        <p className="text-white font-medium">{interviewer.email}</p>
                                        <p className="text-gray-400 text-xs">
                                            Atayan: {interviewer.assignedBy} • {new Date(interviewer.assignedDate).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeInterviewer(interviewer.email)}
                                        className="text-red-400 hover:text-red-300 text-sm"
                                    >
                                        Kaldır
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </RoleGuard>

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
