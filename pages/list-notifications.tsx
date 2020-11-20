import React, { useContext, useEffect, useState } from 'react';
import Dashboard from '../components/layout/Dashboard';
import Content from '../components/layout/Content';
import EnhancedTable from '../components/EnhancedTable';
import { HeadCell } from '../components/common/interfaces';
import { Notification } from '../components/common/models/Notification';
import { Typography } from '@material-ui/core';
import { SearchWordContext } from '../components/context/SearchWordContext';
import { axiosApiInstance } from './_app';

const headCells: HeadCell[] = [
  { id: 'id', label: 'ID' },
  { id: 'title', label: 'Title', },
  { id: 'body', label: 'Message' },
  { id: 'type', label: 'Type', },
  { id: 'topic', label: 'Topic' },
  { id: 'username', label: 'Username' },
  { id: 'createdOn', label: 'Created On' },
  { id: 'status', label: 'Status'}
];

const ListNotifications = () => {
  const { searchWord } = useContext(SearchWordContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsBackup, setNotificationsBackup] = useState<Notification[]>([]);
  
  useEffect(() => {
    axiosApiInstance.get('fcm-notifications')
      .then(({ data }) => {
        if (data) {
          setNotifications(data);
          setNotificationsBackup(data);
        }
      })
      .catch((error) => console.log(error));
  }, []);
  
  useEffect(() => {
    let filtered: Notification[] = [];
    if (searchWord.length >= 3) {
      filtered = notifications.filter(notification => {
        if (notification.username.includes(searchWord) || notification.title.includes(searchWord) || notification.topic.includes(searchWord) || notification.body.includes(searchWord)) {
          return notification;
        }
      });
    } else {
      filtered = notificationsBackup;
    }
    setNotifications(filtered);
  }, [searchWord]);
  
  return (
    <Dashboard>
      <Content>
        {notifications.length === 0 ? (
          <Typography color="textSecondary" align="center">
            No notifications for this project yet
          </Typography>) : (
          <EnhancedTable rows={notifications} headCells={headCells} />)}
      </Content>
    </Dashboard>
  );
};

export default ListNotifications;
