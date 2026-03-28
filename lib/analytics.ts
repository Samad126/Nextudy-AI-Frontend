declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function track(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.gtag) return
  window.gtag("event", event, params)
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export function trackSignUp(method: "email" | "google") {
  track("sign_up", { method })
}

export function trackLogin(method: "email" | "google") {
  track("login", { method })
}

// ─── Landing ─────────────────────────────────────────────────────────────────

export function trackContactSubmitted() {
  track("contact_submitted")
}

export function trackCtaClicked(location: "hero" | "cta_banner") {
  track("cta_clicked", { location })
}

// ─── Workspaces ──────────────────────────────────────────────────────────────

export function trackWorkspaceCreated() {
  track("workspace_created")
}

export function trackResourceUploaded(type: string) {
  track("resource_uploaded", { file_type: type })
}

// ─── Q&A ─────────────────────────────────────────────────────────────────────

export function trackQAGenerated(count: number) {
  track("qa_generated", { question_count: count })
}

export function trackQAExported(format: string) {
  track("qa_exported", { format })
}

// ─── Flashcards ───────────────────────────────────────────────────────────────

export function trackFlashcardStudied(cardCount: number) {
  track("flashcard_studied", { card_count: cardCount })
}

// ─── Quizzes ─────────────────────────────────────────────────────────────────

export function trackQuizStarted(questionCount: number) {
  track("quiz_started", { question_count: questionCount })
}

export function trackQuizCompleted(score: number, total: number) {
  track("quiz_completed", { score, total, percentage: Math.round((score / total) * 100) })
}
