import { ViewStyle, TextStyle, Dimensions } from 'react-native';

// Get device dimensions for responsive design
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// iPhone screen size detection
const isSmallScreen = screenWidth < 375; // iPhone SE
const isMediumScreen = screenWidth >= 375 && screenWidth < 414; // iPhone 12/13/14
const isLargeScreen = screenWidth >= 414; // iPhone 14 Plus/15 Pro Max

// Responsive scaling function
const scale = (size: number) => {
  if (isSmallScreen) return size * 0.9;
  if (isLargeScreen) return size * 1.1;
  return size;
};

// Professional iOS-Style Color Palette - White Background Theme
export const colors = {
  // Primary Gradient Colors - Premium iOS style with enhanced depth
  primary: {
    start: '#007AFF',
    end: '#5856D6',
    accent: '#19beebff',
    liquid: ['#007AFF', '#4A90E2', '#5856D6', '#13b6dbff'], // Extended gradient
  },

  // Background Gradients - White iOS theme
  background: {
    primary: ['#FFFFFF', '#F8F9FA', '#F1F3F4'],
    secondary: ['#FFFFFF', '#F8F9FA'],
    card: ['rgba(255, 255, 255, 0.95)', 'rgba(248, 249, 250, 0.9)', 'rgba(255, 255, 255, 0.85)'],
    glass: 'rgba(255, 255, 255, 0.8)',
    liquid: ['rgba(255, 255, 255, 0.95)', 'rgba(248, 249, 250, 0.9)', 'rgba(241, 243, 244, 0.85)'],
  },

  // Sensor Colors - Premium iOS compatible gradients with enhanced visual appeal
  sensors: {
    temperature: ['#FF6B35', '#FF8E53', '#FFB347', '#FFC947'], // Warm orange to golden
    humidity: ['#007AFF', '#4A90E2', '#5AC8FA', '#64D2FF'], // Deep blue to cyan
    soil: ['#34C759', '#32D74B', '#30D158', '#28CD41'], // Rich green spectrum
    light: ['#FFCC02', '#FFD60A', '#FF9500', '#FFB347'], // Golden yellow to amber
    rain: ['#5856D6', '#7B68EE', '#AF52DE', '#BF5AF2'], // Purple to magenta
    flow: ['#13cff0ff', '#0cced1ff', '#19a1d7ff', '#20b0dcff'], // Pink to coral
  },

  // Feature-specific gradients for new components
  features: {
    weather: ['#5AC8FA', '#007AFF', '#5856D6', '#AF52DE'], // Blue to purple
    forecast: ['#32D74B', '#30D158', '#34C759', '#28CD41'], // Green spectrum
    systemStatus: ['#FF9500', '#FFB347', '#FFCC02', '#FFD60A'], // Amber to gold
    alerts: ['#FF3B30', '#FF375F', '#FF6482', '#FF8FA3'], // Red to pink
    decisionSupport: ['#007AFF', '#4A90E2', '#5AC8FA', '#64D2FF'], // Blue spectrum
    chatbot: ['#5856D6', '#7B68EE', '#AF52DE', '#BF5AF2'], // Purple spectrum
    analytics: ['#FF2D92', '#FF375F', '#FF6482', '#FF8FA3'], // Pink to coral
  },

  // Status Colors - Premium iOS system colors with enhanced gradients
  status: {
    success: ['#34C759', '#32D74B', '#30D158', '#28CD41'], // Rich green spectrum
    warning: ['#FF9500', '#FFB347', '#FFCC02', '#FFD60A'], // Amber to gold
    error: ['#FF3B30', '#FF375F', '#FF6482', '#FF8FA3'], // Red to pink
    info: ['#007AFF', '#4A90E2', '#5AC8FA', '#64D2FF'], // Blue spectrum
  },

  // Text Colors - iOS style with dark text on white
  text: {
    primary: '#1C1C1E',
    secondary: '#3A3A3C',
    tertiary: '#48484A',
    accent: '#007AFF',
    muted: '#8E8E93',
    onDark: '#FFFFFF',
    onLight: '#1C1C1E',
    contrast: '#1C1C1E',
    white: '#FFFFFF',
  },

  // iOS Glassmorphism Effects
  glass: {
    ultra: 'rgba(255, 255, 255, 0.9)',
    light: 'rgba(255, 255, 255, 0.8)',
    medium: 'rgba(255, 255, 255, 0.7)',
    dark: 'rgba(255, 255, 255, 0.6)',
    subtle: 'rgba(255, 255, 255, 0.5)',
    border: 'rgba(0, 0, 0, 0.1)',
    borderSubtle: 'rgba(0, 0, 0, 0.05)',
    overlay: 'rgba(255, 255, 255, 0.9)',
    textOverlay: 'rgba(255, 255, 255, 0.95)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },

  // iOS-style Glow Effects
  glow: {
    card: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 16,
    },
    cardBorder: {
      shadowColor: '#007AFF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
  },
};

// iOS 18+ Responsive Spacing System - Compact Mobile Layout
export const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(10), // Reduced from 12
  lg: scale(16), // Reduced from 20
  xl: scale(24), // Reduced from 28
  xxl: scale(32), // Reduced from 40
  xxxl: scale(48), // Reduced from 56

  // Card-specific spacing - Tighter mobile padding
  cardPadding: scale(16), // Reduced from 20
  cardPaddingLarge: scale(20), // Reduced from 24
  cardMargin: scale(10), // Reduced from 12
  cardGap: scale(10), // Tighter spacing

  // Screen margins
  screenHorizontal: scale(16),
  screenVertical: scale(16), // Reduced from 20

  // Section spacing
  sectionGap: scale(16), // Reduced from 24
  componentGap: scale(12), // Reduced from 16

  // Icon spacing
  iconMargin: scale(10), // Reduced from 12
  iconPadding: scale(8), // Reduced from 10
};

