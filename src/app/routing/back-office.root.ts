import { Routes } from '@angular/router';
import { initUserGuard } from '../core/guards/init-user.guard';
import { permissionGuard } from '../core/guards/permission.guard';
export const BACK_OFFICE_ROOT: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '',
    canActivate: [initUserGuard],
    loadComponent: () =>
      import(
        '../core/layouts/layout-back-office/layout-back-office/layout-back-office.component'
      ).then((m) => m.LayoutBackOfficeComponent),
    children: [
      {
        path: 'dashboard',
        title: 'DASHBOARD',
        loadComponent: () =>
          import('../back-office/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
      {
        path: 'statistics',
        title: 'STATISTICS',
        canActivate: [permissionGuard],
        data: { module: 'STATISTICS' },
        loadComponent: () =>
          import('../back-office/statistics/statistics.component').then(
            (m) => m.StatisticsComponent
          ),
      },
      {
        path: 'accepted-mail-list',
        title: 'ACCEPTED_MAIL_LIST',
        canActivate: [permissionGuard],
        data: { module: 'ACCEPTED_MAIL_LIST' },
        loadComponent: () =>
          import(
            '../back-office/accepted-mail-list/accepted-mail-list.component'
          ).then((m) => m.AcceptedMailListComponent),
      },
      {
        path: 'incoming-correspondence',
        title: 'INCOMING_CORRESPONDENCE',
        canActivate: [permissionGuard],
        data: { module: 'INCOMING_CORRESPONDENCE' },
        loadComponent: () =>
          import(
            '../back-office/incoming-correspondence/incoming-correspondence.component'
          ).then((m) => m.IncomingCorrespondenceComponent),
      },
      {
        path: 'archived-correspondence',
        title: 'ARCHIVED_CORRESPONDENCE',
        canActivate: [permissionGuard],
        data: { module: 'ARCHIVED_CORRESPONDENCE' },
        loadComponent: () =>
          import(
            '../back-office/archived-correspondence/archived-correspondence.component'
          ).then((m) => m.ArchivedCorrespondenceComponent),
      },
      {
        path: 'distributed-correspondence',
        title: 'DISTRIBUTED_CORRESPONDENCE',
        canActivate: [permissionGuard],
        data: { module: 'DISTRIBUTED_CORRESPONDENCE' },
        loadComponent: () =>
          import(
            '../back-office/distributed-correspondence/distributed-correspondence.component'
          ).then((m) => m.DistributedCorrespondenceComponent),
      },
      {
        path: 'outgoing-correspondence',
        title: 'OUTGOING_CORRESPONDENCE',
        canActivate: [permissionGuard],
        data: { module: 'OUTGOING_CORRESPONDENCE' },
        loadComponent: () =>
          import(
            '../back-office/outgoing-correspondence/outgoing-correspondence.component'
          ).then((m) => m.OutgoingCorrespondenceComponent),
      },
      {
        path: 'write-message',
        title: 'WRITE_MESSAGE',
        canActivate: [permissionGuard],
        data: { module: 'WRITE_MESSAGE' },
        loadComponent: () =>
          import('../back-office/write-message/write-message.component').then(
            (m) => m.WriteMessageComponent
          ),
      },
      {
        path: 'write-message-admin',
        title: 'WRITE_MESSAGE',
        canActivate: [permissionGuard],
        data: { module: 'WRITE_MESSAGE' },
        loadComponent: () =>
          import(
            '../back-office/write-message-admin/write-message-admin.component'
          ).then((m) => m.WriteMessageAdminComponent),
      },
      {
        path: 'registry-request',
        title: 'REGISTRY_REQUESTS',
        canActivate: [permissionGuard],
        data: { module: 'REGISTRY_OFFICE_REQUESTS' },
        loadComponent: () =>
          import(
            '../back-office/registry-request/registry-request.component'
          ).then((m) => m.RegistryRequestComponent),
      },
      {
        path: 'member',
        title: 'MEMBER',
        canActivate: [permissionGuard],
        data: { module: 'MEMBER' },
        loadComponent: () =>
          import('../back-office/member/member.component').then(
            (m) => m.MemberComponent
          ),
      },
      {
        path: 'group',
        title: 'GROUP',
        canActivate: [permissionGuard],
        data: { module: 'GROUP' },
        loadComponent: () =>
          import('../back-office/group-member/group-member.component').then(
            (m) => m.GroupMemberComponent
          ),
      },
      {
        path: 'demande/:id',
        title: 'INCOMING_MAIL',

        loadComponent: () =>
          import('../back-office/notification/demande/demande.component').then(
            (m) => m.DemandeComponent
          ),
      },
      {
        path: 'courrier-entrant/:id',
        title: 'INCOMING_MAIL',

        loadComponent: () =>
          import(
            '../back-office/incoming-correspondence/courrier-entrant/courrier-entrant.component'
          ).then((m) => m.CourrierEntrantComponent),
      },
      {
        path: 'courrier-original/:id',
        title: 'INCOMING_MAIL',

        loadComponent: () =>
          import(
            '../back-office/archived-correspondence/courrier-original/courrier-original.component'
          ).then((m) => m.CourrierOriginalComponent),
      },
      {
        path: 'forwarded-mail/:id',
        title: 'FORWARDED_MAIL',

        loadComponent: () =>
          import('../back-office/forwarded-mail/forwarded-mail.component').then(
            (m) => m.ForwardedMailComponent
          ),
      },
      {
        path: 'users',
        title: 'USERS',
        canActivate: [permissionGuard],
        data: { module: 'USER' },
        loadComponent: () =>
          import('../back-office/users/users.component').then(
            (m) => m.UsersComponent
          ),
      },
      {
        path: 'mail-template',
        title: 'MAIL_TEMPLATE',
        canActivate: [permissionGuard],
        data: { module: 'MODEL' },
        loadComponent: () =>
          import('../back-office/mail-template/mail-template.component').then(
            (m) => m.MailTemplateComponent
          ),
      },
      {
        path: 'recycle-bin',
        title: 'TRASH',
        canActivate: [permissionGuard],
        data: { module: 'TRASH' },
        loadComponent: () =>
          import('../back-office/recycle-bin/recycle-bin.component').then(
            (m) => m.RecycleBinComponent
          ),
      },
      {
        path: 'correspondence-follow-up',
        title: 'CORRESPONDENCE_FOLLOW_UP',
        canActivate: [permissionGuard],
        data: { module: 'CORRESPONDENCE_FOLLOW_UP' },
        loadComponent: () =>
          import(
            '../back-office/correspondence-follow-up/correspondence-follow-up.component'
          ).then((m) => m.CorrespondenceFollowUpComponent),
      },
    ],
  },
];
