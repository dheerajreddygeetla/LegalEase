// server/scripts/listModelsRest.js
const dotenv = require('dotenv');
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY not set in .env');
  process.exit(1);
}

async function listModels() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      const text = await response.text();
      console.error('Response:', text);
      return;
    }
    const data = await response.json();
    console.log('📋 Available models:');
    data.models.forEach(model => {
      // The name often includes "models/" prefix, we need the short name
      const shortName = model.name.replace('models/', '');
      console.log(`- ${shortName} (display: ${model.displayName})`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

listModels();