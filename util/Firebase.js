import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

const firebaseConfig = {
    credential: cert(serviceAccount),
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase

class Firebase {
    // Singleton

    static async getInstance() {
        if (!Firebase.instance) {
            Firebase.instance = new Firebase();
        }
        return Firebase.instance;
    }

    constructor() {
        initializeApp(firebaseConfig);
        this.bucket = getStorage().bucket();
    }

    getBucket() {
        return this.bucket;
    }

    async uploadFile(fileName, fileBuffer, metadata) {
        const uniqueFileName = `${Date.now()}-${fileName}`;
        const file = this.bucket.file(uniqueFileName);
        await file.save(fileBuffer, {
            metadata,
        });

        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-09-2491',
        });

        return url;
    }
}

export default Firebase;
