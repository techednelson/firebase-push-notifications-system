import React, { createContext, useState } from 'react';

interface SearchWordContextProps {
  searchWord: string;
  setSearchWord: Function;
}

export const SearchWordContext = createContext<SearchWordContextProps>({
  searchWord: '',
  setSearchWord: () => {},
});

export const SearchWordContextProvider = (props: any) => {
  const [searchWord, setSearchWord] = useState<string>('');
  return (
    <SearchWordContext.Provider value={{ searchWord, setSearchWord }}>
      {props.children}
    </SearchWordContext.Provider>
  );
};
