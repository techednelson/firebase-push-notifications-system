import React, { createContext, useState } from 'react';

interface NextContextProps {
  searchWord: string;
  setSearchWord: Function;
}

export const NextContext = createContext<NextContextProps>({
  searchWord: '',
  setSearchWord: () => {}
});

export const NextContextProvider = (props: any) => {
  const [searchWord, setSearchWord] = useState<string>('');
  return (
    <NextContext.Provider value={{ searchWord, setSearchWord }}>
      {props.children}
    </NextContext.Provider>
  );
};
