"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Bot, FileText, GraduationCap, LockKeyhole, MessageCircle, Plus, Send, Sparkles, Sprout, Trash2 } from "lucide-react";
import { useCitizen } from "@/components/providers";
import { ProgramDetail } from "@/components/program-card";
import { demoProfile, programs } from "@/lib/programs";
import { answerQuestion } from "@/lib/chat";
import { matchProgram } from "@/lib/engine";
import type { Match } from "@/lib/types";

interface Message { id: number; role: "assistant" | "user"; text: string; programIds?: string[] }
const greeting: Message = { id: 0, role: "assistant", text: "Hi there! A little guidance can make a big difference.\n\nI'm your SchemeReady AI assistant. Ask me about scholarships, farm support, documents, or your next step. What possibility can we explore together?" };
const suggestions = [{ icon: GraduationCap, text: "What scholarships can I apply for?" }, { icon: Sprout, text: "What farmer subsidies are available?" }, { icon: FileText, text: "What documents do I need?" }, { icon: ArrowUpRight, text: "How do I apply?" }];

export default function Assistant() {
  const { profile, language, notify } = useCitizen();
  const citizen = profile || demoProfile;
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [detail, setDetail] = useState<Match | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sequence = useRef(0);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }); }, [messages, typing]);
  const send = (question: string) => {
    if (!question.trim() || typing) return;
    if (/\b\d{12}\b|\botp\b|password|aadhaar number/i.test(question)) { notify("Please don't enter identity numbers, passwords or OTPs. Ask a general program question instead."); return; }
    const clean = question.trim().slice(0, 1000);
    setMessages(previous => [...previous.slice(-38), { id: ++sequence.current, role: "user", text: clean }]);
    setInput("");
    setTyping(true);
    timer.current = setTimeout(() => {
      const answer = answerQuestion(clean, citizen, language);
      setMessages(previous => [...previous, { id: ++sequence.current, role: "assistant", ...answer }]);
      setTyping(false);
    }, 650);
  };
  const submit = (event: FormEvent) => { event.preventDefault(); send(input); };
  const reset = () => { if (timer.current) clearTimeout(timer.current); setTyping(false); setMessages([greeting]); setInput(""); };
  return <><div className="page-heading"><div><span className="eyebrow">A FRIENDLY VOICE ALONG THE WAY</span><h1>A question? Let&apos;s figure it out.</h1><p>Your smart companion for a clearer next step.</p></div><button className="button secondary small" onClick={reset}><Plus size={16} />New conversation</button></div><div className="chat-layout"><section className="chat-panel" aria-label="SchemeReady AI assistant"><header className="chat-header"><span className="chat-bot-icon"><Sparkles size={21} /></span><div><h2>Citizen companion</h2><span><i />Here to help you explore</span></div><span className="badge">MOCK AI</span></header><div className="chat-messages" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions">{messages.map(message => <div className={`chat-message ${message.role}`} key={message.id}><span className="message-avatar">{message.role === "assistant" ? <Sparkles size={16} /> : citizen.name.charAt(0)}</span><div><span className="message-author">{message.role === "assistant" ? "Your companion" : citizen.name}</span><div className="message-bubble">{message.text}{message.programIds && message.programIds.length > 0 && <div className="chat-program-links">{message.programIds.map(id => { const program = programs.find(item => item.id === id); return program && <button key={id} onClick={() => setDetail(matchProgram(citizen, program))}><GraduationCap size={15} /><span>{program.name}</span><ArrowUpRight size={15} /></button>; })}</div>}</div></div></div>)}{typing && <div className="typing-indicator" role="status"><Sparkles size={16} /><span /><span /><span /><span className="sr-only">Preparing a sample answer</span></div>}<div ref={end} /></div><div className="chat-composer"><form onSubmit={submit}><input placeholder="Ask a question. We're here for it." aria-label="Your question" value={input} maxLength={1000} onChange={event => setInput(event.target.value)} /><button className="send-button" type="submit" aria-label="Send message" disabled={!input.trim() || typing}><Send size={18} /></button></form><span><LockKeyhole size={10} />No personal documents, identity numbers, or OTPs. Responses use sample rules.</span></div></section><aside className="chat-aside"><span className="feature-icon"><MessageCircle size={23} /></span><h2>A good place to start.</h2><p>No question is too small. Here are a few things we can explore.</p><div className="chat-suggestions">{suggestions.map(suggestion => <button key={suggestion.text} disabled={typing} onClick={() => send(suggestion.text)}><suggestion.icon size={18} /><span>{suggestion.text}</span><ArrowUpRight size={14} /></button>)}</div><div className="chat-context"><span className="eyebrow">A LITTLE CONTEXT</span><p>I&apos;m using {citizen.name}&apos;s {profile ? "saved" : "demo"} profile to find relevant suggestions.</p><Link className="text-link" href="/onboarding">Update your profile<ArrowRight size={14} /></Link></div><div className="notice">A helpful guide, not an official advisor. This assistant uses scripted responses, not a live language model. Navigation has sample translations; program data and detailed guidance are primarily in English.</div></aside></div>{detail && <ProgramDetail match={detail} onClose={() => setDetail(null)} />}</>;
}