/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { ICardHome } from '../../core/models/card-home.interface';
import { LocaleService } from '../../data/services/config/local.service';
import { CardHomeComponent } from '../../shared/components/card-home/card-home.component';
import { UserAuthService } from '../../data/services/auth/user-auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Role } from '../../core/enums/role.enum';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslateModule, CardHomeComponent, SvgIconComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly localeService = inject(LocaleService);
  private readonly userAuthService = inject(UserAuthService);
  private readonly destroyRef = inject(DestroyRef);
  listOfCardsHome: ICardHome[] = [
    {
      title: this.localeService.translate('BUSINESS_ADMINISTRATION'),
      img: 'assets/svgs/business-administration.svg',
    },
    {
      title: this.localeService.translate('PROJECTS'),
      img: 'assets/svgs/projects.svg',
    },
    {
      title: this.localeService.translate('SYSTEM_MANAGEMENT'),
      img: 'assets/svgs/system-management.svg',
    },
    {
      title: this.localeService.translate('ARCHIVE'),
      img: 'assets/svgs/archive.svg',
    },
  ];
  ngOnInit(): void {
    this.listenToCurrentUser();
  }

  private listenToCurrentUser() {
    this.userAuthService.currentUser
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        if (user) {
          if (user?.role?.name === Role.ADMIN) {
            const hasModuleIncomingCorrespondance = user.modules.some(
              (m: any) => m.name === 'INCOMING_CORRESPONDENCE'
            );
            this.listOfCardsHome.unshift({
              title: this.localeService.translate('REGISTRY_OFFICE'),
              img: 'assets/svgs/register-office.svg',
              link: hasModuleIncomingCorrespondance
                ? '/incoming-correspondence'
                : '/dashboard',
            });
          } else if (user?.role?.name === Role.EMPLOYER) {
            const hasModuleDistributedCorrespondance = user.modules.some(
              (m: any) => m.name === 'DISTRIBUTED_CORRESPONDENCE'
            );
            this.listOfCardsHome.unshift({
              title: this.localeService.translate('REGISTRY_OFFICE'),
              img: 'assets/svgs/register-office.svg',
              link: hasModuleDistributedCorrespondance
                ? '/distributed-correspondence'
                : '/dashboard',
            });
          } else {
            this.listOfCardsHome.unshift({
              title: this.localeService.translate('REGISTRY_OFFICE'),
              img: 'assets/svgs/register-office.svg',
              link: '/incoming-correspondence',
            });
          }
        }
      });
  }
}
