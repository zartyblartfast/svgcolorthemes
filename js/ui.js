/**
 * ui.js - UI rendering and event handling
 */

/**
 * Render base colors form with inputs for name, color, and HSL adjustments
 */
/**
 * Render base colors form with inputs for name, color, and HSL adjustments
 */
function renderBaseColorsForm() {
  const form = document.getElementById('baseColorsForm');
  form.innerHTML = '';
  
  window.baseColors.forEach((bc, idx) => {
    const colorDiv = document.createElement('div');
    colorDiv.style.marginBottom = '20px';
    
    // Row 1: Name and Color on same row
    const row1 = document.createElement('div');
    row1.style.display = 'flex';
    row1.style.marginBottom = '5px';
    
    // Name label and input
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Name: ';
    nameLabel.style.marginRight = '5px';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = bc.name;
    nameInput.id = `bc_name_${idx}`;
    nameInput.style.width = '120px';
    nameLabel.appendChild(nameInput);
    
    // Color label and input
    const colorLabel = document.createElement('label');
    colorLabel.textContent = 'Color: ';
    colorLabel.style.marginLeft = '20px';
    colorLabel.style.marginRight = '5px';
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = bc.color;
    colorInput.id = `bc_color_${idx}`;
    colorLabel.appendChild(colorInput);
    
    row1.appendChild(nameLabel);
    row1.appendChild(colorLabel);
    colorDiv.appendChild(row1);
    
    // Create a container for HSL adjustments with consistent alignment
    const hslContainer = document.createElement('div');
    hslContainer.style.marginLeft = '10px';
    
    // Row 2: Hue adjustment
    const hueRow = document.createElement('div');
    hueRow.style.display = 'flex';
    hueRow.style.marginBottom = '5px';
    hueRow.style.alignItems = 'center';
    
    const hueLabel = document.createElement('label');
    hueLabel.textContent = 'Hue Δ:';
    hueLabel.style.width = '60px';
    hueLabel.style.textAlign = 'right';
    hueLabel.style.paddingRight = '5px';
    
    const hueInput = document.createElement('input');
    hueInput.type = 'number';
    hueInput.value = bc.hue;
    hueInput.id = `bc_hue_${idx}`;
    hueInput.style.width = '60px';
    
    hueRow.appendChild(hueLabel);
    hueRow.appendChild(hueInput);
    hslContainer.appendChild(hueRow);
    
    // Row 3: Saturation adjustment
    const satRow = document.createElement('div');
    satRow.style.display = 'flex';
    satRow.style.marginBottom = '5px';
    satRow.style.alignItems = 'center';
    
    const satLabel = document.createElement('label');
    satLabel.textContent = 'Sat Δ:';
    satLabel.style.width = '60px';
    satLabel.style.textAlign = 'right';
    satLabel.style.paddingRight = '5px';
    
    const satInput = document.createElement('input');
    satInput.type = 'number';
    satInput.value = bc.saturation;
    satInput.id = `bc_sat_${idx}`;
    satInput.style.width = '60px';
    
    satRow.appendChild(satLabel);
    satRow.appendChild(satInput);
    hslContainer.appendChild(satRow);
    
    // Row 4: Lightness adjustment
    const lightRow = document.createElement('div');
    lightRow.style.display = 'flex';
    lightRow.style.alignItems = 'center';
    
    const lightLabel = document.createElement('label');
    lightLabel.textContent = 'Light Δ:';
    lightLabel.style.width = '60px';
    lightLabel.style.textAlign = 'right';
    lightLabel.style.paddingRight = '5px';
    
    const lightInput = document.createElement('input');
    lightInput.type = 'number';
    lightInput.value = bc.lightness;
    lightInput.id = `bc_light_${idx}`;
    lightInput.style.width = '60px';
    
    lightRow.appendChild(lightLabel);
    lightRow.appendChild(lightInput);
    hslContainer.appendChild(lightRow);
    
    colorDiv.appendChild(hslContainer);
    form.appendChild(colorDiv);
  });
}

