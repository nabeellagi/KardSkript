import React, { useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import FlashCard from "./FlashCard";
import '../styles/global.css'

export default function Board({ data }) {
  const boardRef = useRef(null);
  const [isDraggingCard, setIsDraggingCard] = useState(false);

  return (
    <div className="w-screen h-screen bg-base-100 overflow-hidden">
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
          <div
            ref={boardRef}
            className="relative select-none"
            style={{
              width: "300vw",
              height: "300vh",
              backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          >
            {(data || []).map((card, index) => (
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
    </div>
  );
}
