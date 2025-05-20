import { useColorScheme } from 'react-native';

export const lightTheme = {
  colors: {
    primary: '#226944',
    primaryDark: '#1a5235',
    primaryLight: '#2a7d52',
    secondary: '#2c3e50',
    secondaryDark: '#1a2530',
    secondaryLight: '#34495e',
    accent: '#e74c3c',
    accentDark: '#c0392b',
    accentLight: '#f39c12',
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
      light: '#ffffff',
    },
    background: {
      primary: '#ffffff',
      secondary: '#f5f6fa',
    },
    border: '#dcdde1',
    error: '#e74c3c',
    success: '#27ae60',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
    },
    h2: {
      fontSize: 24,
      fontWeight: '700',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
    },
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
  },
};

export const darkTheme = {
  colors: {
    primary: '#2e8b57',
    primaryDark: '#226944',
    primaryLight: '#3cb371',
    secondary: '#34495e',
    secondaryDark: '#2c3e50',
    secondaryLight: '#4a6278',
    accent: '#e74c3c',
    accentDark: '#c0392b',
    accentLight: '#f39c12',
    text: {
      primary: '#ecf0f1',
      secondary: '#bdc3c7',
      light: '#ffffff',
    },
    background: {
      primary: '#1a1a1a',
      secondary: '#2d2d2d',
    },
    border: '#404040',
    error: '#e74c3c',
    success: '#27ae60',
  },
  spacing: lightTheme.spacing,
  typography: lightTheme.typography,
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 4,
    },
  },
};

export const useTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};

// Export the default theme for components that don't use the hook
export const colors = lightTheme.colors;
export const spacing = lightTheme.spacing;
export const typography = lightTheme.typography;
export const shadows = lightTheme.shadows; 