import { PRIVACY_POLICY_LAST_UPDATED, PRIVACY_POLICY_EMAIL } from "../constants"

export function PrivacyPolicyContent() {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
      <p className="text-xs text-muted-foreground mb-4">Last updated: {PRIVACY_POLICY_LAST_UPDATED}</p>

      <section className="mb-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">1. Information We Collect</h3>
        <p className="text-sm">
          We collect information you provide directly: name, email address, and password when you register.
          We also collect usage data such as study activity, quiz results, and flashcard interactions to improve your experience.
        </p>
      </section>

      <section className="mb-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">2. How We Use Your Information</h3>
        <p className="text-sm">
          We use your information to operate and improve Nextudy, personalise your study experience,
          send essential account notifications, and ensure platform security. We do not sell your data to third parties.
        </p>
      </section>

      <section className="mb-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">3. Data Storage &amp; Security</h3>
        <p className="text-sm">
          Your data is stored on secure servers. We use industry-standard encryption in transit and at rest.
          Passwords are hashed and never stored in plain text.
        </p>
      </section>

      <section className="mb-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">4. Cookies</h3>
        <p className="text-sm">
          We use essential cookies to keep you signed in and remember your preferences.
          No third-party advertising cookies are used.
        </p>
      </section>

      <section className="mb-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">5. Third-Party Services</h3>
        <p className="text-sm">
          We use Google OAuth for sign-in. If you choose this option, Google may collect data
          according to their own privacy policy. We receive only your name and email from Google.
        </p>
      </section>

      <section className="mb-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">6. Your Rights</h3>
        <p className="text-sm">
          You may request access to, correction of, or deletion of your personal data at any time
          by contacting us. You can delete your account from your profile settings.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-foreground mb-1">7. Contact</h3>
        <p className="text-sm">
          If you have questions about this policy, please contact us at{" "}
          <span className="text-accent-green dark:text-accent-green">{PRIVACY_POLICY_EMAIL}</span>.
        </p>
      </section>
    </div>
  )
}
