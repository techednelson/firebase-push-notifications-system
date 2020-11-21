import React, { createContext, useState } from 'react';
import { NotificationType } from '../common/enums';

interface TargetContextProps {
  target: NotificationType;
  setTarget: Function;
}

export const TargetContext = createContext<TargetContextProps>({
  target: NotificationType.TOPIC,
  setTarget: () => {},
});

export const TargetContextProvider = (props: any) => {
  const [target, setTarget] = useState<NotificationType>(NotificationType.TOPIC);
  return (
    <TargetContext.Provider value={{ target, setTarget }}>
      {props.children}
    </TargetContext.Provider>
  );
};
