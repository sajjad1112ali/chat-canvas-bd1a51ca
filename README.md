# Chat Nova

A modern AI chat application built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui (Radix UI)
- **Animation**: Framer Motion
- **AI Integration**: Google Gemini API via Cloudflare Worker

## Features

- Create, view, and delete chat conversations
- AI-powered responses
- Markdown rendering in messages
- Message export (download as .txt)
- Persistent storage via localStorage
- Responsive design
- Loading indicators and animations

## Getting Started

```bash
npm install
npm run dev
```

## Available Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run lint`  | Run ESLint               |
| `npm run test`  | Run tests                |

## Project Structure

```
src/
├── components/     # UI components (ChatSidebar, ChatArea, etc.)
├── hooks/         # Custom hooks (useLocalStorage, useToast)
├── pages/         # Route pages
├── types/         # TypeScript types
└── lib/           # Utilities
```

## Data Persistence

Chat data is stored in browser localStorage:

- `chats` - Array of all chat conversations
- `activeChatId` - Currently selected chat ID

Data persists across browser sessions and page refreshes.

## Deployment

Build the project and deploy the `dist` folder to any static hosting service:

```bash
npm run build
```
