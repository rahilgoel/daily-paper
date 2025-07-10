import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, 'newsletter.html');
const template = fs.readFileSync(templatePath, 'utf8');

function renderSection(templatePath, dataMap) {
  const sectionTemplate = fs.readFileSync(path.join(__dirname, 'sections', templatePath), 'utf8');
  let html = sectionTemplate;
  for (const [key, value] of Object.entries(dataMap)) {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
  }
  html = html.replace(/{{[^}]+}}/g, '');
  return html;
}

function getSectionData(jsonFile) {
  const jsonPath = path.join(__dirname, 'sections', jsonFile);
  return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}

function fillTemplate() {
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Read section data from JSON files
  const weatherData = getSectionData('weather_section.json');
  const financeData = getSectionData('finance_section.json');
  const worldData = getSectionData('world_section.json');
  const techData = getSectionData('tech_section.json');
  const healthData = getSectionData('health_section.json');
  const sportsData = getSectionData('sports_section.json');

  // Render each section
  const weatherSection = renderSection('weather_section.html', weatherData);
  const financeSection = renderSection('finance_section.html', financeData);
  const worldSection = renderSection('world_section.html', worldData);
  const techSection = renderSection('tech_section.html', techData);
  const healthSection = renderSection('health_section.html', healthData);
  const sportsSection = renderSection('sports_section.html', sportsData);

  let html = template
    .replace('<!--WEATHER_SECTION-->', weatherSection)
    .replace('<!--FINANCE_SECTION-->', financeSection)
    .replace('<!--WORLD_SECTION-->', worldSection)
    .replace('<!--TECH_SECTION-->', techSection)
    .replace('<!--HEALTH_SECTION-->', healthSection)
    .replace('<!--SPORTS_SECTION-->', sportsSection)
    .replace('{{date}}', dateStr)
    // You can add more static replacements here if needed
    ;

  html = html.replace(/{{[^}]+}}/g, '');
  return html;
}

export async function generateNewsletterHTML() {
  return fillTemplate();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateNewsletterHTML()
    .then(html => {
      const outputPath = path.join(__dirname, 'generated_newsletter.html');
      fs.writeFileSync(outputPath, html, 'utf8');
      console.log(`Generated newsletter at ${outputPath}`);
    })
    .catch(err => {
      console.error('Failed to generate newsletter:', err.message);
    });
}