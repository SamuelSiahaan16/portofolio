import {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { useReducedMotion } from "motion/react";
import { TheSvgIcon } from "@/components/icons";
import type { TheSvgIconName } from "@/components/icons/registry";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";

type SkillNodeItem = {
  icon: TheSvgIconName;
  label: string;
};

type OrbitConfig = {
  minRadius?: number;
  maxRadius?: number;
  floatAmplitude?: number;
  nodeCollisionRadius?: number;
  centerCollisionRadius?: number;
};

type SkillsBeamProps = {
  center: SkillNodeItem;
  items: SkillNodeItem[];
  orbit?: OrbitConfig;
  beam?: {
    gradientStartColor?: string;
    gradientStopColor?: string;
    pathColor?: string;
    pathWidth?: number;
    pathOpacity?: number;
    duration?: number;
  };
  className?: string;
  /** Pause simulasi saat section di luar viewport. */
  active?: boolean;
};

type SimNode = {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  floatSpeed: number;
  floatAmp: number;
  curvature: number;
  reverse: boolean;
};

const CENTER = { x: 50, y: 50 };
const FLOAT_STIFFNESS = 0.035;
const COLLISION_STRENGTH = 0.22;
const DAMPING = 0.82;
const MAX_SPEED = 1.4;

function createSeededRandom(seed: string) {
  let state = 0;
  for (let i = 0; i < seed.length; i += 1) {
    state = (state * 31 + seed.charCodeAt(i)) | 0;
  }

  return () => {
    state = (state * 16807 + 1) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function buildSimNodes(items: SkillNodeItem[], orbit: OrbitConfig): SimNode[] {
  const minRadius = orbit.minRadius ?? 34;
  const maxRadius = orbit.maxRadius ?? 47;
  const floatAmplitude = orbit.floatAmplitude ?? 2.8;

  return items.map((item, index) => {
    const rand = createSeededRandom(`${item.icon}-${item.label}-${index}`);
    const angle = rand() * Math.PI * 2;
    const radius = minRadius + rand() * (maxRadius - minRadius);
    const x = CENTER.x + Math.cos(angle) * radius;
    const y = CENTER.y + Math.sin(angle) * radius;

    return {
      baseX: x,
      baseY: y,
      x,
      y,
      vx: 0,
      vy: 0,
      phase: rand() * Math.PI * 2,
      floatSpeed: 0.45 + rand() * 0.35,
      floatAmp: floatAmplitude * (0.65 + rand() * 0.7),
      curvature: (rand() - 0.5) * 80,
      reverse: rand() > 0.5,
    };
  });
}

function clampNode(node: SimNode, padding: number) {
  node.x = Math.min(100 - padding, Math.max(padding, node.x));
  node.y = Math.min(100 - padding, Math.max(padding, node.y));
}

function capVelocity(node: SimNode) {
  const speed = Math.hypot(node.vx, node.vy);
  if (speed > MAX_SPEED) {
    node.vx = (node.vx / speed) * MAX_SPEED;
    node.vy = (node.vy / speed) * MAX_SPEED;
  }
}

function getFloatOffset(node: SimNode, time: number) {
  return {
    x: Math.sin(time * node.floatSpeed + node.phase) * node.floatAmp,
    y: Math.cos(time * node.floatSpeed * 0.88 + node.phase) * node.floatAmp,
  };
}

function applyFloatForce(nodes: SimNode[], dragIdx: number | null, time: number) {
  for (let i = 0; i < nodes.length; i += 1) {
    if (dragIdx === i) continue;

    const node = nodes[i];
    const offset = getFloatOffset(node, time);
    const targetX = node.baseX + offset.x;
    const targetY = node.baseY + offset.y;

    node.vx += (targetX - node.x) * FLOAT_STIFFNESS;
    node.vy += (targetY - node.y) * FLOAT_STIFFNESS;
  }
}

function applyPairSeparation(
  nodes: SimNode[],
  i: number,
  j: number,
  minDist: number,
  dragIdx: number | null,
) {
  const dx = nodes[j].x - nodes[i].x;
  const dy = nodes[j].y - nodes[i].y;
  const dist = Math.hypot(dx, dy) || 0.001;

  if (dist >= minDist) return;

  const overlap = minDist - dist;
  const nx = dx / dist;
  const ny = dy / dist;
  const impulse = overlap * COLLISION_STRENGTH;

  if (dragIdx === i) {
    nodes[j].vx += nx * impulse;
    nodes[j].vy += ny * impulse;
    return;
  }

  if (dragIdx === j) {
    nodes[i].vx -= nx * impulse;
    nodes[i].vy -= ny * impulse;
    return;
  }

  nodes[i].vx -= nx * impulse * 0.5;
  nodes[i].vy -= ny * impulse * 0.5;
  nodes[j].vx += nx * impulse * 0.5;
  nodes[j].vy += ny * impulse * 0.5;
}

function applyCenterSeparation(
  nodes: SimNode[],
  index: number,
  minDist: number,
  dragIdx: number | null,
) {
  const node = nodes[index];
  const dx = node.x - CENTER.x;
  const dy = node.y - CENTER.y;
  const dist = Math.hypot(dx, dy) || 0.001;

  if (dist >= minDist) return;

  const nx = dx / dist;
  const ny = dy / dist;
  const overlap = minDist - dist;
  const impulse = overlap * COLLISION_STRENGTH;

  if (dragIdx === index) {
    node.vx += nx * impulse * 1.4;
    node.vy += ny * impulse * 1.4;
    return;
  }

  node.vx += nx * impulse;
  node.vy += ny * impulse;
}

function resolveCollisions(
  nodes: SimNode[],
  dragIdx: number | null,
  nodeRadius: number,
  centerRadius: number,
) {
  const minNodeDist = nodeRadius * 2;
  const minCenterDist = nodeRadius + centerRadius;

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      applyPairSeparation(nodes, i, j, minNodeDist, dragIdx);
    }
  }

  for (let i = 0; i < nodes.length; i += 1) {
    applyCenterSeparation(nodes, i, minCenterDist, dragIdx);
  }
}

function integrateNodes(
  nodes: SimNode[],
  dragIdx: number | null,
  boundsPadding: number,
) {
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    if (dragIdx === i) continue;

    node.x += node.vx;
    node.y += node.vy;
    node.vx *= DAMPING;
    node.vy *= DAMPING;
    capVelocity(node);
    clampNode(node, boundsPadding);
  }
}

