"use client";

import { FormEvent, useDeferredValue, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bookmark, ListFilter, Search, ShieldCheck, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useCitizen } from "./providers";
import { ProgramCard } from "./program-card";
import { categoryIcons } from "./ui";
import { categories, demoProfile, programs } from "@/lib/programs";
import { matchProgram } from "@/lib/engine";

export default function ProgramBrowser({ savedOnly = false }: { savedOnly?: boolean }) {
  const params = useSearchParams();
  const { profile, saved, addSearch, t } = useCitizen();
  const [query, setQuery] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "All");
  const [matched, setMatched] = useState(false);
  const [sort, setSort] = useState("fit");
  const deferredQuery = useDeferredValue(query);
  useEffect(() => { setQuery(params.get("q") || ""); setCategory(params.get("category") || "All"); }, [params]);
  const citizen = profile || demoProfile;
  const results = programs.map(program => matchProgram(citizen, program))
    .filter(match => (!savedOnly || saved.includes(match.program.id)) && (category === "All" || match.program.category === category) && (!matched || match.status !== "not_met") && `${match.program.name} ${match.program.description} ${match.program.category} ${match.program.eligibility.join(" ")}`.toLowerCase().includes(deferredQuery.toLowerCase().trim()))
    .sort((first, second) => sort === "name" ? first.program.name.localeCompare(second.program.name) : sort === "benefit" ? second.program.annualValue - first.program.annualValue : ({ likely: 0, potential: 1, unknown: 2, not_met: 3 }[first.status] - { likely: 0, potential: 1, unknown: 2, not_met: 3 }[second.status]));
  const submit = (event: FormEvent) => { event.preventDefault(); addSearch(query); };
  return <><div className="page-heading"><div><span className="eyebrow">{savedOnly ? "POSSIBILITIES YOU WANT TO KEEP" : "GOOD THINGS ARE OUT THERE"}</span><h1>{savedOnly ? t.saved : "Find your next opportunity."}</h1><p>{savedOnly ? "A little collection of possibilities. A clearer path forward." : `Explore ${programs.length} demonstration catalogue records across citizen support categories. Verify each record with the responsible department before relying on it.`}</p></div>{savedOnly && <Link className="button primary small" href="/action-plan">Build my action plan<Sparkles size={15} /></Link>}</div><div className="program-browser-controls"><form className="program-search" onSubmit={submit}><Search size={19} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder={t.search} aria-label="Search programs by name or keyword" />{query && <button className="icon-button" type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={16} /></button>}<button type="submit" className="button primary small">Search</button></form><div className="filter-categories" role="group" aria-label="Program categories"><button className={category === "All" ? "active" : ""} aria-pressed={category === "All"} onClick={() => setCategory("All")}>All programs<span>{savedOnly ? saved.length : programs.length}</span></button>{categories.map(item => { const Icon = categoryIcons[item]; return <button className={category === item ? "active" : ""} aria-pressed={category === item} key={item} onClick={() => setCategory(item)}><Icon size={14} />{item}</button>; })}</div></div><div className="results-heading"><span><strong>{results.length}</strong> {results.length === 1 ? "possibility" : "possibilities"} {query ? `for “${query}”` : "to explore"}</span><div><label className="matched-toggle"><input type="checkbox" checked={matched} onChange={event => setMatched(event.target.checked)} /><span>Hide known mismatches</span></label><label className="sort-select"><SlidersHorizontal size={14} /><span className="sr-only">Sort programs</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="fit">Potential matches first</option><option value="benefit">Indicative amount</option><option value="name">Program name</option></select></label></div></div>{results.length ? <div className="program-results-grid">{results.map(match => <ProgramCard key={match.program.id} match={match} />)}</div> : <div className="empty-state">{savedOnly ? <Bookmark size={38} /> : <Search size={38} />}<h2>{savedOnly && !saved.length ? "Your next chapter is waiting." : "No programs found. Let's try a different path."}</h2><p>{savedOnly && !saved.length ? "Save a program using its bookmark. It will be right here when you're ready." : "Try another keyword or clear your filters to explore more possibilities."}</p>{savedOnly && !saved.length ? <Link className="button primary" href="/programs">Explore programs</Link> : <button className="button secondary" onClick={() => { setQuery(""); setCategory("All"); setMatched(false); }}>Clear all filters</button>}</div>}<div className="catalog-disclaimer"><ShieldCheck size={17} /><p>A helpful starting point, not an official decision. This catalog uses sample criteria and indicative amounts. Check all eligibility conditions, current availability and deadlines on the official portal.</p></div></>;
}