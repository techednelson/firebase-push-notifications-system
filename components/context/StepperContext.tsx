import React, { createContext, useState } from 'react';
import { StepperEvent } from '../common/interfaces';
import { StepperStatus } from '../common/enums';

const INITIAL_STATE = {
  status: StepperStatus.INITIAL,
  activeStep: 0,
};

interface StepperContextProps {
  stepper: StepperEvent;
  setStepper: Function;
}

export const StepperContext = createContext<StepperContextProps>({
  stepper: INITIAL_STATE, setStepper: () => {},
});

export const StepperContextProvider = (props: any) => {
  const [stepper, setStepper] = useState<StepperEvent>(INITIAL_STATE);
  return (<StepperContext.Provider value={{ stepper, setStepper }}>
      {props.children}
    </StepperContext.Provider>);
};
