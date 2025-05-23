import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

interface AnimatedPercentageCircleProps {
  percentage: number; 
  size?: number;
  strokeWidth?: number;
  circleColor?: string;
  trackColor?: string;
  duration?: number;

  animateText?: boolean;
  textInitialValue?: number;
  textFinalValue?: number;
  textSuffix?: string; 
  textColor?: string;
  textSize?: string; 
}

const AnimatedPercentageCircle: React.FC<AnimatedPercentageCircleProps> = ({
  percentage,
  size = 180,
  strokeWidth = 10,
  circleColor = 'var(--color-amd-red)',
  trackColor = 'var(--color-bg-tertiary)',
  duration = 1.5,
  animateText = false,
  textInitialValue = 0,
  textFinalValue = 100,
  textSuffix = '',
  textColor = 'var(--color-text-primary)',
  textSize = 'text-3xl', 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const circleFillOffset = circumference - (percentage / 100) * circumference;
  const circleVariants = {
    hidden: { strokeDashoffset: circumference },
    visible: {
      strokeDashoffset: circleFillOffset,
      transition: { duration: duration, ease: 'circOut' },
    },
  };

  const animatedNumericValue = useMotionValue(textInitialValue);
  const displayedText = useTransform(animatedNumericValue, (latest) => {
    return `${Math.round(latest)}${textSuffix}`;
  });

  useEffect(() => {
    if (animateText) {
      const controls = animate(animatedNumericValue, textFinalValue, {
        duration: duration, 
        ease: "linear", 
      });
      return controls.stop;
    }
  }, [animateText, textFinalValue, textInitialValue, animatedNumericValue, duration]); 

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={circleColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          variants={circleVariants}
          initial="hidden"
          animate="visible"
        />
      </svg>
      {animateText && (
        <motion.div
          className={`absolute inset-0 flex items-center justify-center font-bold ${textSize}`}
          style={{ color: textColor }}
        >
          {displayedText}
        </motion.div>
      )}
    </div>
  );
};

export default AnimatedPercentageCircle;