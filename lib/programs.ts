import type { Category, Profile, Program } from "./types";

type Seed = [string, string, Category, string, string, number, Partial<Program>?];

const seeds: Seed[] = [
  ["post-matric", "Post-Matric Scholarship", "Education", "Support for eligible students continuing their studies after Class 10.", "Up to Rs 20,000 / year", 20000, { student: true, maxIncome: 250000, events: ["college"] }],
  ["central-sector", "Central Sector Scholarship", "Education", "Merit-based support for college and university students from lower-income households.", "Rs 12,000-20,000 / year", 12000, { student: true, maxAge: 25, maxIncome: 450000, education: ["Undergraduate", "Postgraduate"], events: ["college"] }],
  ["pragati", "AICTE Pragati Scholarship", "Education", "Financial assistance for women pursuing an approved technical diploma or degree.", "Up to Rs 50,000 / year", 50000, { gender: "Female", student: true, maxIncome: 800000, education: ["Diploma", "Undergraduate"], events: ["college"] }],
  ["saksham", "AICTE Saksham Scholarship", "Education", "Support for students with benchmark disabilities in technical education.", "Up to Rs 50,000 / year", 50000, { disability: true, student: true, maxIncome: 800000 }],
  ["inspire", "INSPIRE Scholarship", "Education", "Scholarships for meritorious students pursuing basic and natural sciences.", "Up to Rs 80,000 / year", 80000, { student: true, minAge: 17, maxAge: 22, education: ["Undergraduate", "Postgraduate"] }],
  ["nmmss", "National Means-cum-Merit Scholarship", "Education", "Help for meritorious school students to continue secondary education.", "Rs 12,000 / year", 12000, { student: true, minAge: 12, maxAge: 18, maxIncome: 350000, education: ["Secondary"] }],
  ["pm-yasasvi", "PM YASASVI", "Education", "Education support for eligible OBC, EBC and DNT students.", "Award varies by course", 0, { student: true, maxIncome: 250000 }],
  ["vidyalakshmi", "PM Vidyalaxmi", "Education", "Access to education loans for eligible students at quality higher education institutions.", "Education loan assistance", 0, { student: true, minAge: 17, events: ["college"] }],
  ["nats", "National Apprenticeship Training", "Education", "Paid workplace learning for eligible graduates and diploma holders.", "Stipend varies by placement", 0, { minAge: 18, education: ["Diploma", "Undergraduate", "Postgraduate"], employment: ["Unemployed", "Student"] }],
  ["aicte-internship", "AICTE Internship Portal", "Education", "Discover internships and practical experience with registered organizations.", "Internship opportunities", 0, { student: true, minAge: 18 }],
  ["pm-kisan", "PM-KISAN Samman Nidhi", "Agriculture", "Income support for eligible landholding farmer families, subject to exclusions.", "Rs 6,000 / year", 6000, { farmer: true }],
  ["fasal-bima", "PM Fasal Bima Yojana", "Agriculture", "Crop insurance against notified natural risks for participating crops and regions.", "Crop insurance coverage", 0, { farmer: true }],
  ["kisan-credit", "Kisan Credit Card", "Agriculture", "Institutional credit for cultivation and allied agricultural activities.", "Access to farm credit", 0, { farmer: true, minAge: 18 }],
  ["pm-kusum", "PM-KUSUM", "Agriculture", "Assistance for eligible farmers adopting solar pumps and solar energy.", "Solar pump subsidy", 0, { farmer: true }],
  ["smam", "Farm Mechanisation Support", "Agriculture", "Assistance for eligible agricultural machinery under state implementation.", "Equipment subsidy varies", 0, { farmer: true }],
  ["soil-health", "Soil Health Card", "Agriculture", "Soil testing and recommendations to help improve nutrient management.", "Soil assessment support", 0, { farmer: true }],
  ["micro-irrigation", "Per Drop More Crop", "Agriculture", "Support for drip and sprinkler irrigation to improve water efficiency.", "Micro-irrigation assistance", 0, { farmer: true }],
  ["enam", "National Agriculture Market", "Agriculture", "Access to an electronic trading platform connecting agricultural markets.", "Market access", 0, { farmer: true }],
  ["agri-infra", "Agriculture Infrastructure Fund", "Agriculture", "Financing support for eligible post-harvest and community farming projects.", "Interest subvention", 0, { farmer: true, minAge: 18, events: ["business"] }],
  ["natural-farming", "National Mission on Natural Farming", "Agriculture", "Training and support for farmers transitioning to natural farming practices.", "Training and field support", 0, { farmer: true }],
  ["lakhpati-didi", "Lakhpati Didi Initiative", "Women & Family", "Livelihood and skills support through eligible rural self-help groups.", "Livelihood development", 0, { gender: "Female", minAge: 18, events: ["business"] }],
  ["pmmvy", "Pradhan Mantri Matru Vandana Yojana", "Women & Family", "Maternity support for eligible pregnant and lactating women under scheme conditions.", "Conditional maternity benefit", 0, { gender: "Female", minAge: 18, maxAge: 55 }],
  ["ujjwala", "Pradhan Mantri Ujjwala Yojana", "Women & Family", "LPG connection assistance for eligible women from poor households.", "LPG connection assistance", 0, { gender: "Female", minAge: 18, maxIncome: 200000, events: ["marriage"] }],
  ["sukanya", "Sukanya Samriddhi Account", "Women & Family", "A government-backed savings account for an eligible girl child opened by her guardian.", "Tax-advantaged savings", 0, { minAge: 18 }],
  ["one-stop", "Sakhi One Stop Centre", "Women & Family", "Integrated support services for women affected by violence.", "Free support services", 0, { gender: "Female" }],
  ["shg", "DAY-NRLM Self-Help Groups", "Women & Family", "Rural women can access self-help groups, skills and livelihood opportunities.", "Group credit and training", 0, { gender: "Female", minAge: 18, maxIncome: 300000, events: ["business"] }],
  ["ab-pmjay", "Ayushman Bharat PM-JAY", "Healthcare", "Cashless hospital care for eligible households at empanelled hospitals.", "Up to Rs 5 lakh family cover", 0, { maxIncome: 250000 }],
  ["vay-vandana", "Ayushman Vay Vandana", "Healthcare", "Health coverage for citizens aged 70 and above, subject to enrollment rules.", "Up to Rs 5 lakh health cover", 0, { minAge: 70, senior: true }],
  ["janaushadhi", "Pradhan Mantri Janaushadhi", "Healthcare", "Quality generic medicines at affordable prices through Janaushadhi Kendras.", "Lower medicine costs", 0],
  ["nikshay", "Ni-kshay Poshan Yojana", "Healthcare", "Nutritional support for notified tuberculosis patients during treatment.", "Treatment-linked support", 0],
  ["rbs-k", "Rashtriya Bal Swasthya Karyakram", "Healthcare", "Screening and early intervention services for children and adolescents.", "Child health screening", 0, { maxAge: 18 }],
  ["adip", "ADIP Assistance Scheme", "Healthcare", "Assistance with aids and assistive devices for eligible people with disabilities.", "Assistive devices", 0, { disability: true, maxIncome: 360000 }],
  ["pmkvy", "Pradhan Mantri Kaushal Vikas", "Employment", "Industry-relevant skills training and certification through approved providers.", "Skill training and certification", 0, { minAge: 15, maxAge: 45, employment: ["Unemployed", "Student", "Self-employed"] }],
  ["ncs", "National Career Service", "Employment", "Explore verified job listings, career counseling and employment services.", "Career and job support", 0, { minAge: 15 }],
  ["ddugky", "Deen Dayal Upadhyaya Grameen Kaushalya", "Employment", "Placement-linked skill training for eligible rural youth.", "Training and placement support", 0, { minAge: 15, maxAge: 35, maxIncome: 250000, employment: ["Unemployed"] }],
  ["mgnrega", "Mahatma Gandhi NREGA", "Employment", "Demand-based wage employment for adult members of eligible rural households.", "Up to 100 household workdays", 0, { minAge: 18, maxIncome: 300000 }],
  ["eshram", "e-Shram Registration", "Employment", "A national registration platform for eligible unorganised workers.", "Worker registration", 0, { minAge: 16, maxAge: 59, employment: ["Self-employed", "Part-time", "Unemployed"] }],
  ["pm-internship", "Prime Minister Internship Scheme", "Employment", "Internship opportunities for eligible youth under current pilot rules.", "Stipend subject to selection", 0, { minAge: 21, maxAge: 24, student: false, employment: ["Unemployed"], maxIncome: 800000 }],
  ["ign-oaps", "Indira Gandhi National Old Age Pension", "Senior Citizens", "Pension assistance for eligible older citizens in below-poverty-line households.", "Pension varies by age and state", 0, { minAge: 60, senior: true, maxIncome: 120000, events: ["retirement"] }],
  ["atal-pension", "Atal Pension Yojana", "Senior Citizens", "Contributory pension enrollment for eligible workers before age 40.", "Future monthly pension", 0, { minAge: 18, maxAge: 40 }],
  ["senior-savings", "Senior Citizens Savings Scheme", "Senior Citizens", "A government-backed savings option for eligible senior citizens.", "Quarterly interest income", 0, { minAge: 60, senior: true, events: ["retirement"] }],
  ["rashtriya-vayoshri", "Rashtriya Vayoshri Yojana", "Senior Citizens", "Assisted living devices for eligible senior citizens with age-related disabilities.", "Assisted living devices", 0, { minAge: 60, senior: true, maxIncome: 180000, events: ["retirement"] }],
  ["elderline", "Elderline 14567", "Senior Citizens", "Information, guidance and support services for senior citizens.", "Free elder support", 0, { minAge: 60, senior: true, events: ["retirement"] }],
  ["state-travel", "Telangana Senior Travel Concession", "Senior Citizens", "Explore applicable state bus travel concessions for eligible senior citizens.", "Concessional travel; verify route", 0, { minAge: 60, senior: true, states: ["Telangana"] }],
  ["mudra", "Pradhan Mantri MUDRA Yojana", "Business", "Institutional loans for eligible non-corporate, non-farm micro enterprises.", "Micro-enterprise loan", 0, { minAge: 18, events: ["business"] }],
  ["standup", "Stand-Up India", "Business", "Bank loans for eligible women and SC/ST entrepreneurs establishing a greenfield enterprise.", "Business loan assistance", 0, { minAge: 18, events: ["business"] }],
  ["pmegp", "PM Employment Generation Programme", "Business", "Credit-linked subsidy for eligible new micro-enterprises.", "Project subsidy varies", 0, { minAge: 18, events: ["business"] }],
  ["svanidhi", "PM SVANidhi", "Business", "Working capital assistance for eligible urban street vendors.", "Working capital loan", 0, { minAge: 18, employment: ["Self-employed"], events: ["business"] }],
  ["vishwakarma", "PM Vishwakarma", "Business", "Training, toolkit incentives and credit for eligible traditional artisans.", "Toolkit and skills support", 0, { minAge: 18, employment: ["Self-employed"], events: ["business"] }],
  ["startup-india", "Startup India Recognition", "Business", "Recognition and ecosystem access for eligible innovative startups.", "Startup ecosystem benefits", 0, { minAge: 18, events: ["business"] }],
  ["pmay-u", "PM Awas Yojana - Urban 2.0", "Housing", "Housing assistance for eligible urban families that do not own a pucca house.", "Housing assistance varies", 0, { minAge: 18, maxIncome: 900000, events: ["marriage"] }],
  ["pmay-g", "PM Awas Yojana - Gramin", "Housing", "Housing support for eligible rural households identified through official lists.", "Rural housing assistance", 0, { minAge: 18, maxIncome: 250000, events: ["marriage"] }],
  ["surya-ghar", "PM Surya Ghar Muft Bijli Yojana", "Housing", "Rooftop solar assistance for eligible residential electricity consumers.", "Rooftop solar subsidy", 0, { minAge: 18 }],
  ["jal-jeevan", "Jal Jeevan Mission", "Housing", "Rural household tap-water access through local implementation.", "Household water access", 0],
  ["tg-epass", "Telangana ePASS Scholarship", "Education", "Fee reimbursement and maintenance support for eligible Telangana students; category, course, income and other conditions apply.", "Course-based fee support", 0, { student: true, states: ["Telangana"], events: ["college"] }],
  ["ap-vidya", "Andhra Pradesh Post-Matric Support", "Education", "State post-matric education support subject to current government guidelines.", "Course-based education support", 0, { student: true, states: ["Andhra Pradesh"], maxIncome: 250000, events: ["college"] }]
];

