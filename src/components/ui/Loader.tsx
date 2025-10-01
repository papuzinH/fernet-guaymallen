import React from 'react';
import styles from './loader.module.css';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large' | 'inline';
  text?: string;
  className?: string;
}

const sizeMap: Record<NonNullable<LoaderProps['size']>, number> = {
  small: 24,
  medium: 40,
  large: 64,
  inline: 16,
};

export default function Loader({ size = 'medium', text, className = '' }: LoaderProps) {
  const px = sizeMap[size] ?? sizeMap.medium;

  return (
    <div className={`flex items-center justify-center ${className}`} role="status" aria-live="polite">
      <div
        className={styles.spinner}
        style={{ width: px, height: px }}
        aria-hidden="true"
      />
      {text && <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">{text}</span>}
    </div>
  );
}
