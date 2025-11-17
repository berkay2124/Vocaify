/**
 * Rol Bazlı Erişim Kontrolü (RBAC) Konfigürasyonu
 * Enterprise-grade rol ve izin yönetimi
 */

/**
 * Sistem Rolleri
 */
export const ROLES = {
    ADMIN: 'admin',
    HIRING_MANAGER: 'hiring_manager',
    INTERVIEWER: 'interviewer',
    RECRUITER: 'recruiter'
};

/**
 * Rol Tanımları ve Açıklamaları
 */
export const ROLE_DEFINITIONS = {
    [ROLES.ADMIN]: {
        name: 'Admin',
        displayName: 'Yönetici',
        description: 'Tüm sisteme tam erişim',
        level: 100
    },
    [ROLES.HIRING_MANAGER]: {
        name: 'Hiring Manager',
        displayName: 'İşe Alım Yöneticisi',
        description: 'Departman bazlı aday yönetimi',
        level: 75
    },
    [ROLES.RECRUITER]: {
        name: 'Recruiter',
        displayName: 'İşe Alım Uzmanı',
        description: 'Aday ekleme ve değerlendirme',
        level: 50
    },
    [ROLES.INTERVIEWER]: {
        name: 'Interviewer',
        displayName: 'Mülakatçı',
        description: 'Atanan adayların mülakatı',
        level: 25
    }
};

/**
 * İzin Türleri
 */
export const PERMISSIONS = {
    // Aday İzinleri
    VIEW_ALL_CANDIDATES: 'view_all_candidates',
    VIEW_ASSIGNED_CANDIDATES: 'view_assigned_candidates',
    VIEW_DEPARTMENT_CANDIDATES: 'view_department_candidates',
    ADD_CANDIDATE: 'add_candidate',
    EDIT_CANDIDATE: 'edit_candidate',
    DELETE_CANDIDATE: 'delete_candidate',

    // Personel İzinleri
    VIEW_ALL_EMPLOYEES: 'view_all_employees',
    VIEW_DEPARTMENT_EMPLOYEES: 'view_department_employees',
    ADD_EMPLOYEE: 'add_employee',
    EDIT_EMPLOYEE: 'edit_employee',
    DELETE_EMPLOYEE: 'delete_employee',

    // Mülakat İzinleri
    VIEW_INTERVIEW_NOTES: 'view_interview_notes',
    EDIT_INTERVIEW_NOTES: 'edit_interview_notes',
    ASSIGN_INTERVIEWER: 'assign_interviewer',

    // Teklif İzinleri
    VIEW_OFFER_DETAILS: 'view_offer_details',
    EDIT_OFFER_DETAILS: 'edit_offer_details',
    APPROVE_OFFER: 'approve_offer',

    // Mali İzinler
    VIEW_SALARY_INFO: 'view_salary_info',
    EDIT_SALARY_INFO: 'edit_salary_info',

    // Sistem İzinleri
    VIEW_ANALYTICS: 'view_analytics',
    VIEW_BILLING: 'view_billing',
    MANAGE_USERS: 'manage_users',
    MANAGE_SETTINGS: 'manage_settings',

    // AI İzinleri
    USE_AI_SEARCH: 'use_ai_search',
    USE_AI_SOURCING: 'use_ai_sourcing'
};

/**
 * Rol Bazlı İzin Matrisi
 */
export const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: [
        // Admin her şeyi yapabilir
        ...Object.values(PERMISSIONS)
    ],

    [ROLES.HIRING_MANAGER]: [
        // Aday izinleri (departman bazlı)
        PERMISSIONS.VIEW_DEPARTMENT_CANDIDATES,
        PERMISSIONS.ADD_CANDIDATE,
        PERMISSIONS.EDIT_CANDIDATE,
        PERMISSIONS.DELETE_CANDIDATE,

        // Personel izinleri (departman bazlı)
        PERMISSIONS.VIEW_DEPARTMENT_EMPLOYEES,
        PERMISSIONS.ADD_EMPLOYEE,
        PERMISSIONS.EDIT_EMPLOYEE,

        // Mülakat izinleri
        PERMISSIONS.VIEW_INTERVIEW_NOTES,
        PERMISSIONS.EDIT_INTERVIEW_NOTES,
        PERMISSIONS.ASSIGN_INTERVIEWER,

        // Teklif izinleri
        PERMISSIONS.VIEW_OFFER_DETAILS,
        PERMISSIONS.EDIT_OFFER_DETAILS,
        PERMISSIONS.APPROVE_OFFER,

        // Mali izinler
        PERMISSIONS.VIEW_SALARY_INFO,
        PERMISSIONS.EDIT_SALARY_INFO,

        // Sistem izinleri
        PERMISSIONS.VIEW_ANALYTICS,

        // AI izinleri
        PERMISSIONS.USE_AI_SEARCH,
        PERMISSIONS.USE_AI_SOURCING
    ],

    [ROLES.RECRUITER]: [
        // Aday izinleri
        PERMISSIONS.VIEW_ALL_CANDIDATES,
        PERMISSIONS.ADD_CANDIDATE,
        PERMISSIONS.EDIT_CANDIDATE,

        // Personel izinleri (sadece görüntüleme)
        PERMISSIONS.VIEW_ALL_EMPLOYEES,

        // Mülakat izinleri
        PERMISSIONS.VIEW_INTERVIEW_NOTES,
        PERMISSIONS.ASSIGN_INTERVIEWER,

        // Teklif izinleri (sadece görüntüleme)
        PERMISSIONS.VIEW_OFFER_DETAILS,

        // Sistem izinleri
        PERMISSIONS.VIEW_ANALYTICS,

        // AI izinleri
        PERMISSIONS.USE_AI_SEARCH,
        PERMISSIONS.USE_AI_SOURCING
    ],

    [ROLES.INTERVIEWER]: [
        // Aday izinleri (sadece atananlar)
        PERMISSIONS.VIEW_ASSIGNED_CANDIDATES,

        // Mülakat izinleri
        PERMISSIONS.VIEW_INTERVIEW_NOTES,
        PERMISSIONS.EDIT_INTERVIEW_NOTES

        // Mülakatçılar maaş, teklif ve diğer hassas bilgileri GÖREMEZ
    ]
};

