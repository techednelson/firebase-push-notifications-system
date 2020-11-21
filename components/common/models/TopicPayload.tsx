import { NotificationType } from '../../../server/common/enums';

export class TopicPayload {
  title = '';
  body = '';
  type = NotificationType.TOPIC;
  topic = '';
  username = '';
}
