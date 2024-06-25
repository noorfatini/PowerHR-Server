// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyAYfTaYKBoBM8a3deBolqJ64dFGzBwKj9Q',
    authDomain: 'utmpowerhr01.firebaseapp.com',
    projectId: 'utmpowerhr01',
    storageBucket: 'utmpowerhr01.appspot.com',
    messagingSenderId: '990019068048',
    appId: '1:990019068048:web:adec91012ce81d61f8b815',
    measurementId: 'G-EZ4CMZSBGZ',
};

// Initialize Firebase

class Firebase {
    // Singleton
    static getInstance() {
        if (!Firebase.instance) {
            Firebase.instance = new Firebase();
        }
        return Firebase.instance;
    }

    constructor() {
        initializeApp(firebaseConfig);
        this.storage = getStorage();
    }
}

export default Firebase;
