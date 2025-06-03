// mapping.js - Palette to SVG path mapping logic

function mapPaletteToPaths(palette, mappingMode, pathCount) {
  let mapped = [];
  if (!palette || palette.length === 0 || !pathCount) return mapped;
  if (mappingMode === 'one2one') {
    if (palette.length < pathCount) {
      // Extend palette by cycling
      for (let i = 0; i < pathCount; ++i) {
        mapped.push(palette[i % palette.length]);
      }
    } else {
      mapped = palette.slice(0, pathCount);
    }
  } else {
    // cycle mode
    for (let i = 0; i < pathCount; ++i) {
      mapped.push(palette[i % palette.length]);
    }
  }
  return mapped;
}

if (typeof window !== 'undefined') {
  window.mapPaletteToPaths = mapPaletteToPaths;
}
