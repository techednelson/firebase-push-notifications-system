import { Payload } from './payload';

export class MulticastPayload {
  subscribers: Payload[];
  tokens: string[];
}
