import React, { useState } from 'react';
import styles from './QRGenerator.module.css';
import { generateCustomQR } from '../../services/qrService';

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
    });

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
        { id: 'eye3', image: '/qr-eyes/eye3.svg', outer: 'eyeOuter1', inner: 'eyeInner1' },
        { id: 'eye4', image: '/qr-eyes/eye4.svg', outer: 'eyeOuter1', inner: 'eyeInner1' },
        { id: 'eye5', image: '/qr-eyes/eye5.svg', outer: 'eyeOuter2', inner: 'eyeInner1' },
        // Add more combinations as needed
    ];

    const frames = [

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

    const handleNext = async () => {
        if (currentStep === 5) {
            try {
                setLoading(true);
                setError(null);
                const response = await generateCustomQR(formData);
                setGeneratedQR(response);
                setLoading(false);
            } catch (err) {
                setError('Failed to generate QR code. Please try again.');
                setLoading(false);
                return;
            }
        }
        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
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
                        <span>Colors</span>
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
                    <h2 className={styles.stepTitle}>Step 5: Choose Colors</h2>
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

            {currentStep === 6 && (
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
