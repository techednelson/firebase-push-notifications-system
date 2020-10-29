import React, { useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import {
  createStyles, Theme, withStyles, WithStyles,
} from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import Link from 'next/link';
import Router from 'next/router';
import { SearchWordContext } from '../context/SearchWordContext';

const styles = (theme: Theme) => createStyles({
  paper: {
    maxWidth: 936, margin: 'auto', overflow: 'hidden',
  }, searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  }, searchInput: {
    fontSize: theme.typography.fontSize,
  }, block: {
    display: 'block',
  }, addNotification: {
    marginRight: theme.spacing(1),
  }, contentWrapper: {
    margin: '40px 16px',
  },
});

export interface ContentProps extends WithStyles<typeof styles> {
  children: any;
}

const Content = (props: ContentProps) => {
  const { classes } = props;
  const { setSearchWord } = useContext(SearchWordContext);
  
  return (<Paper className={classes.paper}>
      <AppBar
        className={classes.searchBar}
        position="static"
        color="default"
        elevation={0}
      >
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <SearchIcon className={classes.block} color="inherit" />
            </Grid>
            <Grid item xs>
              <TextField
                onChange={(e) => setSearchWord(e.target.value)}
                fullWidth
                placeholder="Search by username, topic, title or message"
                InputProps={{
                  disableUnderline: true, className: classes.searchInput,
                }}
              />
            </Grid>
            <Grid item>
              <Link href="/compose-notification">
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.addNotification}
                >
                  New notification
                </Button>
              </Link>
              <Tooltip title="Reload">
                <IconButton onClick={() => Router.reload()}>
                  <RefreshIcon className={classes.block} color="inherit" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className={classes.contentWrapper}>
        {props.children}
      </div>
    </Paper>);
};

export default withStyles(styles)(Content);
