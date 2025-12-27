/**
 * QR Code Generator - Gradient Manager
 * Handles gradient presets and custom gradients
 */

class GradientManager {
    constructor() {
        this.selectedGradient = null;
        this.container = null;
        this.onChangeCallback = null;
    }

    /**
     * Initialize the gradient presets UI
     * @param {string} containerId - ID of the container element
     * @param {Function} onChange - Callback when gradient changes
     */
    init(containerId, onChange) {
        this.container = document.getElementById(containerId);
        this.onChangeCallback = onChange;
        this.render();
    }

    /**
     * Render gradient preset cards
     */
    render() {
        if (!this.container) return;

        this.container.innerHTML = '';

        GRADIENT_PRESETS.forEach((preset, index) => {
            const div = document.createElement('div');
            div.className = 'gradient-preset' + (index === 0 ? ' active' : '');
            div.dataset.index = index;

            div.style.background = this.createGradientCSS(preset.colors);
            div.innerHTML = `<span class="name">${preset.name}</span>`;

            div.addEventListener('click', () => this.selectPreset(index));

            this.container.appendChild(div);
        });

        // Set default selection
        this.selectedGradient = GRADIENT_PRESETS[0];
    }

    /**
     * Create CSS gradient string from colors array
     * @param {string[]} colors - Array of color hex codes
     * @returns {string} CSS gradient string
     */
    createGradientCSS(colors) {
        if (colors.length > 2) {
            return `linear-gradient(135deg, ${colors.join(', ')})`;
        }
        return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`;
    }

    /**
     * Select a preset gradient
     * @param {number} index - Index of the preset
     */
    selectPreset(index) {
        document.querySelectorAll('.gradient-preset').forEach(p => p.classList.remove('active'));
        this.container.children[index].classList.add('active');
        this.selectedGradient = GRADIENT_PRESETS[index];

        // Disable custom gradient
        const customToggle = document.getElementById('useCustomGradient');
        if (customToggle) {
            customToggle.checked = false;
            document.getElementById('customGradientPicker')?.classList.add('hidden');
        }

        if (this.onChangeCallback) {
            this.onChangeCallback();
        }
    }

    /**
     * Get the current gradient (preset or custom)
     * @returns {Object} Gradient object with colors array
     */
    getCurrentGradient() {
        const useCustom = document.getElementById('useCustomGradient')?.checked;

        if (useCustom) {
            return {
                colors: [
                    document.getElementById('customGradientStart')?.value || '#f09433',
                    document.getElementById('customGradientEnd')?.value || '#bc1888'
                ]
            };
        }

        return this.selectedGradient || GRADIENT_PRESETS[0];
    }

    /**
     * Deselect all presets (when custom is enabled)
     */
    deselectAll() {
        document.querySelectorAll('.gradient-preset').forEach(p => p.classList.remove('active'));
    }
}

// Export singleton instance
const gradientManager = new GradientManager();
