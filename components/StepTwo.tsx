import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import CloudIcon from '@material-ui/icons/Cloud';
import GroupIcon from '@material-ui/icons/Group';
import ActionsContainer from './ActionsContainer';
import axios from 'axios';
import { Subscriber } from './common/models/subscriber';
import FixedSizedList from './FixedSizedList';
import { NotificationType } from './common/enums';
import { FormControl } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      width: '80%'
    },
    bottomNavigation: {
      marginBottom: '10px'
    }
  }),
);

const StepTwo = () => {
  const classes = useStyles();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [topic, setTopic] = useState<string>('');
  const [value, setValue] = useState<string>(NotificationType.TOPIC);
  
  useEffect(() => fetchTopics(), []);
  
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
  
  const handleNavigationChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    if (newValue === NotificationType.SINGLE && subscribers.length === 0) {
      fetchSubscribers();
    }
    setValue(newValue);
  };
  
   const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTopic(event.target.value as string);
  };
  
 return (
    <React.Fragment>
      <BottomNavigation value={value} className={classes.bottomNavigation} onChange={handleNavigationChange}>
        <BottomNavigationAction label="Topics" value={NotificationType.TOPIC} icon={<CloudIcon />} />
        <BottomNavigationAction label="Users" value={NotificationType.SINGLE} icon={<GroupIcon />} />
      </BottomNavigation>
      {value === NotificationType.SINGLE ? (
         <FixedSizedList data={subscribers} />
      ) : (
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label">Topics</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={topic}
            onChange={handleSelectChange}
            label="Topic"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {topics && topics.map((topic, index) => {
              return (
                <MenuItem key={index} value={topic}>
                  {topic[0].toUpperCase() + topic.slice(1)}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}
      <ActionsContainer isBackBtn={true} />
    </React.Fragment>
  );
};
export default StepTwo;
