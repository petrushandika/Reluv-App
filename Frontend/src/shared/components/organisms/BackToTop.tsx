'use client';

import { ArrowUp } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  useEffect(() => {
    if (particles.length === 0) return;

    const animate = () => {
      setParticles((prev) => {
        const updated = prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.3,
            vx: particle.vx * 0.98,
            rotation: particle.rotation + particle.rotationSpeed,
          }))
          .filter((particle) => particle.y < window.innerHeight + 100);

        return updated;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particles.length]);

  const createConfetti = () => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;

    const colors = [
      '#0ea5e9',
      '#38bdf8',
      '#7dd3fc',
      '#bae6fd',
      '#e0f2fe',
    ];

    const newParticles: ConfettiParticle[] = [];

    for (let i = 0; i < 20; i++) {
      const spread = (Math.random() - 0.5) * 25;
      const speed = 10 + Math.random() * 8;
      const vx = spread * 0.4;
      const vy = -speed - Math.random() * 4;

      newParticles.push({
        id: Date.now() + i,
        x: centerX + (Math.random() - 0.5) * 8,
        y: centerY,
        vx,
        vy,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 8 + Math.random() * 10,
        rotation: -90 + (Math.random() - 0.5) * 30,
        rotationSpeed: (Math.random() - 0.5) * 5,
      });
    }

    setParticles(newParticles);

    setTimeout(() => {
      setParticles([]);
    }, 2000);
  };

  const scrollToTop = () => {
    createConfetti();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none">
        <div className="container mx-auto px-6 md:px-5 xl:px-24">
          <div className="flex justify-end">
            <button
              ref={buttonRef}
              onClick={scrollToTop}
              className="flex items-center justify-center w-10 h-10 bg-sky-600 dark:bg-sky-500 text-white rounded-full shadow-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 pointer-events-auto"
              aria-label="Back to top"
            >
              <ArrowUp className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {particles.map((particle) => {
        const width = particle.size;
        const height = particle.size * 2;
        return (
          <div
            key={particle.id}
            className="fixed pointer-events-none z-[60]"
            style={{
              left: `${particle.x - width / 2}px`,
              top: `${particle.y - height / 2}px`,
              width: `${width}px`,
              height: `${height}px`,
              background: `linear-gradient(to bottom, ${particle.color} 0%, ${particle.color} 60%, transparent 100%)`,
              borderRadius: `${width / 2}px ${width / 2}px ${width / 3}px ${width / 3}px`,
              transform: `rotate(${particle.rotation}deg)`,
              opacity: 0.9,
              filter: `blur(${Math.max(0.5, particle.size * 0.15)}px)`,
            }}
          />
        );
      })}
    </>
  );
}
