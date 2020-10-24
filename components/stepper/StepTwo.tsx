import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import CloudIcon from '@material-ui/icons/Cloud';
import GroupIcon from '@material-ui/icons/Group';
import { ListItem } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import ActionsContainer from '../ActionsContainer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: 400,
      maxWidth: 300,
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

const StepTwo = () => {
  const classes = useStyles();
  const [value, setValue] = useState<string>('users');
  const [checked, setChecked] = useState<number[]>([0]);
  
  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
  
   setChecked(newChecked);
  };
  
  const renderRow = (props: ListChildComponentProps) => {
    const { index, style } = props;
    const labelId = `checkbox-list-label-${value}`;
    return (
      <ListItem key={index} style={style} role={undefined} dense button onClick={handleToggle(index)}>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={checked.indexOf(index) !== -1}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemIcon>
        <ListItemText id={ `checkbox-list-secondary-label-${index}`} primary={`Line item ${index + 1}`} />
      </ListItem>
    );
  }

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
  };

   return (
    <>
      <BottomNavigation value={value} onChange={handleChange} className={classes.root}>
        <BottomNavigationAction label="Users" value="users" icon={<GroupIcon />} />
        <BottomNavigationAction label="Topics" value="topics" icon={<CloudIcon />} />
      </BottomNavigation>
      <div className={classes.root}>
        <FixedSizeList height={400} width={300} itemSize={46} itemCount={200}>
          {renderRow}
        </FixedSizeList>
      </div>
      <ActionsContainer />
    </>
  );
};
export default StepTwo;