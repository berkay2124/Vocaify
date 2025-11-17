import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
    Briefcase,
    TrendingUp,
    MapPin,
    DollarSign,
    Calendar,
    CheckCircle,
    AlertCircle,
    Send,
    Star,
    Award,
    Target,
    Sparkles
} from 'lucide-react';

/**
 * CareerOpportunities Component
 *
 * Employee-facing page for internal job opportunities with AI-powered matching.
 *
 * FEATURES:
 * - AI matching algorithm that compares employee profile with job requirements
 * - Match percentage calculation based on skills and performance
 * - Proactive notifications for highly-matched positions
 * - Job application workflow
 * - Performance-based recommendations
 */
function CareerOpportunities() {
    const { candidates, setCandidates } = useApp();
    const { currentUser } = useAuth();

    const [internalJobs, setInternalJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicationMessage, setApplicationMessage] = useState('');
    const [showApplicationModal, setShowApplicationModal] = useState(false);

    // Find current employee record
    const employeeRecord = candidates.find(c =>
        c.email?.toLowerCase() === currentUser?.email?.toLowerCase()
    );

    // Demo internal jobs data (in production, this would come from Firestore)
    useEffect(() => {
        const demoJobs = [
            {
                id: 1,
                title: 'Kıdemli Yazılım Geliştirici',
                department: 'Mühendislik',
                location: 'İstanbul (Hibrit)',
                salaryRange: '25.000₺ - 35.000₺',
                description: 'React, Node.js ve cloud teknolojileri ile enterprise uygulamalar geliştirmek için kıdemli geliştirici arıyoruz.',
                requirements: [
                    '5+ yıl yazılım geliştirme deneyimi',
                    'React ve modern JavaScript (ES6+) uzmanlığı',
                    'Node.js ve REST API geliştirme',
                    'Agile/Scrum metodolojisi deneyimi',
                    'Takım liderliği ve mentorluk becerisi'
                ],
                preferredSkills: [
                    'React',
                    'Node.js',
                    'JavaScript',
                    'TypeScript',
                    'Cloud (AWS/Azure)',
                    'Docker',
                    'Agile'
                ],
                applicationDeadline: '2025-12-31',
                status: 'active',
                createdBy: 'İK Departmanı',
                createdDate: '2025-11-10T10:00:00Z',
                applications: []
            },
            {
                id: 2,
                title: 'Ürün Müdürü',
                department: 'Ürün Yönetimi',
                location: 'İstanbul (Ofis)',
                salaryRange: '30.000₺ - 45.000₺',
                description: 'B2B SaaS ürünlerimizin yol haritasını belirleyecek ve geliştirme ekipleriyle çalışacak deneyimli ürün müdürü arıyoruz.',
                requirements: [
                    '3+ yıl ürün yönetimi deneyimi',
                    'B2B SaaS deneyimi',
                    'Veri odaklı karar verme',
                    'Stakeholder yönetimi',
                    'Teknik anlayış'
                ],
                preferredSkills: [
                    'Product Management',
                    'Agile',
                    'Data Analysis',
                    'SQL',
                    'Jira',
                    'Figma',
                    'User Research'
                ],
                applicationDeadline: '2025-12-15',
                status: 'active',
                createdBy: 'İK Departmanı',
                createdDate: '2025-11-08T09:00:00Z',
                applications: []
            },
            {
                id: 3,
                title: 'DevOps Mühendisi',
                department: 'Altyapı',
                location: 'İstanbul (Uzaktan)',
                salaryRange: '22.000₺ - 32.000₺',
                description: 'CI/CD pipeline\'larımızı yönetecek ve cloud altyapımızı optimize edecek DevOps mühendisi arıyoruz.',
                requirements: [
                    '3+ yıl DevOps/Altyapı deneyimi',
                    'AWS veya Azure deneyimi',
                    'Docker ve Kubernetes',
                    'CI/CD araçları (Jenkins, GitLab CI)',
                    'Infrastructure as Code (Terraform)'
                ],
                preferredSkills: [
                    'AWS',
                    'Docker',
                    'Kubernetes',
                    'Terraform',
                    'Jenkins',
                    'Python',
                    'Linux'
                ],
                applicationDeadline: '2025-12-20',
                status: 'active',
                createdBy: 'İK Departmanı',
                createdDate: '2025-11-05T14:00:00Z',
                applications: []
            },
            {
                id: 4,
                title: 'UI/UX Tasarımcı',
                department: 'Tasarım',
                location: 'İstanbul (Hibrit)',
                salaryRange: '18.000₺ - 28.000₺',
                description: 'Kullanıcı deneyimini iyileştirecek ve modern arayüzler tasarlayacak UI/UX tasarımcı arıyoruz.',
                requirements: [
                    '2+ yıl UI/UX tasarım deneyimi',
                    'Figma veya Adobe XD uzmanlığı',
                    'User research ve usability testing',
                    'Design systems deneyimi',
                    'Web ve mobil tasarım'
                ],
                preferredSkills: [
                    'Figma',
                    'Adobe XD',
                    'User Research',
                    'Prototyping',
                    'HTML/CSS',
                    'Design Systems'
                ],
                applicationDeadline: '2025-12-25',
                status: 'active',
                createdBy: 'İK Departmanı',
                createdDate: '2025-11-12T11:00:00Z',
                applications: []
            }
        ];

        setInternalJobs(demoJobs);
    }, []);

    /**
     * AI MATCHING ALGORITHM
     *
     * Calculates how well an employee matches a job posting based on:
     * 1. Skills match (40% weight)
     * 2. Performance ratings (30% weight)
     * 3. Experience level (20% weight)
     * 4. Additional factors (10% weight)
     *
     * Returns a match object with percentage and breakdown
     */
    const calculateJobMatch = (job) => {
        if (!employeeRecord) {
            return { percentage: 0, breakdown: {} };
        }

        let totalScore = 0;
        const breakdown = {};

        // 1. SKILLS MATCH (40% weight)
        const employeeSkills = employeeRecord.analysis?.skills || [];
        const jobSkills = job.preferredSkills || [];

        if (jobSkills.length > 0) {
            const matchedSkills = jobSkills.filter(jobSkill =>
                employeeSkills.some(empSkill =>
                    empSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
                    jobSkill.toLowerCase().includes(empSkill.toLowerCase())
                )
            );

            const skillsScore = (matchedSkills.length / jobSkills.length) * 40;
            totalScore += skillsScore;
            breakdown.skills = {
                score: Math.round(skillsScore),
                matched: matchedSkills,
                total: jobSkills.length
            };
        } else {
            breakdown.skills = { score: 20, matched: [], total: 0 }; // Default if no skills specified
            totalScore += 20;
        }

        // 2. PERFORMANCE RATINGS (30% weight)
        const evaluations = employeeRecord.evaluations || [];
        const recentEval = evaluations[evaluations.length - 1];

        if (recentEval && recentEval.rating) {
            // Convert 1-5 star rating to 0-30 score
            const performanceScore = (recentEval.rating / 5) * 30;
            totalScore += performanceScore;
            breakdown.performance = {
                score: Math.round(performanceScore),
                rating: recentEval.rating,
                hasEvaluation: true
            };
        } else {
            // Check OKR completion if no formal evaluation
            const approvedOKRs = (employeeRecord.okrs || []).filter(okr => okr.status === 'approved');
            if (approvedOKRs.length > 0) {
                const avgProgress = approvedOKRs.reduce((sum, okr) => sum + (okr.progress || 0), 0) / approvedOKRs.length;
                const performanceScore = (avgProgress / 100) * 30;
                totalScore += performanceScore;
                breakdown.performance = {
                    score: Math.round(performanceScore),
                    okrProgress: Math.round(avgProgress),
                    hasEvaluation: false
                };
            } else {
                breakdown.performance = { score: 15, hasEvaluation: false }; // Default mid-range
                totalScore += 15;
            }
        }

        // 3. EXPERIENCE LEVEL (20% weight)
        const employeeExp = employeeRecord.analysis?.experience_years || 0;
        const jobTitle = job.title.toLowerCase();

        let requiredExp = 2; // Default
        if (jobTitle.includes('kıdemli') || jobTitle.includes('senior')) {
            requiredExp = 5;
        } else if (jobTitle.includes('baş') || jobTitle.includes('lead') || jobTitle.includes('müdür')) {
            requiredExp = 7;
        } else if (jobTitle.includes('junior') || jobTitle.includes('stajyer')) {
            requiredExp = 0;
        }

        let experienceScore = 0;
        if (employeeExp >= requiredExp) {
            experienceScore = 20; // Full points if meets requirement
        } else if (employeeExp >= requiredExp * 0.7) {
            experienceScore = 15; // Partial points if close
        } else {
            experienceScore = 10; // Minimum points
        }

        totalScore += experienceScore;
        breakdown.experience = {
            score: experienceScore,
            years: employeeExp,
            required: requiredExp
        };

        // 4. ADDITIONAL FACTORS (10% weight)
        let additionalScore = 10; // Base score

        // Bonus for same department
        if (employeeRecord.analysis?.position?.toLowerCase().includes(job.department.toLowerCase())) {
            additionalScore += 5;
        }

        // Cap at 10
        additionalScore = Math.min(additionalScore, 10);
        totalScore += additionalScore;
        breakdown.additional = { score: additionalScore };

        return {
            percentage: Math.round(totalScore),
            breakdown
        };
    };

    // Calculate matches for all jobs and sort by match percentage
    const jobsWithMatches = internalJobs
        .filter(job => job.status === 'active')
        .map(job => ({
            ...job,
            match: calculateJobMatch(job)
        }))
        .sort((a, b) => b.match.percentage - a.match.percentage);

    // Check if employee already applied
    const hasApplied = (jobId) => {
        return internalJobs.find(j => j.id === jobId)?.applications?.some(
            app => app.employeeId === employeeRecord?.id
        );
    };

    // Handle job application
    const handleApply = () => {
        if (!applicationMessage.trim()) {
            alert('Lütfen bir motivasyon yazısı ekleyin.');
            return;
        }

        if (!employeeRecord) {
            alert('Çalışan kaydınız bulunamadı.');
            return;
        }

        const application = {
            id: Date.now(),
            jobId: selectedJob.id,
            employeeId: employeeRecord.id,
            employeeName: employeeRecord.name,
            employeeEmail: employeeRecord.email,
            message: applicationMessage,
            matchPercentage: selectedJob.match.percentage,
            appliedDate: new Date().toISOString(),
            status: 'pending'
        };

        // Update job applications
        const updatedJobs = internalJobs.map(job => {
            if (job.id === selectedJob.id) {
                return {
                    ...job,
                    applications: [...(job.applications || []), application]
                };
            }
            return job;
        });

        setInternalJobs(updatedJobs);

        // Add to employee record
        const updatedCandidates = candidates.map(c => {
            if (c.id === employeeRecord.id) {
                return {
                    ...c,
                    internalApplications: [...(c.internalApplications || []), application]
                };
            }
            return c;
        });
        setCandidates(updatedCandidates);

        alert('✅ Başvurunuz başarıyla gönderildi! İK departmanı inceleyecektir.');
        setShowApplicationModal(false);
        setApplicationMessage('');
        setSelectedJob(null);
    };

    // Get match color based on percentage
    const getMatchColor = (percentage) => {
        if (percentage >= 75) return 'text-green-400 bg-green-500/20 border-green-500/30';
        if (percentage >= 50) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    };

    const getMatchBadgeColor = (percentage) => {
        if (percentage >= 75) return 'bg-green-500/20 text-green-400 border-green-500/30';
        if (percentage >= 50) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    };

    // Top recommendations (75%+ match)
    const topRecommendations = jobsWithMatches.filter(job => job.match.percentage >= 75);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <Sparkles className="w-8 h-8 text-purple-400" />
                            Kariyer Fırsatları
                        </h1>
                        <p className="text-gray-300">
                            AI destekli eşleştirme ile sana en uygun şirket içi pozisyonları keşfet
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold text-purple-400">
                            {jobsWithMatches.length}
                        </div>
                        <div className="text-sm text-gray-400">Aktif Pozisyon</div>
                    </div>
                </div>
            </div>

            {/* Proactive Recommendations */}
            {topRecommendations.length > 0 && (
                <div className="glass p-6 rounded-2xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-900/30 to-pink-900/30">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Award className="w-6 h-6 text-purple-400" />
                        🎯 Sana Özel Öneriler
                    </h2>
                    <p className="text-gray-300 mb-4">
                        Profilin ve performansına göre sana <strong>yüksek oranda uygun</strong> pozisyonlar bulundu!
                    </p>

                    <div className="space-y-3">
                        {topRecommendations.map(job => (
                            <div
                                key={job.id}
                                className="bg-white/5 border border-purple-500/30 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer"
                                onClick={() => setSelectedJob(job)}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-white">
                                                {job.title}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getMatchBadgeColor(job.match.percentage)}`}>
                                                %{job.match.percentage} Eşleşme
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Briefcase className="w-4 h-4" />
                                                {job.department}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {job.location}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-3">
                                    <p className="text-purple-300 text-sm font-medium">
                                        💡 Şirket içinde sana <strong>%{job.match.percentage} uyumlu</strong> "{job.title}" pozisyonu açıldı. Başvurmak ister misin?
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All Job Listings */}
            <div className="glass p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                    Tüm Açık Pozisyonlar
                </h2>

                <div className="space-y-4">
                    {jobsWithMatches.map(job => {
                        const applied = hasApplied(job.id);

                        return (
                            <div
                                key={job.id}
                                className={`bg-white/5 border rounded-xl p-5 hover:bg-white/10 transition-all cursor-pointer ${getMatchColor(job.match.percentage)}`}
                                onClick={() => setSelectedJob(job)}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white">
                                                {job.title}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getMatchBadgeColor(job.match.percentage)}`}>
                                                %{job.match.percentage}
                                            </span>
                                            {applied && (
                                                <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                                    ✓ Başvuruldu
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
                                            <span className="flex items-center gap-1">
                                                <Briefcase className="w-4 h-4" />
                                                {job.department}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" />
                                                {job.salaryRange}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                Son: {new Date(job.applicationDeadline).toLocaleDateString('tr-TR')}
                                            </span>
                                        </div>

                                        <p className="text-gray-400 text-sm mb-3">
                                            {job.description}
                                        </p>

                                        {/* Match Breakdown */}
                                        {job.match.breakdown && (
                                            <div className="grid grid-cols-4 gap-2 text-xs">
                                                <div className="bg-white/5 rounded-lg p-2">
                                                    <div className="text-gray-400">Yetenekler</div>
                                                    <div className="text-white font-bold">
                                                        {job.match.breakdown.skills?.matched?.length || 0}/{job.match.breakdown.skills?.total || 0}
                                                    </div>
                                                </div>
                                                <div className="bg-white/5 rounded-lg p-2">
                                                    <div className="text-gray-400">Performans</div>
                                                    <div className="text-white font-bold flex items-center gap-1">
                                                        {job.match.breakdown.performance?.rating ? (
                                                            <>
                                                                {job.match.breakdown.performance.rating}
                                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                            </>
                                                        ) : (
                                                            `${job.match.breakdown.performance?.okrProgress || '--'}%`
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="bg-white/5 rounded-lg p-2">
                                                    <div className="text-gray-400">Deneyim</div>
                                                    <div className="text-white font-bold">
                                                        {job.match.breakdown.experience?.years || 0} yıl
                                                    </div>
                                                </div>
                                                <div className="bg-white/5 rounded-lg p-2">
                                                    <div className="text-gray-400">Toplam</div>
                                                    <div className="text-white font-bold">
                                                        %{job.match.percentage}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {jobsWithMatches.length === 0 && (
                        <div className="text-center py-12">
                            <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">Şu anda açık pozisyon bulunmuyor.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Job Detail Modal */}
            {selectedJob && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30">
                        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 border-b border-white/10">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-2">
                                        {selectedJob.title}
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getMatchBadgeColor(selectedJob.match.percentage)}`}>
                                            %{selectedJob.match.percentage} Eşleşme
                                        </span>
                                        {hasApplied(selectedJob.id) && (
                                            <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                                                ✓ Başvuruldu
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedJob(null)}
                                    className="text-white/70 hover:text-white text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Job Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <Briefcase className="w-4 h-4" />
                                        Departman
                                    </div>
                                    <div className="text-white font-bold">{selectedJob.department}</div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <MapPin className="w-4 h-4" />
                                        Lokasyon
                                    </div>
                                    <div className="text-white font-bold">{selectedJob.location}</div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <DollarSign className="w-4 h-4" />
                                        Maaş Aralığı
                                    </div>
                                    <div className="text-white font-bold">{selectedJob.salaryRange}</div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                                        <Calendar className="w-4 h-4" />
                                        Son Başvuru
                                    </div>
                                    <div className="text-white font-bold">
                                        {new Date(selectedJob.applicationDeadline).toLocaleDateString('tr-TR')}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Pozisyon Açıklaması</h3>
                                <p className="text-gray-300">{selectedJob.description}</p>
                            </div>

                            {/* Requirements */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Gereksinimler</h3>
                                <ul className="space-y-2">
                                    {selectedJob.requirements.map((req, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-300">
                                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Preferred Skills */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Tercih Edilen Yetenekler</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedJob.preferredSkills.map((skill, idx) => {
                                        const isMatched = selectedJob.match.breakdown.skills?.matched?.includes(skill);
                                        return (
                                            <span
                                                key={idx}
                                                className={`px-3 py-1 rounded-full text-sm border ${
                                                    isMatched
                                                        ? 'bg-green-500/20 text-green-400 border-green-500/30 font-bold'
                                                        : 'bg-white/5 text-gray-400 border-white/10'
                                                }`}
                                            >
                                                {isMatched && '✓ '}{skill}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Match Analysis */}
                            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
                                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-purple-400" />
                                    Eşleşme Analizi
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <div className="text-sm text-gray-400 mb-1">Yetenek Eşleşmesi</div>
                                        <div className="text-xl font-bold text-white">
                                            {selectedJob.match.breakdown.skills?.matched?.length || 0}/{selectedJob.match.breakdown.skills?.total || 0}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            %{selectedJob.match.breakdown.skills?.score || 0} katkı
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <div className="text-sm text-gray-400 mb-1">Performans Puanı</div>
                                        <div className="text-xl font-bold text-white flex items-center gap-1">
                                            {selectedJob.match.breakdown.performance?.rating ? (
                                                <>
                                                    {selectedJob.match.breakdown.performance.rating}
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                </>
                                            ) : (
                                                `${selectedJob.match.breakdown.performance?.okrProgress || '--'}%`
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            %{selectedJob.match.breakdown.performance?.score || 0} katkı
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <div className="text-sm text-gray-400 mb-1">Deneyim Seviyesi</div>
                                        <div className="text-xl font-bold text-white">
                                            {selectedJob.match.breakdown.experience?.years || 0} yıl
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            %{selectedJob.match.breakdown.experience?.score || 0} katkı
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <div className="text-sm text-gray-400 mb-1">Toplam Uyum</div>
                                        <div className="text-xl font-bold text-purple-400">
                                            %{selectedJob.match.percentage}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {selectedJob.match.percentage >= 75 ? 'Mükemmel eşleşme!' :
                                             selectedJob.match.percentage >= 50 ? 'İyi eşleşme' :
                                             'Orta seviye'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Apply Button */}
                            {!hasApplied(selectedJob.id) ? (
                                <button
                                    onClick={() => {
                                        setShowApplicationModal(true);
                                        setSelectedJob(selectedJob);
                                    }}
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Bu Pozisyona Başvur
                                </button>
                            ) : (
                                <div className="w-full bg-blue-500/20 border border-blue-500/30 text-blue-300 py-3 rounded-xl font-bold text-center">
                                    <CheckCircle className="w-5 h-5 inline mr-2" />
                                    Başvurunuz alındı - İK incelemesinde
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Application Modal */}
            {showApplicationModal && selectedJob && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-6">
                    <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl max-w-2xl w-full border border-purple-500/30">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl">
                            <h2 className="text-2xl font-bold text-white">
                                Başvuru Yap
                            </h2>
                            <p className="text-purple-100 mt-1">
                                {selectedJob.title}
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Motivasyon Yazısı *
                                </label>
                                <textarea
                                    value={applicationMessage}
                                    onChange={(e) => setApplicationMessage(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors h-40"
                                    placeholder="Neden bu pozisyon için uygun olduğunuzu, hedeflerinizi ve motivasyonunuzu yazın..."
                                />
                            </div>

                            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                                <p className="text-purple-300 text-sm">
                                    <strong>💡 İpucu:</strong> Başvurunuz %{selectedJob.match.percentage} eşleşme oranıyla öne çıkıyor.
                                    Motivasyon yazınızda yeteneklerinizi ve deneyimlerinizi vurgulayın.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowApplicationModal(false);
                                        setApplicationMessage('');
                                    }}
                                    className="flex-1 px-6 py-3 rounded-xl font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleApply}
                                    className="flex-1 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Başvuruyu Gönder
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CareerOpportunities;
