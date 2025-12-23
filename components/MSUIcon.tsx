import React from 'react';

interface MSUIconProps {
  className?: string;
  size?: number;
}

const MSUIcon: React.FC<MSUIconProps> = ({ className = "text-theme-accent", size = 24 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M12 2L14.5 9H19L15.5 13L17 21L12 17L7 21L8.5 13L5 9H9.5L12 2Z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="opacity-0" 
      />
      {/* Simplified Silhouette of MSU Main Building */}
      <path 
        d="M12 2L15 8L15 12H18V22H6V12H9L9 8L12 2Z" 
        fill="currentColor" 
        fillOpacity="0.2"
      />
      <path 
        d="M12 2L14 7V12H19V22H5V12H10V7L12 2Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path d="M12 2V7" stroke="currentColor" strokeWidth="2" />
      <path d="M12 17V22" stroke="currentColor" strokeWidth="2" />
      <path d="M2 22H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export default MSUIcon;