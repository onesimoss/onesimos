/**
 * @file app/privacy/page.tsx
 * @description Privacy Policy for Example Mirror Ltd and the Onesimos platform.
 * Fully compliant with COPPA, GDPR-K, and NDPR regulations for children's data protection.
 *
 * @module app/privacy/page
 * @fonts Logo (wordmark) + Achiko (headings) + Switzer (body/UI)
 */

import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Onesimos",
  description: "Privacy policy and child data protection standards for Onesimos by Example Mirror Ltd.",
};

export default function PrivacyPolicyPage(): JSX.Element {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-gray-800 font-switzer py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-sm">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6 font-switzer">
          <Link
            href="/"
            className="text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-200 font-switzer transition-colors"
          >
            ← Back to Home
          </Link>
          <span className="font-logo text-3xl text-amber-900">
            Onesimos
          </span>
        </div>

        <h1 className="font-achiko text-3xl md:text-4xl text-amber-950 mb-3">
          Privacy Policy
        </h1>
        <p className="text-xs text-gray-500 mb-8 font-switzer">
          Last Updated: March 2025 · Effective Immediately
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-gray-700 font-switzer">
          {/* Section 1 */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              1. Our Commitment to Child Privacy
            </h2>
            <p>
              At Example Mirror Ltd, protecting children&apos;s privacy is fundamental to our mission. Onesimos is engineered specifically to provide a safe, nurturing reading environment. We do not show advertisements, we do not perform behavioral tracking on children, and we never sell personal data to third parties.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              2. Information We Collect
            </h2>
            <p className="mb-2">
              We collect minimal information necessary to deliver and personalize the reading experience:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>
                <strong>Parent & Guardian Information:</strong> Account email address, encrypted authentication tokens, payment references, and Parent PIN locks.
              </li>
              <li>
                <strong>Child Profile Information:</strong> Reader first name or nickname, reading level, age band, selected avatar, and interest topics.
              </li>
              <li>
                <strong>Reading & Voice Data:</strong> Transient voice audio captured via microphone during active reading sessions to evaluate pronunciation, identify stumbled words, and compute accuracy scores.
              </li>
              <li>
                <strong>Learning History:</strong> Stumbled word logs, mastered words, quiz accuracy, words-per-minute metrics, and generated Living Chapters.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              3. Voice & Audio Data Processing
            </h2>
            <p>
              When a child reads out loud, live audio is transmitted securely over TLS 1.3 encryption to our speech recognition engine strictly to generate a text transcript. Audio clips are processed in real time and are not stored permanently. Transcripts are evaluated against story text to build the child&apos;s Word Pocket.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              4. Global Children&apos;s Privacy Compliance
            </h2>
            <div className="space-y-3">
              <p>
                <strong>COPPA (US Children&apos;s Online Privacy Protection Act):</strong> All accounts require verifiable parental consent through adult account registration and payment setup. Children cannot create public profiles or interact with strangers.
              </p>
              <p>
                <strong>GDPR-K (EU/UK Age Appropriate Design Code):</strong> High privacy settings are enabled by default. Parents retain full rights to data portability and immediate erasure.
              </p>
              <p>
                <strong>NDPR (Nigeria Data Protection Regulation):</strong> Data processing is conducted lawfully under the direct oversight of Example Mirror Ltd as a registered data controller.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              5. How We Use Information
            </h2>
            <p>
              We use child data exclusively to compute reading analytics for parent report cards, generate personalized story chapters woven from stumbled words, and trigger daily reading reminders if configured by the parent.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              6. Parental Control & Data Deletion
            </h2>
            <p>
              Parents have complete control over their family data at all times. You can inspect your child&apos;s reading logs, review mastered words, or permanently delete a child profile and all associated session history directly inside the Parent Portal via the Child Report screen.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              7. Security & Third-Party Service Providers
            </h2>
            <p className="mb-2">
              We employ enterprise-grade security protocols including Row Level Security (RLS) policies on our database and encrypted API communication. We partner only with trusted infrastructure providers bound by strict data processing agreements:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li><strong>Supabase:</strong> Encrypted cloud database and media CDN storage.</li>
              <li><strong>Paystack:</strong> PCI-DSS Level 1 payment gateway (we never see card numbers).</li>
              <li><strong>Deepgram & ElevenLabs:</strong> Speech recognition and synthesized voice delivery.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              8. Contact Our Data Protection Officer
            </h2>
            <p>
              To exercise your privacy rights or ask questions about our child safety practices, contact Example Mirror Ltd at:
            </p>
            <p className="mt-2 font-bold text-amber-950">
              Email: crux@onesimos.app <br />
              Data Protection Officer: Example Mirror Ltd, Abuja, Nigeria
            </p>
          </section>
        </div>

        {/* Footer Link Back */}
        <div className="mt-12 pt-6 border-t border-gray-100 text-center font-switzer">
          <Link
            href="/"
            className="text-xs font-bold text-amber-700 hover:text-amber-800 font-switzer"
          >
            Return to Homepage →
          </Link>
        </div>

      </div>
    </main>
  );
}