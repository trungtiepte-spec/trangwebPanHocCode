import React, { useEffect, useRef } from 'react';

export default function SakuraBackground({ intensity = 'medium' }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        // Determine petal count based on intensity
        let maxPetals = 25;
        if (intensity === 'high') maxPetals = 55;
        else if (intensity === 'medium') maxPetals = 25;
        else if (intensity === 'low') maxPetals = 10;
        else if (intensity === 'minimal') maxPetals = 3;

        const petals = [];

        // Petal class/object generator
        class Petal {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * -height - 10;
                this.size = Math.random() * 6 + 6; // 6 to 12
                this.speedY = Math.random() * 0.8 + 0.6; // 0.6 to 1.4
                this.speedX = Math.random() * 1.5 - 0.5; // -0.5 to 1.0
                this.angle = Math.random() * Math.PI * 2;
                this.spinSpeed = (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1);
                this.opacity = Math.random() * 0.4 + 0.4; // 0.4 to 0.8
                // Varied pink shades
                const pinks = [
                    'rgba(249, 168, 212, ', // light pink (tailwind pink-300)
                    'rgba(244, 114, 182, ', // pink-400
                    'rgba(236, 72, 153, ',  // pink-500
                    'rgba(253, 242, 248, ', // pink-50 (super light)
                ];
                this.colorBase = pinks[Math.floor(Math.random() * pinks.length)];
            }

            update() {
                this.y += this.speedY;
                this.x += Math.sin(this.angle) * 0.5 + this.speedX;
                this.angle += this.spinSpeed;

                // Reset when off screen
                if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
                    this.reset();
                    this.y = -20; // Start just above screen
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.beginPath();
                
                // Draw a cute sakura petal shape
                // We'll draw two curves meeting at points to look like a leaf/petal
                ctx.moveTo(0, -this.size);
                ctx.quadraticCurveTo(this.size * 0.7, -this.size * 0.3, this.size * 0.2, this.size * 0.5);
                ctx.lineTo(0, this.size * 0.8);
                ctx.lineTo(-this.size * 0.2, this.size * 0.5);
                ctx.quadraticCurveTo(-this.size * 0.7, -this.size * 0.3, 0, -this.size);

                ctx.fillStyle = `${this.colorBase}${this.opacity})`;
                ctx.fill();
                ctx.restore();
            }
        }

        // Initialize petals
        for (let i = 0; i < maxPetals; i++) {
            const p = new Petal();
            // Stagger initial Y coordinates to avoid they all drop from top at the same time
            p.y = Math.random() * height;
            petals.push(p);
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            petals.forEach((p) => {
                p.update();
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // Handle resize with debouncing/throttling
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            }, 100);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimeout);
        };
    }, [intensity]);

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
                zIndex: -1,
                display: 'block',
            }}
        />
    );
}
