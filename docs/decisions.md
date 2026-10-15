# NAXA — Product and Technical Decision Log

- **Purpose:** One place to review the decisions made during Naxa planning.
- **Status:** Working log for product-owner walkthrough.
**Last updated:** 2026-10-12

This log records choices made in conversation. It separates them from assumptions and unresolved questions. If a decision conflicts with an older draft, this log is the current record to discuss; update the affected PRD/specification/architecture after the product owner confirms a change.

## Confirmed decisions

### D-001 — Users upload their existing documents *(reviewed)*

Users upload the invoice and supporting documents they already have through the dashboard. The workflow should not require them to copy all records into a Naxa workbook. Initial extensions and the preview/mapping flow are recorded in D-021; parser failure handling remains open.

### D-002 — Playbook checklist flags missing evidence *(reviewed)*

Naxa checks uploaded evidence against a playbook checklist and tells users what is present, missing, unreadable, or unverified. The first feature needs an invoice and its linked PO. The playbook lists which approvals are required for each invoice. Its complete requirements and management process remain to be specified.

For the first comparison, the playbook asks for an invoice and its PO. Contracts remain optional; users can say whether one applies. The playbook lists required approvals for each invoice. When required evidence is missing or unreadable, Naxa tells the user what to provide and marks the check UNVERIFIED until resolved.

### D-003 — Extracted fields require confirmation *(reviewed)*

Naxa may extract candidate values from documents, but the user confirms or corrects amounts and key fields before evaluation. Uncertain extraction must not be treated as verified financial data.

### D-004 — Development and deployment file storage *(reviewed)*

Use a private Docker volume during development and private cloud object storage after deployment. PostgreSQL stores metadata/references, not the original file contents. AWS S3 is a candidate, but the cloud provider, access rules, backups, encryption, and retention are still open.

### D-005 — PostgreSQL is the MVP database *(previously confirmed)*

Use PostgreSQL with SQLAlchemy and Alembic for persistence and database migrations.

### D-006 — Supported currencies *(reviewed; USD interpretation still to confirm)*

The MVP supports dollars, pounds, and Pakistani rupees. Naxa does not convert currencies; comparisons require matching currency codes. Dollar is currently interpreted as **US dollar (USD)**, with pounds as **GBP** and Pakistani rupees as **PKR**; see the assumption below.

### D-007 — Match an invoice to its PO using PO number and vendor *(reviewed)*

Use the PO number on the invoice to locate the purchase order, then check that the invoice vendor matches the PO vendor. Ask the user to resolve a missing, unmatched, or ambiguous PO reference; do not guess. A vendor mismatch requires human review.

### D-008 — One PO per invoice in the first version *(reviewed)*

An invoice can link to zero or one PO. A PO may be linked to multiple invoices. If an invoice references multiple POs, require manual review in the first version.

### D-009 — Compare document totals and show the exact difference *(reviewed)*

For the first PO comparison slice, display the invoice document total, PO document total, and `invoice total - PO total`, including whether the invoice is above, below, or equal to the PO. This is informational and does not score the first slice. If the PO is missing/unresolved, or either currency is missing, unsupported, or mismatched, mark the comparison UNVERIFIED and require human review. Do not compare unlike currencies or convert them.

### D-010 — Prior invoices are context, not a balance calculation *(reviewed)*

Compare against the full PO total. Show prior invoices linked to that PO when available, but do not subtract them or calculate a remaining PO balance in this slice.

### D-011 — Contract is optional *(reviewed)*

Naxa does not require a contract for every invoice. If the user confirms that no contract applies, mark the check NOT_APPLICABLE. If an invoice references a contract but the contract/evidence is missing, mark it UNVERIFIED.

### D-012 — Contract price comparison is per item *(reviewed)*

When a contract is supplied and applies, compare each invoice item's unit price with its matching contract item's unit price. Match by item code where available. If no clear code match exists, ask the user to select/confirm the item; do not guess from similar descriptions. Show exact differences, including small differences. Tolerance and scoring are deferred to the later scoring policy.

### D-013 — Duplicate candidates require human confirmation *(reviewed)*

A prior invoice with the same vendor and invoice number is a possible duplicate. Show its amount, currency, date, and PO for reviewer comparison. A human reviewer confirms or rejects the candidate; do not automatically call it a confirmed duplicate.

### D-014 — Recent bank-change window is 30 days *(reviewed)*

Treat a bank-account change within 30 days before evaluation as recent. An unverified recent change is HIGH, requires human review, and keeps the case on hold until resolved. Unavailable bank history is UNVERIFIED.

### D-015 — Approval requirements come from the playbook *(reviewed)*

The playbook states which approvals each invoice requires. Naxa checks available approval evidence against that list. A missing mandatory approval is a critical HIGH condition under the PRD.

### D-016 — Show known score with UNVERIFIED when evidence is incomplete *(reviewed)*

