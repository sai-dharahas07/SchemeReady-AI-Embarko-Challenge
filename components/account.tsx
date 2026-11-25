"use client";

import { FormEvent, useState } from "react";
import { Cloud, LogOut, Mail, Trash2 } from "lucide-react";
import { useCitizen } from "./providers";

export function AccountPanel() {
  const { cloudEnabled, user, signIn, signOut, deleteCloud, syncStatus, notify } = useCitizen();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  if (!cloudEnabled) return <div className="notice"><Cloud size={14} /> Guest mode: your data stays in this browser. Account sync turns on when Supabase is configured.</div>;
  if (user) return <div className="notice"><p>Signed in as <strong>{user.email}</strong>. {syncStatus}</p><div className="modal-actions"><button className="button secondary small" onClick={() => void signOut()}><LogOut size={15} />Sign out</button><button className="button secondary small" onClick={() => void deleteCloud()}><Trash2 size={15} />Delete cloud copy</button></div></div>;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    const error = await signIn(email.trim());
    setBusy(false);
    notify(error ? `Could not send the link: ${error}` : "Check your email for a sign-in link.");
  };
  return <form className="field" onSubmit={submit}><span>Optional: sign in to save your progress to your account</span><input className="input" type="email" required placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} aria-label="Email address" /><button className="button primary small" disabled={busy}><Mail size={15} />{busy ? "Sending..." : "Email me a sign-in link"}</button></form>;
}
