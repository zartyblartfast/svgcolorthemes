/**
 * export.js - SVG and PNG export functionality
 */

/**
 * Export themed SVGs as a ZIP file
 * @param {Object} themedSVGs - Map of theme names to SVG content
 */
function exportThemedSVGsAsZip(themedSVGs) {
  const zip = new JSZip();
  
  // Add each themed SVG to the zip
  Object.entries(themedSVGs).forEach(([themeName, svgContent]) => {
    const filename = `${themeName.toLowerCase().replace(/\s+/g, '_')}.svg`;
    zip.file(filename, svgContent);
  });
  
  // Generate and download the zip
  zip.generateAsync({ type: 'blob' })
    .then(function(blob) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'themed_svgs.zip';
      link.click();
    });
}

/**
 * Export themed SVGs as PNG files
 * @param {Object} themedSVGs - Map of theme names to SVG content
 * @param {number} width - Width of PNG output
 * @param {number} height - Height of PNG output
 */
function exportThemedSVGsAsPNG(themedSVGs, width, height) {
  // Create a zip to hold all PNGs
  const zip = new JSZip();
  let processedCount = 0;
  const totalCount = Object.keys(themedSVGs).length;
  
  // Show processing indicator
  const statusDiv = document.createElement('div');
  statusDiv.textContent = 'Processing SVGs to PNG...';
  statusDiv.style.position = 'fixed';
  statusDiv.style.top = '10px';
  statusDiv.style.right = '10px';
  statusDiv.style.padding = '10px';
  statusDiv.style.background = '#f0f0f0';
  statusDiv.style.border = '1px solid #ccc';
  statusDiv.style.borderRadius = '4px';
  statusDiv.style.zIndex = '9999';
  document.body.appendChild(statusDiv);
  
  // Process each SVG to PNG using standard browser APIs
  Object.entries(themedSVGs).forEach(([themeName, svgContent]) => {
    // Create a data URL from the SVG content
    const svgBlob = new Blob([svgContent], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(svgBlob);
    
    // Create an image element to load the SVG
    const img = new Image();
    img.onload = function() {
      // Create a canvas to draw the image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert canvas to PNG blob
      canvas.toBlob(function(blob) {
        // Add the PNG to the zip file
        const filename = `${themeName.toLowerCase().replace(/\s+/g, '_')}.png`;
        zip.file(filename, blob);
        
        // Clean up
        URL.revokeObjectURL(url);
        processedCount++;
        statusDiv.textContent = `Processing: ${processedCount}/${totalCount}`;
        
        // When all SVGs are processed, generate and download the zip
        if (processedCount === totalCount) {
          statusDiv.textContent = 'Creating ZIP file...';
          zip.generateAsync({ type: 'blob' })
            .then(function(zipBlob) {
              const link = document.createElement('a');
              link.href = URL.createObjectURL(zipBlob);
              link.download = 'themed_pngs.zip';
              document.body.appendChild(link); // Needed for Firefox
              link.click();
              document.body.removeChild(link); // Clean up
              document.body.removeChild(statusDiv); // Remove status indicator
            })
            .catch(function(error) {
              console.error('Error generating ZIP:', error);
              statusDiv.textContent = 'Error creating ZIP file';
              setTimeout(() => document.body.removeChild(statusDiv), 3000);
            });
        }
      }, 'image/png');
    };
    
    // Handle errors
    img.onerror = function() {
      console.error('Error loading SVG for theme:', themeName);
      URL.revokeObjectURL(url);
      processedCount++;
      statusDiv.textContent = `Error with ${themeName}, processing: ${processedCount}/${totalCount}`;
      
      if (processedCount === totalCount) {
        statusDiv.textContent = 'Creating ZIP file...';
        zip.generateAsync({ type: 'blob' })
          .then(function(zipBlob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = 'themed_pngs.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            document.body.removeChild(statusDiv);
          });
      }
    };
    
    // Set the source to start loading
    img.src = url;
  });
}

/**
 * Export JSON theme data
 * @param {Object} themes - Themes data to export
 */
function exportThemesAsJSON(themes) {
  const jsonString = JSON.stringify(themes, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'svg_themes.json';
  link.click();
}

/**
 * Export a single SVG as PNG
 * @param {string} svgContent - SVG content to export
 * @param {string} filename - Filename for the PNG
 * @param {number} width - Width of PNG output
 * @param {number} height - Height of PNG output
 */
function exportSingleSVGAsPNG(svgContent, filename, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Use canvg to render SVG to canvas
  const v = canvg.Canvg.fromString(ctx, svgContent, {
    ignoreMouse: true,
    ignoreAnimation: true,
    ignoreDimensions: true,
    ignoreClear: true
  });
  
  v.render().then(() => {
    // Convert canvas to PNG and download
    canvas.toBlob(function(blob) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename || 'themed_svg.png';
      link.click();
    }, 'image/png');
  });
}

// Export functions for use in other modules
if (typeof window !== 'undefined') {
  window.exportThemedSVGsAsZip = exportThemedSVGsAsZip;
  window.exportThemedSVGsAsPNG = exportThemedSVGsAsPNG;
  window.exportThemesAsJSON = exportThemesAsJSON;
  window.exportSingleSVGAsPNG = exportSingleSVGAsPNG;
}
