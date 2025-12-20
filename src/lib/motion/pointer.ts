"use client";

type ArrowElement = {
  el: HTMLElement;
  center: { x: number; y: number };
};

export const createArrowField = (elements: HTMLElement[]) => {
  let rafId = 0;
  const arrows: ArrowElement[] = elements.map((el) => ({
    el,
    center: getCenter(el),
  }));

  const updateCenters = () => {
    arrows.forEach((arrow) => {
      arrow.center = getCenter(arrow.el);
    });
  };

  const onPointerMove = (evt: PointerEvent) => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      arrows.forEach((arrow) => {
        const angle = Math.atan2(evt.clientY - arrow.center.y, evt.clientX - arrow.center.x);
        arrow.el.style.transform = `rotate(${angle}rad)`;
      });
    });
  };

  const cleanup = () => {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("resize", updateCenters);
  };

  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("resize", updateCenters);

  return { cleanup, updateCenters };
};

const getCenter = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};


