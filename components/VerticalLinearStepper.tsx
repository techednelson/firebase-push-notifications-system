import React, { useContext, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import StepOne from './StepOne';
import { StepperStatus } from './common/enums';
import { StepperEvent } from './common/interfaces';
import StepTwo from './StepTwo';
import { PayloadContext } from './context/PayloadContext';
import { StepperContext } from './context/StepperContext';
import StepThree from './StepThree';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    maxWidth: '80%',
  }, resetContainer: {
    padding: theme.spacing(3),
  }, button: {
    marginTop: theme.spacing(1), marginRight: theme.spacing(1),
  }, actionsContainer: {
    marginBottom: theme.spacing(2),
  },
}));

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
      return <StepThree />;
    default:
      return 'Unknown step';
  }
}

const VerticalLinearStepper = () => {
  const classes = useStyles();
  const { stepper, setStepper } = useContext(StepperContext);
  const { payload, setPayload } = useContext(PayloadContext);
  const steps = getSteps();
  
  const handleNext = () => {
    const { activeStep } = stepper;
    setStepper({ status: StepperStatus.VALIDATING, activeStep });
  };
  
  useEffect(() => {
    if (stepper.status === StepperStatus.VALID) {
      console.log(stepper);
      console.log(payload);
      setStepper((prevActiveStep: StepperEvent) => {
        const stepperStatus = {
          status: StepperStatus.INVALID,
          activeStep: prevActiveStep.activeStep
        };
        return prevActiveStep.type !== undefined
          ? { ...stepperStatus, type: prevActiveStep.type }
          : stepperStatus;
      });
    }
  }, [payload, stepper]);
  
  const handleBack = () => {
    setStepper((prevActiveStep: StepperEvent) => ({
      status: StepperStatus.INVALID, activeStep: prevActiveStep.activeStep - 1,
    }));
  };
  
  const handleReset = () => {
    setStepper({
      status: StepperStatus.INITIAL, activeStep: 0,
    });
  };
  
  return (<div className={classes.root}>
      <Stepper activeStep={stepper.activeStep} orientation="vertical">
        {steps.map((label, index) => (<Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography>{getStepContent(index)}</Typography>
              <div className={classes.actionsContainer}>
                <div>
                  {index !== 0 ? (<Button
                      onClick={handleBack}
                      type="submit"
                      className={classes.button}
                    >
                       Back
                    </Button>) : null}
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={classes.button}
                  >
                    {stepper.activeStep === 2 ? 'Publish' : 'Next'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>))}
      </Stepper>
      {stepper.activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>)}
    </div>);
};
export default VerticalLinearStepper;
