# AI Stock Report Generator 📈🤖

A full-stack application that generates AI-powered stock analysis reports using real market data.

> ⚠️ This project is for educational purposes only and **not real financial advice**.

---

## 🚀 Features

* Add up to **3 stock tickers** (e.g. TSLA, MSFT)
* Fetch real stock market data
* Generate **AI-powered stock reports**
* Clear **Buy / Hold / Sell** recommendation
* Clean UI that focuses only on the final result

---

## 🛠️ Tech Stack

### Frontend

* HTML
* CSS
* Vanilla JavaScript

### Backend

* Node.js
* Express
* CORS

### AI & Data

* **Ollama (LLaMA 3)** for AI analysis
* **Polygon API** for stock market data

---

## 📁 Project Structure

```
ai-stock-report/
│
├── frontend/
│   ├── index.html
│   ├── index.js
│   ├── styles.css
│   └── utils/
│       └── dates.js
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── README.md
└── .gitignore
```

---

## ⚙️ Setup & Run Locally

### 1️⃣ Prerequisites

* Node.js installed
* Ollama installed and running
* Polygon API key

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
node server.js
```

Backend runs on:

```
http://localhost:3000
```

---

### 3️⃣ Frontend Setup

Open `frontend/index.html` in your browser.

---

## 🧠 How It Works

1. User enters stock tickers
2. Frontend fetches market data from Polygon
3. Data is sent to backend
4. Backend sends structured data to Ollama
5. AI generates a concise stock report
6. Result is displayed to the user

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend` folder:

```
POLYGON_API_KEY=your_api_key_here
```

> Never commit API keys to GitHub.

---


## 📌 Disclaimer

This application does **not** provide real financial advice. Use at your own risk.

---

## ✨ Author

**Ahmed Salah**

* GitHub: [https://github.com/bubecode](https://github.com/bubecode)

---

If you like this project, feel free to ⭐ the repository!
