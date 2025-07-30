import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Ripple({ x, y, onComplete }) {
  const rippleRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const ripple = rippleRef.current;

      if (ripple) {
        gsap.fromTo(
          ripple,
          { scale: 0, opacity: 0.6 },
          {
            scale: 3,
            opacity: 0,
            duration: 0.4,
            ease: "power1.out",
            onComplete,
          }
        );
      }
    });

    return () => ctx.revert(); 
  }, [onComplete]);

  return (
    <span
      ref={rippleRef}
      className="absolute pointer-events-none w-10 h-10 rounded-full bg-white bg-opacity-30"
      style={{
        left: x - 20,
        top: y - 20,
        transformOrigin: "center",
        willChange: "transform, opacity", 
        zIndex: 50,
      }}
    />
  );
}
