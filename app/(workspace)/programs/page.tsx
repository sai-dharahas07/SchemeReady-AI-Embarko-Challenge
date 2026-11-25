import { Suspense } from "react";
import ProgramBrowser from "@/components/program-browser";

export const metadata = { title: "Explore Programs" };
export default function ProgramsPage() { return <Suspense fallback={<p role="status">Finding your possibilities...</p>}><ProgramBrowser /></Suspense>; }