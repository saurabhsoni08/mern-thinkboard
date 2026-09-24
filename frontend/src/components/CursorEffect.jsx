import { useEffect, useRef } from "react";

const CursorEffect = () => {
  const cursorRef = useRef(null);
  const glowRef = useRef(null);
  const trailRefs = useRef([]);

  useEffect(() => {
    const cursor = cursorRef.current;
    const glow = glowRef.current;
    const trails = trailRefs.current;

    if (!cursor || !glow) return;

    /* =====================================================
       INITIAL POSITION
       ===================================================== */

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let cursorX = mouseX;
    let cursorY = mouseY;

    const trailPositions = trails.map(() => ({
      x: mouseX,
      y: mouseY,
    }));

    let animationFrame;

    /* =====================================================
       POINTER MOVE
       ===================================================== */

    const handlePointerMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      /*
        IMPORTANT:
        Directly position the main cursor.
        This avoids transform conflicts.
      */

      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;

      glow.style.left = `${mouseX}px`;
      glow.style.top = `${mouseY}px`;

      document.documentElement.style.setProperty("--mouse-x", `${mouseX}px`);

      document.documentElement.style.setProperty("--mouse-y", `${mouseY}px`);
    };

    /* =====================================================
       INTERACTIVE HOVER
       ===================================================== */

    const handlePointerOver = (event) => {
      const interactive = event.target.closest(
        "a, button, input, textarea, [data-magnetic]",
      );

      if (!interactive) return;

      cursor.classList.add("cursor-active");
      glow.classList.add("cursor-active");
    };

    const handlePointerOut = (event) => {
      const interactive = event.target.closest(
        "a, button, input, textarea, [data-magnetic]",
      );

      if (!interactive) return;

      const nextElement = event.relatedTarget;

      if (nextElement && interactive.contains(nextElement)) {
        return;
      }

      cursor.classList.remove("cursor-active");
      glow.classList.remove("cursor-active");
    };

    /* =====================================================
       MAGNETIC TARGET
       ===================================================== */

    const findMagneticTarget = () => {
      const elements = document.querySelectorAll("a, button, [data-magnetic]");

      let closestElement = null;
      let closestDistance = Infinity;

      let targetX = mouseX;
      let targetY = mouseY;

      let strength = 0;
      let range = 130;

      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();

        if (rect.width === 0 || rect.height === 0) {
          return;
        }

        const style = window.getComputedStyle(element);

        if (style.display === "none" || style.visibility === "hidden") {
          return;
        }

        const centerX = rect.left + rect.width / 2;

        const centerY = rect.top + rect.height / 2;

        const dx = centerX - mouseX;
        const dy = centerY - mouseY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        /* ================================================
           DEFAULT MAGNETIC STRENGTH
           ================================================ */

        let elementStrength = 0.28;

        if (element.dataset.magnetic) {
          elementStrength = parseFloat(element.dataset.magnetic) || 0.28;
        } else if (element.tagName === "BUTTON") {
          elementStrength = 0.34;
        }

        /* ================================================
           MAGNETIC RANGE
           ================================================ */

        let elementRange = 130;

        if (element.dataset.magneticRange) {
          elementRange = parseFloat(element.dataset.magneticRange) || 130;
        }

        /* ================================================
           FIND CLOSEST ELEMENT
           ================================================ */

        if (distance < elementRange && distance < closestDistance) {
          closestElement = element;
          closestDistance = distance;

          strength = elementStrength;
          range = elementRange;

          /*
            Attraction increases
            when cursor gets closer.
          */

          const proximity = 1 - distance / elementRange;

          const pull = proximity * elementStrength;

          targetX = mouseX + dx * pull;

          targetY = mouseY + dy * pull;
        }
      });

      return {
        targetX,
        targetY,
        closestElement,
        closestDistance,
        strength,
        range,
      };
    };

    /* =====================================================
       ANIMATION
       ===================================================== */

    const animate = () => {
      const {
        targetX,
        targetY,
        closestElement,
        closestDistance,
        strength,
        range,
      } = findMagneticTarget();

      /* ===================================================
         SMOOTH MAGNETIC MOVEMENT
         =================================================== */

      cursorX += (targetX - cursorX) * 0.18;

      cursorY += (targetY - cursorY) * 0.18;

      /*
        MAIN CURSOR POSITION
      */

      cursor.style.left = `${cursorX}px`;

      cursor.style.top = `${cursorY}px`;

      /* ===================================================
         MAGNETIC VISUAL
         =================================================== */

      if (closestElement) {
        cursor.classList.add("magnetic-cursor");

        const rect = closestElement.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;

        const centerY = rect.top + rect.height / 2;

        const angle =
          Math.atan2(centerY - cursorY, centerX - cursorX) * (180 / Math.PI);

        const normalizedDistance = Math.max(
          0,
          Math.min(1, closestDistance / range),
        );

        cursor.style.setProperty("--magnetic-angle", `${angle}deg`);

        cursor.style.setProperty("--magnetic-distance", normalizedDistance);

        cursor.style.setProperty("--magnetic-strength", strength);
      } else {
        cursor.classList.remove("magnetic-cursor");
      }

      /* ===================================================
         TRAIL
         =================================================== */

      let previousX = cursorX;
      let previousY = cursorY;

      trailPositions.forEach((position, index) => {
        const delay = 0.15 + index * 0.015;

        position.x += (previousX - position.x) * delay;

        position.y += (previousY - position.y) * delay;

        const trail = trails[index];

        if (trail) {
          const scale = Math.max(0.25, 1 - index * 0.08);

          const opacity = Math.max(0.05, 0.45 - index * 0.035);

          trail.style.left = `${position.x}px`;

          trail.style.top = `${position.y}px`;

          trail.style.transform = `translate(-50%, -50%) scale(${scale})`;

          trail.style.opacity = opacity;
        }

        previousX = position.x;
        previousY = position.y;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    /* =====================================================
       EVENT LISTENERS
       ===================================================== */

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    document.addEventListener("pointerover", handlePointerOver);

    document.addEventListener("pointerout", handlePointerOut);

    /* Start */

    animationFrame = requestAnimationFrame(animate);

    /* =====================================================
       CLEANUP
       ===================================================== */

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);

      document.removeEventListener("pointerover", handlePointerOver);

      document.removeEventListener("pointerout", handlePointerOut);

      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      {/* =================================================
          AMBIENT GLOW
          ================================================= */}

      <div
        ref={glowRef}
        className="cursor-glow pointer-events-none fixed z-[9997]"
      />

      {/* =================================================
          CURSOR TRAIL
          ================================================= */}

      <div className="pointer-events-none fixed inset-0 z-[9998]">
        {Array.from({ length: 10 }).map((_, index) => (
          <span
            key={index}
            ref={(element) => {
              trailRefs.current[index] = element;
            }}
            className="cursor-trail"
          />
        ))}
      </div>

      {/* =================================================
          MAIN CURSOR
          ================================================= */}

      <div
        ref={cursorRef}
        className="cursor-main pointer-events-none fixed z-[9999]"
      >
        <div className="cursor-core" />

        <div className="cursor-ring" />

        <div className="cursor-magnetic-line" />
      </div>
    </>
  );
};

export default CursorEffect;