When scoring is implemented, show the score supported by known findings alongside UNVERIFIED if other required evidence is missing. The incomplete case cannot receive a clearance recommendation. Do not call an unscored first-slice result zero/LOW.

### D-017 — Clarification leaves the case open and on hold *(reviewed)*

When a reviewer requests clarification, keep the case open and on hold until the requested information is provided and reviewed. Preserve earlier evaluations and clarification requests.

### D-018 — Keep prior uploaded document versions *(reviewed)*

When a document is replaced, retain the previous version and its evaluation references in the audit history. Mark the replacement as current; do not overwrite the old source.

### D-019 — Record review actions and audit events as history *(reviewed)*

Store each approve, reject, or request-clarification action as a separate decision with reason, reviewer identifier, and time. Do not overwrite previous decisions. Record document uploads/replacements, field confirmations, PO linking, evaluations, and review actions in application-level audit history.

### D-020 — One case can retain multiple evaluations

The database draft uses a compliance case to track an invoice's review and separate evaluation records to preserve each re-check. New evidence can lead to a new evaluation without erasing prior results.

### D-021 — Accept Excel records and Word contracts *(reviewed)*

For the initial upload workflow, accept `.xlsx` workbooks for invoices, purchase orders, and other tabular supporting records, and `.docx` documents for contracts. Users upload their existing files; do not require a Naxa workbook template. Preview the sheets and extracted candidate details, let users map spreadsheet columns to Naxa fields, and require confirmation/correction before evaluation. Parser failure/retry behavior remains open.

### D-022 — Use standard Python parsers for Excel and Word *(reviewed)*

Use `openpyxl` to read `.xlsx` workbooks and `python-docx` to read text and tables from `.docx` contracts. Show parsed values as candidates for user review; extraction does not verify the underlying business facts. OCR and image-only/scanned document extraction are not included in this parser choice.

### D-023 — Limit each uploaded file to 10 MB *(reviewed)*

Limit each `.xlsx` or `.docx` upload to 10 MB. Reject larger files before parsing or storage and show a clear message stating the per-file limit.

### D-024 — Use a built-in checklist for the first slice *(reviewed)*

The first slice uses a built-in Naxa checklist; users do not need to upload or fill in a separate playbook workbook. It requires an invoice and its linked PO. A contract is optional; if the user says none applies, mark that check NOT_APPLICABLE. Naxa checks uploaded business documents against this list and flags missing or unverified evidence. Custom playbook setup and the full approval-requirement policy remain later work.

## Assumptions to verify during walkthrough

- **Dollar currency:** “Dollars” was recorded as USD. If another dollar currency is intended, change D-006 before implementation.
- **Document file location:** The approach is confirmed: use a private Docker volume in development and private cloud object storage after deployment. The cloud provider and deployment controls remain open.
- **Vendor identity:** Use a stable vendor code when available. If none is available, show a possible vendor-name match and ask the user to confirm rather than guessing. This is in the database draft and needs explicit product-owner confirmation.

## File-storage notes

The [architecture document](technical-architecture.md) has a diagram of the agreed development/deployment flow. The selected approach is private object storage after deployment. Its provider and deployment controls still need decisions.

| Choice | Main benefit | Main issue to consider |
| --- | --- | --- |
| Store files in PostgreSQL | One service stores everything together. | Large files make the database and its backups grow; handling file retention is less convenient. |
| Store files on the deployed server's disk | Simple to start. | Files may be lost if the server is replaced, and backups/scale across multiple servers need extra work. |
| Store files in private cloud object storage (such as S3) | Durable file storage separate from the app server; app can be replaced without losing files. | Requires cloud setup, access permissions, cost/retention choices, and backup/security configuration. |

A private bucket means only the backend's configured access can read objects; files are not public web URLs. Deployment still needs access control, backups, encryption, and retention decisions.

## Still open

- Unsafe-file handling and parser failure/retry behavior for `.xlsx` and `.docx`.
- Custom playbook ownership/versioning and full MVP approval-requirement management.
- Verification evidence for bank changes and handling of pending/rejected verification.
- Boundary/timezone semantics for a change exactly 30 days old.
- Amount rounding and contract unit-price precision.
- When a difference should trigger risk scoring; per-feature first-slice scoring is deferred.
- Duplicate normalization, corrected invoices, credits, cancelled invoices, and possible-match scoring.
- Approval status rules for pending, rejected, and unverifiable approvals.
- Dashboard review transitions, re-opening cases, and actions after re-evaluation.
- External-demo security and file retention requirements.

## Documents

- [PRD](prd.md)
- [Constitution](constitution.md)
- [Technical architecture](technical-architecture.md)
- [Database design](database-design.md)
- [API design](api-design.md)
- [MVP task plan](task-plan.md)
- [Feature specifications](specifications/README.md)
