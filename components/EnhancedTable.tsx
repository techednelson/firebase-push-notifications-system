import React, { useState } from 'react';
import clsx from 'clsx';
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
  withStyles,
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import { Notification } from './common/models/Notification';
import { HeadCell } from './common/interfaces';
import { Subscriber } from './common/models/Subscriber';
import { NextRouter, useRouter } from 'next/router';
import Switch from '@material-ui/core/Switch';
import { axiosApiInstance } from '../pages/_app';
import { Grid } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from "@material-ui/core/Button";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

interface EnhancedTableHeadProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Notification | keyof Subscriber,
  ) => void;
  domain: string;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: HeadCell[];
}

const EnhancedTableHead = (props: EnhancedTableHeadProps) => {
  const {
    classes,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    domain,
  } = props;
  const createSortHandler = (
    property: keyof Notification | keyof Subscriber,
  ) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {domain === 'notifications' ? (
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              inputProps={{ 'aria-label': 'select all notifications' }}
            />
          ) : null}
        </TableCell>
        {props.headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
    },
    limitExceed: {
      color: 'red',
      flex: '1 1 100%',
    },
  }),
);

interface EnhancedTableToolbarProps {
  numSelected: number;
  selected: number[];
  domain: string;
  setOpen: (isOpen: boolean) => void;
  setIsProgress: (isProgress: boolean) => void;
  setModalMessage: (message: string) => void;
  fetchFunction: () => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected, selected, domain, setOpen, setIsProgress, setModalMessage, fetchFunction } = props;

  const deleteSelected = async () => {
    if (selected.length > 25) {
      return;
    }
    try {
      setIsProgress(true);
      const resp = await axiosApiInstance.post(`fcm-notifications/delete`, selected);
      if (resp.status === 200) {
        setIsProgress(false);
        fetchFunction();
      }
    } catch (error) {
      setIsProgress(false);
      setModalMessage(error.message);
      setOpen(true);
    }
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0 && domain === 'notifications',
      })}
    >
      {numSelected > 0 && numSelected <= 2 && domain === 'notifications' ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : numSelected > 25 && domain === 'notifications' ? (
        <Typography
          className={classes.limitExceed}
          variant="subtitle1"
          id="selected-limit-exceed"
          component="div"
        >
          {`You can select 25 notifications maximum each time`}
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        />
      )}
      {numSelected > 0 ? (
        <React.Fragment>
          {domain === 'notifications' ? (
            <Tooltip title="Delete">
              <IconButton aria-label="delete" onClick={deleteSelected}>
                {selected.length <= 2 ? <DeleteIcon /> : null}
              </IconButton>
            </Tooltip>
          ) : null}
        </React.Fragment>
      ) : null}
    </Toolbar>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    modal: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid red',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      textAlign: 'center',
    },
    modalTitle: {
      margin: 'auto',
    },
    closeModal: {
      float: 'right',
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
    truncate: {
      maxWidth: 56.8,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  }),
);

const AntSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 28,
      height: 16,
      padding: 0,
      display: 'flex',
    },
    switchBase: {
      padding: 2,
      color: theme.palette.grey[500],
      '&$checked': {
        transform: 'translateX(12px)',
        color: theme.palette.common.white,
        '& + $track': {
          opacity: 1,
          backgroundColor: theme.palette.secondary.main,
          borderColor: theme.palette.secondary.main,
        },
      },
    },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: 'none',
    },
    track: {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: theme.palette.common.white,
    },
    checked: {},
  }),
)(Switch);

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

interface EnhancedTableProps {
  rows: any;
  headCells: HeadCell[];
  fetchFunction: () => void
}

const EnhancedTable = (props: EnhancedTableProps) => {
  const { rows, headCells, fetchFunction } = props;
  const classes = useStyles();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Notification | keyof Subscriber>(
    'id',
  );
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [isProgress, setIsProgress] = useState(false);
  const router = useRouter();
  const [domain] = useState(
    router.pathname === '/list-notifications' ? 'notifications' : 'subscribers',
  );
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>('');

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Notification | keyof Subscriber,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleNotificationsClick = (
    event: React.MouseEvent<unknown>,
    id: number,
  ) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, props.rows.length - page * rowsPerPage);

  const toggleSubscription = async (
    event: React.ChangeEvent<unknown>,
    username: string,
    token: string,
    topic: string,
    subscribed: boolean,
  ) => {
    event.preventDefault();
    setIsProgress(true);
    const subscriber = new Subscriber();
    subscriber.username = username;
    subscriber.token = token;
    subscriber.topic = topic;
    subscriber.subscribed = !subscribed;
    await axiosApiInstance
      .post(`fcm/admin-toggle-subscription`, subscriber)
      .then(resp => {
        setIsProgress(false);
        if (resp.status === 200) {
          fetchFunction();
        }
      })
      .catch((error: Error) => {
        setIsProgress(false);
        setModalMessage(error.message);
        setOpen(true);
      });
  };

  const createRow = (row: any) => {
    return Object.keys(row).map((key, index) => {
      if (key === 'subscribed') {
        return (
          <TableCell key={index}>
            <Typography component="div">
              <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>Off</Grid>
                <Grid item>
                  <AntSwitch
                    checked={row[key]}
                    onChange={e =>
                      toggleSubscription(
                        e,
                        row.username,
                        row.token,
                        row.topic,
                        row.subscribed,
                      )
                    }
                    name="switch"
                  />
                </Grid>
                <Grid item>On</Grid>
              </Grid>
            </Typography>
          </TableCell>
        );
      }
      if (key === 'token') {
        return (
          <TableCell className={classes.truncate} key={index}>
            {row[key]}
          </TableCell>
        );
      }
      return <TableCell key={index}>{row[key]}</TableCell>;
    });
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          domain={domain}
          setOpen={setOpen}
          setIsProgress={setIsProgress}
          setModalMessage={setModalMessage}
          fetchFunction={fetchFunction}
        />
        <TableContainer>
          {isProgress ? <LinearProgress color="secondary" /> : null}
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={headCells}
              domain={domain}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(Number(row.id));
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={event =>
                        handleNotificationsClick(event, Number(row.id))
                      }
                      role="button"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        {domain === 'notifications' ? (
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        ) : null}
                      </TableCell>
                      {createRow(row)}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <Modal
        open={open}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.modal}>
          <h2 className={classes.modalTitle} id="simple-modal-title">Oops!</h2>
          <p id="simple-modal-description">
            {modalMessage}
          </p>
          <Button color="primary" className={classes.closeModal} autoFocus onClick={() => setOpen(false)} >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default EnhancedTable;
