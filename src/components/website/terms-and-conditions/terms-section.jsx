import Link from "next/link";
import {
  HiEnvelope,
  HiLockClosed,
  HiShieldCheck,
  HiUserCircle,
} from "react-icons/hi2";



const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: [
      "CompareX (\"we\", \"us\", or \"our\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our platform, or interact with our services.",
      "By using CompareX, you agree to the collection and use of information in accordance with this policy. If you do not agree, please discontinue use of our services.",
    ],
  },
  {
    id: "information-we-collect",
    title: "2. Information We Collect",
    content: [
      "We may collect the following types of information:",
    ],
    list: [
      "Personal information: name, email address, phone number, business name, and job title when you register, submit forms, or contact us.",
      "Business information: website URL, industry, transaction volume, payment gateway preferences, and support queries you share with us.",
      "Usage data: pages visited, features used, time spent, browser type, device information, and IP address.",
      "Communication data: messages, reviews, feedback, and correspondence with our team or payment providers through CompareX.",
      "Cookies and similar technologies: data collected through cookies, pixels, and analytics tools to improve your experience.",
    ],
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Information",
    content: [
      "We use the information we collect to:",
    ],
    list: [
      "Provide payment gateway comparisons, recommendations, and expert assistance.",
      "Process support requests, onboarding queries, and merchant facilitation.",
      "Communicate with you about your account, inquiries, and service updates.",
      "Improve our platform, user experience, and product features.",
      "Comply with legal obligations and prevent fraud or misuse.",
      "Send marketing communications where you have opted in (you may unsubscribe anytime).",
    ],
  },
  {
    id: "sharing",
    title: "4. Sharing of Information",
    content: [
      "CompareX does not sell your personal information. We may share data only in these circumstances:",
    ],
    list: [
      "With payment gateway partners when you request introductions, comparisons, or onboarding support.",
      "With service providers who assist our operations (hosting, analytics, email) under strict confidentiality agreements.",
      "When required by law, regulation, court order, or government request.",
      "To protect the rights, property, or safety of CompareX, our users, or others.",
      "In connection with a merger, acquisition, or sale of assets, with notice to affected users.",
    ],
  },
  {
    id: "security",
    title: "5. Data Security",
    content: [
      "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These include encryption, access controls, and regular security reviews.",
      "However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.",
    ],
  },
  {
    id: "cookies",
    title: "6. Cookies & Tracking",
    content: [
      "We use cookies and similar technologies to remember your preferences, analyze traffic, and personalize content. You can control cookies through your browser settings. Disabling cookies may limit some features of our platform.",
    ],
  },
  {
    id: "your-rights",
    title: "7. Your Rights",
    content: [
      "Depending on applicable law, you may have the right to:",
    ],
    list: [
      "Access the personal data we hold about you.",
      "Request correction of inaccurate or incomplete information.",
      "Request deletion of your personal data, subject to legal retention requirements.",
      "Object to or restrict certain processing of your data.",
      "Withdraw consent where processing is based on consent.",
      "Lodge a complaint with a relevant data protection authority.",
    ],
  },
  {
    id: "retention",
    title: "8. Data Retention",
    content: [
      "We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. When data is no longer needed, we securely delete or anonymize it.",
    ],
  },
  {
    id: "third-party",
    title: "9. Third-Party Links",
    content: [
      "Our platform may contain links to third-party websites, including payment gateway providers. We are not responsible for the privacy practices of those sites. We encourage you to review their privacy policies before providing any personal information.",
    ],
  },
  {
    id: "changes",
    title: "10. Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated \"Last revised\" date. Continued use of CompareX after changes constitutes acceptance of the revised policy.",
    ],
  },
  {
    id: "contact",
    title: "11. Contact Us",
    content: [
      "If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us:",
    ],
  },
];

export default function TermsSection() {
  return (
    <section className="bg-white py-10 sm:py-10 lg:py-5">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        

        

        <div className="mx-auto mt-5">
          

          <div className="space-y-10">
            {sections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-28 border-b border-slate-300 pb-10 last:border-b-0"
              >
                <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">{section.title}</h2>
                <div className="mt-4 space-y-4">
                  {section.content.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-relaxed text-slate-600 sm:text-base">
                      {paragraph}
                    </p>
                  ))}
                  {section.list && (
                    <ul className="ml-4 list-disc space-y-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {section.id === "contact" && (
                  <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#2D4CC8]/15 bg-[#EEF2FC]/50 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-[#2D4CC8]">
                        <HiEnvelope className="size-5 text-white" aria-hidden />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Privacy enquiries</p>
                        <a
                          href="mailto:privacy@comparex.io"
                          className="text-sm text-[#2D4CC8] hover:underline"
                        >
                          privacy@comparex.io
                        </a>
                      </div>
                    </div>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center rounded-full border-2 border-[#2D4CC8] px-5 py-2.5 text-sm font-semibold text-[#2D4CC8] transition hover:bg-[#2D4CC8]/5"
                    >
                      Contact Us
                    </Link>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
