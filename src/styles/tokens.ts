import React from 'react';

// Color tokens
export const colors = {
  // Primary
  purple: {
    primary: '#9966FF',
    dark: '#8040F0',
    darker: '#6F35D1',
    light: '#E8DEFF',
    background: 'rgba(168, 171, 255, 0.36)',
  },

  // Accent
  orange: '#F37052',
  pink: '#FF8FA3',

  // Green (Optimized IT)
  green: {
    primary: '#4AB583',
    light: '#CEFFDE',
  },

  // Neutrals
  text: {
    primary: '#201515',
    secondary: '#4A5565',
    muted: '#868686',
    heading: '#101828',
  },

  // Borders
  border: {
    light: '#D9D9D9',
    lighter: 'rgba(0, 0, 0, 0.12)',
    medium: '#C1C1C1',
    accent: '#A182FF',
  },

  // Backgrounds
  background: {
    white: '#FFFFFF',
    error: '#FFF5F5',
    gradient: 'linear-gradient(180deg, #F9F5FF 0%, #FFFFFF 100%)',
    buttonGradient: 'linear-gradient(to right, #9966FF, #5C3D99)',
    selectedGradient: 'linear-gradient(to right, #9966FF, #FF8FA3)',
    recommendationBg: 'rgba(201, 201, 201, 0.36)',
  },

  // Status
  error: '#FF0000',
};

// Typography tokens
export const typography = {
  fontFamily: {
    primary: 'Inter',
    display: 'Inter Display',
  },

  fontSize: {
    xs: '11px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '48px',
    '3xl': '56px',
  },

  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  letterSpacing: {
    tight: '-0.02em',
    normal: '-0.004em',
    wide: '11px',
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.3,
    relaxed: 1.5,
    loose: 1.6,
  },
};

// Spacing tokens
export const spacing = {
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '20px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
  '5xl': '94px',
};

// Border radius tokens
export const borderRadius = {
  sm: '8px',
  md: '10px',
  lg: '16px',
  full: '50%',
};

// Transition tokens
export const transitions = {
  fast: '200ms ease',
  normal: '300ms ease-in-out',
};

