/**
 * QR Code Generator - QR Generator Core
 * Main QR code generation and canvas rendering
 */

class QRGenerator {
    constructor() {
        this.qrCode = null;
        this.debounceTimer = null;
    }

    /**
     * Initialize the QR generator
     */
    init() {
        this.setupEventListeners();
        this.generateScanInstructionImage();
        this.generate(); // Initial generation
    }

    /**
     * Setup all event listeners for real-time updates
     */
    setupEventListeners() {
        // Shape selection handlers
        document.querySelectorAll('.shape-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const parent = e.currentTarget.parentElement;
                parent.querySelectorAll('.shape-option').forEach(o => o.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.debounceGenerate();
            });
        });

        document.querySelectorAll('.corner-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const parent = e.currentTarget.parentElement;
                parent.querySelectorAll('.corner-option').forEach(o => o.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.debounceGenerate();
            });
        });

        document.querySelectorAll('.font-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.font-option').forEach(o => o.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.debounceGenerate();
            });
        });

        // Color presets
        document.querySelectorAll('.preset-color').forEach(preset => {
            preset.addEventListener('click', (e) => {
                document.getElementById('dotsColor').value = e.currentTarget.dataset.color;
                this.debounceGenerate();
            });
        });

        // Gradient toggle
        const useGradient = document.getElementById('useGradient');
        if (useGradient) {
            useGradient.addEventListener('change', (e) => {
                document.getElementById('gradientColors').classList.toggle('hidden', !e.target.checked);
                this.debounceGenerate();
            });
        }

        // Custom gradient toggle
        const useCustomGradient = document.getElementById('useCustomGradient');
        if (useCustomGradient) {
            useCustomGradient.addEventListener('change', (e) => {
                document.getElementById('customGradientPicker').classList.toggle('hidden', !e.target.checked);
                if (e.target.checked) {
                    gradientManager.deselectAll();
                }
                this.debounceGenerate();
            });
        }

        // Size slider
        const qrSize = document.getElementById('qrSize');
        if (qrSize) {
            qrSize.addEventListener('input', (e) => {
                document.getElementById('sizeValue').textContent = e.target.value;
                this.debounceGenerate();
            });
        }

        // Text and color inputs
        const inputElements = [
            'redirectURL', 'qrTitle', 'qrTagline', 'titleColor', 'taglineColor',
            'dotsColor', 'bgColor', 'borderColor', 'gradientStart', 'gradientEnd',
            'customGradientStart', 'customGradientEnd'
        ];

        inputElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.debounceGenerate());
                element.addEventListener('change', () => this.debounceGenerate());
            }
        });
    }

    /**
     * Debounced generation to prevent excessive updates
     */
    debounceGenerate() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this.generate(), CONFIG.debounceDelay);
    }

    /**
     * Get selected shape from a container
     * @param {string} containerId - Container element ID
     * @returns {string} Selected shape value
     */
    getSelectedShape(containerId) {
        const container = document.getElementById(containerId);
        const active = container?.querySelector('.active');
        return active?.dataset.shape || 'square';
    }

    /**
     * Get selected font
     * @returns {string} Font family name
     */
    getSelectedFont() {
        const active = document.querySelector('.font-option.active');
        return active?.dataset.font || 'Arial';
    }

    /**
     * Generate the QR code
     */
    async generate() {
        const url = document.getElementById('redirectURL')?.value || CONFIG.defaultURL;
        const size = parseInt(document.getElementById('qrSize')?.value || CONFIG.defaultSize);
        const dotsColor = document.getElementById('dotsColor')?.value || '#000000';
        const bgColor = document.getElementById('bgColor')?.value || '#ffffff';
        const useGradient = document.getElementById('useGradient')?.checked || false;
        const gradientStart = document.getElementById('gradientStart')?.value || '#667eea';
        const gradientEnd = document.getElementById('gradientEnd')?.value || '#764ba2';

        // Build dots options
        let dotsOptions = {
            type: this.getSelectedShape('dotsShape'),
        };

        if (useGradient) {
            dotsOptions.gradient = {
                type: 'linear',
                rotation: 45,
                colorStops: [
                    { offset: 0, color: gradientStart },
                    { offset: 1, color: gradientEnd }
                ]
            };
        } else {
            dotsOptions.color = dotsColor;
        }

        // Build QR options
        const options = {
            width: size,
            height: size,
            data: url,
            dotsOptions: dotsOptions,
            backgroundOptions: {
                color: bgColor
            },
            cornersSquareOptions: {
                type: this.getSelectedShape('cornerSquareShape'),
                color: dotsColor
            },
            cornersDotOptions: {
                type: this.getSelectedShape('cornerDotShape'),
                color: dotsColor
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: CONFIG.logoMargin,
                imageSize: CONFIG.logoSize
            }
        };

        // Add logo if present
        if (logoManager.hasLogo()) {
            options.image = logoManager.getLogoDataUrl();
        }

        // Generate QR
        const qrContainer = document.getElementById('qrcode');
        if (qrContainer) {
            qrContainer.innerHTML = '';
            this.qrCode = new QRCodeStyling(options);
            this.qrCode.append(qrContainer);
        }

        // Wait for render and create final canvas
        await new Promise(resolve => setTimeout(resolve, CONFIG.renderDelay));
        this.createFinalCanvas();
    }

    /**
     * Create the final canvas with title, tagline, and gradient background
     */
    createFinalCanvas() {
        const qrCanvas = document.querySelector('#qrcode canvas');
        if (!qrCanvas) return;

        const title = document.getElementById('qrTitle')?.value || '';
        const tagline = document.getElementById('qrTagline')?.value || '';
        const font = this.getSelectedFont();
        const borderColor = document.getElementById('borderColor')?.value || '#e0e0e0';
        const titleColor = document.getElementById('titleColor')?.value || '#333333';
        const taglineColor = document.getElementById('taglineColor')?.value || '#666666';
        const currentGradient = gradientManager.getCurrentGradient();

        const qrSize = qrCanvas.width;
        const padding = 40;
        const titleHeight = title ? 50 : 0;
        const taglineHeight = tagline ? 30 : 0;

        const canvasWidth = qrSize + padding * 2;
        const canvasHeight = qrSize + padding * 2 + titleHeight + taglineHeight;

        const canvas = document.getElementById('finalCanvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');

        // Draw gradient background
        let bgGradient;
        if (currentGradient.colors.length > 2) {
            bgGradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
            const step = 1 / (currentGradient.colors.length - 1);
            currentGradient.colors.forEach((color, i) => {
                bgGradient.addColorStop(i * step, color);
            });
        } else {
            bgGradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
            bgGradient.addColorStop(0, currentGradient.colors[0]);
            bgGradient.addColorStop(1, currentGradient.colors[1]);
        }
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw white card
        const cardPadding = 20;
        const cardX = cardPadding;
        const cardY = cardPadding;
        const cardWidth = canvasWidth - cardPadding * 2;
        const cardHeight = canvasHeight - cardPadding * 2;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 20);
        ctx.fill();

        // Draw border
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 20);
        ctx.stroke();

        let currentY = cardY + 25;

        // Draw title
        if (title) {
            ctx.fillStyle = titleColor;
            ctx.font = `bold 28px ${font}`;
            ctx.textAlign = 'center';
            ctx.fillText(title, canvasWidth / 2, currentY + 25);
            currentY += titleHeight;
        }

        // Draw tagline
        if (tagline) {
            ctx.fillStyle = taglineColor;
            ctx.font = `16px ${font}`;
            ctx.textAlign = 'center';
            ctx.fillText(tagline, canvasWidth / 2, currentY + 15);
            currentY += taglineHeight;
        }

        // Draw QR code
        const qrX = (canvasWidth - qrSize) / 2;
        ctx.drawImage(qrCanvas, qrX, currentY);

        // Update preview background
        const previewBg = gradientManager.createGradientCSS(currentGradient.colors);
        document.getElementById('finalPreview').style.background = previewBg;
    }

    /**
     * Generate the scan instruction image
     */
    generateScanInstructionImage() {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 280;
        const ctx = canvas.getContext('2d');

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 400, 280);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 280);

        // Phone illustration
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.roundRect(140, 30, 120, 200, 15);
        ctx.fill();

        // Phone screen
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.roundRect(148, 50, 104, 160, 5);
        ctx.fill();

        // Camera viewfinder
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 3;
        ctx.strokeRect(168, 80, 64, 64);

        // Corner brackets
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#11998e';

        // Draw corner brackets
        const corners = [
            [[168, 95], [168, 80], [183, 80]], // Top-left
            [[217, 80], [232, 80], [232, 95]], // Top-right
            [[168, 129], [168, 144], [183, 144]], // Bottom-left
            [[217, 144], [232, 144], [232, 129]], // Bottom-right
        ];

        corners.forEach(corner => {
            ctx.beginPath();
            ctx.moveTo(corner[0][0], corner[0][1]);
            ctx.lineTo(corner[1][0], corner[1][1]);
            ctx.lineTo(corner[2][0], corner[2][1]);
            ctx.stroke();
        });

        // QR code mini illustration
        ctx.fillStyle = '#333';
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (Math.random() > 0.3) {
                    ctx.fillRect(178 + i * 9, 90 + j * 9, 7, 7);
                }
            }
        }

        // Notification popup
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.roundRect(155, 160, 90, 35, 8);
        ctx.fill();

        ctx.fillStyle = '#333';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🔗 Open Link', 200, 182);

        // Text at bottom
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Point Camera at QR Code', 200, 260);

        const imgElement = document.getElementById('scanInstructionImage');
        if (imgElement) {
            imgElement.src = canvas.toDataURL('image/png');
        }
    }

    /**
     * Download the final QR code
     * @param {string} format - 'png' or 'jpg'
     */
    download(format) {
        const canvas = document.getElementById('finalCanvas');
        const link = document.createElement('a');

        if (format === 'jpg') {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.fillStyle = '#ffffff';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(canvas, 0, 0);
            link.href = tempCanvas.toDataURL('image/jpeg', 0.95);
        } else {
            link.href = canvas.toDataURL('image/png');
        }

        const title = document.getElementById('qrTitle')?.value || 'qr-code';
        link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.${format}`;
        link.click();
    }
}

// Export singleton instance
const qrGenerator = new QRGenerator();
