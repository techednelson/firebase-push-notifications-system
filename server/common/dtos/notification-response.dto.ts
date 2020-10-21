import { NotificationStatus, NotificationType } from '../enums';

export class NotificationResponseDto {
  id: number;
  title: string;
  body: string;
  type: NotificationType;
  topic: string;
  username: string;
  createdOn: string;
  status: NotificationStatus;
}
