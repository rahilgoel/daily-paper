// admin.js
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Load your service account key file
const serviceAccount = JSON.parse(
  readFileSync('./serviceAccountKey.json', 'utf8')
);

// Initialize admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const authAdmin = admin.auth();
