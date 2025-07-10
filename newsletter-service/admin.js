// // admin.js
// import admin from 'firebase-admin';
// import { readFileSync } from 'fs';

// // Load your service account key file
// const serviceAccount = JSON.parse(
//   readFileSync('./serviceAccountKey.json', 'utf8')
// );

// // Initialize admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// export const authAdmin = admin.auth();

import admin from 'firebase-admin';

const base64Config = process.env.FIREBASE_CONFIG_BASE64;

if (!base64Config) {
  throw new Error('Missing FIREBASE_CONFIG_BASE64 env variable');
}

const serviceAccount = JSON.parse(
  Buffer.from(base64Config, 'base64').toString('utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const authAdmin = admin.auth();
export const db = admin.firestore(); // optional