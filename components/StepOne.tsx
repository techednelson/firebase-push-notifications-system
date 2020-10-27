import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { stepperService } from './services/stepper-service';
import { StepperStatus } from './common/enums';
import ActionsContainer from './ActionsContainer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      '& .MuiTextField-root': {
        margin: theme.spacing(2),
        width: '80%',
        display: 'flex',
        flexDirection: 'column'
      },
    },
  }),
);

const StepOne = () => {
  const classes = useStyles();
  const [title, setTitle] = useState<string>('');
  const [isTitleValid, setIsTitleValid] = useState<boolean>(true);
  const [titleHelperText, setTitleHelperText] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [isBodyValid, setIsBodyValid] = useState<boolean>(true);
  const [bodyHelperText, setBodyHelperText] = useState<string>('');
  
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    input.value.length === 0 ? invalidInput(input.id) : validInput(input);
  };
  
  const validInput = (input: HTMLInputElement) => {
     if (input.id === 'title')  {
      setTitle(input.value)
      setIsTitleValid(true);
      setTitleHelperText('');
      return;
    }
    setBody(input.value);
    setIsBodyValid(true);
    setBodyHelperText('');
  };
  
  const invalidInput = (input: string) => {
    if (input === 'title') {
      setTitleHelperText('Title value is required')
      setIsTitleValid(false);
      return;
    }
    setBodyHelperText('Message value is required');
    setIsBodyValid(false);
  };
  
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (title === '') {
      invalidInput('title');
    }
    if (body === '') {
      invalidInput('message');
    }
    if (body !== '' && title !== '') {
      stepperService.sendMessage({
        status: StepperStatus.VALID,
        step: 0,
        payload: { title, body }
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={classes.root} noValidate autoComplete="off">
      <TextField
        error={!isTitleValid}
        id="title"
        label="Title"
        helperText={titleHelperText}
        variant="outlined"
        onChange={handleInput}
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
      />
      <ActionsContainer isBackBtn={false} />
    </form>
 );
};
export default StepOne;
