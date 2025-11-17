import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KPI_CATEGORIES } from '../../config/constants';

/**
 * Modal'daki Değerlendirme sekmesini render eder
 * 10 kategoride KPI değerlendirme formu ve toplam skoru gösterir
 */
function EvaluationTab({ person }) {
    const { candidates, setCandidates, closeModal } = useApp();
    const [kpiScores, setKpiScores] = useState(person.kpiScores || {});

    const totalScore = Object.values(kpiScores).reduce((sum, score) => sum + (parseInt(score) || 0), 0);

    const handleScoreChange = (category, value) => {
        setKpiScores(prev => ({
            ...prev,
            [category]: parseInt(value)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setCandidates(candidates.map(c =>
            c.id === person.id
                ? { ...c, kpiScores, totalKpiScore: totalScore }
                : c
        ));
        closeModal();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 p-6 rounded-xl text-center">
                <p className="text-gray-300 text-sm mb-2">Toplam KPI Skoru (100 Üzerinden)</p>
                <p className="text-5xl font-bold text-white">{totalScore}</p>
                <div className="mt-3 w-full bg-slate-700 rounded-full h-3">
                    <div
                        className="gradient-bg h-3 rounded-full transition-all"
                        style={{ width: `${totalScore}%` }}
                    ></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {KPI_CATEGORIES.map((kpi, index) => {
                    const score = kpiScores[kpi] || 0;
                    return (
                        <div key={kpi} className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-white font-medium">{kpi}</label>
                                <span className="text-purple-400 font-bold text-lg">
                                    {score}/10
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="10"
                                value={score}
                                onChange={(e) => handleScoreChange(kpi, e.target.value)}
                                className="kpi-slider w-full"
                            />
                        </div>
                    );
                })}
            </div>

            <div className="pt-6 border-t border-slate-700">
                <button
                    type="submit"
                    className="w-full px-6 py-3 gradient-bg text-white rounded-lg hover:shadow-xl transition-all font-medium flex items-center justify-center gap-2"
                >
                    <Save className="w-4 h-4" /> KPI Puanlarını Kaydet
                </button>
            </div>
        </form>
    );
}

export default EvaluationTab;
