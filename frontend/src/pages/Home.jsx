import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight, ArrowRight, Boxes, Users, Wallet, RefreshCw,
  Globe, Bot, ShieldCheck, MapPin, Languages, LineChart, Handshake, BadgeCheck, Quote,
} from "lucide-react";
import { Reveal, MaskedHeading } from "../components/site/Reveal";
import { Marquee } from "../components/site/Marquee";

const IMG = {
  owner: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80",
  factory: "https://images.unsplash.com/photo-1610891015188-5369212db097?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHxmYWN0b3J5JTIwbWFudWZhY3R1cmluZyUyMG1hY2hpbmVyeSUyMGluZHVzdHJpYWx8ZW58MHx8fHwxNzgyNjUyMTY2fDA&ixlib=rb-4.1.0&q=85",
  meeting: "https://images.pexels.com/photos/8152734/pexels-photo-8152734.jpeg",
  dashboard: "https://images.pexels.com/photos/577210/pexels-photo-577210.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
};

const problems = [
  "Inventory disappears or expires",
  "Customers buy once and never return",
  "Staff work without clear targets",
  "You check your bank balance daily but never know your real profit",
];

const steps = [
  { n: "01", title: "Free Health Scan", desc: "10-minute questionnaire. We identify the red flags in your business.", cost: "FREE" },
  { n: "02", title: "வணிக நல ஆய்வு (Vaniga Nala Aayvu)", desc: "A deep-dive report showing exactly where your money is leaking." },
  { n: "03", title: "Implementation Sprint", desc: "We fix the #1 leak — Website, CRM, Dashboard or SOP." },
  { n: "04", title: "Monitoring & Growth", desc: "Quarterly reviews and recurring advisory to keep you growing." },
];

const solutions = [
  { icon: Boxes, problem: '"My stock is expiring / getting lost"', fix: "Inventory Dashboard — track stock on mobile" },
  { icon: RefreshCw, problem: '"Customers come once, never return"', fix: "WhatsApp Follow-up Automation" },
  { icon: Wallet, problem: '"I don\'t know my daily profit"', fix: "Real-time Cash Flow Dashboard" },
  { icon: Users, problem: '"Staff make mistakes without accountability"', fix: "KPI & SOP Setup" },
  { icon: Globe, problem: '"I have no website / Google presence"', fix: "Growth Website + Local SEO" },
  { icon: LineChart, problem: '"I use 10 Excel sheets and get confused"', fix: "Custom ERP / CRM Setup" },
  { icon: Bot, problem: '"I want AI but don\'t know where to start"', fix: "AI Readiness & Implementation" },
];

const trust = [
  { icon: MapPin, title: "We Visit Your Premises", desc: "We come to your shop, godown or factory in Chennai, Coimbatore, Tiruppur and across TN. No remote desks.", span: "md:col-span-2" },
  { icon: Languages, title: "Tamil-First Approach", desc: "We speak your language. No fancy English jargon — just practical advice in Tamil.", span: "md:col-span-1" },
  { icon: ShieldCheck, title: 'The "GROWTH-360" Framework', desc: "Our proprietary method, built after studying 100+ MSMEs. Not generic ChatGPT advice.", span: "md:col-span-1" },
  { icon: Handshake, title: "Real Partner Ecosystem", desc: "We work with trusted CAs, MSME associations and local business chambers.", span: "md:col-span-1" },
  { icon: BadgeCheck, title: "ROI Guarantee", desc: "If our implementation doesn't pay for itself within 3 months, we fix it for free.", span: "md:col-span-1" },
];

const services = [
  { name: "Business Improvement Sprint", ideal: "Immediate fix for inventory / cash flow" },
  { name: "Digital Launch (Website + Google)", ideal: "Businesses with no online presence" },
  { name: "WhatsApp Automation Suite", ideal: "Shops with high inquiry volume" },
  { name: "Executive Dashboard", ideal: "Owners who want daily P&L visibility" },
  { name: "Custom CRM / ERP Setup", ideal: "Distributors and large retailers" },
  { name: "AI Automation Implementation", ideal: "Manufacturing and service businesses" },
];

const testimonials = [
  { quote: "Within a month they found where my stock was silently disappearing. My cash flow finally makes sense now.", name: "Sample — Retail Owner", place: "Chennai" },
  { quote: "The Tamil-first explanation made everything clear. No jargon, just a plan I could actually follow.", name: "Sample — Textile Trader", place: "Tiruppur" },
  { quote: "The health scan alone showed leaks I never noticed in 12 years of running my unit.", name: "Sample — Manufacturer", place: "Coimbatore" },
];

