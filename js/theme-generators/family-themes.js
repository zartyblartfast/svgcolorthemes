/**
 * family-themes.js - Family-based theme generation
 * Generates color themes that preserve relationships between colors in the original SVG
 */

/**
 * Generate color themes based on the original SVG structure and base colors
 * @param {Object} structure - Parsed SVG structure
 * @param {Array} baseColors - Array of base color objects with name, color, and HSL adjustments
 * @returns {Object} - Map of theme names to color assignments
 */
function generateFamilyThemes(structure, baseColors) {
  // Find all paths (flattened)
  let paths = getAllPaths(structure);
  if (paths.length === 0) return { error: "No paths found in SVG structure." };

  // Extract original HSL for each path
  let originalHSL = paths.map(p => {
    let rgb = hexToRgb(p.fill);
    return rgbToHsl(rgb);
  });
  
  // Compute mean H, S, L
  let meanH = average(originalHSL.map(hsl => hsl[0]));
  let meanS = average(originalHSL.map(hsl => hsl[1]));
  let meanL = average(originalHSL.map(hsl => hsl[2]));
  
  // Compute offsets for each path
  let offsets = originalHSL.map(([h, s, l]) => [h - meanH, s - meanS, l - meanL]);

  // Generate themes
  let themes = {};
  
  // Original theme
  let originalTheme = {};
  paths.forEach((p, i) => {
    originalTheme[p.id] = p.fill;
  });
  themes["Original"] = originalTheme;
  
  // Family themes
  baseColors.forEach(base => {
    let baseRGB = hexToRgb(base.color);
    let baseHSL = rgbToHsl(baseRGB);
    
    // Apply adjustments
    let baseH = baseHSL[0] + (base.hue || 0);
    let baseS = baseHSL[1] + (base.saturation || 0);
    let baseL = baseHSL[2] + (base.lightness || 0);
    
    // Clamp
    baseH = ((baseH % 360) + 360) % 360;
    baseS = Math.max(0, Math.min(100, baseS));
    baseL = Math.max(0, Math.min(100, baseL));
    
    let assignments = {};
    paths.forEach((p, i) => {
      let h = ((baseH + offsets[i][0]) % 360 + 360) % 360;
      let s = Math.max(0, Math.min(100, baseS + offsets[i][1]));
      let l = Math.max(0, Math.min(100, baseL + offsets[i][2]));
      let rgb = hslToRgb([h, s, l]);
      assignments[p.id] = rgbToHex(rgb);
    });
    
    themes[base.name] = assignments;
  });
  
  return themes;
}

// Default base colors
const defaultBaseColors = [
  { name: 'red_family', color: '#f25c54', hue: 0, saturation: 0, lightness: 0 },
  { name: 'teal_family', color: '#2a9d8f', hue: 0, saturation: 0, lightness: 0 },
  { name: 'yellow_family', color: '#f6bd60', hue: 0, saturation: 0, lightness: 0 },
  { name: 'purple_family', color: '#6a0572', hue: 0, saturation: 0, lightness: 0 },
  { name: 'orange_family', color: '#f7b32b', hue: 0, saturation: 0, lightness: 0 },
  { name: 'blue_family', color: '#488bfc', hue: 0, saturation: 0, lightness: 0 }
];

// Export functions for use in other modules
if (typeof window !== 'undefined') {
  window.generateFamilyThemes = generateFamilyThemes;
  window.defaultBaseColors = defaultBaseColors;
}
