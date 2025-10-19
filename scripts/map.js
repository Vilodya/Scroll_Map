gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin);

const master = gsap.timeline({
  scrollTrigger: {
    trigger: ".map",
    start: "top 30%",
    toggleActions: "play none none none"
  }
});

gsap.set(".start-map", { opacity: 0, y:-10, scale: 0.3, transformOrigin: "50% 100%" });
gsap.set(".end-map", { opacity: 0, y:5, scale: 0.3, transformOrigin: "50% 100%" });
gsap.set(".label-country", { opacity: 0, scale: 0, transformOrigin: "50% 100%" });
gsap.set(".country", { opacity: 1, fill: "#efefef" });
gsap.set(".truck", { opacity: 0});

// 1️⃣ Точки + названия
const tlPoints = gsap.timeline();
tlPoints.to(".start-map",
  {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power1.out",
    stagger: 0.6,
    scale: 1
  }
);

tlPoints.to(".punkt-cn, .punkt-kz", {
  opacity: 1,
  y: 0,
  scale: 1,
  duration: 0.6,
  ease: "power1.out",
  stagger: 0.6
}, "<+0.3");

// 2️⃣ Отъезд карты
const tlMap = gsap.timeline();
tlMap.from (".map-content", {
  scale: 1.6,
  xPercent: -28,
  yPercent: -2,
  ease: "power1.Out"
});

// 3️⃣ Дороги + страны + пины
const tlRoutes = gsap.timeline();
tlRoutes.to(".route", {
  drawSVG: "0% 100%",
  opacity: 1,
  duration: 1,
  stagger: 1,
});

tlRoutes.to(".end-map",
  {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.6,
    ease: "power1.out",
    stagger: 1
  },"<1"
);

tlRoutes.to("#label-kg, #label-uz, #label-ru",
  {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    ease: "power1.out",
    stagger: 1
  },"<1"
);

tlRoutes.to("#country-kg",
  {
    opacity: 0.3,
    fill: "#ff0000",
    duration: 0.6,
    ease: "power1.out",
    stagger: 1
  },"<"
);

tlRoutes.to("#country-uz",
  {
    opacity: 0.2,
    fill: "#00F4A7",
    duration: 0.6,
    ease: "power1.out",
  },"<1"
);

tlRoutes.to("#country-ru",
  {
    opacity: 0.2,
    fill: "#0084FF",
    duration: 0.6,
    ease: "power1.out",
  },"<1"
);

tlRoutes.to("#label-br, #label-az, #label-tur, #label-taj, #label-eu",
  {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    ease: "power1.out",
    stagger: 1
  },"<2"
);

tlRoutes.to("#country-br",
  {
    opacity: 0.2,
    fill: "#00F4A7",
    duration: 0.6,
    ease: "power1.out",
  },"<"
);

tlRoutes.to("#country-az",
  {
    opacity: 0.2,
    fill: "#00F4A7",
    duration: 0.6,
    ease: "power1.out",
  },"<1"
);

function makeTruckTimeline({
  target,
  path,
  moveDuration = 2,
  delayStartSec = 0,
  repeatDelaySec = 2,
  autoRotate = 180,
  inDur = 0.2,
  settleDur = 0.2,
  outDur = 0.2
}) {
  gsap.killTweensOf(target);
  gsap.set(target, {
    x: 0, y: 0, rotation: 0, scale: 1,
    transformOrigin: "50% 50%",
    attr: { transform: null }
  });

  const tl = gsap.timeline({
    paused: true,
    repeat: -1,
    repeatDelay: repeatDelaySec,
    defaults: { ease: "power1.inOut" }
  })
  .set(target, { opacity: 0, scale: 0.5 })
  .to(target, { opacity: 1, scale: 1.1, duration: inDur })
  .to(target, { scale: 1, duration: settleDur })
  .to(target, {
    duration: moveDuration,
    motionPath: {
      path,
      align: path,
      alignOrigin: [0.5, 0.5],
      autoRotate: autoRotate
    }
  }, "<")
  .to(target, { opacity: 0, scale: 0.5, duration: outDur }, ">");

  return {
    playWithDelay() { gsap.delayedCall(delayStartSec, () => tl.play(0)); }
  };
}

// создаём «движки» для трёх машин
const truck1 = makeTruckTimeline({
  target: "#truck1",
  path: "#route-tacheng-belarus",
  moveDuration: 4,
  delayStartSec: 0,
  repeatDelaySec: 2,
  autoRotate: 180
});

const truck2 = makeTruckTimeline({
  target: "#truck2",
  path: "#route-dulati-russia",
  moveDuration: 2,
  delayStartSec: 0,
  repeatDelaySec: 2,
  autoRotate: 180
});

const truck3 = makeTruckTimeline({
  target: "#truck3",
  path: "#route-uz-tajikistan",
  moveDuration: 1,
  delayStartSec: 0,
  repeatDelaySec: 2,
  autoRotate: true
});

// tl, который только «включает» грузовики (их циклы живут отдельно)
const tlTrucks = gsap.timeline()
  // показать все иконки разом (если хочешь появление перед стартом)
  .to(".truck", { opacity: 1, duration: 0.4 }, 0)
  // старт всех циклов с их персональными задержками — в момент начала tlTrucks
  .add(() => {
    truck1.playWithDelay();
    truck2.playWithDelay();
    truck3.playWithDelay();
  }, 0);

master
  .add(tlPoints)
  .add(tlMap, ">+1")
  .add(tlRoutes, ">+1")
  .add(tlTrucks, ">+1");
