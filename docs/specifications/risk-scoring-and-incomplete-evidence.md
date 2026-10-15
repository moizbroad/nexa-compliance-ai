# Risk Scoring, Overrides, and Incomplete Evidence

**Status:** Draft for product-owner review; unresolved business rules are listed below.
**Authority:** [PRD v1.1](../prd.md), [constitution](../constitution.md), and [draft technical architecture](../technical-architecture.md).

## Purpose and scope

Produce reproducible scores and classifications while keeping completeness separate. Implements FR-07, FR-08, and FR-14; supports AC-07, AC-08, and AC-12. First-slice amount-display results are unscored and cannot claim full evaluation or clearance.

## Inputs

Recorded results from the required checks, triggered findings, configured weights/bands, policy version, evidence availability, and evaluation timestamp.

## PRD policy

| Trigger | Initial weight | Critical override |
| --- | ---: | --- |
| PO mismatch | 25 | None |
| Contract-price mismatch | 20 | None |
| Confirmed duplicate | 40 | HIGH |
| Recent unverified bank change | 30 | HIGH |
| Missing mandatory approval | 30 | HIGH |

Sum applicable triggered risk weights. Initial score bands are LOW 0–19, MEDIUM 20–49, and HIGH 50+. Critical overrides force HIGH even when the sum is below 50. Define how multiple findings from one risk category contribute before implementation; do not accidentally count the same trigger twice.

## Completeness and recommendations

Track INCOMPLETE/UNVERIFIED independently of numerical risk. A known HIGH finding remains visible even if another required check is unverified. Unknown checks must not be assigned invented clean results.

When some checks have known results and other required evidence is missing, show both the score calculated from known triggered rules and the INCOMPLETE/UNVERIFIED status. The score does not imply the evaluation is complete, and the case cannot receive a clearance recommendation until required evidence is resolved. If the known findings trigger HIGH, keep HIGH visible alongside UNVERIFIED.

Recommend approval only for LOW with all required checks complete and no override. MEDIUM requires manual review; HIGH requires a hold for human decision. Missing critical evidence requires clarification and blocks clearance.

## Evidence and persistence

Store check results, contributing weights, triggered overrides, score, risk band where evaluated, completeness status, policy version, timestamp, and source values/versions or snapshots. Policy changes must not overwrite historical results.

## Acceptance criteria

- Complete clean fixtures score 0 and classify LOW.
- PO mismatch alone scores 25/MEDIUM; contract mismatch alone scores 20/MEDIUM.
- PO plus contract mismatch scores 45/MEDIUM.
- Confirmed duplicate alone scores 40/HIGH due to its override.
- Recent unverified bank change or missing mandatory approval alone scores 30/HIGH.
- Boundary cases 19/20/49/50 follow the configured bands.
- Unverified required checks prevent clearance even when known findings sum to zero.
- A HIGH finding and incomplete evidence remain visible together.
- A known partial score and UNVERIFIED status are displayed together when evidence is missing; neither is hidden or treated as a complete evaluation.
- First-slice unscored results are not presented as zero-score LOW.
- Identical inputs, evaluation time, and policy reproduce the result.

## Open decisions

- Per-category versus per-finding aggregation and possible-duplicate scoring.
- Policy-editing mechanism and version lifecycle.
- Exact dashboard labels and presentation for incomplete evaluations.
