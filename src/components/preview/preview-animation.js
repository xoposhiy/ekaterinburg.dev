import anime from "animejs";
import {
  getDimensions,
  onScrollListener,
  SVG_DOCTYPE,
  checkIsMobile,
  clamp,
} from "./helpers";

export function initPreviewAnimation() {
  const wrapperElement = document.querySelector(".preview");
  const graphicsElement = document.querySelector(".preview__graphics");

  // setup circles
  const CIRCLES = 32;
  const windowRatio = window.innerHeight / window.innerWidth;
  const MIN_SCALE = 1.8;
  const MAX_SCALE = clamp(windowRatio * 7, 2, checkIsMobile() ? 4.5 : 3.2);
  const COLORS = ["#00b4ff", "#ffd400", "#00b400"];
  const ANIMATION = [
    // "linear",
    "easeOutQuad",
    "easeOutCubic",
    "easeOutQuart",
    "easeOutQuint",
    "easeOutSine",
    "easeOutExpo",
    "easeOutCirc",
    "easeOutBack",
    "easeOutElastic",
    // "easeInQuad",
    // "easeInCubic",
    // "easeInQuart",
    // "easeInQuint",
    // "easeInSine",
    // "easeInExpo",
    // "easeInCirc",
    // "easeInBack",
    // "easeInElastic",
    // "easeInQuad",
    // "easeInOutCubic",
    // "easeInOutQuart",
    // "easeInOutQuint",
    // "easeInOutSine",
    // "easeInOutExpo",
    // "easeInOutCirc",
    // "easeInOutBack",
    // "easeInOutElastic",
  ];

  const circles = Array.from({ length: CIRCLES }, (_, i) => {
    const isMobile = checkIsMobile();
    const strokeWidth = isMobile
      ? 100 / (i * i) //
      : 40 / (i * i);
    const strokeRadius = isMobile
      ? 70 / Math.log(i / 2) - 15 //
      : 70 / Math.log(i) - 15;

    return { strokeWidth, strokeRadius };
  })
    .filter(
      ({ strokeWidth, strokeRadius }) => strokeWidth < 8 && strokeRadius < 28
    )
    .map(({ strokeWidth, strokeRadius }) => {
      const circle = document.createElementNS(SVG_DOCTYPE, "circle");

      circle.setAttribute("stroke-width", `${strokeWidth}vw`);
      circle.setAttribute("stroke", COLORS[anime.random(0, COLORS.length - 1)]);
      circle.setAttribute("fill", "none");
      circle.setAttribute("r", `${strokeRadius}vw`);
      circle.setAttribute(
        "stroke-dasharray",
        `
      ${anime.random(0, 200)}
      ${anime.random(0, 200)}
      ${anime.random(0, 200)}
      ${anime.random(0, 200)}
      ${anime.random(0, 200)}
      ${anime.random(0, 200)}
      ${anime.random(0, 200)}`
      );

      return circle;
    });

  // setup fadein
  const fadeIn = anime.timeline({ autoplay: true });
  circles.map((el) => {
    fadeIn.add(
      {
        targets: el,
        opacity: 1,
        duration: anime.random(2000, 5000),
        easing: ANIMATION[anime.random(0, ANIMATION.length - 1)],
      },
      0
    );
  });

  // setup animation
  const timeline = anime.timeline({
    autoplay: true,
    loop: true,
    direction: "alternate",
  });
  circles.map((el, i) => {
    timeline.add(
      {
        targets: el,
        scale: anime.random(MIN_SCALE, MAX_SCALE),
        rotate: "360deg",
        duration: anime.random(10000, 30000),
        easing: ANIMATION[anime.random(0, ANIMATION.length - 1)],
      },
      0
    );
  });

  // add circles to html
  const svg = graphicsElement;
  circles.map((circle) => svg.prepend(circle));

  // add onScroll logic
  onScrollListener({
    element: wrapperElement,
    onStartScroll: () => {
      timeline.pause();
      timeline.seek(timeline.duration * (timeline.progress * 0.01) + 10);
    },
    onScroll: (scrollPosition) => {
      const current = timeline.duration * (timeline.progress * 0.01);
      const scroll = timeline.duration * (scrollPosition * 0.01);
      timeline.seek((current + scroll) / 2);
    },
    onEndScroll: timeline.play,
  });

  // add onResize logic
  function onResize() {
    const { vw, vh } = getDimensions();
    const ORIGIN = { x: "50%", y: "-50%" };

    svg.setAttribute("width", vw);
    svg.setAttribute("heigth", vh);
    svg.setAttribute("viewBox", `0 0 ${vw} ${vh}`);

    circles.map((circle) => {
      circle.setAttribute("cx", ORIGIN.x);
      circle.setAttribute("cy", ORIGIN.y);
      circle.style.transformOrigin = `${ORIGIN.x} ${ORIGIN.y}`;
    });

    timeline.seek(timeline.duration * (timeline.progress * 0.01));
  }
  onResize();
  window.addEventListener("resize", onResize);
}
