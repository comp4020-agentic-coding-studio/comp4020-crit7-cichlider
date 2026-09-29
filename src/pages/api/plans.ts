import type { APIRoute } from "astro";
import { createPlan } from "../../lib/db";
import { findMajor } from "../../lib/majors";
import { parseCourseList } from "../../lib/planner";

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const majorCode = String(form.get("majorCode") ?? "");
  if (!findMajor(majorCode)) {
    return redirect("/", 303);
  }
  const completed = parseCourseList(String(form.get("completed") ?? ""));
  const inProgress = parseCourseList(String(form.get("inProgress") ?? ""));
  const plan = createPlan(majorCode, completed, inProgress);
  return redirect(`/plans/${plan.id}`, 303);
};
