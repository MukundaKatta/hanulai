# HanulAI

> Sovereign AI evaluation platform with multilingual support, benchmarking scorecards, and compliance tracking for Korean and international AI models.

## Features

- **AI Scorecard** -- Comprehensive scoring and ranking of AI models across standardized benchmarks
- **Model Evaluation** -- Run evaluations with customizable metrics and comparative analysis
- **Semantic Search Demo** -- Demonstrate AI search capabilities across multiple languages
- **Quiz Mode** -- Interactive AI knowledge quizzes for testing and education
- **Localization Engine** -- Full i18n support with next-intl for 8+ languages including Korean
- **Bilingual Chat** -- Korean-English bilingual AI conversation interface
- **Compliance Dashboard** -- Track regulatory compliance across 15+ countries
- **Model Comparison** -- Side-by-side model comparison with detailed metric breakdowns

## Tech Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Framework | Next.js 14 (App Router)                 |
| Language  | TypeScript                              |
| i18n      | next-intl                               |
| UI        | Tailwind CSS, Lucide React, CVA         |
| Charts    | Recharts                                |
| State     | Zustand                                 |
| Validation| Zod                                     |
| Backend   | Supabase (Auth + Database)              |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
hanulai/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   ├── dashboard/        # Main dashboard
│   │   ├── scorecard/        # AI scorecard
│   │   ├── evaluation/       # Model evaluation
│   │   ├── search-demo/      # Search demo
│   │   ├── quiz/             # Quiz mode
│   │   ├── localization/     # Localization settings
│   │   ├── bilingual/        # Bilingual chat
│   │   ├── compliance/       # Compliance tracking
│   │   └── compare/          # Model comparison
│   └── components/           # Shared UI components
├── messages/                 # i18n translation files
└── package.json
```

