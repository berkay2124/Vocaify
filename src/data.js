// === VERİ YÖNETİMİ (localStorage) ===

import { STORAGE_KEYS, EMPLOYEE_STAGES } from './config.js';

// Global state referansı (app.js tarafından ayarlanacak)
let stateRef = null;
let renderCallback = null;

export function initDataModule(state, render) {
    stateRef = state;
    renderCallback = render;
}

// Veri Yükleme
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

// Veri Kaydetme
export function saveData() {
    try {
        window.localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(stateRef.candidates));
        window.localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(stateRef.employees));
    } catch (error) {
        console.error('Veri kaydetme hatası:', error);
    }
}

// Aday Güncelleme
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

// Personel Güncelleme
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
