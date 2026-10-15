# NAXA — Product Requirements Document

- **Version:** 1.2
- **Status:** Updated MVP baseline — technical specification pending
- **Product:** AI-Assisted Invoice & Payment Risk Review System
- **Development approach:** Spec-Driven Development (SDD) with Codex
- **Environment:** Local/private MVP, without user authentication

---

## 1. Product Overview

Naxa helps businesses identify potentially risky invoices and payment requests before payment approval.

The application compares invoice details against supporting business records, including purchase orders, contracts, historical invoices, vendor bank-change records, and approval requirements.

It detects discrepancies, assigns risk levels, presents supporting evidence, and routes flagged cases for human review.

**Naxa does not automatically transfer money, release payments, or make final fraud determinations.**

## 2. Problem Statement

Finance and operations teams frequently review invoices manually before authorizing payments.

This creates several risks:

- Duplicate invoices may be paid.
- Invoice amounts may differ from purchase orders.
- Contract prices may not match submitted invoices.
- Vendor bank details may change without sufficient verification.
- Mandatory approvals may be missing.

Manual checks can be time-consuming, inconsistent, and difficult to audit.

Naxa aims to make these checks repeatable, explainable, and easier for a reviewer to resolve.

## 3. Target Users

**Primary:** Small-business finance and operations teams.

**Secondary:** Accounts payable staff, finance managers, and authorized payment reviewers.

MVP v1 supports a trusted single-user/private demonstration rather than multi-user production finance operations.

## 4. Product Goals

1. Identify the five defined invoice and payment risks.
2. Classify findings as LOW, MEDIUM, or HIGH.
3. Explain which rules triggered each finding.
4. Present evidence behind each risk.
5. Prevent critical cases from receiving an automatic clearance recommendation.
6. Support human review and decision recording.
7. Maintain a traceable history of findings and decisions.

## 5. MVP Workflow

1. User submits an invoice and its supporting records.
2. Naxa validates and extracts the necessary information.
3. Naxa checks data completeness and source availability.
4. Deterministic rules compare the invoice against supporting evidence.
5. The system records each triggered risk.
6. Naxa calculates a risk score and applies critical overrides.
7. The invoice receives a LOW, MEDIUM, or HIGH classification.
8. The user sees findings, explanations, and supporting records.
9. MEDIUM and HIGH cases are routed for review.
10. The human reviewer approves, rejects, or requests clarification.
11. Naxa records the final decision and audit history.

## 6. Core Functional Requirements

### FR-01 — Invoice Intake

The application must accept invoice information and supporting business records.

For MVP, required evidence can be entered or imported through a controlled local workflow.

Each invoice must have a unique internal record ID.

Supported fields should include:

- Vendor identifier
- Invoice number
- Invoice date
- Invoice amount and currency
- Linked purchase order
- Contract reference, where applicable
- Vendor payment details
- Approval status
- Relevant supporting records

For MVP v1, supported currencies are US dollars (USD), British pounds sterling (GBP), and Pakistani rupees (PKR). Naxa does not convert currencies. Amount comparisons require matching currency codes.

The initial upload formats are `.xlsx` for invoices, purchase orders, and tabular supporting records, and `.docx` for contracts, with a maximum size of 10 MB per file. Use `openpyxl` for Excel and `python-docx` for Word text/tables. Users upload their existing files without a required Naxa workbook template. For spreadsheets, the dashboard previews sheets and columns and lets users map columns to Naxa fields; extracted candidates must be confirmed or corrected before evaluation. OCR is out of scope. Parser failure handling remains to be established.

### FR-02 — Purchase Order Mismatch Detection

Naxa compares invoice information against the linked purchase order.

It must identify relevant differences in:

- Amount
- Currency
- Quantities
- Line items
- Purchase order reference

**Default risk weight: +25**

Missing or unverifiable purchase orders must be flagged separately from confirmed mismatches.

### FR-03 — Contract Price Mismatch Detection

