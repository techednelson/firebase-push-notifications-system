import { NotificationType } from '../../../server/common/enums';

export class SinglePayload {
  title = '';
  body = '';
  type = NotificationType.SINGLE;
  topic = '';
  username = '';
  token = '';
}
