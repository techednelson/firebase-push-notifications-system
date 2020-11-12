import React, { ChangeEvent, FormEvent, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Copyright from './layout/Copyright';
import axios from 'axios';
import { useRouter } from 'next/router';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { LocalStorage } from './common/enums';
export type Color = 'success' | 'info' | 'warning' | 'error';

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }, avatar: {
    margin: theme.spacing(1), backgroundColor: theme.palette.secondary.main,
  }, form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  }, submit: {
    margin: theme.spacing(3, 0, 2),
  },
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

interface LoginProps {
  isLogin: boolean;
}

interface Errors {
  username: string;
  password: string;
  confirmPassword?: string;
}

interface Snackbar {
  severity: Color;
  body: string;
}

const success: Snackbar = {
  severity: 'success',
  body: 'Sign up was successful please login with your new username & password'
};

const error: Snackbar = {
  severity: 'error',
  body: 'Sign up was unsuccessful please try again'
};

const Login = (props: LoginProps) => {
  const classes = useStyles();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbar, setSnackbar] = useState<Snackbar>(success);
  const router = useRouter();
  
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { value, id } } = event;
    let helperText = '';
    if (value.length < 8 || value.length > 20) {
      helperText = 'must be longer than 8 and at most 20 characters';
    }
    switch (id) {
      case 'username':
        setUsername(value)
        helperText === ''
          ? setErrors({ ...errors, username: '' })
          : setErrors({ ...errors, username: `Username ${helperText}` });
        break;
      case 'password':
        setPassword(value);
        const reg = new RegExp(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/).test(value);
        if (helperText !== '') {
           setErrors({ ...errors, password:  `Password ${helperText}` });
        } else if (!reg) {
          setErrors({ ...errors, password: 'Password too weak' });
        } else {
          setErrors({ ...errors, password: '' });
        }
        break;
      case 'confirm-password':
        setConfirmPassword(value);
        if (helperText !== '') {
           setErrors({ ...errors, confirmPassword: `Password ${helperText}` });
        } else if (password !== value) {
          setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
        } else {
          setErrors({ ...errors, confirmPassword: '' });
        }
        break;
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let isValidForm = true;
    const errors = { username: '', password: '', confirmPassword: ''};
    if (username === '') {
      errors.username = 'Username is required';
      isValidForm = false;
    }
     if (password === '') {
      errors.password = 'Password is required';
      isValidForm = false;
    }
    if (!props.isLogin && confirmPassword === '') {
      errors.confirmPassword = 'Confirm Password is required';
      isValidForm = false;
    }
    if (!isValidForm) {
      setErrors(errors);
      return;
    }
    const domain = props.isLogin ? 'login' : 'signup';
    const data = props.isLogin
      ? { username, password }
      : { username, password, confirmPassword };
    try {
      const response = await axios.post(`auth/${domain}`, data);
      if (response.data && response.status === 200) {
        // localStorage.setItem(LocalStorage.FCM_TOKEN, response.data.accessToken);
        // localStorage.setItem(LocalStorage.FCM_REFRESH_TOKEN, response.data.refreshToken);
        // localStorage.setItem(LocalStorage.FCM_USERNAME, username);
        await router.push('/list-notifications');
      } else if (response.status === 201 && domain === 'signup') {
        setSnackbar(success);
        setOpenSnackbar(true);
        setTimeout(async () => {
          await router.push('/sign-in');
        }, 3000);
      }
    } catch (e) {
      if (domain === 'signup') {
        setSnackbar(error);
        setOpenSnackbar(true);
      }
      console.log(e);
    }
  };
  
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  
  return (<Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" align="center">
          Firebase Cloud Messaging Admin
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            onChange={handleChange}
            error={Boolean(errors?.username)}
            helperText={errors?.username}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
            error={Boolean(errors?.password)}
            helperText={errors?.password}
          />
          {!props.isLogin ? (
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirm-password"
              autoComplete="current-password"
              onChange={handleChange}
              error={Boolean(errors?.confirmPassword)}
              helperText={errors?.confirmPassword}
            />
          ) : null}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {props.isLogin ? 'Sign In' : 'Sign up'}
          </Button>
          <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={snackbar.severity}>
              {snackbar.body}
            </Alert>
          </Snackbar>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>);
};

export default Login;
