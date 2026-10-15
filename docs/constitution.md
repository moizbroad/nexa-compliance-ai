# NAXA — Project Constitution

- **Version:** 1.0
- **Scope:** Project-wide engineering principles for the MVP and later phases.

## 1. Specification governs implementation

The [PRD](prd.md) defines product requirements. Feature specifications define behavior and acceptance criteria; the [technical architecture](technical-architecture.md) defines the implementation approach. This constitution defines engineering constraints across those documents.

Read the relevant documents before implementing an assigned task. Resolve conflicts and unanswered business rules with the product owner before implementing behavior that depends on them. Record decisions in the relevant specification. Do not introduce features beyond the agreed scope.

## 2. Financial calculations are deterministic

Financial amounts, differences, risk scores, and severity overrides must be computed by deterministic code using validated records and versioned policy settings. Identical inputs, policy version, and evaluation time must produce identical results.

Use Python `Decimal` and PostgreSQL `NUMERIC` for monetary calculations and storage. Specify precision, rounding, and currency assumptions in the technical specification. Avoid floating-point arithmetic for financial amounts.

Record the source record versions or snapshots, policy version, and evaluation timestamp needed to reproduce each evaluation. Time-dependent checks must use that recorded evaluation time.

AI-generated content must not alter calculated amounts, findings, scores, weights, or severity overrides. Scores represent rule-based policy outcomes, not fraud probabilities.

## 3. Every finding has evidence

Each finding must record its risk type, severity, triggered rule, explanation, supporting evidence references, verification status, and timestamp. Include expected values, actual values, and calculated differences where relevant.

Preserve the distinction between observed discrepancies, possible duplicates, confirmed duplicates, and suspected fraud. Extracted document data must be validated before it drives a financial evaluation; extraction alone does not establish that evidence is verified.

## 4. Incomplete evidence prevents clearance

Missing, inaccessible, invalid, or inconclusive required evidence must never be treated as a successful check. Record an INCOMPLETE/UNVERIFIED review status and require evidence or clarification. A missing PO requires human review.

UNVERIFIED is a review status separate from LOW, MEDIUM, and HIGH numerical risk bands. A zero score or a partially implemented evaluation must not imply that an invoice is safe. Recommend approval only when the required checks are complete and the policy permits it.

## 5. Critical overrides remain explicit

Apply the PRD's critical HIGH-risk overrides for a confirmed duplicate, a recent unverified vendor bank-account change, and a missing mandatory approval regardless of the numerical total.

Distinguish missing, pending, and unverifiable approvals. Keep policy values and business definitions in versioned specifications and configuration. Changes must be explicit, tested, and auditable; an AI model must not modify them silently.

## 6. Humans control review decisions

MEDIUM and HIGH cases require human review. HIGH cases remain on hold until a reviewer resolves them. Review actions are approve, reject, or request clarification; record the reason, reviewer identifier, and timestamp.

Preserve calculated findings and severity when recording a human decision so that the decision remains traceable to the original evaluation. A LOW result is an approval recommendation. NAXA must never transfer money or release actual payments.

## 7. Audit records preserve history

Maintain append-only audit history at the application level for invoice creation and changes, evaluations, findings, evidence references, status changes, and human decisions.

Re-evaluation must preserve prior evaluation history. Persist related evaluation results and audit records consistently using database transactions where required.

## 8. Database changes use migrations

Use PostgreSQL, SQLAlchemy, and Alembic as defined in the technical plan. Represent schema changes with version-controlled migrations and appropriate keys, constraints, and relationships.

Keep synthetic demo records identifiable and separate from real financial records. Document how to apply migrations and load demo data reproducibly.

## 9. Security matches the deployment scope

The MVP is a trusted, private, single-user demonstration without user authentication. Keep financial and bank data away from public unauthenticated endpoints. External demonstrations require the security controls defined for that deployment.

Mask bank-account identifiers where full values are unnecessary. Keep credentials and real sensitive records out of source control, demo datasets, and logs. Treat uploaded documents as untrusted input and define supported formats and validation before enabling uploads.

## 10. Tests demonstrate business behavior

Use test-driven implementation for important business logic: define acceptance cases, write or update meaningful automated tests, implement the behavior, and run relevant checks.

Cover monetary calculations, applicable scoring boundaries, critical overrides, missing evidence, and human-review behavior as each is implemented. Test database and API behavior when the task depends on them. Use representative functional checks for complete vertical slices.

Report executed checks and their outcomes accurately. An unimplemented or untested acceptance criterion remains incomplete. Full MVP completion requires automated coverage of all critical overrides and incomplete-evidence cases in the PRD.

## 11. Build small, reviewable increments

Before coding, identify the assigned task, acceptance criteria, and files expected to change. Implement the smallest correct solution and keep API handling, workflow coordination, deterministic rules, persistence, and presentation understandable and separate.

Report what changed, checks executed, remaining issues, and whether acceptance criteria are satisfied. Stop at the assigned task boundary for product-owner review; proceed to another task only when assigned or explicitly authorized as part of a batch.

An incremental slice may defer full MVP capabilities when the deferral is recorded explicitly. The first invoice-to-PO slice displays the exact amount difference without adding a mismatch score. That deferral does not remove the full MVP's scoring requirements or permit an overall clearance claim.

## 12. Adopt advanced AI for established needs

Build and verify the deterministic MVP before adding advanced AI capabilities. RAG, AI investigation, tool calling, LangGraph, MCP, and additional infrastructure require an established product need and an agreed specification.

AI explanations must be grounded in recorded findings. Learning objectives guide practical engineering work, including context engineering, coding agents, evaluation, observability, and deployment, without requiring unnecessary framework adoption.

**Final rule:** Build the simplest verified MVP first. Add advanced AI capabilities only when they solve an established product need.

## Amendments

Discuss changes with the product owner, update this document's version, and record the reason. Update affected specifications and tests when an amendment changes expected behavior. Feature-specific settings such as mismatch tolerances, duplicate criteria, and the bank-change window belong in specifications and policy configuration.

### Change history

- **1.0:** Initial constitution based on PRD v1.1, the draft technical architecture, and the agreed first-slice decisions.
