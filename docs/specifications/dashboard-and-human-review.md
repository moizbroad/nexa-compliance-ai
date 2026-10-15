# Dashboard and Human Review

**Status:** Draft for product-owner review; unresolved business rules are listed below.
**Authority:** [PRD v1.1](../prd.md), [constitution](../constitution.md), and [draft technical architecture](../technical-architecture.md).

## Purpose and scope

Present invoice findings and evidence and record human review outcomes. Implements FR-09, FR-10, FR-11, and the boundaries of FR-13; supports AC-09, AC-10, AC-11, AC-13, and AC-14.

## Inputs and display

Show invoice ID, vendor, amount/currency, evaluated score and risk level when available, issues, evidence, completeness, review status, and available actions. First-slice comparisons show the exact difference with scoring explicitly unevaluated.

Keep numerical risk, evidence completeness, and human decision status distinct. Display critical overrides and outstanding evidence prominently. Mask unnecessary bank identifiers.

## Review behavior

MEDIUM and HIGH cases route to human review. HIGH remains on hold until resolved. Unverified required evidence requests clarification and prevents automatic clearance. A LOW classification is a recommendation, never actual payment authorization.

Provide approve, reject, and request-clarification actions. Require a reason and record reviewer identifier and timestamp. Preserve the calculated findings when recording a decision. Define allowed transitions before implementing the workflow, particularly approval of unresolved-evidence cases and reopening decisions.

When a reviewer requests clarification, keep the case open and on hold while the requested information is outstanding. Once the information is provided, add it to the case evidence and allow the case to be reviewed again; preserve the earlier request and evaluation history.

NAXA never releases or transfers payments. Human case approval does not execute a payment or silently verify missing evidence.

## AI explanation boundary

Optional future AI summaries must be grounded in stored findings and cannot alter scores, classifications, evidence, policy, or decisions. The deterministic review workflow must function without an LLM.

## Acceptance criteria

- Findings link to relevant evidence and show expected/actual values where applicable.
- A HIGH override and an UNVERIFIED status are visible without hiding either condition.
- Each enabled review action records its reason, reviewer identifier, and timestamp.
- Missing reasons or invalid transitions are rejected without partially saving a decision.
- HIGH cases remain on hold before resolution; LOW recommendations never authorize payment.
- Review preserves original evaluation findings and displays decision history.
- Requesting clarification leaves the case open and on hold until the requested information is provided and reviewed.
- AI explanation output, if introduced later, cannot change deterministic results.
- No dashboard action executes an actual payment.

## Open decisions

- Screens, filtering, navigation, and evidence presentation.
- Exact states/transitions, reopening, and decision handling after new evidence or re-evaluation.
- Whether an explicit human override can approve unresolved evidence, and its required controls.
- Trusted-demo reviewer identification and API checks for stale/repeated decisions.