/**
 * Update base colors from form inputs
 */
function updateBaseColorsFromForm() {
  window.baseColors.forEach((bc, idx) => {
    bc.name = document.getElementById(`bc_name_${idx}`).value;
    bc.color = document.getElementById(`bc_color_${idx}`).value;
    bc.hue = parseFloat(document.getElementById(`bc_hue_${idx}`).value) || 0;
    bc.saturation = parseFloat(document.getElementById(`bc_sat_${idx}`).value) || 0;
    bc.lightness = parseFloat(document.getElementById(`bc_light_${idx}`).value) || 0;
  });
}

/**
 * Render color swatches for themes
 * @param {Object} themes - Map of theme names to color assignments
 */
/**
 * Render theme swatches in a grid layout
 * @param {Object} themes - Theme data to render
 */
function renderThemeSwatches(themes) {
  const container = document.getElementById('swatchThemes');
  container.innerHTML = '';
  
  // Define the number of swatches per row
  const SWATCHES_PER_ROW = 6;
  
  Object.entries(themes).forEach(([themeName, assignments]) => {
    const themeDiv = document.createElement('div');
    themeDiv.style.marginBottom = '2em';
    
    // Create theme name header
    const nameDiv = document.createElement('div');
    nameDiv.textContent = themeName;
    nameDiv.style.fontWeight = 'bold';
    nameDiv.style.marginBottom = '0.8em';
    nameDiv.style.fontSize = '1.1em';
    themeDiv.appendChild(nameDiv);
    
    // Create swatch grid container
    const swatchGrid = document.createElement('div');
    swatchGrid.style.display = 'flex';
    swatchGrid.style.flexWrap = 'wrap';
    swatchGrid.style.gap = '0';
    swatchGrid.className = 'swatch-grid';
    
    // Convert assignments to array for easier handling
    const swatchItems = Object.entries(assignments);
    
    // Create swatches
    swatchItems.forEach(([id, hex], index) => {
      const swatch = document.createElement('div');
      swatch.style.background = hex;
      swatch.style.width = '60px';
      swatch.style.height = '36px';
      swatch.style.display = 'flex';
      swatch.style.alignItems = 'center';
      swatch.style.justifyContent = 'center';
      swatch.style.fontSize = '0.85em';
      swatch.style.fontWeight = 'bold';
      swatch.style.color = getContrastYIQ(hex);
      swatch.style.boxShadow = '0 1px 3px #0002';
      swatch.style.position = 'relative';
      swatch.style.cursor = 'pointer';
      swatch.title = id;
      swatch.textContent = hex.toUpperCase();
      
      // Apply border radius only to edge swatches for a connected look
      if (index % SWATCHES_PER_ROW === 0) {
        // Left edge of row
        swatch.style.borderTopLeftRadius = '6px';
        swatch.style.borderBottomLeftRadius = '6px';
      }
      if ((index + 1) % SWATCHES_PER_ROW === 0 || index === swatchItems.length - 1) {
        // Right edge of row
        swatch.style.borderTopRightRadius = '6px';
        swatch.style.borderBottomRightRadius = '6px';
      }
      
      // Add a small margin between rows
      if (index >= SWATCHES_PER_ROW) {
        swatch.style.marginTop = '2px';
      }
      
      swatchGrid.appendChild(swatch);
    });
    
    themeDiv.appendChild(swatchGrid);
    container.appendChild(themeDiv);
  });
}

/**
 * Render preview of harmony swatches
 * @param {string} baseColor - Base color in hex
 * @param {string} harmonyType - Type of harmony
 */
