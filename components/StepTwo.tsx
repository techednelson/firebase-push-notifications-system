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
import { Payload } from './common/models/Payload';
import { SingleContext } from './context/SingleContext';
import { NotificationContext } from './context/NotificationContext';
import { axiosApiInstance } from '../pages/_app';

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
}));

const StepTwo = () => {
  const classes = useStyles();
  const { stepper, setStepper } = useContext(StepperContext);
  const { notification } = useContext(NotificationContext);
  const { topicPayload, setTopicPayload } = useContext(TopicContext);
  const { singlePayload, setSinglePayload } = useContext(SingleContext);
  const { multicast, setMulticast } = useContext(MulticastContext);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [selected, setSelected] = useState<Payload[]>([]);
  const [tokens, setTokens] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [topic, setTopic] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [checked, setChecked] = useState<number[]>([]);
  
  useEffect(() => fetchTopics(), []);
  
  const handleSubmit = () => {
    let notificationType: NotificationType;
     const { title, body } = notification;
    if (value === NotificationType.TOPIC) {
      notificationType = value;
      setTopicPayload({
        ...topicPayload, title, body, topic, type: value,
      });
    } else if (selected.length === 1) {
      notificationType = NotificationType.SINGLE;
      const { topic, username, token, type } = selected[0];
      setSinglePayload({
        ...singlePayload, title, body, type, topic, username, token
      });
    } else {
      notificationType = NotificationType.MULTICAST;
      setMulticast({
        ...multicast, subscribers: selected, tokens
      });
    }
    setStepper((prevActiveStep: StepperEvent) => ({
      status: StepperStatus.VALID,
      activeStep: prevActiveStep.activeStep + 1,
      type: notificationType
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
    axiosApiInstance.get('fcm-notifications/topics')
      .then(({ data }) => {
        if (data) {
          setTopics(data.topics);
        }
      })
      .catch((error) => console.log(error));
  };
  
  const handleToggle = (value: number, item: Subscriber) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    
    const newSelected = [...selected];
    
    const newPayload = new Payload();
    newPayload.title = notification.title;
    newPayload.body = notification.body;
    newPayload.type = NotificationType.MULTICAST;
    newPayload.topic = item.topic;
    newPayload.username = item.username;
    newPayload.token = item.token;
    
    newSelected.push(newPayload);
    setSelected(newSelected);
    
    const newTokens = [...tokens];
    newTokens.push(item.token);
    setTokens(newTokens);
  };
  
  const renderHeaderRow = (props: ListChildComponentProps) => {
    const { index, style } = props;
    return (<ListItem key={index} style={style} role={undefined}>
        <ListItemIcon />
        <ListItemText id="username" primary="Username" />
        <ListItemText id="token" primary="Topic" />
        <ListItemText id="subscribed" primary="Subscribed" />
      </ListItem>);
  };
  
  const renderRow = (props: ListChildComponentProps) => {
    const { index, style, data } = props;
    const labelId = `checkbox-list-label-${index}`;
    const item = data[index];
    return (<ListItem key={index} style={style} role={undefined} dense button
                      onClick={handleToggle(index, item)}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={checked.indexOf(index) !== -1}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemIcon>
        <ListItemText id={`username-${index}`} primary={`${item.username}`} />
        <ListItemText id={`topic-y${index}`} primary={`${item.topic}`} />
        <ListItemText id={`subscribed-${index}`}
                      primary={`${item.subscribed}`} />
      </ListItem>);
  };
  
  const handleNavigationChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    if (newValue === NotificationType.SINGLE && subscribers.length === 0) {
      fetchSubscribers();
    }
    setValue(newValue);
  };
  
  const handleTopicChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const topic = event.target.value as string;
    setTopic(topic);
  };
  
  return (<React.Fragment>
      <BottomNavigation value={value} className={classes.bottomNavigation}
                        onChange={handleNavigationChange}>
        <BottomNavigationAction label="Topics" value={NotificationType.TOPIC}
                                icon={<CloudIcon />} />
        <BottomNavigationAction label="Users" value={NotificationType.SINGLE}
                                icon={<GroupIcon />} />
      </BottomNavigation>
      {value === NotificationType.SINGLE ? (<React.Fragment>
          <FixedSizeList height={25} width={520} itemSize={1} itemCount={1}>
            {renderHeaderRow}
          </FixedSizeList>
          <div className={classes.root}>
            <FixedSizeList height={170} width={500} itemSize={25}
                           itemCount={subscribers.length}
                           itemData={subscribers}>
              {renderRow}
            </FixedSizeList>
          </div>
        </React.Fragment>) : (
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label">Topics</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={topic}
            onChange={handleTopicChange}
            label="Topic"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {topics && topics.map((topic, index) => (
              <MenuItem key={index} value={topic}>
                {topic[0].toUpperCase() + topic.slice(1)}
              </MenuItem>))}
          </Select>
        </FormControl>)}
    </React.Fragment>);
};
export default StepTwo;
