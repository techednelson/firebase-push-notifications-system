export enum NotificationType {
  TOPIC = 'TOPIC',
  MULTICAST = 'MULTICAST',
  SINGLE = 'SINGLE',
}

export enum NotificationStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum StepperStatus {
  INITIAL = 'INITIAL',
  VALIDATING = 'VALIDATING',
  VALID = 'VALID',
  INVALID = 'INVALID',
}

export enum LocalStorage {
  FCM_TOKEN = 'FCM_TOKEN',
  FCM_REFRESH_TOKEN = 'FCM_REFRESH_TOKEN',
  FCM_USERNAME = 'FCM_USERNAME',
}
