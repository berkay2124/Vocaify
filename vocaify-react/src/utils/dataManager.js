import { STORAGE_KEYS } from '../config/constants';

/**
 * localStorage'dan aday ve personel verilerini yükler
 * @returns {Object} { candidates, employees }
 */
export function loadFromStorage() {
    try {
        const candidatesData = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
        const employeesData = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);

        return {
            candidates: candidatesData ? JSON.parse(candidatesData) : [],
            employees: employeesData ? JSON.parse(employeesData) : []
        };
    } catch (err) {
        console.error('Veri yükleme hatası:', err);
        alert('Veri yükleme sırasında hata oluştu. Veriler sıfırlandı.');
        localStorage.removeItem(STORAGE_KEYS.CANDIDATES);
        localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
        return {
            candidates: [],
            employees: []
        };
    }
}

/**
 * Aday ve personel verilerini localStorage'a kaydeder
 * @param {Array} candidates - Aday listesi
 * @param {Array} employees - Personel listesi
 */
export function saveToStorage(candidates, employees) {
    try {
        localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
        localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
    } catch (err) {
        console.error('Veri kaydetme hatası:', err);
        alert('Veri kaydetme sırasında hata oluştu: ' + err.message);
    }
}
