// Helper function to convert hex to rgba
export const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Team color mapping based on country
export const getTeamColors = (teamName) => {
  if (!teamName) return { 
    primary: '#1976d2', 
    secondary: '#1565c0', 
    accent: '#42a5f5',
    bgColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.2)'
  };
  
  const name = teamName.toLowerCase();
  
  // India - Saffron, White, Green
  if (name.includes('india') || name.includes('ind')) {
    return {
      primary: '#FF9933',
      secondary: '#FF8800',
      accent: '#138808',
      bgColor: hexToRgba('#FF9933', 0.25),
      borderColor: hexToRgba('#FF9933', 0.5)
    };
  }
  
  // Australia - Green and Gold
  if (name.includes('australia') || name.includes('aus')) {
    return {
      primary: '#00843D',
      secondary: '#006B2D',
      accent: '#FFCD00',
      bgColor: hexToRgba('#00843D', 0.25),
      borderColor: hexToRgba('#00843D', 0.5)
    };
  }
  
  // England - Red, White, Blue
  if (name.includes('england') || name.includes('eng')) {
    return {
      primary: '#C8102E',
      secondary: '#A00E26',
      accent: '#012169',
      bgColor: hexToRgba('#C8102E', 0.25),
      borderColor: hexToRgba('#C8102E', 0.5)
    };
  }
  
  // Pakistan - Green and White
  if (name.includes('pakistan') || name.includes('pak')) {
    return {
      primary: '#01411C',
      secondary: '#003D14',
      accent: '#FFFFFF',
      bgColor: hexToRgba('#01411C', 0.25),
      borderColor: hexToRgba('#01411C', 0.5)
    };
  }
  
  // New Zealand - Black
  if (name.includes('zealand') || name.includes('nz')) {
    return {
      primary: '#000000',
      secondary: '#1a1a1a',
      accent: '#FFFFFF',
      bgColor: hexToRgba('#000000', 0.3),
      borderColor: hexToRgba('#000000', 0.5)
    };
  }
  
  // South Africa - Green, Gold
  if (name.includes('south africa') || name.includes('sa') || name.includes('proteas')) {
    return {
      primary: '#007A4D',
      secondary: '#006B42',
      accent: '#FFB612',
      bgColor: hexToRgba('#007A4D', 0.25),
      borderColor: hexToRgba('#007A4D', 0.5)
    };
  }
  
  // West Indies - Maroon, Gold
  if (name.includes('west indies') || name.includes('wi')) {
    return {
      primary: '#7B2D2D',
      secondary: '#5A1F1F',
      accent: '#FFD700',
      bgColor: hexToRgba('#7B2D2D', 0.25),
      borderColor: hexToRgba('#7B2D2D', 0.5)
    };
  }
  
  // Bangladesh - Red and Green
  if (name.includes('bangladesh') || name.includes('ban')) {
    return {
      primary: '#006A4E',
      secondary: '#005A3E',
      accent: '#F42A41',
      bgColor: hexToRgba('#006A4E', 0.25),
      borderColor: hexToRgba('#006A4E', 0.5)
    };
  }
  
  // Sri Lanka - Maroon and Gold
  if (name.includes('sri lanka') || name.includes('sl')) {
    return {
      primary: '#FFBE29',
      secondary: '#FFA500',
      accent: '#8B0000',
      bgColor: hexToRgba('#FFBE29', 0.25),
      borderColor: hexToRgba('#FFBE29', 0.5)
    };
  }
  
  // Afghanistan - Black, Red, Green
  if (name.includes('afghanistan') || name.includes('afg')) {
    return {
      primary: '#000000',
      secondary: '#1a1a1a',
      accent: '#D32011',
      bgColor: hexToRgba('#000000', 0.3),
      borderColor: hexToRgba('#000000', 0.5)
    };
  }
  
  // Default - Blue
  return {
    primary: '#1976d2',
    secondary: '#1565c0',
    accent: '#42a5f5',
    bgColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.2)'
  };
};
