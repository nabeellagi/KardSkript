import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Editor } from "@monaco-editor/react";
import { FaRocket, FaBookOpen } from "react-icons/fa";

export default function HomePage() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const btnRef = useRef(null);
  const editorRef = useRef(null);
  const starsRef = useRef([]);
  const cometRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(heroRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 })
      .fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      )
      .fromTo(
        descRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.5"
      )
      .fromTo(
        btnRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "bounce.out",
        },
        "-=0.4"
      )
      .fromTo(
        editorRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1 },
        "-=0.3"
      );

    gsap.to(cometRef.current, {
      x: 600,
      y: -400,
      repeat: -1,
      duration: 4,
      ease: "power1.inOut",
      yoyo: true,
    });

    // Animate Stars
    starsRef.current.forEach((star, index) => {
      const delay = Math.random() * 2;
      const floatDistance = 10 + Math.random() * 10;

      gsap.to(star, {
        x: `+=${Math.random() < 0.5 ? "-" : ""}${floatDistance}`,
        y: `+=${Math.random() < 0.5 ? "-" : ""}${floatDistance}`,
        scale: () => 0.9 + Math.random() * 0.3,
        duration: 4 + Math.random() * 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay,
      });
    });
  }, []);

  const defaultCode = `
// Write flashcards using code!
// Soon, this will render interactive flashcards

cardSet biology {
  card {
    front: "What is DNA?"
    back: "It stores genetic information."
  }
}`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-6 py-20 space-y-24 overflow-x-hidden relative">
      {/* Background Stars + Comet */}
      <div
        id="stars-bg"
        className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      >
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (starsRef.current[i] = el)}
            style={{
              backgroundColor: "rgba(255,255,255,1)",
              filter: "blur(0.7px)",
              borderRadius: "50%",
              position: "absolute",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.5,
              width: `${1 + Math.random() * 1.5}px`,
              height: `${1 + Math.random() * 1.5}px`,
            }}
          />
        ))}
        <div
          ref={cometRef}
          className="absolute left-0 top-0 w-full h-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(12, 255, 255, 0.25) 0%, rgba(255,255,255,0) 70%)",
            borderRadius: "50%",
            transform: "translateX(-50%) translateY(-50%)",
          }}
        />
      </div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="text-center max-w-3xl mx-auto space-y-6 relative z-10"
      >
        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl font-extrabold leading-tight text-accent"
        >
          Create Flashcards with Code
        </h1>
        <p
          ref={descRef}
          className="text-lg md:text-xl text-white/80 font-medium"
        >
          Introducing{" "}
          <span className="text-secondary font-bold">KardSkrip</span> — a
          beautifully simple, script-based flashcard tool to help you learn,
          create, and share knowledge.
        </p>
      </section>

      {/* Monaco Editor Block */}
      <section
        ref={editorRef}
        className="max-w-6xl mx-auto w-full bg-black/80 rounded-xl shadow-2xl border border-gray-700 overflow-hidden transition-transform duration-700"
      >
        <Editor
          height="500px"
          defaultLanguage="javascript"
          defaultValue={defaultCode}
          theme="vs-dark"
          options={{
            fontSize: 16,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            disableLayerHinting: true,
            contextmenu: false,
            readOnly: false,
            quickSuggestions: false,
          }}
          onMount={async (editor, monaco) => {
            // Load the theme JSON dynamically
            const response = await fetch("/dracula-monaco-theme.json");
            const theme = await response.json();

            monaco.editor.defineTheme("dracula", theme);
            monaco.editor.setTheme("dracula");

            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
              {
                noSemanticValidation: true,
                noSyntaxValidation: true,
              }
            );

            editor.updateOptions({
              renderValidationDecorations: "off",
            });
          }}
        />
        <div ref={btnRef} className="flex justify-center space-x-4 pt-4">
          <button className="btn btn-primary btn-lg shadow-lg hover:shadow-primary hover:scale-105 transition-transform duration-300 flex items-center">
            <FaRocket className="mr-2" /> Try Now
          </button>
          <button className="btn btn-outline btn-secondary btn-lg hover:scale-105 transition-transform duration-300 flex items-center">
            <FaBookOpen className="mr-2" /> Learn More
          </button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Section 1 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-secondary text-left relative">
            <span className="underline decoration-wavy decoration-pink-400 underline-offset-4">
              No More Manual Clicks
            </span>
          </h2>
          <p className="text-lg md:text-xl text-white/70 text-right max-w-md">
            Forget the{" "}
            <span className="text-pink-300 font-semibold">
              clunky interfaces
            </span>
            . Just type a simple script and instantly generate{" "}
            <span className="bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent font-semibold">
              interactive flashcards
            </span>
            . <br />
            <span className="italic text-white">
              Focus on learning, not clicking!
            </span>
          </p>
        </div>

        {/* Section 2 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-accent text-left relative">
            <span className="underline decoration-wavy decoration-cyan-400 underline-offset-16">
              Script Your Knowledge
            </span>
          </h2>
          <p className="text-lg md:text-xl text-white/70 text-right max-w-md">
            Whether it's{" "}
            <span className="text-cyan-300 font-semibold">
              biology, history, or programming
            </span>
            , write your knowledge in a{" "}
            <span className="italic underline decoration-dotted decoration-cyan-400 underline-offset-2">
              code-like fashion
            </span>
            . <br />
            <span className="font-bold text-white">Fast. Fun. Fluid.</span>
          </p>
        </div>
      </section>
    </main>
  );
}
