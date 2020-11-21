import { SinglePayload } from './SinglePayload';

export class MulticastPayload {
  subscribers: SinglePayload[];
  tokens: string[];
}
