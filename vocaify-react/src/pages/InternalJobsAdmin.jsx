import React, { useState } from 'react';
import { Briefcase, Plus, Users, TrendingUp, CheckCircle, X, Clock, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

/**
 * Internal Talent Marketplace - Admin Panel
 * İK yöneticileri için şirket içi pozisyon yönetimi
 * AŞAMA 23
 */
function InternalJobsAdmin() {
    const { candidates, setCandidates } = useApp();
    const { currentUser } = useAuth();

    // İç ilanlar state - gerçekte Firebase'den gelecek
    const [internalJobs, setInternalJobs] = useState([
        {
            id: 1,
            title: 'Kıdemli Frontend Geliştirici',
            department: 'Mühendislik',
            location: 'İstanbul / Hybrid',
            description: 'React, TypeScript ve modern frontend teknolojileriyle çalışacak kıdemli geliştirici arıyoruz.',
            requirements: [
                '5+ yıl React deneyimi',
                'TypeScript bilgisi',
                'State management (Redux, MobX)',
                'RESTful API entegrasyonu'
            ],
            preferredSkills: ['Next.js', 'GraphQL', 'Tailwind CSS'],
            salaryRange: '₺45,000 - ₺65,000',
            status: 'active',
            createdBy: 'İK Admin',
            createdDate: '2025-03-01',
            deadline: '2025-03-31',
            applications: []
        },
        {
            id: 2,
            title: 'Proje Yöneticisi',
            department: 'Operasyon',
            location: 'Ankara',
            description: 'Çapraz fonksiyonel takımları yönetecek deneyimli proje yöneticisi.',
            requirements: [
                '3+ yıl proje yönetimi',
                'Agile/Scrum bilgisi',
                'Stakeholder yönetimi',
                'Liderlik deneyimi'
            ],
            preferredSkills: ['PMP sertifikası', 'Jira/Confluence'],
            salaryRange: '₺40,000 - ₺55,000',
            status: 'active',
            createdBy: 'İK Admin',
            createdDate: '2025-02-15',
            deadline: '2025-03-15',
            applications: []
        }
    ]);

    const [showNewJobModal, setShowNewJobModal] = useState(false);
    const [newJob, setNewJob] = useState({
        title: '',
        department: '',
        location: '',
        description: '',
        requirements: [''],
        preferredSkills: [''],
        salaryRange: '',
        deadline: ''
    });

    const [selectedJob, setSelectedJob] = useState(null);
    const [showApplicationsModal, setShowApplicationsModal] = useState(false);

    // Çalışanları filtrele
    const employees = candidates.filter(c => c.status === 'personel');

    // Gereksinim/beceri ekleme/çıkarma
    const addRequirement = () => {
        setNewJob({
            ...newJob,
            requirements: [...newJob.requirements, '']
        });
    };

    const removeRequirement = (index) => {
        setNewJob({
            ...newJob,
            requirements: newJob.requirements.filter((_, i) => i !== index)
        });
    };

    const updateRequirement = (index, value) => {
        const updated = [...newJob.requirements];
        updated[index] = value;
        setNewJob({ ...newJob, requirements: updated });
    };

    const addSkill = () => {
        setNewJob({
            ...newJob,
            preferredSkills: [...newJob.preferredSkills, '']
        });
    };

    const removeSkill = (index) => {
        setNewJob({
            ...newJob,
            preferredSkills: newJob.preferredSkills.filter((_, i) => i !== index)
        });
    };

    const updateSkill = (index, value) => {
        const updated = [...newJob.preferredSkills];
        updated[index] = value;
        setNewJob({ ...newJob, preferredSkills: updated });
    };

    // İlan oluştur
    const handleCreateJob = () => {
        if (!newJob.title || !newJob.department || !newJob.description) {
            alert('Lütfen zorunlu alanları doldurun.');
            return;
        }

        const job = {
            id: Date.now(),
            ...newJob,
            requirements: newJob.requirements.filter(r => r.trim() !== ''),
            preferredSkills: newJob.preferredSkills.filter(s => s.trim() !== ''),
            status: 'active',
            createdBy: currentUser?.displayName || currentUser?.email,
            createdDate: new Date().toISOString(),
            applications: []
        };

        setInternalJobs([...internalJobs, job]);
        setShowNewJobModal(false);
        setNewJob({
            title: '',
            department: '',
            location: '',
            description: '',
            requirements: [''],
            preferredSkills: [''],
            salaryRange: '',
            deadline: ''
        });

        alert('İç ilan başarıyla oluşturuldu ve çalışanlara görünür hale geldi!');
    };

    // İlanı kapat
    const closeJob = (jobId) => {
        setInternalJobs(internalJobs.map(job =>
            job.id === jobId ? { ...job, status: 'closed' } : job
        ));
    };

    // Başvuruları görüntüle
    const viewApplications = (job) => {
        setSelectedJob(job);
        setShowApplicationsModal(true);
    };

    const statusColors = {
        active: 'bg-green-500/20 text-green-300 border-green-500/30',
        closed: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };

    const statusLabels = {
        active: 'Aktif',
        closed: 'Kapalı'
    };

    return (
        <div className="space-y-6" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-purple-400" />
                        İç Yetenek Pazarı
                    </h2>
                    <p className="text-gray-400">Şirket içi kariyer fırsatlarını yönetin (Internal Mobility)</p>
                </div>
                <button
                    onClick={() => setShowNewJobModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Yeni İç İlan Oluştur
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <Briefcase className="w-8 h-8 text-purple-400" />
                        <span className="text-2xl font-bold text-white">{internalJobs.length}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Toplam İlan</p>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                        <span className="text-2xl font-bold text-white">
                            {internalJobs.filter(j => j.status === 'active').length}
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm">Aktif İlan</p>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <Users className="w-8 h-8 text-blue-400" />
                        <span className="text-2xl font-bold text-white">{employees.length}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Toplam Çalışan</p>
                </div>
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="w-8 h-8 text-yellow-400" />
                        <span className="text-2xl font-bold text-white">
                            {internalJobs.reduce((sum, job) => sum + job.applications.length, 0)}
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm">Toplam Başvuru</p>
                </div>
            </div>

            {/* Jobs List */}
            <div className="glass p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-purple-400" />
                    Şirket İçi İlanlar
                </h3>
                <div className="space-y-4">
                    {internalJobs.map((job) => (
                        <div key={job.id} className="bg-slate-800/50 p-5 rounded-lg border border-purple-500/20">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-white font-medium text-lg">{job.title}</h4>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[job.status]}`}>
                                            {statusLabels[job.status]}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                                        <span className="flex items-center gap-1">
                                            <Building2 className="w-4 h-4" />
                                            {job.department}
                                        </span>
                                        <span>•</span>
                                        <span>{job.location}</span>
                                        <span>•</span>
                                        <span>{job.salaryRange || 'Maaş belirtilmemiş'}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-3">{job.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span>{job.createdBy} tarafından oluşturuldu</span>
                                        <span>•</span>
                                        <span>{new Date(job.createdDate).toLocaleDateString('tr-TR')}</span>
                                        {job.deadline && (
                                            <>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    Son: {new Date(job.deadline).toLocaleDateString('tr-TR')}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Requirements & Skills Preview */}
                            <div className="grid grid-cols-2 gap-4 mb-3 pt-3 border-t border-purple-500/20">
                                <div>
                                    <p className="text-gray-400 text-xs mb-2">Gereksinimler:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {job.requirements.slice(0, 3).map((req, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs">
                                                {req.length > 30 ? req.substring(0, 30) + '...' : req}
                                            </span>
                                        ))}
                                        {job.requirements.length > 3 && (
                                            <span className="text-gray-500 text-xs">+{job.requirements.length - 3}</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs mb-2">Tercih Edilen Beceriler:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {job.preferredSkills.slice(0, 3).map((skill, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                                                {skill}
                                            </span>
                                        ))}
                                        {job.preferredSkills.length > 3 && (
                                            <span className="text-gray-500 text-xs">+{job.preferredSkills.length - 3}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => viewApplications(job)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-sm flex items-center gap-2"
                                >
                                    <Users className="w-4 h-4" />
                                    Başvurular ({job.applications.length})
                                </button>
                                {job.status === 'active' && (
                                    <button
                                        onClick={() => closeJob(job.id)}
                                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all text-sm"
                                    >
                                        İlanı Kapat
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* New Job Modal */}
            {showNewJobModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 overflow-y-auto">
                    <div className="glass max-w-4xl w-full p-6 rounded-2xl my-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white">Yeni İç İlan Oluştur</h3>
                            <button
                                onClick={() => setShowNewJobModal(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-gray-300 text-sm mb-2 block">Pozisyon Adı *</label>
                                    <input
                                        type="text"
                                        value={newJob.title}
                                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                                        placeholder="Örn: Kıdemli Frontend Geliştirici"
                                        className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-300 text-sm mb-2 block">Departman *</label>
                                    <input
                                        type="text"
                                        value={newJob.department}
                                        onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                                        placeholder="Örn: Mühendislik"
                                        className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-gray-300 text-sm mb-2 block">Lokasyon</label>
                                    <input
                                        type="text"
                                        value={newJob.location}
                                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                                        placeholder="Örn: İstanbul / Hybrid"
                                        className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-300 text-sm mb-2 block">Maaş Aralığı</label>
                                    <input
                                        type="text"
                                        value={newJob.salaryRange}
                                        onChange={(e) => setNewJob({ ...newJob, salaryRange: e.target.value })}
                                        placeholder="Örn: ₺40,000 - ₺60,000"
                                        className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">Açıklama *</label>
                                <textarea
                                    value={newJob.description}
                                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                                    rows="3"
                                    placeholder="Pozisyon açıklaması..."
                                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all resize-none"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-gray-300 text-sm">Gereksinimler</label>
                                    <button
                                        onClick={addRequirement}
                                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Ekle
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {newJob.requirements.map((req, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={req}
                                                onChange={(e) => updateRequirement(idx, e.target.value)}
                                                placeholder={`Gereksinim ${idx + 1}`}
                                                className="flex-1 px-3 py-2 bg-slate-700 text-white rounded border border-purple-500/30 focus:border-purple-500 transition-all text-sm"
                                            />
                                            {newJob.requirements.length > 1 && (
                                                <button
                                                    onClick={() => removeRequirement(idx)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-gray-300 text-sm">Tercih Edilen Beceriler</label>
                                    <button
                                        onClick={addSkill}
                                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Ekle
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {newJob.preferredSkills.map((skill, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={skill}
                                                onChange={(e) => updateSkill(idx, e.target.value)}
                                                placeholder={`Beceri ${idx + 1}`}
                                                className="flex-1 px-3 py-2 bg-slate-700 text-white rounded border border-purple-500/30 focus:border-purple-500 transition-all text-sm"
                                            />
                                            {newJob.preferredSkills.length > 1 && (
                                                <button
                                                    onClick={() => removeSkill(idx)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-300 text-sm mb-2 block">Başvuru Son Tarihi</label>
                                <input
                                    type="date"
                                    value={newJob.deadline}
                                    onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-purple-500/30 focus:border-purple-500 transition-all"
                                />
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                <p className="text-blue-300 text-sm">
                                    <strong>🤖 AI Eşleştirme:</strong> İlan oluşturulduktan sonra, AI sistemimiz
                                    bu pozisyona uygun çalışanları otomatik olarak tespit edip onlara önerecektir.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleCreateJob}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Briefcase className="w-5 h-5" />
                                İlanı Oluştur
                            </button>
                            <button
                                onClick={() => setShowNewJobModal(false)}
                                className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Applications Modal */}
            {showApplicationsModal && selectedJob && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="glass max-w-4xl w-full p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-white">{selectedJob.title} - Başvurular</h3>
                                <p className="text-gray-400 text-sm mt-1">{selectedJob.applications.length} başvuru</p>
                            </div>
                            <button
                                onClick={() => setShowApplicationsModal(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {selectedJob.applications.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-400">Henüz başvuru bulunmuyor.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {selectedJob.applications.map((app) => (
                                    <div key={app.id} className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-white font-medium">{app.employeeName}</p>
                                                <p className="text-gray-400 text-sm">
                                                    AI Eşleşme: {app.matchScore}% • {new Date(app.appliedDate).toLocaleDateString('tr-TR')}
                                                </p>
                                            </div>
                                            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all text-sm">
                                                Profili İncele
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => setShowApplicationsModal(false)}
                            className="w-full mt-6 px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
                        >
                            Kapat
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InternalJobsAdmin;