/**
 * Belirli bir rolün bir izne sahip olup olmadığını kontrol eder
 * @param {string} role - Rol
 * @param {string} permission - İzin
 * @returns {boolean} İzin var mı?
 */
export function hasPermission(role, permission) {
    if (!role || !permission) return false;

    const rolePermissions = ROLE_PERMISSIONS[role] || [];
    return rolePermissions.includes(permission);
}

/**
 * Kullanıcının belirli bir izne sahip olup olmadığını kontrol eder
 * @param {Object} user - Kullanıcı objesi (role içermeli)
 * @param {string} permission - İzin
 * @returns {boolean} İzin var mı?
 */
export function userHasPermission(user, permission) {
    if (!user || !user.role) return false;
    return hasPermission(user.role, permission);
}

/**
 * Kullanıcının birden fazla izinden en az birine sahip olup olmadığını kontrol eder
 * @param {Object} user - Kullanıcı objesi
 * @param {Array<string>} permissions - İzin listesi
 * @returns {boolean} En az bir izin var mı?
 */
export function userHasAnyPermission(user, permissions) {
    if (!user || !user.role || !Array.isArray(permissions)) return false;
    return permissions.some(permission => hasPermission(user.role, permission));
}

/**
 * Kullanıcının tüm izinlere sahip olup olmadığını kontrol eder
 * @param {Object} user - Kullanıcı objesi
 * @param {Array<string>} permissions - İzin listesi
 * @returns {boolean} Tüm izinler var mı?
 */
export function userHasAllPermissions(user, permissions) {
    if (!user || !user.role || !Array.isArray(permissions)) return false;
    return permissions.every(permission => hasPermission(user.role, permission));
}

/**
 * Modal sekmeleri için görünürlük kontrolü
 * @param {string} role - Kullanıcı rolü
 * @param {string} tabName - Sekme adı
 * @returns {boolean} Sekme görünür mü?
 */
export function canViewModalTab(role, tabName) {
    const tabPermissions = {
        'detay': [PERMISSIONS.VIEW_ASSIGNED_CANDIDATES, PERMISSIONS.VIEW_DEPARTMENT_CANDIDATES, PERMISSIONS.VIEW_ALL_CANDIDATES],
        'degerlendirme': [PERMISSIONS.VIEW_ASSIGNED_CANDIDATES, PERMISSIONS.VIEW_DEPARTMENT_CANDIDATES, PERMISSIONS.VIEW_ALL_CANDIDATES],
        'mulakat': [PERMISSIONS.VIEW_INTERVIEW_NOTES],
        'teklif': [PERMISSIONS.VIEW_OFFER_DETAILS]
    };

    const requiredPermissions = tabPermissions[tabName] || [];
    return requiredPermissions.some(permission => hasPermission(role, permission));
}

/**
 * Navigasyon sekmesi görünürlük kontrolü
 * @param {string} role - Kullanıcı rolü
 * @param {string} tabId - Sekme ID
 * @returns {boolean} Sekme görünür mü?
 */
export function canViewNavigationTab(role, tabId) {
    const tabPermissions = {
        'dashboard': [], // Herkes görebilir
        'candidates': [PERMISSIONS.VIEW_ALL_CANDIDATES, PERMISSIONS.VIEW_DEPARTMENT_CANDIDATES, PERMISSIONS.VIEW_ASSIGNED_CANDIDATES],
        'employees': [PERMISSIONS.VIEW_ALL_EMPLOYEES, PERMISSIONS.VIEW_DEPARTMENT_EMPLOYEES],
        'search': [PERMISSIONS.USE_AI_SEARCH],
        'sourcing': [PERMISSIONS.USE_AI_SOURCING],
        'analytics': [PERMISSIONS.VIEW_ANALYTICS],
        'billing': [PERMISSIONS.VIEW_BILLING]
    };

    const requiredPermissions = tabPermissions[tabId] || [];

    // Eğer izin listesi boşsa (dashboard gibi), herkes görebilir
    if (requiredPermissions.length === 0) return true;

    // En az bir izin yeterli
    return requiredPermissions.some(permission => hasPermission(role, permission));
}

/**
 * Default rol ataması (yeni kullanıcılar için)
 */
export const DEFAULT_ROLE = ROLES.RECRUITER;

/**
 * Rol seçenekleri (kullanıcı oluştururken)
 */
export const ROLE_OPTIONS = [
    { value: ROLES.ADMIN, label: ROLE_DEFINITIONS[ROLES.ADMIN].displayName },
    { value: ROLES.HIRING_MANAGER, label: ROLE_DEFINITIONS[ROLES.HIRING_MANAGER].displayName },
    { value: ROLES.RECRUITER, label: ROLE_DEFINITIONS[ROLES.RECRUITER].displayName },
    { value: ROLES.INTERVIEWER, label: ROLE_DEFINITIONS[ROLES.INTERVIEWER].displayName }
];
