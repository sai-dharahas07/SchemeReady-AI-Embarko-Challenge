export type Category = "Education" | "Agriculture" | "Women & Family" | "Healthcare" | "Employment" | "Senior Citizens" | "Business" | "Housing";
export type Language = "en" | "hi" | "te";
export type LifeEvent = "college" | "marriage" | "retirement" | "business";
export type ApplicationStatus = "discovered" | "saved" | "eligibility_checking" | "preparing_documents" | "ready_to_apply" | "submitted" | "awaiting_response" | "received" | "rejected" | "requires_correction";

export interface Profile {
  name: string;
  age: number;
  gender: "Female" | "Male" | "Other" | "Prefer not to say";
  state: string;
  district: string;
  profession: string;
  income: number;
  incomeMin?: number;
  incomeMax?: number | null;
  education: string;
  employment: string;
  student: boolean;
  disability: boolean;
  farmer: boolean;
  senior: boolean;
}

export interface Program {
  id: string;
  name: string;
  category: Category;
  description: string;
  benefit: string;
  annualValue: number;
  ministry: string;
  documents: string[];
  eligibility: string[];
  url: string;
  minAge?: number;
  maxAge?: number;
  maxIncome?: number;
  gender?: Profile["gender"];
  student?: boolean;
  farmer?: boolean;
  senior?: boolean;
  disability?: boolean;
  employment?: string[];
  education?: string[];
  states?: string[];
  events?: LifeEvent[];
  /** Demo records are never treated as verified until an administrator confirms an official notification. */
  verificationStatus?: "demo_unverified" | "pending_review" | "verified" | "expired";
  criteriaComplete?: boolean;
  officialSourceUrl?: string;
  lastVerifiedAt?: string;
  governmentLevel?: "central" | "state" | "ut";
}

export interface Match {
  program: Program;
  status: "likely" | "potential" | "not_met" | "unknown";
  reasons: string[];
  satisfiedConditions: string[];
  missingInformation: string[];
  sourceReferences: string[];
}