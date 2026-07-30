import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { submitHealthScan, WHATSAPP } from "../lib/api";

const questions = [
  {
    key: "turnover",
    ta: "முதலில், உங்க annual turnover rough ஆ எவ்வளவு?",
    en: "What is your approximate annual turnover?",
    help: "Just give a rough range — 1L, 2L-5L, 10L, 50L, 1Cr, 5Cr…",
    ph: "e.g. Around ₹50L per year",
  },
  {
    key: "accounting",
    ta: "உங்க daily sales & expenses-ஐ எப்படி record பண்றீங்க?",
    en: "How do you record daily sales & expenses?",
    help: "Tally / Excel / Manual Notebook / Only CA monthly / Don't know",
    ph: "e.g. Manual notebook + CA does it monthly",
  },
  {
    key: "inventory",
    ta: "உங்க கிடங்கு / stock-ஐ எப்படி manage பண்றீங்க?",
    en: "How do you manage your godown / inventory?",
    help: "Do you do a monthly physical count? What % mismatch occurs?",
    ph: "e.g. We count monthly, about 5% mismatch",
  },
  {
    key: "staff",
    ta: "உங்க கடையில் / factory-ல எத்தனை பேர் வேலை பாக்கிறாங்க? KPI track பண்றீங்களா?",
    en: "How many employees do you have? Do you track KPIs?",
    help: "Do you know exactly what everyone does daily?",
    ph: "e.g. 6 staff, no KPI tracking",
  },
  {
    key: "followup",
    ta: "உங்க பழைய customers-களை follow-up பண்றீங்களா?",
    en: "Do you follow up with your old customers?",
    help: "WhatsApp / Phone / CRM system / Nothing",
    ph: "e.g. Only phone calls sometimes",
  },
  {
    key: "technology",
    ta: "இப்போ என்ன software / technology use பண்றீங்க?",
    en: "What software / technology do you currently use?",
    help: "Tally / Excel / Zoho / Website / Google Business / None",
    ph: "e.g. Tally + Excel",
  },
  {
    key: "biggest_challenge",
    ta: "கடந்த 1 வருஷத்துல உங்க business-ல மிக பெரிய சவால் / பிரச்சனை என்ன?",
    en: "What is the biggest challenge / problem in your business this past year?",
    help: "Sales drop / Staff leaving / Cash blocked / Inventory loss / Competition / Stress",
    ph: "e.g. Cash is blocked in stock and receivables",
  },
  {
    key: "future_goal",
    ta: "அடுத்த 6 மாசத்துல உங்க business என்ன ஆகணும் nu wish பண்றீங்க?",
    en: "What do you wish for your business in the next 6 months?",
    help: "Revenue double / Free time / Peace of mind / Expansion",
    ph: "e.g. Double revenue and hire a manager",
  },
];

const totalSteps = questions.length + 1; // +1 contact step

const initial = {
  turnover: "", accounting: "", inventory: "", staff: "",
  followup: "", technology: "", biggest_challenge: "", future_goal: "",
  name: "", company: "", phone: "",
};

const field =
  "w-full rounded-lg border border-[#E5E5E5] bg-white px-4 py-3 text-[15px] text-[#0A0A0A] outline-none transition-colors placeholder:text-[#a3a3a3] focus:border-[#0033FF] focus:ring-2 focus:ring-[#0033FF]/20";

