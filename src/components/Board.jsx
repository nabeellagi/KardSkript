import React, { useRef, useState, useCallback, useMemo } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import FlashCard from "./FlashCard";
import Ripple from "./Ripple";
import "../styles/global.css";

export default function Board({ data }) {
  const boardRef = useRef(null);
  const [isDraggingCard, setIsDraggingCard] = useState(false);
  const [ripples, setRipples] = useState([]);

  const handleClick = useCallback((e) => {
    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
  }, []);

  const handleRippleComplete = (id) => {
    setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
  };

  const processedCards = useMemo(() => {
    if (!data) return [];

    const manualCards = [];
    const autoCards = [];

    data.forEach((card, idx) => {
      if (card.x != null && card.y != null) {
        manualCards.push(card);
      } else {
        autoCards.push({ ...card, _originalIndex: idx });
      }
    });

    // Grid layout for auto cards (5 per row)
    const GRID_SPACING_X = 350; // horizontal spacing between cards
    const GRID_SPACING_Y = 450; // vertical spacing
    const START_X = 50;
    const START_Y = 50;

    const autoCardsWithPos = autoCards.map((card, i) => {
      const row = Math.floor(i / 5);
      const col = i % 5;
      return {
        ...card,
        x: START_X + col * GRID_SPACING_X,
        y: START_Y + row * GRID_SPACING_Y,
      };
    });

    // Merge both categories back, preserving original order
    const merged = [...manualCards, ...autoCardsWithPos];
    return merged;
  }, [data]);

  return (
    <div
      ref={boardRef}
      className="relative w-screen h-screen bg-base-100 overflow-hidden"
      onClick={handleClick}
    >
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      <TransformWrapper
        minScale={0.3}
        maxScale={3}
        disabled={isDraggingCard}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: true }}
        panning={{ velocityDisabled: true }}
        limitToBounds={false}
        centerOnInit={false}
        centerZoomedOut={false}
      >
        <TransformComponent wrapperClass="w-full h-full">
          <div className="relative z-10 w-[100vw] h-[100vh] select-none">
            {processedCards.map((card, index) => (
              <FlashCard
                key={index}
                card={card}
                index={index}
                onDragStart={() => setIsDraggingCard(true)}
                onDragEnd={() => setIsDraggingCard(false)}
              />
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>

      <div className="absolute inset-0 z-50 pointer-events-none">
        {ripples.map(({ id, x, y }) => (
          <Ripple
            key={id}
            x={x}
            y={y}
            onComplete={() => handleRippleComplete(id)}
          />
        ))}
      </div>
    </div>
  );
}
