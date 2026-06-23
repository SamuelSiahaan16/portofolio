import { useColorScheme } from "@/hooks/useColorScheme";
import { cn } from "@/lib/utils";
import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";

export type InteractiveGridBackgroundProps = ComponentProps<"div"> & {
  gridSize?: number;
  gridColor?: string;
  darkGridColor?: string;
  effectColor?: string;
  darkEffectColor?: string;
  trailLength?: number;
  width?: number;
  height?: number;
  idleSpeed?: number;
  glow?: boolean;
  glowRadius?: number;
  children?: ReactNode;
  showFade?: boolean;
  fadeIntensity?: number;
  idleRandomCount?: number;
  pause?: boolean;
};

export function InteractiveGridBackground({
  gridSize = 50,
  gridColor = "#cbcbcb",
  darkGridColor = "#303030",
  effectColor = "rgba(0, 0, 0, 0.6)",
  darkEffectColor = "rgba(255, 255, 255, 0.6)",
  trailLength = 3,
  width,
  height,
  idleSpeed = 0.2,
  glow = true,
  glowRadius = 20,
  children,
  showFade = true,
  fadeIntensity = 20,
  idleRandomCount = 5,
  pause = false,
  className,
  ...props
}: InteractiveGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const lineColor = isDarkMode ? darkGridColor : gridColor;

  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const idleTargetsRef = useRef<{ x: number; y: number }[]>([]);
  const idlePositionsRef = useRef<{ x: number; y: number }[]>([]);
  const mouseActiveRef = useRef(false);
  const lastMouseTimeRef = useRef(Date.now());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      setContainerSize({
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let rect: DOMRect | null = null;
    const container = containerRef.current;

    const updateRect = () => {
      if (container) {
        rect = container.getBoundingClientRect();
      }
    };

    updateRect();

    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      if (!container || pause) return;
      if (!rect) {
        rect = container.getBoundingClientRect();
      }

      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;

      if (rawX < 0 || rawY < 0 || rawX > rect.width || rawY > rect.height) {
        return;
      }

      mouseActiveRef.current = true;
      lastMouseTimeRef.current = Date.now();

      const snappedX = Math.floor(rawX / gridSize);
      const snappedY = Math.floor(rawY / gridSize);

      const last = trailRef.current[0];
      if (!last || last.x !== snappedX || last.y !== snappedY) {
        trailRef.current.unshift({ x: snappedX, y: snappedY });
        if (trailRef.current.length > trailLength) trailRef.current.pop();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [gridSize, trailLength, pause]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = width ?? containerSize.width;
    const canvasHeight = height ?? containerSize.height;
    if (canvasWidth <= 0 || canvasHeight <= 0) return;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const cols = Math.floor(canvasWidth / gridSize);
    const rows = Math.floor(canvasHeight / gridSize);

    const glowColor = isDarkMode ? darkEffectColor : effectColor;

    idleTargetsRef.current = Array.from({ length: idleRandomCount }, () => ({
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    }));
    idlePositionsRef.current = idleTargetsRef.current.map((point) => ({
      ...point,
    }));

    let animationId = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      if (!pause) {
        const idleThreshold = 2000;
        if (Date.now() - lastMouseTimeRef.current > idleThreshold) {
          mouseActiveRef.current = false;

          idlePositionsRef.current.forEach((pos, index) => {
            const target = idleTargetsRef.current[index];
            const dx = target.x - pos.x;
            const dy = target.y - pos.y;

            if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
              idleTargetsRef.current[index] = {
                x: Math.floor(Math.random() * cols),
                y: Math.floor(Math.random() * rows),
              };
            } else {
              pos.x += dx * idleSpeed;
              pos.y += dy * idleSpeed;
            }

            const roundedX = Math.round(pos.x);
            const roundedY = Math.round(pos.y);
            const last = trailRef.current[0];
            if (!last || last.x !== roundedX || last.y !== roundedY) {
              trailRef.current.unshift({ x: roundedX, y: roundedY });
              if (trailRef.current.length > trailLength * idleRandomCount) {
                trailRef.current.pop();
              }
            }
          });
        }

        trailRef.current.forEach((cell, index) => {
          const alpha = 1 - index * (1 / (trailLength + 1));
          const rgbaColor = glowColor.replace(/[\d.]+\)$/g, `${alpha})`);

          ctx.fillStyle = rgbaColor;
          if (glow) {
            ctx.shadowColor = rgbaColor;
            ctx.shadowBlur = glowRadius;
          } else {
            ctx.shadowBlur = 0;
          }

          ctx.fillRect(
            cell.x * gridSize,
            cell.y * gridSize,
            gridSize,
            gridSize,
          );
        });
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [
    gridSize,
    width,
    height,
    containerSize.width,
    containerSize.height,
    effectColor,
    darkEffectColor,
    isDarkMode,
    trailLength,
    idleSpeed,
    glow,
    glowRadius,
    idleRandomCount,
    pause,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn("relative size-full", className)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 1px), linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />

      {showFade ? (
        <div
          className="pointer-events-none absolute inset-0 bg-[var(--color-bg)]"
          style={{
            maskImage: `radial-gradient(ellipse at center, transparent ${fadeIntensity}%, black)`,
            WebkitMaskImage: `radial-gradient(ellipse at center, transparent ${fadeIntensity}%, black)`,
          }}
        />
      ) : null}

      <div className="relative z-[1] size-full">{children}</div>
    </div>
  );
}
