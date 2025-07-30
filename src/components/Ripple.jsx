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
            scale: 4,
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
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
  className="absolute pointer-events-none w-6 h-6 rounded-full border-4 border-primary-300 border-opacity-20"
  style={{
    left: `${x - 20}px`,
    top: `${y - 20}px`,
    transformOrigin: "center",
    willChange: "transform, opacity",
    zIndex: 50,
  }}
/>

  );
}
