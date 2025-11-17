import React from 'react';
import { FileUp, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DOC_TYPES, EMPLOYEE_STAGES } from '../../config/constants';
import { formatDate } from '../../utils/helpers';

/**
 * Modal'daki Özlük Dosyaları sekmesini render eder
 * Dosya yükleme formu ve mevcut dosya listesini gösterir
 */
function DocumentsTab({ person }) {
    const { candidates, employees, setCandidates, setEmployees } = useApp();

    const handleDocumentUpload = (e) => {
        e.preventDefault();
        const fileInput = e.target.querySelector('input[type="file"]');
        const typeInput = e.target.querySelector('select[name="type"]');
        const file = fileInput.files[0];

        if (!file) {
            alert('Lütfen bir dosya seçin.');
            return;
        }

        const doc = {
            id: Date.now(),
            name: file.name,
            type: typeInput.value,
            uploadDate: new Date().toISOString()
        };

        const isEmployee = EMPLOYEE_STAGES.includes(person.status);
        const updateFn = isEmployee ? setEmployees : setCandidates;
        const dataArray = isEmployee ? employees : candidates;

        updateFn(dataArray.map(p =>
            p.id === person.id
                ? { ...p, documents: [doc, ...(p.documents || [])] }
                : p
        ));

        e.target.reset();
    };

    return (
        <div className="space-y-6">
            <div>
                <h4 className="text-white text-lg font-medium mb-3">Yeni Özlük Dosyası Yükle</h4>
                <form onSubmit={handleDocumentUpload} className="p-4 bg-slate-700/30 rounded-xl space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="text-gray-300 text-sm mb-1 block">Dosya</label>
                            <input
                                name="file"
                                type="file"
                                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-gray-300 text-sm mb-1 block">Dosya Türü</label>
                            <select
                                name="type"
                                className="w-full px-4 py-2.5 bg-slate-700 border border-purple-500/30 rounded-lg text-white"
                                required
                            >
                                {DOC_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg font-medium flex items-center justify-center gap-2"
                    >
                        <FileUp className="w-4 h-4" /> Dosyayı Ekle
                    </button>
                </form>
            </div>

            <div>
                <h4 className="text-white text-lg font-medium mb-3">
                    Mevcut Dosyalar ({person.documents?.length || 0})
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {person.documents && person.documents.length > 0 ? (
                        person.documents.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-purple-400" />
                                    <div>
                                        <p className="text-white text-sm font-medium">{doc.name}</p>
                                        <p className="text-gray-400 text-xs">{doc.type}</p>
                                    </div>
                                </div>
                                <span className="text-gray-400 text-xs">{formatDate(doc.uploadDate)}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-center p-4">Yüklenmiş dosya bulunmuyor.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DocumentsTab;
