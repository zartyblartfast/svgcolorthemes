# SVG Color Themes

A toolkit for extracting, generating, and applying color themes to SVG files—optimized for Inkscape, but extensible for other vector editors.

## Features

- Extracts SVG structure and color information into JSON
- Generates color themes based on customizable parameters
- Applies color themes to SVGs and exports themed PNGs (via Inkscape CLI)
- Designed for modular extension (editor-agnostic core, with Inkscape-specific enhancements)

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/zartyblartfast/svgcolorthemes.git
   cd svgcolorthemes
   ```

2. Install Python dependencies (if any).

3. Run the scripts:
   - `extract_svg_structure.py` - Extracts structure from SVG to JSON
   - `generate_color_themes.py` - Generates new color themes
   - `apply_svg_color_theme_v2.py` - Applies themes and exports PNGs (requires Inkscape)

## Roadmap

- [ ] Web app for interactive theme generation and preview
- [ ] Editor-agnostic SVG support
- [ ] Advanced color theme controls

## License

MIT
