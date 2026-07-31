import React, { useEffect, useRef } from 'react';

const MatrixBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    
    const chars = ['0', '1', ' 0 ', ' 1 '];

  
    const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 18000);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        
        vx: (Math.random() - 0.5) * 0.4, 
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() > 0.6 ? Math.floor(Math.random() * 8) + 18 : Math.floor(Math.random() * 6) + 10, // Mix of big and small
        char: chars[Math.floor(Math.random() * chars.length)],
        alpha: Math.random() * 0.3 + 0.1, // Subtle, non-intrusive transparency
      });
    }

    let animationFrameId;

    const animate = () => {
      // Clear canvas cleanly per frame to prevent trailing/glitching over the homepage
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen boundaries seamlessly
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = `rgba(0, 255, 136, ${p.alpha})`;
        ctx.font = `${p.size}px monospace`;
        ctx.fillText(p.char, p.x, p.y);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-canvas-bg"
    />
  );
};

export default MatrixBackground;