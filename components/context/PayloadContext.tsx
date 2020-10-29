import React, { createContext, useState } from 'react';
import { Payload } from '../common/models/payload';

interface PayloadContextProps {
  payload: Payload;
  setPayload: Function;
}

export const PayloadContext = createContext<PayloadContextProps>({
  payload: new Payload(),
  setPayload: () => {},
});

export const PayloadContextProvider = (props: any) => {
  const [payload, setPayload] = useState<Payload>(new Payload());
  return (<PayloadContext.Provider value={{ payload, setPayload }}>
      {props.children}
    </PayloadContext.Provider>);
};
