# ANU course planner

The ANU system that reliably ruins my week is course selection: working out,
from what I've already done, which of a Computing major's requirements are
still open and what to enrol in next. This is that, as a full-stack slice —
pick a major, list completed and in-progress courses, and get back a
requirement checklist plus a suggested semester-by-semester schedule, saved to
SQLite so it's still there on a reload.

It deliberately does **not** model:

- the full 144-unit Bachelor of Computing degree (general electives, WPL, a
  second major) — only one major's own units;
- live prerequisite chains for every course — only the "first-year
  foundational courses" each major page names as gating 2000/3000-level
  study, plus that major's own compulsory/elective structure;
- ANU's live catalogue or seat availability — the major data
  (`src/lib/majors.ts`) is a fixed snapshot fetched from four real
  [Programs & Courses](https://programsandcourses.anu.edu.au/) major pages
  (Computer Science, Software Development, Intelligent Systems, Statistical
  Data Analytics), each linked from its plan page. ANU republishes these
  yearly, so treat this tool as a planning aid, not an enrolment source of
  truth — the source link on every plan is there so you can check.

## What good looks like here

Good means: honest about what it doesn't model, rather than pretending to be
the whole enrolment system. Where the real major page didn't state something
(e.g. neither the Software Development nor the Intelligent Systems major page
lists explicit prerequisites, only compulsory/elective unit counts), the tool
says so as a flagged assumption on the plan page instead of inventing a
prerequisite chain that looks authoritative but isn't. Elective category
"pools" are illustrative course lists, not ANU's full catalogue — enumerating
every COMP course was out of scope for a one-week slice, and the tool says
that too when a category's shortfall runs past its example list.

The mechanically checkable half of that — a plan surviving a reload, the
create-flow actually reaching the database, a 404 for an unknown plan — is
enforced in `spec/course-planner.test.ts`. Whether the recommendation logic
itself is *useful* (the right things flagged as missing, a sane semester
packing) is a judgement call for the crit, not something a test can hold.
