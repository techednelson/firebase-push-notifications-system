import React from 'react';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
  }),
);

interface ActionsProps {
  isBackBtn: boolean;
}

const ActionsContainer = (props: ActionsProps) => {
  const classes = useStyles();
  return (
    <div className={classes.actionsContainer}>
      <div>
        {props.isBackBtn ? (
          <Button
            type="submit"
            className={classes.button}
          >
            Back
          </Button>
        ) : null}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          className={classes.button}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
export default ActionsContainer;
