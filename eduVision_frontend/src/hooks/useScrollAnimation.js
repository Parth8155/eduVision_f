import { useEffect, useRef } from "react";

export const useScrollAnimation = (className = "in-view", options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add(className);
          if (options.triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!options.triggerOnce) {
          element.classList.remove(className);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || "0px 0px -100px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [className, options.threshold, options.rootMargin, options.triggerOnce]);

  return ref;
};

// Utility hook for staggered animations
export const useStaggeredAnimation = (
  itemsCount,
  delay = 150,
  className = "animate-slide-up"
) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const items = container.querySelectorAll(".stagger-item");
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add(className);
            }, index * delay);
          });
          observer.unobserve(container);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [itemsCount, delay, className]);

  return containerRef;
};