Naxa compares billed rates or prices with the applicable contract.

**Default risk weight: +20**

The system must show the expected value, invoiced value, and calculated difference.

If a contract is not applicable, the check is marked NOT_APPLICABLE.

If a required contract cannot be accessed, the check is marked UNVERIFIED.

### FR-04 — Duplicate Invoice Detection

Naxa compares the incoming invoice against historical invoice records.

It should evaluate combinations of:

- Vendor identifier
- Invoice number
- Amount
- Date
- Purchase order or other supporting references

**Default risk weight: +40**

A confirmed duplicate triggers a HIGH-risk override.

Possible duplicates must be distinguished from confirmed duplicates and reviewed before being treated as confirmed.

### FR-05 — Vendor Bank Change Detection

Naxa checks whether vendor bank details changed within a configurable recent period.

**Default risk weight: +30**

An unverified recent bank-account change triggers a HIGH-risk override and a payment hold recommendation.

Naxa must show the available change timestamp and verification status.

The application must not expose full bank-account identifiers unnecessarily.

### FR-06 — Missing Mandatory Approval Detection

Naxa determines whether required approvals exist for the invoice.

**Default risk weight: +30**

A missing mandatory approval triggers a HIGH-risk override.

The system must distinguish between a missing approval, an approval still pending, and an approval that cannot be verified.

### FR-07 — Risk Scoring

Naxa calculates a rule-based score:

**Total Score = Sum of applicable triggered risk weights**

Initial weights:

| Risk | Weight |
|---|---:|
| PO mismatch | 25 |
| Contract-price mismatch | 20 |
| Confirmed duplicate | 40 |
| Recent unverified bank change | 30 |
| Missing mandatory approval | 30 |

Initial score bands:

- LOW: 0–19
- MEDIUM: 20–49
- HIGH: 50 or higher

These scores are configurable policy values, not statistically calibrated fraud probabilities.

### FR-08 — Critical Risk Overrides

Regardless of total score, the following conditions force HIGH:

- Confirmed duplicate invoice
- Recent unverified vendor bank-account change
- Missing mandatory approval

An inconclusive critical check must not be treated as a clean result.

Naxa must provide an INCOMPLETE/UNVERIFIED review status when required evidence is unavailable.

### FR-09 — Risk Findings

Each risk finding must include:

- Risk type
- Severity
- Triggered rule
- Expected value, where relevant
- Actual value, where relevant
- Supporting evidence
- Explanation
- Verification status
- Timestamp

The system must clearly distinguish observed discrepancies from suspected fraud.

### FR-10 — Risk Review Dashboard

The reviewer must be able to view:

- Invoice ID
- Vendor
- Invoice amount
- Total risk score
- Final risk level
- Detected issues
- Supporting evidence
- Current review status
- Available decision actions

### FR-11 — Human Review

Available reviewer actions:

- Approve
- Reject
- Request clarification

Every final decision requires a reason and must be recorded.

HIGH-risk cases must remain on hold in Naxa until a reviewer resolves them.

A LOW classification is a recommendation to approve, not an automatic payment authorization.

### FR-12 — Review and Audit History

Naxa must record:

- Invoice creation and changes
- Risk evaluation results
- Triggered rules
- Evidence references
- Risk status changes
- Human decisions
- Reviewer identifier within the trusted local demo
- Timestamps and decision reasons

The audit history should be append-only at the application level.

### FR-13 — AI-Assisted Explanation

An LLM may summarize risk findings in business-friendly language.

However:

- Deterministic code calculates the risk score.
- Deterministic policy rules apply severity overrides.
- The model cannot independently release payments.
- The model cannot silently modify risk weights.
- AI-generated explanations must be grounded in recorded findings.

### FR-14 — Error and Incomplete Evidence Handling

Naxa must handle:

- Invalid invoice data
- Missing purchase orders
- Missing contracts
- Inaccessible historical invoice records
- Unavailable vendor change history
- Unknown approval status
- Processing failures

