import React, { useState } from 'react';
import clsx from 'clsx';
import {
  createStyles, lighten, makeStyles, Theme,
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
import FilterListIcon from '@material-ui/icons/FilterList';
import { Notification } from './common/models/Notification';
import { HeadCell } from './common/interfaces';
import { Subscriber } from './common/models/Subscriber';
import { NextRouter, useRouter } from 'next/router';
import ToggleOffIcon from '@material-ui/icons/ToggleOff';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';
import { axiosApiInstance } from '../pages/_app';

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

function getComparator<Key extends keyof any>(order: Order, orderBy: Key): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface EnhancedTableHeadProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Notification | keyof Subscriber) => void;
  // onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: HeadCell[]
}

const EnhancedTableHead = (props: EnhancedTableHeadProps) => {
  const { classes, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: keyof Notification | keyof Subscriber) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };
  
  return (<TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {/*<Checkbox*/}
          {/*  indeterminate={numSelected > 0 && numSelected < rowCount}*/}
          {/*  checked={rowCount > 0 && numSelected === rowCount}*/}
          {/*  onChange={onSelectAllClick}*/}
          {/*  inputProps={{ 'aria-label': 'select all notifications' }}*/}
          {/*/>*/}
        </TableCell>
        {props.headCells.map((headCell) => (<TableCell
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
                </span>) : null}
            </TableSortLabel>
          </TableCell>))}
      </TableRow>
    </TableHead>);
};

const useToolbarStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    paddingLeft: theme.spacing(2), paddingRight: theme.spacing(1),
  }, highlight: theme.palette.type === 'light' ? {
    color: theme.palette.secondary.main,
    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
  } : {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.secondary.dark,
  }, title: {
    flex: '1 1 100%',
  },
}));

interface EnhancedTableToolbarProps {
  numSelected: number;
  selected: number[];
  domain: string;
  router: NextRouter;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected, selected } = props;
  
  const deleteSelected = () => {
    try {
      selected.forEach(async id => await axiosApiInstance.delete(`fcm-${props.domain}/${id}`));
      props.router.reload();
    } catch (error) {
      console.log('There was issue deleting the selected elements', error);
    }
  };
  
  const toggleSubscription = () => {
    if (selected.length > 10) {
      return;
    }
    try {
      selected.forEach(async id => await axiosApiInstance.post(`fcm-${props.domain}/${id}`));
      props.router.reload();
    } catch (error) {
      console.log('There was issue deleting the selected elements', error);
    }
  };
  
  return (<Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (<Typography className={classes.title} color="inherit"
                                      variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>) : (
        <Typography className={classes.title} variant="h6" id="tableTitle"
                    component="div" />)}
      {numSelected > 0 ? (
        <React.Fragment>
          {props.domain === 'subscribers' ? (
            <IconButton aria-label="Toggle subscription" onClick={toggleSubscription}>
              <ToggleOffIcon />
            </IconButton>
          ) : null}
          <Tooltip title="Delete">
            <IconButton aria-label="delete" onClick={deleteSelected}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </React.Fragment>
      ) : (<Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>)}
    </Toolbar>);
};

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    width: '100%',
  }, paper: {
    width: '100%', marginBottom: theme.spacing(2),
  }, table: {
    minWidth: 750,
  }, visuallyHidden: {
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
}));

interface EnhancedTableProps {
  rows: any;
  headCells: HeadCell[];
}

const EnhancedTable = (props: EnhancedTableProps) => {
  const classes = useStyles();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Notification | keyof Subscriber>('id');
  const [selected, setSelected] = useState<number[]>([]);
  const [users, setUsers] = useState<{ id: number, token: string }[]>([]);
  const [subscriptions, setSubscriptions] = useState<{ topic: string, tokens: string[] }[]>([]);
  const [tokens, setTokens] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const router = useRouter();
  const [domain] = useState(
    router.pathname === '/list-notifications'
      ? 'notifications'
      : 'subscribers'
  );
  
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Notification | keyof Subscriber) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  const handleSelected = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];
    
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    
    setSelected(newSelected);
  };
  
  const handleNotificationsClick = (event: React.MouseEvent<unknown>, id: number) => {
    handleSelected(id);
  };
  
  const handleSubscribersClick = (
    event: React.MouseEvent<unknown>, id: number, token: any, topic: any
  ) => {
    handleSelected(id);
    
    const newUser = [...users];
    newUser.push({ id, token });
    setUsers(newUser);
    
    const newToken = [...tokens];
    newToken.push(token);
    setTokens(newToken);
    
    console.log(selected);
    
    // Object.keys(subscriptions).forEach(key => {
    //   console.log(key);
    // });
    
    // const newSubscription = [...subscriptions];
    // newSubscription.push({ topic, token });
    // setSubscriptions(newSubscription);
  };
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const isSelected = (id: number) => selected.indexOf(id) !== -1;
  
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.rows.length - page * rowsPerPage);
  
  const createRow = (row: any) => {
    return Object.keys(row).map((key, index) => {
      if (key === 'subscribed') {
        return <TableCell key={index}>{row[key] ? 'Yes' : 'No'}</TableCell>;
      }
      return <TableCell key={index}>{row[key]}</TableCell>;
    });
  };
  
  return (<div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          router={router}
          domain={domain}
        />
        <TableContainer>
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
              rowCount={props.rows.length}
              headCells={props.headCells}
            />
            <TableBody>
              {stableSort(props.rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(Number(row.id));
                  const labelId = `enhanced-table-checkbox-${index}`;
                  
                  return (<TableRow
                      hover
                      onClick={(event) => {
                        domain === 'notifications'
                          ? handleNotificationsClick(event, Number(row.id))
                          : handleSubscribersClick(event, Number(row.id), row.token, row.topic)
                      }}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      {createRow(row)}
                    </TableRow>);
                })}
              {emptyRows > 0 && (<TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>)}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={props.rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>);
};

export default EnhancedTable;
