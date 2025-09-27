export enum ActionMenu {
  EDIT = 'edit',
  DELETE = 'delete',
  VIEW = 'view',
  ENABLE = 'enable',
  BLOCK = 'block',
  SEND = 'send',
  SEND_DELIBERATION = 'send-deliberation',
  TRANSFER = 'transfer',
  DECISION = 'decision',
  DISTRIBUTION = 'distribution',
  ADD_REQUEST = 'add-request',
  PROCESSING_REQUEST = 'processing-request',
  DEACTIVATE = 'deactivate',
  SEND_EMAIL = 'send-email',
  RESTORE = 'restore',
  PERMISSION = 'permission',
  CORRESPONDENCE_LOG_TRACKING = 'correspondence-log-tracking',
}

export type ActionMenuType =
  | 'edit'
  | 'delete'
  | 'view'
  | 'enable'
  | 'block'
  | 'send'
  | 'send-deliberation'
  | 'transfer'
  | 'decision'
  | 'distribution'
  | 'add-request'
  | 'deactivate'
  | 'processing-request'
  | 'send-email'
  | 'restore'
  | 'permission'
  | 'correspondence-log-tracking';
