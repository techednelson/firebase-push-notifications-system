import { Notification } from './models/notification';
import { Subscriber } from './models/subscriber';
import { StepperStatus } from './enums';

export interface HeadCell {
  id: keyof Notification | keyof Subscriber;
  label: string;
}

export interface StepperMessage {
  status: StepperStatus;
  step: number;
  payload: { title: string, body: string }
}

