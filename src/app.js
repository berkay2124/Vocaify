// === VOCAIFY ATS - MAIN APPLICATION ===

// Import Configuration
import { STATUS_CONFIG, EMPLOYEE_STAGES, CANDIDATE_STAGES } from './config.js';

// Import Data Management
import { initDataModule, loadData, saveData } from './data.js';

// Import Utils
import { localAnalyzeCV } from './utils.js';

// Import Components
import { renderHeader } from './components/header.js';
import { renderNavigation } from './components/navigation.js';
import { renderLoader } from './components/loader.js';

// Import Tabs
import { renderDashboard } from './tabs/dashboard.js';
import { renderCandidatesTab } from './tabs/candidates.js';
import { renderEmployeesTab } from './tabs/employees.js';
import { renderSearchTab } from './tabs/search.js';
import { renderAnalyticsTab } from './tabs/analytics.js';

// Import Modal
import { renderModal } from './modal/modal.js';

// === GLOBAL STATE ===
const state = {
    activeTab: 'dashboard',
    candidates: [],
    employees: [],
    loading: false,
    searchQuery: '',
    selectedPerson: null,
    showModal: false,
    modalType: '',
    modalTab: 'detay',
    filterStatus: 'all',
    filterPlatform: 'all'
};

// Initialize data module with state reference
initDataModule(state, render);

// === MAIN RENDER FUNCTION ===
function render() {
    const app = document.getElementById('app');

    app.innerHTML = `
        ${renderHeader(state, handleCVUpload, clearAllData)}
        ${renderNavigation(state, setActiveTab)}
        <main class="max-w-7xl mx-auto px-6 py-8">
            ${renderActiveTab()}
        </main>
        ${renderModal(state)}
        ${renderLoader(state.loading)}
    `;

    // Lucide icons'ı yeniden çalıştır
    lucide.createIcons();
}

// === TAB RENDERING ===
function renderActiveTab() {
    switch (state.activeTab) {
        case 'dashboard':
            return renderDashboard(state);
        case 'candidates':
            return renderCandidatesTab(state);
        case 'employees':
            return renderEmployeesTab(state);
        case 'search':
            return renderSearchTab(state);
        case 'analytics':
            return renderAnalyticsTab(state);
        default:
            return renderDashboard(state);
    }
}

// === CV UPLOAD HANDLER ===
function handleCVUpload(event) {
    const files = Array.from(event.target.files);
    state.loading = true;
    render();

    const newCandidatesList = [];

    setTimeout(() => {
        for (const file of files) {
            const analysis = localAnalyzeCV(file.name);
            const newCandidate = {
                id: 'CND-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                name: analysis.name,
                email: analysis.email,
                phone: analysis.phone,
                cvText: `[Simüle edilmiş CV metni: ${file.name}]`,
                analysis: analysis,
                status: 'aday',
                uploadDate: new Date().toISOString(),
                platform: 'Manuel Yükleme',
                evaluations: [],
                kpiScores: {},
                totalKpiScore: 0,
                interviewNotes: '',
                hrNotes: [],
                decision: '',
                decisionBy: '',
                decisionDate: '',
                decisionReason: '',
                offerDetails: {
                    position: analysis.position || '',
                    salary: '',
                    benefits: '',
                    offerSent: false,
                    offerAccepted: null,
                    startDate: ''
                },
                documents: [{
                    id: Date.now(),
                    name: file.name,
                    type: 'CV',
                    uploadDate: new Date().toISOString()
                }],
                trainings: [],
                surveys: [],
                statusHistory: [{
                    status: 'aday',
                    date: new Date().toISOString(),
                    note: 'Aday oluşturuldu'
                }]
            };
            newCandidatesList.push(newCandidate);
        }

        state.candidates = [...newCandidatesList, ...state.candidates];
        state.loading = false;
        event.target.value = '';
        saveData();
        render();
    }, 1000);
}

// === SMART SEARCH HANDLER ===
function handleSmartSearch() {
    if (!state.searchQuery.trim()) return;
    state.loading = true;
    render();

    setTimeout(() => {
        const query = state.searchQuery.toLowerCase();
        const results = state.candidates.map(c => {
            let score = 0;
            const reason = [];
            if (c.name.toLowerCase().includes(query)) score += 30;
            if (c.analysis.position.toLowerCase().includes(query)) score += 20;
            if (c.analysis.skills.some(s => query.includes(s.toLowerCase()))) {
                score += 40;
                reason.push('Beceri eşleşmesi');
            }
            if (c.analysis.summary.toLowerCase().includes(query)) score += 10;

            return {
                ...c,
                matchScore: Math.min(95, score),
                matchReason: reason.join(', ') || 'Genel anahtar kelime eşleşmesi'
            };
        })
        .filter(c => c.matchScore > 20)
        .sort((a, b) => b.matchScore - a.matchScore);

        const resultIds = new Set(results.map(r => r.id));
        const rest = state.candidates.filter(c => !resultIds.has(c.id));

        state.candidates = [...results, ...rest];
        state.loading = false;
        state.activeTab = 'search';
        render();
    }, 1000);
}

