import React, { useState } from 'react';
import { Modal, Button } from '@mui/material';

const UserTutorial = ({ onClose }) => {
    const [step, setStep] = useState(0);

    const steps = [
        {
            title: "Welcome to NFSEEK!",
            content: "Let's get started by creating your first profile.",
        },
        {
            title: "Create New Profile",
            content: "Click on 'Create New Profile' on the dashboard.",
        },
        {
            title: "Attach QR Code",
            content: "After creating your profile, go to the My QR page to attach a QR code.",
        },
        {
            title: "You're All Set!",
            content: "Now you can share your profile with others!",
        },
    ];

    const nextStep = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onClose(); // Close tutorial when finished
        }
    };

    return (
        <Modal open={true} onClose={onClose}>
            <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
                <h2>{steps[step].title}</h2>
                <p>{steps[step].content}</p>
                <Button variant="contained" onClick={nextStep}>
                    {step < steps.length - 1 ? 'Next' : 'Finish'}
                </Button>
            </div>
        </Modal>
    );
};

export default UserTutorial; 