import React from 'react';
import './Loader.scss';

export default function Loader({ text = 'Loading', className = '', style = {}, size }) {
  return (
    <div className={`custom-loader-container ${className}`} style={style}>
      <span
        className="loader"
        style={size ? { '--size': `${size}px` } : undefined}
      ></span>
      
    </div>
  );
}
