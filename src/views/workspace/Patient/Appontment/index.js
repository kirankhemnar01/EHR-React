import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Modal,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// import SelectProvider from './select-provider-form/select-provider';
import CreateAccount from './Patient-information/form1';
import PaymentChannels from '../../Components/payment-card-form3';
import MyForm from './apt-date-time-form/form2';
import PaymentConfirmation from '../../Components/payment-confirmation4';

const steps = ['Patient Information', 'Appointment', 'Make A Payment', 'Confirm Payment'];

function BookAppontment({ open, handleClose }) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    step1Data: {},
    step2Data: {},
    step3Data: {},
    step4Data: {},
  });

  console.log("formDataMain", formData);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepSubmit = (stepData) => {
    setFormData((prevData) => ({
      ...prevData,
      [`step${activeStep + 1}Data`]: stepData,
    }));
    handleNext();
  };

  const handleSubmitAll = () => {
    console.log('All form data:', formData);
    handleClose();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <CreateAccount onSubmit={handleStepSubmit} />;
      case 1:
        return <MyForm onSubmit={handleStepSubmit} formData={formData} />;
      case 2:
        return <PaymentChannels onSubmit={handleStepSubmit} handleBack={handleBack} formData={ formData } />;
      case 3:
        return <PaymentConfirmation onSubmit={handleStepSubmit}/>;
      default:
        return navigate('/home');
    }
  };


  return (
    <Modal open={open} onClose={handleClose}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1000,
        bgcolor: '#FDFAEE',
        boxShadow: 24,
        p: 4,
        borderRadius: '15px'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0} 
          onClick={handleBack}
          sx={{ mt: 0 }}
        >
          Back
        </Button>
        <Typography variant='subtitle1'>Care Group</Typography>
        <Button onClick={handleClose} sx={{color: 'black'}}>
          <CloseIcon/>
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb:2}}>
      <Typography variant='h5'>Schedule Your New Appointment</Typography>
      </Box>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box>
        {/* <Typography>{steps[activeStep]}</Typography> */}
        <div>
          {renderStepContent(activeStep)}
          {/* <Box sx={{display: "flex", alignContent: "center", justifyContent: "center"}}>
          <Button
            variant="contained"
            // color="primary"
            type='submit'
            style={{
              marginTop: "16px",
              backgroundColor: "#FFF04B",
              color: "black",
              marginBottom: "16px",
              height: "46px",
              width: "80px"
            }}
            onClick={
              activeStep === steps.length - 1 ? handleSubmitAll : handleNext
            }
            sx={{ mt: 2, ml: 2 }}
          >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
          </Box> */}
        </div>
      </Box>
    </Box>
  </Modal>
  );
}


export default BookAppontment;
