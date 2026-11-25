"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Bookmark, CalendarHeart, Check, ClipboardCheck, GraduationCap, Heart, Lightbulb, MapPin, Rocket, Search, ShieldCheck, Sparkles, Sprout, UserRound } from "lucide-react";
import { useCitizen } from "@/components/providers";
import { ProgramCard } from "@/components/program-card";
import { demoProfile } from "@/lib/programs";
import { money, readinessPercent, recommend } from "@/lib/engine";
import type { LifeEvent } from "@/lib/types";

export default function Dashboard() {
  const { profile, saved, checked, searches, submitted, t } = useCitizen();
  const citizen = profile || demoProfile;
  const [event, setEvent] = useState<LifeEvent | undefined>();
  const matches = recommend(citizen, event);
  const selected = matches.filter(match => saved.includes(match.program.id));
  const planPrograms = selected.length ? selected : matches.slice(0, 3);
  const documents = [...new Set(planPrograms.flatMap(match => match.program.documents))];
  const complete = documents.filter(document => checked.includes(document)).length;
  const progress = documents.length ? Math.round(complete / documents.length * 100) : 0;
  const score = readinessPercent(complete, documents.length);
  const incomeLabel = citizen.incomeMin !== undefined ? (citizen.incomeMax === null ? `Above ${money(citizen.incomeMin)}` : `${money(citizen.incomeMin)}–${money(citizen.incomeMax ?? citizen.incomeMin)}`) : money(citizen.income);
  const overlooked = matches.find(match => !saved.includes(match.program.id) && match.program.category !== matches[0]?.program.category);
  const events = [{ id: "college" as const, label: "Starting college", icon: GraduationCap }, { id: "marriage" as const, label: "Getting married", icon: Heart }, { id: "retirement" as const, label: "Retiring", icon: Sprout }, { id: "business" as const, label: "Starting a business", icon: Rocket }];
  return <>
    <div className="page-heading"><div><span className="eyebrow">YOUR POSSIBILITIES, IN ONE PLACE</span><h1>{t.welcome}, {citizen.name}<span className="greeting-sun">✳</span></h1><p>{t.greeting}</p></div><Link href="/onboarding" className="button secondary small"><UserRound size={15} />Update profile</Link></div>
    <motion.section className="benefit-hero" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="benefit-hero-copy">
        <span className="benefit-eyebrow"><Sparkles size={14} />YOUR NEXT BEST STEP</span>
        <h2>Turn a possible match<br />into a prepared application.</h2>
        <p>SchemeReady AI helps you understand known criteria, identify missing proof and organise what to do next.</p>
        <strong className="forecast-amount">{matches.length}<span>potential opportunities to review</span></strong>
        <Link href="/action-plan">Open my preparation plan<ArrowUpRight size={16} /></Link>
      </div>
      <div className="benefit-chart">
        <div className="chart-caption"><span>YOUR BENEFIT JOURNEY</span><span>Citizen-managed progress</span></div>
        <div className="journey-track">
          {[{ title: "Discover", done: true }, { title: "Check", done: matches.length > 0 }, { title: "Prepare", done: progress > 0 }, { title: "Apply", done: submitted.length > 0 }].map((item, index) => <div className={item.done ? "done" : ""} key={item.title}><span>{item.done ? <Check size={15} /> : index + 1}</span><strong>{item.title}</strong><small>{[`${matches.length} to review`, "Review conditions", `${complete} documents ready`, `${submitted.length} marked submitted`][index]}</small></div>)}
        </div>
        <div className="chart-footnote"><ShieldCheck size={12} />Preparation progress is not an approval prediction. Application status is user-managed.</div>
      </div>
    </motion.section>
    <div className="metrics-grid">{[{ title: "Potential schemes", value: matches.length, icon: Sparkles, detail: "No known conflicts in demo rules", tone: "blue" }, { title: "Verified likely matches", value: matches.filter(match => match.status === "likely").length, icon: ShieldCheck, detail: "Requires complete verified rules", tone: "teal" }, { title: "Checklist progress", value: `${progress}%`, icon: ClipboardCheck, detail: `${complete} of ${documents.length} documents ready`, tone: "amber" }, { title: "Saved programs", value: saved.length, icon: Bookmark, detail: "Your next steps, bookmarked", tone: "rose" }].map(metric => <div className="metric" key={metric.title}><span className={`metric-icon ${metric.tone}`}><metric.icon size={17} /></span><span>{metric.title}</span><strong>{metric.value}</strong><small>{metric.detail}</small></div>)}</div>
    <div className="dashboard-grid"><div className="dashboard-primary"><section><div className="panel-heading"><div><span className="eyebrow">CURATED AROUND YOUR LIFE</span><h2>{t.recommended}</h2></div><Link href="/programs" className="text-link">View all<ArrowRight size={14} /></Link></div><div className="dashboard-programs">{matches.slice(0, 4).map(match => <ProgramCard key={match.program.id} match={match} compact />)}</div>{!matches.length && <div className="empty-state"><Search size={30} /><h3>No sample matches yet</h3><p>Try exploring all programs and checking the official criteria.</p><Link className="button primary" href="/programs">Explore programs</Link></div>}</section>
      <section className="life-event-section"><div className="panel-heading"><div><span className="eyebrow">LIFE CHANGES. YOUR SUPPORT CAN TOO.</span><h2>Your next chapter?</h2></div><CalendarHeart size={22} className="muted" /></div><p>Choose a life event to bring relevant opportunities to the top.</p><div className="life-events" role="group" aria-label="Life event priority">{events.map(item => <button key={item.id} aria-pressed={event === item.id} className={event === item.id ? "active" : ""} onClick={() => setEvent(event === item.id ? undefined : item.id)}><item.icon size={18} /><span>{item.label}</span>{event === item.id && <Check size={13} />}</button>)}</div>{event && <div className="life-event-result" role="status"><Sparkles size={15} />{matches.filter(match => match.program.events?.includes(event)).length} relevant programs prioritized above. Update your profile if your circumstances have changed.</div>}</section>
      <section className="journey-section"><div className="panel-heading"><div><span className="eyebrow">ONE STEP CLOSER</span><h2>Your benefit preparation journey</h2></div><Link href="/action-plan" className="text-link">My plan<ArrowRight size={14} /></Link></div><div className="journey-track">{[{ title: "Discover", text: `${matches.length} potential matches`, done: true }, { title: "Save", text: `${saved.length} programs saved`, done: saved.length > 0 }, { title: "Prepare", text: `${complete} documents ready`, done: progress === 100 }, { title: "Apply", text: `${submitted.length} marked submitted`, done: submitted.length > 0 }].map((item, index) => <div className={item.done ? "done" : ""} key={item.title}><span>{item.done ? <Check size={15} /> : index + 1}</span><strong>{item.title}</strong><small>{item.text}</small></div>)}</div><p className="journey-note">This tracker is stored in your browser. SchemeReady AI does not submit applications or receive government status updates.</p></section>
    </div><aside className="dashboard-secondary"><section className="side-panel opportunity-panel"><div className="panel-mini-heading"><h2>Document checklist completeness</h2><Sparkles size={16} /></div><div className="score-ring" style={{ background: `conic-gradient(var(--teal) ${score * 3.6}deg, var(--line) 0deg)` }} role="img" aria-label={`Document preparation completeness ${score} percent`}><div><strong>{score}<span>/100</span></strong><small>{score === 100 ? "Checklist complete" : "Keep preparing"}</small></div></div><p>Based only on checklist items marked ready. It does not measure eligibility or government approval.</p><Link href="/action-plan" className="text-link">Take your next step<ArrowRight size={14} /></Link></section>
      {overlooked && <section className="missed-panel"><span className="missed-icon"><Lightbulb size={20} /></span><span className="eyebrow">A POSSIBILITY YOU MIGHT MISS</span><h3>{overlooked.program.name}</h3><p>You haven&apos;t saved this one yet. There may be useful support beyond your top category.</p><Link href={`/programs?q=${encodeURIComponent(overlooked.program.name)}`} className="text-link">Take a closer look<ArrowUpRight size={14} /></Link></section>}
      <section className="side-panel profile-summary"><div className="panel-mini-heading"><h2>{t.profile}</h2><Link href="/onboarding" className="text-link" aria-label="Edit citizen profile">Edit<ArrowUpRight size={12} /></Link></div><div className="profile-person"><span className="avatar">{citizen.name.charAt(0)}</span><div><strong>{citizen.name}</strong><span>{citizen.age} years · {citizen.profession}</span></div></div><p><MapPin size={13} />{citizen.district}, {citizen.state}</p><div className="profile-tags"><span>{citizen.education}</span>{citizen.student && <span>Student</span>}{citizen.farmer && <span>Farmer</span>}{citizen.senior && <span>Senior</span>}</div><span className="profile-income">Household income <strong>{incomeLabel}/yr</strong></span></section>
      <section className="side-panel recent-searches"><div className="panel-mini-heading"><h2>Recent searches</h2><Search size={15} /></div>{searches.length ? searches.map(query => <Link href={`/programs?q=${encodeURIComponent(query)}`} key={query}><Search size={13} /><span>{query}</span><ArrowUpRight size={13} /></Link>) : <p>Your searches will appear here. What possibility are you looking for?</p>}</section>
    </aside></div>
  </>;
}