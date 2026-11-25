import type { Language } from "./types";

const en = {
  home: "Home", explore: "Explore programs", how: "How it works", stories: "Citizen stories", getStarted: "Get started",
  dashboard: "Overview", saved: "Saved programs", assistant: "AI assistant", plan: "My action plan",
  greeting: "A little support. A bigger future.", search: "Search schemes, scholarships, benefits...",
  recommended: "Recommended for you", profile: "Your profile", allPrograms: "All programs", view: "View program",
  welcome: "Welcome back", matching: "Matched to your possibilities.", save: "Save program", unsave: "Unsave program",
  language: "Language", light: "Switch to light mode", dark: "Switch to dark mode"
};

const hi: typeof en = {
  home: "होम", explore: "योजनाएँ खोजें", how: "यह कैसे काम करता है", stories: "नागरिकों की कहानियाँ", getStarted: "शुरू करें",
  dashboard: "अवलोकन", saved: "सहेजी गई योजनाएँ", assistant: "AI सहायक", plan: "मेरी कार्य योजना",
  greeting: "थोड़ा सहयोग। बेहतर भविष्य।", search: "योजनाएँ, छात्रवृत्ति, लाभ खोजें...",
  recommended: "आपके लिए सुझाव", profile: "आपकी प्रोफ़ाइल", allPrograms: "सभी योजनाएँ", view: "योजना देखें",
  welcome: "वापस स्वागत है", matching: "आपकी संभावनाओं से जुड़ा।", save: "योजना सहेजें", unsave: "योजना हटाएँ",
  language: "भाषा", light: "लाइट मोड", dark: "डार्क मोड"
};

const te: typeof en = {
  home: "హోమ్", explore: "పథకాలను అన్వేషించండి", how: "ఇది ఎలా పనిచేస్తుంది", stories: "పౌరుల కథలు", getStarted: "ప్రారంభించండి",
  dashboard: "అవలోకనం", saved: "సేవ్ చేసిన పథకాలు", assistant: "AI సహాయకుడు", plan: "నా కార్యాచరణ ప్రణాళిక",
  greeting: "చిన్న సహాయం. గొప్ప భవిష్యత్తు.", search: "పథకాలు, స్కాలర్‌షిప్‌లు, ప్రయోజనాలు...",
  recommended: "మీ కోసం సిఫార్సులు", profile: "మీ ప్రొఫైల్", allPrograms: "అన్ని పథకాలు", view: "పథకాన్ని చూడండి",
  welcome: "తిరిగి స్వాగతం", matching: "మీ అవకాశాలకు అనుగుణంగా.", save: "పథకాన్ని సేవ్ చేయండి", unsave: "పథకాన్ని తొలగించండి",
  language: "భాష", light: "లైట్ మోడ్", dark: "డార్క్ మోడ్"
};

export const translations: Record<Language, typeof en> = { en, hi, te };