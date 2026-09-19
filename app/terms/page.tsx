/**
 * @file app/terms/page.tsx
 * @description Terms of Service for Example Mirror Ltd and the Onesimos platform.
 *
 * @module app/terms/page
 * @fonts Logo (wordmark) + Achiko (headings) + Switzer (body/UI)
 */

import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Onesimos",
  description: "Terms and conditions governing the use of Onesimos by Example Mirror Ltd.",
};

export default function TermsOfServicePage(): JSX.Element {
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
          Terms of Service
        </h1>
        <p className="text-xs text-gray-500 mb-8 font-switzer">
          Last Updated: March 2025 · Effective Immediately
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-gray-700 font-switzer">
          {/* Section 1 */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              1. Agreement to Terms
            </h2>
            <p>
              Onesimos is a product owned and operated by Example Mirror Ltd. These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (Parent, Guardian, or Educational Institution), and Example Mirror Ltd. By accessing or using the platform, you confirm that you have read, understood, and agreed to be bound by all of these terms.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              2. Description of Platform
            </h2>
            <p>
              Onesimos is an interactive reading companion designed for children aged 3 to 9. The platform utilizes advanced speech recognition, verbatim phonetic evaluation, and adaptive story synthesis to evaluate reading accuracy, track stumbling words, and generate personalized learning chapters.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              3. Subscriptions, Payments & Billing
            </h2>
            <p className="mb-2">
              Onesimos offers both individual family subscription plans and institutional classroom licenses processed securely through Paystack.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>All subscription fees are charged in Nigerian Naira (NGN) and auto-converted by diaspora banks.</li>
              <li>Free trial accounts include 5 free stories per month per child and access to the foundational Letter Sounds room.</li>
              <li>Paid subscriptions automatically renew monthly or annually depending on your selection unless cancelled prior to the renewal date.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              4. Parental Supervision & Child Accounts
            </h2>
            <p>
              Child profiles must be created and managed by a verified parent, legal guardian, or authorized educator. Parents are responsible for maintaining the secrecy of their Parent PIN and supervising child session limits.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              5. Intellectual Property
            </h2>
            <p>
              All original story catalog content, logos, custom typography, sound lab audio, and software code are the exclusive intellectual property of Example Mirror Ltd. Personalized stories generated dynamically for your child remain available for your private, non-commercial use.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              6. Limitation of Liability
            </h2>
            <p>
              In no event shall Example Mirror Ltd, its directors, employees, or partners be liable for any indirect, incidental, or consequential damages resulting from your access to or inability to access the platform.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              7. Governing Law
            </h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law principles.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              8. Contact Us
            </h2>
            <p>
              If you have any questions concerning these Terms, please contact Example Mirror Ltd at:
            </p>
            <p className="mt-2 font-bold text-amber-950">
              Email: crux@onesimos.app <br />
              Company: Example Mirror Ltd, Abuja, Nigeria
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