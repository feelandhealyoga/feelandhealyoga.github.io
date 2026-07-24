import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FreeTrialModal } from "./FreeTrialModal";

const logoImage = "/assets/feel-and-heal-yoga-logo.svg";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Teacher", href: "#instructor" },
  { label: "Gallery", href: "#gallery" },
  { label: "Schedule", href: "#schedule" },
  { label: "Contact", href: "#contact" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTrialBtn, setShowTrialBtn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);

      // Show after hero
      const pastHero = y > window.innerHeight * 0.7;

      // Hide when "Why Choose Us" section is in view
      const reasonsEl = document.getElementById("reasons");
      const atReasons = reasonsEl
        ? y + window.innerHeight * 0.45 >= reasonsEl.offsetTop &&
          y < reasonsEl.offsetTop + reasonsEl.offsetHeight
        : false;

      // Hide when contact section comes into view
      const contactEl = document.getElementById("contact");
      const atContact = contactEl
        ? y + window.innerHeight * 0.55 >= contactEl.offsetTop
        : false;

      setShowTrialBtn(pastHero && !atReasons && !atContact);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // Listen for custom event from other sections (About CTA, etc.)
  useEffect(() => {
    const handler = () => setModalOpen(true);
    window.addEventListener("open-trial-modal", handler);
    return () => window.removeEventListener("open-trial-modal", handler);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[hsl(38,35%,96%)]/92 backdrop-blur-md shadow-sm border-b border-[hsl(38,18%,84%)]"
            : "bg-[hsl(38,35%,96%)] border-b border-[hsl(38,18%,84%)]"
        )}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Logo — brand name on one line */}
            <a href="#hero" className="flex items-center gap-2.5 group">
              <img
                src={logoImage}
                alt="Feel & Heal Yoga"
                width="36"
                height="36"
                loading="eager"
                className="h-9 w-9 rounded-full transition-transform duration-300 group-hover:scale-110"
                style={{ filter: "brightness(0) saturate(100%) invert(34%) sepia(44%) saturate(510%) hue-rotate(100deg) brightness(86%) contrast(90%)" }}
              />
              <span
                className="font-bold text-base whitespace-nowrap text-[hsl(145,38%,35%)]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Feel &amp; Heal Yoga
              </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-3.5 py-2 text-sm font-medium text-[hsl(20,20%,38%)] hover:text-[hsl(145,38%,35%)] hover:bg-[hsl(145,20%,94%)] transition-all duration-200 rounded-lg"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-yogi-trial"))}
                className="px-5 py-2.5 text-sm font-bold rounded-full inline-flex items-center gap-2 transition-all duration-300"
                style={{
                  background: showTrialBtn
                    ? "linear-gradient(135deg, hsl(38,90%,52%), hsl(30,85%,48%))"
                    : "transparent",
                  color: showTrialBtn ? "hsl(20,20%,14%)" : "transparent",
                  boxShadow: showTrialBtn ? "0 4px 16px hsla(38,90%,52%,0.35)" : "none",
                  pointerEvents: showTrialBtn ? "auto" : "none",
                  transform: showTrialBtn ? "scale(1)" : "scale(0.85)",
                  opacity: showTrialBtn ? 1 : 0,
                }}
                aria-hidden={!showTrialBtn}
              >
                🌿 Book Free Trial
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-[hsl(20,20%,30%)] hover:bg-[hsl(145,20%,92%)] transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-[hsl(38,18%,84%)]",
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <nav className="bg-[hsl(38,35%,96%)]/98 backdrop-blur-md px-4 pb-5 pt-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="px-4 py-3 text-sm font-medium text-[hsl(20,20%,35%)] hover:text-[hsl(145,38%,35%)] hover:bg-[hsl(145,20%,93%)] transition-colors rounded-lg"
              >
                {item.label}
              </a>
            ))}
            {/* Mobile always shows Book Trial */}
            <button
              onClick={() => { closeMenu(); window.dispatchEvent(new CustomEvent("open-yogi-trial")); }}
              className="mt-2 text-center text-sm font-bold py-3 rounded-full"
              style={{ background: "linear-gradient(135deg, hsl(38,90%,52%), hsl(30,85%,48%))", color: "hsl(20,20%,14%)" }}
            >
              🌿 Book Free Trial
            </button>
          </nav>
        </div>
      </header>

      {/* Free Trial Modal */}
      <FreeTrialModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
