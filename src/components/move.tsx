import { useState, useEffect, useRef } from "react";

// Define types for our particle
interface Particle {
   id: number;
   text: string;
   targetText: string;
   x: number;
   y: number;
   speed: number;
   opacity: number;
   isCrypto: boolean;
}

const CryptoFlowDemo = (): JSX.Element => {
   const [particles, setParticles] = useState<Particle[]>([]);
   const requestRef = useRef<number | null>(null);
   const previousTimeRef = useRef<number | null>(null);

   // Set up the animation environment
   useEffect(() => {
      // Initial particles
      const initialParticles: Particle[] = [
         {
            id: 1,
            text: "Bitcoin",
            targetText: "Naira",
            x: -10,
            y: -30,
            speed: 0.08,
            opacity: 0.8,
            isCrypto: true,
         },
         {
            id: 2,
            text: "ETH",
            targetText: "Pounds",
            x: -40,
            y: 0,
            speed: 0.1,
            opacity: 0.8,
            isCrypto: true,
         },
         {
            id: 3,
            text: "USDT",
            targetText: "Cedis",
            x: -20,
            y: 30,
            speed: 0.06,
            opacity: 0.8,
            isCrypto: true,
         },
      ];

      setParticles(initialParticles);

      // Clean up
      return () => {
         if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
         }
      };
   }, []);

   // Animation loop
   useEffect(() => {
      if (particles.length === 0) return;

      const animate = (time: number): void => {
         if (previousTimeRef.current === null) {
            previousTimeRef.current = time;
         }

         const deltaTime = time - previousTimeRef.current;
         previousTimeRef.current = time;

         // Update particles
         setParticles((prevParticles) =>
            prevParticles.map((particle) => {
               // Move particle from left to right
               let newX = particle.x + (particle.speed * deltaTime) / 16;
               let newText = particle.text;
               let isStillCrypto = particle.isCrypto;

               // If particle passes the center (50%), transform it
               if (newX >= 50 && particle.isCrypto) {
                  newText = particle.targetText;
                  isStillCrypto = false;
               }

               // If particle moves offscreen to the right, recycle it
               if (newX > 110) {
                  newX = -20;
                  newText = "Bitcoin"; // Reset to a crypto name
                  isStillCrypto = true;
               }

               // Calculate opacity based on proximity to center
               const distanceFromCenter = Math.abs(newX - 50);
               const newOpacity =
                  distanceFromCenter < 20
                     ? 0.8 + ((20 - distanceFromCenter) / 20) * 0.2
                     : 0.8;

               return {
                  ...particle,
                  x: newX,
                  text: newText,
                  opacity: newOpacity,
                  isCrypto: isStillCrypto,
               };
            })
         );

         requestRef.current = requestAnimationFrame(animate);
      };

      requestRef.current = requestAnimationFrame(animate);

      return () => {
         if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
         }
      };
   }, [particles.length]);

   return (
      <div className="relative w-full h-64 bg-slate-900 overflow-hidden rounded-lg">
         {/* Horizontal lines */}
         <div className="absolute w-full h-px bg-white/10 top-1/2 -translate-y-8" />
         <div className="absolute w-full h-px bg-white/10 top-1/2" />
         <div className="absolute w-full h-px bg-white/10 top-1/2 translate-y-8" />

         {/* Particles */}
         {particles.map((particle) => {
            const color = particle.isCrypto ? "56, 189, 248" : "250, 204, 21"; // Blue for crypto, yellow for cash
            const distanceFromCenter = Math.abs(particle.x - 50);
            const glowIntensity = Math.max(0.2, 1 - distanceFromCenter / 20);

            return (
               <div
                  key={particle.id}
                  className="absolute transform -translate-y-1/2 -translate-x-1/2 transition-all duration-300"
                  style={{
                     top: `calc(50% + ${particle.y}px)`,
                     left: `${particle.x}%`,
                     color: `rgb(${color})`,
                     fontWeight: distanceFromCenter < 10 ? "bold" : "normal",
                     opacity: particle.opacity,
                     textShadow: `0 0 ${
                        5 + glowIntensity * 8
                     }px rgba(${color}, ${0.5 + glowIntensity * 0.5})`,
                     zIndex: 5,
                  }}>
                  {particle.text}
               </div>
            );
         })}

         {/* Center logo */}
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-900/90 rounded flex items-center justify-center z-10">
            <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center">
               <div className="w-6 h-6 rounded-full bg-blue-500"></div>
            </div>
         </div>

         {/* Explanation */}
         <div className="absolute bottom-2 left-0 w-full text-center text-xs text-white/70">
            This demo shows particles moving from left to right
         </div>
      </div>
   );
};

export default CryptoFlowDemo;
