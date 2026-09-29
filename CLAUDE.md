# Working rules for this repo

## No harness carried forward from last week

The previous distinct-prefix repo (`comp4020-ass2`, since crit6 was that
assignment's retro and shares its repo) has a `CLAUDE.md`, but its rules are
entirely about that assignment's own fictional content (a satirical course
called "Dating for Engineers": register, one-concept-per-week enforcement,
composite case studies). None of that is a generic engineering convention —
it doesn't transfer to a course-selection planner, so this file starts fresh
rather than merging rules that wouldn't mean anything here. Confirmed with
the student before treating that repo as the harness source at all, per the
`start` skill's "confirm before reading it."

## Real data over invented data, and say which is which

`src/lib/majors.ts` is seeded from four actual ANU Programs & Courses major
pages (fetched, not recalled from training data), because a course planner
that quietly makes up requirement numbers is worse than one that admits its
gaps. Where a major's page doesn't state something the tool needs (e.g.
neither Software Development nor Intelligent Systems lists explicit
prerequisites), that's flagged as an inferred assumption on the plan page and
in `README.md` — never silently presented as fact. Elective "pools" are
illustrative, not ANU's full catalogue, and the tool says so when a
category's shortfall runs past the example list.

## Don't rebuild the whole enrolment system

The brief says model the slice, not the whole thing. Scope stayed to one
major's own units (48), not the full 144-unit degree, and to the
"foundational courses gate later years" rule each major page states, not a
full prerequisite graph for every course. Resisting the urge to keep adding
majors/courses "for completeness" was a deliberate call, not an oversight.
