import React, { createContext, useState } from 'react';
import { MulticastPayload } from '../common/models/MulticastPayload';

const INITIAL_STATE = {
  subscribers: [],
  tokens: [] ,
};

interface MulticastContextProps {
  multicast: MulticastPayload;
  setMulticast: Function;
}

export const MulticastContext = createContext<MulticastContextProps>({
  multicast: INITIAL_STATE,
  setMulticast: () => {},
});

export const MulticastContextProvider = (props: any) => {
  const [multicast, setMulticast] = useState<MulticastPayload>(INITIAL_STATE);
  return (<MulticastContext.Provider value={{ multicast, setMulticast }}>
      {props.children}
    </MulticastContext.Provider>);
};
