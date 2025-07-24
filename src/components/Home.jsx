import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Editor } from "@monaco-editor/react";
import { FaRocket, FaBookOpen, FaDownload } from "react-icons/fa";
import { DndContext, useDroppable } from "@dnd-kit/core";
import { parseKardScript } from "../utils/kardParser";

export default function HomePage() {
  const [output, setOutput] = useState(null);

  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const btnRef = useRef(null);
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);
  const starsRef = useRef([]);
  const cometRef = useRef(null);
  const [editorInstance, setEditorInstance] = useState(null);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleDragEnter = (e) => {
      if (editorContainerRef.current?.contains(e.target)) {
        setIsDragging(true);
      }
    };
    const handleDragLeave = (e) => {
      if (!editorContainerRef.current?.contains(e.relatedTarget)) {
        setIsDragging(false);
      }
    };
    const handleDropGlobal = () => setIsDragging(false);

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDropGlobal);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDropGlobal);
    };
  }, []);

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
flash({
    front : "What is a computer?",
    back : "computer is a device?"
})`;

  const handleDownload = () => {
    if (!editorRef.current) return;
    const value = editorRef.current.getValue?.();
    if (!value) return;
    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "flashcards.kard";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (!file || !file.name.endsWith(".kard")) {
      alert("Only .kard files are supported!");
      return;
    }
    const text = await file.text();
    editorInstance?.setValue?.(text);
  };

  const handleRun = () => {
    if (!editorRef.current) return;
    const code = editorRef.current.getValue?.();
    if (!code) return;

    try {
      const parsedOutput = parseKardScript(code);
      setOutput(parsedOutput);
    } catch (err) {
      setOutput({ error: err.message });
    }
  };

  return (
    <DndContext>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-6 py-20 space-y-24 overflow-x-hidden relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
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

        {/* Monaco Editor */}
        <section
          ref={editorContainerRef}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="max-w-6xl mx-auto w-full bg-black/80 rounded-xl shadow-2xl border border-gray-700 overflow-hidden transition-transform duration-700 relative"
        >
          {isDragging && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-3xl font-bold z-50">
              Drop it like it's hot 🔥
            </div>
          )}
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
              editorRef.current = editor;
              setEditorInstance(editor);
              const response = await fetch("/dracula-monaco-theme.json");
              const theme = await response.json();
              monaco.editor.defineTheme("dracula", theme);
              monaco.editor.setTheme("dracula");
              monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
                {
                  noSemanticValidation: true,
                  noSyntaxValidation: true,
                  noSuggestionDiagnostics:true
                }
              );
              editor.updateOptions({
                renderValidationDecorations: "off",
              });
            }}
          />
          <div
            ref={btnRef}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <button
              onClick={handleRun}
              className="btn btn-primary btn-lg shadow-lg hover:shadow-primary hover:scale-105 transition-transform duration-300 flex items-center"
            >
              <FaRocket className="mr-2" /> Run
            </button>

            <button className="btn btn-outline btn-secondary btn-lg hover:scale-105 transition-transform duration-300 flex items-center">
              <FaBookOpen className="mr-2" /> Learn More
            </button>
            <button
              onClick={handleDownload}
              className="btn btn-accent btn-lg shadow-lg hover:shadow-accent hover:scale-105 transition-transform duration-300 flex items-center"
            >
              <FaDownload className="mr-2" /> Download
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {output ? (
              <pre className="bg-black/70 p-4 rounded text-left overflow-auto text-green-300 text-xs">
                {output.error
                  ? `❌ Error: ${output.error}`
                  : JSON.stringify(output, null, 2)}
              </pre>
            ) : (
              "Click 'Run' to parse your script."
            )}
          </p>
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
    </DndContext>
  );
}
