import React, { useContext, useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import CloudIcon from '@material-ui/icons/Cloud';
import GroupIcon from '@material-ui/icons/Group';
import { Subscriber } from './common/models/Subscriber';
import { NotificationType, StepperStatus } from './common/enums';
import { FormControl, ListItem } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { StepperContext } from './context/StepperContext';
import { TopicContext } from './context/TopicContext';
import { StepperEvent } from './common/interfaces';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { MulticastContext } from './context/MulticastContext';
import { SinglePayload } from './common/models/SinglePayload';
import { SingleContext } from './context/SingleContext';
import { NotificationContext } from './context/NotificationContext';
import { axiosApiInstance } from '../pages/_app';
import FormHelperText from '@material-ui/core/FormHelperText';
import { UsernamesCheckedContext } from './context/UsernamesCheckedContext';
import { UsernamesSelectedContext } from './context/UsernamesSelectedContext';
import { TargetContext } from './context/TargetContext';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    height: 170,
    maxWidth: '80%',
    backgroundColor: theme.palette.background.paper,
  },
  formControl: {
    margin: theme.spacing(1), width: '80%',
  },
  bottomNavigation: {
    marginBottom: '10px',
  },
  error: {
    color: '#f44336',
  }
}));

const StepTwo = () => {
  const classes = useStyles();
  const { stepper, setStepper } = useContext(StepperContext);
  const { notification } = useContext(NotificationContext);
  const { topicPayload, setTopicPayload } = useContext(TopicContext);
  const { singlePayload, setSinglePayload } = useContext(SingleContext);
  const { multicast, setMulticast } = useContext(MulticastContext);
  const { usernamesChecked, setUsernamesChecked } = useContext(UsernamesCheckedContext);
  const { usernamesSelected, setUsernamesSelected } =  useContext(UsernamesSelectedContext);
  const { target, setTarget } = useContext(TargetContext);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [tokens, setTokens] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [isTopicValid, setIsTopicValid] = useState<boolean>(true);
  const [isSingleValid, setIsSingleValid] = useState<boolean>(true);
  
  useEffect(() => {
    fetchTopics();
    fetchSubscribers();
  }, []);
  
  const handleSubmit = () => {
    let type: NotificationType;
     const { title, body } = notification;
     
     if (target === NotificationType.TOPIC && topicPayload.topic === '') {
       setIsTopicValid(false);
       return;
     }
     
     if (target === NotificationType.SINGLE && usernamesChecked.length === 0) {
       setIsSingleValid(false);
       return;
     }
     
    if (target === NotificationType.TOPIC) {
      type = target;
      setTopicPayload({
        ...topicPayload, title, body, type, username: 'All usernames'
      });
    } else {
      if (usernamesSelected.length === 1) {
        type = NotificationType.SINGLE;
        const { topic, username, token } = usernamesSelected[0];
        setSinglePayload({
          ...singlePayload, title, body, type, topic, username, token
        });
      } else {
        type = NotificationType.MULTICAST;
        setMulticast({
          ...multicast, subscribers: usernamesSelected, tokens
        });
      }
    }
    setStepper((prevActiveStep: StepperEvent) => ({
      status: StepperStatus.VALID,
      activeStep: prevActiveStep.activeStep + 1,
      type
    }));
  };
  
  useEffect(() => {
    if (stepper.status === StepperStatus.VALIDATING && stepper.activeStep === 1) {
      handleSubmit();
    }
  }, [stepper]);
  
  const fetchSubscribers = () => {
    axiosApiInstance.get('fcm-subscribers')
      .then(({ data }) => {
        if (data) {
          setSubscribers(data);
        }
      })
      .catch((error) => console.log(error));
  };
  
  const fetchTopics = () => {
    axiosApiInstance.get('fcm-subscribers/topics')
      .then(({ data }) => {
        if (data) {
          setTopics(data.topics);
        }
      })
      .catch((error) => console.log(error));
  };
  
  const handleToggle = (value: number, item: Subscriber) => () => {
    const currentIndexNewChecked = usernamesChecked.indexOf(value);
    const newChecked = [...usernamesChecked];
    
    let newSelected: SinglePayload[];
    
    const currentIndexToken = tokens.indexOf(item.token);
    const newTokens = [...tokens];
    
    if (currentIndexNewChecked === -1) {
      newChecked.push(value);
      newTokens.push(item.token);
      
      const newPayload = new SinglePayload();
      newPayload.title = notification.title;
      newPayload.body = notification.body;
      newPayload.topic = item.topic;
      newPayload.username = item.username;
      newPayload.token = item.token;
      
      newSelected = [...usernamesSelected];
      newSelected.push(newPayload);
    } else {
      newChecked.splice(currentIndexNewChecked, 1);
      newTokens.splice(currentIndexToken, 1);
      newSelected = usernamesSelected.filter(selected => selected.username !== item.username);
    }
    setUsernamesChecked(newChecked);
    setUsernamesSelected(newSelected);
    setTokens(newTokens);
  };
  
  const renderHeaderRow = (props: ListChildComponentProps) => {
    const { index, style } = props;
    return (
      <ListItem key={index} style={style} role={undefined}>
        <ListItemIcon />
        <ListItemText id="username" primary="Username" />
        <ListItemText id="token" primary="Topic" />
        <ListItemText id="subscribed" primary="Subscribed" />
      </ListItem>
    );
  };
  
  const renderRow = (props: ListChildComponentProps) => {
    const { index, style, data } = props;
    const labelId = `checkbox-list-label-${index}`;
    const item = data[index];
    return (
      <ListItem
        key={index}
        style={style}
        role={undefined}
        dense
        button
        onClick={handleToggle(index, item)}
      >
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={usernamesChecked.indexOf(index) !== -1}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemIcon>
        <ListItemText id={`username-${index}`} primary={`${item.username}`} />
        <ListItemText id={`topic-y${index}`} primary={`${item.topic}`} />
        <ListItemText id={`subscribed-${index}`} primary={`${item.subscribed}`} />
      </ListItem>
    );
  };
  
  const handleNavigationChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setTarget(newValue);
  };
  
  const handleTopicChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const topic = event.target.value as string;
    setTopicPayload({ ...topicPayload, topic });
    setIsTopicValid(true);
  };
  
  return (
    <React.Fragment>
      <BottomNavigation
        value={target}
        className={classes.bottomNavigation}
        onChange={handleNavigationChange}
      >
        <BottomNavigationAction
          label="Topics"
          value={NotificationType.TOPIC}
          icon={<CloudIcon />}
        />
        <BottomNavigationAction
          label="Users"
          value={NotificationType.SINGLE}
          icon={<GroupIcon />}
        />
      </BottomNavigation>
      {target === NotificationType.SINGLE ? (
        <React.Fragment>
          <FixedSizeList height={25} width={520} itemSize={1} itemCount={1}>
            {renderHeaderRow}
          </FixedSizeList>
          <div className={classes.root}>
            <FixedSizeList
              height={170}
              width={500}
              itemSize={25}
             itemCount={subscribers.length}
             itemData={subscribers}
            >
              {renderRow}
            </FixedSizeList>
          </div>
          {!isSingleValid? <FormHelperText className={classes.error}>Selecting at least one username is required</FormHelperText> : null}
        </React.Fragment>
      ) : (
        <FormControl
          variant="outlined"
          className={classes.formControl}
          error={target === NotificationType.TOPIC && !isTopicValid}
        >
          <InputLabel id="simple-select-outlined-label">Topics</InputLabel>
          <Select
            labelId="simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={topicPayload.topic}
            onChange={handleTopicChange}
            label="Topic"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {topics.length > 0 && topics.map((topic, index) => (
              <MenuItem key={index} value={topic}>
                {topic ? topic[0].toUpperCase() + topic.slice(1) : ''}
              </MenuItem>))}
          </Select>
          {!isTopicValid ? <FormHelperText>Selecting a topic is required</FormHelperText> : null}
        </FormControl>
      )}
    </React.Fragment>
  );
};
export default StepTwo;
