import { authAdmin } from './admin.js';
import { generateEmailHTML } from './emailTemplate.js';
import { db } from './firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const uid = 'fC8Ohk4TTCdVk8v8aqBs4HWzYCt1';

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

async function sendNewsletter() {
  // 🔍 Get the user's auth record
  const userRecord = await authAdmin.getUser(uid);
  const recipientEmail = userRecord.email;

  // 🔍 Get the topics from Firestore
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  const topics = userSnap.exists() ? userSnap.data().topics || [] : [];

  // ✅ Generate HTML content
  const emailHTML = generateEmailHTML(
    await Promise.all(
      topics.map(async (topic) => ({
        topic,
        summary: await getTopicSummary(topic),
      }))
    )
  );
  

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
    html: emailHTML
  });

  console.log(`✅ Sent to ${recipientEmail}: ${info.messageId}`);
}

sendNewsletter().catch(console.error);
