import React, { createContext, useState } from 'react';
import { TopicPayload } from '../common/models/TopicPayload';

interface TopicContextProps {
  topicPayload: TopicPayload;
  setTopicPayload: Function;
}

export const TopicContext = createContext<TopicContextProps>({
  topicPayload: new TopicPayload(),
  setTopicPayload: () => {},
});

export const TopicContextProvider = (props: any) => {
  const [topicPayload, setTopicPayload] = useState<TopicPayload>(new TopicPayload());
  return (
    <TopicContext.Provider value={{ topicPayload, setTopicPayload }}>
      {props.children}
    </TopicContext.Provider>
  );
};
