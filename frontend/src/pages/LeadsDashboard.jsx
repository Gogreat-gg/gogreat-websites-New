import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Users, MessageSquare, Phone, Mail, Building2, LogOut, Download, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";

const STATUSES = ["new", "contacted", "closed"];
const STATUS_STYLE = {
  new: "bg-[#0033FF] text-white",
  contacted: "bg-[#D4AF37] text-[#0A0A0A]",
  closed: "bg-[#E5E5E5] text-[#404040]",
};

const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
};

function downloadCSV(filename, rows) {
  if (!rows.length) {
    toast.error("Nothing to export yet.");
    return;
  }
  const headers = Object.keys(rows[0]);
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const Tab = ({ active, onClick, icon: Icon, label, count, testid }) => (
  <button
    onClick={onClick}
    data-testid={testid}
    className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
      active ? "bg-[#0033FF] text-white" : "border border-[#E5E5E5] bg-white text-[#404040] hover:border-[#0033FF]"
    }`}
  >
    <Icon size={16} /> {label}
    <span className={`rounded-full px-2 py-0.5 text-xs ${active ? "bg-white/20" : "bg-[#F3F5FF] text-[#0033FF]"}`}>{count}</span>
  </button>
);

const StatusPicker = ({ value, onChange, testid }) => (
  <div className="flex items-center gap-1.5" data-testid={testid}>
    {STATUSES.map((s) => (
      <button
        key={s}
        onClick={() => onChange(s)}
        data-testid={`${testid}-${s}`}
        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition-transform hover:-translate-y-0.5 ${
          value === s ? STATUS_STYLE[s] : "border border-[#E5E5E5] bg-white text-[#a3a3a3]"
        }`}
      >
        {s}
      </button>
    ))}
  </div>
);

