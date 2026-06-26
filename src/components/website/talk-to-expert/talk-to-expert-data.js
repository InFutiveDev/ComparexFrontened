export const prominentPgs = [
  {
    id: "razorpay",
    name: "Razorpay",
    logo: "/images/brand-logos/Razorpay_logo.svg",
    rep: {
      name: "Ananya Sharma",
      title: "Enterprise Sales Lead",
      experience: "6+ years in payment partnerships",
      bio: "Helps D2C and SaaS businesses choose the right Razorpay stack, onboarding plan, and pricing structure.",
    },
  },
  {
    id: "cashfree",
    name: "Cashfree",
    logo: "/images/brand-logos/cashfree.png",
    rep: {
      name: "Rohit Mehta",
      title: "Merchant Success Manager",
      experience: "5+ years in PG sales",
      bio: "Specialises in settlement speed, payout workflows, and mid-market merchant activation.",
    },
  },
  {
    id: "payu",
    name: "PayU",
    logo: "/images/brand-logos/Payu.png",
    rep: {
      name: "Priya Nair",
      title: "Key Accounts Specialist",
      experience: "7+ years in fintech",
      bio: "Advises marketplaces and high-volume merchants on PayU integrations and commercial terms.",
    },
  },
  {
    id: "phonepe",
    name: "PhonePe PG",
    logo: "/images/brand-logos/phonepe.png",
    rep: {
      name: "Karan Joshi",
      title: "PG Solutions Consultant",
      experience: "4+ years in UPI & PG",
      bio: "Focuses on UPI-first checkout, offline-to-online flows, and QR-led payment setups.",
    },
  },
];

export const morePgs = [
  { id: "ccavenue", name: "CCAvenue", logo: "/images/brand-logos/ccavenue.png" },
  { id: "easebuzz", name: "Easebuzz", logo: "/images/brand-logos/easebuzz.png" },
  { id: "stripe", name: "Stripe", logo: "/images/brand-logos/stripe.png" },
  { id: "paytm", name: "Paytm PG", logo: "/images/brand-logos/paytm.png" },
  { id: "instamojo", name: "Instamojo", initials: "IM" },
  { id: "billdesk", name: "BillDesk", initials: "BD" },
];

export const prominentExperts = [
  {
    id: "expert-1",
    name: "Vikram Desai",
    title: "Payments Strategist",
    focus: "PG selection & onboarding",
    experience: "12+ years",
    bio: "Former fintech product head. Helps startups and SMEs compare PGs, negotiate commercials, and plan activation timelines.",
    tags: ["Startup", "D2C", "SaaS"],
  },
  {
    id: "expert-2",
    name: "Meera Iyer",
    title: "Independent PG Consultant",
    focus: "Enterprise payment stack",
    experience: "10+ years",
    bio: "Advises finance and product teams on multi-PG routing, reconciliation, and international payment readiness.",
    tags: ["Enterprise", "Marketplace"],
  },
  {
    id: "expert-3",
    name: "Arjun Patel",
    title: "Merchant Advisory Lead",
    focus: "Cost optimisation",
    experience: "8+ years",
    bio: "Works with high-volume merchants on MDR benchmarking, settlement cycles, and support SLAs.",
    tags: ["High volume", "Retail"],
  },
  {
    id: "expert-4",
    name: "Sneha Rao",
    title: "Subscription Payments Advisor",
    focus: "Recurring billing",
    experience: "9+ years",
    bio: "Guides subscription businesses on retry logic, dunning, and PG fit for recurring revenue models.",
    tags: ["SaaS", "Subscriptions"],
  },
];

export const moreExperts = [
  { id: "expert-5", name: "Nikhil Verma", title: "Cross-border Payments Advisor" },
  { id: "expert-6", name: "Divya Kulkarni", title: "POS & Offline Payments Expert" },
  { id: "expert-7", name: "Rahul Sinha", title: "Fraud & Risk Consultant" },
];

export const businessPriorityOptions = [
  { value: "lower-transaction-fees", label: "Lower Transaction Fees" },
  { value: "faster-settlements", label: "Faster Settlements" },
  { value: "easy-onboarding-approval", label: "Easy Onboarding & Approval" },
  { value: "better-success-rates", label: "Better Success Rates" },
  { value: "international-payment-support", label: "International Payment Support" },
  { value: "subscription-recurring-billing", label: "Subscription / Recurring Billing" },
];

export const industryOptions = [
  { value: "ecommerce-d2c", label: "Ecommerce / D2C" },
  { value: "b2b-manufacturing", label: "B2B / Manufacturing Businesses" },
  { value: "saas-subscription-platforms", label: "SaaS / Subscription Platforms" },
  { value: "education-healthcare", label: "Education / Healthcare Services" },
  { value: "travel-bill-payments", label: "Travel / Bill Payments" },
  { value: "other-businesses", label: "Freelancers / Other Businesses" },
];

export function buildTimeSlots() {
  const slots = [];
  const labels = ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  for (let dayIndex = 0; dayIndex < days.length; dayIndex += 1) {
    const date = new Date();
    date.setDate(date.getDate() + dayIndex + 1);
    const dateLabel = date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    labels.forEach((time) => {
      slots.push({
        id: `${dayIndex}-${time}`,
        day: days[dayIndex],
        dateLabel,
        time,
      });
    });
  }

  return slots;
}

export function getPgById(id) {
  const prominent = prominentPgs.find((item) => item.id === id);
  if (prominent) return prominent;

  const more = morePgs.find((item) => item.id === id);
  if (!more) return null;

  return {
    ...more,
    rep: {
      name: "CompareX Nominated Rep",
      title: "PG Representative",
      experience: "Verified partner",
      bio: `Connect with a nominated representative from ${more.name} for onboarding guidance and commercial discussions.`,
    },
  };
}

export function getExpertById(id) {
  const prominent = prominentExperts.find((item) => item.id === id);
  if (prominent) return prominent;

  const more = moreExperts.find((item) => item.id === id);
  if (!more) return null;

  return {
    ...more,
    focus: "Independent advisory",
    experience: "Verified expert",
    bio: `${more.name} is a CompareX-verified industry expert available for unbiased payment platform guidance.`,
    tags: ["Advisory"],
  };
}
