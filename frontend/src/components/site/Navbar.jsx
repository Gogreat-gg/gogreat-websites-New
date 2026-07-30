import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";

const links = [
  { to: "/", label: "Home", slug: "home" },
  { to: "/vaniga-nala-aayvu", label: "வணிக நல ஆய்வு", slug: "vaniga-nala-aayvu" },
  { to: "/about", label: "About", slug: "about" },
  { to: "/contact", label: "Contact", slug: "contact" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [loc.pathname]);

  return (
    <header
      data-testid="site-navbar"
      className={`fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,border-color] duration-300 ${
        scrolled ? "border-b border-[#E5E5E5] bg-white/80 backdrop-blur-xl" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link to="/" data-testid="nav-logo" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0033FF] font-display text-lg font-black text-white">
            G
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight">GoGreat</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-link-${l.slug}`}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-[#0033FF] ${
                  isActive ? "text-[#0033FF]" : "text-[#404040]"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/health-scan"
            data-testid="nav-health-scan-cta"
            className="group hidden items-center gap-2 rounded-full bg-[#0A0A0A] px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#0033FF] sm:flex"
          >
            Free Health Scan
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <button
            data-testid="nav-mobile-toggle"
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white md:hidden"
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[#E5E5E5] bg-white px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className="rounded-lg px-3 py-3 text-base font-medium text-[#0A0A0A] hover:bg-[#FAFAFA]"
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/health-scan"
              data-testid="nav-mobile-cta"
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[#0033FF] px-5 py-3 text-sm font-semibold text-white"
            >
              Free Health Scan <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
