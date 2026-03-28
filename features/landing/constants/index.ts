import {
  BrainCircuit,
  ClipboardList,
  FileText,
  FlipHorizontal2,
  MessageSquare,
  Upload,
  Users,
} from "lucide-react"

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Contact", href: "/contact" },
]

export const FEATURES = [
  { icon: BrainCircuit, title: "AI Question Generation",    desc: "Generate MCQ and open-ended questions automatically from your study materials.", color: "accent-green"  },
  { icon: FlipHorizontal2, title: "Smart Flashcards",       desc: "AI-powered flashcards with flip animation and fullscreen study mode.",          color: "deep-teal" },
  { icon: Users,           title: "Collaborative Workspaces", desc: "Invite teammates, assign roles, and study together with shared resources.",   color: "accent-green" },
  { icon: MessageSquare,   title: "Context-aware AI Chat",  desc: "Chat with an AI tutor that understands your pinned study materials.",           color: "deep-teal"  },
  { icon: ClipboardList,   title: "Quiz Builder",           desc: "Assemble quizzes from your question bank, track attempts and review results.",  color: "accent-green" },
  { icon: FileText,        title: "Resource Management",    desc: "Upload PDFs, docs and images. Organize into groups for each workbench.",       color: "deep-teal"  },
] as const

export const STEPS = [
  { step: "01", icon: Upload,      title: "Upload your resources",  desc: "Add PDFs, docs, images, or text files. Organize them into groups.", color: "accent-green"  },
  { step: "02", icon: BrainCircuit, title: "Generate study content", desc: "Let AI create questions, flashcards and quizzes from your materials.", color: "deep-teal" },
  { step: "03", icon: Users,        title: "Study & collaborate",    desc: "Take quizzes, flip flashcards, chat with AI — solo or as a team.",   color: "accent-green" },
] as const

export const TESTIMONIALS = [
  { initials: "AK", name: "Amara Kofi",  role: "Medical Student",              quote: "Nextudy cut my exam prep time in half. The AI generates exactly the right questions from my lecture slides.", color: "accent-green" },
  { initials: "JL", name: "Jamie Lin",   role: "Software Engineering Student", quote: "Collaborative workspaces are brilliant. My study group shares resources and quizzes each other effortlessly.", color: "deep-teal"  },
  { initials: "RP", name: "Riya Patel",  role: "Law Student",                  quote: "The AI Chat feels like a tutor who has read all my case notes. Absolutely essential.",                         color: "accent-green" },
] as const

export const PRIVACY_POLICY_LAST_UPDATED = "March 2026"
export const PRIVACY_POLICY_EMAIL = "samed192005@gmail.com"

export const FOOTER_LINKS = [
  {
    heading: "Product",
    links: [
      { label: "Features",     href: "#features" },
      { label: "How it works", href: "#how-it-works" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
] as const
