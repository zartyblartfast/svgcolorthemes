/**
 * svg-utils.js - Utilities for SVG parsing and manipulation
 */

/**
 * Recursively extract SVG structure (groups and shapes)
 * @param {Element} element - SVG element to parse
 * @param {string|null} parentId - ID of parent element
 * @returns {Object} - Structured representation of SVG
 */
function parseSVG(element, parentId = null) {
  const tag = (element.tagName || '').toLowerCase().replace(/^.*:/, '');
  
  if (tag === 'svg') {
    // Root SVG: wrap all children in a container
    const svgData = {
      id: element.getAttribute('id') || '',
      type: 'svg',
      parent: null,
      children: []
    };
    for (const child of element.children) {
      const childStruct = parseSVG(child, null);
      if (childStruct) svgData.children.push(childStruct);
    }
    return svgData;
  }
  
  if (tag === 'g') {
    // Group
    const groupId = element.getAttribute('id') || '';
    const groupData = {
      id: groupId,
      type: 'group',
      parent: parentId,
      children: []
    };
    for (const child of element.children) {
      const childStruct = parseSVG(child, groupId);
      if (childStruct) groupData.children.push(childStruct);
    }
    return groupData;
  } else if ([
    'path', 'rect', 'circle', 'ellipse', 'polygon', 'line'
  ].includes(tag)) {
    return {
      id: element.getAttribute('id') || '',
      type: tag,
      fill: extractFill(element),
      parent: parentId
    };
  }
  
  // Skip other elements
  return null;
}

/**
 * Extract fill color from SVG element
 * @param {Element} elem - SVG element
 * @returns {string} - Fill color
 */
function extractFill(elem) {
  // Try style attribute first
  const style = elem.getAttribute('style') || '';
  const match = style.match(/fill:([^;]+)/);
  if (match) return match[1].trim();
  // Fallback to direct fill attribute
  return elem.getAttribute('fill') || '';
}

/**
 * Get all paths from SVG structure
 * @param {Object} structure - SVG structure
 * @returns {Array} - Array of path objects
 */
function getAllPaths(structure) {
  const paths = [];
  
  function collectPaths(node) {
    if (node.type && ["path", "rect", "circle", "ellipse", "polygon", "line"].includes(node.type)) {
      paths.push(node);
    }
    if (node.children) {
      node.children.forEach(collectPaths);
    }
  }
  
  collectPaths(structure);
  return paths;
}

/**
 * Apply theme to SVG
 * @param {string} svgText - Original SVG text
 * @param {Object} assignments - Color assignments
 * @returns {string} - Themed SVG text
 */
function applyThemeToSVG(svgText, assignments) {
  // Replace fill colors by id
  let parser = new DOMParser();
  let xmlDoc = parser.parseFromString(svgText, 'image/svg+xml');
  
  Object.entries(assignments).forEach(([id, hex]) => {
    if (!id) return;
    let elem = xmlDoc.getElementById(id);
    if (elem) {
      elem.setAttribute('fill', hex);
      // Remove style fill if present
      let style = elem.getAttribute('style');
      if (style) {
        let newStyle = style.replace(/fill:[^;]+;?/g, '');
        elem.setAttribute('style', newStyle);
      }
    }
  });
  
  let serializer = new XMLSerializer();
  return serializer.serializeToString(xmlDoc.documentElement);
}

/**
 * Count paths in SVG structure
 * @param {Object} structure - SVG structure
 * @returns {number} - Number of paths
 */
function getSVGPathCount(structure) {
  let count = 0;
  function collectPaths(node) {
    if (node.type && ["path", "rect", "circle", "ellipse", "polygon", "line"].includes(node.type)) {
      count++;
    }
    if (node.children) node.children.forEach(collectPaths);
  }
  collectPaths(structure);
  return count;
}

// Export functions to window object
if (typeof window !== 'undefined') {
  window.parseSVG = parseSVG;
  window.extractFill = extractFill;
  window.getAllPaths = getAllPaths;
  window.applyThemeToSVG = applyThemeToSVG;
  window.getSVGPathCount = getSVGPathCount;
}
