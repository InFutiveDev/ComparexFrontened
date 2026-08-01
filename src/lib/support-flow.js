/** Support desk flow — Ticket created → First Connect → PG response → Final Status */

function parseTime(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatFlowTimestamp(value) {
  const date = parseTime(value);
  if (!date) return null;
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatFinalStatusLabel(supportStatus) {
  const raw = String(supportStatus || "").toLowerCase();
  if (raw === "resolved") return "Resolved";
  if (raw === "escalated") return "Escalated (open)";
  if (raw === "in_progress") return "In progress";
  if (raw === "new") return "Open";
  return "Pending";
}

function rowNormalizedStatus(row) {
  const raw = row.supportStatus ?? row.status ?? "new";
  if (typeof raw === "string" && raw.includes(" ")) {
    const map = {
      Resolved: "resolved",
      Escalated: "escalated",
      New: "new",
      "In Progress": "in_progress",
    };
    return map[raw] ?? raw.toLowerCase().replace(/\s+/g, "_");
  }
  return String(raw).toLowerCase();
}

export function buildSupportFlowSteps(ticket = {}) {
  const normalized = rowNormalizedStatus(ticket);
  const createdAt = ticket.createdAt;
  const firstConnectAt = ticket.firstResponseAt ?? null;
  const escalatedAt = ticket.escalatedAt ?? null;
  const pgResponseAt = ticket.pgResponseAt ?? null;
  const finalAt =
    ticket.finalStatusAt ??
    (normalized === "resolved" ? ticket.statusUpdatedAt : null);
  const pgRequired = Boolean(escalatedAt || ticket.escalatedPgName);

  return [
    {
      key: "created",
      label: "Ticket created",
      atLabel: formatFlowTimestamp(createdAt) || "—",
      state: "complete",
    },
    {
      key: "firstConnect",
      label: "First Connect",
      atLabel: formatFlowTimestamp(firstConnectAt) || "Pending",
      state: firstConnectAt ? "complete" : "pending",
    },
    {
      key: "pgResponse",
      label: "PG response",
      atLabel: pgResponseAt
        ? formatFlowTimestamp(pgResponseAt)
        : pgRequired
          ? "Awaiting PG"
          : "Not required",
      state: pgResponseAt ? "complete" : pgRequired ? "pending" : "skipped",
      hint: pgRequired && ticket.escalatedPgName ? ticket.escalatedPgName : null,
    },
    {
      key: "finalStatus",
      label: "Final Status",
      atLabel: finalAt
        ? `${formatFinalStatusLabel(normalized)} · ${formatFlowTimestamp(finalAt)}`
        : formatFinalStatusLabel(normalized),
      state: normalized === "resolved" ? "complete" : "pending",
      statusLabel: formatFinalStatusLabel(normalized),
    },
  ];
}

export function formatDurationMs(ms) {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return null;
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return "<1m avg";
  if (minutes < 60) return `${minutes}m avg`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  if (hours < 24) return rem > 0 ? `${hours}h ${rem}m avg` : `${hours}h avg`;
  const days = Math.floor(hours / 24);
  return `${days}d avg`;
}

export function computeSupportFlowAggregate(rows = []) {
  const total = rows.length;
  let firstConnect = 0;
  let pgResponse = 0;
  let finalResolved = 0;
  const durations = { toFirst: [], toPg: [], toFinal: [] };

  for (const row of rows) {
    const created = parseTime(row.createdAt);
    const first = parseTime(row.firstResponseAt);
    const pg = parseTime(row.pgResponseAt);
    const finalAt = parseTime(
      row.finalStatusAt ??
        (rowNormalizedStatus(row) === "resolved" ? row.statusUpdatedAt : null),
    );

    if (first) firstConnect += 1;
    if (pg) pgResponse += 1;
    if (rowNormalizedStatus(row) === "resolved") finalResolved += 1;

    if (created && first) durations.toFirst.push(first.getTime() - created.getTime());
    if (first && pg) durations.toPg.push(pg.getTime() - first.getTime());
    if (pg && finalAt) durations.toFinal.push(finalAt.getTime() - pg.getTime());
    else if (first && finalAt && !pg) {
      durations.toFinal.push(finalAt.getTime() - first.getTime());
    }
  }

  function avgMs(values) {
    if (!values.length) return null;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }

  return {
    total,
    stages: [
      { key: "created", label: "Ticket created", count: total, avgFromPrevious: null },
      {
        key: "firstConnect",
        label: "First Connect",
        count: firstConnect,
        avgFromPrevious: formatDurationMs(avgMs(durations.toFirst)),
      },
      {
        key: "pgResponse",
        label: "PG response",
        count: pgResponse,
        avgFromPrevious: formatDurationMs(avgMs(durations.toPg)),
      },
      {
        key: "finalStatus",
        label: "Final Status",
        count: finalResolved,
        avgFromPrevious: formatDurationMs(avgMs(durations.toFinal)),
      },
    ],
  };
}
