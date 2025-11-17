import React from 'react';
import { Check } from 'lucide-react';
import { formatDateTime } from '../../utils/helpers';

const STATUS_CONFIG_LOCAL = {
    'aday': { label: 'Aday', color: 'bg-blue-500' },
    'egitim': { label: 'Eğitim', color: 'bg-purple-500' },
    'oryantasyon': { label: 'Oryantasyon', color: 'bg-yellow-500' },
    'deneme': { label: 'Deneme Süreci', color: 'bg-orange-500' },
    'iki-aylik': { label: '2 Aylık Personel', color: 'bg-teal-500' },
    'personel': { label: 'Personel', color: 'bg-green-500' },
    'eski-personel': { label: 'Eski Personel', color: 'bg-gray-500' }
};

/**
 * Modal'daki Süreç Geçmişi sekmesini render eder
 * Kişinin statü değişikliklerini timeline formatında gösterir
 */
function HistoryTab({ person }) {
    const history = [...(person.statusHistory || [])].reverse();

    return (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            <h4 className="text-lg font-semibold text-white">Süreç Geçmişi</h4>
            {history.map((entry, index) => (
                <div key={index} className="flex items-start gap-4">
                    <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${STATUS_CONFIG_LOCAL[entry.status]?.color || 'bg-gray-500'}`}>
                        <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-white font-medium">
                            {STATUS_CONFIG_LOCAL[entry.status]?.label || entry.status}
                        </p>
                        <p className="text-gray-400 text-sm">{entry.note}</p>
                        <p className="text-gray-500 text-xs">{formatDateTime(entry.date)}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default HistoryTab;
