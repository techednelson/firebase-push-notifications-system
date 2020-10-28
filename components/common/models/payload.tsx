import { NotificationType } from '../../../server/common/enums';

export class Payload {
  title = '';
  body = '';
  type = NotificationType.TOPIC;
  topic = '';
  username = '';
  token = '';
}