const ministries: Record<Category, string> = {
  Education: "Education & skill development", Agriculture: "Agriculture & farmers welfare",
  "Women & Family": "Women & child development", Healthcare: "Health & family welfare",
  Employment: "Labour & employment", "Senior Citizens": "Social justice & empowerment",
  Business: "Enterprise & entrepreneurship", Housing: "Housing & rural development"
};

const officialSourceCandidates: Record<string, string> = {
  "pm-kisan": "https://pmkisan.gov.in/?frmapp=yes",
  "tg-epass": "https://telanganaepass.cgg.gov.in/WhoareEligible.do"
};

export const programs: Program[] = seeds.map(([id, name, category, description, benefit, annualValue, rules]) => {
  const eligibility = [
    ...(rules?.minAge ? [`Age ${rules.minAge} or above`] : []),
    ...(rules?.maxAge ? [`Age ${rules.maxAge} or below`] : []),
    ...(rules?.maxIncome ? [`Annual household income up to Rs ${rules.maxIncome.toLocaleString("en-IN")}`] : []),
    ...(rules?.gender ? [`For ${rules.gender.toLowerCase()} applicants`] : []),
    ...(rules?.student === true ? ["Currently enrolled student"] : []),
    ...(rules?.student === false ? ["Not currently a full-time student"] : []),
    ...(rules?.farmer ? ["Eligible farmer or agricultural household"] : []),
    ...(rules?.disability ? ["Valid disability certification required"] : []),
    ...(rules?.states ? [`Resident of ${rules.states.join(" or ")}`] : []),
    ...(rules?.education ? [`Education: ${rules.education.join(" or ")}`] : []),
    ...(rules?.employment ? [`Employment: ${rules.employment.join(" or ")}`] : []),
    "Additional official conditions and exclusions apply"
  ];
  return {
    id, name, category, description, benefit, annualValue,
    ministry: ministries[category],
    documents: ["Identity proof", "Address proof", "Bank account details", ...(rules?.maxIncome ? ["Income certificate"] : []), ...(rules?.student ? ["Enrollment certificate", "Previous marksheet"] : []), ...(rules?.farmer ? ["Land / cultivation records"] : []), ...(id === "pm-kisan" ? ["Land ownership records in the farmer family name", "eKYC confirmation"] : []), ...(rules?.disability ? ["Disability certificate"] : [])],
    eligibility,
    url: `https://www.myscheme.gov.in/search?keyword=${encodeURIComponent(name)}`,
    officialSourceUrl: officialSourceCandidates[id],
    verificationStatus: officialSourceCandidates[id] ? "pending_review" : "demo_unverified",
    criteriaComplete: false,
    governmentLevel: rules?.states ? "state" : "central",
    ...rules
  };
});

export const categories: Category[] = ["Education", "Agriculture", "Women & Family", "Healthcare", "Employment", "Senior Citizens", "Business", "Housing"];

export const states = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"];

export const demoProfile: Profile = {
  name: "Ananya", age: 21, gender: "Female", state: "Telangana", district: "Hyderabad",
  profession: "Student", income: 180000, education: "Undergraduate", employment: "Student",
  student: true, disability: false, farmer: false, senior: false
};