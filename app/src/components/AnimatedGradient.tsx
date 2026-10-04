'use client';

import React, { useEffect, useRef } from 'react';

export interface AnimatedGradientProps {
  variant?: 'mist' | 'lava' | 'vortex';
  speed?: number;
  opacity?: number;
  className?: string;
  children?: React.ReactNode;
}

export function AnimatedGradient({
  variant = 'mist',
  speed = 1,
  opacity = 0.6,
  className = '',
  children,
}: AnimatedGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Color palettes based on variant
    let colors = [
      { r: 79, g: 70, b: 229 },  // Indigo #4F46E5
      { r: 124, g: 58, b: 237 }, // Purple #7C3AED
      { r: 15, g: 23, b: 42 },   // Slate 900 #0F172A
    ];

    if (variant === 'lava') {
      colors = [
        { r: 225, g: 29, b: 72 },  // Rose #E11D48
        { r: 217, g: 119, b: 6 },  // Amber #D97706
        { r: 15, g: 23, b: 42 },   // Dark Slate
      ];
    } else if (variant === 'vortex') {
      colors = [
        { r: 14, g: 165, b: 233 }, // Sky #0EA5E9
        { r: 99, g: 102, b: 241 }, // Indigo #6366F1
        { r: 30, g: 27, b: 75 },   // Dark Indigo
      ];
    }

    // Particle nodes for smooth gradient animation
    const nodes = [
      { x: width * 0.2, y: height * 0.3, vx: 0.5 * speed, vy: 0.3 * speed, radius: width * 0.4 },
      { x: width * 0.8, y: height * 0.7, vx: -0.4 * speed, vy: -0.5 * speed, radius: width * 0.45 },
      { x: width * 0.5, y: height * 0.5, vx: 0.3 * speed, vy: -0.4 * speed, radius: width * 0.35 },
    ];

    let t = 0;

    const render = () => {
      // Check prefers-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        ctx.fillStyle = `rgb(${colors[2].r}, ${colors[2].g}, ${colors[2].b})`;
        ctx.fillRect(0, 0, width, height);
        return;
      }

      t += 0.005 * speed;
      ctx.clearRect(0, 0, width, height);

      // Base background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#020617'); // slate-950
      bgGrad.addColorStop(1, '#090d16');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render radial gradient nodes
      nodes.forEach((node, idx) => {
        node.x += Math.sin(t + idx) * node.vx;
        node.y += Math.cos(t + idx) * node.vy;

        // Keep inside bounds
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        const c = colors[idx % colors.length];
        const radGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius);
        radGrad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${opacity * 0.7})`);
        radGrad.addColorStop(0.5, `rgba(${c.r}, ${c.g}, ${c.b}, ${opacity * 0.3})`);
        radGrad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);

        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, width, height);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant, speed, opacity]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{ opacity }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
