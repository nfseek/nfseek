import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_QRTIGER_API_KEY;
const BASE_URL = 'https://api.qrtiger.com/api';

const qrApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': 'Bearer 99bb05e0-cfd1-11ef-b435-afc66f63700c',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Convert hex color to RGB format
const hexToRgb = (hex) => {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgb(${r},${g},${b})`;
};

// Upload logo to QR Tiger API
export const uploadLogo = async (file) => {
    try {
        const formData = new FormData();
        formData.append('userFile', file);

        const response = await axios.post('https://api.qrtiger.com/api/accounts/uploads/', formData, {
            headers: {
                'Authorization': 'Bearer 99bb05e0-cfd1-11ef-b435-afc66f63700c',
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return response.data.qrUrl; // Changed from url to qrUrl to match API response
    } catch (error) {
        console.error('Error uploading logo:', error);
        throw error;
    }
};

export const generateCustomQR = async (config) => {
    try {
        const response = await qrApi.post('/campaign/', {
            qr: {
                size: 500,
                colorDark: hexToRgb(config.colors.secondary),
                backgroundColor: hexToRgb(config.colors.primary),
                eye_outer: config.eyes.outer,
                eye_inner: config.eyes.inner,
                qrData: config.pattern,
                frame: config.frame,
                frameText: config.frameText,
                frameTextFont: config.frameTextFont,
                frameColor: hexToRgb(config.frameColor),
                frameColor2: hexToRgb(config.frameColor2),
                frameColorType: config.frameColorType,
                logo: config.logoUrl || '', // Make sure logoUrl is being passed correctly
                transparentBkg: false,
                qrCategory: 'url'
            },
            qrUrl: config.url,
            qrType: 'qr2',
            qrCategory: 'url'
        });
        
        return response.data;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
};
