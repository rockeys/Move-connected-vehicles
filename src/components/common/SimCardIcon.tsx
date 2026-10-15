import React from 'react';

export const SimCardIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 2h9l5 5v15H6z" />
      <path d="M9 9h6v6H9z" />
      <path d="M9 18h6" />
      <path d="M12 9v6" />
    </svg>
  );
};
