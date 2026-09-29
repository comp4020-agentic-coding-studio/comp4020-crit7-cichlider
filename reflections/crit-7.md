## What was the breakthrough?

The breakthrough wasn't something the agent found — it was me noticing it.
The recommendation engine worked: correct requirement checking, correct
elective-category math, correct unit totals. But the first version of the
"Suggested schedule" — the actual output someone would use to decide what to
enrol in next semester — was a flat table with a bullet list crammed into
each cell. Technically correct, genuinely useless. Nobody plans their
courses off a bullet list; a real degree plan is a grid you can scan by
year and semester, where you can tell compulsory from elective at a glance.

I could have let that slide, because the tests passed and the numbers were
right. The unlock was refusing to treat "the logic is correct" as the same
thing as "this is done." I called it what it was — the UI was bad, not
just a little rough — and pushed for it to actually look like the thing it
was replacing (ANU's own study plan), not a placeholder.

## What did this change about how I want to work as a developer?

The first time I flagged this, I said "the UI is too ugly" and left it
there — too vague to act on precisely, so the first fix (matching ANU's
visual style) was right but incomplete: the schedule itself was still a
text list, just a prettier one. It only actually got fixed once I said
exactly what "ugly" meant: organise by year/semester, one course per cell,
visually distinguish compulsory from elective, make it a real grid, not a
report. Vague feedback gets a vague fix; specific feedback gets the actual
problem solved.

Going forward I want to default to naming problems that precisely, for
myself as much as for an agent — "this doesn't work" or "this is bad" is a
feeling, not a spec, and the gap between them is exactly the gap between a
plausible-looking fix and the right one.
