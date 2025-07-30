import { useEffect, useRef, useState } from "react";
import interact from "interactjs";
import gsap from "gsap";
import "../styles/global.css";

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

  const reRenderMath = () => {
    if (!window.renderMathInElement || !cardRef.current) return;

    renderMathInElement(cardRef.current, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\(", right: "\\)", display: false },
      ],
      throwOnError: false,
    });
  };

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
            setTimeout(reRenderMath, 0);
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
    reRenderMath();
  }, []);

  useEffect(() => {
    reRenderMath(); // On flip or content change
  }, [isFlipped, cardData.front, cardData.back]);

  const renderContent = (text, imagePath, ref, equationText) => {
    return (
      <div
        ref={ref}
        className="w-full h-full overflow-y-auto overflow-x-hidden"
      >
        {imagePath && (
          <img
            src={imagePath}
            alt="Flashcard Visual"
            className="max-w-full max-h-52 object-contain mx-auto"
          />
        )}
        <div className="w-full flex flex-col gap-1 text-white p-2">
          <div
            className="prose text-right whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: text }}
          />
          {equationText && (
            <div
              className="overflow-x-auto text-right mt-1"
              style={{ fontSize: "0.85em" }}
            >
              {equationText && (
                <div
                  className="overflow-x-auto text-right mt-1"
                  style={{ fontSize: "0.85em" }}
                >
                  <div className="inline-block px-2 katex-render-target">
                    {equationText}
                  </div>
                </div>
              )}
            </div>
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
          className="absolute inset-0 rounded-[35px] p-4 text-white text-center bg-opacity-90 overflow-hidden"
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
          className="absolute inset-0 rounded-[35px] p-4 text-white text-center bg-opacity-90 overflow-hidden"
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
            cardData.equationBack
          )}
        </div>
      </div>
    </div>
  );
}
