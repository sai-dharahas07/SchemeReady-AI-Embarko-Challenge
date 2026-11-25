"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Bookmark, CalendarDays, Check, CheckCheck, ChevronRight, ClipboardCheck, Download, FileCheck2, FileText, Info, LoaderCircle, Printer, Share2, ShieldCheck, Sparkles } from "lucide-react";
import { useCitizen } from "@/components/providers";
import { categoryIcons } from "@/components/ui";
import { demoProfile, programs } from "@/lib/programs";
import { createPlanText, recommend } from "@/lib/engine";

export default function ActionPlan() {
  const { profile, saved, checked, toggleDocument, submitted, toggleSubmitted, notify } = useCitizen();
  const citizen = profile || demoProfile;
  const [downloading, setDownloading] = useState(false);
  const selected = saved.length ? programs.filter(program => saved.includes(program.id)) : recommend(citizen).slice(0, 3).map(match => match.program);
  const documents = [...new Set(selected.flatMap(program => program.documents))];
  const complete = documents.filter(document => checked.includes(document)).length;
  const percent = documents.length ? Math.round(complete / documents.length * 100) : 0;
  const text = () => createPlanText(citizen.name, selected, checked);
  const download = async () => {
    setDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF();
      const content = text().normalize("NFKD").replace(/[^\x20-\x7E\n]/g, "");
      const lines: string[] = pdf.splitTextToSize(content, 175);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      let position = 22;
      for (const line of lines) {
        if (position > 275) { pdf.addPage(); position = 22; }
        pdf.text(line, 18, position);
        position += 6;
      }
      pdf.save("schemeready-ai-action-plan.pdf");
      notify("Your action plan PDF is ready.");
    } catch { notify("PDF download was unavailable. Use Print plan and choose Save as PDF instead."); }
    finally { setDownloading(false); }
  };
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: "My SchemeReady AI action plan", text: text() });
      else { await navigator.clipboard.writeText(text()); notify("Action plan copied. Share it with someone you trust."); }
    } catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) notify("Sharing is unavailable in this browser. Download your plan to share it."); }
  };
  return <div className="action-plan-page"><div className="page-heading"><div><span className="eyebrow">TURN A POSSIBILITY INTO A NEXT STEP</span><h1>Your personal action plan.</h1><p>A little structure. A lot less overwhelm, {citizen.name}.</p></div><div className="plan-tools"><button className="icon-button" onClick={() => window.print()} aria-label="Print plan" title="Print plan"><Printer size={19} /></button><button className="icon-button" onClick={share} aria-label="Share plan" title="Share plan"><Share2 size={19} /></button><button className="button primary small" disabled={downloading} onClick={download}>{downloading ? <LoaderCircle size={16} className="spin" /> : <Download size={16} />}Download PDF</button></div></div><div className="print-heading"><h1>SchemeReady AI</h1><p>{citizen.name}&apos;s personal action plan</p></div>{!saved.length && <div className="plan-demo-note"><Sparkles size={17} /><p>We&apos;ve started with your top three matches. <Link href="/programs">Save programs</Link> to make this plan your own.</p></div>}<div className="plan-summary"><span className="plan-summary-icon"><ClipboardCheck size={28} /></span><div><span className="eyebrow">READY WHEN YOU ARE</span><h2>{complete} of {documents.length} documents prepared</h2><p>For {selected.length} {selected.length === 1 ? "program" : "programs"}. Your progress is automatically saved on this device.</p></div><div className="plan-percentage"><strong>{percent}%</strong><div className="progress-track"><span style={{ width: `${percent}%` }} /></div></div></div><div className="plan-grid"><section className="plan-documents"><div className="panel-heading"><div><h2>First, gather your documents.</h2><p>Check what you have. No uploads needed.</p></div><FileCheck2 size={22} /></div><div className="document-list">{documents.map((document, index) => <label key={document} className={checked.includes(document) ? "checked" : ""}><input type="checkbox" checked={checked.includes(document)} onChange={() => toggleDocument(document)} /><span className="document-symbol"><FileText size={20} /></span><div><strong>{document}</strong><small>{document.includes("certificate") ? "Get a current copy from the issuing authority" : document.includes("Bank") ? "Keep account and branch details ready" : "Keep a clear, valid copy ready"}</small></div><span className="document-status">{checked.includes(document) ? <CheckCheck size={17} /> : `0${index + 1}`}</span></label>)}</div><div className="notice"><ShieldCheck size={15} />Never share OTPs or identity numbers in the assistant. Upload documents only to verified official portals.</div></section><aside className="plan-next"><span className="feature-icon"><Sparkles size={23} /></span><h2>Your next three moves.</h2><ol><li><strong>Verify the full criteria</strong><p>Confirm category, residency, course and household requirements on the official portal.</p></li><li><strong>Check the application window</strong><p>Deadlines vary. No live dates are assumed in this sample plan.</p></li><li><strong>Apply, then track</strong><p>Submit through the official portal. Mark it submitted here to keep your local journey up to date.</p></li></ol><Link href="/assistant" className="text-link">A question along the way?<ArrowRight size={14} /></Link></aside></div><section className="plan-programs"><div className="panel-heading"><div><span className="eyebrow">ONE POSSIBILITY AT A TIME</span><h2>Your program to-do list</h2></div><span className="badge">{submitted.filter(id => selected.some(program => program.id === id)).length} marked submitted</span></div>{selected.map((program, index) => { const Icon = categoryIcons[program.category]; return <article className="plan-program" key={program.id}><span className="plan-program-number">{String(index + 1).padStart(2, "0")}</span><span className="program-category-icon"><Icon size={22} /></span><div className="plan-program-info"><span className="program-category-label">{program.category}</span><h3>{program.name}</h3><p>{program.benefit}</p><span className="plan-window"><CalendarDays size={12} />Deadline: verify on official portal</span></div><div className="plan-program-actions"><a className="text-link" href={program.url} target="_blank" rel="noreferrer">Visit official discovery portal<ArrowUpRight size={15} /></a><label><input type="checkbox" checked={submitted.includes(program.id)} onChange={() => toggleSubmitted(program.id)} />I&apos;ve submitted my application</label></div></article>; })}</section><p className="plan-disclaimer">Independent discovery demo. This is not a government-issued plan or an eligibility decision. Benefits may not be combinable. Final eligibility, required documents, benefit amounts and deadlines are set by the relevant government agency. Submitted status is self-reported and does not send an application.</p></div>;
}