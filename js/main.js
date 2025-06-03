// main.js - App initialization and glue code

/**
 * main.js - Main application initialization and event binding
 */

// Global state variables
window.svgStructure = null;
window.originalSVGText = null;
window.baseColors = window.defaultBaseColors || [
  { name: 'red_family', color: '#f25c54', hue: 0, saturation: 0, lightness: 0 },
  { name: 'teal_family', color: '#2a9d8f', hue: 0, saturation: 0, lightness: 0 },
  { name: 'yellow_family', color: '#f6bd60', hue: 0, saturation: 0, lightness: 0 },
  { name: 'purple_family', color: '#6a0572', hue: 0, saturation: 0, lightness: 0 },
  { name: 'orange_family', color: '#f7b32b', hue: 0, saturation: 0, lightness: 0 },
  { name: 'blue_family', color: '#488bfc', hue: 0, saturation: 0, lightness: 0 }
];
window.currentThemes = {};

/**
 * Initialize the application
 */
function initApp() {
  // Initialize tabs
  initTabs();
  
  // Initialize algorithmic mode controls
  initAlgorithmicModes();
  
  // Initialize base colors form
  renderBaseColorsForm();
  
  // Set up file upload handler
  document.getElementById('svgFileInput').addEventListener('change', handleFileUpload);
  
  // Set up generate theme buttons
  document.getElementById('generateFamilyThemes').addEventListener('click', generateFamilyThemesHandler);
  document.getElementById('generateAlgorithmicTheme').addEventListener('click', generateAlgorithmicThemeHandler);
  
  // Set up export buttons
  document.getElementById('exportSVGZip').addEventListener('click', exportSVGZipHandler);
  document.getElementById('exportPNGZip').addEventListener('click', exportPNGZipHandler);
  document.getElementById('exportJSON').addEventListener('click', exportJSONHandler);
  
  // Set up JSON toggle buttons
  document.getElementById('toggleSvgStructure').addEventListener('click', function() {
    const container = document.getElementById('svgStructureContainer');
    container.classList.toggle('visible');
    this.textContent = container.classList.contains('visible') ? 'Hide JSON' : 'Show JSON';
  });
  
  document.getElementById('toggleThemeOutput').addEventListener('click', function() {
    const container = document.getElementById('themeOutputContainer');
    container.classList.toggle('visible');
    this.textContent = container.classList.contains('visible') ? 'Hide JSON' : 'Show JSON';
  });
  
  // Set up algorithmic preview updates
  document.getElementById('harmonyType').addEventListener('change', updateAlgorithmicPreview);
  document.getElementById('harmonyBaseColor').addEventListener('input', updateAlgorithmicPreview);
  document.getElementById('gradientStartColor').addEventListener('input', updateAlgorithmicPreview);
  document.getElementById('gradientEndColor').addEventListener('input', updateAlgorithmicPreview);
  document.getElementById('gradientSteps').addEventListener('input', updateAlgorithmicPreview);
  document.getElementById('artisticPalette').addEventListener('change', updateAlgorithmicPreview);
  
  // Initialize algorithmic preview
  updateAlgorithmicPreview();
}

/**
 * Handle SVG file upload
 * @param {Event} event - File input change event
 */
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const svgText = e.target.result;
    window.originalSVGText = svgText;
    
    // Parse SVG
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;
    
    // Extract structure
    window.svgStructure = parseSVG(svgElement);
    
    // Display structure
    document.getElementById('svgStructure').textContent = JSON.stringify(window.svgStructure, null, 2);
    
    // Count paths
    const paths = getAllPaths(window.svgStructure);
    document.getElementById('pathCount').textContent = `Found ${paths.length} paths in SVG`;
    
    // Enable theme generation buttons
    document.getElementById('generateFamilyThemes').disabled = false;
    document.getElementById('generateAlgorithmicTheme').disabled = false;
    
    // Show preview
    const previewContainer = document.getElementById('svgPreview');
    previewContainer.innerHTML = '';
    
    // Create image element
    const img = document.createElement('img');
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgText)));
    
    // Get SVG dimensions from the parsed SVG element
    let svgWidth = svgElement.getAttribute('width');
    let svgHeight = svgElement.getAttribute('height');
    let viewBox = svgElement.getAttribute('viewBox');
    
    // Create a wrapper div to properly size the preview
    const previewWrapper = document.createElement('div');
    previewWrapper.style.display = 'flex';
    previewWrapper.style.justifyContent = 'center';
    previewWrapper.style.alignItems = 'center';
    previewWrapper.style.padding = '10px';
    previewWrapper.style.backgroundColor = '#f9f9f9';
    previewWrapper.style.border = '1px dashed #ccc';
    previewWrapper.style.borderRadius = '4px';
    
    // Set appropriate dimensions based on SVG properties
    if (svgWidth && svgHeight) {
      // If SVG has explicit width/height
      const widthValue = parseInt(svgWidth);
      const heightValue = parseInt(svgHeight);
      
      // Set image size based on SVG dimensions, but cap at reasonable values
      img.style.width = Math.min(widthValue, 500) + 'px';
      img.style.height = Math.min(heightValue, 300) + 'px';
      
      // Set wrapper size to match image with some padding
      previewWrapper.style.width = (Math.min(widthValue, 500) + 20) + 'px';
      previewWrapper.style.height = (Math.min(heightValue, 300) + 20) + 'px';
    } else if (viewBox) {
      // If SVG has viewBox but no explicit dimensions
      const viewBoxValues = viewBox.split(' ');
      if (viewBoxValues.length === 4) {
        const viewBoxWidth = parseFloat(viewBoxValues[2]);
        const viewBoxHeight = parseFloat(viewBoxValues[3]);
        const aspectRatio = viewBoxWidth / viewBoxHeight;
        
        // Set a reasonable size based on aspect ratio
        let width, height;
        if (aspectRatio > 1) {
          // Landscape
          width = Math.min(viewBoxWidth, 500);
          height = width / aspectRatio;
        } else {
          // Portrait
          height = Math.min(viewBoxHeight, 300);
          width = height * aspectRatio;
        }
        
        img.style.width = width + 'px';
        img.style.height = height + 'px';
        previewWrapper.style.width = (width + 20) + 'px';
        previewWrapper.style.height = (height + 20) + 'px';
      }
    } else {
      // Fallback if no dimensions available
      img.style.maxWidth = '300px';
      img.style.maxHeight = '200px';
      previewWrapper.style.width = '320px';
      previewWrapper.style.height = '220px';
    }
    
    // Add image to wrapper and wrapper to container
    previewWrapper.appendChild(img);
    previewContainer.appendChild(previewWrapper);
    
    // Store SVG dimensions for later use in export functions
    window.svgDimensions = {
      width: svgWidth ? parseInt(svgWidth) : 800,
      height: svgHeight ? parseInt(svgHeight) : 600
    };
  };
  
  reader.readAsText(file);
}

