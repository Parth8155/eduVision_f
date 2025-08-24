import React from "react";

const Marquee = ({
  content = "EDUVISION - SMART LEARNING - AI POWERED - INTERACTIVE STUDY",
  variant = "primary"
}) => {
  const marqueeLeftRef = React.useRef(null);
  const marqueeRightRef = React.useRef(null);
  const lastScrollYRef = React.useRef(window.scrollY);
  const scrollVelocityRef = React.useRef(0);
  const rafIdRef = React.useRef(null);
  const positionLeftRef = React.useRef(0);
  const positionRightRef = React.useRef(0);
  const contentWidthRef = React.useRef(0);

  const baseSpeed = 1.5;

  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border-b border-blue-100";
      case "accent":
        return "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 border-b border-purple-100";
      default:
        return "bg-gradient-to-r from-gray-50 to-white text-gray-700 border-b border-gray-100";
    }
  };

  const updateMarquees = (timestamp) => {
    if (!marqueeLeftRef.current || !marqueeRightRef.current) return;

    if (contentWidthRef.current === 0 && marqueeLeftRef.current) {
      contentWidthRef.current = marqueeLeftRef.current.scrollWidth / 2;
    }

    const speed = baseSpeed + scrollVelocityRef.current * 0.05;

    positionLeftRef.current -= speed;
    positionRightRef.current += speed;

    if (positionLeftRef.current <= -contentWidthRef.current) {
      positionLeftRef.current += contentWidthRef.current;
    } else if (positionLeftRef.current > 0) {
      positionLeftRef.current -= contentWidthRef.current;
    }

    if (positionRightRef.current >= 0) {
      positionRightRef.current -= contentWidthRef.current;
    } else if (positionRightRef.current < -contentWidthRef.current) {
      positionRightRef.current += contentWidthRef.current;
    }

    marqueeLeftRef.current.style.transform = `translateX(${positionLeftRef.current}px)`;
    marqueeRightRef.current.style.transform = `translateX(${positionRightRef.current}px)`;

    rafIdRef.current = requestAnimationFrame(updateMarquees);
  };

  const handleScroll = React.useCallback(() => {
    const dy = window.scrollY - lastScrollYRef.current;
    lastScrollYRef.current = window.scrollY;
    scrollVelocityRef.current = Math.min(Math.max(dy * 0.1, -5), 5);
  }, []);

  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    rafIdRef.current = requestAnimationFrame(updateMarquees);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [handleScroll]);

  const marqueeContent = (
    <span className="inline-flex items-center gap-8">
      {content.split(' - ').map((text, index) => (
        <React.Fragment key={index}>
          <span className="font-bold tracking-wide">{text}</span>
          {index < content.split(' - ').length - 1 && (
            <span className="w-2 h-2 bg-current rounded-full opacity-50"></span>
          )}
        </React.Fragment>
      ))}
    </span>
  );

  return (
    <div className={`sticky top-0 z-40 py-3 shadow-sm backdrop-blur-sm ${getVariantStyles()}`}>
      <div className="overflow-hidden">
        <div className="marquee-container mb-2">
          <div
            ref={marqueeLeftRef}
            className="marquee-content text-[clamp(1rem,2.5vw,1.25rem)] font-medium flex items-center gap-8"
          >
            {marqueeContent} {marqueeContent}
          </div>
        </div>
        <div className="marquee-container">
          <div
            ref={marqueeRightRef}
            className="marquee-content text-[clamp(1rem,2.5vw,1.25rem)] font-medium flex items-center gap-8"
          >
            {marqueeContent} {marqueeContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export { Marquee };