function useStableRefs(count: number) {
  const store = useRef<RefObject<HTMLDivElement | null>[]>([]);
  if (store.current.length !== count) {
    store.current = Array.from({ length: count }, () =>
      createRef<HTMLDivElement>(),
    );
  }
  return store.current;
}

function syncNodesToDom(
  nodes: SimNode[],
  nodeRefs: RefObject<HTMLDivElement | null>[],
) {
  for (let i = 0; i < nodes.length; i += 1) {
    const el = nodeRefs[i].current;
    if (!el) continue;
    el.style.left = `${nodes[i].x}%`;
    el.style.top = `${nodes[i].y}%`;
  }
}

export function SkillsBeam({
  center,
  items,
  orbit,
  beam,
  className,
  active = true,
}: SkillsBeamProps) {
  const orbitConfig = orbit ?? {};
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useStableRefs(items.length);
  const nodesRef = useRef<SimNode[]>([]);
  const dragIndexRef = useRef<number | null>(null);
  const simTimeRef = useRef(0);
  const activeRef = useRef(active);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  activeRef.current = active;

  const nodeRadius = orbitConfig.nodeCollisionRadius ?? 6.8;
  const centerRadius = orbitConfig.centerCollisionRadius ?? 9.5;
  const boundsPadding = 7;

  if (nodesRef.current.length !== items.length) {
    nodesRef.current = buildSimNodes(items, orbitConfig);
  }

  const clientToPercent = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;

    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    };
  }, []);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>, index: number) => {
      event.preventDefault();
      const node = nodesRef.current[index];
      node.vx = 0;
      node.vy = 0;
      dragIndexRef.current = index;
      setDraggingIndex(index);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>, index: number) => {
      if (dragIndexRef.current !== index) return;

      const point = clientToPercent(event.clientX, event.clientY);
      if (!point) return;

      const node = nodesRef.current[index];
      const follow = 0.42;
      node.x += (point.x - node.x) * follow;
      node.y += (point.y - node.y) * follow;
      clampNode(node, boundsPadding);

      resolveCollisions(nodesRef.current, index, nodeRadius, centerRadius);
      integrateNodes(nodesRef.current, index, boundsPadding);

      syncNodesToDom(nodesRef.current, nodeRefs);
    },
    [boundsPadding, centerRadius, clientToPercent, nodeRadius, nodeRefs],
  );

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>, index: number) => {
      if (dragIndexRef.current !== index) return;

      dragIndexRef.current = null;
      setDraggingIndex(null);
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      const node = nodesRef.current[index];
      const offset = getFloatOffset(node, simTimeRef.current);
      node.baseX = node.x - offset.x;
      node.baseY = node.y - offset.y;
      node.vx = 0;
      node.vy = 0;
    },
    [],
  );

  useEffect(() => {
    syncNodesToDom(nodesRef.current, nodeRefs);
  }, [items.length, nodeRefs]);

  useEffect(() => {
    let frameId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      if (activeRef.current) {
        const delta = Math.min((now - lastTime) / 1000, 0.032);
        lastTime = now;
        simTimeRef.current += delta;

        const dragIdx = dragIndexRef.current;
        const nodes = nodesRef.current;

        if (reduceMotion !== true) {
          applyFloatForce(nodes, dragIdx, simTimeRef.current);
        }

        resolveCollisions(nodes, dragIdx, nodeRadius, centerRadius);
        integrateNodes(nodes, dragIdx, boundsPadding);

        syncNodesToDom(nodes, nodeRefs);
      } else {
        lastTime = now;
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [
    boundsPadding,
    centerRadius,
    nodeRadius,
    nodeRefs,
    reduceMotion,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative mx-auto h-[min(68dvh,580px)] w-full min-h-[380px] max-w-6xl touch-none sm:min-h-[440px] lg:max-w-7xl lg:min-h-[500px]",
        className,
      )}
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
        <div
          ref={centerRef}
          className="flex size-20 items-center justify-center rounded-full border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_0_28px_-8px_var(--color-accent)] backdrop-blur-sm sm:size-24 lg:size-28"
        >
          <TheSvgIcon
            name={center.icon}
            size={44}
            className="size-10 sm:size-11 lg:size-12"
          />
        </div>
        <span className="text-center text-xs font-semibold text-[var(--color-ink)] sm:text-sm">
          {center.label}
        </span>
      </div>

      {items.map((item, index) => (
        <div
          key={`${item.icon}-${item.label}`}
          ref={nodeRefs[index]}
          className={cn(
            "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 select-none",
            draggingIndex === index
              ? "z-20 cursor-grabbing"
              : "z-10 cursor-grab",
          )}
          style={{
            left: `${nodesRef.current[index]?.x ?? 50}%`,
            top: `${nodesRef.current[index]?.y ?? 50}%`,
          }}
          onPointerDown={(event) => handlePointerDown(event, index)}
          onPointerMove={(event) => handlePointerMove(event, index)}
          onPointerUp={(event) => handlePointerUp(event, index)}
          onPointerCancel={(event) => handlePointerUp(event, index)}
        >
          <div className="flex size-14 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/90 p-3 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md sm:size-16 lg:size-[4.5rem]">
            <TheSvgIcon
              name={item.icon}
              size={30}
              className="size-7 sm:size-8 lg:size-9"
            />
          </div>
          <span className="pointer-events-none max-w-[6rem] text-center text-[0.7rem] leading-tight font-medium text-[var(--color-muted)] sm:text-xs">
            {item.label}
          </span>
        </div>
      ))}

      {items.map((item, index) => (
        <AnimatedBeam
          key={`beam-${item.icon}-${item.label}`}
          containerRef={containerRef}
          fromRef={nodeRefs[index]}
          toRef={centerRef}
          curvature={nodesRef.current[index]?.curvature ?? 0}
          reverse={nodesRef.current[index]?.reverse ?? false}
          delay={index * 0.35}
          {...beam}
        />
      ))}
    </div>
  );
}
