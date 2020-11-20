import React, { useContext, useEffect, useState } from 'react';
import Dashboard from '../components/layout/Dashboard';
import Content from '../components/layout/Content';
import EnhancedTable from '../components/EnhancedTable';
import { Subscriber } from '../components/common/models/Subscriber';
import { HeadCell } from '../components/common/interfaces';
import { Typography } from '@material-ui/core';
import { SearchWordContext } from '../components/context/SearchWordContext';
import { axiosApiInstance } from './_app';

const headCells: HeadCell[] = [
  { id: 'id', label: 'ID' },
  { id: 'username', label: 'Username' },
  { id: 'token', label: 'Token' },
  { id: 'topic', label: 'Topic'},
  { id: 'subscribed', label: 'Subscribed' }
];

const ListSubscribers = () => {
  const { searchWord } = useContext(SearchWordContext);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subscribersBackup, setSubscribersBackup] = useState<Subscriber[]>([]);
  
  useEffect(() => {
    axiosApiInstance.get('fcm-subscribers')
      .then(({ data }) => {
        if (data) {
          setSubscribers(data);
          setSubscribersBackup(data);
        }
      })
      .catch((error) => console.log(error));
  }, []);
  
  useEffect(() => {
    let filtered: Subscriber[] = [];
    if (searchWord.length >= 3) {
      filtered = subscribers.filter(subscriber => {
        if (subscriber.username.includes(searchWord) || subscriber.topic.includes(searchWord)) {
          return subscriber;
        }
      });
    } else {
      filtered = subscribersBackup;
    }
    setSubscribers(filtered);
  }, [searchWord]);
  
  return (<Dashboard>
      <Content>
        {subscribers.length === 0 ? (
          <Typography color="textSecondary" align="center">
            No Subscribers for this project yet
          </Typography>) : (
          <EnhancedTable rows={subscribers} headCells={headCells} />)}
      </Content>
    </Dashboard>);
};

export default ListSubscribers;
