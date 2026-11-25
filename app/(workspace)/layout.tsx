import AppShell from "@/components/app-shell";
import "../workspace.css";
import "../india-theme.css";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) { return <AppShell>{children}</AppShell>; }
