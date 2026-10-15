# NAXA — Draft API Design

**Status:** Initial technical draft for product-owner review; endpoint details and request schemas are not yet final.
**Sources:** [PRD](prd.md), [constitution](constitution.md), [technical architecture](technical-architecture.md), and the [feature specifications](specifications/README.md).

## API principles

- FastAPI exposes REST endpoints under `/api/v1`.
- Use request/response schemas for validation. Return stable error codes and readable field-level messages.
- Represent monetary values as decimal strings in JSON (for example, `"95000.00"`) so clients do not introduce floating-point rounding.
- Accept currency codes USD, GBP, and PKR. Do not convert currencies; comparisons require matching codes.
- Use UUIDs for internal resource IDs. Human invoice/PO numbers are searchable business fields, not API primary keys.
- Upload responses identify processing and verification state. Do not treat extracted values as verified until the user confirms them.
- Every evaluation references its source records, playbook/policy version, and evaluation time.
- The private single-user MVP does not expose financial records publicly. Deployment controls must be defined before an external demonstration.

## First-slice flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Next.js dashboard
    participant API as FastAPI
    participant Files as Private file storage
    participant DB as PostgreSQL
    User->>UI: Upload invoice and available PO documents
    UI->>API: Submit files
    API->>Files: Store originals privately
    API->>DB: Store file metadata and processing state
    API-->>UI: Return upload IDs and extraction status
    UI->>API: Submit field mappings, confirm values, and resolve PO link
    API->>DB: Store confirmed invoice/PO data and playbook results
    UI->>API: Request comparison
    API->>DB: Load confirmed records and evidence
    API->>API: Validate PO/vendor/currency; calculate exact difference
    API->>DB: Save evaluation (or UNVERIFIED result)
    API-->>UI: Return comparison and review status
```

## Candidate endpoint groups

| Method and path | Purpose |
| --- | --- |
| `POST /api/v1/documents` | Upload an `.xlsx` workbook for invoice/PO/tabular records or a `.docx` contract up to 10 MB; parse with `openpyxl`/`python-docx`, store it privately, and return document ID, processing state, and unverified candidate fields. Reject larger files with a clear size-limit error. |
| `GET /api/v1/documents/{document_id}` | Retrieve processing/verification state and safe metadata for a document. |
| `POST /api/v1/imports/{import_id}/confirm` | Submit spreadsheet column mappings, confirm/correct extracted invoice/PO fields, and link supporting documents. Exact import resource shape remains open. |
| `POST /api/v1/invoices` | Create a confirmed invoice record from validated fields when data is entered/confirmed without an upload flow. |
| `GET /api/v1/invoices/{invoice_id}` | Retrieve invoice and its linked PO, evidence checklist, and recent evaluation summary. |
| `POST /api/v1/invoices/{invoice_id}/evaluations` | Run the applicable deterministic checks and save an evaluation. |
| `GET /api/v1/cases/{case_id}` | Retrieve findings, evidence references, score/completeness status, and review state. |
| `POST /api/v1/cases/{case_id}/decisions` | Record approve/reject/request-clarification with required reason and reviewer identifier. |
| `GET /api/v1/cases/{case_id}/history` | Retrieve append-only evaluation, document, and decision history. |

Endpoint names are proposed and can change during task planning. File downloads must go through an authorization-checked handler; never return filesystem paths as public URLs.

## Comparison response sketch

```json
{
  "evaluation_id": "uuid",
  "check_status": "COMPLETE",
  "review_status": "OPEN",
  "invoice": {"id": "uuid", "document_total": "95000.00", "currency": "USD"},
  "purchase_order": {"id": "uuid", "po_number": "PO-1001", "document_total": "80000.00", "currency": "USD"},
  "difference": {"amount": "15000.00", "direction": "ABOVE_PO"},
  "score": null,
  "risk_level": null
}
```

This illustrates the agreed unscored first slice. If the PO is missing, ambiguous, vendor-mismatched, or in another currency, return an UNVERIFIED check with a reason and no fabricated numeric difference. Exact enum names and error response shape remain to be defined.

## Candidate error behavior

- Invalid document type/size: reject upload with a field-level error.
- Extraction failure: retain safe upload metadata, report failure, and request corrected data/document; do not create verified financial values.
- Missing/ambiguous PO or vendor mismatch: return UNVERIFIED and request human resolution.
- Missing/mismatched currency: return UNVERIFIED and no comparison.
- Unsupported currency code: reject or mark UNVERIFIED with a clear supported-currency message; do not silently relabel or convert it.
- Required evidence unavailable: retain known findings while showing UNVERIFIED; never recommend clearance.
- Invalid review decision or missing reason: reject without partially recording a decision.

## Open decisions

- Final endpoint/resource design, pagination, filtering, and API error format.
- Malware handling, parser status model, and retry behavior.
- Whether extraction confirmation creates the invoice directly or uses a separate import/session resource.
- Auth/network controls for an external demonstration.
- Review-decision transitions and behavior when a case has new evidence or a newer evaluation.
