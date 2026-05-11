export type StatItem = {
  label: string;
  value: string;
  trend: string;
};

export type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  status: "New" | "Qualified" | "Proposal" | "Won";
  source: string;
  score: number;
};

export type FeatureItem = {
  title: string;
  description: string;
};

export type PricingPlan = {
  name: string;
  price: string;
  description: string;
  features: string[];
};

export const dashboardStats: StatItem[] = [
  { label: "Total Leads", value: "1,248", trend: "+12.4%" },
  { label: "Qualified Leads", value: "326", trend: "+8.1%" },
  { label: "Conversion Rate", value: "26.1%", trend: "+2.8%" },
  { label: "Revenue", value: "$82,400", trend: "+14.2%" },
];

export const leads: Lead[] = [
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

export const websiteFeatures: FeatureItem[] = [
  {
    title: "Smart Lead Tracking",
    description: "Track every lead stage with clean visual pipelines and filters.",
  },
  {
    title: "Actionable Insights",
    description: "Monitor stats and trends to make faster growth decisions.",
  },
  
 
];

export const pricingPlans: PricingPlan[] = [
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
