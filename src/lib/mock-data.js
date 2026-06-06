export const dashboardStats = [
  { label: "Total Leads", value: "1,248", trend: "+12.4%" },
  { label: "Qualified Leads", value: "326", trend: "+8.1%" },
  { label: "Conversion Rate", value: "26.1%", trend: "+2.8%" },
  { label: "Revenue", value: "$82,400", trend: "+14.2%" },
];

export const leads = [
  {
    id: "LD-101",
    name: "Aarav Sharma",
    company: "Nimbus Labs",
    email: "aarav@nimbuslabs.com",
    status: "Qualified",
    source: "Website",
    score: 88,
  },
  {
    id: "LD-102",
    name: "Meera Kapoor",
    company: "Blue Orbit",
    email: "meera@blueorbit.ai",
    status: "Proposal",
    source: "Referral",
    score: 92,
  },
  {
    id: "LD-103",
    name: "Rohan Verma",
    company: "CraftStack",
    email: "rohan@craftstack.io",
    status: "New",
    source: "Campaign",
    score: 67,
  },
  {
    id: "LD-104",
    name: "Siya Menon",
    company: "FlowPulse",
    email: "siya@flowpulse.com",
    status: "Won",
    source: "LinkedIn",
    score: 95,
  },
  {
    id: "LD-105",
    name: "Kabir Singh",
    company: "NovaSphere",
    email: "kabir@novasphere.co",
    status: "Qualified",
    source: "Website",
    score: 84,
  },
];

export const websiteFeatures = [
  {
    title: "Smart Lead Tracking",
    description: "Track every lead stage with clean visual pipelines and filters.",
  },
  {
    title: "Actionable Insights",
    description: "Monitor stats and trends to make faster growth decisions.",
  },
  
 
];

export const heroFormStepOneFields = [
  {
    id: "hero-industry",
    name: "industry",
    label: "Industry",
    placeholder: "Select industry",
    options: [
      { value: "ecommerce-d2c", label: "Ecommerce / D2C" },
      { value: "b2b-manufacturing", label: "B2B / Manufacturing Businesses" },
      { value: "saas-subscription-platforms", label: "SaaS / Subscription Platforms" },
      { value: "education-healthcare", label: "Education / Healthcare Services" },
      { value: "travel-bill-payments", label: "Travel / Bill Payments" },
      { value: "other-businesses", label: "Freelancers  / Other Businesses" },
    ],
  },
  
  
  


];

export const pricingPlans = [
  {
    name: "Starter",
    price: "$29/mo",
    description: "For growing teams launching their first CRM setup.",
    features: ["Up to 3 users", "Lead tracking", "Email support"],
  },
  {
    name: "Growth",
    price: "$79/mo",
    description: "For scaling teams that need automation and reporting.",
    features: ["Up to 10 users", "Advanced reports", "Priority support"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with custom workflows and controls.",
    features: ["Unlimited users", "SSO & roles", "Dedicated success manager"],
  },
];
