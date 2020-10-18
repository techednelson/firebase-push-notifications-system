import React, { useEffect, useState } from 'react';
import Dashboard from '../components/layout/Dashboard';
import Content from '../components/layout/Content';
import EnhancedTable from '../components/material-ui/EnhancedTable';
import { HeadCell } from './common/interfaces';
import axios from 'axios';
import { Notification } from './common/models/notification';
import { Typography } from '@material-ui/core';

const headCells: HeadCell[] = [
  { label: 'ID' },
  { label: 'Title' },
  { label: 'Message' },
  { label: 'Type' },
  { label: 'Topic' },
  { label: 'User' },
  { label: 'Created On' },
  { label: 'Status' },
];

const ListNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    axios.get('http://localhost:3000/fcm-notifications')
      .then(({ data }) => data && setNotifications(data))
      .catch((error) => console.log(error));
  }, []);
  
  return (
    <Dashboard>
      <Content>
        {notifications.length === 0 ? (
          <Typography color="textSecondary" align="center">
            No notifications for this project yet
          </Typography>
        ) : (
          <EnhancedTable rows={notifications} headCells={headCells} />
        )}
      </Content>
    </Dashboard>
  );
};

export default ListNotifications;
