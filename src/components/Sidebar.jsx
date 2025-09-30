import { useEffect, useRef, useState } from "react";
import {
  MdSearch,
  MdExpandLess,
  MdExpandMore,
  MdMenu,
  MdClose,
} from "react-icons/md";
import clsx from "clsx";
import gsap from "gsap";
import sections from "../data/sections";

export default function Sidebar({ currentPath }) {
  const fabRef = useRef(null);
  const iconRef = useRef(null);
  const particlesRef = useRef([]);

  const createParticles = () => {
    const container = fabRef.current;
    if (!container) return;

    const colors = ["#f472b6", "#60a5fa", "#34d399", "#facc15", "#c084fc"];
    const numParticles = 10;

    for (let i = 0; i < numParticles; i++) {
      const div = document.createElement("div");
      div.className = "absolute w-2 h-2 rounded-full pointer-events-none";
      div.style.backgroundColor = colors[i % colors.length];
      container.appendChild(div);
      particlesRef.current.push(div);

      const angle = (Math.PI * 2 * i) / numParticles;
      const radius = 40 + Math.random() * 20;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      gsap.fromTo(
        div,
        { x: 0, y: 0, opacity: 1, scale: 1 },
        {
          x,
          y,
          opacity: 0,
          scale: 0.5,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            container.removeChild(div);
            particlesRef.current = particlesRef.current.filter(
              (el) => el !== div
            );
          },
        }
      );
    }
  };

  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(() =>
    Object.fromEntries(sections.map((s) => [s.heading, true]))
  );
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const containerRef = useRef(null);
  const sidebarRef = useRef(null);

  const toggleSection = (heading) => {
    setExpanded((prev) => ({
      ...prev,
      [heading]: !prev[heading],
    }));
  };

  const toggleSidebar = () => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    // Animate sidebar
    gsap.to(sidebar, {
      x: isSidebarOpen ? "-110%" : "0%",
      duration: 0.5,
      ease: "power2.inOut",
    });

    // Icon transition
    gsap.fromTo(
      iconRef.current,
      { rotate: 0, scale: 1 },
      {
        rotate: 180,
        scale: 1.2,
        duration: 0.3,
        ease: "back.out(1.7)",
      }
    );

    // Particle burst
    createParticles();

    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll("li");
      gsap.fromTo(
        items,
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.out",
        }
      );
    }
  }, [query]);

  const filteredSections = sections
    .map((section) => {
      const visibleItems = section.items.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      );
      return visibleItems.length > 0
        ? { ...section, items: visibleItems }
        : null;
    })
    .filter(Boolean);

  return (
    <>
      <button
        ref={fabRef}
        onClick={toggleSidebar}
        className="fixed bottom-6 left-6 z-50 bg-primary text-primary-content p-4 rounded-full 
             shadow-[0_0_15px_5px_var(--tw-shadow-color)] shadow-primary 
             ring-2 ring-primary ring-opacity-50 
             hover:scale-110 hover:shadow-[0_0_25px_8px_var(--tw-shadow-color)] 
             transition-all duration-300 ease-in-out group overflow-visible"
      >
        <div ref={iconRef} className="transition-transform duration-300">
          {isSidebarOpen ? (
            <MdClose className="text-3xl transition-transform duration-500 group-hover:rotate-360" />
          ) : (
            <MdMenu className="text-3xl transition-transform duration-300 group-hover:rotate-180" />
          )}
        </div>
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className="w-full md:w-64 bg-base-200 md:h-screen sticky top-0 p-6 shadow-lg z-40"
        style={{
          transform: isSidebarOpen ? "translateX(0%)" : "translateX(-110%)",
        }}
      >
        <div className="flex items-center mb-4 gap-2">
         <MdSearch className="text-xl text-base-content animate-bounce" />
          <input
            type="text"
            placeholder="Search docs"
            className="input input-bordered input-sm w-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Navigation List */}
        <div ref={containerRef} className="space-y-4 relative">
          {filteredSections.length === 0 ? (
            <p className="text-base-content italic px-2">No results found.</p>
          ) : (
            filteredSections.map((section) => (
              <div key={section.heading}>
                <button
                  onClick={() => toggleSection(section.heading)}
                  className="flex items-center justify-between w-full font-semibold text-base-content mb-1 hover:text-primary transition"
                >
                  <span>{section.heading}</span>
                  {expanded[section.heading] ? (
                    <MdExpandLess className="text-lg" />
                  ) : (
                    <MdExpandMore className="text-lg" />
                  )}
                </button>

                <ul
                  className={clsx(
                    "space-y-1 pl-2 border-l border-base-300 ml-2 transition-all duration-200",
                    { hidden: !expanded[section.heading] }
                  )}
                >
                  {section.items.map((item) => (
                    <li
                      key={item.path}
                      className="relative group overflow-hidden"
                    >
                      <a
                        href={item.path}
                        className={clsx(
                          "block px-3 py-2 rounded-lg transition-all duration-200 ease-in-out relative z-10",
                          {
                            "bg-primary text-primary-content font-semibold":
                              currentPath === item.path,
                            "hover:text-primary hover:font-semibold hover:scale-105":
                              currentPath !== item.path,
                          }
                        )}
                      >
                        {item.label}
                        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
