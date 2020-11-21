import React, { createContext, useState } from 'react';
import { SinglePayload } from '../common/models/SinglePayload';

interface SingleContextProps {
  singlePayload: SinglePayload;
  setSinglePayload: Function;
}

export const SingleContext = createContext<SingleContextProps>({
  singlePayload: new SinglePayload(),
  setSinglePayload: () => {},
});

export const SingleContextProvider = (props: any) => {
  const [singlePayload, setSinglePayload] = useState<SinglePayload>(new SinglePayload());
  return (
    <SingleContext.Provider value={{ singlePayload, setSinglePayload }}>
      {props.children}
    </SingleContext.Provider>
  );
};
