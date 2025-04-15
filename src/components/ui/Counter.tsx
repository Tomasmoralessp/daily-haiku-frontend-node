
import React, { useState, useEffect, useRef } from "react";

interface CounterProps {
  targetNumber: number;
  duration?: number;
  label?: string;
  className?: string;
}

const Counter: React.FC<CounterProps> = ({ 
  targetNumber, 
  duration = 2000, 
  label = "Haikus detected until now",
  className = ""
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  
  const animateCount = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }
    
    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smoother animation
    const easeOutQuad = (t: number) => t * (2 - t);
    const easedProgress = easeOutQuad(progress);
    
    setCount(Math.floor(easedProgress * targetNumber));
    
    if (progress < 1) {
      frameRef.current = requestAnimationFrame(animateCount);
    }
  };
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (frameRef.current === null) {
            frameRef.current = requestAnimationFrame(animateCount);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, [targetNumber]);

  return (
    <div ref={countRef} className={`flex flex-col items-center animate-fade-in ${className}`}>
      <p className="text-xl font-inter tracking-wider">
        {count.toLocaleString()}
      </p>
      <p className="text-sm text-gray-400 font-inter tracking-wide mt-1">
        {label}
      </p>
    </div>
  );
};

export default Counter;
