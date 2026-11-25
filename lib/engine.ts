import { programs } from "./programs";
import type { LifeEvent, Match, Profile, Program } from "./types";

export function matchProgram(profile: Profile, program: Program, event?: LifeEvent): Match {
  const reasons: string[] = [];
  const satisfiedConditions: string[] = [];
  const missingInformation: string[] = [];
  const check = (value: unknown, condition: (value: unknown) => boolean, label: string, unmet: string) => {
    if (value === undefined || value === null || value === "") {
      missingInformation.push(label);
      return;
    }
    if (condition(value)) satisfiedConditions.push(label);
    else reasons.push(unmet);
  };

  if (program.minAge !== undefined) check(profile.age, value => Number(value) >= program.minAge!, `Age requirement: ${program.minAge}+`, `Minimum age is ${program.minAge}`);
  if (program.maxAge !== undefined) check(profile.age, value => Number(value) <= program.maxAge!, `Age requirement: up to ${program.maxAge}`, `Maximum age is ${program.maxAge}`);
  if (program.maxIncome !== undefined) {
    const threshold = program.maxIncome;
    const label = `Household income up to ₹${threshold.toLocaleString("en-IN")}`;
    if (profile.incomeMin !== undefined) {
      if (profile.incomeMin > threshold) reasons.push("Household income range is above the listed sample threshold");
      else if (profile.incomeMax !== undefined && profile.incomeMax !== null && profile.incomeMax <= threshold) satisfiedConditions.push(label);
      else missingInformation.push("Your selected household-income range overlaps this threshold. Confirm the exact amount before relying on this condition");
    } else {
      check(profile.income, value => Number(value) <= threshold, label, "Household income is above the listed sample threshold");
    }
  }
  if (program.gender) check(profile.gender, value => value === program.gender, `Gender condition: ${program.gender}`, "Gender condition does not match the listed sample rule");
  if (program.student !== undefined) check(profile.student, value => Boolean(value) === program.student, program.student ? "Current student status" : "Not a full-time student", program.student ? "Current student enrolment is required" : "Full-time students are excluded by this sample rule");
  if (program.farmer) check(profile.farmer, value => Boolean(value), "Farmer status", "Farmer status is required by this sample rule");
  if (program.senior) check(profile.age, value => Number(value) >= 60 && profile.senior, "Senior citizen age and status", "Senior citizen age/status requirement is not met");
  if (program.disability) check(profile.disability, value => Boolean(value), "Disability status", "Disability certification may be required; profile does not indicate this status");
  if (program.states) check(profile.state, value => program.states!.includes(String(value)), `Residence: ${program.states.join(" / ")}`, "Selected state does not match the listed state condition");
  if (program.employment) check(profile.employment, value => program.employment!.includes(String(value)), `Employment: ${program.employment.join(" / ")}`, "Employment status does not match the listed sample rule");
  if (program.education) check(profile.education, value => program.education!.includes(String(value)), `Education: ${program.education.join(" / ")}`, "Education level does not match the listed sample rule");

  const eventRelevant = Boolean(event && program.events?.includes(event));
  if (eventRelevant) satisfiedConditions.push(`Relevant life event: ${event}`);
  const rulesAreVerified = program.verificationStatus === "verified" && program.criteriaComplete === true;
  const status: Match["status"] = missingInformation.length > 0
    ? "unknown"
    : reasons.length > 0
      ? rulesAreVerified ? "not_met" : "potential"
      : rulesAreVerified ? "likely" : "potential";

  if (!rulesAreVerified) missingInformation.push(program.verificationStatus === "pending_review" ? "An official source has been identified, but the complete eligibility rules are not yet structured and human-verified" : "No scheme-specific official source has been verified for this demonstration record");
  return {
    program, status, reasons, satisfiedConditions, missingInformation,
    sourceReferences: program.officialSourceUrl ? [program.officialSourceUrl] : [program.url]
  };
}

export function recommend(profile: Profile, event?: LifeEvent): Match[] {
  const priority: Record<Match["status"], number> = { likely: 0, potential: 1, unknown: 2, not_met: 3 };
  return programs.map(program => matchProgram(profile, program, event))
    .filter(match => match.status !== "not_met" && match.reasons.length === 0)
    .sort((first, second) => {
      const eventDifference = event ? Number(second.program.events?.includes(event) ?? false) - Number(first.program.events?.includes(event) ?? false) : 0;
      return eventDifference || priority[first.status] - priority[second.status] || first.program.name.localeCompare(second.program.name);
    });
}

export function readinessPercent(completed: number, total: number) {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((completed / total) * 100)));
}

export const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export function createPlanText(name: string, selected: Program[], checked: string[]) {
  const documents = [...new Set(selected.flatMap(program => program.documents))];
  return [
    `SCHEMEREADY AI - ${name}'s action plan`,
    `Created ${new Date().toLocaleDateString("en-IN")}`,
    "", "YOUR PROGRAMS", ...selected.flatMap((program, index) => [
      `${index + 1}. ${program.name}`, `Benefit: ${program.benefit}`,
      `Next step: Verify eligibility and current application window on myScheme.`,
      `Deadline: Verify on the official portal; no deadline is assumed.`, program.url, ""
    ]),
    "DOCUMENT CHECKLIST", ...documents.map(document => `${checked.includes(document) ? "[x]" : "[ ]"} ${document}`),
    "", "Discovery estimates only. Not a government service. Final eligibility, amounts and deadlines are determined by the administering agency. Some programs cannot be combined."
  ].join("\n");
}