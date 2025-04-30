# DailyHaiku — A Daily Poetry Experience

**DailyHaiku** is a minimalist web application that delivers one curated haiku each day. Designed for clarity and rhythm, the project blends modern frontend architecture with a clean API backend to showcase micro-content beautifully and automatically.

---

## Purpose

The goal was to create a frontend experience that feels poetic yet functional — one that invites reflection with zero friction. Behind the scenes, content is generated and assigned daily through an automated pipeline, decoupled from the UI.

---

## Architecture Overview

| Layer       | Technologies                                   |
| ----------- | ---------------------------------------------- |
| Frontend    | React (Vite), TailwindCSS, ShadCN UI           |
| Backend API | FastAPI (Python)                               |
| Database    | Supabase (PostgreSQL + Storage)                |
| Scheduling  | Cron-job.org + Buttondown API for daily emails |
| Deployment  | Vercel (frontend) + Railway (backend)          |

---

## Core Features

- One haiku delivered every 24h, fully automated
- Responsive, fluid interface for mobile and desktop
- Stateless UI with clean data fetching from API
- OG/Twitter metadata for SEO and sharing
- Image + text pairing with mood-matching artwork
- Minimal, silent email subscription (no spam, just poetry)

---

## What I Practiced

- Component design with ShadCN and TailwindCSS
- API-first UI thinking and clean integration patterns
- Decoupling frontend from backend state management
- Serverless deployment workflows (Vercel, Railway)
- Accessibility-first, distraction-free layouting

---

## What’s Next

- Building data pipelines and backend logic for generative and ML-based applications
- Exploring RAG systems and structured retrieval in production-like settings
- Strengthening SQL, distributed architectures, and cloud-native tooling

---

## Live Demo

https://dailyhaiku.vercel.app
