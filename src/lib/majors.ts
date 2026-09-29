// Reference data for a handful of ANU Bachelor of Computing majors, as
// published on ANU Programs & Courses for 2026. This is the "ground truth"
// a real course-selection system would pull live from the university's
// student system — here it's a fixed snapshot, fetched by hand from the
// major pages linked below, because that's the slice this prototype models.
// ANU updates these pages yearly: verify against `sourceUrl` before actually
// enrolling on the strength of this tool.
//
// A few things this data does NOT model, on purpose (see README.md):
// - the full 144-unit Bachelor of Computing degree (general electives,
//   a second major/minor, WPL) — only the major's own 48 units;
// - ANU's course-level prerequisite chains course-by-course — only the
//   "first-year foundational courses" ANU's own major pages call out as
//   gating progression, plus each major's own compulsory/elective structure;
// - live seat availability, timetabling clashes, or session offerings.

export type CourseRef = { code: string; title: string; units: number };

export type Requirement =
  | { kind: "course"; course: CourseRef }
  | { kind: "oneOf"; options: CourseRef[]; label: string };

export type ElectiveCategory = {
  id: string;
  label: string;
  /** Illustrative, non-exhaustive: real ANU catalogues have many more. */
  pool: CourseRef[];
  minUnits: number;
  maxUnits: number;
  /** For a course NOT in `pool`, the level (leading digit) that still counts. */
  levelFallback?: number;
};

export type Major = {
  code: string;
  name: string;
  totalUnits: number;
  sourceUrl: string;
  /** Must be done (or in progress) before 2000/3000-level major courses. */
  foundational: Requirement[];
  foundationalInferred: boolean;
  compulsory: Requirement[];
  categories: ElectiveCategory[];
  levelLimits?: { max1000?: number; min3000Plus?: number };
  notes: string[];
};

const c = (code: string, title: string, units = 6): CourseRef => ({ code, title, units });

const FIRST_YEAR_PROGRAMMING: Requirement = {
  kind: "oneOf",
  label: "intro programming",
  options: [
    c("COMP1100", "Programming as Problem Solving"),
    c("COMP1130", "Introduction to Programming and Algorithms (Advanced)"),
    c("COMP1730", "Programming for Scientists"),
  ],
};

const SECOND_PROGRAMMING: Requirement = {
  kind: "oneOf",
  label: "structured programming",
  options: [c("COMP1110", "Structured Programming"), c("COMP1140", "Advanced Structured Programming")],
};

const FIRST_YEAR_MATH: Requirement = {
  kind: "oneOf",
  label: "first-year mathematics",
  options: [
    c("MATH1003", "Algebra and Calculus Building Block"),
    c("MATH1005", "Discrete Mathematical Models"),
    c("MATH1013", "Mathematics and Applications 1"),
    c("MATH1014", "Mathematics and Applications 2"),
    c("MATH1113", "Mathematics and Applications 1 (Advanced)"),
    c("MATH1115", "Mathematics and Applications 1 (Honours)"),
    c("MATH1116", "Mathematics and Applications 2 (Honours)"),
  ],
};

