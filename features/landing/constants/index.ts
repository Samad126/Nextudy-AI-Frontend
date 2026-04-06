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
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Contact", href: "/contact" },
]

export const FEATURES = [
  { icon: BrainCircuit, title: "AI Question Generation",    desc: "Generate MCQ and open-ended questions automatically from your study materials.", color: "accent-green"  },
  { icon: FlipHorizontal2, title: "Smart Flashcards",       desc: "AI-powered flashcards with flip animation and fullscreen study mode.",          color: "deep-teal" },
  { icon: Users,           title: "Collaborative Workspaces", desc: "Invite teammates, assign roles, and study together with shared resources.",   color: "accent-green" },
  { icon: MessageSquare,   title: "Context-aware AI Chat",  desc: "Chat with an AI tutor that understands your pinned study materials.",           color: "deep-teal"  },
  { icon: ClipboardList,   title: "Quiz Builder",           desc: "Assemble quizzes from your question bank, track attempts and review results.",  color: "accent-green" },
  { icon: FileText,        title: "Resource Management",    desc: "Upload PDFs, texts and images. Organize into groups for each workbench.",       color: "deep-teal"  },
] as const

export const STEPS = [
  { step: "01", icon: Upload,      title: "Upload your resources",  desc: "Add PDFs, texts images, or text files. Organize them into groups.", color: "accent-green"  },
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

export const PRIVACY_POLICY_SECTIONS = [
  {
    title: "Information We Collect",
    body: "We collect information you provide directly: name, email address, and password when you register. We also collect usage data such as study activity, quiz results, and flashcard interactions to improve your experience.",
  },
  {
    title: "How We Use Your Information",
    body: "We use your information to operate and improve Nextudy, personalise your study experience, send essential account notifications, and ensure platform security. We do not sell your data to third parties.",
  },
  {
    title: "Data Storage & Security",
    body: "Your data is stored on secure servers. We use industry-standard encryption in transit and at rest. Passwords are hashed and never stored in plain text.",
  },
  {
    title: "Cookies",
    body: "We use essential cookies to keep you signed in and remember your preferences. No third-party advertising cookies are used.",
  },
  {
    title: "Third-Party Services",
    body: "We use Google OAuth for sign-in. If you choose this option, Google may collect data according to their own privacy policy. We receive only your name and email from Google.",
  },
  {
    title: "Your Rights",
    body: "You may request access to, correction of, or deletion of your personal data at any time by contacting us. You can delete your account from your profile settings.",
  },
] as const

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
