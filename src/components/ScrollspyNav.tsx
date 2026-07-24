import { useEffect, useRef, useState } from "react";

const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Reviews" },
  { id: "gallery", label: "Gallery" },
  { id: "schedule", label: "Schedule" },
  { id: "contact", label: "Contact" },
];

export const ScrollspyNav = () => {
  const [activeSection, setActiveSection] = useState("");
  const navRef = useRef<HTMLElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const handleScroll = () => {
      navItems.forEach((item) => {
        const element = document.getElementById(item.id);
        if (!element) return;

        const rect = element.getBoundingClientRect();

        const isVisible = rect.top >= 0 && rect.top <= window.innerHeight - 64; // same offset as rootMargin

        if (isVisible) {
          setActiveSection(item.id);
        }
      });
    };

    // Run once on mount (important)
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Scroll active button into view when activeSection changes
  useEffect(() => {
    if (activeSection && buttonRefs.current[activeSection] && navRef.current) {
      const activeButton = buttonRefs.current[activeSection];
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeSection]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 64; // Account for header (64px) + scrollspy bar (~48px)
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      ref={navRef}
      className="sticky top-16 left-0 right-0 z-40 bg-muted border-b md:hidden"
    >
      <div className="flex items-center justify-start px-4 py-2 gap-3 overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            ref={(el) => {
              buttonRefs.current[item.id] = el;
            }}
            onClick={() => scrollToSection(item.id)}
            className={`whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors rounded-md ${
              activeSection === item.id
                ? "text-primary font-bold bg-primary/10"
                : "text-muted-foreground "
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};
