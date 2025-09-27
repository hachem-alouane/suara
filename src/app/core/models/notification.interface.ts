export interface INotification {
  id?: number;
  userEmail?: string;
  title?: string;
  message?: string;
  link?: string;
  channel?: string;
  status?: string;
  createdAt?: string; // ISO date string
  read?: boolean;
  readAt?: string; // ISO date string or null
}