// Responsive Typography - Optimized for card text fitting
export const typography = {
  h1: {
    fontSize: scale(26), // Reduced from 28 for better fitting
    fontWeight: '700' as const,
    color: colors.text.primary,
    letterSpacing: -0.5,
    lineHeight: scale(32), // Reduced from 34
  } as TextStyle,

  h2: {
    fontSize: scale(20), // Reduced from 22 for better fitting
    fontWeight: '600' as const,
    color: colors.text.primary,
    letterSpacing: -0.3,
    lineHeight: scale(26), // Reduced from 28
  } as TextStyle,

  h3: {
    fontSize: scale(16), // Reduced from 18 for better fitting
    fontWeight: '600' as const,
    color: colors.text.primary,
    letterSpacing: -0.2,
    lineHeight: scale(22), // Reduced from 24
  } as TextStyle,

  body: {
    fontSize: scale(14), // Reduced from 16 for better fitting
    fontWeight: '400' as const,
    color: colors.text.secondary,
    lineHeight: scale(20), // Reduced from 22
  } as TextStyle,

  caption: {
    fontSize: scale(11), // Reduced from 12 for better fitting
    fontWeight: '500' as const,
    color: colors.text.tertiary,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
    lineHeight: scale(14), // Reduced from 16
  } as TextStyle,

  accent: {
    fontSize: scale(13), // Reduced from 14 for better fitting
    fontWeight: '600' as const,
    color: colors.text.accent,
    lineHeight: scale(17), // Reduced from 18
  } as TextStyle,
};

