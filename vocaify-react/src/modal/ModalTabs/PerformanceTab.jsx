import React from 'react';
import { Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/helpers';

/**
 * Modal'daki Performans sekmesini render eder
 * Personel için performans değerlendirme formu ve geçmiş değerlendirmeleri gösterir
 */
function PerformanceTab({ person }) {
    const { employees, setEmployees, closeModal } = useApp();

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const newReview = {
            id: Date.now(),
            date: new Date().toISOString(),
            period: formData.get('period'),
            manager: formData.get('manager'),
            score: formData.get('score'),
            strengths: formData.get('strengths'),
            weaknesses: formData.get('weaknesses')
        };

        setEmployees(employees.map(emp =>
            emp.id === person.id
                ? {
                    ...emp,
                    performanceReviews: [newReview, ...(emp.performanceReviews || [])]
                }
                : emp
        ));

        closeModal();
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4 p-4 glass-light rounded-xl">
                <h4 className="text-lg font-semibold text-white">Yeni Performans Değerlendirmesi</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        name="period"
                        type="text"
                        placeholder="Dönem (örn: 2025 Q4)"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white"
                        required
                    />
                    <input
                        name="manager"
                        type="text"
                        placeholder="Değerlendiren Yönetici"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white"
                        required
                    />
                    <input
                        name="score"
                        type="number"
                        min="1"
                        max="10"
                        step="0.1"
                        placeholder="Puan (1-10)"
                        className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white"
                        required
                    />
                </div>
                <textarea
                    name="strengths"
                    placeholder="Güçlü yönler..."
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white min-h-[100px]"
                />
                <textarea
                    name="weaknesses"
                    placeholder="Gelişim alanları..."
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white min-h-[100px]"
                />
                <button
                    type="submit"
                    className="w-full px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg font-medium flex items-center justify-center gap-2"
                >
                    <Save className="w-4 h-4" /> Değerlendirmeyi Kaydet
                </button>
            </form>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                <h4 className="text-lg font-semibold text-white">Geçmiş Değerlendirmeler</h4>
                {person.performanceReviews && person.performanceReviews.length > 0 ? (
                    person.performanceReviews.map(review => (
                        <div key={review.id} className="p-4 bg-slate-700/50 rounded-xl border-l-4 border-green-500">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-white font-bold">
                                        {review.period} - (Puan: {review.score}/10)
                                    </p>
                                    <p className="text-gray-400 text-sm">Değerlendiren: {review.manager}</p>
                                </div>
                                <span className="text-gray-400 text-xs">{formatDate(review.date)}</span>
                            </div>
                            <p className="text-green-300 text-sm mt-1">
                                <strong>Güçlü:</strong> {review.strengths}
                            </p>
                            <p className="text-orange-300 text-sm mt-1">
                                <strong>Gelişim:</strong> {review.weaknesses}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center p-4">Geçmiş değerlendirme bulunmuyor.</p>
                )}
            </div>
        </div>
    );
}

export default PerformanceTab;