function renderHarmonyPreview(baseColor, harmonyType) {
  const container = document.getElementById('harmonySwatchPreview');
  container.innerHTML = '';
  
  const [h, s, l] = hexToHsl(baseColor);
  let colors = [];
  
  switch (harmonyType) {
    case 'complementary':
      colors = [baseColor, hslToHex([(h + 180) % 360, s, l])];
      break;
    case 'analogous':
      colors = [
        baseColor,
        hslToHex([(h + 30) % 360, s, l]),
        hslToHex([(h + 330) % 360, s, l])
      ];
      break;
    case 'triadic':
      colors = [
        baseColor,
        hslToHex([(h + 120) % 360, s, l]),
        hslToHex([(h + 240) % 360, s, l])
      ];
      break;
    case 'tetradic':
      colors = [
        baseColor,
        hslToHex([(h + 90) % 360, s, l]),
        hslToHex([(h + 180) % 360, s, l]),
        hslToHex([(h + 270) % 360, s, l])
      ];
      break;
    case 'split-complementary':
      colors = [
        baseColor,
        hslToHex([(h + 150) % 360, s, l]),
        hslToHex([(h + 210) % 360, s, l])
      ];
      break;
    default:
      colors = [baseColor];
  }
  
  colors.forEach(color => {
    const swatch = document.createElement('div');
    swatch.style.background = color;
    container.appendChild(swatch);
  });
}

/**
 * Render preview of gradient swatches
 * @param {string} startColor - Start color in hex
 * @param {string} endColor - End color in hex
 * @param {number} steps - Number of steps
 */
function renderGradientPreview(startColor, endColor, steps) {
  const container = document.getElementById('gradientSwatchPreview');
  container.innerHTML = '';
  
  const startRgb = hexToRgb(startColor);
  const endRgb = hexToRgb(endColor);
  
  for (let i = 0; i < steps; i++) {
    const t = steps === 1 ? 0 : i / (steps - 1);
    const r = Math.round(startRgb[0] + (endRgb[0] - startRgb[0]) * t);
    const g = Math.round(startRgb[1] + (endRgb[1] - startRgb[1]) * t);
    const b = Math.round(startRgb[2] + (endRgb[2] - startRgb[2]) * t);
    const color = rgbToHex([r, g, b]);
    
    const swatch = document.createElement('div');
    swatch.style.background = color;
    container.appendChild(swatch);
  }
}

/**
 * Render preview of artistic palette swatches
 * @param {string} paletteName - Name of artistic palette
 */
function renderArtisticPreview(paletteName) {
  const container = document.getElementById('artisticSwatchPreview');
  container.innerHTML = '';
  
  const palette = ARTISTIC_PALETTES[paletteName] || ARTISTIC_PALETTES.material;
  
  palette.forEach(color => {
    const swatch = document.createElement('div');
    swatch.style.background = color;
    container.appendChild(swatch);
  });
}

/**
 * Render themed SVGs for preview and export
 * @param {string} svgText - Original SVG text
 * @param {Object} themes - Map of theme names to color assignments
 */
