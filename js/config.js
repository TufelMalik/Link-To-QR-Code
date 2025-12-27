/**
 * QR Code Generator - Configuration
 * Contains all configurable constants and presets
 */

const CONFIG = {
    // Default URL for QR code
    defaultURL: 'https://restaurant-menu-3d-food.vercel.app/',
    
    // Default QR size
    defaultSize: 250,
    minSize: 150,
    maxSize: 400,
    
    // Debounce delay for real-time updates (ms)
    debounceDelay: 300,
    
    // QR render delay (ms)
    renderDelay: 500,
    
    // Logo options
    logoMargin: 5,
    logoSize: 0.4,
};

/**
 * Professional Gradient Presets
 * Each preset has a name and array of colors
 */
const GRADIENT_PRESETS = [
    { name: 'Instagram', colors: ['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888'] },
    { name: 'Sunset', colors: ['#ff512f', '#f09819'] },
    { name: 'Purple Dream', colors: ['#667eea', '#764ba2'] },
    { name: 'Ocean Blue', colors: ['#2193b0', '#6dd5ed'] },
    { name: 'Emerald', colors: ['#11998e', '#38ef7d'] },
    { name: 'Rose Gold', colors: ['#f4c4f3', '#fc67fa'] },
    { name: 'Midnight', colors: ['#232526', '#414345'] },
    { name: 'Fire', colors: ['#f12711', '#f5af19'] },
    { name: 'Cool Blues', colors: ['#2193b0', '#6dd5ed'] },
    { name: 'Mango', colors: ['#ffe259', '#ffa751'] },
    { name: 'Cherry', colors: ['#eb3349', '#f45c43'] },
    { name: 'Peachy', colors: ['#ed6ea0', '#ec8c69'] },
];

/**
 * Preset QR Colors
 */
const PRESET_COLORS = [
    '#000000',
    '#667eea',
    '#11998e',
    '#f953c6',
    '#ff6b6b',
    '#4834d4',
    '#00b894',
    '#e17055',
];

/**
 * Font Options
 */
const FONT_OPTIONS = [
    { name: 'Arial', family: 'Arial' },
    { name: 'Georgia', family: 'Georgia' },
    { name: 'Courier', family: 'Courier New' },
    { name: 'Verdana', family: 'Verdana' },
    { name: 'Impact', family: 'Impact' },
];

/**
 * Logo Shape Options
 */
const LOGO_SHAPES = [
    { id: 'square', name: 'Square', cssClass: 'square' },
    { id: 'round', name: 'Round', cssClass: 'round' },
    { id: 'rounded', name: 'Rounded', cssClass: 'rounded' },
    { id: 'diamond', name: 'Diamond', cssClass: 'diamond' },
];

/**
 * Dots Shape Options
 */
const DOTS_SHAPES = [
    { id: 'square', name: 'Square', icon: '⬛' },
    { id: 'dots', name: 'Dots', icon: '⚫' },
    { id: 'rounded', name: 'Rounded', icon: '🔘' },
    { id: 'extra-rounded', name: 'Extra Round', icon: '⭕' },
    { id: 'classy', name: 'Classy', icon: '💎' },
    { id: 'classy-rounded', name: 'Classy Round', icon: '✨' },
];

/**
 * Corner Square Shape Options
 */
const CORNER_SQUARE_SHAPES = [
    { id: 'square', name: 'Square', icon: '⬛' },
    { id: 'dot', name: 'Dot', icon: '⚫' },
    { id: 'extra-rounded', name: 'Rounded', icon: '🔵' },
];

/**
 * Corner Dot Shape Options
 */
const CORNER_DOT_SHAPES = [
    { id: 'square', name: 'Square', icon: '⬛' },
    { id: 'dot', name: 'Dot', icon: '⚫' },
];
