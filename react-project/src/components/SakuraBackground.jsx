import React, { useMemo } from 'react';
import '../styles/sakura.css';

const PETAL_COLORS = ['#F9A8D4', '#FBCFE8', '#FDA4AF'];

export default function SakuraBackground({ intensity = 'medium' }) {
    const petalCount = useMemo(() => {
        if (intensity === 'high') return 55;
        if (intensity === 'medium-high') return 35;
        if (intensity === 'medium') return 22;
        if (intensity === 'low') return 10;
        if (intensity === 'minimal') return 6;
        return 22;
    }, [intensity]);

    const petals = useMemo(() => {
        const list = [];
        for (let i = 0; i < petalCount; i++) {
            const size = Math.floor(Math.random() * 10) + 14; // 14px to 24px
            const left = (Math.random() * 100).toFixed(2) + '%';
            const duration = (Math.random() * 6 + 6).toFixed(2) + 's'; // 6s - 12s
            const delay = (Math.random() * -12).toFixed(2) + 's'; // Negative delay for immediate visibility
            const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
            const swayX = (Math.random() * 140 - 70).toFixed(0) + 'px';
            const rotZ = (Math.random() * 720 - 360).toFixed(0) + 'deg';
            const rotY = (Math.random() * 360).toFixed(0) + 'deg';
            const opacity = (Math.random() * 0.35 + 0.55).toFixed(2); // 0.55 to 0.9

            list.push({
                id: i,
                style: {
                    left,
                    width: `${size}px`,
                    height: `${size * 1.2}px`,
                    animationDuration: duration,
                    animationDelay: delay,
                    opacity,
                    '--sway-x': swayX,
                    '--rot-z': rotZ,
                    '--rot-y': rotY,
                },
                color,
            });
        }
        return list;
    }, [petalCount]);

    return (
        <div className="sakura-container">
            {petals.map((p) => (
                <div key={p.id} className="sakura-petal" style={p.style}>
                    <svg viewBox="0 0 30 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M15 0C22.5 6 30 13.5 30 22.5C30 29.9558 23.2843 36 15 36C6.71573 36 0 29.9558 0 22.5C0 13.5 7.5 6 15 0Z"
                            fill={p.color}
                        />
                        {/* Subtle inner petal notch detail */}
                        <path
                            d="M15 4C19 9 24 15 24 22C24 26 20 30 15 30C10 30 6 26 6 22C6 15 11 9 15 4Z"
                            fill="#FFFFFF"
                            fillOpacity="0.2"
                        />
                    </svg>
                </div>
            ))}
        </div>
    );
}