export const MAJORS: Major[] = [
  {
    code: "CSCI-MAJ",
    name: "Computer Science",
    totalUnits: 48,
    sourceUrl: "https://programsandcourses.anu.edu.au/2026/major/CSCI-MAJ",
    foundationalInferred: false,
    foundational: [
      { kind: "course", course: c("COMP1600", "Foundations of Computing") },
      FIRST_YEAR_MATH,
      FIRST_YEAR_PROGRAMMING,
      SECOND_PROGRAMMING,
    ],
    compulsory: [
      {
        kind: "oneOf",
        label: "core (systems vs. construction track)",
        options: [c("COMP2100", "Software Construction"), c("COMP2300", "Computer Organisation and Program Execution")],
      },
    ],
    categories: [
      {
        id: "level2",
        label: "2000-level Computer Science electives",
        pool: [
          c("COMP2100", "Software Construction"),
          c("COMP2120", "Software Engineering"),
          c("COMP2300", "Computer Organisation and Program Execution"),
          c("COMP2310", "Concurrent and Distributed Systems"),
          c("COMP2400", "Relational Databases"),
          c("COMP2600", "Formal Methods for Software Engineering"),
          c("COMP2610", "Information Theory"),
          c("COMP2620", "Logic"),
          c("COMP2700", "Cyber Security Foundations"),
        ],
        minUnits: 0,
        maxUnits: 18,
        levelFallback: 2,
      },
      {
        id: "level3",
        label: "3000-level Computer Science electives",
        pool: [
          c("COMP3120", "Advanced Databases"),
          c("COMP3425", "Data Mining"),
          c("COMP3430", "Data Wrangling"),
          c("COMP3500", "Software Engineering Project", 12),
          c("COMP3600", "Algorithms"),
          c("COMP3610", "Principles of Programming Languages"),
          c("COMP3620", "Artificial Intelligence"),
          c("COMP3630", "Theory of Computation"),
          c("COMP3670", "Introduction to Machine Learning"),
          c("COMP3900", "Human-Computer Interaction"),
        ],
        minUnits: 18,
        maxUnits: 42,
        levelFallback: 3,
      },
    ],
    notes: [
      "Suggested theme (Artificial Intelligence): COMP3620 + COMP2620.",
      "Suggested theme (Information-Intensive Computing): COMP2400 + COMP3425 + COMP3430.",
      "Choose COMP2300 over COMP2100 if you're leaning towards the Computer Systems theme.",
    ],
  },
  {
    code: "SOFT-MAJ",
    name: "Software Development",
    totalUnits: 48,
    sourceUrl: "https://programsandcourses.anu.edu.au/2026/major/soft-maj",
    foundationalInferred: true,
    foundational: [FIRST_YEAR_PROGRAMMING, SECOND_PROGRAMMING],
    compulsory: [
      { kind: "course", course: c("COMP2120", "Software Engineering") },
      { kind: "course", course: c("COMP3500", "Software Engineering Project", 12) },
      { kind: "course", course: c("COMP4130", "Managing Software Quality and Process") },
    ],
    categories: [
      {
        id: "catA",
        label: "Category A",
        pool: [
          c("COMP3600", "Algorithms"),
          c("COMP3610", "Principles of Programming Languages"),
          c("COMP3900", "Human-Computer Interaction"),
          c("INFS3024", "Information Systems Management"),
          c("INFS3059", "Project Management and Information Systems"),
        ],
        minUnits: 12,
        maxUnits: 12,
      },
      {
        id: "catB",
        label: "Category B",
        pool: [
          c("ASIA3032", "Technology and Society in Asia"),
          c("COMP2700", "Cyber Security Foundations"),
          c("ENGN1211", "Engineering Design 1: Discovering Engineering"),
          c("ENGN2300", "Engineering Design 2: Systems Approaches for Design"),
          c("INFS3002", "Enterprise Systems in Business"),
          c("MGMT2009", "Design Thinking: Human-Centred Innovation"),
          c("SCOM3029", "Science Communication and Planetary Crises"),
        ],
        minUnits: 0,
        maxUnits: 12,
      },
    ],
    levelLimits: { max1000: 18, min3000Plus: 18 },
    notes: [
      "Not available in the Bachelor of Engineering (Software Engineering) or Bachelor of Advanced Computing programs.",
      "Foundational programming courses aren't listed as explicit prerequisites on the major page — inferred from the compulsory courses' own level.",
    ],
  },
  {
    code: "INSY-MAJ",
    name: "Intelligent Systems",
    totalUnits: 48,
    sourceUrl: "https://programsandcourses.anu.edu.au/2026/major/insy-maj",
    foundationalInferred: true,
    foundational: [FIRST_YEAR_PROGRAMMING, SECOND_PROGRAMMING],
    compulsory: [
      { kind: "course", course: c("COMP2620", "Logic") },
      { kind: "course", course: c("COMP3620", "Artificial Intelligence") },
      { kind: "course", course: c("COMP3670", "Introduction to Machine Learning") },
    ],
    categories: [
      {
        id: "catA",
        label: "Category A",
        pool: [
          c("COMP3600", "Algorithms"),
          c("COMP4620", "Advanced Topics in Artificial Intelligence"),
          c("COMP4670", "Statistical Machine Learning"),
          c("COMP4680", "Advanced Topics in Machine Learning"),
          c("COMP4691", "Optimisation"),
        ],
        minUnits: 12,
        maxUnits: 30,
      },
      {
        id: "catB",
        label: "Category B",
        pool: [
          c("COMP4528", "Computer Vision"),
          c("COMP4610", "Computer Graphics"),
          c("COMP4650", "Document Analysis"),
        ],
        minUnits: 0,
        maxUnits: 18,
      },
    ],
    levelLimits: { max1000: 18, min3000Plus: 18 },
    notes: [
      "Incompatible with the Advanced Intelligent Systems major and the AI/Machine Learning (UG) specialisations.",
      "Foundational programming courses aren't listed as explicit prerequisites on the major page — inferred from the compulsory courses' own level.",
    ],
  },
  {
    code: "STDA-MAJ",
    name: "Statistical Data Analytics",
    totalUnits: 48,
    sourceUrl: "https://programsandcourses.anu.edu.au/2026/major/stda-maj",
    foundationalInferred: false,
    foundational: [
      FIRST_YEAR_MATH,
      { kind: "oneOf", label: "intro statistics", options: [c("STAT1003", "Statistics for Science"), c("STAT1008", "Quantitative Business Analysis")] },
      { kind: "oneOf", label: "statistics II", options: [c("STAT2001", "Statistical Techniques 1"), c("STAT2013", "Statistical Techniques 1 (Honours)")] },
      { kind: "oneOf", label: "statistics III", options: [c("STAT2008", "Statistical Techniques 2"), c("STAT2014", "Statistical Techniques 2 (Honours)")] },
      FIRST_YEAR_PROGRAMMING,
    ],
    compulsory: [
      { kind: "course", course: c("STAT3011", "Graphical Data Analysis") },
      { kind: "course", course: c("STAT3015", "Generalised Linear Modelling") },
      { kind: "course", course: c("STAT3016", "Introduction to Bayesian Data Analysis") },
      { kind: "course", course: c("STAT3017", "Big Data Statistics") },
      { kind: "course", course: c("STAT3040", "Statistical Learning") },
      { kind: "course", course: c("STAT3050", "Advanced Statistical Learning") },
    ],
    categories: [
      {
        id: "comp",
        label: "Computing elective",
        pool: [
          c("COMP1110", "Structured Programming"),
          c("COMP2400", "Relational Databases"),
          c("COMP3425", "Data Mining"),
          c("COMP3430", "Data Wrangling"),
        ],
        minUnits: 12,
        maxUnits: 12,
      },
    ],
    notes: [
      "The foundational courses above are required to reach this major's own 48 units but aren't counted within them.",
      "Offered by the ANU College of Business and Economics, not Systems and Society.",
    ],
  },
];

export function findMajor(code: string): Major | undefined {
  return MAJORS.find((m) => m.code === code);
}
