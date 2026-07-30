import { Link } from "react-router-dom";
import { ArrowUpRight, Target, Cpu, HeartHandshake } from "lucide-react";
import { Reveal } from "../components/site/Reveal";
import { Marquee } from "../components/site/Marquee";

const values = [
  { icon: Target, title: "Business-first, not software-first", desc: "We start with your P&L and your pain — not with a product to sell." },
  { icon: Cpu, title: "The right mix of process, automation & AI", desc: "We fix leaks using whatever actually works for your shop or factory." },
  { icon: HeartHandshake, title: "We win only when you win", desc: "We succeed only when your profit increases. That's the whole deal." },
];

export default function About() {
  return (
    <div>
      <section data-testid="about-hero" className="mx-auto max-w-7xl px-5 pt-36 pb-16 md:px-8 md:pt-44">
        <Reveal>
          <span className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[#0033FF]">About GoGreat</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="font-display mt-5 max-w-4xl text-4xl font-black leading-[1.02] tracking-tight text-[#0A0A0A] sm:text-5xl lg:text-6xl">
            Our Mission: Make Every Tamil Nadu MSME Profitable &amp; Future-Ready
          </h1>
        </Reveal>
      </section>

      <Marquee items={["Business Growth", "AI Transformation", "Tamil-First", "GROWTH-360 Framework", "100+ MSMEs Studied"]} />

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <p className="font-display text-2xl font-semibold leading-snug text-[#0A0A0A] md:text-3xl">
                "Indian MSMEs don't need more software. They need a trusted partner who understands their reality."
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-[#404040] md:text-base">
                <p>
                  GoGreat started with one belief. We are a team of business consultants, tech experts and
                  AI specialists based in Tamil Nadu. We don't just build websites — we build
                  <span className="font-semibold text-[#0A0A0A]"> business operating systems</span> for shop
                  owners, manufacturers and traders.
                </p>
                <p>
                  Our flagship service, <span className="font-semibold text-[#0A0A0A]">Vaniga Nala Aayvu</span> (Business
                  Health Study), is designed to give you a doctor's diagnosis for your business. We find the hidden
                  problems. We show you the money leaks. We fix them using the right mix of process improvement,
                  automation and AI.
                </p>
                <p className="font-display text-lg font-semibold text-[#0033FF]">
                  We succeed only when your profit increases.
                </p>
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-5">
            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-2xl border border-[#E5E5E5] shadow-xl">
                <img
                  src="https://images.pexels.com/photos/8152734/pexels-photo-8152734.jpeg"
                  alt="GoGreat consultants meeting a business owner"
                  className="h-[420px] w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <Reveal key={v.title} delay={i * 0.06}>
                <div className="flex h-full flex-col rounded-2xl border border-[#E5E5E5] bg-white p-8 transition-transform duration-200 hover:-translate-y-1 hover:border-[#0033FF]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B132B] text-white">
                    <Icon size={22} />
                  </span>
                  <h3 className="font-display mt-6 text-lg font-bold text-[#0A0A0A]">{v.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#404040]">{v.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="mt-16">
            <Link
              to="/health-scan"
              data-testid="about-cta"
              className="group inline-flex items-center gap-2 rounded-full bg-[#0033FF] px-7 py-4 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
            >
              Start Your Free Business Health Scan
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
