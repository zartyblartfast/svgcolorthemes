/**
 * algorithmic.js - Algorithmic theme generation
 * Generates color themes using various color theory algorithms
 */

/**
 * Generate harmony-based themes (complementary, analogous, etc.)
 * @param {string} baseColor - Base color in hex format
 * @param {string} harmonyType - Type of harmony (complementary, analogous, triadic, etc.)
 * @param {Object} structure - SVG structure
 * @returns {Object} - Map of element IDs to colors
 */
function generateHarmonyTheme(baseColor, harmonyType, structure) {
  const paths = getAllPaths(structure);
  if (paths.length === 0) return { error: "No paths found in SVG structure." };
  
  // Generate palette based on harmony type
  let palette;
  const [h, s, l] = hexToHsl(baseColor);
  
  switch (harmonyType) {
    case 'complementary':
      palette = [baseColor, hslToHex([(h + 180) % 360, s, l])];
      break;
    case 'analogous':
      palette = [
        baseColor,
        hslToHex([(h + 30) % 360, s, l]),
        hslToHex([(h + 330) % 360, s, l])
      ];
      break;
    case 'triadic':
      palette = [
        baseColor,
        hslToHex([(h + 120) % 360, s, l]),
        hslToHex([(h + 240) % 360, s, l])
      ];
      break;
    case 'tetradic':
      palette = [
        baseColor,
        hslToHex([(h + 90) % 360, s, l]),
        hslToHex([(h + 180) % 360, s, l]),
        hslToHex([(h + 270) % 360, s, l])
      ];
      break;
    case 'split-complementary':
      palette = [
        baseColor,
        hslToHex([(h + 150) % 360, s, l]),
        hslToHex([(h + 210) % 360, s, l])
      ];
      break;
    default:
      palette = [baseColor];
  }
  
  // Map palette to paths
  const assignments = {};
  paths.forEach((path, index) => {
    assignments[path.id] = palette[index % palette.length];
  });
  
  return assignments;
}

/**
 * Generate gradient-based theme
 * @param {string} startColor - Start color in hex format
 * @param {string} endColor - End color in hex format
 * @param {number} steps - Number of steps in gradient
 * @param {Object} structure - SVG structure
 * @returns {Object} - Map of element IDs to colors
 */
function generateGradientTheme(startColor, endColor, steps, structure) {
  const paths = getAllPaths(structure);
  if (paths.length === 0) return { error: "No paths found in SVG structure." };
  
  // Generate gradient palette
  const startRgb = hexToRgb(startColor);
  const endRgb = hexToRgb(endColor);
  
  const palette = [];
  for (let i = 0; i < steps; i++) {
    const t = steps === 1 ? 0 : i / (steps - 1);
    const r = Math.round(startRgb[0] + (endRgb[0] - startRgb[0]) * t);
    const g = Math.round(startRgb[1] + (endRgb[1] - startRgb[1]) * t);
    const b = Math.round(startRgb[2] + (endRgb[2] - startRgb[2]) * t);
    palette.push(rgbToHex([r, g, b]));
  }
  
  // Map palette to paths
  const assignments = {};
  paths.forEach((path, index) => {
    assignments[path.id] = palette[index % palette.length];
  });
  
  return assignments;
}

/**
 * Predefined artistic palettes
 */
const ARTISTIC_PALETTES = {
  autumn: ["#d2691e", "#ff7f50", "#ffb347", "#b8860b", "#e97451", "#a0522d"],
  pastel: ["#ffd1dc", "#b5ead7", "#c7ceea", "#ffdac1", "#e2f0cb", "#b5ead7"],
  neon: ["#39ff14", "#ff073a", "#fe019a", "#f5f500", "#08f7fe", "#f000ff"],
  solarized: ["#b58900", "#cb4b16", "#dc322f", "#268bd2", "#2aa198", "#859900"],
  material: ["#e57373", "#f06292", "#ba68c8", "#64b5f6", "#4db6ac", "#dce775"],
  flatui: ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#e67e22", "#e74c3c"],
  rainbow: ["#ff0000", "#ff9900", "#ffee00", "#33ff00", "#00cfff", "#3300ff", "#b300ff"]
};

/**
 * Generate theme based on artistic palette
 * @param {string} paletteName - Name of predefined palette
 * @param {Object} structure - SVG structure
 * @returns {Object} - Map of element IDs to colors
 */
function generateArtisticTheme(paletteName, structure) {
  const paths = getAllPaths(structure);
  if (paths.length === 0) return { error: "No paths found in SVG structure." };
  
  // Get palette
  const palette = ARTISTIC_PALETTES[paletteName] || ARTISTIC_PALETTES.material;
  
  // Map palette to paths
  const assignments = {};
  paths.forEach((path, index) => {
    assignments[path.id] = palette[index % palette.length];
  });
  
  return assignments;
}

/**
 * Generate algorithmic themes based on selected mode
 * @param {Object} structure - SVG structure
 * @param {Object} options - Theme generation options
 * @returns {Object} - Map of theme names to color assignments
 */
function generateAlgorithmicThemes(structure, options) {
  const { mode, harmonyType, baseColor, startColor, endColor, steps, artisticPalette } = options;
  
  let themes = {};
  
  switch (mode) {
    case 'harmonies':
      themes[`${harmonyType}_harmony`] = generateHarmonyTheme(baseColor, harmonyType, structure);
      break;
    case 'gradient':
      themes[`gradient_${startColor}_${endColor}`] = generateGradientTheme(startColor, endColor, steps, structure);
      break;
    case 'artistic':
      themes[artisticPalette] = generateArtisticTheme(artisticPalette, structure);
      break;
    default:
      themes.error = "Invalid algorithmic mode";
  }
  
  return themes;
}

// Export functions for use in other modules
if (typeof window !== 'undefined') {
  window.generateAlgorithmicThemes = generateAlgorithmicThemes;
  window.generateHarmonyTheme = generateHarmonyTheme;
  window.generateGradientTheme = generateGradientTheme;
  window.generateArtisticTheme = generateArtisticTheme;
  window.ARTISTIC_PALETTES = ARTISTIC_PALETTES;
}
