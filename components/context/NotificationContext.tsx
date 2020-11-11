import React, { createContext, useState } from 'react';
import { Message } from '../common/models/Message';

interface NotificationContextProps {
  notification: Message;
  setNotification: Function;
}

export const NotificationContext = createContext<NotificationContextProps>({
  notification: new Message(),
  setNotification: () => {},
});

export const NotificationContextProvider = (props: any) => {
  const [notification, setNotification] = useState<Message>(new Message());
  return (<NotificationContext.Provider value={{ notification, setNotification }}>
      {props.children}
    </NotificationContext.Provider>);
};
