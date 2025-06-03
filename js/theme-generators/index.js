/**
 * theme-generators/index.js - Exports all theme generators
 */

// This file serves as a central export point for all theme generators
// It allows for easier imports and organization

// Export functions for use in other modules
if (typeof window !== 'undefined') {
  // Re-export all theme generators
  window.themeGenerators = {
    family: window.generateFamilyThemes || null,
    algorithmic: window.generateAlgorithmicThemes || null
  };
}
