/**
 * Single source of truth for services & plans.
 * Source: "fluenta services" Google Sheet. Prices are in INR (whole rupees).
 * Edit here only — every page reads from this file. The server also reads
 * prices from here when creating Razorpay orders.
 *
 * Fields left empty (no `features`, no `note`) are simply not rendered.
 */
export type Service = {
  slug: string;
  name: string;
  price: number; // INR
  short: string;
  note?: string; // extra line from the sheet, shown if present
  featureGroups: { title?: string; items: string[] }[];
};

export const services: Service[] = [
  {
    slug: "ielts",
    name: "IELTS",
    price: 12000,
    short: "Complete IELTS preparation across Listening, Reading, Writing and Speaking.",
    featureGroups: [
      {
        items: [
          "Complete preparation — Listening, Reading, Writing, Speaking",
          "1-to-1 Speaking Evaluation",
          "Writing Task 1 & Task 2 Evaluation",
          "Full-Length Mock Tests",
          "Daily IELTS Practice",
          "Band Score Assessment",
          "Listening & Reading Practice Bank",
          "Vocabulary & Grammar Builder",
          "Speaking Mock Interview",
          "Personalized Band Improvement Plan",
          "Weekly Performance Challenge",
        ],
      },
    ],
  },
  {
    slug: "pte",
    name: "PTE",
    price: 14000,
    short: "PTE preparation for the computer-based English test.",
    note: "PTE is a computer-based test.",
    featureGroups: [
      {
        items: [
          "PTE Full Preparation",
          "Speaking & Pronunciation Training",
          "Writing Evaluation",
          "Listening Practice",
          "Reading Practice",
          "Timed PTE Mock Tests",
          "AI-Style Score Analysis",
          "Score Predictor",
          "Daily PTE Challenge",
          "Target Score Program",
          "Question-Type Masterclasses",
          "Weakness Analysis",
        ],
      },
    ],
  },
  {
    slug: "duolingo",
    name: "Duolingo English Test",
    price: 6000,
    short: "Focused preparation for the Duolingo English Test (DET).",
    featureGroups: [
      {
        items: [
          "DET Crash Course",
          "Target Score Preparation",
          "Full Mock Tests",
          "Speaking Practice & Feedback",
          "Writing Practice",
          "Adaptive Question Practice",
          "Timed Practice",
          "Score Analysis",
          "Vocabulary Booster",
          "7-Day / 14-Day Score Challenge",
          "Question-Type Masterclass",
        ],
      },
    ],
  },
  {
    slug: "celpip",
    name: "CELPIP",
    price: 8000,
    short: "CELPIP preparation with a focus on Canadian English and practical communication.",
    featureGroups: [
      {
        items: [
          "CELPIP Complete Preparation",
          "Speaking Evaluation",
          "Writing Evaluation",
          "Listening Practice",
          "Reading Practice",
          "Full CELPIP Mock Tests",
          "Target Score Program",
          "Score Assessment",
          "Email & Survey Writing Practice",
          "Real-Life Speaking Scenarios",
          "Canadian Vocabulary & Expressions",
          "Personalized Improvement Plan",
        ],
      },
    ],
  },
  {
    slug: "spoken-english",
    name: "Spoken English",
    price: 5000,
    short: "Build fluency and confidence in everyday and professional English.",
    featureGroups: [
      {
        title: "Core services",
        items: [
          "Beginner Spoken English",
          "Intermediate Spoken English",
          "Advanced Fluency Program",
          "Daily Conversation Practice",
          "English Speaking Club",
          "1-to-1 Speaking Sessions",
          "Pronunciation & Accent Training",
          "Vocabulary Builder",
          "Grammar for Speaking",
          "English for Workplace Communication",
        ],
      },
      {
        title: "Add-ons",
        items: [
          "Daily Speaking Challenge",
          "Think in English Program",
          "Real-Life Conversation Practice",
          "Phone & Video Call English",
          "Professional Communication",
          "Public Speaking & Presentation Skills",
        ],
      },
    ],
  },
  {
    slug: "french",
    name: "French",
    price: 16700,
    short: "French language course.",
    featureGroups: [],
  },
  {
    slug: "interview-preparation",
    name: "USA / UK Interview Preparation",
    price: 2500,
    short: "Interview preparation for USA / UK applications.",
    featureGroups: [],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const allFeatures = (s: Service) => s.featureGroups.flatMap((g) => g.items);
export const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");
