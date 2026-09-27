# AuraGen: Self-Healing Generative UI via Cognitive Load

> **AuraGen** dynamically redesigns application user interfaces in real-time by tracking user cognitive friction (mouse velocity, hesitation hover, rage clicks, error rates) and streaming metrics over WebSockets to an AI Code-Gen & Babel AST Safety pipeline.

---

## 🌟 Key Architecture & Modules

### 1. AI & Backend Engineering (Node.js & LangChain / Gemini)
- **Code-Gen Prompting (`server/codeGenAgent.js`)**: Prompts the Gemini LLM with Infotact's explicit UI Component Library schemas, Tailwind CSS tokens, and design guidelines to generate clean, pre-styled React code tailored to the exact friction point.
- **AST Safety & Compilation (`server/astSafetyEngine.js`)**: Uses `@babel/parser` and `@babel/traverse` to inspect the generated code AST for forbidden identifiers (`eval`, `window.location`, dynamic `import()`, untrusted `fetch`), validates security policies, and generates safe ES6 React component strings.

### 2. Frontend & Rendering (Next.js & React)
- **Telemetry Tracker Hook (`src/hooks/useTelemetry.ts`)**: Custom React hook measuring cursor speed ($px/s$), idle hesitation duration ($ms$), rage click bursts ($3+$ clicks in $40px$), and form input error rates. Streams telemetry data continuously over Socket.io WebSockets to calculate real-time Cognitive Load Scores ($0-100$).
- **Dynamic Injection Shell (`src/components/DynamicRenderer.tsx`)**: Receives the AST-validated code string from backend, compiles JSX in browser using `@babel/standalone`, injects scope primitives (`Card`, `Button`, `Input`, `Badge`, `Progress`, `LucideIcons`), and morphs the static form into an interactive step-by-step wizard without a page refresh!

---

## 🚀 Running the Project

### Prerequisites
- Node.js v18+
- npm v9+

### Environment Setup
Create a `.env` file in the root folder:
```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
PORT=3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### Start Backend & Frontend Concurrently
```bash
npm run dev
```

- **Frontend (Infotact Portal)**: [http://localhost:3000](http://localhost:3000)
- **Backend WebSocket Server**: `http://localhost:3001`

---