// iOS 18 Card Dimensions - Compact Mobile Proportions
export const cardDimensions = {
  // Standard card heights
  uniform: scale(160), // Reduced from 200

  // Hero component (soil gauge)
  hero: scale(280), // Reduced from 320

  // Chart containers
  chart: scale(320), // Reduced from 360
  chartHeight: scale(300), // Reduced from 360

  // Tab content containers
  tabContent: scale(300), // Reduced from 340

  // Grid card dimensions
  gridCard: {
    width: (screenWidth - spacing.screenHorizontal * 2 - spacing.cardGap) / 2,
    height: scale(150), // Reduced from 200
  },

  // Sensor cards
  sensorCard: {
    width: (screenWidth - spacing.screenHorizontal * 2 - spacing.cardGap) / 2,
    height: scale(140), // Reduced from 200
  },

  // Full width cards
  fullWidth: screenWidth - spacing.screenHorizontal * 2,

  // Control card height
  controlHeight: scale(380), // Reduced from 450


  // iOS 18 Border Radius - Liquid glass aesthetic
  borderRadius: scale(20), // Modern, not too rounded
  borderRadiusSmall: scale(12),
  borderRadiusMedium: scale(16),
  borderRadiusLarge: scale(24),

  // Icon sizes
  iconSmall: scale(40),
  iconMedium: scale(48),
  iconLarge: scale(56),
};

// Liquid Glassmorphism Card Style
export const glassCard: ViewStyle = {
  backgroundColor: 'transparent',
  borderRadius: cardDimensions.borderRadius,
  borderWidth: 1,
  borderColor: colors.glass.border,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: scale(15),
  },
  shadowOpacity: 0.4,
  shadowRadius: scale(25),
  elevation: 20,
  overflow: 'hidden',
};

// Liquid Glass Background Component Style
export const liquidGlass: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: cardDimensions.borderRadius,
};

// Premium Button Style
export const glassButton: ViewStyle = {
  backgroundColor: colors.glass.light,
  borderRadius: scale(16),
  borderWidth: 0.5,
  borderColor: colors.glass.border,
  paddingVertical: scale(14),
  paddingHorizontal: scale(24),
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: scale(4),
  },
  shadowOpacity: 0.2,
  shadowRadius: scale(8),
  elevation: 6,
  minHeight: scale(48), // Minimum touch target
};

// Animation Presets - Enhanced for smooth professional animations
export const animations = {
  // Spring animations for natural feel
  spring: {
    tension: 120,
    friction: 8,
    useNativeDriver: true,
  },

  // Timing animations for smooth transitions
  timing: {
    duration: 300,
    useNativeDriver: true,
  },

  // Bounce for interactive elements
  bounce: {
    tension: 200,
    friction: 10,
    useNativeDriver: true,
  },

  // Fast animations for micro-interactions
  fast: {
    duration: 150,
    useNativeDriver: true,
  },

  // Slow animations for emphasis
  slow: {
    duration: 500,
    useNativeDriver: true,
  },

  // Card entrance animations
  cardEntrance: {
    duration: 400,
    useNativeDriver: true,
  },

  // Stagger animation delays
  stagger: {
    delay: 100, // Delay between card animations
  },
};

// Border Radius System
export const borderRadius = {
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(20),
  xxl: scale(24),
  round: scale(50),
};

// Touch Target Sizes (Apple HIG compliant)
export const touchTargets = {
  minimum: scale(44), // Apple minimum
  comfortable: scale(48),
  large: scale(56),
};

// Safe Area Insets for different iPhone models
export const safeArea = {
  top: isLargeScreen ? 47 : 44, // Dynamic Island vs Notch
  bottom: 34, // Home indicator
  horizontal: 0,
};

// Layout Constants
export const layout = {
  headerHeight: scale(60),
  tabBarHeight: scale(85),
  cardSpacing: spacing.cardMargin,
  sectionSpacing: spacing.xl,

  // Grid system
  columns: 2,
  gutterWidth: spacing.md,
};

// Performance optimized styles
export const performanceStyles = {
  // Use transform instead of changing layout properties
  scale: (value: number) => ({ transform: [{ scale: value }] }),

  // Opacity for fade effects
  fade: (opacity: number) => ({ opacity }),

  // Hardware accelerated transforms
  translate: (x: number, y: number) => ({
    transform: [{ translateX: x }, { translateY: y }]
  }),
};