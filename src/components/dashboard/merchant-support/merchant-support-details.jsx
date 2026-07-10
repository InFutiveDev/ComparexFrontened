"use client";

import { use } from "react";
import {
  HiArrowTopRightOnSquare,
  HiDocumentText,
  HiGlobeAlt,
  HiPaperClip,
  HiTag,
  HiUserCircle,
} from "react-icons/hi2";
import {
  DetailErrorState,
  DetailField,
  DetailHeader,
  DetailLoadingState,
  formatDetailDate,
  formatDetailLabel,
  getInitials,
  InfoCard,
  useDashboardDetail,
} from "@/components/dashboard/shared/record-details";
import { fetchMerchantSupportById } from "@/lib/dashboard-api";
import { pickMerchantSupport } from "@/lib/dashboard-detail-pickers";

function formatFileSize(bytes) {
  const size = Number(bytes);
  if (!Number.isFinite(size) || size <= 0) return null;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function normalizeAttachment(file, index) {
  if (typeof file === "string") {
    return {
      url: file,
      name: `Attachment ${index + 1}`,
      mimeType: "",
      sizeLabel: null,
    };
  }

  const url = file?.url || file?.path || file?.location || "";
  const name =
    file?.fileName ||
    file?.originalName ||
    file?.originalname ||
    file?.name ||
    (file?.key ? String(file.key).split("/").pop() : null) ||
    `Attachment ${index + 1}`;
  const mimeType = file?.mimeType || file?.mimetype || "";

  return {
    url,
    name,
    mimeType,
    sizeLabel: formatFileSize(file?.size),
  };
}

function isImageAttachment(file) {
  if (file.mimeType?.startsWith("image/")) return true;
  return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(file.name || "");
}

function SupportAttachments({ attachments }) {
  if (!attachments.length) {
    return <p className="mt-1 text-sm font-semibold text-[#13203F]">No attachments</p>;
  }

  return (
    <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {attachments.map((raw, index) => {
        const file = normalizeAttachment(raw, index);
        const image = Boolean(file.url) && isImageAttachment(file);

        return (
          <li
            key={`${file.name}-${index}`}
            className="overflow-hidden rounded-xl border border-slate-200 bg-[#f8fafc]"
          >
            {image ? (
              <a href={file.url} target="_blank" rel="noreferrer" className="block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.url}
                  alt={file.name}
                  className="h-40 w-full object-cover"
                />
              </a>
            ) : (
              <div className="flex h-28 items-center justify-center bg-white">
                <HiPaperClip className="size-8 text-[#2D4CC8]" aria-hidden />
              </div>
            )}

            <div className="space-y-2 p-3">
              <p className="truncate text-sm font-semibold text-[#13203F]" title={file.name}>
                {file.name}
              </p>
              <p className="text-xs text-slate-500">
                {[file.mimeType || (image ? "Image" : "File"), file.sizeLabel]
                  .filter(Boolean)
                  .join(" · ") || "Uploaded file"}
              </p>
              {file.url ? (
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D4CC8] hover:underline"
                >
                  Open file
                  <HiArrowTopRightOnSquare className="size-4" aria-hidden />
                </a>
              ) : (
                <p className="text-xs text-slate-400">File URL unavailable</p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function MerchantSupportDetails({ id }) {
  const { data, isLoading, error, reload } = useDashboardDetail(
    id,
    fetchMerchantSupportById,
    pickMerchantSupport,
  );

  if (isLoading) return <DetailLoadingState />;
  if (error || !data) {
    return (
      <DetailErrorState
        message={error || "Support request not found"}
        onRetry={reload}
        backHref="/dashboard/merchant-support"
        backLabel="Back to Merchant Support"
      />
    );
  }

  const attachments = Array.isArray(data.attachments) ? data.attachments : [];

  return (
    <div className="space-y-5">
      <DetailHeader
        backHref="/dashboard/merchant-support"
        backLabel="Back to Merchant Support"
        title={data.businessName}
        subtitle="Merchant Support Desk"
        initials={getInitials(data.businessName)}
        badges={[
          <span
            key="category"
            className="inline-flex rounded-full bg-[#EEF2FC] px-3 py-1 text-xs font-medium text-[#2D4CC8] ring-1 ring-[#2D4CC8]/10"
          >
            {formatDetailLabel(data.issueCategory)}
          </span>,
          <span
            key="gateway"
            className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-100"
          >
            {formatDetailLabel(data.paymentGateway)}
          </span>,
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Payment Gateway</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">
            {formatDetailLabel(data.paymentGateway)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Issue Category</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">
            {formatDetailLabel(data.issueCategory)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Attachments</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">{attachments.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Submitted</p>
          <p className="mt-1 text-lg font-bold text-[#13203F]">{formatDetailDate(data.createdAt)}</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <InfoCard title="Contact Information" icon={HiUserCircle}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Business Name">{data.businessName}</DetailField>
            <DetailField label="Phone Number">
              <a href={`tel:${data.contactNumber}`} className="text-[#2D4CC8] hover:underline">
                {data.contactNumber}
              </a>
            </DetailField>
            <DetailField label="Business Email">
              <a href={`mailto:${data.businessEmail}`} className="text-[#40C3CF] hover:underline">
                {data.businessEmail}
              </a>
            </DetailField>
            <DetailField label="Disclaimer Accepted">
              {formatDetailLabel(data.disclaimerAccepted)}
            </DetailField>
          </div>
        </InfoCard>

        <InfoCard title="Issue Details" icon={HiTag}>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Payment Gateway">
              {formatDetailLabel(data.paymentGateway)}
            </DetailField>
            <DetailField label="Issue Category">
              {formatDetailLabel(data.issueCategory)}
            </DetailField>
            <DetailField label="Source">{formatDetailLabel(data.source)}</DetailField>
            <DetailField label="Created At">{formatDetailDate(data.createdAt)}</DetailField>
          </div>
        </InfoCard>

        <InfoCard title="Issue Description" icon={HiDocumentText}>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {data.issueDescription || "—"}
          </p>
        </InfoCard>

        <InfoCard title="Website" icon={HiGlobeAlt}>
          <DetailField label="Website">
            {data.website ? (
              <a
                href={data.website}
                target="_blank"
                rel="noreferrer"
                className="text-[#2D4CC8] hover:underline"
              >
                {data.website}
              </a>
            ) : (
              "Not provided"
            )}
          </DetailField>
        </InfoCard>
      </div>

      <InfoCard title="Attachments" icon={HiPaperClip}>
        <SupportAttachments attachments={attachments} />
      </InfoCard>
    </div>
  );
}

export default function MerchantSupportDetailsPage({ params }) {
  const { id } = use(params);
  return <MerchantSupportDetails id={id} />;
}
