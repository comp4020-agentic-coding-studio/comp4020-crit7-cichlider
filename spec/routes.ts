// The routes the invariants run against. When you add a page, add its route
// here, or the invariants stop covering it.
//
// /plans/[id] is deliberately not listed: it only exists once a plan has
// been created, so course-planner.test.ts drives it directly (create a plan
// over HTTP, then fetch the id it redirects to) rather than the invariants
// walking a fixed path.
export const ROUTES = ["/", "/readme/"];
