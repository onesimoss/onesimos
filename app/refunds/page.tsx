/**
 * @file app/refunds/page.tsx
 * @description Refund & Cancellation Policy for Example Mirror Ltd and the Onesimos platform.
 * Formatted for Paystack merchant compliance requirements.
 *
 * @module app/refunds/page
 * @fonts Logo (wordmark) + Achiko (headings) + Switzer (body/UI)
 */

import Link from "next/link";

export const metadata = {
  title: "Refund & Cancellation Policy | Onesimos",
  description: "Subscription cancellation and refund guidelines for Onesimos by Example Mirror Ltd.",
};

export default function RefundPolicyPage(): JSX.Element {
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
          Refund & Cancellation Policy
        </h1>
        <p className="text-xs text-gray-500 mb-8 font-switzer">
          Last Updated: March 2025 · Effective Immediately
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-gray-700 font-switzer">
          {/* Section 1 */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              1. 7-Day Money-Back Guarantee
            </h2>
            <p>
              We want every family and school to love reading with Onesimos. If you subscribe to any of our paid plans (Single Reader, Family Plan, or Classroom Term) and feel the platform is not the right fit for your child, you are eligible for a 100 percent full refund within 7 days of your initial purchase date.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              2. Free Trial Tier
            </h2>
            <p>
              Every new user starts on our Free Tier (5 free stories per month per child, plus unlimited Phonics Sound Lab access). Because the Free Tier costs ₦0 and requires no card authorization, no refunds apply to free accounts.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              3. Subscription Cancellations
            </h2>
            <p className="mb-2">
              You can cancel your recurring subscription at any time directly through the Parent Portal or by emailing our support team.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>
                <strong>Monthly Plans:</strong> When you cancel a monthly subscription, auto-renewal stops immediately. You will retain full premium access for the remaining paid days of your current billing cycle.
              </li>
              <li>
                <strong>Annual & Term Plans:</strong> Annual or Classroom Term plans cancelled after the initial 7-day guarantee period will remain active through the end of the term, with no further recurring charges.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              4. How to Request a Refund
            </h2>
            <p>
              To request a refund under our 7-Day Money-Back Guarantee, please send an email to support@onesimos.app with the subject line &quot;Refund Request&quot;. Include:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600 mt-2">
              <li>Your registered parent email address</li>
              <li>Your Paystack transaction reference number</li>
              <li>A brief sentence telling us how we can improve</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              5. Processing Timelines
            </h2>
            <p>
              Once approved, refunds are initiated immediately via Paystack. Refunds typically reflect on your bank account, debit card, or credit card within 3 to 7 business days, depending on your bank&apos;s processing speeds.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              6. Contact Support
            </h2>
            <p>
              For billing inquiries, subscription adjustments, or school purchase orders, contact Example Mirror Ltd at:
            </p>
            <p className="mt-2 font-bold text-amber-950">
              Email: support@onesimos.app <br />
              Billing Department: Example Mirror Ltd, Lagos, Nigeria
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