import React from 'react';
import { MaturityLevel } from '../hooks/useQuizLogic';

interface MaturityVisualizationProps {
  maturityLevel: MaturityLevel;
  idSuffix?: string; // Unique suffix to prevent gradient ID collisions
}

export default function MaturityVisualization({ maturityLevel, idSuffix = '' }: MaturityVisualizationProps) {
  const getFilterStyle = (level: MaturityLevel) => {
    return maturityLevel === level ? 'none' : 'saturate(0.2) brightness(1.3) contrast(0.8)';
  };

  const getTextColor = (level: MaturityLevel) => {
    return maturityLevel === level ? '#FFFFFF' : '#868686';
  };

  const textOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontFamily: 'Inter',
    fontWeight: 700,
    fontSize: '18px',
    letterSpacing: '-0.015em',
    transition: 'color 300ms ease',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0px' }}>
      {/* Optimized IT - Top */}
      <div style={{ filter: getFilterStyle('Optimized IT'), transition: 'filter 300ms ease', position: 'relative', marginBottom: '-85px', zIndex: 3 }}>
        <svg width="273" height="165" viewBox="0 0 273 165" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="156.941" height="156.941" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0.309082 86.1445)" fill={`url(#paint0_linear_optimized${idSuffix})`} stroke="#272727" strokeWidth="0.306599" strokeLinecap="round" strokeDasharray="3.07 3.07"/>
          <rect width="156.941" height="156.941" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0 78.4688)" fill={`url(#paint1_linear_optimized${idSuffix})`} stroke="#B2B2B2" strokeWidth="0.383248" strokeLinecap="round"/>
          <defs>
            <linearGradient id={`paint0_linear_optimized${idSuffix}`} x1="78.4703" y1="0" x2="78.4703" y2="156.941" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D8D8D8"/>
              <stop offset="0.504808" stopColor="white"/>
              <stop offset="1" stopColor="#D8D8D8"/>
            </linearGradient>
            <linearGradient id={`paint1_linear_optimized${idSuffix}`} x1="152.683" y1="4.12785" x2="-0.317485" y2="157.128" gradientUnits="userSpaceOnUse">
              <stop offset="0.226929" stopColor="#4AB583"/>
              <stop offset="1" stopColor="#CEFFDE"/>
            </linearGradient>
          </defs>
        </svg>
        <div style={{ ...textOverlayStyle, color: getTextColor('Optimized IT') }}>
          Optimized IT
        </div>
      </div>

      {/* Structured IT - Middle */}
      <div style={{ filter: getFilterStyle('Structured IT'), transition: 'filter 300ms ease', position: 'relative', marginBottom: '-110px', zIndex: 2 }}>
        <svg width="334" height="201" viewBox="0 0 334 201" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="192.376" height="192.376" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0.147461 104.18)" fill={`url(#paint0_linear_structured${idSuffix})`} stroke="#272727" strokeWidth="0.306599" strokeLinecap="round" strokeDasharray="3.07 3.07"/>
          <g filter={`url(#filter0_n_structured${idSuffix})`}>
            <rect width="192.376" height="192.376" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0 96.1875)" fill={`url(#paint1_linear_structured${idSuffix})`}/>
            <rect width="192.376" height="192.376" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0 96.1875)" stroke="#B2B2B2" strokeWidth="0.383248" strokeLinecap="round"/>
          </g>
          <defs>
            <filter id={`filter0_n_structured${idSuffix}`} x="7.54248" y="4.35547" width="318.12" height="183.664" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feTurbulence type="fractalNoise" baseFrequency="2 2" stitchTiles="stitch" numOctaves="3" result="noise" seed="936" />
              <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
              <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                <feFuncA type="discrete" tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "/>
              </feComponentTransfer>
              <feComposite operator="in" in2="shape" in="coloredNoise1" result="noise1Clipped" />
              <feFlood floodColor="rgba(50, 11, 117, 0.15)" result="color1Flood" />
              <feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
              <feMerge result={`effect1_noise_structured${idSuffix}`}>
                <feMergeNode in="shape" />
                <feMergeNode in="color1" />
              </feMerge>
            </filter>
            <linearGradient id={`paint0_linear_structured${idSuffix}`} x1="96.188" y1="0" x2="96.188" y2="192.376" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D8D8D8"/>
              <stop offset="0.504808" stopColor="white"/>
              <stop offset="1" stopColor="#D8D8D8"/>
            </linearGradient>
            <linearGradient id={`paint1_linear_structured${idSuffix}`} x1="187.157" y1="5.05987" x2="-0.38917" y2="192.606" gradientUnits="userSpaceOnUse">
              <stop offset="0.226929" stopColor="#392064"/>
              <stop offset="1" stopColor="#8E7BFF"/>
            </linearGradient>
          </defs>
        </svg>
        <div style={{ ...textOverlayStyle, color: getTextColor('Structured IT') }}>
          Structured IT
        </div>
      </div>

      {/* Reactive IT - Bottom */}
      <div style={{ filter: getFilterStyle('Reactive IT'), transition: 'filter 300ms ease', position: 'relative', zIndex: 1 }}>
        <svg width="418" height="253" viewBox="0 0 418 253" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="241.044" height="241.044" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0 131.535)" fill={`url(#paint0_linear_reactive${idSuffix})`} stroke="#272727" strokeWidth="0.306599" strokeLinecap="round" strokeDasharray="3.07 3.07"/>
          <g filter={`url(#filter0_n_reactive${idSuffix})`}>
            <path d="M13.2761 128.184C5.94391 123.951 5.94391 117.088 13.2761 112.855L195.475 7.66227C202.807 3.42903 214.695 3.42903 222.027 7.66227L404.225 112.855C411.557 117.088 411.557 123.951 404.225 128.184L222.027 233.377C214.695 237.61 202.807 237.61 195.475 233.377L13.2761 128.184Z" fill={`url(#paint1_linear_reactive${idSuffix})`}/>
            <path d="M13.2761 128.184C5.94391 123.951 5.94391 117.088 13.2761 112.855L195.475 7.66227C202.807 3.42903 214.695 3.42903 222.027 7.66227L404.225 112.855C411.557 117.088 411.557 123.951 404.225 128.184L222.027 233.377C214.695 237.61 202.807 237.61 195.475 233.377L13.2761 128.184Z" stroke="#B2B2B2" strokeWidth="0.383248" strokeLinecap="round"/>
          </g>
          <defs>
            <filter id={`filter0_n_reactive${idSuffix}`} x="7.54248" y="4.35156" width="402.417" height="232.336" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feTurbulence type="fractalNoise" baseFrequency="2 2" stitchTiles="stitch" numOctaves="3" result="noise" seed="936" />
              <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
              <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                <feFuncA type="discrete" tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "/>
              </feComponentTransfer>
              <feComposite operator="in" in2="shape" in="coloredNoise1" result="noise1Clipped" />
              <feFlood floodColor="rgba(50, 11, 117, 0.15)" result="color1Flood" />
              <feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
              <feMerge result={`effect1_noise_reactive${idSuffix}`}>
                <feMergeNode in="shape" />
                <feMergeNode in="color1" />
              </feMerge>
            </filter>
            <linearGradient id={`paint0_linear_reactive${idSuffix}`} x1="120.522" y1="0" x2="120.522" y2="241.044" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D8D8D8"/>
              <stop offset="0.504808" stopColor="white"/>
              <stop offset="1" stopColor="#D8D8D8"/>
            </linearGradient>
            <linearGradient id={`paint1_linear_reactive${idSuffix}`} x1="208.577" y1="6.43726" x2="208.577" y2="241.429" gradientUnits="userSpaceOnUse">
              <stop offset="0.226929" stopColor="#392064"/>
              <stop offset="1" stopColor="#8E7BFF"/>
            </linearGradient>
          </defs>
        </svg>
        <div style={{ ...textOverlayStyle, color: getTextColor('Reactive IT') }}>
          Reactive IT
        </div>
      </div>
    </div>
  );
}
