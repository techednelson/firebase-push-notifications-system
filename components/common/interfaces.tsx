import { Notification } from './models/Notification';
import { Subscriber } from './models/Subscriber';
import { NotificationType, StepperStatus } from './enums';

export interface HeadCell {
  id: keyof Notification | keyof Subscriber;
  label: string;
}

export interface Username {
  username: string;
  token: string;
}

export interface StepperEvent {
  status: StepperStatus;
  activeStep: number;
  type?: NotificationType;
}
