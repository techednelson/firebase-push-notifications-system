import { Notification } from './models/notification';
import { Subscriber } from './models/subscriber';

export interface HeadCell {
  id: keyof Notification | keyof Subscriber;
  label: string;
}