// === LIFECYCLE MANAGEMENT ===
function moveToNextStage(candidateId) {
    const candidate = state.candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    const currentStatus = candidate.status;
    const nextStatus = STATUS_CONFIG[currentStatus]?.next;
    if (!nextStatus) return;

    const newHistoryEntry = {
        status: nextStatus,
        date: new Date().toISOString(),
        note: `${STATUS_CONFIG[nextStatus].label} aşamasına geçirildi.`
    };

    if (nextStatus === 'personel') {
        // Adayı Personele Dönüştür
        const newEmployee = {
            ...candidate,
            status: 'personel',
            employeeId: `EMP-${Date.now()}`,
            startDate: candidate.offerDetails?.startDate || new Date().toISOString(),
            statusHistory: [...(candidate.statusHistory || []), newHistoryEntry],
            matchScore: null,
            matchReason: null,
            performanceReviews: []
        };

        state.employees = [newEmployee, ...state.employees];
        state.candidates = state.candidates.filter(c => c.id !== candidateId);
    } else {
        // Adayın statüsünü güncelle
        candidate.status = nextStatus;
        candidate.statusHistory = [...(candidate.statusHistory || []), newHistoryEntry];
    }

    saveData();
    closeModal();
}

function moveEmployeeToExit(employeeId) {
    if (!confirm('Bu personelin çıkış işlemini başlatmak istediğinizden emin misiniz?')) return;

    const employee = state.employees.find(e => e.id === employeeId);
    if (!employee) return;

    const newHistoryEntry = {
        status: 'eski-personel',
        date: new Date().toISOString(),
        note: 'Çıkış işlemi yapıldı.'
    };

    employee.status = 'eski-personel';
    employee.exitDate = new Date().toISOString();
    employee.statusHistory = [...(employee.statusHistory || []), newHistoryEntry];

    saveData();
    closeModal();
}

// === MODAL MANAGEMENT ===
function openModal(type, person) {
    state.modalType = type;
    state.selectedPerson = JSON.parse(JSON.stringify(person)); // Deep copy
    state.modalTab = 'detay';
    state.showModal = true;
    render();
}

function closeModal() {
    state.showModal = false;
    state.selectedPerson = null;
    state.modalType = '';
    render();
}

function setModalTab(tab) {
    state.modalTab = tab;
    render();
}

// === MODAL FORM HANDLERS ===
function handleModalFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const id = state.selectedPerson.id;
    const isEmployee = EMPLOYEE_STAGES.includes(state.selectedPerson.status);
    const person = isEmployee
        ? state.employees.find(p => p.id === id)
        : state.candidates.find(p => p.id === id);

    if (!person) {
        alert("Hata: Kişi bulunamadı.");
        return;
    }

    try {
        const modalFormType = event.target.dataset.modalType;

        switch (modalFormType) {
            case 'evaluate':
                const newKpiScores = {};
                let totalScore = 0;
                for (const kpi of ['İletişim Becerileri', 'Teknik Yeterlilik', 'Problem Çözme', 'Takım Çalışması', 'Adaptasyon', 'İnisiyatif Alma', 'Güvenilirlik', 'Öğrenme Hızı', 'Kültürel Uyum', 'Liderlik Potansiyeli']) {
                    const score = parseInt(data[kpi] || 0);
                    newKpiScores[kpi] = score;
                    totalScore += score;
                }
                person.kpiScores = newKpiScores;
                person.totalKpiScore = totalScore;
                break;

            case 'decision':
                const evaluation = {
                    date: new Date().toISOString(),
                    evaluator: data.decisionBy,
                    decision: data.decision,
                    reason: data.decisionReason
                };
                person.decision = data.decision;
                person.decisionBy = data.decisionBy;
                person.decisionDate = evaluation.date;
                person.decisionReason = data.decisionReason;
                person.evaluations = [evaluation, ...(person.evaluations || [])];
                break;

            case 'offer':
                person.offerDetails = {
                    ...person.offerDetails,
                    position: data.position,
                    salary: data.salary,
                    benefits: data.benefits,
                    startDate: data.startDate,
                    offerSent: true
                };
                break;

            case 'hrnote':
                person.hrNotes = [
                    {
                        id: Date.now(),
                        note: data.note,
                        author: data.author,
                        category: data.category,
                        date: new Date().toISOString()
                    },
                    ...(person.hrNotes || [])
                ];
                break;

            case 'training':
                person.trainings = [
                    {
                        id: Date.now(),
                        title: data.title,
                        description: data.description,
                        assignedDate: new Date().toISOString(),
                        status: 'planned'
                    },
                    ...(person.trainings || [])
                ];
                break;

            case 'survey':
                person.surveys = [
                    {
                        id: Date.now(),
                        title: data.title,
                        link: data.link,
                        assignedDate: new Date().toISOString(),
                        status: 'sent'
                    },
                    ...(person.surveys || [])
                ];
                break;

            case 'performance':
                person.performanceReviews = [
                    {
                        id: Date.now(),
                        date: new Date().toISOString(),
                        period: data.period,
                        manager: data.manager,
                        score: data.score,
                        strengths: data.strengths,
                        weaknesses: data.weaknesses
                    },
                    ...(person.performanceReviews || [])
                ];
                break;
        }

        saveData();
        closeModal();

    } catch (err) {
        console.error("Form kaydetme hatası:", err);
        alert("Bir hata oluştu: " + err.message);
    }
}

