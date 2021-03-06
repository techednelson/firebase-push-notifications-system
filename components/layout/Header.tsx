import React, { useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import { axiosApiInstance } from '../../pages/_app';
import { UsernameContext } from '../context/UsernameContext';
import { useRouter } from 'next/router';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = (theme: Theme) =>
  createStyles({
    secondaryBar: {
      zIndex: 0,
    },
    menuButton: {
      marginLeft: -theme.spacing(1),
    },
    iconButtonAvatar: {
      padding: 4,
    },
    link: {
      textDecoration: 'none',
      color: lightColor,
      '&:hover': {
        color: theme.palette.common.white,
      },
    },
    button: {
      borderColor: lightColor,
    },
  });

interface HeaderProps extends WithStyles<typeof styles> {
  onDrawerToggle: () => void;
}

const Header = (props: HeaderProps) => {
  const { classes, onDrawerToggle } = props;
  const { username } = useContext(UsernameContext);
  const router = useRouter();

  const logout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    axiosApiInstance
      .post('auth/log-out', { username })
      .then(resp => router.push('/'))
      .catch(error => console.log(error));
  };

  return (
    <React.Fragment>
      <AppBar color="secondary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Hidden smUp>
              <Grid item>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={onDrawerToggle}
                  className={classes.menuButton}
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
            </Hidden>
            <Grid item xs />
            <Grid item>
              <IconButton
                onClick={e => logout(e)}
                color="inherit"
                className={classes.iconButtonAvatar}
              >
                <Avatar src="" alt="My Avatar" />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        className={classes.secondaryBar}
        color="secondary"
        position="static"
        elevation={0}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1">
                Cloud Messaging
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        className={classes.secondaryBar}
        color="secondary"
        position="static"
        elevation={0}
      >
        <Tabs value={0} textColor="inherit">
          <Tab textColor="inherit" label="Notifications" />
        </Tabs>
      </AppBar>
    </React.Fragment>
  );
};

export default withStyles(styles)(Header);
