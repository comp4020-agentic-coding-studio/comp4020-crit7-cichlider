import { type CourseRef, type ElectiveCategory, type Major, type Requirement } from "./majors";

const SEMESTER_UNITS = 24; // ANU's normal full-time load: 4x 6-unit courses.

export function parseCourseList(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const token of raw.split(/[\s,]+/)) {
    const code = token.trim().toUpperCase();
    if (!code || !/^[A-Z]{2,6}\d{4}$/.test(code)) continue;
    if (!seen.has(code)) {
      seen.add(code);
      out.push(code);
    }
  }
  return out;
}

export function courseLevel(code: string): number | undefined {
  const match = code.match(/\d{4}$/);
  return match ? Number(match[0][0]) : undefined;
}

type Status = "done" | "in-progress" | "missing";

function statusOf(known: Set<string>, done: Set<string>, code: string): Status {
  if (done.has(code)) return "done";
  if (known.has(code)) return "in-progress";
  return "missing";
}

export type RequirementRow = {
  label: string;
  options: CourseRef[];
  status: Status;
  satisfiedBy?: string;
};

function checkRequirement(req: Requirement, known: Set<string>, done: Set<string>): RequirementRow {
  const options = req.kind === "course" ? [req.course] : req.options;
  const label = req.kind === "course" ? `${req.course.code} ${req.course.title}` : req.label;
  for (const opt of options) {
    if (done.has(opt.code)) return { label, options, status: "done", satisfiedBy: opt.code };
  }
  for (const opt of options) {
    if (known.has(opt.code)) return { label, options, status: "in-progress", satisfiedBy: opt.code };
  }
  return { label, options, status: "missing" };
}

export type CategoryRow = {
  category: ElectiveCategory;
  doneUnits: number;
  inProgressUnits: number;
  countedCourses: { code: string; title: string; units: number; status: Status }[];
  stillNeeded: number; // units still to find, against minUnits
  remainingSlots: CourseRef[]; // suggested pool courses not yet used, up to stillNeeded
};

function checkCategory(
  category: ElectiveCategory,
  known: Set<string>,
  done: Set<string>,
  claimed: Set<string>,
): CategoryRow {
  const countedCourses: CategoryRow["countedCourses"] = [];
  let doneUnits = 0;
  let inProgressUnits = 0;

  const matches = (code: string) =>
    category.pool.some((p) => p.code === code) ||
    (category.levelFallback !== undefined && courseLevel(code) === category.levelFallback);

  for (const code of known) {
    if (claimed.has(code) || !matches(code)) continue;
    const ref = category.pool.find((p) => p.code === code) ?? { code, title: code, units: 6 };
    const status = statusOf(known, done, code);
    countedCourses.push({ code, title: ref.title, units: ref.units, status });
    claimed.add(code);
    if (status === "done") doneUnits += ref.units;
    else inProgressUnits += ref.units;
  }

  const haveUnits = doneUnits + inProgressUnits;
  const stillNeeded = Math.max(0, category.minUnits - haveUnits);

  const usedCodes = new Set(countedCourses.map((c) => c.code));
  const remainingSlots: CourseRef[] = [];
  let remaining = stillNeeded;
  for (const course of category.pool) {
    if (remaining <= 0) break;
    if (usedCodes.has(course.code)) continue;
    remainingSlots.push(course);
    remaining -= course.units;
  }

  return { category, doneUnits, inProgressUnits, countedCourses, stillNeeded, remainingSlots };
}

export type ScheduleItem = { label: string; code?: string; units: number };
export type PlanResult = {
  major: Major;
  foundational: RequirementRow[];
  compulsory: RequirementRow[];
  categories: CategoryRow[];
  levelCheck?: {
    max1000?: { limit: number; actual: number; ok: boolean };
    min3000Plus?: { limit: number; actual: number; ok: boolean };
  };
  schedule: { semester: number; items: ScheduleItem[]; units: number }[];
  totalMajorUnitsRemaining: number;
  warnings: string[];
};

