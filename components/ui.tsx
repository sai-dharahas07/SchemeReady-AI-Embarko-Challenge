"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Globe2, Landmark, Menu, Moon, Sun, X, GraduationCap, Sprout, HeartPulse, BriefcaseBusiness, Users, House, HandHeart, Store } from "lucide-react";
import type { Category } from "@/lib/types";
import { useCitizen } from "./providers";

export const categoryIcons: Record<Category, typeof GraduationCap> = {
  Education: GraduationCap, Agriculture: Sprout, "Women & Family": HeartPulse,
  Healthcare: HandHeart, Employment: BriefcaseBusiness, "Senior Citizens": Users,
  Business: Store, Housing: House
};

export function Logo({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className="logo" aria-label="SchemeReady AI home"><span className="logo-mark"><Landmark size={23} strokeWidth={1.8} /></span><span>scheme<span className="logo-accent">ready</span><span className="logo-ai"> AI</span>{!compact && <small>EVERY CITIZEN DESERVES TO KNOW THEIR BENEFITS.</small>}</span></Link>;
}

export function Preferences() {
  const { language, setLanguage, dark, toggleTheme, t } = useCitizen();
  return <div className="preferences"><label className="language-select"><Globe2 size={16} /><span className="sr-only">{t.language}</span><select aria-label={t.language} value={language} onChange={event => setLanguage(event.target.value as typeof language)}><option value="en">English</option><option value="hi">हिन्दी</option><option value="te">తెలుగు</option></select></label><button className="icon-button theme-toggle" onClick={toggleTheme} title={dark ? t.light : t.dark} aria-label={dark ? t.light : t.dark}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button></div>;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { t } = useCitizen();
  return <header className="site-header"><div className="container header-inner"><Logo /><nav className="desktop-nav" aria-label="Main navigation"><Link href="/programs">{t.explore}</Link><Link href="/#how-it-works">{t.how}</Link><Link href="/#stories">{t.stories}</Link></nav><div className="header-actions"><Preferences /><Link href="/onboarding" className="button primary small header-cta">{t.getStarted}<ArrowUpRight size={16} /></Link><button className="icon-button mobile-menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">{open ? <X size={21} /> : <Menu size={21} />}</button></div></div>{open && <nav className="mobile-dropdown" aria-label="Mobile navigation"><Link onClick={() => setOpen(false)} href="/programs">{t.explore}<ArrowRight size={16} /></Link><Link onClick={() => setOpen(false)} href="/#how-it-works">{t.how}</Link><Link onClick={() => setOpen(false)} href="/#stories">{t.stories}</Link><Link href="/onboarding">{t.getStarted}<ArrowRight size={16} /></Link></nav>}</header>;
}

export function Modal({ title, children, onClose, wide = false }: { title: string; children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    element?.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = oldOverflow; element?.close(); previous?.focus(); };
  }, []);
  return <dialog ref={dialog} className={`modal ${wide ? "wide" : ""}`} aria-labelledby="modal-title" onCancel={event => { event.preventDefault(); closeRef.current(); }} onClick={event => { if (event.target === dialog.current) onClose(); }}><div className="modal-inner"><div className="modal-heading"><h2 id="modal-title">{title}</h2><button onClick={onClose} className="icon-button" aria-label="Close dialog"><X size={21} /></button></div>{children}</div></dialog>;
}