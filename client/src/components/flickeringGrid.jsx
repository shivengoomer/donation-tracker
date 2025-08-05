"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const FlickeringGrid = ({
  squareSize = 6,
  gridGap = 50,
  flickerChance = 0.1,
  color = "white",
  width,
  height,
  maxOpacity = 0.3,
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const memoizedColor = useMemo(() => {
    if (typeof window === "undefined") return "rgba(0,0,0,";
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "rgba(255,0,0,";
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data);
    return `rgba(${r}, ${g}, ${b},`;
  }, [color]);

  const setupCanvas = useCallback((canvas, width, height) => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const cols = Math.floor(width / (squareSize + gridGap));
    const rows = Math.floor(height / (squareSize + gridGap));
    const squares = new Float32Array(cols * rows);
    for (let i = 0; i < squares.length; i++) {
      squares[i] = Math.random() * maxOpacity;
    }

    return { cols, rows, squares, dpr };
  }, [squareSize, gridGap, maxOpacity]);

  const updateSquares = useCallback((squares, deltaTime) => {
    for (let i = 0; i < squares.length; i++) {
      if (Math.random() < flickerChance * deltaTime) {
        squares[i] = Math.random() * maxOpacity;
      }
    }
  }, [flickerChance, maxOpacity]);

  const drawGrid = useCallback((ctx, width, height, cols, rows, squares, dpr) => {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const opacity = squares[i * rows + j];
        ctx.fillStyle = `${memoizedColor}${opacity})`;
        ctx.fillRect(
          i * (squareSize + gridGap) * dpr,
          j * (squareSize + gridGap) * dpr,
          squareSize * dpr,
          squareSize * dpr
        );
      }
    }
  }, [memoizedColor, squareSize, gridGap]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let gridParams;
    let animationId;
    let lastTime = 0;

    const updateCanvasSize = () => {
      const w = width || container.clientWidth;
      const h = height || container.clientHeight;
      setCanvasSize({ width: w, height: h });
      gridParams = setupCanvas(canvas, w, h);
    };

    const animate = (time) => {
      if (!isInView) return;
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      updateSquares(gridParams.squares, delta);
      drawGrid(ctx, canvas.width, canvas.height, gridParams.cols, gridParams.rows, gridParams.squares, gridParams.dpr);
      animationId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(updateCanvasSize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0 });

    updateCanvasSize();
    resizeObserver.observe(container);
    intersectionObserver.observe(canvas);
    if (isInView) animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [setupCanvas, updateSquares, drawGrid, isInView, width, height]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <canvas
        ref={canvasRef}
        style={{ width: canvasSize.width, height: canvasSize.height, pointerEvents: "none" }}
      />
    </div>
  );
};

export default FlickeringGrid;
