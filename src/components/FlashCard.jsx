import { useEffect, useRef, useState } from "react";
import interact from "interactjs";
import gsap from "gsap";
import "../styles/global.css";

import katex from "katex";
import "katex/dist/katex.min.css";

const CARD_WIDTH = 300;
const CARD_HEIGHT = 400;

const defaultCardStyle = {
  bg_color: "#FF2DD1",
  fontSize_front: 24,
  fontSize_back: 20,
  x: 100,
  y: 10,
};

export default function FlashCard({ card, index, onDragStart, onDragEnd }) {
  const cardRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const positionRef = useRef({
    x: card?.x ?? defaultCardStyle.x + index * 500,
    y: card?.y ?? defaultCardStyle.y,
  });

  const [isFlipped, setIsFlipped] = useState(false);

  const cardData = { ...defaultCardStyle, ...card };

  const handleDoubleClick = () => setIsFlipped((prev) => !prev);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    gsap.set(el, {
      x: positionRef.current.x,
      y: positionRef.current.y,
    });

    interact(el)
      .draggable({
        listeners: {
          start() {
            onDragStart?.();
            gsap.to(el, {
              rotationZ: 10,
              duration: 0.15,
              ease: "power1.out",
            });
          },
          move(event) {
            positionRef.current.x += event.dx;
            positionRef.current.y += event.dy;
            gsap.set(el, {
              x: positionRef.current.x,
              y: positionRef.current.y,
            });

            const tilt = Math.max(Math.min(event.dx * 2, 15), -15);
            gsap.to(el, {
              rotationZ: tilt,
              duration: 0.1,
            });
          },
          end() {
            onDragEnd?.();
            gsap.to(el, {
              rotationZ: 0,
              duration: 0.3,
              ease: "elastic.out(1, 0.6)",
            });
            // setTimeout(reRenderMath, 0);
          },
        },
      })
      .styleCursor(false);
  }, []);

  useEffect(() => {
    if (window.renderMathInElement) {
      if (frontRef.current) renderMathInElement(frontRef.current);
      if (backRef.current) renderMathInElement(backRef.current);
    }
  }, [isFlipped, cardData.front, cardData.back]);

  useEffect(() => {
  }, [isFlipped, cardData.front, cardData.back]);

  const renderContent = (text, imagePath, ref, equationText, codeText) => {
    return (
      <div
        ref={ref}
        className="w-full h-full overflow-y-auto overflow-x-hidden"
      >
        {imagePath && (
          <img
            src={`http://localhost:5678/images/${imagePath}`}
            alt="Flashcard Visual"
            className="max-w-full max-h-52 object-contain mx-auto"
          />
        )}
        <div className="w-full flex flex-col gap-2 text-white p-2">
          <div
            className="prose whitespace-pre-wrap text-left"
            dangerouslySetInnerHTML={{ __html: text }}
          />

          {codeText && (
            <div
              className="relative bg-base-200 text-left text-base-content rounded-lg p-2 mt-2 
               text-sm overflow-x-auto overflow-y-auto max-h-40 font-mono 
               subpixel-antialiased leading-snug"
            >
              <pre className="whitespace-pre-wrap">
                <code>{codeText}</code>
              </pre>
              <button
                onClick={() => navigator.clipboard.writeText(codeText)}
                className="btn btn-xs btn-outline absolute top-1 right-1"
              >
                Copy
              </button>
            </div>
          )}

          {equationText && (
            <div
              className="overflow-x-auto text-center mt-1 text-sm"
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(equationText, {
                  throwOnError: false,
                  displayMode: true,
                }),
              }}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={cardRef}
      onDoubleClick={handleDoubleClick}
      className="draggable absolute cursor-move select-none"
      style={{
        width: `${CARD_WIDTH}px`,
        height: `${CARD_HEIGHT}px`,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      <div
        className="w-full h-full relative transition-transform duration-500 ease-in-out"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateY(${isFlipped ? 180 : 0}deg)`,
        }}
      >
        <div
          className="absolute inset-0 rounded-[35px] p-4 text-white text-center bg-opacity-90 overflow-hidden shadow-lg"
          style={{
            fontSize: `${cardData.fontSize_front}px`,
            backgroundColor: cardData.bg_color,
            backfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
            zIndex: isFlipped ? 0 : 2,
          }}
        >
          {renderContent(
            cardData.front,
            cardData.imageFront,
            frontRef,
            cardData.equationFront
          )}
        </div>

        <div
          className="absolute inset-0 rounded-[35px] p-4 text-white text-center bg-opacity-90 overflow-hidden shadow-lg"
          style={{
            fontSize: `${cardData.fontSize_back}px`,
            backgroundColor: cardData.bg_color,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            zIndex: isFlipped ? 2 : 0,
          }}
        >
          {renderContent(
            cardData.back,
            cardData.imageBack,
            backRef,
            cardData.equationBack,
            cardData.code
          )}
        </div>
      </div>
    </div>
  );
}
