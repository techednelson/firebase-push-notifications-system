import { NotificationType } from '../enums';

export class NotificationResponseDto {
  id: number;
  title: string;
  body: string;
  type: NotificationType;
  topic: string;
  user: string;
  createdAt: string;
}
