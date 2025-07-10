import { authAdmin } from './admin.js';
// import { generateEmailHTML } from './emailTemplate.js';
import { generateNewsletterHTML } from './generateNewsletter.js';
import { db } from './firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

let emailHTML = '';

dotenv.config();

const uids = [
  'VdHF2qbxHIRFLZIQLTkMoCqX9Es1', // your original user UID from Firebase Auth
  'fC8Ohk4TTCdVk8v8aqBs4HWzYCt1' // second user UID from Firebase Auth
];

async function sendNewsletter() {
  for (const uid of uids) {
    try {
      // 1. Get user email from Firebase Auth
      const userRecord = await authAdmin.getUser(uid);
      const recipientEmail = userRecord.email;

      // 2. Get topics from Firestore
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      const topics = userSnap.exists() ? userSnap.data().topics || [] : [];

       emailHTML = await generateNewsletterHTML();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      });

      const info = await transporter.sendMail({
        from: `"First Light" <${process.env.GMAIL_USER}>`,
        to: recipientEmail,
        subject: 'First Light Daily Newsletter',
        html: emailHTML // optionally make dynamic per user
      });

      console.log(`✅ Sent to ${recipientEmail}: ${info.messageId}`);
    } catch (err) {
      console.error(`❌ Error sending to UID ${uid}:`, err.message);
    }
  }
}

sendNewsletter().catch(console.error);
