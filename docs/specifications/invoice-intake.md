# Invoice Intake and Supporting Records

**Status:** Draft for product-owner review; unresolved business rules are listed below.
**Authority:** [PRD v1.1](../prd.md), [constitution](../constitution.md), and [draft technical architecture](../technical-architecture.md).

## Purpose and scope

Let users upload the invoice and supporting documents they already have through the dashboard. Naxa checks the submission against a defined playbook checklist, shows which required evidence is present, missing, unreadable, or unverified, and identifies what the user needs to provide next. Users should not have to copy all their records into a Naxa workbook as the primary workflow.

Implements FR-01 and FR-14; supports AC-01. A playbook is the set of required evidence and fields for a given review. The first slice uses a built-in Naxa checklist that requires an invoice and linked PO, with contract optional. Custom playbook setup and management remain out of the first slice.

## Inputs and stored records

Accept an invoice document and any available supporting files directly. Capture a unique internal invoice ID, vendor reference, invoice number, invoice date, amount, currency, linked PO where available, contract reference where applicable, payment details, approval information, and supporting-record references. Extracted values must retain a reference to their source document and require validation when extraction is uncertain.

Check uploaded evidence and extracted fields against the built-in first-slice checklist. Users upload their business documents, not a separate playbook workbook. Distinguish evidence that is present, missing, unreadable, not applicable, or awaiting verification. Display missing items as an actionable checklist so the user knows what to upload or clarify.

Store normalized records separately from their source references. Validate extracted document data before evaluation. Preserve creation and modification history. Do not impose a uniqueness constraint that prevents storing duplicate invoice submissions for later detection.

## Behavior

The dashboard accepts existing `.xlsx` invoices, POs, and tabular supporting records, plus `.docx` contracts; it does not require a Naxa workbook template. Read workbooks with `openpyxl` and Word text/tables with `python-docx`; OCR is out of scope. For Excel uploads, preview workbook sheets and columns and let the user map columns to Naxa fields. Show extracted candidate details with their verification state, and let the user correct or confirm them before evaluation. Naxa maps evidence to playbook requirements and shows which required items are satisfied and which remain missing or unverified.

Link available vendor, PO, contract, approval, historical invoice/payment, and bank-history evidence. Record whether each required source is available; a verified empty history must be distinguishable from an inaccessible source. A user may add supporting records through additional uploads rather than re-entering each record in a prescribed workbook.

An invoice with missing, unreadable, or unverified required evidence can be recorded for review, but must not receive a clearance recommendation. Parsing or storage failures must be visible and must not create a misleading successful evaluation. Re-uploading or replacing a document must preserve the prior file/evaluation references in the audit history.

## Evidence and security

Retain source references and the values used in evaluations. Restrict access to the private demo; mask bank identifiers. Accept `.xlsx` or `.docx` files up to 10 MB each. Reject larger files before parsing or storage and show the user the per-file limit. Define file-type validation, safe filenames, storage location, malware/unsafe-file handling, and parser failure handling before enabling uploads.

## Acceptance criteria

- A valid record receives a unique internal ID and its values can be retrieved accurately.
- A user can upload an existing invoice and supporting files from the dashboard without first transcribing all records into a Naxa workbook.
- A spreadsheet preview lets the user select/map its columns to Naxa fields before confirming values.
- A Word contract can be uploaded and its extracted candidate details reviewed; no template transcription is required.
- An upload larger than 10 MB is rejected before parsing/storage with a clear size-limit message.
- The system previews extracted fields for user confirmation and clearly marks uncertain extraction.
- The built-in checklist shows required evidence that is present, missing, unreadable, or unverified and tells the user what is needed.
- Missing required evidence prevents clearance and remains available for later upload/clarification.
- Invalid amounts, dates, or references produce explicit validation errors.
- A duplicate submission can be retained for duplicate checking rather than silently discarded.
- Missing supporting records are recorded as unavailable and cannot imply clearance.
- Failed extraction does not silently turn uncertain values into verified financial inputs.
- Creation and changes are auditable; sensitive account details are masked where unnecessary.

## Open decisions

- Who can configure custom playbooks and how custom playbook versions are tracked (later scope).
- Storage and parser error/retry behavior for `.xlsx` and `.docx`.
- Whether a single upload may contain several evidence items or whether users upload each supporting file separately.
- How extraction uncertainty is presented and which fields require explicit user confirmation.
- Field requirements, amount precision, treatment of credits/negative amounts, and date validation.
- Vendor resolution, record-correction workflow, and source availability representation.
- How an uploaded document is associated with the right invoice, vendor, PO, or other record when the link is ambiguous.
