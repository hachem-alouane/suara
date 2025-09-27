import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs';
import { UserAuthService } from '../../../../data/services/auth/user-auth.service';
import { DirectionService } from '../../../../data/services/config/direction.service';
import { SidebarService } from '../../../../data/services/config/sidebar.service';
import { Language } from '../../../enums/language.enum';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout-back-office',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    RouterOutlet,
    AsyncPipe,
    ToastModule,
    ConfirmDialogModule,
  ],
  templateUrl: './layout-back-office.component.html',
  styleUrl: './layout-back-office.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService, ConfirmationService],
})
export class LayoutBackOfficeComponent implements OnInit {
  sideBarDesktopIsOpen$ = new Observable<boolean>();

  readonly sidebarService = inject(SidebarService);
  private readonly userAuthService = inject(UserAuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly directionService = inject(DirectionService);
  ngOnInit(): void {
    this.listenToSidebarDesktopChanges();
    this.setUpLanguage();
  }

  private listenToSidebarDesktopChanges() {
    this.sideBarDesktopIsOpen$ = this.sidebarService.sideBarDesktopIsOpen;
  }
  private setUpLanguage() {
    this.userAuthService.currentLanguage
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((currentAdminData) => {
        this.setDefaultLanguage(currentAdminData === Language.AR);
      });
  }

  private setDefaultLanguage(isRtl: boolean) {
    this.directionService.changeIsRtl(isRtl);
  }
}
