import React, { useContext, useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { StepperStatus } from './common/enums';
import { StepperEvent } from './common/interfaces';
import { TopicContext } from './context/TopicContext';
import { StepperContext } from './context/StepperContext';
import { NotificationContext } from './context/NotificationContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      '& .MuiTextField-root': {
        margin: theme.spacing(2),
        width: '80%',
        display: 'flex',
        flexDirection: 'column',
      },
    },
  }),
);

const StepOne = () => {
  const classes = useStyles();
  const { stepper, setStepper } = useContext(StepperContext);
  const { notification, setNotification } = useContext(NotificationContext);
  const [title, setTitle] = useState<string>(notification.title);
  const [isTitleValid, setIsTitleValid] = useState<boolean>(true);
  const [titleHelperText, setTitleHelperText] = useState<string>('');
  const [body, setBody] = useState<string>(notification.body);
  const [isBodyValid, setIsBodyValid] = useState<boolean>(true);
  const [bodyHelperText, setBodyHelperText] = useState<string>('');

  const validateTitle = (valid: boolean) => {
    if (valid) {
      setIsTitleValid(true);
      setTitleHelperText('');
    } else {
      setTitleHelperText('Title value is required');
      setIsTitleValid(false);
    }
  };

  const validateBody = (valid: boolean) => {
    if (valid) {
      setIsBodyValid(true);
      setBodyHelperText('');
    } else {
      setIsBodyValid(false);
      setBodyHelperText('Message value is required');
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    if (input.value.length === 0) {
      if (input.id === 'title') {
        setTitle(input.value);
        validateTitle(false);
      } else {
        setBody(input.value);
        validateBody(false);
      }
    } else {
      if (input.id === 'title') {
        setTitle(input.value);
        validateTitle(true);
      } else {
        setBody(input.value);
        validateBody(true);
      }
    }
  };

  const handleSubmit = (): void => {
    if (title === '') {
      validateTitle(false);
    }
    if (body === '') {
      validateBody(false);
    }
    if (body !== '' && title !== '') {
      setNotification({ ...notification, title, body });
      setStepper((prevActiveStep: StepperEvent) => ({
        status: StepperStatus.VALID,
        activeStep: prevActiveStep.activeStep + 1,
      }));
    }
  };

  useEffect(() => {
    if (
      stepper.status === StepperStatus.VALIDATING &&
      stepper.activeStep === 0
    ) {
      handleSubmit();
    }
  }, [stepper]);

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField
        error={!isTitleValid}
        id="title"
        label="Title"
        helperText={titleHelperText}
        variant="outlined"
        onChange={handleInput}
        value={title}
      />
      <TextField
        id="message"
        error={!isBodyValid}
        helperText={bodyHelperText}
        label="Message"
        multiline
        rows={4}
        variant="outlined"
        onChange={handleInput}
        value={body}
      />
    </form>
  );
};
export default StepOne;
