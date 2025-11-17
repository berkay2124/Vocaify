import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// AŞAMA 38: Register PWA service worker
serviceWorkerRegistration.register({
    onSuccess: () => console.log('✅ Service worker registered successfully'),
    onUpdate: (registration) => {
        console.log('🆕 New version available! Please refresh.');
        // Optionally show update notification to user
        if (window.confirm('Yeni bir sürüm mevcut. Şimdi yüklensin mi?')) {
            if (registration && registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
            }
        }
    }
});

// Initialize install prompt
serviceWorkerRegistration.initInstallPrompt();
