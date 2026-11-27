import React from 'react';

interface BoxLoaderProps {
  className?: string;
  size?: number;
}

export default function BoxLoader({ className = '', size = 32 }: BoxLoaderProps) {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ ['--box-size' as string]: `${size}px` }}
      aria-label="Loading"
      role="status"
    >
      <style>{`
        .box-loader-boxes {
          --duration: 800ms;
          height: calc(var(--box-size) * 2);
          width: calc(var(--box-size) * 3);
          position: relative;
          transform-style: preserve-3d;
          transform-origin: 50% 50%;
          margin-top: calc(var(--box-size) * -1.5);
          transform: rotateX(60deg) rotateZ(45deg) rotateY(0deg) translateZ(0px);
        }

        .box-loader-box {
          width: var(--box-size);
          height: var(--box-size);
          top: 0;
          left: 0;
          position: absolute;
          transform-style: preserve-3d;
        }

        .box-loader-box:nth-child(1) {
          transform: translate(100%, 0);
          animation: boxLoader1 var(--duration) linear infinite;
        }

        .box-loader-box:nth-child(2) {
          transform: translate(0, 100%);
          animation: boxLoader2 var(--duration) linear infinite;
        }

        .box-loader-box:nth-child(3) {
          transform: translate(100%, 100%);
          animation: boxLoader3 var(--duration) linear infinite;
        }

        .box-loader-box:nth-child(4) {
          transform: translate(200%, 0);
          animation: boxLoader4 var(--duration) linear infinite;
        }

        .box-loader-face {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          backface-visibility: hidden;
        }

        .box-loader-face:nth-child(1) {
          background: #ffffff;
          transform: translateZ(calc(var(--box-size) / 2));
        }

        .box-loader-face:nth-child(2) {
          background: #c4c4c4;
          transform: rotateY(90deg) translateZ(calc(var(--box-size) / 2));
        }

        .box-loader-face:nth-child(3) {
          background: #dedede;
          transform: rotateX(-90deg) translateZ(calc(var(--box-size) / 2));
        }

        .box-loader-face:nth-child(4) {
          background: #222222;
          transform: translateZ(calc(var(--box-size) * -3));
        }

        @keyframes boxLoader1 {
          0%, 50% {
            transform: translate(100%, 0);
          }
          100% {
            transform: translate(200%, 0);
          }
        }

        @keyframes boxLoader2 {
          0% {
            transform: translate(0, 100%);
          }
          50% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(100%, 0);
          }
        }

        @keyframes boxLoader3 {
          0%, 50% {
            transform: translate(100%, 100%);
          }
          100% {
            transform: translate(0, 100%);
          }
        }

        @keyframes boxLoader4 {
          0% {
            transform: translate(200%, 0);
          }
          50% {
            transform: translate(200%, 100%);
          }
          100% {
            transform: translate(100%, 100%);
          }
        }
      `}</style>

      <div className="box-loader-boxes">
        {[0, 1, 2, 3].map((idx) => (
          <div key={idx} className="box-loader-box">
            <div className="box-loader-face" />
            <div className="box-loader-face" />
            <div className="box-loader-face" />
            <div className="box-loader-face" />
          </div>
        ))}
      </div>
    </div>
  );
}
