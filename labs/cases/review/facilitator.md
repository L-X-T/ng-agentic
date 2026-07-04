# Facilitator key: booking-filter review

Reveal after the participant and independent reviewer have recorded their findings.

| Finding                               | Evidence                                                                                                | Expected disposition                                                   |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Unexpected reorder and input mutation | after.ts.txt line 5 sorts the caller's array in place to B1/B4/B2/B3                                    | Important: violates order and ownership                                |
| Active includes pending               | after.ts.txt line 6 only excludes cancelled; B4 survives                                                | Important: violates the Active requirement                             |
| Reset button lacks a name             | after.html.txt lines 6–8 contain only an aria-hidden SVG                                                | Important: keyboard/screen-reader users cannot identify the action     |
| Array copy is "critical"              | No requirement demands stable result identity; the ownership defect is the sort on line 5, not the copy | Reject the claimed defect/severity; don't invent a performance problem |

Expected trace for the supplied input (B3, B1, B4, B2): All returns B1/B4/B2/B3 and Active returns
B1/B4/B3; in both cases the caller's array ends up as B1/B4/B2/B3. A correct function returns
B3/B1/B4/B2 for All and B3/B1 for Active and leaves the input untouched.

The first two findings should be confirmed using the supplied input, not inferred from formatting.
The template finding needs a meaningful accessible name such as aria-label="Reset filter" or visible
button text. The label/select association is already correct.

An appropriate function preserves order and returns either a copy for All or a filter with strict
status === 'active'. The exercise does not require a particular abstraction, stable result identity,
or an implementation of the surrounding component.

Debrief: which confirmed issue did you miss, which agent claim did you reject, what proved it, and
did the reviewer distinguish unexecuted checks from passed ones? Record misses and false positives
without rewarding a high finding count. Three Important issues do not become Critical by quantity.
