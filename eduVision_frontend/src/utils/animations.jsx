// Animation utilities for eduVision homepage
const easeInOutCubic = 'cubic-bezier(0.4, 0, 0.2, 1)';

// Page load overlay animation
const createPageLoadAnimation = () => {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-white z-[9999] flex items-center justify-center';
  overlay.innerHTML = `
    <div class="flex items-center space-x-3 animate-fade-in">
      <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
        <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
      </div>
      <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        eduVision
      </span>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Remove overlay after animation
  setTimeout(() => {
    overlay.style.transform = 'translateY(-100%)';
    overlay.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 800);
  }, 1500);
};

// Intersection Observer for scroll animations
const createScrollObserver = (
  callback,
  threshold = 0.8
) => {
  return new IntersectionObserver(callback, {
    threshold,
    rootMargin: '-20% 0px -20% 0px'
  });
};

// Full-page section transitions
const createSectionTransitionObserver = () => {
  const sections = document.querySelectorAll('.page-section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-active');
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-10% 0px -10% 0px'
  });

  sections.forEach(section => observer.observe(section));
  return observer;
};

// Staggered animation helper
const staggerChildren = (
  elements,
  animation,
  delay = 150
) => {
  Array.from(elements).forEach((element, index) => {
    element.style.animationDelay = `${index * delay}ms`;
    element.classList.add(animation);
  });
};

// Counter animation
const animateCounter = (
  element,
  start,
  end,
  duration = 2000,
  suffix = ''
) => {
  const startTime = performance.now();
  
  const updateCounter = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease-out function
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (end - start) * easeOut);
    
    element.textContent = current.toLocaleString() + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  };
  
  requestAnimationFrame(updateCounter);
};

// Ambient background animation
const createAmbientBackground = (container) => {
  const particles = [];
  const particleCount = 6;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'absolute rounded-full opacity-10 animate-float-ambient';
    particle.style.width = Math.random() * 200 + 100 + 'px';
    particle.style.height = particle.style.width;
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.background = `linear-gradient(45deg, ${
      Math.random() > 0.5 ? '#3b82f6' : '#8b5cf6'
    }, transparent)`;
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    
    container.appendChild(particle);
    particles.push(particle);
  }
  
  return particles;
};

// Enhanced button morphing animation
const createMorphingButton = (button, states) => {
  let currentState = 'normal';
  
  const morph = (newState) => {
    if (currentState === newState) return;
    
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      button.innerHTML = states[newState];
      button.style.transform = 'scale(1)';
      currentState = newState;
    }, 150);
  };
  
  return { morph, getCurrentState: () => currentState };
};

module.exports = {
  easeInOutCubic,
  createPageLoadAnimation,
  createScrollObserver,
  createSectionTransitionObserver,
  staggerChildren,
  animateCounter,
  createAmbientBackground,
  createMorphingButton
};
