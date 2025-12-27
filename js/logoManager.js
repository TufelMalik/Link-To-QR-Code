/**
 * QR Code Generator - Logo Manager
 * Handles logo upload, preview, and shape selection
 */

class LogoManager {
    constructor() {
        this.logoDataUrl = null;
        this.selectedShape = 'square';
        this.onChangeCallback = null;
    }

    /**
     * Initialize the logo manager
     * @param {Function} onChange - Callback when logo changes
     */
    init(onChange) {
        this.onChangeCallback = onChange;
        this.setupEventListeners();
    }

    /**
     * Setup event listeners for logo upload
     */
    setupEventListeners() {
        const logoInput = document.getElementById('logoInput');
        const removeLogo = document.getElementById('removeLogo');

        if (logoInput) {
            logoInput.addEventListener('change', (e) => this.handleUpload(e));
        }

        if (removeLogo) {
            removeLogo.addEventListener('click', () => this.removeLogo());
        }

        // Logo shape selection
        document.querySelectorAll('.logo-shape-option').forEach(option => {
            option.addEventListener('click', () => this.selectShape(option));
        });
    }

    /**
     * Handle logo file upload
     * @param {Event} e - File input change event
     */
    handleUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            this.logoDataUrl = event.target.result;
            this.showPreview();

            if (this.onChangeCallback) {
                this.onChangeCallback();
            }
        };
        reader.readAsDataURL(file);
    }

    /**
     * Show logo preview and shape options
     */
    showPreview() {
        const preview = document.getElementById('logoPreview');
        const removeBtn = document.getElementById('removeLogo');
        const shapeSection = document.getElementById('logoShapeSection');

        if (preview) {
            preview.src = this.logoDataUrl;
            preview.style.display = 'block';
        }

        if (removeBtn) {
            removeBtn.style.display = 'inline-block';
        }

        if (shapeSection) {
            shapeSection.classList.remove('hidden');
        }
    }

    /**
     * Remove the current logo
     */
    removeLogo() {
        this.logoDataUrl = null;

        const logoInput = document.getElementById('logoInput');
        const preview = document.getElementById('logoPreview');
        const removeBtn = document.getElementById('removeLogo');
        const shapeSection = document.getElementById('logoShapeSection');

        if (logoInput) logoInput.value = '';
        if (preview) preview.style.display = 'none';
        if (removeBtn) removeBtn.style.display = 'none';
        if (shapeSection) shapeSection.classList.add('hidden');

        if (this.onChangeCallback) {
            this.onChangeCallback();
        }
    }

    /**
     * Select a logo shape
     * @param {HTMLElement} option - The clicked shape option element
     */
    selectShape(option) {
        document.querySelectorAll('.logo-shape-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        this.selectedShape = option.dataset.shape;

        if (this.onChangeCallback) {
            this.onChangeCallback();
        }
    }

    /**
     * Get current logo data URL
     * @returns {string|null} Base64 encoded logo data
     */
    getLogoDataUrl() {
        return this.logoDataUrl;
    }

    /**
     * Get current logo shape
     * @returns {string} Shape identifier
     */
    getShape() {
        return this.selectedShape;
    }

    /**
     * Check if a logo is currently set
     * @returns {boolean}
     */
    hasLogo() {
        return this.logoDataUrl !== null;
    }
}

// Export singleton instance
const logoManager = new LogoManager();
