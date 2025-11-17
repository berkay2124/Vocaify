import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase yapılandırması
 * NOT: Production'da bu değerleri environment variables'dan alın
 *
 * Firebase Console'dan alınacak değerler:
 * 1. Firebase Console'a gidin (https://console.firebase.google.com/)
 * 2. Proje oluşturun veya mevcut projeyi seçin
 * 3. Project Settings > General > Your apps bölümünden Web app ekleyin
 * 4. Aşağıdaki config değerlerini kopyalayın
 */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "vocaify-ats.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "vocaify-ats",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "vocaify-ats.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:abc123def456"
};

/**
 * Firebase uygulamasını başlat
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication servisini export et
 */
export const auth = getAuth(app);

/**
 * Firestore veritabanı servisini export et
 */
export const db = getFirestore(app);

export default app;
