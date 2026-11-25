"use client";

import Link from "next/link";
import { ArrowUpRight, ClipboardCheck, ExternalLink, FileText } from "lucide-react";
import { useCitizen } from "@/components/providers";
import { programs } from "@/lib/programs";
import type { ApplicationStatus } from "@/lib/types";

const statusOptions: { value: ApplicationStatus; label: string }[] = [
  { value: "discovered", label: "Discovered" },
  { value: "saved", label: "Saved" },
  { value: "eligibility_checking", label: "Checking eligibility" },
  { value: "preparing_documents", label: "Preparing documents" },
  { value: "ready_to_apply", label: "Ready to apply" },
  { value: "submitted", label: "Submitted" },
  { value: "awaiting_response", label: "Awaiting response" },
  { value: "received", label: "Benefit received" },
  { value: "rejected", label: "Rejected" },
  { value: "requires_correction", label: "Requires correction" },
];

export default function ApplicationsPage() {
  const { saved, submitted, applicationStatuses, setApplicationStatus } = useCitizen();
  const trackedIds = [...new Set([...saved, ...submitted, ...Object.keys(applicationStatuses)])];
  const tracked = trackedIds.map(id => programs.find(program => program.id === id)).filter((program): program is (typeof programs)[number] => Boolean(program));

  return <>
    <div className="page-heading">
      <div><span className="eyebrow">YOUR APPLICATION JOURNEY</span><h1>Keep your next steps moving.</h1><p>Track what you have discovered, prepared and submitted. Statuses are self-reported and stored in this browser.</p></div>
      <Link className="button secondary small" href="/programs">Discover schemes<ArrowUpRight size={15} /></Link>
    </div>
    <div className="tracker-summary">
      <div><strong>{tracked.length}</strong><span>Tracked schemes</span></div>
      <div><strong>{tracked.filter(program => (applicationStatuses[program.id] || (submitted.includes(program.id) ? "submitted" : "saved")) === "submitted").length}</strong><span>Marked submitted</span></div>
      <div><strong>{tracked.filter(program => ["received"].includes(applicationStatuses[program.id])).length}</strong><span>Marked received</span></div>
    </div>
    {tracked.length ? <div className="tracker-list">{tracked.map(program => {
      const current = applicationStatuses[program.id] || (submitted.includes(program.id) ? "submitted" : "saved");
      return <article className="tracker-card" key={program.id}>
        <div className="tracker-card-icon"><FileText size={20} /></div>
        <div className="tracker-card-main"><span className="program-category-label">{program.category} · {program.governmentLevel === "state" ? "State programme" : "Central programme"}</span><h2>{program.name}</h2><p>{program.benefit}</p><span className="tracker-source-note">Catalogue record requires official verification. No government status connection.</span></div>
        <div className="tracker-card-actions"><label htmlFor={`status-${program.id}`}>Your status</label><select id={`status-${program.id}`} value={current} onChange={event => setApplicationStatus(program.id, event.target.value as ApplicationStatus)}>{statusOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select><a href={program.url} target="_blank" rel="noreferrer">Open discovery source <ExternalLink size={13} /></a></div>
      </article>;
    })}</div> : <div className="empty-state"><ClipboardCheck size={36} /><h2>Your tracker starts with one scheme.</h2><p>Save a scheme you want to explore. It will appear here so you can manage your preparation journey.</p><Link className="button primary" href="/programs">Explore schemes</Link></div>}
    <div className="catalog-disclaimer"><ClipboardCheck size={17} /><p>Tracker statuses are managed by you. SchemeReady AI does not submit forms, contact departments or automatically know whether an application has been approved. Do not treat a selected status as a government record.</p></div>
  </>;
}