function renderThemedSVGs(svgText, themes) {
  const container = document.getElementById('themedSVGsPreview');
  container.innerHTML = '';
  
  // Create a grid container for all themed SVGs
  const gridContainer = document.createElement('div');
  gridContainer.style.display = 'grid';
  gridContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
  gridContainer.style.gap = '15px';
  gridContainer.style.width = '100%';
  gridContainer.style.marginTop = '10px';
  
  Object.entries(themes).forEach(([themeName, assignments]) => {
    // Apply theme to SVG
    const themedSVG = applyThemeToSVG(svgText, assignments);
    
    // Create a card for each themed SVG
    const card = document.createElement('div');
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.border = '1px solid #e0e0e0';
    card.style.borderRadius = '4px';
    card.style.padding = '10px';
    card.style.backgroundColor = '#f9f9f9';
    
    // Header row with checkbox and label
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.marginBottom = '8px';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'themedSVGCheckbox';
    checkbox.value = themeName;
    checkbox.checked = true;
    checkbox.style.marginRight = '8px';
    header.appendChild(checkbox);
    
    const label = document.createElement('span');
    label.textContent = themeName;
    label.style.fontWeight = 'bold';
    header.appendChild(label);
    
    card.appendChild(header);
    
    // Image container to maintain consistent sizing
    const imageContainer = document.createElement('div');
    imageContainer.style.display = 'flex';
    imageContainer.style.justifyContent = 'center';
    imageContainer.style.alignItems = 'center';
    imageContainer.style.padding = '5px';
    imageContainer.style.backgroundColor = '#ffffff';
    imageContainer.style.border = '1px solid #e0e0e0';
    imageContainer.style.borderRadius = '4px';
    imageContainer.style.height = '120px';
    imageContainer.style.overflow = 'hidden';
    
    // Get SVG dimensions
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(themedSVG, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;
    let svgWidth = svgElement.getAttribute('width');
    let svgHeight = svgElement.getAttribute('height');
    let viewBox = svgElement.getAttribute('viewBox');
    
    // Create the image
    const img = document.createElement('img');
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(themedSVG)));
    
    // Set appropriate image size based on SVG dimensions
    if (svgWidth && svgHeight) {
      const widthValue = parseInt(svgWidth);
      const heightValue = parseInt(svgHeight);
      const aspectRatio = widthValue / heightValue;
      
      if (aspectRatio > 1) {
        // Landscape orientation
        img.style.width = 'auto';
        img.style.height = '100%';
        img.style.maxWidth = '100%';
      } else {
        // Portrait orientation
        img.style.width = 'auto';
        img.style.height = '100%';
      }
    } else if (viewBox) {
      // If SVG has viewBox but no explicit dimensions
      img.style.maxWidth = '100%';
      img.style.maxHeight = '100%';
    } else {
      // Fallback
      img.style.maxWidth = '100%';
      img.style.maxHeight = '100%';
    }
    
    imageContainer.appendChild(img);
    card.appendChild(imageContainer);
    
    // Add the card to the grid
    gridContainer.appendChild(card);
  });
  
  container.appendChild(gridContainer);
}

/**
 * Initialize tab switching functionality
 */
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const panels = {
    family: document.getElementById('panel-family'),
    algorithmic: document.getElementById('panel-algorithmic')
  };
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      Object.keys(panels).forEach(key => {
        panels[key].style.display = (tab.dataset.tab === key) ? '' : 'none';
      });
    });
  });
}

/**
 * Initialize algorithmic mode switching
 */
function initAlgorithmicModes() {
  const algMode = document.getElementById('algMode');
  const controls = {
    harmonies: document.getElementById('algHarmoniesControls'),
    gradient: document.getElementById('algGradientControls'),
    artistic: document.getElementById('algArtisticControls')
  };
  
  algMode.addEventListener('change', function() {
    Object.keys(controls).forEach(key => {
      controls[key].style.display = (algMode.value === key) ? '' : 'none';
    });
    
    // Update preview based on selected mode
    updateAlgorithmicPreview();
  });
}

/**
 * Update algorithmic preview based on current settings
 */
function updateAlgorithmicPreview() {
  const mode = document.getElementById('algMode').value;
  
  switch (mode) {
    case 'harmonies':
      const harmonyType = document.getElementById('harmonyType').value;
      const harmonyBaseColor = document.getElementById('harmonyBaseColor').value;
      renderHarmonyPreview(harmonyBaseColor, harmonyType);
      break;
    case 'gradient':
      const startColor = document.getElementById('gradientStartColor').value;
      const endColor = document.getElementById('gradientEndColor').value;
      const steps = parseInt(document.getElementById('gradientSteps').value) || 5;
      renderGradientPreview(startColor, endColor, steps);
      break;
    case 'artistic':
      const artisticPalette = document.getElementById('artisticPalette').value;
      renderArtisticPreview(artisticPalette);
      break;
  }
}

// Export functions for use in other modules
if (typeof window !== 'undefined') {
  window.renderBaseColorsForm = renderBaseColorsForm;
  window.updateBaseColorsFromForm = updateBaseColorsFromForm;
  window.renderThemeSwatches = renderThemeSwatches;
  window.renderThemedSVGs = renderThemedSVGs;
  window.initTabs = initTabs;
  window.initAlgorithmicModes = initAlgorithmicModes;
  window.updateAlgorithmicPreview = updateAlgorithmicPreview;
}
