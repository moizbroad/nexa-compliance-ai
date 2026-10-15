# NAXA — MVP Feature Specifications

**Status:** Draft set for product-owner review. These documents define intended behavior; no implementation or acceptance checks have been completed.

Read the [decision log](../decisions.md), [PRD](../prd.md), [constitution](../constitution.md), and [technical architecture](../technical-architecture.md) alongside these drafts. Open decisions are not approved defaults. Resolve a feature's blocking decisions before implementing its dependent behavior.

## Feature documents

1. [Invoice Intake and Supporting Records](invoice-intake.md)
2. [Invoice-to-PO Comparison](invoice-po-comparison.md)
3. [Contract-Price Comparison](contract-price-comparison.md)
4. [Duplicate Invoice Detection](duplicate-invoice-detection.md)
5. [Vendor Bank-Change Detection](vendor-bank-change-detection.md)
6. [Mandatory Approval Checks](mandatory-approval-checks.md)
7. [Risk Scoring, Overrides, and Incomplete Evidence](risk-scoring-and-incomplete-evidence.md)
8. [Dashboard and Human Review](dashboard-and-human-review.md)
9. [Audit History](audit-history.md)

## Review guide

Check each feature's scope, inputs, behavior, evidence, acceptance criteria, and open decisions. Record agreed answers in the affected documents rather than assuming defaults.

Important shared decisions include intake format, precision/rounding, PO partial invoicing, matching tolerances, duplicate confirmation criteria, bank-change window, approval requirements, scoring aggregation, and review transitions.

## First implementation slice

The agreed first slice displays the exact difference between invoice and PO document totals without scoring. The invoice PO number identifies the PO, and Naxa checks the vendor matches. Missing or ambiguous PO references and vendor mismatches require human review. One PO per invoice is supported initially; multiple-PO invoices need manual review. Supported currencies are USD, GBP, and PKR; comparison requires matching codes and no currency conversion. Prior invoices are context only; no remaining-balance calculation is made. PostgreSQL is agreed; `.xlsx` is the initial format for invoices/POs and tabular supporting records, and `.docx` is the initial format for contracts. Spreadsheet column mapping and value confirmation are required. Use `openpyxl` and `python-docx`; OCR is out of scope.

The intake direction is direct upload of the user's existing invoice and supporting documents, followed by a built-in checklist that flags missing or unverified evidence. Users should not need to transcribe their records or upload a separate playbook workbook. The first-slice checklist requires an invoice and linked PO; contract is optional. The initial formats are `.xlsx` for invoices, POs, and tabular supporting records, and `.docx` for contracts, up to 10 MB per file. Spreadsheet columns are mapped in a preview step and candidate values require confirmation. Custom playbook setup remains later work.

Contracts are optional for invoices in the MVP. When a contract is supplied/referenced, Naxa checks its prices; if the user confirms no contract applies, that check is NOT_APPLICABLE. Missing evidence for a referenced contract is UNVERIFIED.

For duplicate detection, a prior invoice with the same vendor and invoice number is a possible match. Naxa shows amount, currency, date, and PO; a human reviewer confirms or rejects it.

For bank-change detection, the agreed recency window is 30 days before evaluation. An unverified change in that window forces HIGH, requires human review, and keeps the case on hold until resolved; unavailable history is UNVERIFIED.

For mandatory approvals, the playbook lists which approvals are required for each invoice. Naxa checks the available approval records against that list.

For scoring with incomplete evidence, Naxa shows any score supported by known findings alongside UNVERIFIED; missing checks prevent clearance.

For human review, requesting clarification leaves the case open and on hold until the missing information is provided and reviewed.

For audit history, replacing an uploaded document keeps the previous version and its evaluation references; the replacement becomes current without erasing history.

This slice is a milestone toward the MVP, not a complete risk evaluation. Remaining checks and scoring remain required for full MVP acceptance.

The initial shared designs are in [database-design.md](../database-design.md) and [api-design.md](../api-design.md). The draft [MVP task plan](../task-plan.md) turns these documents into an implementation sequence. Implement and verify assigned tasks one at a time.
