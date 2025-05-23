// Import các module Firebase cần thiết
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyBYLWsbL4chXWQMYZzgpjml35cqUcUyrLA',
  authDomain: 'ecommerce-oanh-ngoc.firebaseapp.com',
  projectId: 'ecommerce-oanh-ngoc',
  storageBucket: 'ecommerce-oanh-ngoc.firebasestorage.app',
  messagingSenderId: '431618779613',
  appId: '1:431618779613:web:9032b84f5f8968b6b02e34',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo các đối tượng Firebase Auth và GoogleAuthProvider
export const auth = getAuth(app); // Firebase Auth
export const googleAuthProvider = new GoogleAuthProvider(); // Google Auth Provider
