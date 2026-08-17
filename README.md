# ⚖️ LegalEase AI

**Understand Your Rights. Discover Your Benefits. Take the Next Step.**

LegalEase AI is a web application that helps Indian citizens understand legal documents, find government schemes they qualify for, and get answers to legal questions – all in simple language and multiple Indian languages.

---

## 🎯 What Problem Does It Solve?

- Legal documents are full of complex jargon that普通人 can't understand.
- Government schemes are spread across multiple websites.
- Most people don't know which schemes they qualify for.
- Legal advice is expensive and hard to access for many.
- English-heavy websites are difficult for rural users.

LegalEase AI solves all these problems in one place.

---

## ✨ Key Features

| Feature | What It Does |
|---------|--------------|
| **AI Legal Chat** | Ask questions like "What are my rights if my employer doesn't pay me?" and get simple answers. |
| **Document Analyzer** | Upload a PDF/DOCX/TXT (like a rental agreement) and get a plain-language summary. |
| **Scheme Finder** | Enter your age, state, income, etc. – and discover schemes you may qualify for. |
| **Eligibility Checker** | See if you're eligible for a specific scheme with reasons explained. |
| **Voice Input** | Speak your question instead of typing. |
| **Multilingual** | Use the app in English, Hindi, or Telugu. |
| **Source Citations** | Every AI answer shows where the information came from. |

---

## 🛠️ How It Works (Simple Explanation)

1. **You ask a question** in the chat or upload a document.
2. **The AI (Google Gemini)** processes your request.
3. **If needed**, the system searches a knowledge base of legal information (RAG) to find relevant sources.
4. **The response** is generated in clear, simple language – and translated if you choose a different language.
5. **For schemes**, the system checks your profile against eligibility rules and tells you if you qualify.

---

## 🧰 Tech Stack (What Was Used)

### Frontend (What you see)
- React + Vite – for building the user interface
- Tailwind CSS – for styling
- Axios – for communicating with the backend

### Backend (What powers the app)
- Node.js + Express – for the server
- MongoDB – for storing users, documents, and schemes
- JWT – for user authentication (login/signup)

### AI & Intelligence
- Google Gemini API – for answering questions and summarizing documents
- Local Embeddings (Xenova) – for finding relevant information (RAG)
- Web Speech API – for voice input

### Deployment
- Vercel – for hosting the frontend
- Render – for hosting the backend
- MongoDB Atlas – for cloud database

---

## 🚀 How to Run It Locally

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/LegalEase-AI.git
cd LegalEase-AI
```
### 2. Setup Backend
```bash
cd server
npm install
```
### Create a .env file in the server/ folder:
```bash
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/legalease
JWT_SECRET=your_super_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```
### Start the backend:
```bash
npx nodemon server.js
```
### 3: Setup Frontend
- Open a new terminal:
```bash
cd client
npm install
```
### Create a .env file in the client/ folder:
```bash
VITE_API_URL=http://localhost:5000/api
```
Start the frontend:
```bash
npm run dev
```
- App runs on http://localhost:5173
### Visit http://localhost:5173 in your browser.
