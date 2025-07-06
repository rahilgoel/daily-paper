export function generateEmailHTML(topicsWithSummaries) {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { color: #007bff; }
            .topic { margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <h1>Your Personalized Daily Paper</h1>
          ${topicsWithSummaries.map(t => `
            <div class="topic">
              <h2>${t.topic}</h2>
              <p>${t.summary}</p>
            </div>
          `).join('')}
        </body>
      </html>
    `;
  }