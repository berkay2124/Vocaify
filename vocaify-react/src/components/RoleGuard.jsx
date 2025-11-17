import React from 'react';
import { useAuth } from '../context/AuthContext';
import { userHasPermission, userHasAnyPermission } from '../data/roles';

/**
 * RoleGuard Component
 * Belirli izinlere sahip kullanıcıların içeriği görmesini sağlar
 *
 * Kullanım:
 * <RoleGuard permission="view_salary_info">
 *   <SalaryComponent />
 * </RoleGuard>
 *
 * <RoleGuard anyPermission={['add_candidate', 'edit_candidate']}>
 *   <CandidateForm />
 * </RoleGuard>
 */
function RoleGuard({ children, permission, anyPermission, fallback = null }) {
    const { currentUser } = useAuth();

    // Kullanıcı yoksa, fallback göster
    if (!currentUser) {
        return fallback;
    }

    // Tek izin kontrolü
    if (permission) {
        const hasAccess = userHasPermission(currentUser, permission);
        return hasAccess ? children : fallback;
    }

    // Birden fazla izinden birini kontrol et
    if (anyPermission && Array.isArray(anyPermission)) {
        const hasAccess = userHasAnyPermission(currentUser, anyPermission);
        return hasAccess ? children : fallback;
    }

    // İzin belirtilmemişse göster
    return children;
}

/**
 * İzin kontrolü için yardımcı hook
 * @param {string} permission - Kontrol edilecek izin
 * @returns {boolean} İzin var mı?
 */
export function usePermission(permission) {
    const { currentUser } = useAuth();
    if (!currentUser || !permission) return false;
    return userHasPermission(currentUser, permission);
}

/**
 * Çoklu izin kontrolü için yardımcı hook
 * @param {Array<string>} permissions - Kontrol edilecek izinler
 * @returns {boolean} En az bir izin var mı?
 */
export function useAnyPermission(permissions) {
    const { currentUser } = useAuth();
    if (!currentUser || !Array.isArray(permissions)) return false;
    return userHasAnyPermission(currentUser, permissions);
}

export default RoleGuard;
