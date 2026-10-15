# Mandatory Approval Checks

**Status:** Draft for product-owner review; unresolved business rules are listed below.
**Authority:** [PRD v1.1](../prd.md), [constitution](../constitution.md), and [draft technical architecture](../technical-architecture.md).

## Purpose and scope

Determine whether each approval required for an invoice is present and valid. Implements FR-06; supports AC-06.

## Inputs

Invoice attributes, applicable approval policy/version, approval records, approver references, statuses, timestamps, and source availability.

## Behavior

Use the playbook to identify which approvals are required for each invoice. Distinguish approved, missing, pending, rejected, and unverifiable records without treating unknown status as approval.

A confirmed missing mandatory approval has the PRD default weight of 30 and forces HIGH regardless of the total score. Unavailable policy/evidence or an inconclusive critical approval check produces UNVERIFIED and prevents clearance.

Invoice business approvals are distinct from a reviewer's decision on the compliance case. Reviewing a case must not silently create or replace a required business approval.

## Evidence

Record the requirement, policy version, available approval references/statuses, missing requirement where confirmed, explanation, and evaluation timestamp.

## Acceptance criteria

- All required approvals verified as satisfied produce a complete check without a missing-approval finding.
- The playbook clearly lists the approvals required for the invoice being reviewed.
- A confirmed missing requirement contributes the configured weight and forces HIGH.
- Pending, missing, and unverifiable approvals are presented distinctly.
- Unknown policy or inaccessible approvals cannot imply approval or clearance.
- A compliance-review decision does not automatically satisfy a missing business approval.

## Open decisions

- Requirement thresholds, roles, number/order of approvals, and validity criteria.
- Whether pending/rejected approvals count as missing for scoring or follow another explicit policy.
- Revocation, invoice amendments, approval expiry, and hold treatment for each status.
