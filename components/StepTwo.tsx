import React, { useContext, useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import CloudIcon from '@material-ui/icons/Cloud';
import GroupIcon from '@material-ui/icons/Group';
import axios from 'axios';
import { Subscriber } from './common/models/subscriber';
import { NotificationType, StepperStatus } from './common/enums';
import { FormControl, ListItem } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { StepperContext } from './context/StepperContext';
import { PayloadContext } from './context/PayloadContext';
import { StepperEvent } from './common/interfaces';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { MulticastContext } from './context/MulticastContext';

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
  const { payload, setPayload } = useContext(PayloadContext);
  const { multicast, setMulticast } = useContext(MulticastContext);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [selected, setSelected] = useState<Subscriber[]>([]);
  const [tokens, setTokens] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [topic, setTopic] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [checked, setChecked] = useState<number[]>([]);
  
  useEffect(() => fetchTopics(), []);
  
  const handleSubmit = () => {
    let type: NotificationType;
    if (value === NotificationType.TOPIC) {
      type = value;
      setPayload({
        ...payload, topic, type: NotificationType.TOPIC,
      });
    } else if (selected.length === 1) {
      type = NotificationType.SINGLE;
      const { topic, username } = selected[0];
      setPayload({
        ...payload, type: NotificationType.SINGLE, topic, username
      });
    } else {
      type = NotificationType.MULTICAST;
      setMulticast({
        ...multicast, subscribers: selected, tokens
      });
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
    axios.get('http://localhost:3000/fcm-subscribers')
      .then(({ data }) => {
        if (data) {
          setSubscribers(data);
        }
      })
      .catch((error) => console.log(error));
  };
  
  const fetchTopics = () => {
    axios.get('http://localhost:3000/fcm-notifications/topics')
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
    newSelected.push(item);
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
