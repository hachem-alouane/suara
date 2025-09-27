import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { UserAuthService } from '../../../data/services/auth/user-auth.service';
import { DirectionService } from '../../../data/services/config/direction.service';
import { Language } from '../../enums/language.enum';

@Component({
  selector: 'app-layout-auth',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './layout-auth.component.html',
  styleUrl: './layout-auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutAuthComponent implements OnInit {
  private readonly userAuthService = inject(UserAuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly directionService = inject(DirectionService);
  ngOnInit(): void {
    this.setUpLanguage();
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
