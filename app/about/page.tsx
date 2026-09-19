/**
 * @file app/about/page.tsx
 * @description About Us & Contact page for Example Mirror Ltd and the Onesimos platform.
 *
 * @module app/about/page
 * @fonts Logo (wordmark) + Achiko (headings) + Switzer (body/UI)
 */

import Link from "next/link";

export const metadata = {
  title: "About Us & Contact | Onesimos",
  description: "Learn about Example Mirror Ltd and our mission to teach children ages 3 to 9 to read and comprehend well.",
};

export default function AboutPage(): JSX.Element {
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
          About Onesimos
        </h1>
        <p className="text-xs text-gray-500 mb-8 font-switzer">
          Engineered with love by Example Mirror Ltd
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-gray-700 font-switzer">
          {/* Section 1: Our Mission */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              Our Mission
            </h2>
            <p>
              At Onesimos, our mission is simple and uncompromising: to teach children aged 3 to 9 to read fluently AND comprehend deeply. Academic success rests on a child&apos;s ability to understand what they read. We optimize every story, quiz, and phonics lesson to help children hit the 80 percent comprehension threshold while falling in love with books.
            </p>
          </section>

          {/* Section 2: Three Pillars of Innovation */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              The Three Pillars of Onesimos
            </h2>
            <div className="grid grid-cols-1 gap-4 mt-3">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                <h3 className="font-bold text-amber-950 text-base mb-1">
                  ✨ 1. Living Chapters
                </h3>
                <p className="text-xs text-gray-600">
                  Every child learns differently. Onesimos generates personalized story chapters woven directly from the exact words your child stumbled on during previous sessions, turning reading hurdles into victorious moments.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/80">
                <h3 className="font-bold text-sky-950 text-base mb-1">
                  🎙️ 2. Real-Time Speech Recognition
                </h3>
                <p className="text-xs text-gray-600">
                  Powered by verbatim speech-to-text intelligence, Onesimos listens quietly as your child reads out loud, giving immediate, encouraging feedback without judgment or pressure.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                <h3 className="font-bold text-emerald-950 text-base mb-1">
                  🌱 3. 25 Core Virtues & Life Skills Curriculum
                </h3>
                <p className="text-xs text-gray-600">
                  Reading is more than decoding words. Every chapter weaves core character virtues like patience, honesty, resilience, and empathy into engaging narratives that build sound judgment.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Built for Families & Schools */}
          <section>
            <h2 className="font-achiko text-xl text-amber-900 mb-2">
              Built for Families, Schools & Diaspora
            </h2>
            <p>
              Whether used by a parent at bedtime or deployed across 30 tablets in a primary school classroom in Lagos, Abuja, London, or Atlanta, Onesimos brings culturally rich stories, diverse characters, and world-class literacy technology to every child.
            </p>
          </section>

          {/* Section 4: Contact Information */}
          <section className="bg-amber-100/50 p-6 rounded-3xl border border-amber-200">
            <h2 className="font-achiko text-xl text-amber-950 mb-3">
              Get in Touch
            </h2>
            <p className="text-xs text-amber-900 mb-4 font-switzer">
              We love hearing from parents, teachers, and school proprietors. Reach out to us anytime:
            </p>
            <div className="space-y-2 text-xs font-switzer">
              <p>
                <strong>General Support & Feedback:</strong> support@onesimos.app
              </p>
              <p>
                <strong>School Partnership Enquiries:</strong> schools@onesimos.app
              </p>
              <p>
                <strong>Parent & Media Inquiries:</strong> hello@onesimos.app
              </p>
              <p className="pt-2 text-gray-600">
                <strong>Company:</strong> Example Mirror Ltd <br />
                <strong>Headquarters:</strong> Lagos, Nigeria
              </p>
            </div>
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