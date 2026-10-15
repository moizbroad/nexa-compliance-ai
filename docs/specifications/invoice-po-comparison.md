# Invoice-to-PO Comparison

**Status:** Draft for product-owner review; unresolved business rules are listed below.
**Authority:** [PRD v1.1](../prd.md), [constitution](../constitution.md), and [draft technical architecture](../technical-architecture.md).

## Purpose and scope

Compare an invoice with its linked purchase order. Implements FR-02 and supports AC-02. The first slice displays the amount difference only; the full MVP additionally addresses relevant currency, quantity, line-item, and PO-reference differences.

## Inputs

Validated invoice document total, linked PO document total, currency, vendor and PO references, and source record versions. Naxa uses the PO number on the invoice to find the PO and checks that the invoice vendor matches the PO vendor. Later checks require corresponding line items and quantities.

## Agreed first-slice behavior

Compare the invoice and PO document totals as entered, and label them clearly as “Invoice total” and “PO total.” Calculate `difference = invoice total - PO total` using exact decimal arithmetic. Display both amounts and the difference, indicating above, below, or equal to the PO. Treat this comparison as informational only: do not add a mismatch score or infer an overall risk level in this slice.

Support US dollars (USD), British pounds sterling (GBP), and Pakistani rupees (PKR). Compare amounts only when invoice and PO currency codes match. If a currency is missing, unsupported, or differs between the records, mark the comparison UNVERIFIED and require human review; do not convert currencies or compare unlike amounts.

Support one PO per invoice in the first version. If the PO number is absent, unmatched, or ambiguous, ask the user to resolve the link and keep the check UNVERIFIED until resolved. If invoice and PO vendors do not match, flag the discrepancy for human review; do not silently link or compare them. Invoices referencing multiple POs require manual review in the first version.

The displayed totals are the document totals; this slice does not determine whether differences arise from tax, shipping, discounts, or line items. Defer those explanations and detailed line-item matching to a later feature specification.

Example: invoice total 95,000.00 and PO total 80,000.00 in the same configured currency produce a difference of +15,000.00 above the PO. A matching amount produces zero. A missing or inaccessible PO produces an UNVERIFIED check and requires human review; do not manufacture a zero difference.

Compare each invoice with the full PO amount, even when the PO has prior invoices. When prior invoices linked to that PO are available, show them as context. Do not subtract them from the PO amount or present a remaining-balance calculation in this slice. This avoids implying that full-PO amount comparison is a cumulative balance check.

## Full MVP behavior

Distinguish confirmed mismatches from unavailable evidence. A triggered PO mismatch has the PRD default weight of 25. Define mismatch conditions and tolerances before activating scoring. Record each relevant discrepancy, with the scoring aggregation policy settled before implementation.

## Evidence

Record invoice and PO references, record versions or snapshots, expected and actual values, calculated differences, check status, explanation, and evaluation timestamp.

## Acceptance criteria

- An invoice document total of 95,000.00 versus a PO document total of 80,000.00 in the same currency displays +15,000.00 above the PO.
- An invoice document total of 75,000.00 versus a PO document total of 80,000.00 in the same currency displays -5,000.00 below the PO.
- Equal amounts display an exact zero difference.
- Decimal inputs produce exact results under the documented precision policy.
- Missing/unavailable PO requires review and supplies no invented comparison result.
- USD, GBP, and PKR are accepted; other or missing currency produces UNVERIFIED.
- Mismatched invoice/PO currency produces UNVERIFIED and no numeric comparison.
- The invoice PO number resolves to a single PO whose vendor matches the invoice vendor before comparison.
- A missing, unmatched, or ambiguous PO reference remains UNVERIFIED until the user resolves it.
- A vendor mismatch is shown for human review; a multiple-PO invoice is not silently reduced to one PO.
- The displayed difference does not imply that tax, shipping, discounts, or line items were reconciled.
- When prior invoices exist for the PO, the result shows them as context while comparing against the full PO amount.
- The result does not calculate or imply a remaining PO balance.
- First-slice results carry no mismatch score or overall clearance classification.
- Full MVP: approved mismatch fixtures trigger findings and the configured weight; missing evidence remains distinct.

## Open decisions

- Quantity units, line matching, and how to report vendor or PO-reference inconsistencies.
- Full MVP tolerance and multiple-discrepancy aggregation.
