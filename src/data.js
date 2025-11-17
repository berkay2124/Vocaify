// === VERİ YÖNETİMİ (localStorage) ===

import { STORAGE_KEYS, EMPLOYEE_STAGES } from './config.js';

// Global state referansı (app.js tarafından ayarlanacak)
let stateRef = null;
let renderCallback = null;

/**
 * Veri modülünü global state ve render fonksiyonu ile başlatır
 * @param {Object} state - Global uygulama state objesi
 * @param {Function} render - Ana render fonksiyonu
 */
export function initDataModule(state, render) {
    stateRef = state;
    renderCallback = render;
}

/**
 * localStorage'dan aday ve personel verilerini yükler
 * Hata durumunda verileri sıfırlar ve kullanıcıyı bilgilendirir
 */
export function loadData() {
    try {
        const candidatesData = window.localStorage.getItem(STORAGE_KEYS.CANDIDATES);
        const employeesData = window.localStorage.getItem(STORAGE_KEYS.EMPLOYEES);

        stateRef.candidates = candidatesData ? JSON.parse(candidatesData) : [];
        stateRef.employees = employeesData ? JSON.parse(employeesData) : [];
    } catch (error) {
        console.error('Veri yüklenemedi, sıfırlanıyor.', error);
        stateRef.candidates = [];
        stateRef.employees = [];
    }
    if (renderCallback) renderCallback();
}

/**
 * Aday ve personel verilerini localStorage'a kaydeder
 * Hata durumunda console'a log yazdırır
 */
export function saveData() {
    try {
        window.localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(stateRef.candidates));
        window.localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(stateRef.employees));
    } catch (error) {
        console.error('Veri kaydetme hatası:', error);
    }
}

/**
 * Belirtilen ID'ye sahip adayı günceller, kaydeder ve UI'ı render eder
 * @param {string} id - Güncellenecek adayın ID'si
 * @param {Object} updatedFields - Güncellenecek alanlar (key-value çiftleri)
 */
export function updateCandidate(id, updatedFields) {
    stateRef.candidates = stateRef.candidates.map(c =>
        c.id === id ? { ...c, ...updatedFields, lastUpdated: new Date().toISOString() } : c
    );
    saveData();
    if (stateRef.selectedPerson && stateRef.selectedPerson.id === id) {
        stateRef.selectedPerson = { ...stateRef.selectedPerson, ...updatedFields };
    }
    if (renderCallback) renderCallback();
}

/**
 * Belirtilen ID'ye sahip personeli günceller, kaydeder ve UI'ı render eder
 * @param {string} id - Güncellenecek personelin ID'si
 * @param {Object} updatedFields - Güncellenecek alanlar (key-value çiftleri)
 */
export function updateEmployee(id, updatedFields) {
    stateRef.employees = stateRef.employees.map(e =>
        e.id === id ? { ...e, ...updatedFields, lastUpdated: new Date().toISOString() } : e
    );
    saveData();
    if (stateRef.selectedPerson && stateRef.selectedPerson.id === id) {
        stateRef.selectedPerson = { ...stateRef.selectedPerson, ...updatedFields };
    }
    if (renderCallback) renderCallback();
}
