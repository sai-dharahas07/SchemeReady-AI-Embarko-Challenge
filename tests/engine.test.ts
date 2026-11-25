import { test } from "node:test";
import assert from "node:assert/strict";
import { demoProfile, programs } from "../lib/programs";
import { matchProgram, readinessPercent, recommend } from "../lib/engine";

test("catalog contains unique demonstration records with myScheme discovery search links", () => {
  assert.ok(programs.length >= 50);
  assert.equal(new Set(programs.map(program => program.id)).size, programs.length);
  assert.ok(programs.every(program => new URL(program.url).hostname === "www.myscheme.gov.in"));
});

test("student profile receives scholarships but no farmer or pension matches", () => {
  const matches = recommend(demoProfile);
  assert.ok(matches.some(match => match.program.id === "pragati"));
  assert.ok(!matches.some(match => match.program.farmer || match.program.senior));
  assert.ok(matches.every(match => ["likely", "potential", "unknown"].includes(match.status)));
});

test("income, gender, state and student exclusions are enforced", () => {
  const pragati = programs.find(program => program.id === "pragati")!;
  assert.equal(matchProgram({ ...demoProfile, gender: "Male" }, pragati).status, "potential");
  assert.equal(matchProgram({ ...demoProfile, gender: "Male" }, { ...pragati, verificationStatus: "verified", criteriaComplete: true }).status, "not_met");
  assert.equal(matchProgram({ ...demoProfile, income: 900000 }, pragati).status, "potential");
  assert.equal(matchProgram({ ...demoProfile, income: 900000 }, { ...pragati, verificationStatus: "verified", criteriaComplete: true }).status, "not_met");
  const stateProgram = programs.find(program => program.id === "ap-vidya")!;
  assert.equal(matchProgram(demoProfile, stateProgram).status, "potential");
  const internship = programs.find(program => program.id === "pm-internship")!;
  assert.equal(matchProgram(demoProfile, internship).status, "potential");
});

test("farmer and retirement profiles change matches, college event prioritizes education", () => {
  const farmer = recommend({ ...demoProfile, age: 65, farmer: true, senior: true, student: false, employment: "Self-employed" });
  assert.ok(farmer.some(match => match.program.id === "pm-kisan"));
  assert.ok(farmer.some(match => match.program.id === "senior-savings"));
  assert.equal(recommend(demoProfile, "college")[0].program.events?.includes("college"), true);
});

test("readiness is strictly document checklist completeness", () => {
  assert.equal(readinessPercent(0, 0), 0);
  assert.equal(readinessPercent(2, 4), 50);
  assert.equal(readinessPercent(4, 4), 100);
  assert.equal(readinessPercent(5, 4), 100);
});

test("unverified catalogue entries can never be labelled likely eligible", () => {
  const result = matchProgram(demoProfile, programs.find(program => program.id === "pragati")!);
  assert.equal(result.status, "potential");
  assert.ok(result.missingInformation.some(item => item.includes("No scheme-specific official source")));
});

test("income ranges avoid false exclusion when a threshold falls inside the selected band", () => {
  const postMatric = programs.find(program => program.id === "post-matric")!;
  const overlaps = matchProgram({ ...demoProfile, income: 250000, incomeMin: 200001, incomeMax: 300000 }, postMatric);
  assert.equal(overlaps.status, "unknown");
  assert.ok(overlaps.missingInformation.some(item => item.includes("overlaps this threshold")));
  const pragati = programs.find(program => program.id === "pragati")!;
  const above = matchProgram({ ...demoProfile, income: 900000, incomeMin: 800001, incomeMax: null }, { ...pragati, verificationStatus: "verified", criteriaComplete: true });
  assert.equal(above.status, "not_met");
});


test("a likely-eligible result requires a verified complete rule set", () => {
  const program = programs.find(item => item.id === "pragati")!;
  const verified = { ...program, verificationStatus: "verified" as const, criteriaComplete: true };
  assert.equal(matchProgram(demoProfile, verified).status, "likely");
  const incompleteProfile = { ...demoProfile, gender: undefined } as unknown as typeof demoProfile;
  assert.equal(matchProgram(incompleteProfile, verified).status, "unknown");
});


test("official source candidates stay pending review until an administrator verifies the complete rule set", () => {
  const pmKisan = programs.find(program => program.id === "pm-kisan")!;
  assert.equal(pmKisan.verificationStatus, "pending_review");
  assert.ok(pmKisan.officialSourceUrl?.startsWith("https://pmkisan.gov.in/"));
  const result = matchProgram({ ...demoProfile, farmer: true }, pmKisan);
  assert.equal(result.status, "potential");
  assert.ok(result.missingInformation.some(item => item.includes("official source has been identified")));
});
