/** Shared routes and nav labels for marketing site header & footer */

export const routes = {
  home: "/",
  about: "/about",
  howItWorks: "/how-it-works",
  whyComparex: "/why-comparex",
  comparePg: "/compare-pg",
  talkToExpert: "/talk-to-expert",
  tools: {
    root: "/tools",
    pgMdrCalculator: "/tools/pg-mdr-calculator",
    pgAssessment: "/tools/pg-assessment",
  },
  resources: {
    root: "/resources",
    blogs: "/resources/blogs",
    learningCenter: "/resources/learning-center",
    news: "/resources/news",
  },
  pgMarketplace: "/pg-marketplace",
  testimonials: {
    reviews: "/testimonials/reviews-and-ratings",
    successStories: "/testimonials/merchant-success-stories",
    caseStudies: "/testimonials/case-studies",
  },
  privacyPolicy: "/privacy-policy",
  termsAndConditions: "/terms-and-conditions",
  contact: "/contact",
  merchantSupportCenter: "/merchant-support-center",
  careers: "/careers",
};

/** Primary header navigation */
export const headerNavItems = [
  { href: routes.about, label: "About Us" },
  { href: routes.howItWorks, label: "How it Works" },
  { href: routes.whyComparex, label: "Why CompareX" },
  { href: routes.comparePg, label: "Compare PG" },
  { href: routes.talkToExpert, label: "Talk to Expert" },
  { href: routes.tools.root, label: "Tools" },
  { href: routes.resources.root, label: "Resources" },
  { href: routes.merchantSupportCenter, label: "Merchant Support" },
];

export const footerColumns = [
  {
    title: "Company",
    links: [
      { href: routes.about, label: "About Us" },
      { href: routes.whyComparex, label: "Why CompareX" },
      { href: routes.careers, label: "Careers" },
      { href: routes.contact, label: "Contact Us" },
      { href: routes.merchantSupportCenter, label: "Merchant Support Center" },
    ],
  },
  {
    title: "Compare",
    links: [
      { href: routes.howItWorks, label: "How it Works" },
      { href: routes.comparePg, label: "Compare PG" },
      { href: routes.talkToExpert, label: "Talk to Expert" },
      { href: routes.pgMarketplace, label: "PG Marketplace Directory" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: routes.tools.pgMdrCalculator, label: "PG Cost (MDR) Calculator" },
      { href: routes.tools.pgAssessment, label: "PG Assessment" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: routes.resources.blogs, label: "Blogs" },
      { href: routes.resources.learningCenter, label: "Learning Center" },
      { href: routes.resources.news, label: "News" },
    ],
  },
  {
    title: "Testimonials",
    links: [
      { href: routes.testimonials.reviews, label: "Reviews & Ratings" },
      { href: routes.testimonials.successStories, label: "Merchant Success Stories" },
      { href: routes.testimonials.caseStudies, label: "Case Studies" },
    ],
  },
];

export const footerLegalLinks = [
  { href: routes.privacyPolicy, label: "Privacy Policy" },
  { href: routes.termsAndConditions, label: "Terms & Conditions" },
  { href: routes.contact, label: "Contact Us" },
  { href: routes.careers, label: "Careers" },
];