const Overline = ({ children, dark }) => (
  <span className={`font-display text-xs font-semibold uppercase tracking-[0.25em] ${dark ? "text-[#0033FF]" : "text-[#0033FF]"}`}>
    {children}
  </span>
);

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section ref={ref} data-testid="hero-section" className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-12 md:px-8">
        <div className="md:col-span-7">
          <Reveal>
            <Overline>Business Growth &amp; AI Transformation Partner</Overline>
          </Reveal>
          <MaskedHeading
            className="font-display mt-5 text-4xl font-black leading-[0.98] tracking-tight text-[#0A0A0A] sm:text-5xl lg:text-6xl"
            lines={["Stop Buying Websites.", "Start Buying", "Business Growth."]}
            delay={0.15}
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-[#404040] md:text-lg"
          >
            Most agencies sell you software. We sell you results. We visit your shop, study your
            operations, find the money leaks, and fix them — one step at a time.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/health-scan"
              data-testid="hero-primary-cta"
              className="group inline-flex items-center gap-2 rounded-full bg-[#0033FF] px-7 py-4 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
            >
              Start Your Free Business Health Scan
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/vaniga-nala-aayvu"
              className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-7 py-4 text-sm font-semibold text-[#0A0A0A] transition-colors hover:border-[#0033FF] hover:text-[#0033FF]"
            >
              How it works <ArrowRight size={16} />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-[#404040]"
          >
            {["Tamil Nadu MSMEs — built for you", "No hidden charges", "100% Confidential"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <BadgeCheck size={16} className="text-[#0033FF]" /> {t}
              </span>
            ))}
          </motion.div>
        </div>

        <div className="md:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <motion.div style={{ y }} className="relative overflow-hidden rounded-2xl border border-[#E5E5E5] shadow-2xl">
              <img src={IMG.owner} alt="Tamil Nadu MSME shop owner" className="h-[420px] w-full object-cover md:h-[520px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/50 to-transparent" />
            </motion.div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-xl sm:block">
              <p className="font-display text-3xl font-black text-[#0033FF]">10-15%</p>
              <p className="mt-1 max-w-[10rem] text-xs text-[#404040]">profit MSMEs lose without ever noticing</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <Hero />

      <Marquee items={["Tamil Nadu MSMEs — built for you", "No hidden charges", "100% Confidential", "We visit your premises"]} />

      {/* PROBLEM MANIFESTO */}
      <section data-testid="problem-section" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal><Overline>The Problem</Overline></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display mt-5 text-3xl font-extrabold leading-tight tracking-tight text-[#0A0A0A] md:text-4xl">
                Why do 80% of Tamil Nadu MSMEs lose 10-15% profit without knowing it?
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-[15px] leading-relaxed text-[#404040]">
                You work hard every day. But money leaks from your business in places you can't see.
                The problem is not laziness. The problem is <span className="font-semibold text-[#0A0A0A]">lack of clarity.</span>
              </p>
              <p className="mt-3 font-display text-lg font-semibold text-[#0033FF]">We give you that clarity.</p>
            </Reveal>
          </div>

          <div className="md:col-span-7">
            <div className="divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
              {problems.map((p, i) => (
                <Reveal key={p} delay={i * 0.06}>
                  <div className="group flex items-baseline gap-6 py-6 transition-colors hover:bg-white">
                    <span className="font-display text-sm font-bold text-[#0033FF]">0{i + 1}</span>
                    <p className="text-lg font-medium text-[#0A0A0A] md:text-xl">{p}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <section data-testid="process-section" className="relative overflow-hidden bg-[#0B132B] text-white grain">
        <div className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <Reveal><Overline dark>The GoGreat Path</Overline></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display mt-5 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
              We Don't Sell Random Services. We Follow a Proven Path.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="group flex h-full flex-col rounded-2xl border border-white/12 bg-white/[0.03] p-7 transition-colors duration-200 hover:border-[#0033FF] hover:bg-white/[0.06]">
                  <span className="font-display text-5xl font-black text-white/15 transition-colors group-hover:text-[#0033FF]">{s.n}</span>
                  <h3 className="font-display mt-4 text-xl font-bold">{s.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[#A3A3A3]">{s.desc}</p>
                  {s.cost && (
                    <span className="mt-5 inline-flex w-fit rounded-full bg-[#0033FF] px-4 py-1.5 text-xs font-bold uppercase tracking-wide">{s.cost}</span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTIONS TABLE */}
      <section data-testid="solutions-section" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="max-w-3xl">
          <Reveal><Overline>Problems → Solutions</Overline></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display mt-5 text-3xl font-extrabold leading-tight tracking-tight text-[#0A0A0A] md:text-5xl">
              We Don't Care About Technology. We Care About Your Problems.
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 overflow-hidden rounded-2xl border border-[#E5E5E5]">
          <div className="hidden grid-cols-12 gap-4 border-b border-[#E5E5E5] bg-[#0B132B] px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white md:grid">
            <span className="col-span-6">Your Business Problem</span>
            <span className="col-span-6">What We Build / Fix</span>
          </div>
          {solutions.map((row, i) => {
            const Icon = row.icon;
            return (
              <Reveal key={row.fix} delay={i * 0.04}>
                <div className="group grid grid-cols-1 gap-3 border-b border-[#E5E5E5] bg-white px-6 py-6 transition-colors last:border-b-0 hover:bg-[#F3F5FF] md:grid-cols-12 md:items-center md:gap-4 md:px-8">
                  <div className="col-span-6 flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] text-[#0A0A0A] transition-colors group-hover:border-[#0033FF] group-hover:bg-[#0033FF] group-hover:text-white">
                      <Icon size={20} />
                    </span>
                    <p className="text-[15px] font-medium text-[#404040]">{row.problem}</p>
                  </div>
                  <div className="col-span-6 flex items-center gap-2 pl-[3.75rem] md:pl-0">
                    <ArrowRight size={16} className="hidden shrink-0 text-[#0033FF] md:block" />
                    <p className="font-display text-base font-bold text-[#0A0A0A]">{row.fix}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* TRUST BENTO */}
      <section data-testid="trust-section" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <div className="max-w-3xl">
            <Reveal><Overline>Why GoGreat</Overline></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display mt-5 text-3xl font-extrabold leading-tight tracking-tight text-[#0A0A0A] md:text-5xl">
                Why Tamil Nadu Business Owners Trust GoGreat
              </h2>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {trust.map((t, i) => {
              const Icon = t.icon;
              return (
                <Reveal key={t.title} delay={i * 0.06} className={t.span}>
                  <div className="flex h-full flex-col rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA] p-8 transition-transform duration-200 hover:-translate-y-1 hover:border-[#0033FF]">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0033FF] text-white">
                      <Icon size={22} />
                    </span>
                    <h3 className="font-display mt-6 text-xl font-bold text-[#0A0A0A]">{t.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-[#404040]">{t.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section data-testid="services-section" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal><Overline>Implementation Services</Overline></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display mt-5 text-3xl font-extrabold leading-tight tracking-tight text-[#0A0A0A] md:text-4xl">
                Our Services — Only After Diagnosis
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-[15px] leading-relaxed text-[#404040]">
                We never sell a random package. Every service below is prescribed only after your
                வணிக நல ஆய்வு (Vaniga Nala Aayvu) report reveals the real leak.
              </p>
              <div className="mt-8 overflow-hidden rounded-2xl border border-[#E5E5E5]">
                <img src={IMG.dashboard} alt="Executive dashboard analytics" className="h-52 w-full object-cover" />
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-[#E5E5E5]">
              {services.map((s, i) => (
                <Reveal key={s.name} delay={i * 0.04}>
                  <div className="group flex flex-col gap-2 border-b border-[#E5E5E5] bg-white px-6 py-6 transition-colors last:border-b-0 hover:bg-[#F3F5FF] md:flex-row md:items-center md:justify-between md:px-8">
                    <div>
                      <h3 className="font-display text-lg font-bold text-[#0A0A0A]">{s.name}</h3>
                      <p className="mt-1 text-sm text-[#404040]">{s.ideal}</p>
                    </div>
                    <ArrowRight size={18} className="hidden shrink-0 text-[#0033FF] transition-transform group-hover:translate-x-1 md:block" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section data-testid="testimonials-section" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <Reveal><Overline>Success Stories</Overline></Reveal>
              <Reveal delay={0.05}>
                <h2 className="font-display mt-5 text-3xl font-extrabold leading-tight tracking-tight text-[#0A0A0A] md:text-5xl">
                  Real Wins for Tamil Nadu MSMEs
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <span className="inline-flex rounded-full border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#404040]">
                Sample stories · edit anytime
              </span>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <figure className="flex h-full flex-col rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA] p-8 transition-transform duration-200 hover:-translate-y-1 hover:border-[#0033FF]">
                  <Quote size={28} className="text-[#0033FF]" />
                  <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-[#0A0A0A]">"{t.quote}"</blockquote>
                  <figcaption className="mt-6 border-t border-[#E5E5E5] pt-5">
                    <p className="font-display text-sm font-bold text-[#0A0A0A]">{t.name}</p>
                    <p className="text-xs text-[#404040]">{t.place}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section data-testid="final-cta-section" className="relative overflow-hidden bg-[#0033FF] text-white">
        <div className="relative mx-auto max-w-5xl px-5 py-24 text-center md:px-8 md:py-32">
          <Reveal>
            <h2 className="font-display text-4xl font-black leading-[1.02] tracking-tight md:text-6xl">
              Stop Guessing. Start Growing.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              Take 10 minutes for our Free Health Scan. We will show you exactly where your money is
              leaking. The report is free. The clarity is priceless.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              to="/health-scan"
              data-testid="final-cta-button"
              className="group mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-[#0033FF] transition-transform duration-200 hover:-translate-y-0.5"
            >
              Claim Your Free Health Scan Now
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
          <p className="mt-5 text-xs uppercase tracking-widest text-white/60">
            No credit card required · No obligation to buy anything
          </p>
        </div>
      </section>
    </div>
  );
}