// Common styles
export const commonStyles = {
  // Card container
  card: {
    maxWidth: '1066px',
    width: '100%',
    border: `1px solid ${colors.border.lighter}`,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.white,
  } as React.CSSProperties,

  // Page background
  pageBackground: {
    minHeight: '100vh',
    background: colors.background.gradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  } as React.CSSProperties,

  // Input field
  input: {
    width: '100%',
    padding: `${spacing.md} ${spacing.lg}`,
    borderRadius: borderRadius.sm,
    border: `1px solid ${colors.border.light}`,
    backgroundColor: colors.background.white,
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    outline: 'none',
    transition: `border ${transitions.fast}`,
  } as React.CSSProperties,

  // Primary button
  primaryButton: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.background.white,
    backgroundColor: colors.purple.dark,
    border: 'none',
    borderRadius: borderRadius.sm,
    padding: `${spacing.lg} ${spacing.xl}`,
    cursor: 'pointer',
    transition: `background-color ${transitions.fast}`,
  } as React.CSSProperties,

  // Secondary button (outline)
  secondaryButton: {
    padding: `${spacing.md} 40px`,
    borderRadius: borderRadius.sm,
    border: `1px solid ${colors.border.medium}`,
    backgroundColor: colors.background.white,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: `all ${transitions.fast}`,
  } as React.CSSProperties,

  // Option button
  optionButton: {
    width: '100%',
    textAlign: 'left' as const,
    padding: `${spacing.lg} ${spacing.xl}`,
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.border.light}`,
    background: colors.background.white,
    color: colors.text.primary,
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.regular,
    letterSpacing: '-0.072px',
    lineHeight: typography.lineHeight.relaxed,
    cursor: 'pointer',
    transition: `all ${transitions.fast}`,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  } as React.CSSProperties,

  // Selected option button
  optionButtonSelected: {
    border: `1px solid ${colors.purple.primary}`,
    background: colors.background.selectedGradient,
    color: colors.background.white,
  } as React.CSSProperties,

  // Result heading (Your result)
  resultLabel: {
    textTransform: 'uppercase' as const,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeight.medium,
    fontSize: typography.fontSize.xs,
    letterSpacing: typography.letterSpacing.wide,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    backgroundColor: colors.purple.background,
    padding: '2px 10px',
  } as React.CSSProperties,

  // Maturity level heading
  maturityHeading: {
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.fontWeight.medium,
    fontSize: typography.fontSize['2xl'],
    letterSpacing: typography.letterSpacing.tight,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  } as React.CSSProperties,

  // Description text
  description: {
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.fontWeight.regular,
    fontSize: typography.fontSize.lg,
    letterSpacing: typography.letterSpacing.normal,
    color: colors.text.primary,
    lineHeight: typography.lineHeight.loose,
    marginBottom: spacing.lg,
  } as React.CSSProperties,

  // Question heading
  questionHeading: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.regular,
    letterSpacing: '-0.96px',
    color: colors.text.primary,
    lineHeight: typography.lineHeight.normal,
    marginBottom: spacing['3xl'],
  } as React.CSSProperties,

  // Recommendation section
  recommendationLabel: {
    textTransform: 'uppercase' as const,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeight.medium,
    fontSize: typography.fontSize.xs,
    letterSpacing: typography.letterSpacing.wide,
    color: colors.text.secondary,
    backgroundColor: colors.background.recommendationBg,
    padding: '2px 10px',
  } as React.CSSProperties,

  // Recommendation card
  recommendationCard: {
    borderLeft: `2px solid ${colors.border.accent}`,
    paddingLeft: spacing.md,
  } as React.CSSProperties,

  // Recommendation title
  recommendationTitle: {
    fontFamily: typography.fontFamily.display,
    fontWeight: typography.fontWeight.medium,
    fontSize: typography.fontSize.lg,
    color: colors.text.heading,
    letterSpacing: '-0.005em',
    marginBottom: spacing.xs,
  } as React.CSSProperties,

  // Recommendation text
  recommendationText: {
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeight.medium,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    letterSpacing: '-0.0015em',
  } as React.CSSProperties,
};

// Maturity level descriptions
export const maturityDescriptions: Record<string, string> = {
  'Reactive IT': 'Your agents are handling work that AI and automation could deflect. Every ticket deflected saves 15-30 minutes of agent time.',
  'Structured IT': "You've started deflecting easy stuff, but agents still spend significant time on automatable work with manual handoffs between systems.",
  'Optimized IT': "You've automated the routine. Agents focus on work that genuinely requires expertise—complex troubleshooting, architecture, strategic initiatives.",
};

// Goal-based recommendations
export const recommendations: Record<string, Record<string, { priority: string; insight: string }>> = {
  'Reactive IT': {
    'option_1': {
      priority: 'Simple AI deflection, fast implementation, low admin overhead',
      insight: 'At 1,000 deflectable tickets/month, effective AI can reclaim 250-500 hours of agent time.',
    },
    'option_2': {
      priority: 'Slack/Teams-native, consumer-simple UX, mobile-first',
      insight: 'Employees shouldn't need training to get help. Meet them where they already work.',
    },
    'option_3': {
      priority: 'Start with deflection before workflow automation',
      insight: 'Reduce volume first—then you'll have capacity to build automation.',
    },
    'option_4': {
      priority: 'Quick wins with AI deflection to build momentum',
      insight: 'Demonstrate ROI with measurable ticket reduction before larger transformation.',
    },
  },
  'Structured IT': {
    'option_1': {
      priority: 'Production-ready AI with proven deflection rates, workflow automation',
      insight: 'Every automated workflow saves 10-20 minutes per execution.',
    },
    'option_2': {
      priority: 'Seamless handoffs, proactive notifications, self-service workflows',
      insight: 'Employees feel the friction of manual handoffs. Smooth the edges.',
    },
    'option_3': {
      priority: 'ESM capabilities, low-code workflows, strong integrations',
      insight: 'Extend service management beyond IT without proportional headcount.',
    },
    'option_4': {
      priority: 'API-first platforms that integrate with your ecosystem',
      insight: 'Avoid rip-and-replace. Composable platforms let you modernize incrementally.',
    },
  },
  'Optimized IT': {
    'option_1': {
      priority: 'Advanced AI for edge cases, predictive capabilities',
      insight: 'You've handled the obvious—now tackle the long tail.',
    },
    'option_2': {
      priority: 'Proactive service, personalization, cross-department consistency',
      insight: 'Move from reactive to anticipatory service delivery.',
    },
    'option_3': {
      priority: 'Federated architecture, enterprise-wide ESM',
      insight: 'Your model works—now extend it systematically across the organization.',
    },
    'option_4': {
      priority: 'Composable architecture, consumption analytics, transparent TCO',
      insight: 'Value shifts from cost reduction to capacity creation for strategic work.',
    },
  },
};