Missing evidence must never be interpreted as proof that the invoice is safe.

## 7. Risk Classification and Actions

| Level | Criteria | Action |
|---|---|---|
| LOW | Score 0–19, no critical override, required checks complete | Recommend approval |
| MEDIUM | Score 20–49, no critical override | Manual review |
| HIGH | Score 50+ or critical override | Hold for human decision |
| UNVERIFIED | Required evidence is unavailable or a critical check is inconclusive | Request evidence and prevent automatic clearance |

UNVERIFIED is a review status, not a fourth numerical risk band.

## 8. Non-Functional Requirements

### Accuracy
Risk calculations must be reproducible and supported by source records.

### Security
The local/private MVP must not expose financial or bank information through public unauthenticated endpoints.

### Reliability
Invalid records and failed evaluations must not produce misleading LOW classifications.

### Explainability
Every score and override must be traceable to defined rules.

### Auditability
Decisions, reasons, and supporting evidence must remain reviewable.

### Maintainability
Rules, evaluation logic, and UI presentation should be separated into understandable modules.

## 9. MVP Acceptance Criteria

**AC-01:** A valid invoice can be submitted and reviewed.

**AC-02:** Naxa detects defined PO mismatches using known test data.

**AC-03:** Naxa detects contract-price discrepancies.

**AC-04:** Naxa distinguishes confirmed duplicates from possible duplicates.

**AC-05:** A recent unverified bank change triggers a HIGH-risk override.

**AC-06:** A missing mandatory approval triggers a HIGH-risk override.

**AC-07:** The total risk score matches the configured rule weights.

**AC-08:** Severity classification follows the score bands and overrides.

**AC-09:** The dashboard displays relevant findings with evidence.

**AC-10:** A reviewer can approve, reject, or request clarification.

**AC-11:** Review decisions are captured with reasons and timestamps.

**AC-12:** Missing critical evidence does not result in a LOW clearance recommendation.

**AC-13:** LLM explanations do not change deterministic risk classifications.

**AC-14:** No payment is automatically released or transferred.

## 10. Out of Scope

- Automatic bank payments
- Full ERP integrations
- Production-grade multi-user authorization
- Fraud probability prediction using machine learning
- Complex anomaly detection models
- Payment gateway integration
- Multi-tenant SaaS billing
- Automated financial dispute adjudication
- Production compliance certification

## 11. Open Decisions for Technical Specification

1. What parser failure/retry behavior will MVP v1 use for `.xlsx` and `.docx`?
2. How will supporting PO, contract, approval, and vendor data map from uploaded files versus manual entry?
3. What mismatch tolerances should apply to amounts and prices?
4. What time window qualifies as a recent bank-account change?
5. Which combinations of fields confirm a duplicate?
6. How should missing evidence affect payment-hold policy?
7. What persistent storage and audit-record model should be used?
8. What role should the LLM play beyond explanations?
9. Which data-security controls are needed before any external demonstration?

## 12. Definition of Done

Naxa MVP v1 is complete when a user can submit an invoice with supporting records, evaluate the five defined risks, see a reproducible score and severity, inspect supporting evidence, and complete a human review with a recorded decision.

All critical-risk overrides and incomplete-evidence cases must be covered by automated tests.

Naxa must not execute or release actual payments.

## 13. Engineering Learning Goals

The project should also serve as practical training in AI-native software engineering.

Across its phases, develop proficiency in:

- Spec-Driven Development
- Codex and AI coding agents
- Context engineering
- AI agent skills
- Test-driven implementation
- RAG
- Retrieval evaluation
- LLM tool calling
- Agent orchestration
- LangGraph
- MCP
- AI evaluations
- Observability
- Security
- Cloud deployment

Prioritize working software and measurable engineering outcomes over unnecessary framework adoption.

**Final rule:** Build the simplest verified MVP first. Add advanced AI capabilities only when they solve an established product need.