function LoginGate({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/admin/login", { email, password });
      localStorage.setItem("gg_token", data.token);
      toast.success("Welcome back.");
      onLogin();
    } catch (err) {
      const msg = err.response?.data?.detail || "Login failed. Check your credentials.";
      toast.error(typeof msg === "string" ? msg : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const field =
    "w-full rounded-lg border border-[#E5E5E5] bg-white px-4 py-3 text-[15px] outline-none transition-colors focus:border-[#0033FF] focus:ring-2 focus:ring-[#0033FF]/20";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B132B] px-5">
      <form onSubmit={submit} data-testid="admin-login-form" className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0033FF] text-white">
          <Lock size={22} />
        </span>
        <h1 className="font-display mt-6 text-2xl font-black tracking-tight text-[#0A0A0A]">Leads Dashboard</h1>
        <p className="mt-1 text-sm text-[#404040]">Private area — please sign in.</p>
        <div className="mt-6 space-y-4">
          <input data-testid="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={field} />
          <input data-testid="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className={field} />
        </div>
        <button
          type="submit"
          disabled={loading}
          data-testid="admin-login-submit"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0033FF] px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />} {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default function LeadsDashboard() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("gg_token"));
  const [tab, setTab] = useState("scans");
  const [scans, setScans] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("gg_token")}` } });

  const logout = useCallback(() => {
    localStorage.removeItem("gg_token");
    setAuthed(false);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, c] = await Promise.all([
        api.get("/health-scan", authHeader()),
        api.get("/contact", authHeader()),
      ]);
      setScans(s.data);
      setContacts(c.data);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please sign in again.");
        logout();
      } else {
        toast.error("Could not load leads.");
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  const updateStatus = async (kind, id, status) => {
    const setter = kind === "scan" ? setScans : setContacts;
    setter((list) => list.map((x) => (x.id === id ? { ...x, status } : x)));
    try {
      const path = kind === "scan" ? `/health-scan/${id}` : `/contact/${id}`;
      await api.patch(path, { status }, authHeader());
    } catch (err) {
      if (err.response?.status === 401) logout();
      else toast.error("Could not update status.");
      load();
    }
  };

  const exportScans = () =>
    downloadCSV(
      "gogreat-health-scans.csv",
      scans.map((s) => ({
        Date: fmtDate(s.created_at), Status: s.status, Name: s.name, Business: s.company, Phone: s.phone,
        Turnover: s.turnover, Accounting: s.accounting, Inventory: s.inventory, Staff: s.staff,
        FollowUp: s.followup, Technology: s.technology, Challenge: s.biggest_challenge, Goal: s.future_goal,
      }))
    );

  const exportContacts = () =>
    downloadCSV(
      "gogreat-contacts.csv",
      contacts.map((c) => ({
        Date: fmtDate(c.created_at), Status: c.status, Name: c.name, Phone: c.phone,
        Email: c.email, Business: c.business, Message: c.message,
      }))
    );

  if (!authed) return <LoginGate onLogin={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-12 pb-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-widest text-[#0033FF]">GoGreat · Private</p>
            <h1 className="font-display mt-2 text-3xl font-black tracking-tight text-[#0A0A0A]">Leads Dashboard</h1>
            <p className="mt-1 text-sm text-[#404040]">Every Health Scan and contact enquiry, newest first.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={load}
              data-testid="leads-refresh"
              className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-5 py-2.5 text-sm font-semibold text-[#0A0A0A] transition-colors hover:border-[#0033FF]"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button
              onClick={tab === "scans" ? exportScans : exportContacts}
              data-testid="leads-export"
              className="inline-flex items-center gap-2 rounded-full bg-[#0A0A0A] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              <Download size={16} /> Export CSV
            </button>
            <button
              onClick={logout}
              data-testid="leads-logout"
              className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-5 py-2.5 text-sm font-semibold text-[#404040] transition-colors hover:border-[#0033FF]"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Tab active={tab === "scans"} onClick={() => setTab("scans")} icon={Users} label="Health Scans" count={scans.length} testid="tab-scans" />
          <Tab active={tab === "contacts"} onClick={() => setTab("contacts")} icon={MessageSquare} label="Contacts" count={contacts.length} testid="tab-contacts" />
        </div>

        {loading ? (
          <p className="mt-16 text-center text-[#404040]">Loading leads…</p>
        ) : tab === "scans" ? (
          <div data-testid="scans-list" className="mt-8 grid gap-5">
            {scans.length === 0 && <p className="text-[#404040]">No health scans yet.</p>}
            {scans.map((s) => (
              <div key={s.id} className="rounded-2xl border border-[#E5E5E5] bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#0A0A0A]">{s.name}</h3>
                    <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#404040]">
                      {s.company && <span className="inline-flex items-center gap-1"><Building2 size={14} /> {s.company}</span>}
                      <span className="inline-flex items-center gap-1"><Phone size={14} /> {s.phone}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-[#a3a3a3]">{fmtDate(s.created_at)}</span>
                    <StatusPicker value={s.status} onChange={(v) => updateStatus("scan", s.id, v)} testid={`scan-status-${s.id}`} />
                  </div>
                </div>
                <div className="mt-4 grid gap-3 border-t border-[#E5E5E5] pt-4 text-sm sm:grid-cols-2">
                  {[
                    ["Turnover", s.turnover], ["Accounting", s.accounting], ["Inventory", s.inventory],
                    ["Staff / KPI", s.staff], ["Follow-up", s.followup], ["Technology", s.technology],
                    ["Biggest challenge", s.biggest_challenge], ["6-month goal", s.future_goal],
                  ].filter(([, v]) => (v || "").trim()).map(([k, v]) => (
                    <div key={k}>
                      <p className="font-display text-xs font-semibold uppercase tracking-wide text-[#0033FF]">{k}</p>
                      <p className="mt-0.5 text-[#404040]">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div data-testid="contacts-list" className="mt-8 grid gap-5">
            {contacts.length === 0 && <p className="text-[#404040]">No contact enquiries yet.</p>}
            {contacts.map((c) => (
              <div key={c.id} className="rounded-2xl border border-[#E5E5E5] bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#0A0A0A]">{c.name}</h3>
                    <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#404040]">
                      <span className="inline-flex items-center gap-1"><Phone size={14} /> {c.phone}</span>
                      {c.email && <span className="inline-flex items-center gap-1"><Mail size={14} /> {c.email}</span>}
                      {c.business && <span className="inline-flex items-center gap-1"><Building2 size={14} /> {c.business}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-[#a3a3a3]">{fmtDate(c.created_at)}</span>
                    <StatusPicker value={c.status} onChange={(v) => updateStatus("contact", c.id, v)} testid={`contact-status-${c.id}`} />
                  </div>
                </div>
                {c.message && <p className="mt-4 border-t border-[#E5E5E5] pt-4 text-sm text-[#404040]">{c.message}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
