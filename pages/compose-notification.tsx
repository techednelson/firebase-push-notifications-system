import React from 'react';
import Dashboard from '../components/layout/Dashboard';
import VerticalLinearStepper from '../components/stepper/VerticalLinearStepper';
import Paper from '@material-ui/core/Paper';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      maxWidth: 936,
      margin: 'auto',
      overflow: 'hidden',
    },
    contentWrapper: {
      margin: '40px 16px',
    },
  });

export interface ComposeNotificationProps extends WithStyles<typeof styles> {}

const ComposeNotification = (props: ComposeNotificationProps) => {
  const { classes } = props;
  return (
    <Dashboard>
      <Paper className={classes.paper}>
        <div className={classes.contentWrapper}>
           <VerticalLinearStepper />
        </div>
      </Paper>
    </Dashboard>
  );
};

export default withStyles(styles)(ComposeNotification);
