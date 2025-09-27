import { inject, Injectable, Type } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { map, Observable, take } from 'rxjs';
import { BreackpointService } from '../breakpoints/breakpoint.service';
import { MessageService } from 'primeng/api';
import { LocaleService } from '../../../../data/services/config/local.service';

@Injectable()
export class DialogUtilsService {
  private readonly dialogService = inject(DialogService);
  private readonly breakpointService = inject(BreackpointService);
  private readonly messageService = inject(MessageService);
  private readonly localeService = inject(LocaleService);

  openDialog<T>(
    component: Type<T>,
    header: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any,
    focusOnShow = true,
    widthDialogue: 'w-5' | 'w-7' | 'w-8' | 'w-10' | 'w-12' = 'w-5'
  ): Observable<DynamicDialogRef> {
    return this.breakpointService.breakpointIsMobile$.pipe(
      take(1),
      map((isMobile) =>
        this.dialogService.open(component, {
          header,
          styleClass:
            'xl:' + widthDialogue + ' lg:w-6 md:w-8 custom-dialogue-popup',
          contentStyle: {
            'padding-bottom': '50px',
            'margin-bottom': '5rem',
          },
          modal: true,
          dismissableMask: true,
          closable: true,
          baseZIndex: 10000,
          maximizable: !isMobile,
          resizable: true,
          data: options,
          focusOnShow,
        })
      )
    );
  }
  showSuccessMessage(detail: string) {
    this.messageService.clear();
    return this.messageService.add({
      severity: 'success',
      summary: this.localeService.translate('SUCCESS'),
      detail,
      life: 3000,
    });
  }

  showErrorMessage(detail?: string) {
    this.messageService.clear();
    return this.messageService.add({
      severity: 'error',
      summary: this.localeService.translate('ERROR'),
      detail: detail
        ? this.localeService.translate(detail)
        : this.localeService.translate('ERROR'),
      life: 3000,
    });
  }
}
