import React from 'react';
import { MessageSquare, BookOpen, ListChecks } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HR_NOTE_CATEGORIES, EMPLOYEE_STAGES } from '../../config/constants';

/**
 * Modal'daki İK Aksiyonları sekmesini render eder
 * HR notu, eğitim atama ve anket gönderme formlarını gösterir
 */
function ActionsTab({ person }) {
    const { candidates, employees, setCandidates, setEmployees, closeModal } = useApp();

    const handleFormSubmit = (e, type) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const isEmployee = EMPLOYEE_STAGES.includes(person.status);
        const updateFn = isEmployee ? setEmployees : setCandidates;
        const dataArray = isEmployee ? employees : candidates;

        switch (type) {
            case 'hrnote':
                updateFn(dataArray.map(p =>
                    p.id === person.id
                        ? {
                            ...p,
                            hrNotes: [
                                {
                                    id: Date.now(),
                                    note: formData.get('note'),
                                    author: formData.get('author'),
                                    category: formData.get('category'),
                                    date: new Date().toISOString()
                                },
                                ...(p.hrNotes || [])
                            ]
                        }
                        : p
                ));
                break;

            case 'training':
                updateFn(dataArray.map(p =>
                    p.id === person.id
                        ? {
                            ...p,
                            trainings: [
                                {
                                    id: Date.now(),
                                    title: formData.get('title'),
                                    description: formData.get('description'),
                                    assignedDate: new Date().toISOString(),
                                    status: 'planned'
                                },
                                ...(p.trainings || [])
                            ]
                        }
                        : p
                ));
                break;

            case 'survey':
                updateFn(dataArray.map(p =>
                    p.id === person.id
                        ? {
                            ...p,
                            surveys: [
                                {
                                    id: Date.now(),
                                    title: formData.get('title'),
                                    link: formData.get('link'),
                                    assignedDate: new Date().toISOString(),
                                    status: 'sent'
                                },
                                ...(p.surveys || [])
                            ]
                        }
                        : p
                ));
                break;
        }

        closeModal();
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* HR Notu Ekle */}
            <form
                onSubmit={(e) => handleFormSubmit(e, 'hrnote')}
                className="space-y-4 p-4 glass-light rounded-xl"
            >
                <h4 className="text-lg font-semibold text-white">HR Notu Ekle</h4>
                <textarea
                    name="note"
                    placeholder="Gözlemler..."
                    className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white"
                    required
                />
                <input
                    name="author"
                    type="text"
                    defaultValue="İK Ekibi"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white"
                    required
                />
                <select
                    name="category"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white"
                >
                    {HR_NOTE_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <button
                    type="submit"
                    className="w-full px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:shadow-lg font-medium flex items-center justify-center gap-2"
                >
                    <MessageSquare className="w-4 h-4" /> Not Ekle
                </button>
            </form>

            {/* Eğitim Ata */}
            <form
                onSubmit={(e) => handleFormSubmit(e, 'training')}
                className="space-y-4 p-4 glass-light rounded-xl"
            >
                <h4 className="text-lg font-semibold text-white">Eğitim Ata</h4>
                <input
                    name="title"
                    type="text"
                    placeholder="Eğitim Başlığı"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white"
                    required
                />
                <textarea
                    name="description"
                    placeholder="Detay veya link..."
                    className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white"
                />
                <button
                    type="submit"
                    className="w-full mt-[52px] px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg font-medium flex items-center justify-center gap-2"
                >
                    <BookOpen className="w-4 h-4" /> Eğitimi Ata
                </button>
            </form>

            {/* Anket Gönder */}
            <form
                onSubmit={(e) => handleFormSubmit(e, 'survey')}
                className="space-y-4 p-4 glass-light rounded-xl"
            >
                <h4 className="text-lg font-semibold text-white">Anket Gönder</h4>
                <input
                    name="title"
                    type="text"
                    placeholder="Anket Başlığı"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white"
                    required
                />
                <input
                    name="link"
                    type="url"
                    placeholder="https://google.forms/..."
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white"
                    required
                />
                <button
                    type="submit"
                    className="w-full mt-[52px] px-6 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl hover:shadow-lg font-medium flex items-center justify-center gap-2"
                >
                    <ListChecks className="w-4 h-4" /> Anket Ata
                </button>
            </form>
        </div>
    );
}

export default ActionsTab;