export default function HealthScan() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initial);
  const [dir, setDir] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const isContact = step === questions.length;
  const progress = Math.round(((step) / totalSteps) * 100);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const next = () => {
    setDir(1);
    if (step < questions.length) setStep((s) => s + 1);
  };
  const back = () => {
    setDir(-1);
    if (step > 0) setStep((s) => s - 1);
  };

  const submit = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Please share your name and phone number so we can send the report.");
      return;
    }
    setLoading(true);
    try {
      await submitHealthScan(form);
      setDone(true);
      toast.success("Scan submitted! We'll be in touch soon.");
    } catch {
      toast.error("Submission failed. Please try again or WhatsApp us.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-5 py-32 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0033FF]/10 text-[#0033FF]">
          <CheckCircle2 size={44} />
        </span>
        <h1 data-testid="scan-success" className="font-display mt-8 text-3xl font-black tracking-tight text-[#0A0A0A] md:text-4xl">
          Your Free Health Scan is in.
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#404040]">
          Thank you, {form.name.split(" ")[0] || "friend"}. Our team will review your answers, spot the
          red flags, and reach out within 24 hours. 100% confidential.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#0033FF] px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            WhatsApp Us Now
          </a>
          <button
            onClick={() => navigate("/")}
            className="rounded-full border border-[#E5E5E5] px-7 py-3.5 text-sm font-semibold text-[#0A0A0A] hover:border-[#0033FF]"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pt-32 pb-24 md:pt-40">
      <div className="text-center">
        <span className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-[#0033FF]">
          வணிக நல ஆய்வு · Business Health Study
        </span>
        <h1 className="font-display mt-4 text-3xl font-black tracking-tight text-[#0A0A0A] md:text-4xl">
          Free Business Health Scan
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-[15px] text-[#404040]">
          8 questions to analyze your business in 10 minutes.
          <span className="inline-flex items-center gap-1 font-medium text-[#0A0A0A]"> <ShieldCheck size={15} className="text-[#0033FF]" /> 100% Confidential.</span>
        </p>
      </div>

      {/* Progress */}
      <div className="mt-10">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-[#404040]">
          <span>{isContact ? "Almost done — your details" : `Question ${step + 1} of ${questions.length}`}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#E5E5E5]">
          <motion.div
            className="h-full rounded-full bg-[#0033FF]"
            animate={{ width: `${Math.max(progress, 6)}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="mt-8 rounded-2xl border border-[#E5E5E5] bg-white p-7 md:p-10">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {!isContact ? (
              <div>
                <span className="font-display text-5xl font-black text-[#F0F0F0]">0{step + 1}</span>
                <h2 className="font-display mt-2 text-xl font-bold leading-snug text-[#0A0A0A] md:text-2xl">
                  {questions[step].ta}
                </h2>
                <p className="mt-1 text-sm font-medium text-[#404040]">{questions[step].en}</p>
                <p className="mt-3 rounded-lg bg-[#F3F5FF] px-4 py-2.5 text-xs text-[#404040]">{questions[step].help}</p>
                <textarea
                  autoFocus
                  data-testid={`scan-input-${questions[step].key}`}
                  value={form[questions[step].key]}
                  onChange={set(questions[step].key)}
                  rows={4}
                  className={`${field} mt-5`}
                  placeholder={questions[step].ph}
                />
              </div>
            ) : (
              <div>
                <h2 className="font-display text-xl font-bold leading-snug text-[#0A0A0A] md:text-2xl">
                  உங்க பெயர், கடை/நிறுவன பெயர், மற்றும் Phone Number?
                </h2>
                <p className="mt-1 text-sm font-medium text-[#404040]">Your Name, Shop / Company Name and Phone Number</p>
                <p className="mt-3 rounded-lg bg-[#F3F5FF] px-4 py-2.5 text-xs text-[#404040]">We need this to send you the report.</p>
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#0A0A0A]">Your Name *</label>
                    <input data-testid="scan-name" value={form.name} onChange={set("name")} className={field} placeholder="e.g. Murugan" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#0A0A0A]">Shop / Company Name</label>
                    <input data-testid="scan-company" value={form.company} onChange={set("company")} className={field} placeholder="e.g. Sri Traders" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#0A0A0A]">Phone Number *</label>
                    <input data-testid="scan-phone" value={form.phone} onChange={set("phone")} className={field} placeholder="+91 9xxxxxxxxx" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Nav */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            data-testid="scan-back"
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-[#404040] transition-colors hover:text-[#0A0A0A] disabled:opacity-0"
          >
            <ArrowLeft size={16} /> Back
          </button>

          {!isContact ? (
            <button
              onClick={next}
              data-testid="scan-next"
              className="group inline-flex items-center gap-2 rounded-full bg-[#0A0A0A] px-7 py-3.5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#0033FF]"
            >
              Continue <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={loading}
              data-testid="scan-submit"
              className="inline-flex items-center gap-2 rounded-full bg-[#0033FF] px-7 py-3.5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Submitting..." : "Get My Free Scan"}
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-center text-xs uppercase tracking-widest text-[#a3a3a3]">
        No credit card required · No obligation to buy anything
      </p>
    </div>
  );
}
