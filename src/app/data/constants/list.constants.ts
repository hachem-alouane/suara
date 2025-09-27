import { environment } from '../../../environments/environment';

export type severity =
  | 'success'
  | 'secondary'
  | 'info'
  | 'warn'
  | 'danger'
  | 'contrast'
  | undefined;
export const ListOfColorsEtat: Record<string, severity> = {
  NORMALE: 'success',
  URGENTE: 'info',
  TRES_URGENTE: 'danger',
  NOUVEAU: 'info',
  ACCEPTEE: 'success',
  REFUSEE: 'danger',
  COMPLIMENT_INFORMATION: 'secondary',
  TRAITE: 'info',
  Default: 'danger',
};

export const ListOfValueEtat: Record<string, string> = {
  NORMALE: 'NORMAL',
  URGENTE: 'URGENT',
  TRES_URGENTE: 'VERY_URGENT',
  NOUVEAU: 'NEW',
  ACCEPTEE: 'ACCEPTED',
  REFUSEE: 'REFUSED',
  COMPLIMENT_INFORMATION: 'COMPLEMENT_INFORMATION',
  TRAITE: 'PROCESSED',
  SORTANT: 'SORTANT',
  Default: 'VERY_URGENT',
};
export const ListOfColorsRegistryRequest: Record<string, severity> = {
  NORMALE: 'success',
  URGENTE: 'info',
  TRES_URGENTE: 'danger',
  Default: 'danger',
};

export const ListOfValueRegistryRequest: Record<string, string> = {
  NORMALE: 'NORMAL',
  URGENTE: 'URGENT',
  TRES_URGENTE: 'VERY_URGENT',
  Default: 'VERY_URGENT',
};

export const ListOfColorsOrganization: Record<string, severity> = {
  ACTIVE: 'success',
  BLOCKED: 'danger',
  Default: 'success',
};
export const ListOfValueOrganization: Record<string, string> = {
  ACTIVE: 'ACTIVEE',
  BLOCKED: 'BLOCKEDD',
  Default: 'ACTIVEE',
};

export const ListOfImages = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/jpg',
  'image/jfif',
];

export const ListOfSvgs = ['image/svg+xml', 'image/svg'];
export const ListOfTiff = ['image/tiff', 'image/tif'];
export const ListOfDocuments = [
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
];
export const ListOfPdf = ['application/pdf'];
export const ListOfCsv = ['text/csv', 'application/csv', 'application/x-csv'];
export const ListOfMusic = [
  'audio/wav',
  'audio/mpeg',
  'audio/mp3',
  'audio/ogg',
  'audio/flac',
];
export const ListOfVideos = [
  'video/mp4',
  'video/avi',
  'video/quicktime',
  'video/x-ms-wmv',
  'video/x-matroska',
];
export const ListOfArchive = [
  'application/x-compressed',
  'application/x-tar',
  'application/x-zip-compressed',
];
export const ListOfHostUrls: Record<string, string> = {
  SEREVER_AUTH_V2: environment.SEREVER_AUTH_V2,
  DEFAULT: environment.SEREVER_AUTH_V2,
};
export const ListOfColorsOrganizations: Record<string, severity> = {
  ACTIVE: 'success',
  DISABLED: 'danger',
  Default: 'success',
};
export const ListOfValueOrganizations: Record<string, string> = {
  ACTIVE: 'ACTIVE',
  DISABLED: 'INACTIVE',
  Default: 'ACTIVE',
};
export const ListOfEtatMessage: Record<string, string> = {
  DISTRIBUE: 'DISTRIBUE',
  REJETE: 'REFUSED',
  ARCHIVE: 'ARCHIVEE',
  EN_ATTENTE: 'ENTRANT',
  ACCEPTE: 'ACCEPTED',
  EN_COURS: 'IN_PROGRESS',
  COMPLIMENT_INFORMATION: 'ADDITIONAL_INFORMATION',
  ACCEPTE_SORTANT: 'SORTANT',
  INCOMING: 'ENTRANT',
  Default: 'ENTRANT',
};
export const ListOfEtatMessageaaa: Record<string, string> = {
  NOUVEAU: 'NEW',
  COMPLIMENT_INFORMATION: 'ADDITIONAL_INFORMATION',
  SORTANT: 'SORTANT',
  ACCEPTEE: 'ACCEPTED',
  REFUSEE: 'REFUSED',
  Default: 'NEW',
};
export const ListOfModules: Record<string, string> = {
  USER: 'USER',
  ORGANIZATION: 'ORGANIZATION',
  SUB_ORGANIZATION: 'SUB_ORGANIZATION',
  COUNTRY: 'COUNTRY',
  MEMBER: 'MEMBER',
  GROUP: 'GROUP',
  MODEL: 'MODEL',
  TRASH: 'TRASH',
  WRITE_MESSAGE: 'WRITE_MESSAGE',
  REGISTRY_OFFICE_REQUESTS: 'REGISTRY_REQUESTS',
  INCOMING_CORRESPONDENCE: 'INCOMING_CORRESPONDENCE',
  OUTGOING_CORRESPONDENCE: 'OUTGOING_CORRESPONDENCE',
  CORRESPONDENCE_FOLLOW_UP: 'CORRESPONDENCE_FOLLOW_UP',
  ARCHIVED_CORRESPONDENCE: 'ARCHIVED_CORRESPONDENCE',
  DISTRIBUTED_CORRESPONDENCE: 'DISTRIBUTED_CORRESPONDENCE',
  ACCEPTED_MAIL_LIST: 'ACCEPTED_MAIL_LIST',
  STATISTICS: 'STATISTICS',
  Default: 'ENTRANT',
};
export const ListOfPermissions: Record<string, string> = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  VIEW: 'VIEW',
  DISTRIBUTE: 'DISTRIBUTION',
  DELETE: 'DELETE',
  DISABLE: 'BLOCK',
  ENABLE: 'ACTIVATE',
  BLOCK: 'BLOCK',
  UNBLOCK: 'ACTIVATE',
  SEND: 'SEND',
  DECISION: 'DECISION',
  ARCHIVE: 'TRANSFER',
  RESTORE: 'RESTORE',
  REQUEST: 'ADD_REQUEST',
  Default: 'VIEW',
};
export const ListOfModulesTags: Record<string, string> = {
  USER: 'bg-blue-500',
  ORGANIZATION: 'bg-green-700',
  SUB_ORGANIZATION: 'bg-purple-500',
  COUNTRY: 'bg-orange-500',
  MEMBER: 'bg-indigo-500',
  GROUP: 'bg-teal-500',
  MODEL: 'bg-pink-500',
  TRASH: 'bg-red-500',
  WRITE_MESSAGE: 'bg-cyan-500',
  REGISTRY_OFFICE_REQUESTS: 'bg-indigo-500',
  INCOMING_CORRESPONDENCE: 'bg-green-400',
  OUTGOING_CORRESPONDENCE: 'bg-yellow-500',
  CORRESPONDENCE_FOLLOW_UP: 'bg-blue-500',
  ARCHIVED_CORRESPONDENCE: 'bg-red-400',
  DISTRIBUTED_CORRESPONDENCE: 'bg-cyan-500',
  ACCEPTED_MAIL_LIST: 'bg-pink-500',
  STATISTICS: 'bg-gray-500',
  Default: 'bg-blue-500',
};
