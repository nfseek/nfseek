import React, { useState, useRef } from 'react';
import styles from './QRGenerator.module.css';
import { generateCustomQR, uploadLogo } from '../../services/qrService';

const QRGenerator = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [generatedQR, setGeneratedQR] = useState(null);
    const [formData, setFormData] = useState({
        url: '',
        pattern: '',
        eyes: {
            outer: '',
            inner: ''
        },
        frame: '',
        colors: {
            primary: '#054080',
            secondary: '#FFFFFF',
        },
        frameText: 'SCAN ME',
        frameTextFont: 'Arial',
        frameColor: '#807b05',
        frameColor2: '#e6ebf2',
        frameColorType: 'SINGLE_COLOR',
        logoUrl: ''
    });

    const [uploadingLogo, setUploadingLogo] = useState(false);
    const fileInputRef = useRef(null);

    const patterns = [
        { id: 'pattern0', image: '/qr-patterns/pattern1.svg' },
        { id: 'pattern1', image: '/qr-patterns/pattern2.svg' },
        { id: 'pattern2', image: '/qr-patterns/pattern3.svg' },
        { id: 'pattern3', image: '/qr-patterns/pattern4.svg' },
        { id: 'pattern4', image: '/qr-patterns/pattern5.svg' },
        { id: 'pattern5', image: '/qr-patterns/pattern6.svg' },
        { id: 'pattern6', image: '/qr-patterns/pattern7.svg' },
        { id: 'pattern7', image: '/qr-patterns/pattern8.svg' },
        { id: 'pattern8', image: '/qr-patterns/pattern9.svg' },
        { id: 'pattern9', image: '/qr-patterns/pattern10.svg' },
        { id: 'pattern10', image: '/qr-patterns/pattern11.svg' },
        { id: 'pattern11', image: '/qr-patterns/pattern12.svg' },
    ];

    // Eye combinations mapping
    const eyeCombinations = [
        { id: 'eye1', image: '/qr-eyes/eye1.svg', outer: 'eyeOuter0', inner: 'eyeInner0' },
        { id: 'eye2', image: '/qr-eyes/eye2.svg', outer: 'eyeOuter0', inner: 'eyeInner1' },
        { id: 'eye3', image: '/qr-eyes/eye3.svg', outer: 'eyeOuter1', inner: 'eyeInner0' },
        { id: 'eye4', image: '/qr-eyes/eye4.svg', outer: 'eyeOuter1', inner: 'eyeInner1' },
        { id: 'eye5', image: '/qr-eyes/eye5.svg', outer: 'eyeOuter2', inner: 'eyeInner1' },
        { id: 'eye6', image: '/qr-eyes/eye6.svg', outer: 'eyeOuter2', inner: 'eyeInner2' },
        { id: 'eye7', image: '/qr-eyes/eye7.svg', outer: 'eyeOuter3', inner: 'eyeInner3' },
        { id: 'eye8', image: '/qr-eyes/eye8.svg', outer: 'eyeOuter4', inner: 'eyeInner4' },
        { id: 'eye9', image: '/qr-eyes/eye9.svg', outer: 'eyeOuter5', inner: 'eyeInner5' },
        { id: 'eye10', image: '/qr-eyes/eye10.svg', outer: 'eyeOuter6', inner: 'eyeInner6' },
        { id: 'eye11', image: '/qr-eyes/eye11.svg', outer: 'eyeOuter7', inner: 'eyeInner1' },
        { id: 'eye12', image: '/qr-eyes/eye12.svg', outer: 'eyeOuter7', inner: 'eyeInner7' },
        { id: 'eye13', image: '/qr-eyes/eye13.svg', outer: 'eyeOuter8', inner: 'eyeInner1' },
        { id: 'eye14', image: '/qr-eyes/eye14.svg', outer: 'eyeOuter8', inner: 'eyeInner8' },
        { id: 'eye15', image: '/qr-eyes/eye15.svg', outer: 'eyeOuter9', inner: 'eyeInner9' },
    ];

    const frames = [
        { id: 1, image: '/qr-frames/1.svg' },
        { id: 2, image: '/qr-frames/2.svg' },
        { id: 3, image: '/qr-frames/3.svg' },
        { id: 4, image: '/qr-frames/4.svg' },
        { id: 5, image: '/qr-frames/5.svg' },
        { id: 6, image: '/qr-frames/6.svg' },
        { id: 7, image: '/qr-frames/7.svg' },
        { id: 8, image: '/qr-frames/8.svg' },
        { id: 9, image: '/qr-frames/9.svg' },
        { id: 10, image: '/qr-frames/10.svg' },
        { id: 11, image: '/qr-frames/11.svg' },
        { id: 12, image: '/qr-frames/12.svg' },
        { id: 13, image: '/qr-frames/13.svg' },
        { id: 14, image: '/qr-frames/14.svg' },
        { id: 15, image: '/qr-frames/15.svg' },
        { id: 16, image: '/qr-frames/16.svg' },
    ];

    const handleOptionSelect = (type, value, subType = null) => {
        if (type === 'eyes') {
            // Find the selected eye combination
            const selectedEye = eyeCombinations.find(eye => eye.id === value);
            if (selectedEye) {
                setFormData(prev => ({
                    ...prev,
                    eyes: {
                        outer: selectedEye.outer,
                        inner: selectedEye.inner
                    }
                }));
            }
        } else if (type === 'frame') {
            // Convert frame ID to number when setting it
            setFormData(prev => ({
                ...prev,
                [type]: Number(value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [type]: value
            }));
        }
    };

    const handleFrameCustomization = (type, value) => {
        setFormData(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const handleLogoUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            setUploadingLogo(true);
            const logoUrl = await uploadLogo(file);
            console.log('Uploaded logo URL:', logoUrl); // Add logging to verify URL
            setFormData(prev => ({
                ...prev,
                logoUrl // Store the logo URL in form data
            }));
        } catch (error) {
            console.error('Error uploading logo:', error);
            // You might want to show an error message to the user here
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleNext = async () => {
        if (currentStep === 6) {
            try {
                setLoading(true);
                setError(null);
                console.log('Form data being sent:', formData); // Add logging to verify data
                const result = await generateCustomQR(formData);
                setGeneratedQR(result);
                setCurrentStep(prev => prev + 1);
            } catch (err) {
                setError('Failed to generate QR code. Please try again.');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const renderFrameCustomization = () => {
        if (!formData.frame) return null;
        
        return (
            <div className={styles.frameCustomization}>
                <div className={styles.inputGroup}>
                    <label>Frame Text (max 15 chars)</label>
                    <input
                        type="text"
                        maxLength={15}
                        value={formData.frameText}
                        onChange={(e) => handleFrameCustomization('frameText', e.target.value)}
                        placeholder="SCAN ME"
                    />
                </div>
                
                <div className={styles.inputGroup}>
                    <label>Frame Text Font</label>
                    <select 
                        value={formData.frameTextFont}
                        onChange={(e) => handleFrameCustomization('frameTextFont', e.target.value)}
                    >
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Times New Roman">Times New Roman</option>
                    </select>
                </div>

                <div className={styles.colorGroup}>
                    <div>
                        <label>Frame Color</label>
                        <input
                            type="color"
                            value={formData.frameColor}
                            onChange={(e) => handleFrameCustomization('frameColor', e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label>Frame Color 2</label>
                        <input
                            type="color"
                            value={formData.frameColor2}
                            onChange={(e) => handleFrameCustomization('frameColor2', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const renderLogoUpload = () => {
        return (
            <div className={styles.logoUpload}>
                <h3>Upload Logo</h3>
                <p>Add a logo to your QR code (optional)</p>
                
                <div className={styles.uploadArea}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleLogoUpload}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                    
                    {formData.logoUrl ? (
                        <div className={styles.previewContainer}>
                            <img 
                                src={formData.logoUrl} 
                                alt="Logo preview" 
                                className={styles.logoPreview}
                            />
                            <button 
                                className={styles.changeButton}
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingLogo}
                            >
                                Change Logo
                            </button>
                        </div>
                    ) : (
                        <button 
                            className={styles.uploadButton}
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingLogo}
                        >
                            {uploadingLogo ? 'Uploading...' : 'Choose Logo'}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.navigation}>
                <div className={styles.steps}>
                    <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''}`}>
                        <div className={styles.stepNumber}>1</div>
                        <span>Enter URL</span>
                    </div>
                    <div className={styles.stepDivider} />
                    <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''}`}>
                        <div className={styles.stepNumber}>2</div>
                        <span>Pattern</span>
                    </div>
                    <div className={styles.stepDivider} />
                    <div className={`${styles.step} ${currentStep >= 3 ? styles.active : ''}`}>
                        <div className={styles.stepNumber}>3</div>
                        <span>Eye Style</span>
                    </div>
                    <div className={styles.stepDivider} />
                    <div className={`${styles.step} ${currentStep >= 4 ? styles.active : ''}`}>
                        <div className={styles.stepNumber}>4</div>
                        <span>Frame</span>
                    </div>
                    <div className={styles.stepDivider} />
                    <div className={`${styles.step} ${currentStep >= 5 ? styles.active : ''}`}>
                        <div className={styles.stepNumber}>5</div>
                        <span>Logo</span>
                    </div>
                    <div className={styles.stepDivider} />
                    <div className={`${styles.step} ${currentStep >= 6 ? styles.active : ''}`}>
                        <div className={styles.stepNumber}>6</div>
                        <span>Generate</span>
                    </div>
                </div>
            </div>

            <h1 className={styles.title}>Create Custom QR Code</h1>

            {currentStep === 1 && (
                <div className={styles.stepContainer}>
                    <h2 className={styles.stepTitle}>Step 1: Enter URL</h2>
                    <div className={styles.inputContainer}>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="https://example.com"
                            value={formData.url}
                            onChange={(e) => handleOptionSelect('url', e.target.value)}
                        />
                    </div>
                    <button 
                        className={`${styles.button} ${styles.primary}`}
                        onClick={handleNext}
                        disabled={!formData.url}
                    >
                        Next
                    </button>
                </div>
            )}

            {currentStep === 2 && (
                <div className={styles.stepContainer}>
                    <h2 className={styles.stepTitle}>Step 2: Select Pattern</h2>
                    <div className={styles.optionsGrid}>
                        {patterns.map((pattern) => (
                            <div
                                key={pattern.id}
                                className={`${styles.optionCard} ${formData.pattern === pattern.id ? styles.selected : ''}`}
                                onClick={() => handleOptionSelect('pattern', pattern.id)}
                            >
                                <img src={pattern.image} alt={pattern.id} />
                            </div>
                        ))}
                    </div>
                    <div className={styles.buttonGroup}>
                        <button className={styles.button} onClick={handleBack}>Back</button>
                        <button 
                            className={`${styles.button} ${styles.primary}`}
                            onClick={handleNext}
                            disabled={!formData.pattern}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {currentStep === 3 && (
                <div className={styles.stepContainer}>
                    <h2 className={styles.stepTitle}>Step 3: Choose Eye Style</h2>
                    <div className={styles.optionsGrid}>
                        {eyeCombinations.map((eye) => (
                            <div
                                key={eye.id}
                                className={`${styles.optionCard} ${
                                    formData.eyes.outer === eye.outer && 
                                    formData.eyes.inner === eye.inner ? 
                                    styles.selected : ''
                                }`}
                                onClick={() => handleOptionSelect('eyes', eye.id)}
                            >
                                <img src={eye.image} alt={`Eye style ${eye.id}`} />
                            </div>
                        ))}
                    </div>
                    <div className={styles.buttonGroup}>
                        <button className={styles.button} onClick={handleBack}>Back</button>
                        <button 
                            className={`${styles.button} ${styles.primary}`}
                            onClick={handleNext}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {currentStep === 4 && (
                <div className={styles.stepContainer}>
                    <h2 className={styles.stepTitle}>Step 4: Select Frame</h2>
                    <div className={styles.optionsGrid}>
                        {frames.map((frame) => (
                            <div
                                key={frame.id}
                                className={`${styles.optionCard} ${formData.frame === frame.id ? styles.selected : ''}`}
                                onClick={() => handleOptionSelect('frame', frame.id)}
                            >
                                <img src={frame.image} alt={frame.id} />
                            </div>
                        ))}
                    </div>
                    {renderFrameCustomization()}
                    <div className={styles.buttonGroup}>
                        <button className={styles.button} onClick={handleBack}>Back</button>
                        <button 
                            className={`${styles.button} ${styles.primary}`}
                            onClick={handleNext}
                            disabled={!formData.frame}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {currentStep === 5 && (
                <div className={styles.stepContainer}>
                    <h2 className={styles.stepTitle}>Step 5: Upload Logo</h2>
                    {renderLogoUpload()}
                    <div className={styles.buttonGroup}>
                        <button className={styles.button} onClick={handleBack}>Back</button>
                        <button 
                            className={`${styles.button} ${styles.primary}`}
                            onClick={handleNext}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {currentStep === 6 && (
                <div className={styles.stepContainer}>
                    <h2 className={styles.stepTitle}>Step 6: Choose Colors</h2>
                    <div className={styles.colorPickers}>
                        <div className={styles.colorField}>
                            <label>Background Color</label>
                            <p className={styles.colorDescription}>Choose a bright color for better scanning</p>
                            <input
                                type="color"
                                value={formData.colors.primary}
                                onChange={(e) => handleOptionSelect('colors', { 
                                    ...formData.colors, 
                                    primary: e.target.value 
                                })}
                            />
                            <span className={styles.colorValue}>{formData.colors.primary}</span>
                        </div>
                        <div className={styles.colorField}>
                            <label>QR Pattern Color</label>
                            <p className={styles.colorDescription}>Choose a dark color that contrasts with the background</p>
                            <input
                                type="color"
                                value={formData.colors.secondary}
                                onChange={(e) => handleOptionSelect('colors', { 
                                    ...formData.colors, 
                                    secondary: e.target.value 
                                })}
                            />
                            <span className={styles.colorValue}>{formData.colors.secondary}</span>
                        </div>
                    </div>
                    <div className={styles.colorPreview}>
                        <div 
                            className={styles.colorSample}
                            style={{
                                backgroundColor: formData.colors.primary,
                                border: `2px solid ${formData.colors.secondary}`
                            }}
                        >
                            <div 
                                className={styles.colorSampleInner}
                                style={{ backgroundColor: formData.colors.secondary }}
                            />
                        </div>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button className={styles.button} onClick={handleBack}>Back</button>
                        <button 
                            className={`${styles.button} ${styles.primary}`}
                            onClick={handleNext}
                        >
                            Generate QR Code
                        </button>
                    </div>
                </div>
            )}

            {currentStep === 7 && (
                <div className={styles.stepContainer}>
                    <h2 className={styles.stepTitle}>Your QR Code</h2>
                    {loading && <div>Generating your QR code...</div>}
                    {error && <div className={styles.error}>{error}</div>}
                    {generatedQR && (
                        <div className={styles.finalStep}>
                            <div className={styles.qrPreview}>
                                <img src={generatedQR.imageUrl} alt="Generated QR Code" />
                            </div>
                            <div className={styles.configPreview}>
                                <h3>Configuration Preview:</h3>
                                <pre>{JSON.stringify(formData, null, 2)}</pre>
                            </div>
                        </div>
                    )}
                    <div className={styles.buttonGroup}>
                       
                        {generatedQR && (
                            <a 
                                href={generatedQR.imageUrl} 
                                download="qr-code.png"
                                className={`${styles.button} ${styles.primary}`}
                            >
                                Download QR Code
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QRGenerator;
