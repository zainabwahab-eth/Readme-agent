# 🧠 Readme Agent  
> An AI-powered agent that writes polished, professional READMEs for your GitHub projects in seconds.

## 🚀 Overview  
Readme Agent was built as part of **HNG Stage 3**, where the goal was to create a useful AI agent and integrate it with [Telex](https://telex.im) — a collaborative workspace for humans and AI.  

This agent solves one of the most common developer pains: **writing and improving README files**.  
Just drop a repository link, and the agent does the rest — analyzing the repo, fetching metadata, and generating a clean, complete, and engaging `README.md`.

---

## ✨ Features
- Automatic README generation  
- AI-powered writing (Gemini 2.5 Flash)  
- Repo-aware context  
- Memory support  
- Telex integration  
- Deployable via Mastra dashboard  

---

## 🧠 How It Works
1. Paste a public GitHub repository URL.  
2. The agent fetches repo metadata and key files.  
3. It generates or improves a `README.md` using AI.  
4. The output is well-formatted Markdown — ready to use instantly.

---

## 🏗️ Project Structure
```bash
readme-agent/
├── agents/
│   └── readme-agent.ts
├── tools/
│   └── readme-tool.ts
├── routes/
│   └── readme-route.ts
├── index.ts
├── package.json
└── README.md
```

---

## ⚙️ Tech Stack
- Mastra  
- TypeScript  
- Gemini 2.5 Flash  
- LibSQL (SQLite)  
- Axios + Zod  
- Telex A2A Protocol  

---

## 🔧 Setup & Installation
```bash
# 1. Clone the repository
git clone https://github.com/zainabwahab-eth/readme-agent.git

# 2. Navigate into the project
cd readme-agent

# 3. Install dependencies
npm install

# 4. Run locally (development mode)
npm run dev
```

> You can also deploy directly from the **Mastra dashboard** by linking your GitHub repository.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
