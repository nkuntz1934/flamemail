import { useMemo, useState } from "react";
import { BrowserRouter, Link, Route, Routes, useNavigate } from "react-router-dom";
import { Clock, Mail, Zap } from "lucide-react";
import { About } from "@/client/components/About";
import { AdminLogin } from "@/client/components/AdminLogin";
import { CreateInbox } from "@/client/components/CreateInbox";
import { CreateRelay } from "@/client/components/CreateRelay";
import { ExternalLinkRedirect } from "@/client/components/ExternalLinkRedirect";
import { Header } from "@/client/components/Header";
import { InboxView } from "@/client/components/InboxView";
import { Footer } from "@/client/components/Footer";
import { ToastContainer } from "@/client/components/Toast";
import { loadInboxSessions, storeInboxSession, type InboxSession, type InboxSessionSummary } from "@/client/lib/api";

function HomePage({
  sessions,
  onCreated,
}: {
  sessions: InboxSessionSummary[];
  onCreated: (session: InboxSession) => void;
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"inbox" | "relay">("inbox");

  const handleCreated = (session: InboxSession) => {
    onCreated(session);
    navigate(`/inbox/${encodeURIComponent(session.address)}`);
  };

  return (
    <main className="animate-slide-up pt-2">
      <div className="grid gap-6 lg:grid-cols-[minmax(280px,440px)_minmax(0,1fr)]">
        <div>
          <div className="mb-3 flex rounded-lg border border-zinc-800/60 bg-zinc-900/50 p-0.5">
            <button
              type="button"
              onClick={() => setActiveTab("inbox")}
              className={[
                "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                activeTab === "inbox"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300",
              ].join(" ")}
            >
              <Mail className="h-3.5 w-3.5" />
              Inbox
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("relay")}
              className={[
                "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                activeTab === "relay"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300",
              ].join(" ")}
            >
              <Zap className="h-3.5 w-3.5" />
              Relay
            </button>
          </div>

          {activeTab === "inbox" ? (
            <CreateInbox onCreated={handleCreated} />
          ) : (
            <CreateRelay onCreated={handleCreated} />
          )}
        </div>

        <section className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Recent inboxes</h2>

          {sessions.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500">
              No inboxes yet. Created addresses are saved on this device and expire automatically.
            </p>
          ) : (
            <div className="mt-3 space-y-1">
              {sessions.map((session) => {
                const expires = new Date(session.expiresAt);
                const remaining = expires.getTime() - Date.now();
                const alive = remaining > 0;

                return (
                  <Link
                    key={session.address}
                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-zinc-800/50"
                    to={`/inbox/${encodeURIComponent(session.address)}`}
                  >
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                      alive ? "bg-blue-600/10 text-blue-400" : "bg-zinc-800 text-zinc-600"
                    }`}>
                      <Mail className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <strong className="block truncate text-sm font-medium text-zinc-300 group-hover:text-zinc-100">
                        {session.address}
                      </strong>
                      <span className="flex items-center gap-1 text-xs text-zinc-500">
                        <Clock className="h-3 w-3" />
                        {alive ? `expires ${expires.toLocaleString()}` : "expired"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function AppShell() {
  const [sessions, setSessions] = useState<InboxSessionSummary[]>(() => loadInboxSessions());
  const sessionCount = useMemo(() => sessions.length, [sessions]);

  const handleCreated = (session: InboxSession) => {
    setSessions(storeInboxSession(session));
  };

  const handleDeleted = (_address: string) => {
    setSessions(loadInboxSessions());
  };

  return (
    <div className="relative z-10 min-h-screen">
      <Header sessionCount={sessionCount} />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Routes>
          <Route path="/" element={<HomePage sessions={sessions} onCreated={handleCreated} />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/link" element={<ExternalLinkRedirect />} />
          <Route path="/inbox/:address" element={<InboxView onDeleted={handleDeleted} />} />
        </Routes>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
