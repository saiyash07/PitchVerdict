'use client';

import React, { useEffect, useRef } from 'react';

export default function ConfettiEffect() {
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
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    const colors = [
      '#f59e0b', // gold
      '#10b981', // green
      '#3b82f6', // blue
      '#ef4444', // red
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#06b6d4', // cyan
    ];

    interface Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      oscillationSpeed: number;
      oscillationVal: number;
    }

    const particles: Particle[] = [];
    const maxParticles = 120;

    // Initialize particles slightly above screen
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * -height - 20,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.random() * 4 - 2,
        speedY: Math.random() * 4 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 4 - 2,
        oscillationSpeed: Math.random() * 0.03 + 0.01,
        oscillationVal: Math.random() * Math.PI,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.oscillationVal += p.oscillationSpeed;
        p.x += p.speedX + Math.sin(p.oscillationVal) * 0.5;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();

        if (p.y > height) {
          // Reset particle to top
          p.y = -20;
          p.x = Math.random() * width;
          p.speedY = Math.random() * 4 + 3;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
