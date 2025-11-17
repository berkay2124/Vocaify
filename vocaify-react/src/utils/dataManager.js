import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Firestore'dan kullanıcının adaylarını yükler
 * @param {string} userId - Kullanıcı ID'si
 * @returns {Promise<Array>} Aday listesi
 */
export async function loadCandidates(userId) {
    try {
        const candidatesRef = collection(db, 'users', userId, 'candidates');
        const candidatesSnapshot = await getDocs(candidatesRef);

        const candidates = [];
        candidatesSnapshot.forEach((doc) => {
            candidates.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return candidates;
    } catch (err) {
        console.error('Adaylar yüklenirken hata:', err);
        throw err;
    }
}

/**
 * Firestore'dan kullanıcının personellerini yükler
 * @param {string} userId - Kullanıcı ID'si
 * @returns {Promise<Array>} Personel listesi
 */
export async function loadEmployees(userId) {
    try {
        const employeesRef = collection(db, 'users', userId, 'employees');
        const employeesSnapshot = await getDocs(employeesRef);

        const employees = [];
        employeesSnapshot.forEach((doc) => {
            employees.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return employees;
    } catch (err) {
        console.error('Personeller yüklenirken hata:', err);
        throw err;
    }
}

/**
 * Kullanıcının tüm verilerini Firestore'dan yükler
 * @param {string} userId - Kullanıcı ID'si
 * @returns {Promise<Object>} { candidates, employees }
 */
export async function loadFromFirestore(userId) {
    try {
        const [candidates, employees] = await Promise.all([
            loadCandidates(userId),
            loadEmployees(userId)
        ]);

        return { candidates, employees };
    } catch (err) {
        console.error('Veri yükleme hatası:', err);
        return { candidates: [], employees: [] };
    }
}

/**
 * Yeni bir aday Firestore'a ekler
 * @param {string} userId - Kullanıcı ID'si
 * @param {Object} candidate - Aday objesi
 * @returns {Promise<void>}
 */
export async function addCandidate(userId, candidate) {
    try {
        const candidateRef = doc(db, 'users', userId, 'candidates', candidate.id);
        await setDoc(candidateRef, candidate);
    } catch (err) {
        console.error('Aday eklenirken hata:', err);
        throw err;
    }
}

/**
 * Adayı Firestore'da günceller
 * @param {string} userId - Kullanıcı ID'si
 * @param {string} candidateId - Aday ID'si
 * @param {Object} updates - Güncellenecek alanlar
 * @returns {Promise<void>}
 */
export async function updateCandidateInFirestore(userId, candidateId, updates) {
    try {
        const candidateRef = doc(db, 'users', userId, 'candidates', candidateId);
        await updateDoc(candidateRef, updates);
    } catch (err) {
        console.error('Aday güncellenirken hata:', err);
        throw err;
    }
}

/**
 * Adayı Firestore'dan siler
 * @param {string} userId - Kullanıcı ID'si
 * @param {string} candidateId - Aday ID'si
 * @returns {Promise<void>}
 */
export async function deleteCandidate(userId, candidateId) {
    try {
        const candidateRef = doc(db, 'users', userId, 'candidates', candidateId);
        await deleteDoc(candidateRef);
    } catch (err) {
        console.error('Aday silinirken hata:', err);
        throw err;
    }
}

/**
 * Yeni bir personel Firestore'a ekler
 * @param {string} userId - Kullanıcı ID'si
 * @param {Object} employee - Personel objesi
 * @returns {Promise<void>}
 */
export async function addEmployee(userId, employee) {
    try {
        const employeeRef = doc(db, 'users', userId, 'employees', employee.id);
        await setDoc(employeeRef, employee);
    } catch (err) {
        console.error('Personel eklenirken hata:', err);
        throw err;
    }
}

/**
 * Personeli Firestore'da günceller
 * @param {string} userId - Kullanıcı ID'si
 * @param {string} employeeId - Personel ID'si
 * @param {Object} updates - Güncellenecek alanlar
 * @returns {Promise<void>}
 */
export async function updateEmployeeInFirestore(userId, employeeId, updates) {
    try {
        const employeeRef = doc(db, 'users', userId, 'employees', employeeId);
        await updateDoc(employeeRef, updates);
    } catch (err) {
        console.error('Personel güncellenirken hata:', err);
        throw err;
    }
}

/**
 * Personeli Firestore'dan siler
 * @param {string} userId - Kullanıcı ID'si
 * @param {string} employeeId - Personel ID'si
 * @returns {Promise<void>}
 */
export async function deleteEmployee(userId, employeeId) {
    try {
        const employeeRef = doc(db, 'users', userId, 'employees', employeeId);
        await deleteDoc(employeeRef);
    } catch (err) {
        console.error('Personel silinirken hata:', err);
        throw err;
    }
}

/**
 * Adayı personele dönüştürür (candidates'tan siler, employees'a ekler)
 * @param {string} userId - Kullanıcı ID'si
 * @param {string} candidateId - Aday ID'si
 * @param {Object} employeeData - Personel objesi
 * @returns {Promise<void>}
 */
export async function moveCandidateToEmployee(userId, candidateId, employeeData) {
    try {
        // Yeni personeli ekle
        await addEmployee(userId, employeeData);

        // Adayı sil
        await deleteCandidate(userId, candidateId);
    } catch (err) {
        console.error('Aday personele dönüştürülürken hata:', err);
        throw err;
    }
}

/**
 * Tüm adayları ve personelleri siler
 * @param {string} userId - Kullanıcı ID'si
 * @returns {Promise<void>}
 */
export async function clearAllDataInFirestore(userId) {
    try {
        // Tüm adayları sil
        const candidatesRef = collection(db, 'users', userId, 'candidates');
        const candidatesSnapshot = await getDocs(candidatesRef);
        const candidateDeletes = candidatesSnapshot.docs.map(doc => deleteDoc(doc.ref));

        // Tüm personelleri sil
        const employeesRef = collection(db, 'users', userId, 'employees');
        const employeesSnapshot = await getDocs(employeesRef);
        const employeeDeletes = employeesSnapshot.docs.map(doc => deleteDoc(doc.ref));

        await Promise.all([...candidateDeletes, ...employeeDeletes]);
    } catch (err) {
        console.error('Veriler silinirken hata:', err);
        throw err;
    }
}
