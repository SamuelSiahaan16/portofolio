import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import {
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
} from "react";
import { cn } from "@/lib/utils";
import "./shuffle.css";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

type ShuffleDirection = "left" | "right" | "up" | "down";
type AnimationMode = "evenodd" | "random";
type ShuffleTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";

export type ShuffleProps = {
  text: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
  shuffleDirection?: ShuffleDirection;
  duration?: number;
  maxDelay?: number;
  ease?: string | gsap.EaseFunction;
  threshold?: number;
  rootMargin?: string;
  tag?: ShuffleTag;
  textAlign?: CSSProperties["textAlign"];
  onShuffleComplete?: () => void;
  shuffleTimes?: number;
  animationMode?: AnimationMode;
  loop?: boolean;
  loopDelay?: number;
  stagger?: number;
  scrambleCharset?: string;
  colorFrom?: string;
  colorTo?: string;
  triggerOnce?: boolean;
  respectReducedMotion?: boolean;
  triggerOnHover?: boolean;
};

export function Shuffle({
  text,
  id,
  className = "",
  style = {},
  shuffleDirection = "right",
  duration = 0.35,
  maxDelay = 0,
  ease = "power3.out",
  threshold = 0.1,
  rootMargin = "-100px",
  tag = "p",
  textAlign = "center",
  onShuffleComplete,
  shuffleTimes = 1,
  animationMode = "evenodd",
  loop = false,
  loopDelay = 0,
  stagger = 0.03,
  scrambleCharset = "",
  colorFrom,
  colorTo,
  triggerOnce = true,
  respectReducedMotion = true,
  triggerOnHover = true,
}: ShuffleProps) {
  const ref = useRef<HTMLElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [ready, setReady] = useState(false);

  const splitRef = useRef<GSAPSplitText | null>(null);
  const wrappersRef = useRef<HTMLSpanElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const playingRef = useRef(false);
  const hoverHandlerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!("fonts" in document)) {
      setFontsLoaded(true);
      return;
    }

    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
      return;
    }

    void document.fonts.ready.then(() => setFontsLoaded(true));
  }, []);

  const scrollTriggerStart = useMemo(() => {
    const startPct = (1 - threshold) * 100;
    const match = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin || "");
    const marginValue = match ? Number.parseFloat(match[1]) : 0;
    const marginUnit = match?.[2] || "px";
    const sign =
      marginValue === 0
        ? ""
        : marginValue < 0
          ? `-=${Math.abs(marginValue)}${marginUnit}`
          : `+=${marginValue}${marginUnit}`;

    return `top ${startPct}%${sign}`;
  }, [rootMargin, threshold]);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;

      if (
        respectReducedMotion &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        setReady(true);
        onShuffleComplete?.();
        return;
      }

      const el = ref.current;

      const removeHover = () => {
        if (hoverHandlerRef.current && ref.current) {
          ref.current.removeEventListener("mouseenter", hoverHandlerRef.current);
          hoverHandlerRef.current = null;
        }
      };

      const teardown = () => {
        tlRef.current?.kill();
        tlRef.current = null;

        if (wrappersRef.current.length) {
          wrappersRef.current.forEach((wrap) => {
            const inner = wrap.firstElementChild;
            const orig = inner?.querySelector<HTMLElement>('[data-orig="1"]');
            if (orig && wrap.parentNode) {
              wrap.parentNode.replaceChild(orig, wrap);
            }
          });
          wrappersRef.current = [];
        }

        try {
          splitRef.current?.revert();
        } catch {
          /* noop */
        }

        splitRef.current = null;
        playingRef.current = false;
      };

      const build = () => {
        teardown();

        splitRef.current = new GSAPSplitText(el, {
          type: "chars",
          charsClass: "shuffle-char",
          wordsClass: "shuffle-word",
          linesClass: "shuffle-line",
          smartWrap: true,
          reduceWhiteSpace: false,
        });

        const chars = splitRef.current.chars || [];
        wrappersRef.current = [];

        const rolls = Math.max(1, Math.floor(shuffleTimes));
        const randomChar = (charset: string) =>
          charset.charAt(Math.floor(Math.random() * charset.length)) || "";

        chars.forEach((charNode) => {
          const ch = charNode as HTMLElement;
          const parent = ch.parentElement;
          if (!parent) return;

          const width = ch.getBoundingClientRect().width;
          const height = ch.getBoundingClientRect().height;
          if (!width) return;

          const wrap = document.createElement("span");
          Object.assign(wrap.style, {
            display: "inline-block",
            overflow: "hidden",
            width: `${width}px`,
            height:
              shuffleDirection === "up" || shuffleDirection === "down"
                ? `${height}px`
                : "auto",
            verticalAlign: "bottom",
          });

          const inner = document.createElement("span");
          Object.assign(inner.style, {
            display: "inline-block",
            whiteSpace:
              shuffleDirection === "up" || shuffleDirection === "down"
                ? "normal"
                : "nowrap",
            willChange: "transform",
          });

          parent.insertBefore(wrap, ch);
          wrap.appendChild(inner);

          const firstOrig = ch.cloneNode(true) as HTMLElement;
          Object.assign(firstOrig.style, {
            display:
              shuffleDirection === "up" || shuffleDirection === "down"
                ? "block"
                : "inline-block",
            width: `${width}px`,
            textAlign: "center",
          });

          ch.setAttribute("data-orig", "1");
          Object.assign(ch.style, {
            display:
              shuffleDirection === "up" || shuffleDirection === "down"
                ? "block"
                : "inline-block",
            width: `${width}px`,
            textAlign: "center",
          });

          inner.appendChild(firstOrig);

          for (let index = 0; index < rolls; index += 1) {
            const copy = ch.cloneNode(true) as HTMLElement;
            if (scrambleCharset) {
              copy.textContent = randomChar(scrambleCharset);
            }
            Object.assign(copy.style, {
              display:
                shuffleDirection === "up" || shuffleDirection === "down"
                  ? "block"
                  : "inline-block",
              width: `${width}px`,
              textAlign: "center",
            });
            inner.appendChild(copy);
          }

          inner.appendChild(ch);

          const steps = rolls + 1;

          if (shuffleDirection === "right" || shuffleDirection === "down") {
            const firstCopy = inner.firstElementChild;
            const real = inner.lastElementChild;
            if (real) inner.insertBefore(real, inner.firstChild);
            if (firstCopy) inner.appendChild(firstCopy);
          }

          let startX = 0;
          let finalX = 0;
          let startY = 0;
          let finalY = 0;

          if (shuffleDirection === "right") {
            startX = -steps * width;
            finalX = 0;
          } else if (shuffleDirection === "left") {
            startX = 0;
            finalX = -steps * width;
          } else if (shuffleDirection === "down") {
            startY = -steps * height;
            finalY = 0;
          } else if (shuffleDirection === "up") {
            startY = 0;
            finalY = -steps * height;
          }

          if (shuffleDirection === "left" || shuffleDirection === "right") {
            gsap.set(inner, { x: startX, y: 0, force3D: true });
            inner.setAttribute("data-start-x", String(startX));
            inner.setAttribute("data-final-x", String(finalX));
          } else {
            gsap.set(inner, { x: 0, y: startY, force3D: true });
            inner.setAttribute("data-start-y", String(startY));
            inner.setAttribute("data-final-y", String(finalY));
          }

          if (colorFrom) inner.style.color = colorFrom;

          wrappersRef.current.push(wrap);
        });
      };

      const inners = () =>
        wrappersRef.current
          .map((wrapper) => wrapper.firstElementChild)
          .filter((inner): inner is HTMLElement => inner instanceof HTMLElement);

      const randomizeScrambles = () => {
        if (!scrambleCharset) return;

        wrappersRef.current.forEach((wrapper) => {
          const strip = wrapper.firstElementChild;
          if (!strip) return;

          const kids = Array.from(strip.children);
          for (let index = 1; index < kids.length - 1; index += 1) {
            kids[index].textContent = scrambleCharset.charAt(
              Math.floor(Math.random() * scrambleCharset.length),
            );
          }
        });
      };

      const cleanupToStill = () => {
        wrappersRef.current.forEach((wrapper) => {
          const strip = wrapper.firstElementChild;
          if (!(strip instanceof HTMLElement)) return;

          const real = strip.querySelector<HTMLElement>('[data-orig="1"]');
          if (!real) return;

          strip.replaceChildren(real);
          strip.style.transform = "none";
          strip.style.willChange = "auto";
        });
      };

      const play = () => {
        const strips = inners();
        if (!strips.length) return;

        playingRef.current = true;
        const isVertical =
          shuffleDirection === "up" || shuffleDirection === "down";

        const timeline = gsap.timeline({
          smoothChildTiming: true,
          repeat: loop ? -1 : 0,
          repeatDelay: loop ? loopDelay : 0,
          onRepeat: () => {
            if (scrambleCharset) randomizeScrambles();
            if (isVertical) {
              gsap.set(strips, {
                y: (_index, target) =>
                  Number.parseFloat(target.getAttribute("data-start-y") || "0"),
              });
            } else {
              gsap.set(strips, {
                x: (_index, target) =>
                  Number.parseFloat(target.getAttribute("data-start-x") || "0"),
              });
            }
            onShuffleComplete?.();
          },
          onComplete: () => {
            playingRef.current = false;
            if (!loop) {
              cleanupToStill();
              if (colorTo) gsap.set(strips, { color: colorTo });
              onShuffleComplete?.();
              armHover();
            }
          },
        });

        const addTween = (targets: HTMLElement[], at: number) => {
          const vars: gsap.TweenVars = {
            duration,
            ease,
            force3D: true,
            stagger: animationMode === "evenodd" ? stagger : 0,
          };

          if (isVertical) {
            vars.y = (_index, target) =>
              Number.parseFloat(target.getAttribute("data-final-y") || "0");
          } else {
            vars.x = (_index, target) =>
              Number.parseFloat(target.getAttribute("data-final-x") || "0");
          }

          timeline.to(targets, vars, at);

          if (colorFrom && colorTo) {
            timeline.to(targets, { color: colorTo, duration, ease }, at);
          }
        };

        if (animationMode === "evenodd") {
          const odd = strips.filter((_strip, index) => index % 2 === 1);
          const even = strips.filter((_strip, index) => index % 2 === 0);
          const oddTotal = duration + Math.max(0, odd.length - 1) * stagger;
          const evenStart = odd.length ? oddTotal * 0.7 : 0;
          if (odd.length) addTween(odd, 0);
          if (even.length) addTween(even, evenStart);
        } else {
          strips.forEach((strip) => {
            const delay = Math.random() * maxDelay;
            const vars: gsap.TweenVars = {
              duration,
              ease,
              force3D: true,
            };

            if (isVertical) {
              vars.y = Number.parseFloat(
                strip.getAttribute("data-final-y") || "0",
              );
            } else {
              vars.x = Number.parseFloat(
                strip.getAttribute("data-final-x") || "0",
              );
            }

            timeline.to(strip, vars, delay);

            if (colorFrom && colorTo) {
              timeline.fromTo(
                strip,
                { color: colorFrom },
                { color: colorTo, duration, ease },
                delay,
              );
            }
          });
        }

        tlRef.current = timeline;
      };

      const armHover = () => {
        if (!triggerOnHover || !ref.current) return;

        removeHover();

        const handler = () => {
          if (playingRef.current) return;
          build();
          if (scrambleCharset) randomizeScrambles();
          play();
        };

        hoverHandlerRef.current = handler;
        ref.current.addEventListener("mouseenter", handler);
      };

      const create = () => {
        build();
        if (scrambleCharset) randomizeScrambles();
        play();
        armHover();
        setReady(true);
      };

      const scrollTrigger = ScrollTrigger.create({
        trigger: el,
        start: scrollTriggerStart,
        once: triggerOnce,
        onEnter: create,
      });

      return () => {
        scrollTrigger.kill();
        removeHover();
        teardown();
        setReady(false);
      };
    },
    {
      dependencies: [
        animationMode,
        colorFrom,
        colorTo,
        duration,
        ease,
        fontsLoaded,
        loop,
        loopDelay,
        maxDelay,
        onShuffleComplete,
        respectReducedMotion,
        scrambleCharset,
        scrollTriggerStart,
        shuffleDirection,
        shuffleTimes,
        stagger,
        text,
        triggerOnHover,
        triggerOnce,
      ],
      scope: ref,
    },
  );

  const commonStyle = useMemo(
    (): CSSProperties => ({ textAlign, ...style }),
    [style, textAlign],
  );

  const classes = useMemo(
    () => cn("shuffle-parent", ready && "is-ready", className),
    [className, ready],
  );

  const Tag = tag as ElementType;

  return createElement(
    Tag,
    { ref, id, className: classes, style: commonStyle },
    text,
  );
}
