import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import App from './App.tsx';
import './index.css';

// Exponential luxurious easing for ultra-smooth scroll
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.05, // Lower lerp = smoother, more luxurious glide
        duration: 1.6, // Longer duration for velvety deceleration
        smoothWheel: true,
        wheelMultiplier: 0.95,
        easing: easeOutExpo,
        autoToggle: false, // Never hide or toggle root overflow style to prevent scrollbar disappearance
      }}
    >
      <App />
    </ReactLenis>
  </React.StrictMode>,
);
