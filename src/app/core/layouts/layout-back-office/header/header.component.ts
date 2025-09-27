/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { Popover } from 'primeng/popover';
import { Tooltip } from 'primeng/tooltip';
import { Observable } from 'rxjs';
import { TokenService } from '../../../../data/services/auth/token.service';
import { UserAuthService } from '../../../../data/services/auth/user-auth.service';
import { DirectionService } from '../../../../data/services/config/direction.service';
import { LocaleService } from '../../../../data/services/config/local.service';
import { SidebarService } from '../../../../data/services/config/sidebar.service';
import { SseService } from '../../../../data/services/sse.service';
import { NotifiCountPipe } from '../../../../shared/pipes/notif-count.pipe';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { LinkButtonComponent } from '../../../../shared/ui/link-button/link-button.component';
import { Language } from '../../../enums/language.enum';
import { IUser } from '../../../models/user.interface';
import { INotification } from '../../../models/notification.interface';
import { ItemNotificationComponent } from '../../../../shared/components/item-notification/item-notification.component';
import { Divider } from 'primeng/divider';
import { ScrollerModule } from 'primeng/scroller';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MenubarModule,
    SvgIconComponent,
    AsyncPipe,
    ButtonComponent,
    Menu,
    TranslateModule,
    LinkButtonComponent,
    Tooltip,
    TruncatePipe,
    OverlayBadgeModule,
    Popover,
    NotifiCountPipe,
    ItemNotificationComponent,
    Divider,
    ScrollerModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  sideBarDesktopIsOpen$ = new Observable<boolean>();
  readonly sidebarService = inject(SidebarService);
  readonly localeService = inject(LocaleService);
  readonly tokenService = inject(TokenService);
  readonly directionService = inject(DirectionService);
  readonly userAuthService = inject(UserAuthService);
  readonly changeDetectorRef = inject(ChangeDetectorRef);
  readonly messageService = inject(MessageService);
  readonly sseService = inject(SseService);
  readonly destroyRef = inject(DestroyRef);
  readonly router = inject(Router);
  items: MenuItem[] | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentLanguage: any = Language.AR;
  currentUser: IUser | null = null;
  notifications: INotification[] = [];
  countNotifications = 0;

  ngOnInit(): void {
    this.listenToSidebarDesktopChanges();
    this.setUpMenuLanguage();
    this.listenToCurrentUser();
  }

  private listenToCurrentUser() {
    this.userAuthService.currentUser
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.currentUser = user;
        this.listenToNotif(user?.email ?? '');
        this.getAllNotifications();
      });
  }
  getAllNotifications() {
    this.sseService.loadHistory().subscribe((data) => {
      this.notifications = data;
      this.countNotifications = this.notifications.filter(
        (n) => !n.read
      ).length;
      // this.countNotifications = this.notifications?.length;
      this.changeDetectorRef.markForCheck();
    });
  }
  markAllAsRead() {
    this.sseService.markAllAsRead().subscribe(() => {
      this.getAllNotifications();
    });
  }
  private listenToNotif(email: string) {
    this.sseService
      .subscribeToNewEmail(email)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: any) => {
          this.sseService
            .getNotificationById(data)
            .subscribe((fullNotif: any) => {
              this.sseService.changeCurrentNotif(fullNotif);
              this.messageService.add({
                severity: 'info',
                summary: fullNotif.title,
                detail: fullNotif.message,
                life: 5000,
              });
            });
          this.getAllNotifications();
        },
        error: (_) => {
          console.error('Error receiving email notifications:');
        },
      });
  }

  logout() {
    this.tokenService.logout();
    this.router.navigate(['/auth/login']);
  }
  resetMenuItems() {
    this.items = [];
    this.setUpMenuLanguage();
  }
  private setUpMenuLanguage() {
    this.items = [
      {
        label: this.localeService.translate('ARABIC'),
        styleClass: 'font-semibold text-sm',
        command: () => {
          this.changeLanguage(Language.AR);
        },
      },
      {
        label: this.localeService.translate('FRENCH'),
        styleClass: 'font-semibold text-sm',
        command: () => {
          this.changeLanguage(Language.FR);
        },
      },
      {
        label: this.localeService.translate('ENGLISH'),
        styleClass: 'font-semibold text-sm',
        command: () => {
          this.changeLanguage(Language.EN);
        },
      },
    ];
  }
  private listenToSidebarDesktopChanges() {
    this.sideBarDesktopIsOpen$ = this.sidebarService.sideBarDesktopIsOpen;
  }
  private changeLanguage(language: Language) {
    if (this.currentLanguage === Language.AR)
      this.directionService.toggleIsRtl();
    this.localeService.initLocale(language);
    this.currentLanguage = language;
    this.userAuthService.changeCurrentLanguage(language);
    this.tokenService.setLanguage(language);
    location.reload();
  }
}
