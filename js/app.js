/**
 * QR Code Generator - Application Entry Point
 * Initializes all modules when DOM is ready
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize gradient manager with callback for real-time updates
    gradientManager.init('gradientPresets', () => qrGenerator.debounceGenerate());

    // Initialize logo manager with callback for real-time updates
    logoManager.init(() => qrGenerator.debounceGenerate());

    // Initialize QR generator (also handles initial generation)
    qrGenerator.init();
});

/**
 * Download handler - exposed globally for onclick
 * @param {string} format - 'png' or 'jpg'
 */
function downloadFinal(format) {
    qrGenerator.download(format);
}
