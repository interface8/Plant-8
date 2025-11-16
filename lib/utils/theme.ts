/**
 * Apply product theme colors to a component
 * Returns CSS custom properties for dynamic theming
 */
export function applyProductTheme(cssThemeProperty: any) {
  if (!cssThemeProperty || typeof cssThemeProperty !== 'object') {
    return {};
  }

  const theme = cssThemeProperty as {
    primary?: string;
    secondary?: string;
    accent?: string;
    gradient?: string;
  };

  return {
    '--theme-primary': theme.primary || '#10b981',
    '--theme-secondary': theme.secondary || '#059669',
    '--theme-accent': theme.accent || '#34d399',
    '--theme-gradient': theme.gradient || 'from-green-500 to-teal-500',
  } as React.CSSProperties;
}

/**
 * Get Tailwind gradient classes from theme property
 */
export function getThemeGradient(cssThemeProperty: any): string {
  if (!cssThemeProperty || typeof cssThemeProperty !== 'object') {
    return 'from-green-500 to-teal-500';
  }

  const theme = cssThemeProperty as { gradient?: string };
  return theme.gradient || 'from-green-500 to-teal-500';
}

/**
 * Get primary color from theme property
 */
export function getThemePrimary(cssThemeProperty: any): string {
  if (!cssThemeProperty || typeof cssThemeProperty !== 'object') {
    return '#10b981';
  }

  const theme = cssThemeProperty as { primary?: string };
  return theme.primary || '#10b981';
}

/**
 * Get secondary color from theme property
 */
export function getThemeSecondary(cssThemeProperty: any): string {
  if (!cssThemeProperty || typeof cssThemeProperty !== 'object') {
    return '#059669';
  }

  const theme = cssThemeProperty as { secondary?: string };
  return theme.secondary || '#059669';
}

/**
 * Get accent color from theme property
 */
export function getThemeAccent(cssThemeProperty: any): string {
  if (!cssThemeProperty || typeof cssThemeProperty !== 'object') {
    return '#34d399';
  }

  const theme = cssThemeProperty as { accent?: string };
  return theme.accent || '#34d399';
}

/**
 * Check if a color is light or dark (for contrast)
 */
export function isLightColor(color: string): boolean {
  // Remove # if present
  const hex = color.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5;
}

/**
 * Get appropriate text color based on background
 */
export function getContrastTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
}
