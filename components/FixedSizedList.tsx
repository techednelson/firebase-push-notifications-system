import React, { useState } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ListItem } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { Subscriber } from './common/models/subscriber';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 170,
      maxWidth: '80%',
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

interface FixedListProps {
  data: Subscriber[];
}

const FixedSizedList = (props: FixedListProps) => {
  const classes = useStyles();
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
        <ListItemText id={ `username-${index}`} primary={`${item.username}`} />
        <ListItemText id={ `topic-y${index}`} primary={`${item.topic}`} />
        <ListItemText id={ `subscribed-${index}`} primary={`${item.subscribed}`} />
      </ListItem>
    );
  };
  
  return (
    <React.Fragment>
      <FixedSizeList height={25} width={520} itemSize={1} itemCount={1}>
        {renderHeaderRow}
      </FixedSizeList>
      <div className={classes.root}>
        <FixedSizeList height={170} width={500} itemSize={25} itemCount={props.data.length} itemData={props.data}>
          {renderRow}
        </FixedSizeList>
      </div>
    </React.Fragment>
  );
};
export default FixedSizedList;
