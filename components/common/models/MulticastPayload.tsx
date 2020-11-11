import { Payload } from './Payload';

export class MulticastPayload {
  subscribers: Payload[];
  tokens: string[];
}
