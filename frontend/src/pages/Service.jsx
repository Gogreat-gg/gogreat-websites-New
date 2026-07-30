import { Link } from "react-router-dom";
import { ArrowUpRight, Stethoscope, FileText, PhoneCall, Wrench } from "lucide-react";
import { Reveal } from "../components/site/Reveal";

const stages = [
  {
    icon: Stethoscope,
    tag: "Step 1 · FREE",
    title: "Free Health Scan (10 Minutes)",
    desc: "Answer 8 simple questions about your business. We identify the red flags immediately.",
  },
  {
    icon: FileText,
    tag: "Step 2 · ₹4,999",
    title: "Paid Study Report",
    desc: "A 3-page report showing your Business Health Score (out of 100), 3 hidden money leaks with exact calculations, and a step-by-step fix plan.",
  },
  {
    icon: PhoneCall,
    tag: "Step 3 · Included",
    title: "Consultation Call",
    desc: "We walk you through the report. No pressure. Just clarity.",
  },
  {
    icon: Wrench,
    tag: "Step 4 · Optional",
    title: "Implementation",
    desc: "If you choose, we fix the #1 problem found in the report — website, dashboard, CRM or SOP.",
  },
];

export default function Service() {
  return (
    <div>
      <section data-testid="service-hero" className="relative overflow-hidden bg-[#0B132B] text-white grain">
        <div className="relative mx-auto max-w-7xl px-5 pt-36 pb-20 md:px-8 md:pt-44 md:pb-28">
          <Reveal>
            <span className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[#0033FF]">Flagship Service</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="font-display mt-5 max-w-4xl text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
              Vaniga Nala Aayvu — Your Business Health Study
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-lg text-[#A3A3A3]">
              Like a doctor checks your health, we check your business.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              to="/health-scan"
              data-testid="service-hero-cta"
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-[#0033FF] px-7 py-4 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
            >
              Start Your Free Scan Now
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <span className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[#0033FF]">What You Get</span>
          <h2 className="font-display mt-5 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-[#0A0A0A] md:text-4xl">
            A clear, honest diagnosis — then a plan you actually understand.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {stages.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={i * 0.06}>
                <div className="flex h-full gap-5 rounded-2xl border border-[#E5E5E5] bg-white p-8 transition-transform duration-200 hover:-translate-y-1 hover:border-[#0033FF]">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0033FF] text-white">
                    <Icon size={22} />
                  </span>
                  <div>
                    <span className="font-display text-xs font-semibold uppercase tracking-widest text-[#0033FF]">{s.tag}</span>
                    <h3 className="font-display mt-2 text-xl font-bold text-[#0A0A0A]">{s.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-[#404040]">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#0033FF] p-10 text-white md:flex-row md:items-center">
            <div>
              <h3 className="font-display text-2xl font-black md:text-3xl">Ready for your diagnosis?</h3>
              <p className="mt-2 text-white/85">It takes 10 minutes and it's completely free.</p>
            </div>
            <Link
              to="/health-scan"
              data-testid="service-bottom-cta"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-[#0033FF] transition-transform duration-200 hover:-translate-y-0.5"
            >
              Start Free Scan
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
