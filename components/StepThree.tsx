import React, { useContext, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { StepperContext } from './context/StepperContext';
import { TopicContext } from './context/TopicContext';
import AssignmentIcon from '@material-ui/icons/Assignment';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { NotificationType, StepperStatus } from './common/enums';
import { MulticastContext } from './context/MulticastContext';
import { SingleContext } from './context/SingleContext';
import { NotificationContext } from './context/NotificationContext';
import { axiosApiInstance } from '../pages/_app';
import { router } from 'next/client';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: '80%',
      backgroundColor: theme.palette.background.paper,
      margin: '30px 0',
    },
    title: {
      marginBottom: '20px',
    },
    subtitle: {
      marginBottom: '10px',
    },
    pos: {
      marginBottom: 12,
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
    },
    icon: {
      marginRight: '14px',
    },
  }),
);

const StepThree = () => {
  const classes = useStyles();
  const { stepper } = useContext(StepperContext);
  const { notification } = useContext(NotificationContext);
  const { topicPayload } = useContext(TopicContext);
  const { singlePayload } = useContext(SingleContext);
  const { multicast } = useContext(MulticastContext);

  const handleSubmit = (type: NotificationType) => {
    let url;
    let body;
    switch (type) {
      case NotificationType.SINGLE:
        url = 'fcm/token';
        body = singlePayload;
        break;
      case NotificationType.MULTICAST:
        url = 'fcm/multicast';
        body = multicast;
        break;
      case NotificationType.TOPIC:
        url = 'fcm/topic';
        body = topicPayload;
        break;
    }
    axiosApiInstance
      .post(url, body)
      .then(response => {
        console.log(response);
        router.push('list-notifications').then();
      })
      .catch(error => console.log(error));
  };

  useEffect(() => {
    if (
      stepper.status === StepperStatus.VALIDATING &&
      stepper.activeStep === 2 &&
      stepper.type
    ) {
      handleSubmit(stepper.type);
    }
  }, [stepper]);

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography
          className={classes.title}
          align="center"
          variant="h6"
          component="h2"
        >
          Review message
        </Typography>

        <Typography
          className={classes.subtitle}
          variant="subtitle1"
          component="h2"
        >
          Notification content
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          <AssignmentIcon className={classes.icon} /> {notification.body}
        </Typography>
        <hr />

        <Typography
          className={classes.subtitle}
          variant="subtitle1"
          component="h2"
        >
          Target
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          <TrackChangesIcon className={classes.icon} /> {topicPayload.type}
        </Typography>
        <hr />

        <Typography
          className={classes.subtitle}
          variant="subtitle1"
          component="h2"
        >
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
