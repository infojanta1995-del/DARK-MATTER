import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../theme/ThemeContext';

export const SpaceBackground: React.FC = () => {
  const { performance } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (performance === 'low') return;

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

    const starCount = performance === 'high' ? 90 : 40;
    const darkMatterCount = performance === 'high' ? 35 : 15;

    // Stars
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1,
    }));

    // Drifting Dark Matter micro-nodes
    const darkMatterParticles = Array.from({ length: darkMatterCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 2.2 + 1.2,
      alpha: Math.random() * 0.35 + 0.1,
      color: Math.random() > 0.6 ? 'rgba(6, 182, 212, ' : 'rgba(168, 85, 247, ',
    }));

    let frame = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Distant cosmic faint dust gradient
      const gradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.85
      );
      gradient.addColorStop(0, 'rgba(8, 14, 28, 0.4)');
      gradient.addColorStop(0.5, 'rgba(4, 7, 16, 0.25)');
      gradient.addColorStop(1, 'rgba(1, 2, 4, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render stars
      for (const s of stars) {
        s.alpha += s.twinkleSpeed * s.direction;
        if (s.alpha > 0.85) {
          s.alpha = 0.85;
          s.direction = -1;
        } else if (s.alpha < 0.15) {
          s.alpha = 0.15;
          s.direction = 1;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(225, 235, 255, ${s.alpha})`;
        ctx.fill();
      }

      // Render dark matter drifting nodes
      for (const p of darkMatterParticles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color === 'rgba(6, 182, 212, ' ? '#06b6d4' : '#a855f7';
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      frame++;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [performance]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Deep Space Base Layer */}
      <div 
        className="absolute inset-0 bg-[#020307]" 
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 50% at 50% 30%, rgba(14, 26, 50, 0.45), transparent 70%),
            radial-gradient(ellipse 50% 40% at 85% 80%, rgba(20, 10, 38, 0.35), transparent 60%),
            radial-gradient(ellipse 40% 40% at 15% 75%, rgba(6, 30, 48, 0.3), transparent 60%)
          `,
        }}
      />

      {/* Interactive Micro-particles Canvas */}
      {performance !== 'low' && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 opacity-75"
        />
      )}

      {/* Cockpit HUD Grid & Scanlines */}
      <div className="absolute inset-0 dm-grid-pattern opacity-40" />
      <div className="absolute inset-0 dm-scanlines opacity-30" />

      {/* Cockpit Vignette Framing */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 120px rgba(0, 0, 0, 0.85), inset 0 0 300px rgba(0, 0, 0, 0.65)'
        }}
      />
    </div>
  );
};
