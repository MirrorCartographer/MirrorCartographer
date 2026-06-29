# Claim Influence Ledger Scorecard

## Purpose
Evaluate whether a Mirror Cartographer public artifact makes claim influence inspectable without leaking protected source material.

## Scoring
0 = absent or unsafe
1 = weak / vague / partial
2 = acceptable
3 = strong / release-ready

## Criteria

| Criterion | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- |
| Claim segmentation | Claims are blended together. | Some claims separated. | Most claims separated. | Every material claim is inspectable. |
| Claim mode clarity | Fact, inference, symbol, and speculation blur. | Labels exist but are inconsistent. | Labels are mostly correct. | Every claim has a correct primary mode. |
| Source status | Source class hidden or misleading. | Broad source labels only. | Source classes clear. | Source classes clear and bounded. |
| Influence status | Citations imply influence without inspection. | Influence vaguely described. | Influence route stated. | Influence route is claim-specific and testable. |
| Privacy safety | Private details exposed or inferable. | Some privacy risk remains. | No direct exposure. | No direct exposure and low inference risk. |
| Evidence boundary | Claims overstate proof. | Some caveats present. | Boundaries mostly accurate. | Every claim says what evidence can and cannot prove. |
| Missingness | Missingness absent. | Generic missingness. | Relevant gaps listed. | Claim-level missingness listed with impact. |
| Revision reason | Changes unexplained. | Vague change notes. | Main changes explained. | Every meaningful revision has a reason. |
| Accessibility | Audit depends on dense code/table-only structure. | Some readable summary. | Mostly readable. | Screen-reader-friendly summary and table. |
| Release decision | No release decision. | Release decision vague. | Release/hold/revise stated. | Release decision justified by score. |

## Pass threshold
- Minimum total: 24 / 30
- No zero in privacy safety, claim mode clarity, or evidence boundary.
- High-impact claims require at least 2 in source status and influence status.

## Failure examples
- A beautiful phrase that hides whether it is evidence, inference, or mythopoetic language.
- A citation attached to a paragraph that the source did not materially shape.
- A public-safe summary that removes private details but also erases claim boundaries.
- A product requirement derived from private context without labeling the private context as abstracted.

## Release labels
- Release-ready: score 24–30, no critical zeros.
- Revise: score 16–23, or one critical weakness.
- Hold: score below 16 or influence route unclear for high-impact claims.
- Reject: private details exposed or symbolic interpretation presented as authority.

## Key phrase
A public-safe artifact should be readable, but also cross-examinable.
