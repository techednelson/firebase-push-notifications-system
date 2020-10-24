import { NotificationType } from '../../../server/common/enums';

export class Payload {
  title: string;
  body: string;
  type: NotificationType;
  topic: string;
  username: string;
}
