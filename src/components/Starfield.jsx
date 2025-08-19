// src/components/Starfield.jsx
import React, { useRef, useEffect } from "react";

export default function Starfield({
  starColor = "#ffffffff",
  starSize = 3,
  starMinScale = 0.1,
  overflowThreshold = 50,
} = {}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const starsRef = useRef([]);
  const pointerRef = useRef({ x: null, y: null });
  const touchRef = useRef(false);
  const velocityRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 });
  const dimsRef = useRef({ scale: 1, w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // create stars based on current viewport size
    function generate() {
      const STAR_COUNT = Math.floor((window.innerWidth + window.innerHeight) / 8);
      starsRef.current = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        starsRef.current.push({
          x: 0,
          y: 0,
          z: starMinScale + Math.random() * (1 - starMinScale),
        });
      }
    }

    function placeStar(s) {
      s.x = Math.random() * dimsRef.current.w;
      s.y = Math.random() * dimsRef.current.h;
    }

    function recycleStar(star) {
      let direction = "z";
      let vx = Math.abs(velocityRef.current.x),
        vy = Math.abs(velocityRef.current.y);

      if (vx > 1 || vy > 1) {
        let axis;
        if (vx > vy) {
          axis = Math.random() < vx / (vx + vy) ? "h" : "v";
        } else {
          axis = Math.random() < vy / (vx + vy) ? "v" : "h";
        }

        if (axis === "h") {
          direction = velocityRef.current.x > 0 ? "l" : "r";
        } else {
          direction = velocityRef.current.y > 0 ? "t" : "b";
        }
      }

      star.z = starMinScale + Math.random() * (1 - starMinScale);

      if (direction === "z") {
        star.z = 0.1;
        star.x = Math.random() * dimsRef.current.w;
        star.y = Math.random() * dimsRef.current.h;
      } else if (direction === "l") {
        star.x = -overflowThreshold;
        star.y = dimsRef.current.h * Math.random();
      } else if (direction === "r") {
        star.x = dimsRef.current.w + overflowThreshold;
        star.y = dimsRef.current.h * Math.random();
      } else if (direction === "t") {
        star.x = dimsRef.current.w * Math.random();
        star.y = -overflowThreshold;
      } else if (direction === "b") {
        star.x = dimsRef.current.w * Math.random();
        star.y = dimsRef.current.h + overflowThreshold;
      }
    }

    function resize() {
      dimsRef.current.scale = window.devicePixelRatio || 1;
      dimsRef.current.w = Math.floor(window.innerWidth * dimsRef.current.scale);
      dimsRef.current.h = Math.floor(window.innerHeight * dimsRef.current.scale);

      // set canvas pixel size for crisp rendering
      canvas.width = dimsRef.current.w;
      canvas.height = dimsRef.current.h;

      // CSS should remain full viewport
      canvas.style.width = "100%";
      canvas.style.height = "100%";

      // if stars exist place them inside new bounds; if none, generate
      if (!starsRef.current.length) generate();
      starsRef.current.forEach(placeStar);
    }

    function update() {
      velocityRef.current.tx *= 0.96;
      velocityRef.current.ty *= 0.96;

      velocityRef.current.x += (velocityRef.current.tx - velocityRef.current.x) * 0.8;
      velocityRef.current.y += (velocityRef.current.ty - velocityRef.current.y) * 0.8;

      starsRef.current.forEach((star) => {
        star.x += velocityRef.current.x * star.z;
        star.y += velocityRef.current.y * star.z;

        star.x += (star.x - dimsRef.current.w / 2) * velocityRef.current.z * star.z;
        star.y += (star.y - dimsRef.current.h / 2) * velocityRef.current.z * star.z;
        star.z += velocityRef.current.z;

        if (
          star.x < -overflowThreshold ||
          star.x > dimsRef.current.w + overflowThreshold ||
          star.y < -overflowThreshold ||
          star.y > dimsRef.current.h + overflowThreshold
        ) {
          recycleStar(star);
        }
      });
    }

    function render() {
      // clear whole pixel area
      ctx.clearRect(0, 0, dimsRef.current.w, dimsRef.current.h);

      starsRef.current.forEach((star) => {
        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineWidth = starSize * star.z * dimsRef.current.scale;
        ctx.globalAlpha = 0.5 + 0.5 * Math.random();
        ctx.strokeStyle = starColor;
        ctx.moveTo(star.x, star.y);

        let tailX = velocityRef.current.x * 2;
        let tailY = velocityRef.current.y * 2;
        if (Math.abs(tailX) < 0.1) tailX = 0.5;
        if (Math.abs(tailY) < 0.1) tailY = 0.5;

        ctx.lineTo(star.x + tailX, star.y + tailY);
        ctx.stroke();
      });
    }

    function step() {
      update();
      render();
      rafRef.current = requestAnimationFrame(step);
    }

    function movePointer(x, y) {
      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      if (typeof px === "number" && typeof py === "number") {
        const ox = x - px,
          oy = y - py;
        velocityRef.current.tx = velocityRef.current.tx + (ox / (8 * dimsRef.current.scale)) * (touchRef.current ? 1 : -1);
        velocityRef.current.ty = velocityRef.current.ty + (oy / (8 * dimsRef.current.scale)) * (touchRef.current ? 1 : -1);
      }
      pointerRef.current.x = x;
      pointerRef.current.y = y;
    }

    // --- unified pointer handlers (we listen on window so canvas can be pointer-events:none) ---
    function onMouseMove(e) {
      touchRef.current = false;
      // convert to canvas pixel coords by multiplying with devicePixelRatio
      movePointer(e.clientX * dimsRef.current.scale, e.clientY * dimsRef.current.scale);
    }
    function onTouchMove(e) {
      touchRef.current = true;
      const t = e.touches[0];
      if (t) movePointer(t.clientX * dimsRef.current.scale, t.clientY * dimsRef.current.scale);
      // prevent page scroll while touching the background
      e.preventDefault?.();
    }
    function onPointerLeave() {
      pointerRef.current.x = null;
      pointerRef.current.y = null;
    }

    // init
    generate();
    resize();
    step();

    // use window listeners so the canvas element can have pointer-events:none
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onPointerLeave);
    document.addEventListener("mouseleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onPointerLeave);
      document.removeEventListener("mouseleave", onPointerLeave);
    };
  }, [starColor, starSize, starMinScale, overflowThreshold]);

  // wrapper: fixed full-screen with your theme color + subtle gradients.
  // canvas has pointerEvents none so it won't block clicks; we read pointer from window.
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        backgroundColor: "#010b1fff", // change this if you want different base color
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(circle at top right, rgba(121, 68, 154, 0.13), transparent), radial-gradient(circle at 20% 80%, rgba(41, 196, 255, 0.08), transparent)",
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
