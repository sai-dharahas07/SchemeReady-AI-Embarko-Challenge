import { recommend } from "./engine";
import type { Language, Profile } from "./types";

export interface Answer { text: string; programIds?: string[] }

export function answerQuestion(question: string, profile: Profile, language: Language): Answer {
  const matches = recommend(profile);
  const query = question.toLowerCase();
  if (/\b\d{12}\b|\botp\b|password|aadhaar number/.test(query)) return { text: "Please don't share identity numbers, passwords or OTPs. This demo does not need sensitive information. If you've shared a real secret, remove it from this device and secure the affected account." };
  const prefix = language === "hi" ? "यह एक नमूना सुझाव है। आधिकारिक पोर्टल पर पात्रता की पुष्टि करें।\n\n" : language === "te" ? "ఇది నమూనా సూచన. అధికారిక పోర్టల్‌లో అర్హతను నిర్ధారించండి.\n\n" : "";
  if (/scholar|student|college|education|छात्र|విద్య/.test(query)) {
    const education = matches.filter(match => match.program.category === "Education").slice(0, 3);
    return { text: prefix + (education.length ? `Based on ${profile.name}'s profile, these education programs are worth checking.\n\n1. Confirm your institution and course are covered.\n2. Check any category, merit and income conditions.\n3. Prepare enrollment proof, marksheets, income certificate and bank details.\n\nThese are sample matches, not scholarship awards. Open a program for its checklist and official discovery link.` : "I didn't find an education match for the current sample profile. If you're beginning a course, update your student status and education level first. You can also explore all Education programs to check the full criteria."), programIds: education.map(match => match.program.id) };
  }
  if (/farm|crop|agri|subsid|किसान|రైతు/.test(query)) {
    const farming = matches.filter(match => match.program.category === "Agriculture").slice(0, 3);
    return { text: prefix + (farming.length ? "These farm programs match your basic profile. PM-KISAN supports eligible landholding farmer families, while crop insurance and equipment assistance have crop, land and state-specific rules.\n\nPrepare land or cultivation records, identity proof and bank details. Check the current enrollment window and exclusions on the official portal. Insurance coverage and loans are not cash income." : "Agricultural support includes PM-KISAN, PM Fasal Bima Yojana and PM-KUSUM. Your current profile doesn't identify you as a farmer, so I haven't presented these as personal matches.\n\nIf agriculture is part of your livelihood, update your farmer status in your profile. Then check landholding, crop, state and other official conditions."), programIds: farming.map(match => match.program.id) };
  }
  if (/document|certificate|paper|दस्तावेज|పత్ర/.test(query)) return { text: prefix + "A useful starting checklist is:\n\n• Valid identity proof\n• Address / residency proof\n• Bank account details\n• Income certificate, where applicable\n• Enrollment certificate and marksheets for students\n• Land or cultivation records for farmers\n• Disability certificate when relevant\n\nThe exact list depends on the program. Save a program and open My action plan for a combined checklist. No uploads are needed here; use only verified official portals for documents." };
  if (/apply|application|how do|आवेदन|దరఖాస్తు/.test(query)) return { text: prefix + "Here's a simple path forward:\n\n1. Open a program and read its eligibility conditions.\n2. Save it to add it to your action plan.\n3. Collect the required documents and check them off.\n4. Use “Find on official portal” to search the official myScheme website.\n5. Follow the verified program's application link and confirm the current deadline.\n6. After you apply, mark it submitted in your local tracker.\n\nThis app does not submit applications, collect fees or guarantee approval." };
  if (/retire|senior|pension/.test(query)) {
    const seniors = matches.filter(match => match.program.category === "Senior Citizens").slice(0, 3);
    return { text: prefix + (seniors.length ? "These senior-focused programs match your sample profile. Age, household conditions, savings requirements and state rules may apply. Open each program to review the next steps. Pension income is not guaranteed by this demo." : "Senior support can include old-age pensions, assisted living devices, senior savings options and Elderline 14567. Most senior programs start at age 60, but rules vary. Update your age and status if your circumstances have changed."), programIds: seniors.map(match => match.program.id) };
  }
  return { text: prefix + `Hi ${profile.name}! I can help you explore scholarships, farmer support, required documents and how to apply.\n\nI use a small set of transparent sample rules, not a live AI or government database. Try “What scholarships can I apply for?” or “What documents do I need?” For an official decision, always check the administering agency.` };
}