/**
 * Handle family themes generation button click
 */
function generateFamilyThemesHandler() {
  if (!window.svgStructure) {
    alert('Please upload an SVG file first.');
    return;
  }
  
  // Update base colors from form
  updateBaseColorsFromForm();
  
  // Generate themes
  window.currentThemes = generateFamilyThemes(window.svgStructure, window.baseColors);
  
  // Display themes as JSON
  document.getElementById('themeOutput').textContent = JSON.stringify(window.currentThemes, null, 2);
  
  // Render swatches
  renderThemeSwatches(window.currentThemes);
  
  // Render themed SVGs
  renderThemedSVGs(window.originalSVGText, window.currentThemes);
  
  // Enable export buttons
  document.querySelectorAll('.export-button').forEach(btn => btn.disabled = false);
}

/**
 * Handle algorithmic theme generation button click
 */
function generateAlgorithmicThemeHandler() {
  if (!window.svgStructure) {
    alert('Please upload an SVG file first.');
    return;
  }
  
  const mode = document.getElementById('algMode').value;
  let options = { mode };
  
  switch (mode) {
    case 'harmonies':
      options.harmonyType = document.getElementById('harmonyType').value;
      options.baseColor = document.getElementById('harmonyBaseColor').value;
      break;
    case 'gradient':
      options.startColor = document.getElementById('gradientStartColor').value;
      options.endColor = document.getElementById('gradientEndColor').value;
      options.steps = parseInt(document.getElementById('gradientSteps').value) || 5;
      break;
    case 'artistic':
      options.artisticPalette = document.getElementById('artisticPalette').value;
      break;
  }
  
  // Generate themes
  const algorithmicThemes = generateAlgorithmicThemes(window.svgStructure, options);
  
  // Merge with current themes
  window.currentThemes = { ...window.currentThemes, ...algorithmicThemes };
  
  // Display themes as JSON
  document.getElementById('themeOutput').textContent = JSON.stringify(window.currentThemes, null, 2);
  
  // Render swatches
  renderThemeSwatches(window.currentThemes);
  
  // Render themed SVGs
  renderThemedSVGs(window.originalSVGText, window.currentThemes);
  
  // Enable export buttons
  document.querySelectorAll('.export-button').forEach(btn => btn.disabled = false);
}

/**
 * Handle export SVG ZIP button click
 */
function exportSVGZipHandler() {
  if (!window.currentThemes || !window.originalSVGText) {
    alert('Please generate themes first.');
    return;
  }
  
  // Get selected themes
  const selectedThemes = {};
  document.querySelectorAll('.themedSVGCheckbox:checked').forEach(checkbox => {
    const themeName = checkbox.value;
    if (window.currentThemes[themeName]) {
      const themedSVG = applyThemeToSVG(window.originalSVGText, window.currentThemes[themeName]);
      selectedThemes[themeName] = themedSVG;
    }
  });
  
  // Export as ZIP
  exportThemedSVGsAsZip(selectedThemes);
}

/**
 * Handle export PNG ZIP button click
 */
function exportPNGZipHandler() {
  if (!window.currentThemes || !window.originalSVGText) {
    alert('Please generate themes first.');
    return;
  }
  
  // Get selected themes
  const selectedThemes = {};
  document.querySelectorAll('.themedSVGCheckbox:checked').forEach(checkbox => {
    const themeName = checkbox.value;
    if (window.currentThemes[themeName]) {
      const themedSVG = applyThemeToSVG(window.originalSVGText, window.currentThemes[themeName]);
      selectedThemes[themeName] = themedSVG;
    }
  });
  
  // Get dimensions
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(window.originalSVGText, 'image/svg+xml');
  const svgElement = svgDoc.documentElement;
  const width = parseInt(svgElement.getAttribute('width')) || 800;
  const height = parseInt(svgElement.getAttribute('height')) || 600;
  
  // Export as PNG ZIP
  exportThemedSVGsAsPNG(selectedThemes, width, height);
}

/**
 * Handle export JSON button click
 */
function exportJSONHandler() {
  if (!window.currentThemes) {
    alert('Please generate themes first.');
    return;
  }
  
  // Export as JSON
  exportThemesAsJSON(window.currentThemes);
}

// Initialize the app when DOM is loaded
window.addEventListener('DOMContentLoaded', initApp);
