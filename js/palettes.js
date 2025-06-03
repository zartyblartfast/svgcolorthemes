// palettes.js - Palette generation logic

// --- Harmonies Palette Generation ---
function generateHarmonyPalette(baseHex, type) {
  function hexToHsl(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    const num = parseInt(hex, 16);
    let r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
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
  function hslToHex([h, s, l]) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
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
    return '#' + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
  }
  const [h, s, l] = hexToHsl(baseHex);
  let palette;
  if (type === 'complementary') {
    palette = [h, (h + 180) % 360].map(H => hslToHex([H, s, l]));
  } else if (type === 'analogous') {
    palette = [h, (h + 30) % 360, (h + 330) % 360].map(H => hslToHex([H, s, l]));
  } else if (type === 'triadic') {
    palette = [h, (h + 120) % 360, (h + 240) % 360].map(H => hslToHex([H, s, l]));
  } else if (type === 'tetradic') {
    palette = [h, (h + 90) % 360, (h + 180) % 360, (h + 270) % 360].map(H => hslToHex([H, s, l]));
  } else if (type === 'split-complementary') {
    palette = [h, (h + 150) % 360, (h + 210) % 360].map(H => hslToHex([H, s, l]));
  } else {
    palette = [hslToHex([h, s, l])];
  }
  return palette;
}

// --- Gradient Palette Generation ---
function generateGradientPalette(startHex, endHex, steps) {
  function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    const num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }
  function lerpColor(a, b, t) {
    return a.map((v, i) => Math.round(v + (b[i] - v) * t));
  }
  function rgbToHex([r, g, b]) {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  }
  const rgbA = hexToRgb(startHex);
  const rgbB = hexToRgb(endHex);
  let palette = [];
  for (let i = 0; i < steps; ++i) {
    const t = steps === 1 ? 0 : i / (steps - 1);
    palette.push(rgbToHex(lerpColor(rgbA, rgbB, t)));
  }
  return palette;
}

// --- Artistic Palettes ---
const ARTISTIC_PALETTES = {
  autumn: ["#d2691e", "#ff7f50", "#ffb347", "#b8860b", "#e97451", "#a0522d"],
  pastel: ["#ffd1dc", "#b5ead7", "#c7ceea", "#ffdac1", "#e2f0cb", "#b5ead7"],
  neon: ["#39ff14", "#ff073a", "#fe019a", "#f5f500", "#08f7fe", "#f000ff"],
  solarized: ["#b58900", "#cb4b16", "#dc322f", "#268bd2", "#2aa198", "#859900"],
  material: ["#e57373", "#f06292", "#ba68c8", "#64b5f6", "#4db6ac", "#dce775"],
  flatui: ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#e67e22", "#e74c3c"],
  rainbow: ["#ff0000", "#ff9900", "#ffee00", "#33ff00", "#00cfff", "#3300ff", "#b300ff"]
};
function getArtisticPalette(name) {
  return ARTISTIC_PALETTES[name] ? ARTISTIC_PALETTES[name].slice() : [];
}

// Export for module usage
if (typeof window !== 'undefined') {
  window.generateHarmonyPalette = generateHarmonyPalette;
  window.generateGradientPalette = generateGradientPalette;
  window.getArtisticPalette = getArtisticPalette;
}