function handleDocumentUpload(event) {
    event.preventDefault();
    const fileInput = event.target.querySelector('input[type="file"]');
    const typeInput = event.target.querySelector('select[name="type"]');
    const file = fileInput.files[0];

    if (!file) {
        alert('Lütfen bir dosya seçin.');
        return;
    }

    const doc = {
        id: Date.now(),
        name: file.name,
        type: typeInput.value,
        uploadDate: new Date().toISOString(),
    };

    const id = state.selectedPerson.id;
    const isEmployee = EMPLOYEE_STAGES.includes(state.selectedPerson.status);
    const person = isEmployee
        ? state.employees.find(p => p.id === id)
        : state.candidates.find(p => p.id === id);

    person.documents = [doc, ...(person.documents || [])];
    state.selectedPerson.documents = person.documents;

    saveData();
    render();

    event.target.reset();
}

function updateOfferStatus(newStatus) {
    const person = state.candidates.find(p => p.id === state.selectedPerson.id);
    if (person) {
        person.offerDetails.offerAccepted = newStatus;
        state.selectedPerson.offerDetails.offerAccepted = newStatus;
        saveData();
        render();
    }
}

function saveNotesFromModal(personId) {
    const notes = document.getElementById('interviewNotes').value;
    const hrNoteText = document.getElementById('hrGeneralNotes').value;
    const isEmployee = EMPLOYEE_STAGES.includes(state.selectedPerson.status);
    const personToUpdate = isEmployee
        ? state.employees.find(p => p.id === personId)
        : state.candidates.find(p => p.id === personId);

    personToUpdate.interviewNotes = notes;
    let newHrNotes = [...(personToUpdate.hrNotes || [])];
    const existingNoteIndex = newHrNotes.findIndex(n => n.category === 'Genel Gözlem');

    if (hrNoteText) {
        if (existingNoteIndex > -1) {
            newHrNotes[existingNoteIndex].note = hrNoteText;
            newHrNotes[existingNoteIndex].date = new Date().toISOString();
        } else {
            newHrNotes.unshift({
                id: Date.now(),
                note: hrNoteText,
                author: 'İK Ekibi',
                category: 'Genel Gözlem',
                date: new Date().toISOString()
            });
        }
        personToUpdate.hrNotes = newHrNotes;
    }

    saveData();
    state.selectedPerson = personToUpdate;
    alert('Notlar Kaydedildi!');
}

// === UTILITY FUNCTIONS ===
function setActiveTab(tab) {
    state.activeTab = tab;
    render();
}

function setFilterStatus(status) {
    state.filterStatus = status;
    render();
}

function setFilterPlatform(platform) {
    state.filterPlatform = platform;
    render();
}

function updateSearchQuery(query) {
    state.searchQuery = query;
}

function clearAllData() {
    if (confirm('TÜM ADAY VE PERSONEL VERİLERİ SİLİNECEK! Emin misiniz?')) {
        state.candidates = [];
        state.employees = [];
        saveData();
        render();
    }
}

// === EXPOSE FUNCTIONS TO WINDOW (for inline event handlers) ===
window.handleCVUpload = handleCVUpload;
window.handleSmartSearch = handleSmartSearch;
window.moveToNextStage = moveToNextStage;
window.moveEmployeeToExit = moveEmployeeToExit;
window.openModal = openModal;
window.closeModal = closeModal;
window.setModalTab = setModalTab;
window.handleModalFormSubmit = handleModalFormSubmit;
window.handleDocumentUpload = handleDocumentUpload;
window.updateOfferStatus = updateOfferStatus;
window.saveNotesFromModal = saveNotesFromModal;
window.setActiveTab = setActiveTab;
window.setFilterStatus = setFilterStatus;
window.setFilterPlatform = setFilterPlatform;
window.updateSearchQuery = updateSearchQuery;
window.clearAllData = clearAllData;

// === INITIALIZE APP ===
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});
