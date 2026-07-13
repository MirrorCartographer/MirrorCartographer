import crypto from "node:crypto";

const ALLOWED_STATES = new Set(["proposed", "active", "completed", "blocked", "blocked_external_configuration"]);

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

function digest(value) {
  return crypto.createHash("sha256").update(JSON.stringify(stable(value))).digest("hex");
}

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${label} must be an object`);
  }
}

export function reconcileContinuityQueueProjection({ canonicalQueue, additiveUpdates }) {
  assertObject(canonicalQueue, "canonicalQueue");
  if (!Array.isArray(canonicalQueue.items)) throw new TypeError("canonicalQueue.items must be an array");
  if (!Array.isArray(additiveUpdates)) throw new TypeError("additiveUpdates must be an array");

  const canonicalContinuity = canonicalQueue.items
    .filter((item) => item?.owner === "continuity_mining")
    .map((item) => stable(item));

  const proposals = [];
  const rejected = [];

  for (const update of additiveUpdates) {
    try {
      assertObject(update, "update");
      if (update.team !== "continuity_mining") throw new Error("foreign_team_update");
      if (update.canonical_queue_modified !== false) throw new Error("claims_canonical_mutation");
      if (typeof update.queue_item !== "string" || !/^M-[0-9]{3}$/.test(update.queue_item)) {
        throw new Error("invalid_queue_item");
      }
      if (!ALLOWED_STATES.has(update.status)) throw new Error("invalid_status");
      if (typeof update.action !== "string" || update.action.length === 0) throw new Error("missing_action");
      proposals.push(stable(update));
    } catch (error) {
      rejected.push({
        queue_item: typeof update?.queue_item === "string" ? update.queue_item : null,
        reason: error.message
      });
    }
  }

  const canonicalIds = new Set(canonicalContinuity.map((item) => item.id));
  const proposalIds = new Set();
  const conflicts = [];

  for (const proposal of proposals) {
    if (proposalIds.has(proposal.queue_item)) {
      conflicts.push({ type: "duplicate_proposal", queue_item: proposal.queue_item });
    }
    proposalIds.add(proposal.queue_item);

    if (canonicalIds.has(proposal.queue_item)) {
      conflicts.push({
        type: "canonical_proposal_overlap",
        queue_item: proposal.queue_item,
        resolution: "manual_review_required"
      });
    }
  }

  const projection = {
    schema_version: "1.0.0",
    canonical_queue_sha256: digest(canonicalQueue),
    canonical_continuity_items: canonicalContinuity,
    additive_proposals: proposals,
    rejected_updates: rejected,
    conflicts,
    canonical_queue_modified: false,
    interpretation: {
      observed: "Canonical continuity ownership and status come only from canonical_continuity_items.",
      inferred: "Additive proposals preserve work and intent but do not become canonical automatically.",
      proposed: "Review conflict-free additive proposals for explicit adoption into the canonical queue.",
      superseded: "The assumption that an additive queue-update artifact mutates canonical state is invalid.",
      unresolved: conflicts.length ? "Conflicts require manual review before canonical adoption." : "No canonical adoption decision is represented by this projection."
    }
  };

  return {
    ...projection,
    projection_sha256: digest(projection)
  };
}
