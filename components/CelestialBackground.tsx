"use client";

import { 
  TbZodiacAries, 
  TbZodiacTaurus, 
  TbZodiacGemini, 
  TbZodiacCancer, 
  TbZodiacLeo, 
  TbZodiacVirgo,
  TbZodiacLibra,
  TbZodiacScorpio,
  TbZodiacSagittarius,
  TbZodiacCapricorn,
  TbZodiacAquarius,
  TbZodiacPisces
} from "react-icons/tb";

const zodiacSigns = [
  { Icon: TbZodiacAries, rotation: -12 },
  { Icon: TbZodiacTaurus, rotation: -6 },
  { Icon: TbZodiacGemini, rotation: 0 },
  { Icon: TbZodiacCancer, rotation: 6 },
  { Icon: TbZodiacLeo, rotation: 12 },
  { Icon: TbZodiacVirgo, rotation: 18 },
  { Icon: TbZodiacLibra, rotation: -12 },
  { Icon: TbZodiacScorpio, rotation: -6 },
  { Icon: TbZodiacSagittarius, rotation: 0 },
  { Icon: TbZodiacCapricorn, rotation: 6 },
  { Icon: TbZodiacAquarius, rotation: 12 },
  { Icon: TbZodiacPisces, rotation: 18 },
];

const offsets = [5, -8, 12, -5, 8, -12, 6, -9, 11, -7, 9, -11, 7, -6, 10, -10];
const scatterPositions = [
  { left: 10, top: 15, rotation: 8, opacity: 0.06 },
  { left: 85, top: 20, rotation: -12, opacity: 0.08 },
  { left: 25, top: 60, rotation: 15, opacity: 0.05 },
  { left: 70, top: 55, rotation: -8, opacity: 0.07 },
  { left: 5, top: 80, rotation: 12, opacity: 0.06 },
  { left: 90, top: 75, rotation: -15, opacity: 0.08 },
  { left: 50, top: 10, rotation: 10, opacity: 0.05 },
  { left: 15, top: 40, rotation: -10, opacity: 0.07 },
  { left: 80, top: 45, rotation: 12, opacity: 0.06 },
  { left: 35, top: 85, rotation: -8, opacity: 0.08 },
  { left: 60, top: 25, rotation: 15, opacity: 0.05 },
  { left: 95, top: 65, rotation: -12, opacity: 0.07 },
  { left: 20, top: 30, rotation: 9, opacity: 0.06 },
  { left: 75, top: 35, rotation: -11, opacity: 0.08 },
  { left: 40, top: 70, rotation: 13, opacity: 0.05 },
  { left: 65, top: 90, rotation: -9, opacity: 0.07 },
  { left: 30, top: 5, rotation: 11, opacity: 0.06 },
  { left: 55, top: 50, rotation: -13, opacity: 0.08 },
  { left: 45, top: 95, rotation: 7, opacity: 0.05 },
  { left: 88, top: 12, rotation: -14, opacity: 0.07 },
];

interface CelestialBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function CelestialBackground({ children, className = '' }: CelestialBackgroundProps) {
  return (
    <div className={`celestial-header relative min-h-screen ${className}`}>
      {/* Zodiac symbols decorative background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="relative w-full h-full">
          {/* Grid pattern covering entire background */}
          <div className="absolute inset-0 grid grid-cols-6 md:grid-cols-12 lg:grid-cols-16 gap-4 md:gap-6 lg:gap-8 p-4 md:p-8">
            {Array.from({ length: 96 }).map((_, index) => {
              const zodiacIndex = index % zodiacSigns.length;
              const { Icon, rotation } = zodiacSigns[zodiacIndex];
              const offset = offsets[index % offsets.length];
              
              return (
                <div
                  key={index}
                  className="flex items-center justify-center"
                  style={{
                    transform: `rotate(${rotation + offset}deg)`,
                    opacity: 0.08 + (index % 3) * 0.13,
                  }}
                >
                  <Icon className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 text-primary-dark" />
                </div>
              );
            })}
          </div>
          
          {/* Additional scattered larger symbols for depth */}
          <div className="absolute inset-0">
            {scatterPositions.map((pos, index) => {
              const zodiacIndex = index % zodiacSigns.length;
              const { Icon, rotation } = zodiacSigns[zodiacIndex];
              
              return (
                <div
                  key={`scatter-${index}`}
                  className="absolute"
                  style={{
                    left: `${pos.left}%`,
                    top: `${pos.top}%`,
                    transform: `rotate(${rotation + pos.rotation}deg)`,
                    opacity: pos.opacity,
                  }}
                >
                  <Icon className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:w-32 text-primary-dark" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}

