import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "../components/site/Reveal";
import { submitContact, PHONE, EMAIL, ADDRESS, WHATSAPP } from "../lib/api";

const details = [
  { icon: Phone, label: "Phone", value: PHONE, href: `tel:${PHONE}` },
  { icon: MessageCircle, label: "WhatsApp", value: PHONE, href: `https://wa.me/${WHATSAPP}` },
  { icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
  { icon: MapPin, label: "Office", value: ADDRESS, href: null },
];

const empty = { name: "", phone: "", email: "", business: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Please share your name and phone number.");
      return;
    }
    setLoading(true);
    try {
      await submitContact(form);
      setDone(true);
      setForm(empty);
      toast.success("Thanks! We'll reach out to you shortly.");
    } catch {
      toast.error("Something went wrong. Please try again or WhatsApp us.");
    } finally {
      setLoading(false);
    }
  };

  const field = "w-full rounded-lg border border-[#E5E5E5] bg-white px-4 py-3 text-[15px] text-[#0A0A0A] outline-none transition-colors placeholder:text-[#a3a3a3] focus:border-[#0033FF] focus:ring-2 focus:ring-[#0033FF]/20";

  return (
    <div>
      <section data-testid="contact-hero" className="mx-auto max-w-7xl px-5 pt-36 pb-12 md:px-8 md:pt-44">
        <Reveal>
          <span className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[#0033FF]">Contact</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="font-display mt-5 max-w-3xl text-4xl font-black leading-[1.02] tracking-tight text-[#0A0A0A] sm:text-5xl lg:text-6xl">
            Let's Talk. We'll Visit You.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[#404040] md:text-base">
            We serve Tamil Nadu MSMEs across Chennai, Coimbatore, Tiruppur and surrounding districts.
            Share your details and we'll get back to you fast.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8 md:pb-32">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Details */}
          <div className="md:col-span-5">
            <Reveal>
              <div className="grid gap-4">
                {details.map((d) => {
                  const Icon = d.icon;
                  const inner = (
                    <div className="flex items-start gap-4 rounded-2xl border border-[#E5E5E5] bg-white p-6 transition-colors hover:border-[#0033FF]">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0033FF] text-white">
                        <Icon size={20} />
                      </span>
                      <div>
                        <p className="font-display text-xs font-semibold uppercase tracking-widest text-[#404040]">{d.label}</p>
                        <p className="mt-1 text-[15px] font-medium text-[#0A0A0A]">{d.value}</p>
                      </div>
                    </div>
                  );
                  return d.href ? (
                    <a key={d.label} href={d.href} target="_blank" rel="noreferrer" data-testid={`contact-${d.label.toLowerCase()}`}>{inner}</a>
                  ) : (
                    <div key={d.label} data-testid={`contact-${d.label.toLowerCase()}`}>{inner}</div>
                  );
                })}
                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="contact-whatsapp-cta"
                  className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[#0B132B] px-6 py-4 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <MessageCircle size={18} /> WhatsApp Us Now
                </a>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <div className="md:col-span-7">
            <Reveal delay={0.08}>
              <div className="rounded-2xl border border-[#E5E5E5] bg-white p-7 md:p-9">
                {done ? (
                  <div data-testid="contact-success" className="flex flex-col items-center py-16 text-center">
                    <CheckCircle2 size={56} className="text-[#0033FF]" />
                    <h3 className="font-display mt-5 text-2xl font-bold text-[#0A0A0A]">Message received</h3>
                    <p className="mt-2 max-w-sm text-[15px] text-[#404040]">Our team will contact you shortly. For anything urgent, just WhatsApp us.</p>
                    <button onClick={() => setDone(false)} data-testid="contact-reset" className="mt-6 rounded-full border border-[#E5E5E5] px-6 py-2.5 text-sm font-semibold text-[#0A0A0A] hover:border-[#0033FF]">
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submit} data-testid="contact-form" className="space-y-5">
                    <h3 className="font-display text-xl font-bold text-[#0A0A0A]">Send us a message</h3>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#0A0A0A]">Your Name *</label>
                        <input data-testid="contact-name" value={form.name} onChange={set("name")} className={field} placeholder="e.g. Murugan" />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#0A0A0A]">Phone *</label>
                        <input data-testid="contact-phone" value={form.phone} onChange={set("phone")} className={field} placeholder="+91 9xxxxxxxxx" />
                      </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#0A0A0A]">Email</label>
                        <input data-testid="contact-email" value={form.email} onChange={set("email")} className={field} placeholder="you@example.com" />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#0A0A0A]">Business Name</label>
                        <input data-testid="contact-business" value={form.business} onChange={set("business")} className={field} placeholder="Shop / Company" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#0A0A0A]">How can we help?</label>
                      <textarea data-testid="contact-message" value={form.message} onChange={set("message")} rows={4} className={field} placeholder="Tell us briefly about your business and what you need." />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      data-testid="contact-submit"
                      className="inline-flex items-center gap-2 rounded-full bg-[#0033FF] px-7 py-3.5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60"
                    >
                      {loading && <Loader2 size={16} className="animate-spin" />}
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
