import React, { createContext, useState } from 'react';
import { Payload } from '../common/models/Payload';

interface SingleContextProps {
  singlePayload: Payload;
  setSinglePayload: Function;
}

export const SingleContext = createContext<SingleContextProps>({
  singlePayload: new Payload(),
  setSinglePayload: () => {},
});

export const SingleContextProvider = (props: any) => {
  const [singlePayload, setSinglePayload] = useState<Payload>(new Payload());
  return (<SingleContext.Provider value={{ singlePayload, setSinglePayload }}>
      {props.children}
    </SingleContext.Provider>);
};
