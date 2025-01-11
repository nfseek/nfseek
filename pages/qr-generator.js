import { useState } from 'react';
import { Box, Container, Typography, TextField, Grid, Card, CardContent, Button } from '@mui/material';
import { styled } from '@mui/system';

const StepContainer = styled(Box)({
  marginBottom: '2rem',
});

const OptionCard = styled(Card)(({ selected }) => ({
  cursor: 'pointer',
  transition: 'transform 0.2s',
  border: selected ? '2px solid #4CAF50' : '1px solid #ddd',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const QRCodeGenerator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    url: '',
    pattern: '',
    eyes: '',
    frame: '',
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
    },
  });

  const patterns = [
    { id: 'pattern1', image: '/qr-patterns/pattern1.svg' },
    { id: 'pattern2', image: '/qr-patterns/pattern2.svg' },
    // Add more patterns
  ];

  const eyes = [
    { id: 'eye1', image: '/qr-eyes/eye1.svg' },
    { id: 'eye2', image: '/qr-eyes/eye2.svg' },
    // Add more eye styles
  ];

  const frames = [
    { id: 'frame1', image: '/qr-frames/frame1.svg' },
    { id: 'frame2', image: '/qr-frames/frame2.svg' },
    // Add more frames
  ];

  const handleOptionSelect = (type, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    // Handle QR code generation and saving
    console.log('Form data:', formData);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Custom QR Code
      </Typography>

      {currentStep === 1 && (
        <StepContainer>
          <Typography variant="h6" gutterBottom>
            Step 1: Enter URL
          </Typography>
          <TextField
            fullWidth
            label="Enter your URL"
            value={formData.url}
            onChange={(e) => handleOptionSelect('url', e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleNext} disabled={!formData.url}>
            Next
          </Button>
        </StepContainer>
      )}

      {currentStep === 2 && (
        <StepContainer>
          <Typography variant="h6" gutterBottom>
            Step 2: Select Pattern
          </Typography>
          <Grid container spacing={2}>
            {patterns.map((pattern) => (
              <Grid item xs={4} sm={3} key={pattern.id}>
                <OptionCard
                  selected={formData.pattern === pattern.id}
                  onClick={() => handleOptionSelect('pattern', pattern.id)}
                >
                  <CardContent>
                    <img src={pattern.image} alt={pattern.id} style={{ width: '100%' }} />
                  </CardContent>
                </OptionCard>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Button onClick={handleBack}>Back</Button>
            <Button variant="contained" onClick={handleNext} disabled={!formData.pattern}>
              Next
            </Button>
          </Box>
        </StepContainer>
      )}

      {/* Similar sections for eyes, frames, and colors */}

      {currentStep === 5 && (
        <StepContainer>
          <Typography variant="h6" gutterBottom>
            Preview and Download
          </Typography>
          {/* Add QR code preview */}
          <Button variant="contained" onClick={handleSubmit}>
            Generate QR Code
          </Button>
        </StepContainer>
      )}
    </Container>
  );
};

export default QRCodeGenerator;
