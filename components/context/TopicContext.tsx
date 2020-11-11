import React, { createContext, useState } from 'react';
import { Payload } from '../common/models/Payload';

interface TopicContextProps {
  topicPayload: Payload;
  setTopicPayload: Function;
}

export const TopicContext = createContext<TopicContextProps>({
  topicPayload: new Payload(),
  setTopicPayload: () => {},
});

export const TopicContextProvider = (props: any) => {
  const [topicPayload, setTopicPayload] = useState<Payload>(new Payload());
  return (<TopicContext.Provider value={{ topicPayload, setTopicPayload }}>
      {props.children}
    </TopicContext.Provider>);
};
