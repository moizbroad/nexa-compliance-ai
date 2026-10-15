# Audit History

**Status:** Draft for product-owner review; unresolved business rules are listed below.
**Authority:** [PRD v1.1](../prd.md), [constitution](../constitution.md), and [draft technical architecture](../technical-architecture.md).

## Purpose and scope

Maintain a traceable history of business records, evaluations, evidence, and decisions. Implements FR-12; supports AC-11 and the PRD's auditability requirements.

## Recorded events

Record invoice creation and changes, evaluation outcomes, triggered rules, evidence references, risk/review status changes, and human decisions. Include event ID, affected record references, event type, actor or system identifier, timestamp, and relevant details. Decision records include reasons.

## Behavior

Audit history is append-only at the application level. Normal application operations must not edit or delete prior audit entries. Retain previous evaluations and decisions when new records, evidence, or policy versions lead to re-evaluation.

When a user replaces an uploaded document, retain the earlier document version and its references in the case history. Mark the new document as current; do not silently overwrite the source used by a prior evaluation.

Capture the source versions or snapshots and policy version needed to explain historical outcomes. Save related state changes and audit events consistently, using transactions for operations that must succeed together. Surface failures instead of reporting an unaudited successful decision.

## Privacy and limits

Audit evidence references and necessary changes without logging credentials or unnecessary full bank identifiers. Application-level append-only behavior is not a claim of database-administrator tamper resistance or compliance certification.

## Acceptance criteria

- Creation, changes, evaluations, and decisions produce traceable events with timestamps and actor identifiers.
- A decision's reason and related case/evaluation can be retrieved.
- Re-evaluation preserves the prior result and its evidence/policy references.
- Replacing an uploaded document keeps the previous version available in history and marks the replacement as current.
- Ordinary application routes cannot rewrite or delete audit history.
- Failure to persist a required audit event does not leave a partially committed successful decision.
- Audit output avoids secrets and unnecessary bank-account details.

## Open decisions

- Event payload schema, timestamp standard, record versioning versus snapshots, and evidence storage.
- Retention, backup/recovery, and treatment of corrections to sensitive data.
- Which transaction boundaries are required and how audit history is presented.