export function recommend(major: Major, completedRaw: string[], inProgressRaw: string[]): PlanResult {
  const done = new Set(completedRaw.map((s) => s.toUpperCase()));
  const inProg = new Set(inProgressRaw.map((s) => s.toUpperCase()));
  const known = new Set([...done, ...inProg]);
  const warnings: string[] = [];

  const foundational = major.foundational.map((req) => checkRequirement(req, known, done));
  const compulsory = major.compulsory.map((req) => checkRequirement(req, known, done));

  const claimed = new Set<string>();
  // Courses already spent satisfying foundational/compulsory requirements
  // don't get double-counted against an elective category.
  for (const row of [...foundational, ...compulsory]) {
    if (row.satisfiedBy) claimed.add(row.satisfiedBy);
  }
  const categories = major.categories.map((cat) => checkCategory(cat, known, done, claimed));

  // Level-distribution check, over every course this plan currently assigns
  // to the major (foundational excluded — ANU counts those separately, per
  // the major pages' own wording).
  let levelCheckResult: PlanResult["levelCheck"];
  if (major.levelLimits) {
    const assignedCodes = [
      ...[...compulsory].flatMap((r) => (r.satisfiedBy ? [r.satisfiedBy] : [])),
      ...categories.flatMap((c) => c.countedCourses.map((cc) => cc.code)),
    ];
    let units1000 = 0;
    let units3000Plus = 0;
    for (const code of assignedCodes) {
      const level = courseLevel(code) ?? 0;
      const ref =
        major.compulsory
          .flatMap((r) => (r.kind === "course" ? [r.course] : r.options))
          .find((o) => o.code === code) ?? categories.flatMap((c) => c.category.pool).find((p) => p.code === code);
      const units = ref?.units ?? 6;
      if (level <= 1) units1000 += units;
      if (level >= 3) units3000Plus += units;
    }
    const levelCheck: PlanResult["levelCheck"] = {};
    if (major.levelLimits.max1000 !== undefined) {
      levelCheck.max1000 = { limit: major.levelLimits.max1000, actual: units1000, ok: units1000 <= major.levelLimits.max1000 };
    }
    if (major.levelLimits.min3000Plus !== undefined) {
      levelCheck.min3000Plus = {
        limit: major.levelLimits.min3000Plus,
        actual: units3000Plus,
        ok: units3000Plus >= major.levelLimits.min3000Plus,
      };
    }
    levelCheckResult = levelCheck;
  }

  // Build the remaining-work queue: foundational first (it gates everything
  // else), then compulsory, then each category's still-needed slots ordered
  // so a category short of its OWN minimum fills before one already met —
  // and, within that, 3000+-level slots ahead of 2000-level ones, since a
  // major's min-3000 rule is the one students most often miss.
  const queue: ScheduleItem[] = [];
  for (const row of foundational) {
    if (row.status === "missing") queue.push({ label: row.label, units: row.options[0]?.units ?? 6 });
  }
  for (const row of compulsory) {
    if (row.status === "missing") {
      const pick = row.options[0];
      queue.push({ label: row.label, code: pick?.code, units: pick?.units ?? 6 });
    }
  }
  const sortedCategories = [...categories].sort((a, b) => (b.category.levelFallback ?? 0) - (a.category.levelFallback ?? 0));
  for (const cat of sortedCategories) {
    for (const course of cat.remainingSlots) {
      queue.push({ label: `${cat.category.label}: ${course.title}`, code: course.code, units: course.units });
    }
    const coveredByPool = cat.remainingSlots.reduce((sum, c) => sum + c.units, 0);
    if (coveredByPool < cat.stillNeeded) {
      queue.push({ label: `${cat.category.label}: unspecified elective`, units: cat.stillNeeded - coveredByPool });
      warnings.push(
        `${major.name}: ${cat.category.label} still needs ${cat.stillNeeded - coveredByPool} units beyond the example pool — check the major page for the full list.`,
      );
    }
  }

  const schedule: PlanResult["schedule"] = [];
  let current: ScheduleItem[] = [];
  let currentUnits = 0;
  for (const item of queue) {
    if (currentUnits + item.units > SEMESTER_UNITS && current.length > 0) {
      schedule.push({ semester: schedule.length + 1, items: current, units: currentUnits });
      current = [];
      currentUnits = 0;
    }
    current.push(item);
    currentUnits += item.units;
  }
  if (current.length > 0) schedule.push({ semester: schedule.length + 1, items: current, units: currentUnits });

  const totalMajorUnitsRemaining = queue.reduce((sum, i) => sum + i.units, 0);

  if (major.foundationalInferred) {
    warnings.push(`${major.name}: foundational prerequisites aren't stated on the major page — inferred from its compulsory courses' level.`);
  }

  return {
    major,
    foundational,
    compulsory,
    categories,
    levelCheck: levelCheckResult,
    schedule,
    totalMajorUnitsRemaining,
    warnings,
  };
}
