import { cn } from "@/lib/utils";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect, useRef, type ComponentProps, type ReactNode } from "react";
import * as THREE from "three";

type DottedSurfaceProps = ComponentProps<"div"> & {
  children?: ReactNode;
};

export function DottedSurface({
  className,
  children,
  ...props
}: DottedSurfaceProps) {
  const theme = useColorScheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    animationId: number;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const SEPARATION = 150;
    const AMOUNTX = 40;
    const AMOUNTY = 60;
    const isDark = theme === "dark";
    const fogColor = isDark ? 0x141414 : 0xffffff;
    const particleColor = isDark ? 200 : 0;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(fogColor, 2000, 10000);

    const camera = new THREE.PerspectiveCamera(60, 1, 1, 10000);
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(fogColor, 0);

    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        positions.push(x, 0, z);
        colors.push(particleColor, particleColor, particleColor);
      }
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3),
    );

    const material = new THREE.PointsMaterial({
      size: 8,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    container.appendChild(renderer.domElement);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.pointerEvents = "none";

    const setSize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    setSize();

    let count = 0;
    let animationId = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!reduceMotion) {
        const positionAttribute = geometry.attributes.position;
        const positionArray = positionAttribute.array as Float32Array;

        let i = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
          for (let iy = 0; iy < AMOUNTY; iy++) {
            const index = i * 3;
            positionArray[index + 1] =
              Math.sin((ix + count) * 0.3) * 50 +
              Math.sin((iy + count) * 0.5) * 50;
            i++;
          }
        }

        positionAttribute.needsUpdate = true;
        count += 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    const resizeObserver = new ResizeObserver(setSize);
    resizeObserver.observe(container);

    sceneRef.current = { animationId, renderer, scene };

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationId);

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      sceneRef.current = null;
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  );
}
