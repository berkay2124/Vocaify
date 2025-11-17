import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

/**
 * Modal'daki Teklif sekmesini render eder
 * İş teklifi formu (pozisyon, maaş, yan haklar) ve kabul/red butonlarını gösterir
 */
function OfferTab({ person }) {
    const { candidates, setCandidates, closeModal } = useApp();
    const [offerDetails, setOfferDetails] = useState(person.offerDetails || {});

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const updatedOffer = {
            ...offerDetails,
            position: formData.get('position'),
            salary: formData.get('salary'),
            benefits: formData.get('benefits'),
            startDate: formData.get('startDate'),
            offerSent: true
        };

        setCandidates(candidates.map(c =>
            c.id === person.id
                ? { ...c, offerDetails: updatedOffer }
                : c
        ));
        closeModal();
    };

    const updateOfferStatus = (accepted) => {
        setCandidates(candidates.map(c =>
            c.id === person.id
                ? {
                    ...c,
                    offerDetails: {
                        ...c.offerDetails,
                        offerAccepted: accepted
                    }
                }
                : c
        ));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-gray-300 font-medium mb-2 block">Pozisyon</label>
                    <input
                        name="position"
                        type="text"
                        defaultValue={offerDetails.position || person.analysis.position}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white"
                    />
                </div>
                <div>
                    <label className="text-gray-300 font-medium mb-2 block">Maaş (Aylık Net)</label>
                    <input
                        name="salary"
                        type="number"
                        placeholder="50000"
                        defaultValue={offerDetails.salary || ''}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white"
                    />
                </div>
            </div>

            <div>
                <label className="text-gray-300 font-medium mb-2 block">Planlanan Başlangıç Tarihi</label>
                <input
                    name="startDate"
                    type="date"
                    defaultValue={offerDetails.startDate || ''}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white"
                />
            </div>

            <div>
                <label className="text-gray-300 font-medium mb-2 block">Yan Haklar</label>
                <textarea
                    name="benefits"
                    placeholder="Örn: Yemek Kartı, Özel Sağlık Sigortası..."
                    defaultValue={offerDetails.benefits || ''}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white min-h-[100px]"
                />
            </div>

            <button
                type="submit"
                className="w-full px-6 py-3 gradient-bg text-white rounded-xl hover:shadow-lg font-medium flex items-center justify-center gap-2"
            >
                <Send className="w-4 h-4" />
                {offerDetails.offerSent ? 'Teklifi Güncelle' : 'Teklifi Gönder/Kaydet'}
            </button>

            {offerDetails.offerSent && (
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => updateOfferStatus(true)}
                        className={`w-full p-3 rounded-xl border transition-all ${offerDetails.offerAccepted === true
                            ? 'bg-green-500 text-white scale-105'
                            : 'bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30'
                            }`}
                    >
                        ✓ Kabul Etti
                    </button>
                    <button
                        type="button"
                        onClick={() => updateOfferStatus(false)}
                        className={`w-full p-3 rounded-xl border transition-all ${offerDetails.offerAccepted === false
                            ? 'bg-red-500 text-white scale-105'
                            : 'bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30'
                            }`}
                    >
                        ✗ Reddetti
                    </button>
                </div>
            )}
        </form>
    );
}

export default OfferTab;
