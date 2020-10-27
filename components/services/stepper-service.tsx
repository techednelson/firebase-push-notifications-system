import { BehaviorSubject } from 'rxjs';
import { StepperMessage } from '../common/interfaces';
import { StepperStatus } from '../common/enums';

const subject = new BehaviorSubject<StepperMessage>({
    status: StepperStatus.INITIAL,
    step: 0,
    payload: { title: '', body: '' }
});

export const stepperService = {
    sendMessage: (message: StepperMessage) => subject.next(message),
    clearMessages: () => subject.next({
        status: StepperStatus.INITIAL,
        step: 0,
        payload: { title: '', body: '' }
    }),
    getMessage: () => subject.asObservable()
};
