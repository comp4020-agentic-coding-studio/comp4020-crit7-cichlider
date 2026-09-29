# Process overview

## What I built

An ANU course planner: pick a Computing major, list completed and
in-progress courses, get back a requirement checklist and a suggested
semester schedule, saved to SQLite. What it is and what it deliberately
doesn't model is in `README.md`; this is how I got there.

## How I got here

The brief was "pick an ANU system you actually deal with and build the
full-stack replacement you wish existed." Course selection is the one that
actually costs me time every semester, so that's what I built, not a
generic example.

**Harness first.** The nearest prior repo with its own harness is
`comp4020-ass2` (crit6 was that assignment's retro, sharing its repo). I
confirmed with myself that its `CLAUDE.md` was worth reading before treating
it as a source, per the `start` skill's rule — but its rules turned out to
be entirely about that assignment's own fictional course content ("Dating
for Engineers"), none of which is a generic engineering convention. Rather
than merge rules that wouldn't mean anything here, I wrote a fresh
`CLAUDE.md` and said so directly:
[`3e2b012`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-cichlider/commit/3e2b012).

**Real data, not invented data.** The planner is only honest if its
requirement numbers are real, so `src/lib/majors.ts` is seeded from four
actual 2026 ANU Programs & Courses major pages (Computer Science, Software
Development, Intelligent Systems, Statistical Data Analytics) — fetched, not
recalled. Where a major's page didn't state something the tool needed (e.g.
neither Software Development nor Intelligent Systems lists explicit
prerequisites), I flagged it as an inferred assumption in the data and on
the rendered plan page instead of inventing a prerequisite chain that would
look authoritative but wasn't. That data model, plus the recommendation
engine (requirement status, elective-category unit accounting without
double-counting, a level-distribution check, and a semester-packing
scheduler at ANU's normal 24-unit full-time load) landed in
[`d6df370`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-cichlider/commit/d6df370).

**Wiring it end to end.** The guestbook demo (`events`/`messages`) was
template plumbing, not this week's content, so it came out rather than
sitting alongside the real feature. The major-select form, the `/api/plans`
route, and the `/plans/[id]` recommendation page landed in
[`e293c0a`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-cichlider/commit/e293c0a).

**Turning the spec into tests.** The mechanically-checkable half of the
brief — "wired end to end, not a static mock" and "the core flow persists
across a reload" — became `spec/course-planner.test.ts`: create a plan over
HTTP, assert the redirect and the rendered content, fetch it twice and
diff, confirm the index page lists it, and 404 an unknown id. That, the
`routes.ts` update explaining why `/plans/[id]` isn't in the generic
invariants list, and `README.md`'s account of scope landed in
[`343448e`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-cichlider/commit/343448e).
The judged half — whether the recommendation logic is actually *useful*, a
sane semester packing — isn't something a test can hold, and I've said that
in `README.md` rather than pretend the test suite covers it.

**How I know it's right.** `pnpm typecheck` is clean (0 errors) and
`pnpm test` is green (31/31: axe-core accessibility checks, the
README-serving invariant, and the new course-planner HTTP flow), re-run
after all four commits above at
[`343448e`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-cichlider/commit/343448e).
I also drove the create-plan flow by hand against the built server with
`curl` before writing the automated version, so the automated test was
confirming a flow I'd already watched work, not the only thing that ever
exercised it.

**What I chose not to do.** No Artifact-hosted version — this session's
auth doesn't support publishing one, and a plain repo-hosted app is what the
brief actually asks for anyway. No attempt at every ANU major or a full
prerequisite graph: the brief says model the slice, and one major's 48
units with its own compulsory/elective structure is the slice.

## Before you ship

Ran `pnpm check:evidence` after the commits above to confirm the citations
resolve and the harness/reflection files are in place.
