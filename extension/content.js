/**
 * Custom Toast Notification Function
 * @param {Object} options - Toast configuration options
 * @param {string} options.text - The message to display
 * @param {number} options.duration - Duration in milliseconds (default: 3000)
 * @param {string} options.gravity - Position: 'top' or 'bottom' (default: 'top')
 * @param {string} options.position - Alignment: 'left', 'center', or 'right' (default: 'left')
 * @param {Object} options.style - Custom styles object
 * @param {string} options.destination - URL to navigate on click (optional)
 * @param {boolean} options.newWindow - Open destination in new window (default: false)
 * @param {Function} options.onClick - Click callback function (optional)
 */
function showToast(options) {
    const {
        text,
        duration = 3000,
        gravity = 'top',
        position = 'left',
        style = {},
        destination = null,
        newWindow = false,
        onClick = null
    } = options;

    // Create toast container
    const toast = document.createElement('div');
    toast.className = 'lindle-toast';
    toast.textContent = text;

    // Apply positioning
    toast.style.position = 'fixed';
    toast.style.zIndex = '999999';
    toast.style.padding = '16px 24px';
    toast.style.borderRadius = '8px';
    toast.style.color = '#fff';
    toast.style.fontSize = '14px';
    toast.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    toast.style.cursor = destination || onClick ? 'pointer' : 'default';
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = gravity === 'top' ? 'translateY(-20px)' : 'translateY(20px)';
    toast.style.maxWidth = '350px';
    toast.style.wordWrap = 'break-word';

    // Apply custom styles
    if (style.background) {
        toast.style.background = style.background;
    } else {
        toast.style.background = "linear-gradient(to right, #c800d1, #007399)";
    }
    Object.assign(toast.style, style);

    // Position the toast
    if (gravity === 'top') {
        toast.style.top = '20px';
    } else {
        toast.style.bottom = '20px';
    }

    if (position === 'left') {
        toast.style.left = '20px';
    } else if (position === 'right') {
        toast.style.right = '20px';
    } else {
        toast.style.left = '50%';
        toast.style.transform += ' translateX(-50%)';
    }

    // Add click handler
    if (destination || onClick) {
        toast.addEventListener('click', () => {
            if (onClick) onClick();
            if (destination) {
                if (newWindow) {
                    window.open(destination, '_blank');
                } else {
                    window.location.href = destination;
                }
            }
        });
    }

    // Add to DOM
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = toast.style.transform.replace(/translateY\([^)]+\)/, 'translateY(0)');
    }, 10);

    // Remove toast after duration
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = gravity === 'top' ? 'translateY(-20px)' : 'translateY(20px)';
        if (position === 'center') {
            toast.style.transform += ' translateX(-50%)';
        }

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);

    return toast;
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cid === "alert") {
        showToast({
            text: request.message,
            duration: request.duration || 4000,
            destination: "https://github.com/M2KDevelopments/YoutubeVideoDownloader",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #c800d1, #007399)",
            },
            onClick: function () { } // Callback after click
        })
    }
})