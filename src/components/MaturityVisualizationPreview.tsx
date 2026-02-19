import React from 'react';
import { MaturityLevel } from '../hooks/useQuizLogic';

interface MaturityVisualizationPreviewProps {
  maturityLevel: MaturityLevel;
  idSuffix?: string;
}

// Simplified version without noise filters - used for blurred preview background
export default function MaturityVisualizationPreview({ maturityLevel, idSuffix = '_preview' }: MaturityVisualizationPreviewProps) {
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
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0px' }}>
      {/* Optimized IT - Top */}
      <div style={{ filter: getFilterStyle('Optimized IT'), position: 'relative', marginBottom: '-85px', zIndex: 3 }}>
        <svg width="273" height="165" viewBox="0 0 273 165" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="156.941" height="156.941" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0.309082 86.1445)" fill={`url(#paint0_linear${idSuffix}1)`} stroke="#272727" strokeWidth="0.306599" strokeLinecap="round" strokeDasharray="3.07 3.07"/>
          <rect width="156.941" height="156.941" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0 78.4688)" fill={`url(#paint1_linear${idSuffix}1)`} stroke="#B2B2B2" strokeWidth="0.383248" strokeLinecap="round"/>
          <defs>
            <linearGradient id={`paint0_linear${idSuffix}1`} x1="78.4703" y1="0" x2="78.4703" y2="156.941" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D8D8D8"/>
              <stop offset="0.504808" stopColor="white"/>
              <stop offset="1" stopColor="#D8D8D8"/>
            </linearGradient>
            <linearGradient id={`paint1_linear${idSuffix}1`} x1="152.683" y1="4.12785" x2="-0.317485" y2="157.128" gradientUnits="userSpaceOnUse">
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
      <div style={{ filter: getFilterStyle('Structured IT'), position: 'relative', marginBottom: '-110px', zIndex: 2 }}>
        <svg width="334" height="201" viewBox="0 0 334 201" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="192.376" height="192.376" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0.147461 104.18)" fill={`url(#paint0_linear${idSuffix}2)`} stroke="#272727" strokeWidth="0.306599" strokeLinecap="round" strokeDasharray="3.07 3.07"/>
          <rect width="192.376" height="192.376" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0 96.1875)" fill={`url(#paint1_linear${idSuffix}2)`} stroke="#B2B2B2" strokeWidth="0.383248" strokeLinecap="round"/>
          <defs>
            <linearGradient id={`paint0_linear${idSuffix}2`} x1="96.188" y1="0" x2="96.188" y2="192.376" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D8D8D8"/>
              <stop offset="0.504808" stopColor="white"/>
              <stop offset="1" stopColor="#D8D8D8"/>
            </linearGradient>
            <linearGradient id={`paint1_linear${idSuffix}2`} x1="187.097" y1="5.05926" x2="-0.389069" y2="192.546" gradientUnits="userSpaceOnUse">
              <stop offset="0.226929" stopColor="#9966FF"/>
              <stop offset="1" stopColor="#E8DEFF"/>
            </linearGradient>
          </defs>
        </svg>
        <div style={{ ...textOverlayStyle, color: getTextColor('Structured IT') }}>
          Structured IT
        </div>
      </div>

      {/* Reactive IT - Bottom */}
      <div style={{ filter: getFilterStyle('Reactive IT'), position: 'relative', zIndex: 1 }}>
        <svg width="395" height="237" viewBox="0 0 395 237" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="227.811" height="227.811" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0.147461 122.18)" fill={`url(#paint0_linear${idSuffix}3)`} stroke="#272727" strokeWidth="0.306599" strokeLinecap="round" strokeDasharray="3.07 3.07"/>
          <rect width="227.811" height="227.811" rx="15.3299" transform="matrix(0.866025 -0.5 0.866025 0.5 0 113.906)" fill={`url(#paint1_linear${idSuffix}3`} stroke="#B2B2B2" strokeWidth="0.383248" strokeLinecap="round"/>
          <defs>
            <linearGradient id={`paint0_linear${idSuffix}3`} x1="113.906" y1="0" x2="113.906" y2="227.811" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D8D8D8"/>
              <stop offset="0.504808" stopColor="white"/>
              <stop offset="1" stopColor="#D8D8D8"/>
            </linearGradient>
            <linearGradient id={`paint1_linear${idSuffix}3`} x1="221.523" y1="5.9891" x2="-0.460638" y2="227.973" gradientUnits="userSpaceOnUse">
              <stop offset="0.226929" stopColor="#9966FF"/>
              <stop offset="1" stopColor="#E8DEFF"/>
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
