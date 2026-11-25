import { Suspense } from "react";
import ProgramBrowser from "@/components/program-browser";

export const metadata = { title: "Saved Programs" };
export default function SavedPage() { return <Suspense fallback={<p role="status">Loading your saved programs...</p>}><ProgramBrowser savedOnly /></Suspense>; }