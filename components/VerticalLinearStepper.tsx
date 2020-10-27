import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import StepOne from './StepOne';
import { stepperService } from './services/stepper-service';
import { StepperStatus } from './common/enums';
import { Payload } from './common/models/payload';
import { StepperMessage } from './common/interfaces';
import StepTwo from './StepTwo';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: '80%'
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  }),
);

function getSteps() {
  return ['Notification', 'Target', 'Send now'];
}

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return <StepOne />;
    case 1:
      return <StepTwo />;
    case 2:
      return `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`;
    default:
      return 'Unknown step';
  }
}

const VerticalLinearStepper = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [payload, setPayload] = useState<Payload>(new Payload());
  const steps = getSteps();
  
  useEffect(() => {
    const subscription$ = handleNext();
    return () => subscription$.unsubscribe();
  }, []);
  
  const handleNext = () => {
    return stepperService.getMessage().subscribe((message: StepperMessage) => {
      if (message.status === StepperStatus.VALID) {
        const { title, body } = message.payload;
        setPayload({ ...payload, title, body });
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    })
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleReset = () => {
    setActiveStep(0);
  };
  
  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography>{getStepContent(index)}</Typography>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
};
export default VerticalLinearStepper;
