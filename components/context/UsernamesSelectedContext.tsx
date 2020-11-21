import React, { createContext, useState } from 'react';
import { SinglePayload } from '../common/models/SinglePayload';

interface UsernamesSelectedContextProps {
  usernamesSelected: SinglePayload[];
  setUsernamesSelected: Function;
}

export const UsernamesSelectedContext = createContext<UsernamesSelectedContextProps>({
  usernamesSelected: [],
  setUsernamesSelected: () => {},
});

export const UsernamesSelectedContextProvider = (props: any) => {
  const [usernamesSelected, setUsernamesSelected] = useState<SinglePayload[]>([]);
  return (
    <UsernamesSelectedContext.Provider value={{ usernamesSelected, setUsernamesSelected }}>
      {props.children}
    </UsernamesSelectedContext.Provider>
  );
};
