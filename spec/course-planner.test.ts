import { describe, expect, inject, it } from "vitest";

// Turns this week's spec lines into assertions against the running app:
//
// - "it models a slice of a real ANU system you actually deal with, wired
//   end to end" — a plan actually reaches the database through the form and
//   back out through a rendered page, not just a static mock.
// - "the core flow persists across a reload — create something, and it's
//   still there" — the plan a student built survives a second fetch of the
//   same URL, and shows up on the index page too.
const baseUrl = inject("baseUrl");

const post = (path: string, body: URLSearchParams) =>
  fetch(new URL(path, baseUrl), {
    method: "POST",
    headers: { origin: baseUrl },
    body,
    redirect: "manual",
  });

describe("course planner", () => {
  let planUrl: string;
  const completed = "COMP1100, COMP1110, MATH1005, COMP1600";
  const inProgress = "COMP2100";

  it("creates a plan and redirects to its own page", async () => {
    const res = await post(
      "/api/plans",
      new URLSearchParams({ majorCode: "CSCI-MAJ", completed, inProgress }),
    );
    expect(res.status).toBe(303);
    const location = res.headers.get("location");
    expect(location).toMatch(/^\/plans\/\d+$/);
    planUrl = location!;
  });

  it("renders what was entered, with requirement statuses", async () => {
    const res = await fetch(new URL(planUrl, baseUrl));
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Computer Science");
    expect(html).toContain("COMP1100");
    // COMP2100 was entered as in-progress, so the compulsory core row it
    // satisfies should read "in progress", not "done".
    expect(html).toContain("in progress");
  });

  it("persists across a reload: fetching the same URL twice matches", async () => {
    const first = await (await fetch(new URL(planUrl, baseUrl))).text();
    const second = await (await fetch(new URL(planUrl, baseUrl))).text();
    expect(second).toBe(first);
  });

  it("lists the saved plan on the index page after a reload", async () => {
    const res = await fetch(baseUrl);
    const html = await res.text();
    expect(html).toContain(planUrl);
  });

  it("404s for a plan id that was never created", async () => {
    const res = await fetch(new URL("/plans/999999999", baseUrl));
    expect(res.status).toBe(404);
  });

  it("declares a language and a single top-level heading on the plan page (not covered by routes.ts)", async () => {
    const html = await (await fetch(new URL(planUrl, baseUrl))).text();
    expect(html).toMatch(/<html[^>]*\slang="[^"]+"/);
    expect((html.match(/<h1[ >]/g) ?? []).length).toBe(1);
  });
});
