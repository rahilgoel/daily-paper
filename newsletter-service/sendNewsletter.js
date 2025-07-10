import { authAdmin } from './admin.js';
import { generateEmailHTML } from './emailTemplate.js';
import { db } from './firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import OpenAI from 'openai';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPath = path.join(__dirname, 'sample_newsletter.html');
const emailHTML = fs.readFileSync(htmlPath, 'utf8');

// console.log(emailHTML);

dotenv.config();

const uids = [
  'VdHF2qbxHIRFLZIQLTkMoCqX9Es1', // your original user
  'NEW_USER_UID_HERE'            // second user UID from Firebase Auth
];


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

async function getTopicSummary(topic) {
const prompt = `Write a short news summary (max 3 sentences) about the latest developments in: ${topic}`;

const response = await openai.chat.completions.create({
    model: 'gpt-4.1',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200,
});

return response.choices[0].message.content.trim();
}

// async function getDailyGreeting() {
//   const prompt = `Write a two line greeting for the day including an unique fact about what happened the same day in world history`;
  
//   // const response = await openai.chat.completions.create({
//   //     model: 'gpt-4.1',
//   //     messages: [{ role: 'user', content: prompt }],
//   //     max_tokens: 200,
//   // });
  
//   return prompt
//   // response.choices[0].message.content.trim();
//   }

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

      // 3. Compose newsletter with optional summaries per topic
      // (Using static template for now; can be extended to dynamic summaries)
      // const emailHTML = generateEmailHTML(...)

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      });

      const info = await transporter.sendMail({
        from: `"Daily Paper" <${process.env.GMAIL_USER}>`,
        to: recipientEmail,
        subject: '🗞️ Your Personalized Daily Paper',
        html: emailHTML // optionally make dynamic per user
      });

      console.log(`✅ Sent to ${recipientEmail}: ${info.messageId}`);
    } catch (err) {
      console.error(`❌ Error sending to UID ${uid}:`, err.message);
    }
  }
}

sendNewsletter().catch(console.error);
