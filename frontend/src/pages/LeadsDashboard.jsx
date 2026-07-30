import { useEffect, useState } from "react";
import { RefreshCw, Users, MessageSquare, Phone, Mail, Building2 } from "lucide-react";
import { api } from "../lib/api";

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

const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
};

export default function LeadsDashboard() {
  const [tab, setTab] = useState("scans");
  const [scans, setScans] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [s, c] = await Promise.all([api.get("/health-scan"), api.get("/contact")]);
      setScans(s.data);
      setContacts(c.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-widest text-[#0033FF]">GoGreat · Private</p>
            <h1 className="font-display mt-2 text-3xl font-black tracking-tight text-[#0A0A0A]">Leads Dashboard</h1>
            <p className="mt-1 text-sm text-[#404040]">Every Health Scan and contact enquiry, newest first.</p>
          </div>
          <button
            onClick={load}
            data-testid="leads-refresh"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-5 py-2.5 text-sm font-semibold text-[#0A0A0A] transition-colors hover:border-[#0033FF]"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
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
                  <span className="text-xs text-[#a3a3a3]">{fmtDate(s.created_at)}</span>
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
                  <span className="text-xs text-[#a3a3a3]">{fmtDate(c.created_at)}</span>
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
