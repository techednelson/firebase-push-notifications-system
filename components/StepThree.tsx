import React, { useContext, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { StepperContext } from './context/StepperContext';
import { PayloadContext } from './context/PayloadContext';
import AssignmentIcon from '@material-ui/icons/Assignment';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { StepperStatus } from './common/enums';

const useStyles = makeStyles((theme: Theme) => createStyles({
   root: {
    maxWidth: '80%',
    backgroundColor: theme.palette.background.paper,
    margin: '30px 0'
  },
  title: {
    marginBottom: '20px'
  },
  subtitle: {
    marginBottom: '10px'
  },
  pos: {
    marginBottom: 12,
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
     marginRight: '14px'
  }
  
}));

const StepThree = () => {
  const classes = useStyles();
  const { stepper, setStepper } = useContext(StepperContext);
  const { payload, setPayload } = useContext(PayloadContext);
  
  const handleSubmit = () => {
  
  };
  
  useEffect(() => {
    if (stepper.status === StepperStatus.VALIDATING && stepper.activeStep === 2) {
      handleSubmit();
    }
  }, [stepper]);
  
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} align="center" variant="h6" component="h2">
          Review message
        </Typography>
        
         <Typography className={classes.subtitle} variant="subtitle1" component="h2">
           Notification content
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          <AssignmentIcon className={classes.icon}  /> {payload.body}
        </Typography>
        <hr/>
        
        <Typography className={classes.subtitle} variant="subtitle1" component="h2">
           Target
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          <TrackChangesIcon className={classes.icon}  /> {payload.type}
        </Typography>
        <hr/>
        
        <Typography className={classes.subtitle} variant="subtitle1" component="h2">
           Scheduling
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          <ScheduleIcon className={classes.icon} /> Send now
        </Typography>
      </CardContent>
    </Card>
  );
};
export default StepThree;
