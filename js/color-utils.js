/**
 * color-utils.js - Color conversion and manipulation utilities
 */

/**
 * Convert hex color to RGB array
 * @param {string} hex - Hex color code
 * @returns {Array} - RGB array [r, g, b]
 */
function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(x => x + x).join('');
  }
  const num = parseInt(hex, 16);
  return [
    (num >> 16) & 255,
    (num >> 8) & 255,
    num & 255
  ];
}

/**
 * Convert RGB array to hex color
 * @param {Array} rgb - RGB array [r, g, b]
 * @returns {string} - Hex color code
 */
function rgbToHex([r, g, b]) {
  return (
    '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
  );
}

/**
 * Convert RGB array to HSL array
 * @param {Array} rgb - RGB array [r, g, b]
 * @returns {Array} - HSL array [h, s, l]
 */
function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return [h * 360, s * 100, l * 100];
}

/**
 * Convert HSL array to RGB array
 * @param {Array} hsl - HSL array [h, s, l]
 * @returns {Array} - RGB array [r, g, b]
 */
function hslToRgb([h, s, l]) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Calculate average of array values
 * @param {Array} arr - Array of numbers
 * @returns {number} - Average value
 */
function average(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

/**
 * Get contrast color (black or white) for a given hex color
 * @param {string} hexcolor - Hex color code
 * @returns {string} - Contrast color (#222 or #fff)
 */
function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace('#', '');
  if (hexcolor.length === 3) {
    hexcolor = hexcolor.split('').map(x => x + x).join('');
  }
  const r = parseInt(hexcolor.substr(0,2),16);
  const g = parseInt(hexcolor.substr(2,2),16);
  const b = parseInt(hexcolor.substr(4,2),16);
  const yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 128) ? '#222' : '#fff';
}
