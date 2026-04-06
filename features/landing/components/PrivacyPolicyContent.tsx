import {
  PRIVACY_POLICY_EMAIL,
  PRIVACY_POLICY_LAST_UPDATED,
  PRIVACY_POLICY_SECTIONS,
} from "../constants"

export function PrivacyPolicyContent() {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
      <p className="mb-4 text-xs text-muted-foreground">
        Last updated: {PRIVACY_POLICY_LAST_UPDATED}
      </p>

      {PRIVACY_POLICY_SECTIONS.map((section, i) => (
        <section key={section.title} className="mb-5">
          <h3 className="mb-1 text-sm font-semibold text-foreground">
            {i + 1}. {section.title}
          </h3>
          <p className="text-sm">{section.body}</p>
        </section>
      ))}

      <section>
        <h3 className="mb-1 text-sm font-semibold text-foreground">
          {PRIVACY_POLICY_SECTIONS.length + 1}. Contact
        </h3>
        <p className="text-sm">
          If you have questions about this policy, please contact us at{" "}
          <span className="text-accent-green dark:text-accent-green">
            {PRIVACY_POLICY_EMAIL}
          </span>
          .
        </p>
      </section>
    </div>
  )
}
