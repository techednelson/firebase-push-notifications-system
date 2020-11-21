import React, { createContext, useState } from 'react';

interface UsernamesCheckedContextProps {
  usernamesChecked: number[];
  setUsernamesChecked: Function;
}

export const UsernamesCheckedContext = createContext<UsernamesCheckedContextProps>({
  usernamesChecked: [],
  setUsernamesChecked: () => {},
});

export const UsernamesCheckedContextProvider = (props: any) => {
  const [usernamesChecked, setUsernamesChecked] = useState<number[]>([]);
  return (
    <UsernamesCheckedContext.Provider value={{ usernamesChecked, setUsernamesChecked }}>
      {props.children}
    </UsernamesCheckedContext.Provider>
  );
};
