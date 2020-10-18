import React, { useEffect, useState } from 'react';;
import axios from 'axios';
import Dashboard from '../components/layout/Dashboard';
import Content from '../components/layout/Content';
import EnhancedTable from '../components/material-ui/EnhancedTable';
import { Subscriber } from './common/models/subscriber';
import { HeadCell } from './common/interfaces';
import { Typography } from '@material-ui/core';

const headCells: HeadCell[] = [
  { label: 'ID' },
  { label: 'Username' },
  { label: 'Token' },
  { label: 'Topic' },
  { label: 'Subscribed' },
];

const ListSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  
  useEffect(() => {
    axios.get('http://localhost:3000/fcm-subscribers')
      .then(({ data }) => data && setSubscribers(data))
      .catch((error) => console.log(error));
  }, []);
  
  return (
    <Dashboard>
      <Content>
         {subscribers.length === 0 ? (
          <Typography color="textSecondary" align="center">
            No Subscribers for this project yet
          </Typography>
        ) : (
          <EnhancedTable rows={subscribers} headCells={headCells} />
        )}
      </Content>
    </Dashboard>
  );
};

export default ListSubscribers;
