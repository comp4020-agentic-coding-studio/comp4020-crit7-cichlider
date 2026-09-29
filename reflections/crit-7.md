DRAFT — rewrite this in your own voice before submitting. See note below.

## What was the breakthrough?

The breakthrough wasn't technical, it was scope. My first instinct was to
try to model the whole Bachelor of Computing — every major, a full
prerequisite graph, the general electives, the lot — because that's what
"course selection" sounds like it should mean. The actual unlock was
realising the brief was asking for the opposite: a slice, honestly bounded,
beats a whole system that's secretly held together with invented data. Once
I picked one major's 48 units and said out loud what I wasn't modelling
(live prerequisites, the full degree, ANU's live catalogue), the rest of the
build got much easier to reason about, because every decision had a clear
"does this belong in the slice or not" test.

The other half of it was the real-data decision. It would have been faster
to invent plausible-looking requirement numbers. Fetching four actual major
pages and then explicitly flagging the places where the page itself doesn't
state something (prerequisites, mostly) took longer, but it's the difference
between a tool that's useful and one that just looks like it is.

## What did this change about how I want to work as a developer?

I want to default to saying what a system doesn't do, not just what it
does. A README that lists its own gaps is more trustworthy than one that
only lists features, and that trust is worth more than the extra polish of
hiding the gaps. I also want to keep treating "confirm before reusing
someone else's (or my own past) work" as a real step and not a formality —
checking whether last week's harness actually applied here, instead of
merging it on autopilot, is the same instinct as flagging inferred data
instead of presenting it as fact.
