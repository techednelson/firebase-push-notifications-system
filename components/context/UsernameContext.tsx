import React, { createContext, useState } from 'react';

interface UsernameContextProps {
  username: string;
  setUsername: Function;
}

export const UsernameContext = createContext<UsernameContextProps>({
  username: '',
  setUsername: () => {},
});

export const UsernameContextProvider = (props: any) => {
  const [username, setUsername] = useState<string>('');
  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {props.children}
    </UsernameContext.Provider>
  );
};
