import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle, ArrowUpRight, Linkedin, Instagram, Facebook, Youtube } from "lucide-react";
import { PHONE, EMAIL, ADDRESS, WHATSAPP, SOCIALS } from "../../lib/api";

const socialItems = [
  { icon: Linkedin, href: SOCIALS.linkedin, label: "LinkedIn" },
  { icon: Instagram, href: SOCIALS.instagram, label: "Instagram" },
  { icon: Facebook, href: SOCIALS.facebook, label: "Facebook" },
  { icon: Youtube, href: SOCIALS.youtube, label: "YouTube" },
];

export const Footer = () => {
  return (
    <footer data-testid="site-footer" className="relative overflow-hidden bg-[#0B132B] text-white grain">
      <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0033FF] font-display text-lg font-black">G</span>
              <span className="font-display text-2xl font-extrabold tracking-tight">GoGreat</span>
            </div>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-[#A3A3A3]">
              Business Growth & AI Transformation Partner for Tamil Nadu MSMEs. We visit your shop,
              find the money leaks, and fix them — one step at a time.
            </p>
            <Link
              to="/health-scan"
              data-testid="footer-cta"
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-[#0033FF] px-6 py-3 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5"
            >
              Start Free Health Scan
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <div className="mt-7 flex items-center gap-3">
              {socialItems.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    data-testid={`social-${s.label.toLowerCase()}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors duration-200 hover:border-[#0033FF] hover:bg-[#0033FF] hover:text-white"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="font-display text-xs font-semibold uppercase tracking-widest text-[#A3A3A3]">Explore</p>
            <ul className="mt-5 space-y-3 text-[15px]">
              <li><Link to="/" className="text-white/90 hover:text-[#0033FF]">Home</Link></li>
              <li><Link to="/vaniga-nala-aayvu" className="text-white/90 hover:text-[#0033FF]">வணிக நல ஆய்வு (Vaniga Nala Aayvu)</Link></li>
              <li><Link to="/about" className="text-white/90 hover:text-[#0033FF]">About Us</Link></li>
              <li><Link to="/contact" className="text-white/90 hover:text-[#0033FF]">Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="font-display text-xs font-semibold uppercase tracking-widest text-[#A3A3A3]">Reach Us</p>
            <ul className="mt-5 space-y-4 text-[15px] text-white/90">
              <li className="flex items-center gap-3"><Phone size={17} className="text-[#0033FF]" /> <a href={`tel:${PHONE}`} className="hover:text-[#0033FF]">{PHONE}</a></li>
              <li className="flex items-center gap-3"><MessageCircle size={17} className="text-[#0033FF]" /> <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="hover:text-[#0033FF]">WhatsApp Us</a></li>
              <li className="flex items-center gap-3"><Mail size={17} className="text-[#0033FF]" /> <a href={`mailto:${EMAIL}`} className="hover:text-[#0033FF]">{EMAIL}</a></li>
              <li className="flex items-start gap-3"><MapPin size={17} className="mt-0.5 shrink-0 text-[#0033FF]" /> <span className="text-white/70">{ADDRESS}</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-3 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row">
          <span>© {new Date().getFullYear()} GoGreat. All rights reserved.</span>
          <span>Tamil Nadu MSMEs — built for you.</span>
        </div>
      </div>
    </footer>
  );
};
