/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DestroyRef,
  Directive,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserAuthService } from '../../data/services/auth/user-auth.service';

@Directive({
  selector: '[appHasModule]',
  standalone: true,
})
export class HasModuleDirective {
  private viewContainer = inject(ViewContainerRef);
  private authService = inject(UserAuthService);
  private destroyRef = inject(DestroyRef);

  constructor(private templateRef: TemplateRef<any>) {}

  @Input() set appHasModule(moduleName: string) {
    this.authService.currentUser
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        if (user && user?.modules?.some((m: any) => m.name === moduleName)) {
          // show element
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          // hide element
          this.viewContainer.clear();
        }
      });
  }
}
