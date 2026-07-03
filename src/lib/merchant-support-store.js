import { promises as fs } from "fs";
import path from "path";
import { getIndustryLabel, getPriorityLabel } from "@/lib/merchant-support-options";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "merchant-support-submissions.json");

const seedSubmissions = [
  {
    id: "MS-1001",
    businessName: "FreshCart Retail",
    email: "ops@freshcart.in",
    phone: "+91 98765 11001",
    industry: "ecommerce-d2c",
    priority: "faster-settlements",
    status: "New",
    source: "Home Page Form",
    submittedAt: "2026-06-14T10:30:00.000Z",
  },
  {
    id: "MS-1002",
    businessName: "LearnHub Academy",
    email: "billing@learnhub.com",
    phone: "+91 98112 22002",
    industry: "education-healthcare",
    priority: "easy-onboarding-approval",
    status: "Qualified",
    source: "Home Page Form",
    submittedAt: "2026-06-15T14:15:00.000Z",
  },
];

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(seedSubmissions, null, 2), "utf8");
  }
}

async function readSubmissions() {
  await ensureStore();
  const raw = await fs.readFile(dataFile, "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

async function writeSubmissions(submissions) {
  await ensureStore();
  await fs.writeFile(dataFile, JSON.stringify(submissions, null, 2), "utf8");
}

function createSubmissionId(existing) {
  const maxId = existing.reduce((max, item) => {
    const numeric = Number.parseInt(String(item.id).replace("MS-", ""), 10);
    return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
  }, 1000);

  return `MS-${maxId + 1}`;
}

export async function listMerchantSupportSubmissions() {
  const submissions = await readSubmissions();
  return submissions.sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
}

export async function getMerchantSupportSubmission(id) {
  const submissions = await readSubmissions();
  return submissions.find((item) => item.id === id) ?? null;
}

export async function addMerchantSupportSubmission(payload) {
  const submissions = await readSubmissions();
  const submission = {
    id: createSubmissionId(submissions),
    businessName: payload.businessName?.trim() ?? "",
    email: payload.email?.trim() ?? "",
    phone: payload.phone?.trim() ?? "",
    industry: payload.industry ?? "",
    priority: payload.priority ?? "",
    industryLabel: getIndustryLabel(payload.industry),
    priorityLabel: getPriorityLabel(payload.priority),
    status: "New",
    source: "Home Page Form",
    submittedAt: new Date().toISOString(),
  };

  submissions.unshift(submission);
  await writeSubmissions(submissions);
  return submission;
}
