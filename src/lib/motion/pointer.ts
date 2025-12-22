"use client";

type ArrowElement = {
  el: HTMLElement;
  center: { x: number; y: number };
};

export const createArrowField = (elements: HTMLElement[]) => {
  if (elements.length === 0) {
    return { cleanup: () => { }, updateCenters: () => { } };
  }

  let rafId = 0;
  let lastPointerX = window.innerWidth / 2;
  let lastPointerY = window.innerHeight / 2;

  const arrows: ArrowElement[] = elements.map((el) => {
    // 초기 transform 설정 (위를 향하도록)
    el.style.transform = "rotate(0rad)";
    // 초기 opacity 설정 (기본값: 중간 정도)
    el.style.opacity = "0.5";
    // Smooth transition 추가 (transform과 opacity 모두)
    el.style.transition = "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease-out";
    return {
      el,
      center: getCenter(el),
    };
  });

  const updateCenters = () => {
    arrows.forEach((arrow) => {
      arrow.center = getCenter(arrow.el);
    });
    // 중심 업데이트 후 마지막 포인터 위치로 다시 업데이트
    updateArrows(lastPointerX, lastPointerY);
  };

  const updateArrows = (clientX: number, clientY: number) => {
    arrows.forEach((arrow) => {
      const angle = Math.atan2(clientY - arrow.center.y, clientX - arrow.center.x);
      arrow.el.style.transform = `rotate(${angle}rad)`;

      // 거리 계산
      const dx = clientX - arrow.center.x;
      const dy = clientY - arrow.center.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 최대 거리 설정 (화면 대각선의 약 1/3 정도)
      const maxDistance = Math.max(window.innerWidth, window.innerHeight) * 0.5;

      // 거리에 따라 opacity 계산 (0.2 ~ 1.0, 더 진하게)
      const minOpacity = 0.2;
      const maxOpacity = 1.0;
      const normalizedDistance = Math.min(distance / maxDistance, 1);

      // Easing 함수 적용 (ease-out 효과로 더 부드럽게)
      const easedDistance = 1 - Math.pow(1 - normalizedDistance, 2);
      const opacity = maxOpacity - (easedDistance * (maxOpacity - minOpacity));

      arrow.el.style.opacity = opacity.toString();
    });
  };

  const onPointerMove = (evt: PointerEvent) => {
    lastPointerX = evt.clientX;
    lastPointerY = evt.clientY;

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      updateArrows(evt.clientX, evt.clientY);
    });
  };

  const onScroll = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      updateCenters();
    });
  };

  const cleanup = () => {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("resize", updateCenters);
    window.removeEventListener("scroll", onScroll, true);
  };

  // 초기 상태 설정 (화면 중앙을 향하도록)
  updateCenters();
  updateArrows(lastPointerX, lastPointerY);

  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("resize", updateCenters);
  window.addEventListener("scroll", onScroll, true); // capture phase로 모든 스크롤 감지

  return { cleanup, updateCenters };
};

const getCenter = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};


