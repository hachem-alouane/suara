import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { DividerModule } from 'primeng/divider';
import { StyleClass } from 'primeng/styleclass';
import { filter, Observable } from 'rxjs';
import { TokenService } from '../../../../../data/services/auth/token.service';
import { UserAuthService } from '../../../../../data/services/auth/user-auth.service';
import { SidebarService } from '../../../../../data/services/config/sidebar.service';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';
import { LinkButtonComponent } from '../../../../../shared/ui/link-button/link-button.component';
import { Role } from '../../../../enums/role.enum';
import { IUser } from '../../../../models/user.interface';
import { HasModuleDirective } from '../../../../../shared/directives/has-module.directive';
import { HasAnyModuleDirective } from '../../../../../shared/directives/has-list-module.directive';

@Component({
  selector: 'app-sidebar-content',
  standalone: true,
  imports: [
    LinkButtonComponent,
    ButtonComponent,
    StyleClass,
    TranslateModule,
    RouterLinkActive,
    RouterLink,
    SvgIconComponent,
    AsyncPipe,
    DividerModule,
    NgClass,
    HasModuleDirective,
    HasAnyModuleDirective,
  ],
  templateUrl: './sidebar-content.component.html',
  styleUrl: './sidebar-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarContentComponent implements OnInit {
  private readonly userAuthService = inject(UserAuthService);
  private readonly tokenService = inject(TokenService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  currentUser$ = new Observable<IUser | null>();
  readonly role = Role;
  niv1Open = false;
  niv2Open = false;
  readonly niv1Routes = [
    '/incoming-correspondence',
    '/archived-correspondence',
    '/distributed-correspondence',
    '/outgoing-correspondence',
    '/hist',
    '/write-message',
    '/registry-request',
    '/accepted-mail-list',
    '/correspondence-follow-up',
  ];

  readonly niv2Routes = [
    '/users',
    '/courrierpapier',
    '/member',
    '/group',
    '/recycle-bin',
    '/mail-template',
  ];

  ngOnInit(): void {
    this.listenToCurrentUser();
    this.listenToActiveRoute();
    this.updateRouteStates();
  }
  private listenToActiveRoute() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((data: NavigationEnd) => {
        this.updateRouteStates();
      });
  }
  updateRouteStates() {
    this.niv1Open = this.isRouteActive(this.niv1Routes);
    this.niv2Open = this.isRouteActive(this.niv2Routes);
    this.cdr.markForCheck();
  }
  toggleNiv1(): void {
    this.niv1Open = !this.niv1Open;
    this.niv2Open = false; // close other levels if needed
    this.cdr.markForCheck();
  }
  toggleNiv2(): void {
    this.niv2Open = !this.niv2Open;
    this.niv1Open = false; // close other levels if needed
    this.cdr.markForCheck();
  }

  private listenToCurrentUser() {
    this.currentUser$ = this.userAuthService.currentUser;
  }
  isRouteActive(paths: string[]): boolean {
    return paths.some((path) => this.router.url.includes(path));
  }
  readonly sidebarService = inject(SidebarService);
  logout() {
    this.tokenService.logout();
    this.router.navigate(['/auth/login']);
  }
}
